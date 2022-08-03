const express = require("express"),
  router = express.Router(),
  Author = require("./authors.model"),
  helpers = require("../../helpers/api.js");

router.get("/", async (req, res, next) => {
  let authors;
  try {
    authors = await Author.find();
    return res.status(201).json({
      success: true,
      code: 201,
      authors: authors,
    });
  } catch (err) {
    return helpers.handleError(err, res);
  }
});

router.post("/", async (req, res, next) => {
  const data = req.body,
    author = new Author(data);

  try {
    const saved = await author.save();
    return res.status(201).json({
      success: true,
      code: 201,
      author: saved,
    });
  } catch (err) {
    return helpers.handleError(err, res);
  }
});

module.exports = router;
