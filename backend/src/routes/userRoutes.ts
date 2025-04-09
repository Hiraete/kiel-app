import express from 'express';
import { register, login, getProfile, updateProfile, updateExpertProfile } from '../controllers/userController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);
router.put('/expert-profile', authenticateToken, updateExpertProfile);

export default router; 