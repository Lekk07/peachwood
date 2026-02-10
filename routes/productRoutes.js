import express from 'express';
import Product from '../models/Product.js';
import {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';

const router = express.Router();

/**
 * Product Routes
 */

// Get all products (with optional filtering and sorting)
// GET /api/products?category=Rings&minPrice=50&maxPrice=200&sort=price-low
router.get('/', getAllProducts);

// Get products by category
// GET /api/products/category/Necklaces
router.get('/category/:category', getProductsByCategory);

// Get single product by ID
// GET /api/products/123abc
router.get('/:id', getProductById);

// Create new product (Admin - for future implementation)
// POST /api/products
router.post('/', createProduct);

// Update product (Admin - for future implementation)
// PUT /api/products/123abc
router.put('/:id', updateProduct);

// Delete product (Admin - for future implementation)
// DELETE /api/products/123abc
router.delete('/:id', deleteProduct);

export default router;
