//! Import Dependencies
const express = require('express')
const Fruit = require('../models/fruit')

//! Create Router
const router = express.Router()

//! Routes
// subdocuments are not mongoose models. That means they don't have their own collection and they don't come with the same model methods that we're used to(they have some of their own built in)
// this also means, that a subdoc is never going to be viewed without it's parent document. We'll never see a comment without seeing the fruit it was commented on first

// this also means, that when we make a subdocument, we MUST refer to the parent so that mongoose knows where in mongodb to store this subdocument

//* POST -> /comments/<someFruitId>
// only loggedin users can post comments
// bc we have to refer to a fruit, we'll do that in the simplest way via the route
router.post('/:fruitId', (req, res) => {
    // first we get the fruitId and save to a variable
    const fruitId = req.params.fruitId
    // then we'll protect this route against non-logged in users
    if (req.session.loggedIn) {
        // if logged in, make the logged in user the author of the comment
        // this is exactly like how we added the owner to our fruits
        req.body.author = req.session.userId
        // saves the req.body to a variable for easy reference later
        const theComment = req.body
        // find a specific fruit
        Fruit.findById(fruitId)
            .then(fruit => {
                // create the comment(with a req.body)
                fruit.comments.push(theComment)
                // save the fruit
                return fruit.save()
            })
            // respond with a 201 and the fruit itself
            .then(fruit => {
                // res.status(201).json({ fruit: fruit })
                res.redirect(`/fruits/${fruit.id}`)
            })
            // catch and handle any errors
            .catch(err => {
                console.log(err)
                // res.status(400).json(err)
                res.redirect(`/error?error=${err}`)
            })
    } else {
        // res.sendStatus(401) //send a 401-unauthorized
        res.redirect(`/error?error=You%20are%20not%20allowed%to%comment%on%this%20fruit`)
    }
})

//* DELETE -> /comments/delte/<someFruitId>/<someCommentId>
// make sure only the author of the comment can delete the comment
router.delete('/delete/:fruitId/:commId', (req, res) => {
    // isolate the ids and save to variables so we don't have to keep typing req.params
    // const fruitId = req.params.fruitId
    // const commId = req.params.commId
    const { fruitId, commId } = req.params
    // get the fruit
    Fruit.findById(fruitId)
        .then(fruit => {
            // get the comment, we'll use the built in subdoc method called .id()
            const theComment = fruit.comments.id(commId)
            console.log('the comment to be deleted: \n', theComment)
            // then we want to make sure the user is logged in, and that they are the author of the comment
            if (req.session.loggedIn) {
                // if they are the author, allow them to delete
                if (theComment.author == req.session.userId) {
                    // we can use another built in method - remove()
                    theComment.remove()
                    fruit.save()
                    // res.sendStatus(204) // send 204 no content
                    res.redirect(`/fruits/${fruit.id}`)
                } else {
                    res.redirect(`/error?error=You%20are%20not%20allowed%to%20delete%20this%20comment`)
                }
            } else {
                // otherwise send a 401 - unauthorized status
                res.redirect(`/error?error=You%20are%20not%20allowed%to%20delete%20this%20comment`)
            }
        })
        .catch(err => {
            console.log(err)
            res.redirect(`/error?error=${err}`)
        })
})

//! Export Router
module.exports = router