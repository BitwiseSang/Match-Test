import { Router } from 'express';
const router = Router();
import {
  registerDevice,
  getUserDevices,
  deleteDevice,
} from '../controllers/deviceController.js';
import { authenticateToken } from '../middleware/auth.js';

// Register new device
router.post('/register', authenticateToken, registerDevice);

// Get user devices
router.get('/', authenticateToken, getUserDevices);

// Delete device
router.delete('/:deviceId', authenticateToken, deleteDevice);

export default router;
