const helpers = require("../../helpers/api.js"),
  mongoose = require("mongoose"),
  Reviews = require("../reviews/reviews.model");

const Controller = {
  get: async (req, res, next) => {
    try {
      const reviews = await Reviews.find().populate('bookId');
      return res.status(201).json({
        success: true,
        code: 201,
        reviews: reviews,
      });
    } catch (err) {
      return helpers.handleError(err, res);
    }
  },

  getById: async (req, res, next) => {
    const id = req.params.id;
    try {
      const reviews = await Reviews.find({ bookId: id }).populate("userId");
      return res.status(201).json({
        success: true,
        code: 201,
        reviews: reviews,
      });
    } catch (err) {
      return helpers.handleError(err, res);
    }
  },

  getReviewsByUserId: async (req, res, next) => {
    const id = req.params.id;

    try {
      const reviews = await Reviews.find({ userId: id }).populate("bookId");
      return res.status(201).json({
        success: true,
        code: 201,
        reviews: reviews,
      });
    } catch (err) {
      return helpers.handleError(err, res);
    }
  },

  create: async (req, res, next) => {
    const data = req.body;
    data.date = new Date();

    const review = new Reviews(data);
    try {
      const saved = await review.save();
      return res.status(201).json({
        success: true,
        code: 201,
        review: saved,
      });
    } catch (err) {
      return helpers.handleError(err, res);
    }
  },

  delete: async (req, res, next) => {
    const id = req.params.id;

    try {
      const deleted = await Reviews.deleteOne({_id: id});
      return res.status(201).json({
        success: true,
        code: 201,
        id: id,
      });
    } catch (err) {
      return helpers.handleError(err, res);
    }
  },
};

module.exports = Controller;
