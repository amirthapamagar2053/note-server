const express = require("express");
const cors = require("cors");
// const { response } = require("express");
const App = express();
App.use(express.static("build"));

App.use(cors());
App.use(express.json());
let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2022-05-30T17:30:31.098Z",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2022-05-30T18:39:34.091Z",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2022-05-30T19:20:14.298Z",
    important: true,
  },
];

App.get("/", (request, response) => {
  response.send("<h1> hello world </h1>");
});
App.get("/notes", (request, response) => {
  response.send(notes);
});

App.get("/notes/:id", (request, response) => {
  const currentId = Number(request.params.id);
  const thisNote = notes.find((x) => x.id === currentId);
  if (thisNote) response.json(thisNote);
  else
    response.status(404).json({
      error: 404,
      message: `there is no note with id ${currentId}`,
    });
});

App.delete("/notes/:id", (request, response) => {
  const currentId = Number(request.params.id);
  notes = notes.filter((x) => x.id !== currentId);

  response.status(400).end();
});

App.post("/notes/", (request, response) => {
  let message = request.body;
  console.log(message);
  message.id = notes.length + 1;
  notes.push(message);
  response.status(200).json(notes);
});

const PORT = process.env.PORT || "3001";

App.listen(PORT, () => {
  console.log("starting the server");
});
