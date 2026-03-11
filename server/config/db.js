const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Mongoose 6+ automatically handles standard connection pooling
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Exit the process with a failure code if the database refuses to connect
    process.exit(1); 
  }
};

module.exports = connectDB;
