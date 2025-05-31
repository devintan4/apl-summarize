const express = require('express');
const uploadRoute = require('./routes/upload');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const pdfContentType = require('./middleware/pdfContentType');
const rateLimiter = require('./middleware/rateLimiter');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(logger);          // Logging semua request
app.use(rateLimiter);     // Batasi request user

// Route upload PDF
app.use('/upload', pdfContentType, uploadRoute);

app.use(errorHandler);    // Tangani error paling akhir

app.listen(PORT, () => console.log(`🚀 Server ready at http://localhost:${PORT}`));
