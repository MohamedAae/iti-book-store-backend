const express = require("express"),
  router = express.Router(),
  controller = require("./reviews.controller");

router.get("/", controller.get);


module.exports=router