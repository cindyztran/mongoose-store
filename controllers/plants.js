//require and set up dependencies
const express = require('express');

//provide "router functionality"
const plantRouter = express.Router();

//require model
const Plant = require('../models/plants.js');


//Seed - run create on each item
const plantSeed = require('../models/plantSeed.js');

plantRouter.get('/seed', (req, res) => {
    Plant.deleteMany({}, (error, allPlants) => {});
    Plant.create(plantSeed, (error, data) => {
        res.redirect('/plants');
    });
});

//Index
plantRouter.get('/', (req, res) => { 
    //find all products
    Plant.find({}, (error, allPlants) => {
        res.render('index.ejs', {
            plants: allPlants,
        });
    });
});

//New
plantRouter.get('/new', (req, res) => {
    res.render('new.ejs');
});

//Delete
plantRouter.delete('/:id', (req, res)=> {
    Plant.findByIdAndRemove(req.params.id, (error, deletedPlant) => {
        res.redirect('/plants');
    });
});


//Update
plantRouter.put('/:id', (req, res) => {
    //find product in mongodb and update with req.body
    
    Plant.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    }, (error, updatedPlant) => {
    //redirect user to show page of updated product
        res.redirect(`/plants/${req.params.id}`);

    });
});

////Buy
//Buy Button solution credit to Josh Zalcman
plantRouter.put('/:id/buy', (req, res, next) => {
    //find product and create a req.body from returned object
    Plant.findById(req.params.id, (error, foundPlant) => {
        req.body = {
            _id: foundPlant.id, name: foundPlant.name,
            description: foundPlant.description,
            img: foundPlant.img,
            price: foundPlant.findByIdAndRemove,
            //decrement qty value
            qty: foundPlant.qty -1,
        };

        //find product and update
        Plant.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true},
            (error, updatedPlant) => {
            res.redirect(`/plants/${req.params.id}`);
            });
        
    });

});


//Create
plantRouter.post('/', (req, res) => {
    Plant.create(req.body, (error, createdPlant) => {
        res.redirect('/plants');
    });
});

//Edit
plantRouter.get('/:id/edit', (req, res) => {
    //find product being edited
    Plant.findById(req.params.id, (err, foundPlant) => {
        //insert product into a template -> edit.ejs
        res.render('edit.ejs', {
            //context object: provides context to template
            plant: foundPlant
        });
    });
});

//Show 
plantRouter.get('/:id', (req, res) => {
    Plant.findById(req.params.id, (err, foundPlant) => {
        res.render('show.ejs', {
        plant: foundPlant,

        });
    });
});



//export functionality
module.exports = plantRouter;