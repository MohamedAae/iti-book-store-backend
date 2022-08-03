const mongoose = require("mongoose");

const author = new mongoose.Schema({
  name: String,
  books: { type: mongoose.Schema.Types.ObjectId, ref: "Products" },
});

let model = mongoose.model("author", author);
module.exports = model;
