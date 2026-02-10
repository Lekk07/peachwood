import mongoose from 'mongoose';

/**
 * Order Schema
 * Defines the structure of customer orders in the database
 */
const orderSchema = new mongoose.Schema(
  {
    // Order Items
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        name: {
          type: String,
          required: true
        },
        price: {
          type: Number,
          required: true,
          min: 0
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1
        },
        subtotal: {
          type: Number,
          required: true,
          min: 0
        }
      }
    ],

    // Customer Information
    customerDetails: {
      firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true
      },
      lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true
      },
      email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          'Please provide a valid email address'
        ]
      },
      phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true
      },
      address: {
        street: {
          type: String,
          required: [true, 'Street address is required'],
          trim: true
        },
        city: {
          type: String,
          required: [true, 'City is required'],
          trim: true
        },
        state: {
          type: String,
          required: [true, 'State is required'],
          trim: true
        },
        zipCode: {
          type: String,
          required: [true, 'ZIP code is required'],
          trim: true
        },
        country: {
          type: String,
          required: true,
          default: 'United States',
          trim: true
        }
      }
    },

    // Order Financial Details
    subtotal: {
      type: Number,
      required: true,
      min: 0
    },
    tax: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    shippingCost: {
      type: Number,
      default: 0,
      min: 0
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: 0
    },

    // Order Status
    status: {
      type: String,
      enum: {
        values: ['Pending', 'Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        message: 'Invalid order status'
      },
      default: 'Placed'
    },

    // Payment Information (Demo - not real payment)
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed'],
      default: 'Paid'
    },

    // Order Number (auto-generated)
    orderNumber: {
      type: String,
      unique: true,
      required: true
    },

    // Shipping Information
    shippingMethod: {
      type: String,
      default: 'Standard Shipping'
    },
    trackingNumber: {
      type: String,
      default: null
    },

    // Additional Notes
    notes: {
      type: String,
      maxlength: 500
    }
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt
  }
);

// Index for faster queries
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ 'customerDetails.email': 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

// Virtual field for customer full name
orderSchema.virtual('customerFullName').get(function() {
  return `${this.customerDetails.firstName} ${this.customerDetails.lastName}`;
});

// Virtual field for formatted total
orderSchema.virtual('formattedTotal').get(function() {
  return `$${this.totalAmount.toFixed(2)}`;
});

// Pre-save middleware to generate order number
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    // Generate order number: PW + timestamp + random 4 digits
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(1000 + Math.random() * 9000);
    this.orderNumber = `PW${timestamp}${random}`;
  }
  next();
});

// Static method to get recent orders
orderSchema.statics.getRecentOrders = function(limit = 10) {
  return this.find().sort({ createdAt: -1 }).limit(limit);
};

// Instance method to calculate total items
orderSchema.methods.getTotalItems = function() {
  return this.products.reduce((total, item) => total + item.quantity, 0);
};

const Order = mongoose.model('Order', orderSchema);

export default Order;
