const express   = require("express"),
    router      = express.Router(),
    controller  = require("./offers.controller");


router.get("/", controller.get);
router.post("/", controller.create);
router.patch("/:id", controller.edit);

module.exports = router;
