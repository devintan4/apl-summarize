const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 menit
  max: 10, // maksimal 10 request per menit
  message: '🚫 Too many requests, please try again later.',
});

module.exports = limiter;
