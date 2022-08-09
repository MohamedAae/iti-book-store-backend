const Product = require("../products/proudcts.model"),
  helpers = require("../../helpers/api.js"),
  mongoose = require("mongoose");

const Controller = {
  search: async (req, res, next) => {
    const keyword = req.params.keyword,
        page      = checkQueryValue(req, 'page') - 1,
        pageSize  = checkQueryValue(req, 'pageSize'),
        skip      = page * pageSize;

    try {
      const result = await Product
          .find({
            name: { $regex: keyword, $options: "i" },
          })
          .limit(pageSize)
          .skip(skip)
          .populate("categoryId");

      const totalResults = await Product.count({
        name: { $regex: keyword, $options: "i" },
      });

      return res.status(201).json({
        success: true,
        code: 201,
        searchResult: result,
        totalResults,
      });
    } catch (err) {
      return helpers.handleError(err, res);
    }
  },
};

const checkQueryValue = (req, key) => {
  if ( req.query[key] ) {
    return req.query[key];
  }

  return "";
}

module.exports = Controller;
