# Fruitcakes Full CRUD Full Stack App

- Use Express to build a server
- Use Mongoose to communicate with mongoDB
- Full CRUD functionality on our fruits resource
- User Authentication
- The ability to add comments to fruits
- (Maybe gather data from a 3rd party API)

This app will start as an API, that receives requests and sends JSON responses, but eventually we will add a views layer that will render HTML in our browser.

This is an MVC application
We're using the MVC system for organizing our code.
This breaks our app down into these three parts.
MVC stands for: 
- Models
- Views
- Controllers

Models - All of our data, what shape it's in and what resources we're using(models), and how our resources relate to one another.

Views - All the different ways we can see our data, whether it's as a JSON response, or an actual HTML response, this determines how our data can be viewed by the user.

Controllers - Tell us what we can do and connect our views and our models. We can think of our routes as our controllers, because they determine how a user can interact with our resources

## How we talk about what we're doing

We're using express framework to build a server, in which we are using mongoose to process our requests and run CRUD operations using a mongoDb database.

What we're building is a REST api, that runs full CRUD operations on a single resource. (This will change, eventually)

## What is REST???

- REST stands for REpresentational State Transfer
- It's just a set of principles that describe how networked resources are accessed and manipulated
- We have 7 RESTful routes that allow us basic operations for reading and manipulating a collection of data

## Route Tables for Documents

#### Fruits

| **URL**            | **HTTP Verb** | **Action** |
|--------------------|---------------|------------|
| /fruits            | GET           | index      |
| /fruits/:id        | GET           | show       |
| /fruits/new        | GET           | new        |
| /fruits            | POST          | create     |
| /fruits/:id/edit   | GET           | edit       |
| /fruits/:id        | PATCH/PUT     | update     |
| /fruits/:id        | DELETE        | destroy    |

#### Comments

| **URL**            | **HTTP Verb** | **Action** |
|--------------------------------------|------------|------------|
| /comments/:fruitId                   | POST       | create     |
| /comments/delete/:fruitId/:commentId | GET        | destroy    |

#### Users

| **URL**            | **HTTP Verb** | **Action** |
|--------------------|---------------|------------|
| /users/signup      | GET           | new        |
| /users/login       | GET           | login      |
| /users/signup      | POST          | create     |
| /users/login       | POST          | create     |
| /users/logout      | DELETE        | destroy    |



## File organization, where are things happening?

Main entry file is still `server.js`
This is where we establish our connection with express, to the port 3000, which allows us to develop locally on [localhost:3000](http://localhost:3000/)

`server.js` imports our `fruitControllers` from the controllers directory

`fruitControllers` is where we set up our routes to utilize mongoose to interact with fruit documents in our mongoDb

The connection between our fruits and mongoDb starts with the file `utils/connection.js`, where we define and connect to our database. The Fruit model in `models/fruit.js` is where this connection happens. Our fruitControllers import the model Fruit, and run mongoose model methods whenever we hit the appropriate route

## Middleware

Middleware is processed by a function in the utils directory. `utils/middleware.js` This middleware function takes one argument, app, and processes requests through our middleware

## Relationships

One to many: 
    - One user can have many fruits
    - One fruit can have many comments

Fruits are connected to Users through the `fruit.owner` files, via `objectId` reference
Comments are connected to Fruits, as an array of subdocuments at `fruit.comments`
Users are connected to comments, via `objectId` reference, at `comment.author`

#### ERD

This is an entity relationship diagram(basic version for now)
This accurately describes my relationships between my documents(entities)

![entityRelationshipDiagram](images/ERD.png)

## Views Layer

We're using liquid blah blah blah: 

`{% layout 'layout.liquid' %}
{% block content %}
    <!-- we need to account for two conditions here -->
    <!--first, if we have fruits in our array -->
    <!-- second, if there are no fruits in the array-->
    {% if fruits.length > 0 %}
        <h2>All Fruits</h2>
        <ul>
            <!--now we can loop over our array of fruits and produce some html for every fruit we have-->
            <!-- our {%  %} syntax -> injects logic -->
            <!-- our {{  }} syntax -> injects data -->
            {% for fruit in fruits %}
                <li>{{ fruit.name }} - Color: {{fruit.color}}</li>
            {% endfor %}
        </ul>
    {% else %}
        <h2>No fruits yet... Go create some!</h2>
    {% endif %}
{% endblock %}

`