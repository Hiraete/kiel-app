import express, { RequestHandler } from 'express';
import { protect } from '../middleware/auth';
import {
  createActivity,
  getActivities,
  getActivity,
  updateActivity,
  deleteActivity,
  rateActivity,
} from '../controllers/activityController';

const router = express.Router();

// Tüm rotalar için auth middleware'ini kullan
router.use(protect as RequestHandler);

// Aktivite rotaları
router.post('/', createActivity as RequestHandler);
router.get('/', getActivities as RequestHandler);
router.get('/:id', getActivity as RequestHandler);
router.put('/:id', updateActivity as RequestHandler);
router.delete('/:id', deleteActivity as RequestHandler);
router.post('/:id/rate', rateActivity as RequestHandler);

export default router; 