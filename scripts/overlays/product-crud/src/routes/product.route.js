/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */
const router = require('express').Router();

// Middlewares
const { fileUpload } = require('../middlewares/multer');

// Controllers
const productController = require('../controllers/product.controller');

/* -------------------------------------------------------------------------- */
/*                                Product Route                               */
/* -------------------------------------------------------------------------- */
// These routes are public. Before going to production, protect the ones that
// change data, or start from the "Full Stack User Authentication" template.

// POST request - Create a product (multipart, optional `photo`)
router.post('/products', fileUpload, productController.createProduct);

// GET request - List products: ?page=1&limit=20&q=search
router.get('/products', productController.getAllProducts);

// GET request - Get a product
router.get('/products/:id', productController.getProductById);

// PUT request - Update a product (multipart, optional new `photo`)
router.put('/products/:id', fileUpload, productController.updateProductById);

// DELETE request - Delete a product and its photo
router.delete('/products/:id', productController.deleteProduct);

module.exports = router;
