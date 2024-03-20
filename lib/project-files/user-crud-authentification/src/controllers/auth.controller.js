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
const signUp = async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: 'Veuillez saisir votre email ou votre mot de passe',
      });
    }

    // Check if user with the provided email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Un utilisateur avec cet e-mail existe déjà',
      });
    }

    // Create a new user instance
    const newUser = new User({
      email,
      password,
      confirmationCode: crypto.randomBytes(20).toString('hex'),
      photo: req.files?.photo ? req.files.photo[0].path.replace('\\', '/') : '',
      fullName,
      joined_at: new Date(),
    });

    // Save the new user
    await newUser.save();

    return res.json({
      success: true,
      message:
        "L'utilisateur a été enregistré avec succès, veuillez vérifier votre email pour activer votre compte",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "Une erreur est survenue lors de l'enregistrement de l'utilisateur",
      error: error.message,
    });
  }
};

/**
 * Sign in with an existing account
 * @param {Object} req - Request object containing user credentials
 * @param {Object} res - Response object to send JSON response
 */
const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const foundUser = await User.findOne({ email });

    // If user not found or password doesn't match, return error
    if (!foundUser || !foundUser.comparePassword(password)) {
      return res.status(403).json({
        success: false,
        message: "Échec de l'authentification, email ou mot de passe incorrect",
      });
    }

    // Generate JWT token
    const token = jwt.sign(foundUser.toJSON(), process.env.SECRET, {
      expiresIn: '7d', // Token expires in 7 days
    });

    // Return success response with token and user information
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
      message: "Une erreur est survenue lors de l'authentification",
      error: error.message,
    });
  }
};

module.exports = {
  signUp,
  signIn,
};
