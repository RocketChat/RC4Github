const express = require('express')
const app = express()
const passport = require('passport')
const jwtStrategy = require('./config/passport-jwt-strategy')
const db = require('./config/mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')

const port = process.env.PORT || 3030
const whitelist = ["http://localhost:3000", "http://localhost:3002"];
const corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (whitelist.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true, credentials: true }; // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false }; // disable CORS for this request
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};
app.use(cors(corsOptionsDelegate));

app.use(bodyParser.json())
app.use(passport.initialize())

app.use('/', require('./routes'))

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
