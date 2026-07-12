import express from 'express';
import multer from 'multer';
import {
  getAnalytics,
  getSettings,
  updateSettings,
  getUsers,
  uploadHotelAsset,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(protect);
router.use(authorize('admin')); // All admin endpoints require admin role

router.get('/analytics', getAnalytics);
router.get('/settings', getSettings);
router.put('/settings', updateSettings);
router.get('/users', getUsers);
router.post('/upload', upload.single('image'), uploadHotelAsset);

export default router;
