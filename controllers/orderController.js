import Order from '../models/Order.js';
import Product from '../models/Product.js';

/**
 * Order Controller
 * Handles all order-related business logic
 */

/**
 * @desc    Create a new order
 * @route   POST /api/orders
 * @access  Public
 */
export const createOrder = async (req, res) => {
  try {
    const { products, customerDetails, subtotal, tax, totalAmount } = req.body;

    // Validate required fields
    if (!products || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one product'
      });
    }

    if (!customerDetails) {
      return res.status(400).json({
        success: false,
        message: 'Customer details are required'
      });
    }

    // Verify products exist and calculate totals
    let calculatedSubtotal = 0;
    const validatedProducts = [];

    for (const item of products) {
      // Find product in database
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${item.productId} not found`
        });
      }

      // Check stock availability
      if (!product.isAvailable()) {
        return res.status(400).json({
          success: false,
          message: `Product "${product.name}" is currently out of stock`
        });
      }

      if (product.stockQuantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}". Available: ${product.stockQuantity}`
        });
      }

      // Calculate subtotal for this item
      const itemSubtotal = product.price * item.quantity;
      calculatedSubtotal += itemSubtotal;

      // Add validated product to array
      validatedProducts.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        subtotal: itemSubtotal
      });
    }

    // Calculate tax (10% for demo)
    const calculatedTax = calculatedSubtotal * 0.1;
    const calculatedTotal = calculatedSubtotal + calculatedTax;

    // Prepare customer address
    const address = {
      street: customerDetails.address,
      city: customerDetails.city,
      state: customerDetails.state,
      zipCode: customerDetails.zipCode,
      country: customerDetails.country || 'United States'
    };

    // Create order object
    const orderData = {
      products: validatedProducts,
      customerDetails: {
        firstName: customerDetails.firstName,
        lastName: customerDetails.lastName,
        email: customerDetails.email,
        phone: customerDetails.phone,
        address: address
      },
      subtotal: calculatedSubtotal,
      tax: calculatedTax,
      shippingCost: 0, // Free shipping
      totalAmount: calculatedTotal,
      status: 'Placed',
      paymentStatus: 'Paid' // Demo payment
    };

    // Create order in database
    const order = await Order.create(orderData);

    // Update product stock (optional - uncomment to enable)
    // for (const item of validatedProducts) {
    //   await Product.findByIdAndUpdate(
    //     item.productId,
    //     { $inc: { stockQuantity: -item.quantity } }
    //   );
    // }

    // Populate product details
    await order.populate('products.productId');

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order
    });

  } catch (error) {
    console.error('Error creating order:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
};

/**
 * @desc    Get order by ID
 * @route   GET /api/orders/:id
 * @access  Public
 */
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find order and populate product details
    const order = await Order.findById(id).populate('products.productId');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error('Error fetching order:', error);

    // Handle invalid MongoDB ID format
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message
    });
  }
};

/**
 * @desc    Get order by order number
 * @route   GET /api/orders/number/:orderNumber
 * @access  Public
 */
export const getOrderByNumber = async (req, res) => {
  try {
    const { orderNumber } = req.params;

    const order = await Order.findOne({ orderNumber }).populate('products.productId');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message
    });
  }
};

/**
 * @desc    Get all orders (Admin)
 * @route   GET /api/orders
 * @access  Private/Admin (for future implementation)
 */
export const getAllOrders = async (req, res) => {
  try {
    const { status, limit = 50, page = 1 } = req.query;

    // Build query
    let query = {};
    if (status) {
      query.status = status;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get orders with pagination
    const orders = await Order.find(query)
      .populate('products.productId')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(skip);

    // Get total count for pagination
    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: orders
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
};

/**
 * @desc    Update order status (Admin)
 * @route   PATCH /api/orders/:id/status
 * @access  Private/Admin (for future implementation)
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Pending', 'Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
      });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).populate('products.productId');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });

  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message
    });
  }
};

/**
 * @desc    Cancel order
 * @route   PATCH /api/orders/:id/cancel
 * @access  Public (with email verification in production)
 */
export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order can be cancelled
    if (['Shipped', 'Delivered', 'Cancelled'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel order with status: ${order.status}`
      });
    }

    order.status = 'Cancelled';
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });

  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order',
      error: error.message
    });
  }
};
