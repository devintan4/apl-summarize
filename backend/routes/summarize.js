const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Konfigurasi direktori
const uploadsDir = path.join(__dirname, '..', 'uploads');
const resultsDir = path.join(__dirname, '..', 'results');

// Pastikan folder uploads dan results ada
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
if (!fs.existsSync(resultsDir)) fs.mkdirSync(resultsDir);

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Filter hanya file PDF
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'), false);
  }
};

// Konfigurasi upload
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded or invalid format' });
  }

  const uploadedFilename = req.file.filename;
  const filePath = path.join(uploadsDir, uploadedFilename);
  const txtFilename = uploadedFilename.replace(/\.pdf$/, '.txt');
  const outputPath = path.join(resultsDir, txtFilename);

  const pythonScript = path.join(__dirname, '..', '..', 'machine-learning', 'run_summarize.py');
  const pythonExec = `"C:\\Users\\ROG\\Miniconda3\\envs\\pdf-summarizer\\python.exe"`; // Ganti jika beda

  console.log("📥 File received:", uploadedFilename);
  console.log("🔁 Running summarizer...");

  exec(`${pythonExec} "${pythonScript}" "${filePath}" -o "${outputPath}"`, (err, stdout, stderr) => {
    if (err) {
      console.error("❌ PYTHON ERROR:", stderr);
      return res.status(500).json({ error: 'Summarization failed' });
    }

    console.log("✅ Done summarizing");

    // Kirim ringkasan dari file .txt
    fs.readFile(outputPath, 'utf-8', (readErr, data) => {
      if (readErr) {
        return res.status(500).json({ error: 'Could not read summary output' });
      }

      res.json({
        filename: txtFilename,
        summary: data
      });
    });
  });
});

module.exports = router;
