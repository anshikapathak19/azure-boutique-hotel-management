import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { initCosmos } from './config/cosmosDb.js';
import { initBlobStorage } from './config/blobStorage.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import hotelRoutes from './routes/hotelRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Load Env variables
dotenv.config();

// Initialize Azure SDK Clients on startup
const startCloudServices = async () => {
  try {
    await initCosmos();
    await initBlobStorage();
  } catch (error) {
    console.error('Failed to initialize Azure services on startup:', error.message);
  }
};
startCloudServices();

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Configure CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// API Routes mounting
app.use('/api/auth', authRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// Base route indicator
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'AzureStay Luxury Boutique Hotel Booking Management API is operating.',
  });
});

// 404 Route handler
app.use('*', (req, res) => {
  res.status(404).json({ message: `Resource not found on endpoint: ${req.originalUrl}` });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('API Server Error:', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'An internal server error occurred.',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`AzureStay Express API Server listening on port ${PORT}`);
});
