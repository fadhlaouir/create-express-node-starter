/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */
// Packages
const crypto = require('crypto');

// Models
const User = require('../models/user.model');

// Token
const jwt = require('jsonwebtoken');

/* -------------------------------------------------------------------------- */
/*                                   HELPERS                                  */
/* -------------------------------------------------------------------------- */
/**
 * Sign up a new user
 * @param {Object} req - Request object containing user data
 * @param {Object} res - Response object to send JSON response
 */
const register = async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: 'Please provide your email and password',
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    const newUser = new User({
      email,
      password,
      photo: req.files?.photo ? req.files.photo[0].path.replace('\\', '/') : '',
      fullName,
      joined_at: new Date(),
    });

    await newUser.save();

    return res.json({
      success: true,
      message: 'User registered successfully. You can now sign in',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'An error occurred while registering the user',
      error: error.message,
    });
  }
};

/**
 * Sign in with an existing account
 * @param {Object} req - Request object containing user credentials
 * @param {Object} res - Response object to send JSON response
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const foundUser = await User.findOne({ email });

    if (!foundUser || !foundUser.comparePassword(password)) {
      return res.status(403).json({
        success: false,
        message: 'Authentication failed. Incorrect email or password',
      });
    }

    const token = jwt.sign(foundUser.toJSON(), process.env.SECRET, {
      expiresIn: '7d',
    });

    return res.json({
      success: true,
      token,
      user: {
        _id: foundUser._id,
        email: foundUser.email,
        fullName: foundUser.fullName,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'An error occurred during authentication',
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
};
