/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */
// Environment variables
const { NODE_ENV, PRODUCTION_CLIENT_URL, DEVELOPMENT_CLIENT_URL } = process.env;

/* -------------------------------------------------------------------------- */
/*                                   HELPERS                                  */
/* -------------------------------------------------------------------------- */
// API endpoint
const API_ENDPOINT =
  NODE_ENV === 'production' ? PRODUCTION_CLIENT_URL : DEVELOPMENT_CLIENT_URL;

// export module
module.exports = {
  API_ENDPOINT,
};
