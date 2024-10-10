const rateLimit = require('express-rate-limit');

const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 20, 
  message: 'Too many requests, please try again after 15 minutes',
  standardHeaders: true, 
  legacyHeaders: false,
});

module.exports = apiRateLimiter;
