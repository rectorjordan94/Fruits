//! Import Dependencies
const express = require('express') // import the express framework
const mongoose = require('mongoose') // import the mongoose library
const morgan = require('morgan') // import the morgan request logger
require('dotenv').config() // load my ENV file's variables
const path = require('path') // import path module
const FruitRouter = require('./controllers/fruitControllers')

//! Import Our Models
const Fruit = require('./models/fruit')

//!  Database Connection
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


//! Create our Express App Object
const app = express()

//! Middleware
// middleware runs before all the routes
// every request is processed through our middleware before mongoose can do anything with it
app.use(morgan('dev')) // this is for request logging, the 'tiny' argument declares what size of morgan log to use
app.use(express.urlencoded({extended: true})) // this parses urlEncoded request bodies(useful for POST and PUT requests)
app.use(express.static('public')) // this serves static files from the 'public' folder
app.use(express.json()) // parses incoming request payloads with JSON

//! Routes
app.get('/', (req, res) => {
    res.send('Server is live, ready for requests')
})

// This is now where we register our routes, this is how server.js knows to send the correct response
// app.use, when we register a route, needs two arguments
// the first arg is the base URL, second arg is the file to use
app.use('/fruits', FruitRouter)

//! Server Listener
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`))