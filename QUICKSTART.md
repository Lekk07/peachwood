# 🚀 QUICK START GUIDE - Peachwood Backend

## Installation (3 Steps)

### Step 1: Install Dependencies
```bash
cd peachwood-backend
npm install
```

### Step 2: Configure Environment
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your settings:
MONGODB_URI=mongodb://localhost:27017/peachwood
PORT=5000
NODE_ENV=development
```

### Step 3: Start the Server
```bash
# Seed the database with sample products
npm run seed

# Start the server
npm run dev
```

## ✅ Verify It's Working

Open your browser and go to:
- **API Documentation**: http://localhost:5000
- **All Products**: http://localhost:5000/api/products
- **Health Check**: http://localhost:5000/health

---

## 📡 Main API Endpoints

### Products
```bash
# Get all products
GET http://localhost:5000/api/products

# Get single product
GET http://localhost:5000/api/products/:id

# Filter by category
GET http://localhost:5000/api/products?category=Rings
```

### Orders
```bash
# Create order
POST http://localhost:5000/api/orders
Content-Type: application/json

{
  "products": [
    {
      "productId": "YOUR_PRODUCT_ID",
      "quantity": 1
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
    "zipCode": "10001"
  }
}

# Get order by ID
GET http://localhost:5000/api/orders/:id

# Get order by order number
GET http://localhost:5000/api/orders/number/PW1234567890
```

---

## 🔗 Connect to Frontend

### Update Frontend API Calls

```javascript
// Create API config file in frontend
const API_BASE_URL = 'http://localhost:5000/api';

// Fetch products
const getProducts = async () => {
  const response = await fetch(`${API_BASE_URL}/products`);
  const data = await response.json();
  return data.data; // Return products array
};

// Get single product
const getProduct = async (id) => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`);
  const data = await response.json();
  return data.data;
};

// Create order
const createOrder = async (orderData) => {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  });
  const data = await response.json();
  return data.data;
};
```

---

## 🗄️ MongoDB Setup

### Option 1: Local MongoDB

1. **Install MongoDB**
   ```bash
   # macOS
   brew install mongodb-community
   
   # Ubuntu
   sudo apt-get install mongodb
   ```

2. **Start MongoDB**
   ```bash
   # macOS
   brew services start mongodb-community
   
   # Ubuntu
   sudo systemctl start mongod
   ```

3. **Use in .env**
   ```
   MONGODB_URI=mongodb://localhost:27017/peachwood
   ```

### Option 2: MongoDB Atlas (Cloud)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Get your connection string
5. Add to `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/peachwood
   ```

---

## 🧪 Test the API

### Using Browser
Simply visit: http://localhost:5000/api/products

### Using cURL
```bash
# Get products
curl http://localhost:5000/api/products

# Create order (replace PRODUCT_ID with real ID)
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "products": [{"productId": "PRODUCT_ID", "quantity": 1}],
    "customerDetails": {
      "firstName": "Test",
      "lastName": "User",
      "email": "test@example.com",
      "phone": "1234567890",
      "address": "123 Test St",
      "city": "Test City",
      "state": "TS",
      "zipCode": "12345"
    }
  }'
```

### Using Postman
1. Download Postman
2. Import endpoints
3. Test each endpoint

---

## 📂 Project Structure

```
peachwood-backend/
├── config/          # Database configuration
├── models/          # MongoDB schemas
├── routes/          # API routes
├── controllers/     # Business logic
├── seed/            # Sample data
├── server.js        # Main server file
├── package.json     # Dependencies
└── .env             # Environment variables
```

---

## 🔧 Available Scripts

```bash
# Start server (production)
npm start

# Start with auto-restart (development)
npm run dev

# Seed database with products
npm run seed
```

---

## 🚨 Common Issues

### Port already in use
Change PORT in `.env` to 5001 or another available port

### MongoDB connection error
1. Check MongoDB is running
2. Verify MONGODB_URI in `.env`
3. For Atlas, check IP whitelist

### Cannot find module
Run `npm install` again

---

## 📚 Next Steps

1. ✅ Get backend running
2. ✅ Test API endpoints
3. ✅ Connect frontend to backend
4. ✅ Replace mock data with API calls
5. ✅ Test full integration

---

**Need More Help?**
Check the full README.md for detailed documentation!

**Happy Coding!** 🎉
