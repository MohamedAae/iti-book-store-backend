const mongoose = require("mongoose");

const Product = new mongoose.Schema({
  url: String,
  name: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "Authors" },
  description: String,
  rating: { type: Number, min: 0, max: 5 },
  free: Boolean,
  price: { type: Number },
  discountrate: { type: Number },
  image: String,
  thumbnail: Array,
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: "Publishers" },
  active: Boolean,
  reviews: { type: mongoose.Schema.Types.ObjectId, ref: "Reviews" },
});

let model = mongoose.model("Product", Product);
module.exports = model;
