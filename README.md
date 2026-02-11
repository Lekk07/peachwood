<<<<<<< HEAD
# Peachwood Jewellery - Backend API

A complete RESTful API backend for the Peachwood luxury jewellery e-commerce platform built with Node.js, Express, and MongoDB.

## 🚀 Features

- **Product Management**: Full CRUD operations for jewellery products
- **Order Processing**: Complete order management system
- **MongoDB Integration**: Robust data persistence with Mongoose ODM
- **RESTful API**: Clean, well-documented API endpoints
- **Error Handling**: Comprehensive error handling and validation
- **CORS Enabled**: Ready for frontend integration
- **Seed Data**: Sample jewellery products for testing

## 📁 Project Structure

```
peachwood-backend/
├── config/
│   └── db.js                 # MongoDB connection configuration
├── models/
│   ├── Product.js            # Product schema and model
│   └── Order.js              # Order schema and model
├── routes/
│   ├── productRoutes.js      # Product API routes
│   └── orderRoutes.js        # Order API routes
├── controllers/
│   ├── productController.js  # Product business logic
│   └── orderController.js    # Order business logic
├── seed/
│   └── seedProducts.js       # Database seeding script
├── server.js                 # Main application entry point
├── package.json              # Dependencies and scripts
├── .env.example              # Environment variables template
└── .gitignore                # Git ignore rules
```

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Environment**: dotenv
- **CORS**: cors middleware

## ⚡ Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

### Installation

1. **Navigate to the backend directory**
   ```bash
   cd peachwood-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example env file
   cp .env.example .env
   
   # Edit .env and add your MongoDB connection string
   # For local MongoDB:
   MONGODB_URI=mongodb://localhost:27017/peachwood
   PORT=5000
   NODE_ENV=development
   
   # For MongoDB Atlas (cloud):
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/peachwood
   ```

4. **Start MongoDB** (if using local installation)
   ```bash
   # On macOS with Homebrew:
   brew services start mongodb-community
   
   # On Ubuntu:
   sudo systemctl start mongod
   
   # On Windows:
   # MongoDB should start automatically as a service
   ```

5. **Seed the database with sample products**
   ```bash
   npm run seed
   ```

6. **Start the server**
   ```bash
   # Development mode (with auto-restart on file changes)
   npm run dev
   
   # Production mode
   npm start
   ```

7. **Verify the server is running**
   - Open your browser and navigate to: `http://localhost:5000`
   - You should see the API documentation

## 📡 API Endpoints

### Products

#### Get All Products
```http
GET /api/products
```

**Query Parameters:**
- `category` - Filter by category (Necklaces, Earrings, Rings, Bracelets)
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `sort` - Sort order (price-low, price-high, name)

**Example:**
```bash
GET /api/products?category=Rings&minPrice=50&maxPrice=200&sort=price-low
```

**Response:**
```json
{
  "success": true,
  "count": 12,
  "data": [
    {
      "_id": "123abc",
      "name": "Eternal Grace Necklace",
      "price": 189.99,
      "description": "A delicate handcrafted necklace...",
      "imageUrl": "https://...",
      "category": "Necklaces",
      "details": ["18K gold-plated brass", "..."],
      "inStock": true,
      "stockQuantity": 50,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Get Product by ID
```http
GET /api/products/:id
```

**Example:**
```bash
GET /api/products/123abc
```

#### Get Products by Category
```http
GET /api/products/category/:category
```

**Example:**
```bash
GET /api/products/category/Necklaces
```

### Orders

#### Create New Order
```http
POST /api/orders
```

**Request Body:**
```json
{
  "products": [
    {
      "productId": "123abc",
      "quantity": 2
    }
  ],
  "customerDetails": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "5551234567",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "United States"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "_id": "order123",
    "orderNumber": "PW1234567890",
    "products": [...],
    "customerDetails": {...},
    "subtotal": 379.98,
    "tax": 37.99,
    "totalAmount": 417.97,
    "status": "Placed",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Get Order by ID
```http
GET /api/orders/:id
```

**Example:**
```bash
GET /api/orders/order123
```

#### Get Order by Order Number
```http
GET /api/orders/number/:orderNumber
```

**Example:**
```bash
GET /api/orders/number/PW1234567890
```

#### Get All Orders (Admin)
```http
GET /api/orders
```

**Query Parameters:**
- `status` - Filter by order status
- `limit` - Number of results per page (default: 50)
- `page` - Page number (default: 1)

#### Update Order Status (Admin)
```http
PATCH /api/orders/:id/status
```

**Request Body:**
```json
{
  "status": "Shipped"
}
```

#### Cancel Order
```http
PATCH /api/orders/:id/cancel
```

## 📊 Database Models

### Product Schema

```javascript
{
  name: String (required),
  price: Number (required),
  description: String (required),
  imageUrl: String (required),
  category: String (required, enum: ['Necklaces', 'Earrings', 'Rings', 'Bracelets']),
  details: [String],
  inStock: Boolean (default: true),
  stockQuantity: Number (default: 100),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Order Schema

```javascript
{
  orderNumber: String (unique, auto-generated),
  products: [{
    productId: ObjectId (ref: Product),
    name: String,
    price: Number,
    quantity: Number,
    subtotal: Number
  }],
  customerDetails: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    }
  },
  subtotal: Number,
  tax: Number,
  shippingCost: Number (default: 0),
  totalAmount: Number,
  status: String (enum: ['Pending', 'Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled']),
  paymentStatus: String (enum: ['Pending', 'Paid', 'Failed']),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## 🔧 Scripts

