//! Our schema for the Comment Subdocument
const mongoose = require('../utils/connection')

// all we need form mongoose to build subdocuments is the schema constructor
//* SUBDOCUMENTS ARE NOT MONGOOSE MODELS
// we'll destructure the Schema function from mongoose
const { Schema } = mongoose

//! Comment Schema
const commentSchema = new Schema({
    note: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true })

// take note that there is no model function happening anywhere in this file. That's because SUBDOCS ARE NOT MONGOOSE MODELS

//! Export our Schema
module.exports = commentSchema
