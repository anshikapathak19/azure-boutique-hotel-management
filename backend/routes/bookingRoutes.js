import express from 'express';
import {
  createBooking,
  getAllBookings,
  getBookingsByGuestId,
  updateBookingStatus,
  cancelBooking,
  createPaymentIntent,
} from '../controllers/bookingController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All booking routes require authentication

router.post('/', createBooking);
router.post('/payment-intent', createPaymentIntent);
router.get('/', authorize('staff', 'admin'), getAllBookings);
router.get('/guest/:guestId', getBookingsByGuestId);
router.patch('/:id/status', authorize('staff', 'admin'), updateBookingStatus);
router.post('/:id/cancel', cancelBooking);

export default router;
