/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */
// Packages
const router = require('express').Router();

// Middlewares
const { fileUpload } = require('../middlewares/multer');

// controllers
const authController = require('../controllers/auth.controller');

/* -------------------------------------------------------------------------- */
/*                                 Auth Route                                 */
/* -------------------------------------------------------------------------- */

// POST request - create new user
router.post('/auth/register', fileUpload, authController.register);

// POST request - sign in as a user
router.post('/auth/login', authController.login);

module.exports = router;
