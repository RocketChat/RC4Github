const mongoose = require('mongoose')

const mongoDB = process.env.MONGODB_URI || 'mongodb://127.0.0.1/rc4git'

mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true})

const db = mongoose.connection

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

db.once('open', () => {
    console.log("Connected to mongoDB server...")
})

module.exports = db