import mongoose from 'mongoose';

/**
 * Product Schema
 * Defines the structure of jewellery products in the database
 */
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Product name cannot exceed 200 characters']
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative']
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    imageUrl: {
      type: String,
      required: [true, 'Product image URL is required']
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      enum: {
        values: ['Necklaces', 'Earrings', 'Rings', 'Bracelets'],
        message: 'Category must be Necklaces, Earrings, Rings, or Bracelets'
      }
    },
    details: {
      type: [String],
      default: []
    },
    inStock: {
      type: Boolean,
      default: true
    },
    stockQuantity: {
      type: Number,
      default: 100,
      min: [0, 'Stock quantity cannot be negative']
    }
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Index for faster queries
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });

// Virtual field for formatted price
productSchema.virtual('formattedPrice').get(function() {
  return `$${this.price.toFixed(2)}`;
});

// Static method to get products by category
productSchema.statics.findByCategory = function(category) {
  return this.find({ category, inStock: true });
};

// Instance method to check if product is available
productSchema.methods.isAvailable = function() {
  return this.inStock && this.stockQuantity > 0;
};

const Product = mongoose.model('Product', productSchema);

export default Product;