```bash
# Start server (production)
npm start

# Start server (development with auto-restart)
npm run dev

# Seed database with sample products
npm run seed
```

## 🌐 Connecting Frontend to Backend

### Update Frontend API Calls

In your React frontend, update the API base URL to point to the backend:

```javascript
// In your frontend - create an API config file
const API_BASE_URL = 'http://localhost:5000/api';

// Example: Fetch products
const fetchProducts = async () => {
  const response = await fetch(`${API_BASE_URL}/products`);
  const data = await response.json();
  return data;
};

// Example: Create order
const createOrder = async (orderData) => {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  });
  const data = await response.json();
  return data;
};
```

### Frontend Integration Checklist

- [ ] Update all API calls to use backend endpoints
- [ ] Replace mock product data with API calls
- [ ] Update order creation to POST to backend
- [ ] Handle API errors appropriately
- [ ] Add loading states for API calls
- [ ] Test all features end-to-end

## 🔐 Environment Variables

Create a `.env` file with the following variables:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/peachwood

# Server Configuration
PORT=5000
NODE_ENV=development
```

## 🚨 Error Handling

The API uses consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (development only)"
}
```

**HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

## 🧪 Testing the API

### Using cURL

```bash
# Get all products
curl http://localhost:5000/api/products

# Get product by ID
curl http://localhost:5000/api/products/PRODUCT_ID

# Create an order
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "products": [{"productId": "PRODUCT_ID", "quantity": 1}],
    "customerDetails": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "5551234567",
      "address": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001"
    }
  }'
```

### Using Postman

1. Import the following endpoints into Postman
2. Set the base URL to `http://localhost:5000`
3. Test each endpoint with sample data

### Using Browser

Simply navigate to:
- `http://localhost:5000` - API documentation
- `http://localhost:5000/api/products` - View all products
- `http://localhost:5000/health` - Health check

## 📝 Notes

- **Payment Processing**: This is a demo backend with simulated payment. All orders are automatically marked as "Paid".
- **Stock Management**: Product stock is tracked but not automatically decremented (can be enabled in controller).
- **Authentication**: Not implemented in this version (add JWT for production).
- **File Uploads**: Not implemented (use Cloudinary or AWS S3 for production).

## 🔮 Future Enhancements

- [ ] User authentication and authorization (JWT)
- [ ] Admin dashboard endpoints
- [ ] Email notifications for orders
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Image upload for products
- [ ] Advanced search and filters
- [ ] Order tracking system
- [ ] Inventory management

## 🐛 Troubleshooting

### MongoDB Connection Issues

**Problem**: Cannot connect to MongoDB

**Solutions**:
1. Ensure MongoDB is running: `brew services list` (macOS) or `sudo systemctl status mongod` (Linux)
2. Check your connection string in `.env`
3. For MongoDB Atlas, ensure your IP is whitelisted
4. Verify your username/password are correct

### Port Already in Use

**Problem**: Error: Port 5000 is already in use

**Solution**:
1. Change the port in `.env`: `PORT=5001`
2. Or kill the process using port 5000:
   ```bash
   # Find process
   lsof -i :5000
   # Kill process
   kill -9 PID
   ```

### Seed Script Fails

**Problem**: Seed script doesn't populate database

**Solution**:
1. Ensure MongoDB is running
2. Check `.env` has correct MONGODB_URI
3. Delete the database and try again:
   ```bash
   # In MongoDB shell
   use peachwood
   db.dropDatabase()
   ```

## 📄 License

This project is open source and available for educational purposes.

## 🤝 Contributing

This is a demo project for learning purposes. Feel free to fork and enhance!

---

**Built with ❤️ using Node.js, Express, and MongoDB**

For questions or issues, please open an issue on the repository.
=======
Peachwood jewellery website
>>>>>>> fb2fc5e6cab04f57743eae58614130b0b77485da
