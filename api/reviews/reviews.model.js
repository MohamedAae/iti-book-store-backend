const mongoose = require("mongoose");

const Reviews= new mongoose.Schema({
userId:{type:mongoose.Schema.Types.ObjectId,ref:"users"},
bookId:{type:mongoose.Schema.Types.ObjectId,ref:"Product"},
rating:{type:Number},
review:{type:String},
date:{type:Date},
title:{type:String}
})



let model = mongoose.model("Reviews", Reviews);
module.exports = model;