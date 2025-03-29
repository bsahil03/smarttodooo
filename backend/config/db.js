// backend/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    retryWrites: true,
    retryReads: true
  };

  try {
    await mongoose.connect(process.env.MONGO_URI, options);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from DB');
  // Optionally attempt to reconnect
  setTimeout(connectDB, 5000);
});

module.exports = connectDB;