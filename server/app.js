const express = require('express')
const app = express()
const passport = require('passport')
const jwtStrategy = require('./config/passport-jwt-strategy')
const db = require('./config/mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require("cookie-parser")
const {handleGithubWebhookVerificationError} = require("./middlewares/verifyWebhooks");
const path = require("path");
const { rocketChatDomain } = require("./config/constants");

const port = process.env.PORT || 8090

const whitelist = [`${rocketChatDomain}`];
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
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  next();
});

app.use(cookieParser())

app.use(handleGithubWebhookVerificationError);

app.use('/api', require('./routes'))

if(process.env.NODE_ENV === 'production') {
  // Serve static files from the React frontend app
  app.use(express.static(path.join(__dirname, "../client/build")));
  // Anything that doesn't match the above, send back index.html
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "/../client/build/index.html"));
  });
}

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})