const mongoose = require("mongoose");

const users = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 5 },
  name: { type: String, required: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  history: { type: mongoose.Schema.Types.ObjectId, ref: "Products" },
  reviews: { type: mongoose.Schema.Types.ObjectId, ref: "Reviews" },
  favourit: { type: mongoose.Schema.Types.ObjectId, ref: "Products" },
});

let model = mongoose.model("users", users);
module.exports = model;
