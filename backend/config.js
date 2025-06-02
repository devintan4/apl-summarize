require("dotenv").config();
const path = require("path");

module.exports = {
  port: process.env.PORT || 3000,
  pythonExec:
    process.env.PYTHON_PATH ||
    "C:/Users/vnine/anaconda3/envs/pdf_summarizer/python.exe",
  pythonScript: path.join(
    __dirname,
    "..",
    "machine-learning",
    "run_summarize.py"
  ),
  uploadsDir: path.join(__dirname, "uploads"),
  resultsDir: path.join(__dirname, "results"),
};
