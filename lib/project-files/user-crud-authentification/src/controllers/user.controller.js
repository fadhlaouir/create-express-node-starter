/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */
const fs = require('fs');
const User = require('../models/user.model');

/* -------------------------------------------------------------------------- */
/*                               User Controller                              */
/* -------------------------------------------------------------------------- */

/**
 * Retrieves the current user object
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
const getCurrentUser = async (req, res) => {
  try {
    const foundUser = await User.findById(req.decoded._id);
    res
      .status(foundUser ? 200 : 404)
      .json({ success: !!foundUser, user: foundUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Retrieves a user by ID
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
const getUserById = async (req, res) => {
  try {
    const foundUser = await User.findById(req.params.id);
    res
      .status(foundUser ? 200 : 404)
      .json({ success: !!foundUser, user: foundUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Update a user by ID
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
const updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    let foundUser = await User.findById(id);

    const updateImages = {};
    if (req.files?.photo) {
      if (foundUser.photo !== '') fs.unlinkSync(foundUser.photo);
      updateImages.photo = req.files.photo[0].path.replace('\\', '/');
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        ...updateImages,
        ...req.body,
        updated_at: Date.now(),
      },
      { new: true },
    );

    res.status(updatedUser ? 200 : 404).json({
      success: !!updatedUser,
      message: updatedUser ? 'User updated successfully' : 'User not found',
      updatedUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Retrieves all users
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Deletes a user by ID
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (user.photo !== '') fs.unlinkSync(user.photo);
    const deletedUser = await User.findByIdAndDelete(id);
    res.status(deletedUser ? 200 : 404).json({
      success: !!deletedUser,
      message: deletedUser ? 'User deleted successfully' : 'User not found',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCurrentUser,
  getUserById,
  updateUserById,
  getAllUsers,
  deleteUser,
};
