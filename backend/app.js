const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const uploadRoute = require('./routes/upload');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const pdfContentType = require('./middleware/pdfContentType');
const rateLimiter = require('./middleware/rateLimiter');
const { uploadsDir, resultsDir } = require('./config');

const app = express();

// pastikan folder upload & results ada sebelum server jalan
(async () => {
  try {
    await fs.mkdir(uploadsDir, { recursive: true });
    await fs.mkdir(resultsDir, { recursive: true });
    console.log('✔️  Folder uploads/ dan results/ siap digunakan');
  } catch (err) {
    console.error('❌ Gagal membuat folder uploads/ atau results/:', err);
    process.exit(1);
  }
})();

const PORT = process.env.PORT || 3000;

app.use(logger);          // Logging semua request
app.use(rateLimiter);     // Batasi request user

// Route upload PDF
app.use('/upload', pdfContentType, uploadRoute);

app.use(errorHandler);    // Tangani error paling akhir

app.listen(PORT, () => console.log(`🚀 Server ready at http://localhost:${PORT}`));
