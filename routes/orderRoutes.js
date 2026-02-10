import express from 'express';
import Order from "../models/Order.js";

import {
  createOrder,
  getOrderById,
  getOrderByNumber,
  getAllOrders,
  updateOrderStatus,
  cancelOrder
} from '../controllers/orderController.js';

const router = express.Router();

/**
 * Order Routes
 */

// Create a new order
// POST /api/orders
router.post('/', createOrder);

// Get all orders (Admin - for future implementation)
// GET /api/orders?status=Placed&limit=50&page=1
router.get('/', getAllOrders);

// Get order by order number
// GET /api/orders/number/PW1234567890
router.get('/number/:orderNumber', getOrderByNumber);

// Get order by ID
// GET /api/orders/123abc
router.get('/:id', getOrderById);

// Update order status (Admin - for future implementation)
// PATCH /api/orders/123abc/status
router.patch('/:id/status', updateOrderStatus);

// Cancel order
// PATCH /api/orders/123abc/cancel
router.patch('/:id/cancel', cancelOrder);

export default router;
