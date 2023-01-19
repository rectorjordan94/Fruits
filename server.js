//! Import Dependencies
const express = require('express') // import the express framework
const morgan = require('morgan') // import the morgan request logger
require('dotenv').config() // load my ENV file's variables
const path = require('path') // import path module
const FruitRouter = require('./controllers/fruitControllers')
const UserRouter = require('./controllers/userControllers')
const CommentRouter = require('./controllers/commentControllers')
const middleware = require('./utils/middleware')

//! Create our Express App Object
// this was fine for building an API that sends and receives json
// const app = express()
// but now, our app is going to be Full-Stack. That means handling both front-end and back-end from the same server(in this case)
// so, we're utilizing an npm package `liquid-express-views` to add the 'view' layer to our MVC framework
// in short, we need to update our app object and tell it to use that package, as stated by the documentation
const app = require('liquid-express-views')(express())
// what liquid-express-views really does for us, is make it easy to path to our .liquid files(which will serve our html). This package says to look inside the 'views' folder for files with the .liquid name

//! Middleware
// our middleware is now processed by a function in the utils directory. This middleware function takes one argument, app, and process requests through our middleware
middleware(app)

//! Routes
app.get('/', (req, res) => {
    res.render('home.liquid')
})

// This is now where we register our routes, this is how server.js knows to send the correct response
// app.use, when we register a route, needs two arguments
// the first arg is the base URL, second arg is the file to use
app.use('/fruits', FruitRouter)
app.use('/comments', CommentRouter)
app.use('/users', UserRouter)

//! Server Listener
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`))