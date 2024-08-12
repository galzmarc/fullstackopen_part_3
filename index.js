let contacts = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]


const cors = require('cors')
const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', function getBody (req) {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get('/api/persons', (req, res) => {
  res.json(contacts)
})

app.get('/info', (req, res) => {
  let date = new Date();
  res.send(`<p>Phonebook has info for ${contacts.length} people</p>` + `<p>${date.toString()}</p>`)
})

app.get('/api/persons/:id', (req, res) => {
  let id = req.params.id;
  let contact = contacts.find(c => c.id === id)
  if (contact) {
    res.json(contact)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  contacts = contacts.filter(c => c.id !== id);
  res.status(204).end();
})

const generateId = () => {
  return Math.floor(Math.random() * 1000000000)
}

app.post('/api/persons', (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json(
      { error: 'name or number are missing' }
    )
  }

  if (contacts.find(c => c.name === body.name)) {
    return res.status(400).json(
      { error: 'name must be unique' }
    )
  }

  const newContact = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  contacts = contacts.concat(newContact)
  res.json(newContact)
})

const PORT = process.env.port || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})