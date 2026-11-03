/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */
const { rateLimit } = require('express-rate-limit');
const { env } = require('../config/env');

/* -------------------------------------------------------------------------- */
/*                                 Rate limits                                */
/* -------------------------------------------------------------------------- */

// Protects the database from request floods on every API route.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: env.apiRateLimit,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests, please try again later',
  },
});

module.exports = { apiLimiter };
