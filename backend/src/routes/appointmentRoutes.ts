import express, { RequestHandler } from 'express';
import { appointmentController } from '../controllers/appointmentController';
import { protect } from '../middleware/auth';

const router = express.Router();

// Randevu oluştur
router.post('/', protect as RequestHandler, appointmentController.createAppointment as RequestHandler);

// Randevuları listele
router.get('/', protect as RequestHandler, appointmentController.getAppointments as RequestHandler);

// Randevu durumunu güncelle
router.patch('/:appointmentId/status', protect as RequestHandler, appointmentController.updateAppointmentStatus as RequestHandler);

// Randevu değerlendir
router.post('/:appointmentId/rate', protect as RequestHandler, appointmentController.rateAppointment as RequestHandler);

export default router; 