require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 8081
const mongoose = require('mongoose')
const notesRouter = require('./controllers/notes')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

//Db connection
const uri = `mongodb+srv://juan123:${process.env.MONGODB_PASS}@cluster0.yzo48.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})
.then(() => {
  console.log('connected')
}).catch((error) => {
  console.log(error)
})

app.use(express.json())
app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.listen(port , () => console.log(`running on port ${port}`))