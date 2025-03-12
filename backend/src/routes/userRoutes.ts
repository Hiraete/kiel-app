import { Router } from 'express';
import { register, login, getProfile, updateProfile } from '../controllers/userController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);

export default router; 