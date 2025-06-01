const path = require('path');
const { summarize } = require('../services/summarizeService');
const { uploadsDir, resultsDir } = require('../config');

/**
 * handleSummarize
 * Handler untuk POST /summarize
 */
async function handleSummarize(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded or invalid format (only PDF allowed)'
      });
    }

    const uploadedFilename = req.file.filename;        // misal: "1612345678900‐myfile.pdf"
    const pdfPath = path.join(uploadsDir, uploadedFilename);

    const txtFilename = uploadedFilename.replace(/\.pdf$/i, '.txt'); // "1612345678900‐myfile.txt"
    const outputPath = path.join(resultsDir, txtFilename);

    console.log('📥 File diterima:', uploadedFilename);
    console.log('🔁 Memulai proses summarization...');

    const summaryText = await summarize(pdfPath, outputPath);

    console.log('✅ Summarization selesai:', txtFilename);

    res.json({
      filename: txtFilename,
      summary: summaryText
    });
  } catch (err) {
    console.error('❌ Error di controller:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
}

module.exports = { handleSummarize };
