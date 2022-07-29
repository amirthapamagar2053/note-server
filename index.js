const express = require("express");
const cors = require("cors");
require("dotenv").config();
// const { response } = require("express");
const App = express();
const Note = require("./models/note");

App.use(express.static("build"));

App.use(cors());
App.use(express.json());

App.get("/", (request, response) => {
  response.send("<h1> hello world </h1>");
});
App.get("/notes", (request, response) => {
  Note.find({}).then((x) => response.json(x));
  // response.send(notes);
});

// App.get("/notes/:id", (request, response) => {
//   const currentId = Number(request.params.id);
//   const thisNote = notes.find((x) => x.id === currentId);
//   if (thisNote) response.json(thisNote);
//   else
//     response.status(404).json({
//       error: 404,
//       message: `there is no note with id ${currentId}`,
//     });
// });
App.put("/notes/:id", (request, response, next) => {
  const body = request.body;

  const note = {
    content: body.content,
    important: body.important,
  };

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch((error) => next(error));
});
App.get("/notes/:id", (request, response) => {
  Note.findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      console.log(error);
      response.status(400).send({ error: "malformatted id" });
    });
});

App.delete("/notes/:id", (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

// App.delete("/notes/:id", (request, response) => {
//   const currentId = Number(request.params.id);
//   notes = notes.filter((x) => x.id !== currentId);

//   response.status(400).end();
// });

App.post("/notes/", (request, response) => {
  const body = request.body;

  if (body.content === undefined) {
    return response.status(400).json({ error: "content missing" });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  });

  note.save().then((savedNote) => {
    //savednote is the newly created noted from the note object
    response.json(savedNote);
  });
});

const PORT = process.env.PORT || "3001";

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

// this has to be the last loaded middleware.
App.use(errorHandler);

App.listen(PORT, () => {
  console.log("starting the server");
});
