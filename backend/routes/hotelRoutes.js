import express from 'express';
import {
  getHotels,
  getHotelById,
  getFeaturedHotels,
} from '../controllers/hotelController.js';

const router = express.Router();

router.get('/', getHotels);
router.get('/featured', getFeaturedHotels);
router.get('/:id', getHotelById);

export default router;
