const express = require("express");
const router = express.Router();
const controller = require("./orders.controller");

router.post("/create-payment-intent", controller.createPaymentIntent);
router.get("/", controller.get);
router.post("/", controller.create);
// router.patch("/:id", controller.edit);
// router.delete("/:id", controller.delete)

module.exports = router;