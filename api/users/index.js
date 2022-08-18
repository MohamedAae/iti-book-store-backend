const express = require("express"),
  router      = express.Router(),
  jwt         = require("../../auth/token"),
  controller  = require("./users.controller");
const {hasAccess} = require("../../auth/token");

router.get("/", jwt.auth, controller.get);
router.post( "/:id/permissions", jwt.hasAccess, controller.getPermissions);
router.post("/register", controller.create);
router.post("/login", controller.login);
router.post("/exists", controller.checkIfExist);

module.exports = router;
