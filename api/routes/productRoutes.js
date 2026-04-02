const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const router = express.Router();

// GET /api/products - Get all products
router.get('/', getProducts);

// GET /api/products/:id - Get product by ID
router.get('/:id', getProductById);

// POST /api/products - Create new product
router.post('/', protect, adminOnly, createProduct);

// PUT /api/products/:id - Update product
router.put('/:id', protect, adminOnly, updateProduct);

// DELETE /api/products/:id - Delete product
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
