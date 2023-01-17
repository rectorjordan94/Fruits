//! Import Dependencies
const express = require('express') // import the express framework
const mongoose = require('mongoose') // import the mongoose library
const morgan = require('morgan') // import the morgan request logger
require('dotenv').config() // load my ENV file's variables
const path = require('path') // import path module

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

// we're going to build a seed route
// this will seed the database for us with a few starter resources
// there are two ways we will talk about seeding the database
// First -> seed route, they work but they are not best practices
// Second -> seed script, they work and they ARE best practices
app.get('/fruits/seed', (req, res) => {
    // array of starter resources(fruits)
    const startFruits = [
        { name: 'Orange', color: 'orange', readyToEat: true },
        { name: 'Grape', color: 'purple', readyToEat: true },
        { name: 'Banana', color: 'green', readyToEat: false },
        { name: 'Strawberry', color: 'red', readyToEat: false},
        { name: 'Coconut', color: 'brown', readyToEat: true},
    ]
    // then we delete every fruit in the database(all instances of this resource)
    Fruit.deleteMany({})
        .then(() => {
            // then we'll seed(create) our starter fruits
            Fruit.create(startFruits)
                // tell our db what to do with success and failures
                .then(data => {
                    res.json(data)
                })
                .catch(err => console.log('the following error occurred: \n',err))
        })
})

// INDEX route 
// Read -> finds and displays all fruits
app.get('/fruits', (req, res) => {
    // find all the fruits
    Fruit.find({})
        // send json if successful
        .then(fruits => { res.json({fruits: fruits})})
        // catch errors if they occur
        .catch(err => console.log('the following error occurred: \n', err))
})

// CREATE route
// Create -> receives a request body, and creates a new document in the database
app.post('/fruits', (req, res) => {
    // here we'll have something called a request body
    // inside this function, that will be called req.body
    // we want to pass our req.body to the create method
    const newFruit = req.body
    Fruit.create(newFruit)
        .then(fruit => {
            // send a 201 status, along with the json response of the new fruit
            res.status(201).json({fruit: fruit.toObject()})
        })
        // send an error if one occurs
        .catch(err => console.log(err))
})

// PUT route
// Update -> updates a specific fruit
//  PUT replaces the entire document with a new document from the req.body
// PATCH is able to update specific fields at specific times, but it requires a little more code to ensure that it works properly, so we'll use that later
app.put('/fruits/:id', (req, res) => {
    // save the id to a variable for easy use later
    const id = req.params.id
    // save the request body to a variable for easy reference later
    const updatedFruit = req.body
    // use the mongoose method findByIdAndUpdate
    // eventually we'll change how this route works, but for now, we'll do everything in one shot, with findByIdAndUpdate
    Fruit.findByIdAndUpdate(id, updatedFruit, { new: true })
        .then(fruit => {
            console.log('the newly updated fruit: \n', fruit)
            // update success message will just be a 204 - no content
            res.sendStatus(204)
        })
        .catch(err => console.log(err))
})


// DELETE route
// Delete -> delete a specific fruit

//  SHOW route
// Read -> finds and displays a single resource
app.get('/fruits/:id', (req, res) => {
    // get the id -> save to a variable
    const id = req.params.id
    // use a mongoose method to find using that id
    Fruit.findById(id)
        .then(fruit => {
            // send the fruit as json upon success
            res.json({fruit: fruit})
        })
    .catch(err => console.log(err))
    // catch any errors
})




//! Server Listener
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`))