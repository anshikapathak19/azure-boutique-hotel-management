import mongoose from 'mongoose';

let isConnected = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 2000 // Fast fail if Mongo is not running
    });
    console.log(`MongoDB/CosmosDB Connected: ${conn.connection.host}`);
    isConnected = true;
  } catch (error) {
    console.warn(`\n====================================================================`);
    console.warn(`DATABASE ERROR: Could not connect to MongoDB/CosmosDB.`);
    console.warn(`Detail: ${error.message}`);
    console.warn(`AzureStay API will automatically fall back to an in-memory JSON Database.`);
    console.warn(`This ensures the application runs flawlessly in local environments!`);
    console.warn(`====================================================================\n`);
    isConnected = false;
  }
};

export const getDBStatus = () => isConnected;

export default connectDB;
