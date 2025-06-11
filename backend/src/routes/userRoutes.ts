import express, { RequestHandler } from 'express';
import { register, login, getProfile, updateProfile } from '../controllers/userController';
import { protect } from '../middleware/auth';

const router = express.Router();

// Auth routes
router.post('/register', register as RequestHandler);
router.post('/login', login as RequestHandler);

// Profile routes
router.get('/profile', protect as RequestHandler, getProfile as RequestHandler);
router.put('/profile', protect as RequestHandler, updateProfile as RequestHandler);

export default router; 