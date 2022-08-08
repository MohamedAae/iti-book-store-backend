const Product = require("./proudcts.model"),
  helpers = require("../../helpers/api.js"),
  mongoose = require("mongoose");
const Offer = require("../offers/offers.model");

const Controller = {
  get: async (req, res, next) => {
    let products;
    const limit = req.query.pageSize,
      page = req.query.page - 1,
      skip = limit * page;
    console.log(limit);
    try {
      products = await Product.find().limit(limit).skip(skip);
      return res.status(201).json({
        success: true,
        code: 201,
        products: products,
      });
    } catch (err) {
      return helpers.handleError(err, res);
    }
  },

  create: async (req, res, next) => {
    const data = req.body,
      product = new Product(data);

    try {
      const saved = await product.save();
      return res.status(201).json({
        success: true,
        code: 201,
        product: saved,
      });
    } catch (err) {
      return helpers.handleError(err, res);
    }
  },

  getById: async (req, res, next) => {
    const id = req.params.id;
    try {
      const product = await Product.findById(id).populate("categoryId");
      return res.status(201).json({
        success: true,
        code: 201,
        product,
      });
    } catch (err) {
      return helpers.handleError(err, res);
    }
  },

  edit: async (req, res, next) => {
    const id = req.params.id,
      update = req.body;

    try {
      const updated = await Product.findOneAndUpdate({ _id: id }, update);
      return res.status(201).json({
        success: true,
        code: 201,
        product: updated,
      });
    } catch (err) {
      return helpers.handleError(err, res);
    }
  },

  fillter: async (req, res, next) => {
    let bestSellerBooks;
    try {
      bestSellerBooks = await Product.find()
        .sort({ rating: -1 })
        .limit(9)
        .populate("categoryId");
      return res.status(201).json({
        success: true,
        code: 201,
        bestSellerBooks: bestSellerBooks,
      });
    } catch (err) {
      return helpers.handleError(err, res);
    }
  },

  discount: async (req, res, next) => {
    const rate = req.params.rate;
    console.log(rate);
    let discontbook;
    try {
      discontbook = await Product.find({ discountrate: rate / 100 }).limit(14);
      return res.status(201).json({
        success: true,
        code: 201,
        discontbook: discontbook,
      });
    } catch (err) {
      return helpers.handleError(err, res);
    }
  },
};

module.exports = Controller;
