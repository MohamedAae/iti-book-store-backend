const mongoose = require('mongoose');

const Offers = new mongoose.Schema({
    title       : String,
    description : String,
    url         : String,
    image       : String
})

let model = mongoose.model('Offers', Offers);
module.exports = model;
