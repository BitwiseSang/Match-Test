import { Router } from 'express';
const router = Router();
import { getProfile, updateProfile } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';
import { single } from '../middleware/upload.js';

// Get user profile
router.get('/profile', authenticateToken, getProfile);

// Update user profile
router.put(
  '/profile',
  authenticateToken,
  single('profileAvatar'),
  updateProfile
);

export default router;
