const express = require("express"),
  router = express.Router(),
  controller = require("./products.controller");

router.get("/", controller.get);
router.get("/best-seller", controller.fillter);
router.get("/discount/:rate", controller.discount);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.patch("/:id", controller.edit);

module.exports = router;