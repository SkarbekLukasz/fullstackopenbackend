const express = require("express");
const app = express();

app.use(express.json());

let data = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(data);
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
  const id = generateId();
  payload.id = id;
  data = data.concat(payload);
  response.json(payload);
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

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
