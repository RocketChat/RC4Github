const passport = require('passport')
const passportJWTStrategy = require('passport-jwt').Strategy
const jwtExtractor = require('passport-jwt').ExtractJwt

const User = require('../models/user')
const constants = require('./constants')

const cookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["rc4git_token"];
  }
  return token;
};

const options = {
  jwtFromRequest: jwtExtractor.fromExtractors([jwtExtractor.fromAuthHeaderAsBearerToken(), cookieExtractor]),
  secretOrKey: constants.jwtSecret,
};

passport.use(new passportJWTStrategy(options, function(jwtPayload, done){
    User.findById(jwtPayload._id, function(err, user){
        if(err){
            console.log('Error in Token ', err)
            return done(null, false)
        }

        if(user){
            return done(null, user)
        } else{
            return done(null, false)
        }
    })
}))

module.exports = passport