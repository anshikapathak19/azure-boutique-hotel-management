import express from 'express';
import {
  getReviewsByHotel,
  getReviewsByGuest,
  createReview,
  deleteReview,
  getAllReviews,
} from '../controllers/reviewController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/hotel/:hotelId', getReviewsByHotel);
router.get('/guest/:guestId', getReviewsByGuest);
router.post('/', protect, createReview);
router.delete('/:id', protect, deleteReview);
router.get('/', protect, authorize('staff', 'admin'), getAllReviews);

export default router;
