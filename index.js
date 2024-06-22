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

app.get("/api/persons", (request, response) => {
  Person.find({}).then((data) => {
    response.json(data);
  });
});

app.get("/info", (request, response) => {
  const phonebookSize = data.length;
  const timestamp = new Date().toString();
  const payload = `<p>Phonebook has info for ${phonebookSize} people</p><p>${timestamp}</p>`;
  response.send(payload);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const dataEntry = data.find((entry) => entry.id === id);
  if (!dataEntry) {
    response.status(404).end();
  } else {
    response.json(dataEntry);
  }
});

const generateId = () => {
  return Math.floor(Math.random() * 10000 + 1);
};

app.post("/api/persons", (request, response) => {
  const payload = request.body;
  if (!payload.name || !payload.number) {
    response.status(400).json({ error: "Missing content" });
  } else if (data.some((entry) => entry.name === payload.name)) {
    response.status(400).json({ error: "Name must be unique" });
  } else {
    const id = generateId();
    payload.id = id;
    data = data.concat(payload);
    response.json(payload);
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const dataEntry = data.find((entry) => entry.id === id);
  if (!dataEntry) {
    response.status(404).end();
  } else {
    data = data.filter((entry) => entry.id !== id);
    response.status(204).end();
  }
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
