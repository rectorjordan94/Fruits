//! Import Dependencies
const express = require('express')
const Fruit = require('../models/fruit')

//! Create Router
const router = express.Router()

//! Routes
//* INDEX route 
// Read -> finds and displays all fruits
router.get('/', (req, res) => {
    const { username, loggedIn, userId } = req.session
    // find all the fruits
    // console.log(req.session)
    Fruit.find({})
        // there's a built in function that runs before the rest of the promise chain
        // this function is called populate, and it's able to retrieve info from documents in other collections
        .populate('owner', 'username')
        .populate('comments.author', '-password')
        // send json if successful
        .then(fruits => {
            // res.json({ fruits: fruits })
            // now that we have liquid installed, we're going to use render as a response for our controllers
            res.render('fruits/index', { fruits, username, loggedIn, userId })
        })
        // catch errors if they occur
        .catch(err => {
            console.log(err)
            res.redirect(`error?error=${err}`)
        })
})

//* GET for the new page
// shows a form where a user can create a new fruit
router.get('/new', (req, res) => {
    res.render('fruits/new', {...req.session})
})

//* CREATE route
// Create -> receives a request body, and creates a new document in the database
router.post('/', (req, res) => {
    // here we'll have something called a request body
    // inside this function, that will be called req.body
    // we want to pass our req.body to the create method
    // we want to add an owner field to our fruit
    // luckily for us, we saved the user's id on the session object, so it's really easy for us to access that data
    req.body.owner = req.session.userId

    // we need to do a little JS magic, to get our checkbox turned into a boolean
    // here we use a ternary operator to change the on value to send as true
    // otherwise, make that field false
    req.body.readyToEat = req.body.readyToEat === 'on' ? true: false
    const newFruit = req.body

    Fruit.create(newFruit)
        .then(fruit => {
            // send a 201 status, along with the json response of the new fruit
            // in the API server version of our code we sent json and a success message
            // res.status(201).json({fruit: fruit.toObject()})
            // we could redirect to the 'mine' page
            res.redirect('/fruits/mine')
            // we could also redirect to the new fruit's show page
            // resredirect(`/fruits/${fruit.id}`)
        })
        // send an error if one occurs
        .catch(err => {
            console.log(err)
            res.redirect(`/error?error=${err}`)
        })
})

//* GET route
// Index -> this is a user specific index route
// this will only show the logged-in user's fruits
router.get('/mine', (req,res) => {
    // find fruits by ownership, using the req.session info
    Fruit.find({ owner: req.session.userId })
        .populate('owner', 'username')
        .populate('comments.author', '-password')
        .then(fruits => {
            // if found, display the fruits
            res.render('fruits/index', { fruits, ...req.session })
        })
        .catch(err => {
            // otherwise throw an error
            console.log(err)
            res.redirect(`error?error=${err}`)
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

//* GET request -> EDIT route
// shows the form for updating a fruit
router.get('/edit/:id', (req, res) => {
    // because we're editing a specific fruit, we want to be able to access the fruit's initial values. So we can use that info on the page
    
    const fruitId = req.params.id
    Fruit.findById(fruitId)
        .then(fruit => {
            res.render('fruits/edit', { fruit, ...req.session})
        })
        .catch(err => {
            res.redirect(`/error?error=${err}`)
        })
})

//* PUT route
// Update -> updates a specific fruit(only if the fruit's owner is updating)
router.put('/:id', (req, res) => {
    const id = req.params.id
    req.body.readyToEat = req.body.readyToEat === 'on' ? true: false
    Fruit.findById(id)
        .then(fruit => {
            // if the owner of the fruit is the person who is logged in
            if (fruit.owner == req.session.userId) {
                // send success message
                // res.sendStatus(204)
                // update and save the fruit
                return fruit.updateOne(req.body)
                // res.redirect('/fruits', { ...req.session})
            } else {
                // otherwise send a 401 unauthorized status
                // res.sendStatus(401)
                res.redirect(`error?error=You%20are%20not%20allowed%20to%20edit%20this%20fruit`)
            }
        })
        .then(fruit => {
            res.redirect(`/fruits/mine`)
        })
        .catch(err => {
            console.log(err)
            res.redirect(`/error?error=${err}`)
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
                // res.sendStatus(204)
                // delete the fruit
                return fruit.deleteOne()
            } else {
                // otherwise send a 401 unauthorized status
                res.redirect(`error?error=You%20are%20not%20allowed%20to%delete%20this%20fruit`)
            }
        })
        .then(() => {
            res.redirect('/fruits/mine')
        })
        .catch(err => {
            console.log(err)
            res.redirect(`/error?error=${err}`)
        })
})


//* SHOW route
// Read -> finds and displays a single resource
router.get('/:id', (req, res) => {
    // get the id -> save to a variable
    const id = req.params.id
    // use a mongoose method to find using that id
    Fruit.findById(id)
        .populate('comments.author', 'username')
        .then(fruit => {
            // send the fruit as json upon success
            res.render('fruits/show', {fruit, ...req.session})
        })
        .catch(err => {
            console.log(err)
            res.redirect(`/error?error=${err}`)
        })
    // catch any errors
})

//! Export Router
module.exports = router