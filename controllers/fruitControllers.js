//! Import Dependencies
const express = require('express')
const Fruit = require('../models/fruit')

//! Create Router
const router = express.Router()

//! Routes
//* INDEX route 
// Read -> finds and displays all fruits
router.get('/', (req, res) => {
    // find all the fruits
    Fruit.find({})
        // send json if successful
        .then(fruits => { res.json({fruits: fruits})})
        // catch errors if they occur
        .catch(err => {
            console.log(err)
            res.status(400).json(err)
        })
})

//* CREATE route
// Create -> receives a request body, and creates a new document in the database
router.post('/', (req, res) => {
    // console.log('this is req.body before owner: \n', req.body)
    // here we'll have something called a request body
    // inside this function, that will be called req.body
    // we want to pass our req.body to the create method
    // we want to add an owner field to our fruit
    // luckily for us, we saved the user's id on the session object, so it's really easy for us to access that data
    req.body.owner = req.session.userId
    const newFruit = req.body
    // console.log('this is req.body aka newFruit after owner \n', newFruit)
    Fruit.create(newFruit)
        .then(fruit => {
            // send a 201 status, along with the json response of the new fruit
            res.status(201).json({fruit: fruit.toObject()})
        })
        // send an error if one occurs
        .catch(err => {
            console.log(err)
            res.status(400).json(err)
        })
})

//* GET route
// Index -> this is a user specific index route
// this will only show the logged-in user's fruits
router.get('/mine', (req,res) => {
    // find fruits by ownership, using the req.session info
    Fruit.find({ owner: req.session.userId })
        .then(fruits => {
            // if found, display the fruits
            res.status(200).json({fruits: fruits})
        })
        .catch(err => {
            // otherwise throw an error
            console.log(err)
            res.status(400).json(err)
        })
})

// // PUT route
// // Update -> updates a specific fruit
// //  PUT replaces the entire document with a new document from the req.body
// // PATCH is able to update specific fields at specific times, but it requires a little more code to ensure that it works properly, so we'll use that later
// router.put('/:id', (req, res) => {
//     // save the id to a variable for easy use later
//     const id = req.params.id
//     // save the request body to a variable for easy reference later
//     const updatedFruit = req.body
//     // use the mongoose method findByIdAndUpdate
//     // eventually we'll change how this route works, but for now, we'll do everything in one shot, with findByIdAndUpdate
//     Fruit.findByIdAndUpdate(id, updatedFruit, { new: true })
//         .then(fruit => {
//             console.log('the newly updated fruit: \n', fruit)
//             // update success message will just be a 204 - no content
//             res.sendStatus(204)
//         })
//         .catch(err => {
//             console.log(err)
//             res.status(400).json(err)
//         })
// })

//* PUT route
// Update -> updates a specific fruit(only if the fruit's owner is updating)
router.put('/:id', (req, res) => {
    const id = req.params.id
    Fruit.findById(id)
        .then(fruit => {
            // if the owner of the fruit is the person who is logged in
            if (fruit.owner == req.session.userId) {
                // send success message
                res.sendStatus(204)
                // update and save the fruit
                return fruit.updateOne(req.body)
            } else {
                // otherwise send a 401 unauthorized status
                res.sendStatus(401)
            }
        })
        .catch(err => {
            console.log(err)
            res.status(400).json(err)
        })
})


//* DELETE route
// Delete -> delete a specific fruit
router.delete('/:id', (req, res) => {
    const id = req.params.id
    Fruit.findById(id)
        .then(fruit => {
            // if the owner of the fruit is the person who is logged in
            if (fruit.owner == req.session.userId) {
                // send success message
                res.sendStatus(204)
                // delete the fruit
                return fruit.deleteOne()
            } else {
                // otherwise send a 401 unauthorized status
                res.sendStatus(401)
            }
        })
        .catch(err => {
            console.log(err)
            res.status(400).json(err)
        })
})


//* SHOW route
// Read -> finds and displays a single resource
router.get('/:id', (req, res) => {
    // get the id -> save to a variable
    const id = req.params.id
    // use a mongoose method to find using that id
    Fruit.findById(id)
        .then(fruit => {
            // send the fruit as json upon success
            res.json({fruit: fruit})
        })
        .catch(err => {
            console.log(err)
            res.status(400).json(err)
        })
    // catch any errors
})

//! Export Router
module.exports = router