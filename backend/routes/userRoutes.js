import express from 'express';
import {
  getProfile,
  updateProfile,
  getWishlist,
  toggleWishlist,
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All profile routes require JWT protection

router.get('/:id', getProfile);
router.put('/:id', updateProfile);
router.get('/:guestId/wishlist', getWishlist);
router.post('/:guestId/wishlist/toggle', toggleWishlist);

export default router;
