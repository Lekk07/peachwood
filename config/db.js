import mongoose from 'mongoose';

/**
 * Connect to MongoDB database
 * Uses connection string from environment variables
 */
const connectDB = async () => {
  try {
    // MongoDB connection options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    // Connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGO_URI);


    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    // Exit process with failure
    process.exit(1);
  }
};

// Handle MongoDB connection events
mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB error:', err);
});

export default connectDB;
