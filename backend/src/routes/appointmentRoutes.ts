import express from 'express';
import { appointmentController } from '../controllers/appointmentController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

// Randevu oluştur
router.post('/', authenticateToken, appointmentController.createAppointment);

// Randevuları listele
router.get('/', authenticateToken, appointmentController.getAppointments);

// Randevu durumunu güncelle
router.patch('/:appointmentId/status', authenticateToken, appointmentController.updateAppointmentStatus);

// Randevu değerlendir
router.post('/:appointmentId/rate', authenticateToken, appointmentController.rateAppointment);

export default router; 