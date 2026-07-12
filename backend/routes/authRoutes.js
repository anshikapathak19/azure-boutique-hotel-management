import express from 'express';
import {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getCurrentUser,
  googleCallback,
  googleSimulation,
  githubSimulation,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', protect, getCurrentUser);

// Google OAuth simulation fallback redirect
router.get('/google', (req, res) => {
  return res.redirect('/api/auth/google/simulation');
});

router.get('/google/callback', googleCallback);
router.get('/google/simulation', googleSimulation);

// GitHub OAuth simulation fallback redirect
router.get('/github', (req, res) => {
  return res.redirect('/api/auth/github/simulation');
});

router.get('/github/simulation', githubSimulation);

export default router;
