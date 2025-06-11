import express, { RequestHandler } from 'express';
import { protect } from '../middleware/auth';
import {
  createProgram,
  getPrograms,
  getProgram,
  updateProgram,
  deleteProgram,
  updateProgress,
} from '../controllers/programController';

const router = express.Router();

// Tüm rotalar için auth middleware'ini kullan
router.use(protect as RequestHandler);

// Program rotaları
router.post('/', createProgram as RequestHandler);
router.get('/', getPrograms as RequestHandler);
router.get('/:id', getProgram as RequestHandler);
router.put('/:id', updateProgram as RequestHandler);
router.delete('/:id', deleteProgram as RequestHandler);
router.post('/:id/progress', updateProgress as RequestHandler);

export default router; 