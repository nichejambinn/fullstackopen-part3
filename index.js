const express = require('express')
const app = express()

app.use(express.json()) // express json-parser

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/info', (request, response) => {
  response.send(`
    <div>
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${new Date()}</p>
    </div>
  `)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

const generateId = () => {
  return Math.floor(Math.random() * 10000)
}

app.post('/api/persons', (request, response) => {
  const body = request.body
  const errorObj = {
    error: ""
  }

  // handle bad requests
  if (!body.name) {
    errorObj.error = "name missing"
  } else if (!body.number) {
    errorObj.error = "number missing"
  } else {
    const nameToAdd = body.name.trim()
    const person = persons.find(p => p.name.toLowerCase() === nameToAdd.toLowerCase())

    if (person) {
      errorObj.error = "name must be unique"
    }
  }

  if (errorObj.error != "") {
    return response.status(400).json(errorObj)
  }

  const person = {
    name: body.name.trim(),
    number: body.number.trim(),
    id: generateId()
  }

  persons = persons.concat(person)

  response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
