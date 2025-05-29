const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const upload = require('../middleware/uploadConfig');
const { summarize } = require('../services/summarizeService');
const { resultsDir, uploadsDir } = require('../config');

const router = express.Router();

// Pastikan folder results
fs.mkdir(resultsDir, { recursive: true }).catch(console.error);

router.post('/', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'File tidak valid' });

    const pdfPath = path.join(uploadsDir, req.file.filename);
    const txtName = req.file.filename.replace(/\.pdf$/, '.txt');
    const txtPath = path.join(resultsDir, txtName);

    await summarize(pdfPath, txtPath);
    const data = await fs.readFile(txtPath, 'utf-8');

    res.json({ filename: txtName, summary: data });
  } catch (err) {
    next(err);
  }
});

module.exports = router;