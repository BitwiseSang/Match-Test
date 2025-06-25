import { Router } from 'express';
const router = Router();
import { signup, login } from '../controllers/authController.js';

// Signup route with avatar upload
router.post('/signup', signup);

// Login route
router.post('/login', login);

export default router;
