/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */
const Product = require('../models/product.model');
const { toPublicPath, removeUpload } = require('../middlewares/multer');
const { HttpError, readString } = require('../utils/request');

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */

/**
 * Read a non-negative number from the request (form fields arrive as strings).
 * @param {*} value
 * @param {string} name
 * @returns {number|undefined}
 */
const readNumber = (value, name) => {
  if (value === undefined || value === '') return undefined;
  const number = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(number) || number < 0) {
    throw new HttpError(422, `${name} must be a number of 0 or more`);
  }
  return number;
};

/**
 * Only these fields are read from the request body.
 * @param {object} body
 */
const pickFields = (body = {}) => {
  const fields = {
    name: readString(body.name, 'name'),
    description: readString(body.description, 'description'),
    price: readNumber(body.price, 'price'),
    quantity: readNumber(body.quantity, 'quantity'),
  };
  return Object.fromEntries(
    Object.entries(fields).filter(([, value]) => value !== undefined),
  );
};

/* -------------------------------------------------------------------------- */
/*                             Product Controller                             */
/* -------------------------------------------------------------------------- */

/**
 * Create a product, with an optional photo.
 */
const createProduct = async (req, res) => {
  const photo = req.files?.photo?.[0];
  try {
    const product = await Product.create({
      ...pickFields(req.body),
      photo: photo ? toPublicPath(photo) : '',
    });
    res.status(201).json({ success: true, product });
  } catch (error) {
    if (photo) await removeUpload(toPublicPath(photo));
    throw error;
  }
};

/**
 * List products, newest first: ?page=1&limit=20, and ?q=word to search names.
 */
const getAllProducts = async (req, res) => {
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const limit = Math.min(
    100,
    Math.max(1, Number.parseInt(req.query.limit, 10) || 20),
  );
  const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
  // Escape the search text so it is matched literally, never as a regex.
  const filter = q
    ? { name: new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') }
    : {};

  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Product.countDocuments(filter),
  ]);

  res.json({
    success: true,
    products,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
};

/**
 * Get a product by id.
 */
const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new HttpError(404, 'Product not found');
  res.json({ success: true, product });
};

/**
 * Update a product. A new photo replaces the old one.
 */
const updateProductById = async (req, res) => {
  const photo = req.files?.photo?.[0];
  try {
    const product = await Product.findById(req.params.id);
    if (!product) throw new HttpError(404, 'Product not found');

    const previousPhoto = product.photo;
    product.set(pickFields(req.body));
    if (photo) product.photo = toPublicPath(photo);
    await product.save();
    if (photo) await removeUpload(previousPhoto);

    res.json({ success: true, product });
  } catch (error) {
    if (photo) await removeUpload(toPublicPath(photo));
    throw error;
  }
};

/**
 * Delete a product and its photo.
 */
const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw new HttpError(404, 'Product not found');
  await removeUpload(product.photo);
  res.json({ success: true, message: 'Product deleted' });
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProduct,
};
