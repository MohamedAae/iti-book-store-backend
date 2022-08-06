const express = require("express"),
    router     = express.Router(),
    controller = require("./products.controller")

router.get("/",controller.get );
router.get("/best-seller",controller.fillter)
router.get("/:id",controller.getById)
router.post("/",controller.create );


module.exports = router;
