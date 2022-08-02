const express = require("express"),
  router = express.Router(),
  Product = require("./proudcts.model"),
  helpers = require("../../helpers/api.js");

router.get("/", async (req, res, next) => {
  let products;
  try {
    products = await Product.find();
    return res.status(201).json({
      success: true,
      code: 201,
      products: products,
    });
  } catch (err) {
    return helpers.handleError(err, res);
  }
});

router.post("/", async (req, res, next) => {
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
});

// const handleError = (err, res) => {
//     return res.status(500).json({
//         success : false,
//         code    : 500,
//         error   : `${err.toString()}`,
//     });
// }

module.exports = router;
