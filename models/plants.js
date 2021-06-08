//Requiring dependencies
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Set up schema
const plantSchema = new Schema ({
    //define schema
    name: String,
    description: String,
    img: String,
    price: Number,
    qty: Number
});

//compile schema into a model
const Plant = mongoose.model('Plant', plantSchema);

//export model 
module.exports = Plant;