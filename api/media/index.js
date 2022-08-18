const express = require("express");
const router = express.Router();
const controller = require("./media.controller");
const multer = require("multer");
const upload = multer({ dest: 'uploads/' })

router.post("/upload", upload.single('bookCover') ,controller.upload);

module.exports = router;
