require('dotenv').config()

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


const Person = require("./models/contact")

app.get('/api/persons', (req, res) => {
  Person.find({}).then(contacts => {
    res.json(contacts)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(err => next(err))
})

app.get('/info', (req, res) => {
  let date = new Date()
  Person.find({}).then(contacts => {
    res.send(`<p>Phonebook has info for ${contacts.length} people</p>` + `<p>${date.toString()}</p>`)
  })
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save()
    .then(savedContact => {
      res.json(savedContact)
    })
    .catch(err => next(err))
})


app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(err => next(err))
})

// Unknown endpoint middleware
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.message)

  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message })
  }

  next(err)
}

// handler of requests with result to errors
app.use(errorHandler)

const PORT = process.env.port || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})