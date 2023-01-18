//! Our schema and model for the fruit resource

// this is the OLD mongoose import
// const mongoose = require('mongoose') // import mongoose

// now we want our mongoose object to relate to our db
// so we're gonna bring in the mongoose connection from our utils
const mongoose = require('../utils/connection')
// we'll destructure the Schema and model functions from mongoose
const { Schema, model } = mongoose

// fruits schema
const fruitSchema = new Schema({
    name: String,
    color: String,
    readyToEat: Boolean
})

// make the fruit model, the model method takes two arguments:
// first argument is what we call our model
// second argument is the schema used to build the model
const Fruit = model('Fruit', fruitSchema)

//! Export our model
module.exports = Fruit