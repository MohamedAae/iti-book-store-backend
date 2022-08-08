const express = require("express"),
  router = express.Router(),
  controller = require("./reviews.controller"),
    jwt = require("../../auth/token");

router.get("/", controller.get);
router.post("/", jwt.auth, controller.create);
router.get("/:id", controller.getById);

module.exports=router