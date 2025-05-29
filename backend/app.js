const express = require('express');
const logger = require('winston');
const cors = require('cors');
const config = require('./config');
const uploadRouter = require('./routes/upload');

const app = express();

app.use(cors());
app.use(express.json());

// Logger sederhana
logger.level = 'info';

app.use('/api/summarize', uploadRouter);

app.use('/uploads', express.static('uploads'));

app.listen(config.port, () => {
  logger.info(`Server jalan di http://localhost:${config.port}`);
});
