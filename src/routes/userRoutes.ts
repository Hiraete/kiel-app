import { Router } from 'express';
import { register, login } from '../controllers/userController';

const router = Router();

// Kullanıcı rotaları
router.post('/register', register);
router.post('/login', login);

export default router; 