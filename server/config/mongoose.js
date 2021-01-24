const mongoose = require('mongoose')

const mongoDB = require('./constants').mongodbURI

mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true})

const db = mongoose.connection

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

db.once('open', () => {
    console.log("Connected to mongoDB server...")
})

module.exports = db