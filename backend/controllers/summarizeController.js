const path = require("path");
const fs = require("fs").promises;
const axios = require("axios");
const { summarize } = require("../services/summarizeService");
const { uploadsDir, resultsDir } = require("../config");

async function handleSummarize(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "No file uploaded or invalid format (only PDF allowed)",
      });
    }

    const uploadedFilename = req.file.filename;
    const pdfPath = path.join(uploadsDir, uploadedFilename);

    const txtFilename = uploadedFilename.replace(/\.pdf$/i, ".txt");
    const outputPath = path.join(resultsDir, txtFilename);

    console.log("📥 File diterima:", uploadedFilename);
    console.log("🔁 Memulai proses summarization...");

    const summaryText = await summarize(pdfPath, outputPath);

    console.log("✅ Summarization selesai:", txtFilename);

    res.json({
      filename: txtFilename,
      summary: summaryText,
    });
  } catch (err) {
    next(err);
  }
}

async function handleSummarizeUrl(req, res, next) {
  try {
    let { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: "No URL provided" });
    }

    // Jika Google Drive share-link: https://drive.google.com/file/d/<ID>/view?...
    // ubah menjadi direct-download:
    const driveMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (driveMatch) {
      const fileId = driveMatch[1];
      url = `https://drive.google.com/uc?export=download&id=${fileId}`;
      console.log("🔄 Google Drive link detected, using direct URL:", url);
    }

    console.log("📥 URL diterima:", url);

    // Download file PDF sebagai arraybuffer
    const response = await axios.get(url, { responseType: "arraybuffer" });

    const timestamp = Date.now();
    const pdfName = `${timestamp}.pdf`;
    const pdfPath = path.join(uploadsDir, pdfName);
    await fs.writeFile(pdfPath, response.data);

    const txtName = pdfName.replace(/\.pdf$/i, ".txt");
    const outputPath = path.join(resultsDir, txtName);

    console.log("🔁 Memulai proses summarization via URL...");

    const summaryText = await summarize(pdfPath, outputPath);

    console.log("✅ Summarization via URL selesai:", txtName);

    res.json({
      filename: txtName,
      summary: summaryText,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  handleSummarize,
  handleSummarizeUrl,
};
