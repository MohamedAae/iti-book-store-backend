const Product = require("../products/proudcts.model"),
  helpers = require("../../helpers/api.js"),
  mongoose = require("mongoose");

const Controller = {
  search: async (req, res, next) => {
    const keyword = req.params.keyword;
    try {
      let result = await Product.find({
        name: { $regex: keyword, $options: "i" },
      });
      return res.status(201).json({
        success: true,
        code: 201,
        searchResult: result,
      });
    } catch (err) {
      return helpers.handleError(err, res);
    }
  },
};

module.exports = Controller;
