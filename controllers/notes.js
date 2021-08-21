const notesRouter = require('express').Router()
const Note = require('../models/note')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

notesRouter.post('/', async (req, res) => {


  let token = null 
  let decodedToken = {}

  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer')){
    token = authorization.substring(7)
  } else {
    return res.status(401).json({ error: 'token missing '})
  }

  try {
    decodedToken = jwt.verify(token, process.env.SECRET)
  }catch(err) {
    console.log(err)
  }

  if (!token || !decodedToken.id){
    return res.status(401).json({ error: 'token missing '})
  }

  const { id: userId } = decodedToken
  const user = await User.findById(userId)

  const newNote = new Note({
    content: req.body.content,
    date: new Date(),
    important: req.body.important,
    user: user._id
  })

  try {
    const savedNote = await newNote.save()
    res.json(savedNote)
  } catch( error ) {
    res.json('error')
  }


  
})




notesRouter.get('/', (req, res) => {

  Note.find({}).then(result => {
    res.json(result).status(201).end()
  })
})

notesRouter.get('/solo/:id', (req, res) => {
                                      
  Note.findById(req.params.id)
    .then(note => {
      res.json(note)
    }).catch(error => {
      res.status(404).end()
    })
})

notesRouter.delete('/solo/:id', (req, res) => {

  Note.findByIdAndDelete(req.params.id)
    .then(result => {
      res.status(204).end()
    })
})

notesRouter.put('/solo/:id', (req, res) => {

  const note = {
    content: req.body.content,
    important: req.body.important
  }

  Note.findByIdAndUpdate(req.params.id, note, { new: true })
    .then(newNote => {
      res.json(newNote).status(201).end()
    })
    
})

module.exports = notesRouter