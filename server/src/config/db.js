const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/medpulse';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[Database] MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.warn(`[Database] Local MongoDB connection failed (${error.message}). Attempting in-memory database fallback...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const inMemoryUri = mongoServer.getUri();
      const conn = await mongoose.connect(inMemoryUri);
      console.log(`[Database] Connected to in-memory MongoDB fallback: ${conn.connection.host}`);
    } catch (fallbackError) {
      console.error(`[Database] Critical: Could not establish MongoDB connection:`, fallbackError.message);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
