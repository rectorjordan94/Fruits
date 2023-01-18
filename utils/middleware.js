//! Import Dependencies
const express = require('express') // import the express framework
const morgan = require('morgan') // import the morgan request logger

//! Middleware Function
// Now, instead of processing our middleware in server.js, we're going to build a function that will take the entire app as an argument, and run requests through all of our middleware
const middleware = (app) => {
    // middleware runs before all the routes
    // every request is processed through our middleware before mongoose can do anything with it
    app.use(morgan('dev')) // this is for request logging, the 'tiny' argument declares what size of morgan log to use
    app.use(express.urlencoded({extended: true})) // this parses urlEncoded request bodies(useful for POST and PUT requests)
    app.use(express.static('public')) // this serves static files from the 'public' folder
    app.use(express.json()) // parses incoming request payloads with JSON
}

//! Export Middleware Function
module.exports = middleware