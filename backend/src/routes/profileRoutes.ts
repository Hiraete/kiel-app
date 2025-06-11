import express, { RequestHandler } from 'express';
import { protect } from '../middleware/auth';
import {
  getProfile,
  updateProfile,
  addChildProfile,
  updateChildProfile,
  deleteChildProfile,
} from '../controllers/profileController';

const router = express.Router();

// Tüm rotalar için auth middleware'ini kullan
router.use(protect as RequestHandler);

// Profil rotaları
router.get('/', getProfile as RequestHandler);
router.put('/', updateProfile as RequestHandler);

// Çocuk profili rotaları
router.post('/children', addChildProfile as RequestHandler);
router.put('/children/:childId', updateChildProfile as RequestHandler);
router.delete('/children/:childId', deleteChildProfile as RequestHandler);

export default router; 