const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function getRepositoryIndex(id){
  return repositories.findIndex(rep => rep.id === id);
}

function getRepository(id){
  return repositories.find(rep => rep.id === id);
}

function hasRepository(index, response){
  if (index > 0 ){
    const idRep = repositories[index].id;
    if ( getRepository(idRep) !== undefined){
      return true;
    }
  }
  return response.status(400).json({
    message: 'Repository not found, please try another ID.'
  })
}

app.get("/repositories", (request, response) => {
  const {title} = request.query;

  const results = title 
    ? repositories.filter( rep => rep.title.includes(title))
    : repositories;

  return response.status(200).json(results);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  
  if(title !== "" && url !== "" && techs !== []  ){
    const newRepository = {
      id: uuid(),
      title,
      url,
      techs,
      likes: 0
    }

    repositories.push(newRepository);

    return response.status(201).json(newRepository)
  } 
  else {
    return response.status(400).json({
      message: "Error: You must complete all fields. "
    })
  }
});

app.put("/repositories/:id", (request, response) => {
  const { id }               = request.params;
  const { title, url, techs} = request.body;
  
  const repositoryIndex = getRepositoryIndex(id);

  if (hasRepository(repositoryIndex, response)){
    const likes = repositories[repositoryIndex].likes;

    const alteredRepository = {
      id,
      title,
      url,
      techs,
      likes
    };

    repositories[repositoryIndex] = alteredRepository;

    return response.json(alteredRepository);
  }
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = getRepositoryIndex(id);

  if (hasRepository(repositoryIndex, response)){
    const title = repositories[repositoryIndex].title;

    repositories.splice(repositoryIndex, 1);

    return response.status(204).send()
  } 
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repository = getRepository(id);
  
  if (!repository){
    return response.status(400).send();
  }

  repository.likes += 1;
 
  return response.status(200).json(repository);
}); 


module.exports = app;
