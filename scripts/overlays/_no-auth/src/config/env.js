/* -------------------------------------------------------------------------- */
/*                                Environment                                 */
/* -------------------------------------------------------------------------- */
// Reads every setting in one place. `npm start` and `npm run dev` load `.env`
// with Node's --env-file-if-exists; in production, set real environment variables.

const isProduction = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction,
  isTest,
  port: Number(process.env.PORT) || 5000,

  // Database
  databaseUrl: isProduction
    ? process.env.PROD_DATABASE
    : process.env.DEV_DATABASE,

  // Allowed CORS origins (comma-separated, or *)
  corsOrigin: process.env.CORS_ORIGIN || '*',
};

/**
 * Fail fast on settings the API cannot run without.
 */
function assertRequiredEnv() {
  if (!env.databaseUrl) {
    const name = isProduction ? 'PROD_DATABASE' : 'DEV_DATABASE';
    throw new Error(
      `Missing environment variable: ${name}. Copy .env.example to .env and fill it in.`,
    );
  }
}

module.exports = { env, assertRequiredEnv };
