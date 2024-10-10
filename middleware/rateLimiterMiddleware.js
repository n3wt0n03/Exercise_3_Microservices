const rateLimit = require('express-rate-limit');

const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each requests to 10 per windowMs
  message: 'Too many requests, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = apiRateLimiter;
