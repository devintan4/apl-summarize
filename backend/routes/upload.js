const express = require("express");
const upload = require("../middleware/uploadConfig");
const { handleSummarize } = require("../controllers/summarizeController");
const router = express.Router();

router.post("/", upload.single("file"), handleSummarize);

module.exports = router;
