/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */
const fs = require('fs');
const Product = require('../models/product.model');

/* -------------------------------------------------------------------------- */
/*                              Product Controller                            */
/* -------------------------------------------------------------------------- */

/**
 * Create a new product
 * @param {Object} req - Request object containing product data
 * @param {Object} res - Response object to send JSON response
 */
const createProduct = async (req, res) => {
  try {
    const { name, description, price, quantity } = req.body;

    // Check if all required fields are provided
    if (!name || !description || !price || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Create a new product instance
    const newProduct = new Product({
      name,
      description,
      price,
      quantity,
      photo: req.files?.photo ? req.files.photo[0].path.replace('\\', '/') : '',
    });

    // Save the new product
    await newProduct.save();

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: newProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'An error occurred while creating the product',
      error: error.message,
    });
  }
};

/**
 * Retrieves all products
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Retrieves a product by ID
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
const getProductById = async (req, res) => {
  try {
    const foundProduct = await Product.findById(req.params.id);
    res
      .status(foundProduct ? 200 : 404)
      .json({ success: !!foundProduct, product: foundProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Update a product by ID
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
const updateProductById = async (req, res) => {
  try {
    const { id } = req.params;
    let foundProduct = await Product.findById(id);

    const updateImages = {};
    if (req.files?.photo) {
      if (foundProduct.photo !== '') fs.unlinkSync(foundProduct.photo);
      updateImages.photo = req.files.photo[0].path.replace('\\', '/');
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        ...updateImages,
        ...req.body,
        updatedAt: Date.now(),
      },
      { new: true },
    );

    res.status(updatedProduct ? 200 : 404).json({
      success: !!updatedProduct,
      message: updatedProduct
        ? 'Product updated successfully'
        : 'Product not found',
      updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Deletes a product by ID
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
    }
    if (product.photo !== '') fs.unlinkSync(product.photo);
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.status(deletedProduct ? 200 : 404).json({
      success: !!deletedProduct,
      message: deletedProduct
        ? 'Product deleted successfully'
        : 'Product not found',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProduct,
};
