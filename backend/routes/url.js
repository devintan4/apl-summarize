const express = require("express");
const { handleSummarizeUrl } = require("../controllers/summarizeController");
const router = express.Router();

router.post("/", handleSummarizeUrl);

module.exports = router;
