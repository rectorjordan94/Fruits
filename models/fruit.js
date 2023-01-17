//! Our schema and model for the fruit resource

const mongoose = require('mongoose') // import mongoose

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