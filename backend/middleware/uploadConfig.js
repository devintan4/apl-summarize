const multer = require('multer');
const path = require('path');
const { uploadsDir } = require('../config');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/\s+/g, '_').toLowerCase();
    cb(null, `${timestamp}_${safeName}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMime = 'application/pdf';
  if (file.mimetype === allowedMime) {
    cb(null, true);
  } else {
    cb(new Error('Tipe file tidak valid: hanya PDF yang diizinkan'), false);
  }
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; 

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE
  }
});

module.exports = upload;
