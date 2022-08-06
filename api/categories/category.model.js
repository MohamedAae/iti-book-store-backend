const mongoose = require('mongoose');

const Category = new mongoose.Schema({
    name        : String,
    url         : String,
    image       : String,
});

let model = mongoose.model('Category', Category);
module.exports = model;