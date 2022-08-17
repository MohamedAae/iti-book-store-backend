const mongoose = require("mongoose");

const Order = new mongoose.Schema({
    date: Date,
    status: String,
    paymentId: {type: String, unique: true},
    paymentStatus: String,
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "users"},
    totalItems: Number,
    items: [{type: mongoose.Schema.Types.ObjectId, ref: "Product"}],
    totalPrice: Number,
});

let model = mongoose.model("Order", Order);
module.exports = model;
