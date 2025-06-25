import { Router } from 'express';
const router = Router();
import { signup, login } from '../controllers/authController.js';
import { single } from '../middleware/upload.js';

// Signup route with avatar upload
router.post('/signup', single('profileAvatar'), signup);

// Login route
router.post('/login', login);

export default router;
