const express = require("express"),
  router = express.Router(),
  controller = require("./search.controller");

router.get("/:keyword", controller.search);

module.exports = router;
