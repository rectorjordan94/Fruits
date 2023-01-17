///
// Import Dependencies
///
const express = require('express') // import the express framework
const mongoose = require('mongoose') // import the mongoose library
const morgan = require('morgan') // import the morgan request logger
require('dotenv').config() // load my ENV file's variables

///
//  Database Connection
///
// this is where we will set up our inputs for our database connect function
const DATABASE_URL = process.env.DATABASE_URL
// here is our DB config object
const CONFIG = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
// establish our database connection
mongoose.connect(DATABASE_URL, CONFIG)
// tell mongoose what to do with certain events: what happens when we open, disconnect, or get an error
mongoose.connection
    .on('open', () => console.log('connected to mongoose'))
    .on('close', () => console.log('disconnected from mongoose'))
    .on('error', (err) => console.log('an error occurred: \n', err))

///
// Create our Express App Object
///
const app = express()






///
// Server Listener
///
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`))