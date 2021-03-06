const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (req, res) => {
  const body = req.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.passwordHash, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash
  })

  const savedUser = await user.save()
    .then(user => {
      res.json(user)
    }).catch(error => {
      res.json({message: 'the username is already in use'})
    })
  
  
})

usersRouter.get('/', async (req, res) => {
  const users = await User.find({})
  res.json(users)
})

module.exports = usersRouter