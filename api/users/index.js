const express = require("express"),
  router      = express.Router(),
  jwt         = require("../../auth/token"),
  controller  = require("./users.controller");

router.get("/", jwt.auth, controller.get);
router.post("/register", controller.create);
router.post("/login", controller.login);

module.exports = router;
