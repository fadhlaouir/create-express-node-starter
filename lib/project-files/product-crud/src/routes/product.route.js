/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */
// Packages
const router = require('express').Router();

// Middleware
const { fileUpload } = require('../middlewares/multer');

// Local controllers
const productController = require('../controllers/product.controller');

/* -------------------------------------------------------------------------- */
/*                               Product Route                                */
/* -------------------------------------------------------------------------- */

// POST request - Create a new product
router.post('/product', fileUpload, productController.createProduct);

// GET request - Get all products
router.get('/products', productController.getAllProducts);

// GET request - Get product by ID
router.get('/products/:id', productController.getProductById);

// PUT request - Update product by ID
router.put('/products/:id', fileUpload, productController.updateProductById);

// DELETE request - Delete product by ID
router.delete('/products/:id', productController.deleteProduct);

module.exports = router;
