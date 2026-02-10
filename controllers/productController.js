import Product from '../models/Product.js';

/**
 * Product Controller
 * Handles all product-related business logic
 */

/**
 * @desc    Get all products
 * @route   GET /api/products
 * @access  Public
 */
export const getAllProducts = async (req, res) => {
  try {
    // Get query parameters for filtering and sorting
    const { category, minPrice, maxPrice, sort } = req.query;

    // Build query object
    let query = { inStock: true };

    // Filter by category if provided
    if (category && category !== 'All') {
      query.category = category;
    }

    // Filter by price range if provided
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Build sort object
    let sortOption = {};
    if (sort === 'price-low') {
      sortOption = { price: 1 };
    } else if (sort === 'price-high') {
      sortOption = { price: -1 };
    } else if (sort === 'name') {
      sortOption = { name: 1 };
    } else {
      sortOption = { createdAt: -1 }; // Default: newest first
    }

    // Execute query
    const products = await Product.find(query).sort(sortOption);

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
};

/**
 * @desc    Get single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find product by ID
    const product = await Product.findById(id);

    // Check if product exists
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });

  } catch (error) {
    console.error('Error fetching product:', error);
    
    // Handle invalid MongoDB ID format
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message
    });
  }
};

/**
 * @desc    Get products by category
 * @route   GET /api/products/category/:category
 * @access  Public
 */
export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    // Valid categories
    const validCategories = ['Necklaces', 'Earrings', 'Rings', 'Bracelets'];

    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category. Must be one of: ' + validCategories.join(', ')
      });
    }

    const products = await Product.findByCategory(category);

    res.status(200).json({
      success: true,
      category,
      count: products.length,
      data: products
    });

  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
};

/**
 * @desc    Create a new product (Admin)
 * @route   POST /api/products
 * @access  Private/Admin (for future implementation)
 */
export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });

  } catch (error) {
    console.error('Error creating product:', error);

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
      message: 'Failed to create product',
      error: error.message
    });
  }
};

/**
 * @desc    Update a product (Admin)
 * @route   PUT /api/products/:id
 * @access  Private/Admin (for future implementation)
 */
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true, // Return updated document
        runValidators: true // Run schema validators
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });

  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message
    });
  }
};

/**
 * @desc    Delete a product (Admin)
 * @route   DELETE /api/products/:id
 * @access  Private/Admin (for future implementation)
 */
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      data: {}
    });

  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message
    });
  }
};
