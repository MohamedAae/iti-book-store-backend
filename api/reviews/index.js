const express = require("express"),
  router = express.Router(),
  controller = require("./reviews.controller"),
  jwt = require("../../auth/token");

router.get("/", controller.get);
router.post("/", jwt.auth, controller.create);
router.delete("/:id", controller.delete)
router.get("/:id", controller.getById);
router.get("/user/:id", controller.getReviewsByUserId);

module.exports = router;
