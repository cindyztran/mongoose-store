//Dependencies
const express = require('express');

const mongoose = require('mongoose');

const methodOverride = require('method-override');

//require model
const Plant = require('./models/plants');


//Initialize the Express App
const app = express();

// connection variable. object that represents our connection instance
// use this to get info about our mongodb connection
const db = mongoose.connection;

//initialize and configure env
const dotenv = require('dotenv').config({ path: '.env'});

//Port
//Allow use of Heroku's port or local port, depending on the environment
const PORT = process.env.PORT || 3000;

//Database 
const MONGODB_URI = process.env.MONGODB_URI;

// a method for connection to mongodb
mongoose.connect(MONGODB_URI, 
    { 
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false

});

// Error/success - listen for mongodb events
db.on('error', (err) => console.log(err.message + ' is mongodb not running?'));
db.on('connected', () => console.log('mongodb connected: ', MONGODB_URI));
db.on('disconnected', () => console.log('mongodb disconnected'));


//Middleware

//use public folder for static assets
app.use(express.static('public'));

//populates req.body with parsed info from forms - if no data from forms: return empty object {}
app.use(express.urlencoded({ extended: false })); //extended: false  - does not allow nested objects in query strings
app.use(express.json()); //returns middleware that only parses JSON - may or may not need it depending on project

//use method override 
app.use(methodOverride('_method')); //allow POST, PUT and DELETE from a form

//Routes/Controller code 
//localhost:3000

//Index
app.get('/plants', (req, res) => { 
    Plant.find({}, (error, allPlants) => {
        res.render('index.ejs', {
            plants: allPlants,
        });
    });
});

//New
app.get('/plants/new', (req, res) => {
    res.render('new.ejs');
});

//Delete

//Update

//Create
app.post('/plants', (req, res) => {
    if (req.body.completed === 'on') {
        //if checked, req.body.completed is set to 'on'
        req.body.completed = true;
    } else {
        //if not checked, req.body.completed is undefined
        req.body.completed = false;
    }
    Plant.create(req.body, (error, createdPlant) => {
        res.redirect('/plants');
    });
});

//Edit

//Show 
app.get('/plants/:id', (req, res) => {
    Plant.findById(req.params.id, (err, foundPlant) => {
        res.render('show.ejs', {
        plant: foundPlant,

        });
    });
});



//Listener 
app.listen(PORT, () => console.log('express is listening on:', PORT));
