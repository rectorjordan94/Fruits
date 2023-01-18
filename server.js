//! Import Dependencies
const express = require('express') // import the express framework
const morgan = require('morgan') // import the morgan request logger
require('dotenv').config() // load my ENV file's variables
const path = require('path') // import path module
const FruitRouter = require('./controllers/fruitControllers')
const UserRouter = require('./controllers/userControllers')
const middleware = require('./utils/middleware')

//! Create our Express App Object
const app = express()

//! Middleware
// our middleware is now processed by a function in the utils directory. This middleware function takes one argument, app, and process requests through our middleware
middleware(app)

//! Routes
app.get('/', (req, res) => {
    res.send('Server is live, ready for requests')
})

// This is now where we register our routes, this is how server.js knows to send the correct response
// app.use, when we register a route, needs two arguments
// the first arg is the base URL, second arg is the file to use
app.use('/fruits', FruitRouter)
app.use('/users', UserRouter)

//! Server Listener
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`))