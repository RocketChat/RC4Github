const express = require('express')
const app = express()
const passport = require('passport')
const jwtStrategy = require('./config/passport-jwt-strategy')
const db = require('./config/mongoose')
const bodyParser = require('body-parser')

const port = process.env.PORT || 3030

app.use(bodyParser.json())
app.use(passport.initialize())

app.use('/', require('./routes'))

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})