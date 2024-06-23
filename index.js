require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const Person = require("./db/mongocfg");
app.use(express.static("./dist"));
app.use(cors());
app.use(express.json());

morgan.token("payload", (req) => {
  return req.body && Object.keys(req.body).length
    ? JSON.stringify(req.body)
    : "";
});

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :payload"
  )
);

app.get("/api/persons", (request, response, next) => {
  Person.find({})
    .then((data) => {
      response.json(data);
    })
    .catch((error) => next(error));
});

app.get("/info", (request, response, next) => {
  Person.find({})
    .then((persons) => {
      const phonebookSize = persons.length;
      const timestamp = new Date().toString();
      const payload = `<p>Phonebook has info for ${phonebookSize} people</p><p>${timestamp}</p>`;
      response.send(payload);
    })
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
  const payload = request.body;
  if (!payload.name || !payload.number) {
    response.status(400).json({ error: "Missing content" });
  } else {
    const personToSave = new Person({
      name: payload.name,
      number: payload.number,
    });
    personToSave
      .save(personToSave)
      .then((savedPerson) => {
        response.json(savedPerson);
      })
      .catch((error) => next(error));
  }
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((resp) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const payload = request.body;
  if (!payload.name || !payload.number) {
    response.status(400).json({ error: "Missing content" });
  } else {
    const personToUpdate = {
      name: payload.name,
      number: payload.number,
    };
    Person.findByIdAndUpdate(request.params.id, personToUpdate, {
      new: true,
      runValidators: true,
    })
      .then((updatedPerson) => {
        response.json(updatedPerson);
      })
      .catch((error) => next(error));
  }
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandling = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "Malformed id" });
  } else if (error.name === "ValidationError") {
    return response.status(404).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandling);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
