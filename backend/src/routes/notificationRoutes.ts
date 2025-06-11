import express, { RequestHandler } from 'express';
import { notificationController } from '../controllers/notificationController';
import { protect } from '../middleware/auth';

const router = express.Router();

// Tüm bildirimleri getir
router.get('/', protect as RequestHandler, notificationController.getNotifications as RequestHandler);

// Bildirimi okundu olarak işaretle
router.patch('/:notificationId/read', protect as RequestHandler, notificationController.markAsRead as RequestHandler);

// Tüm bildirimleri okundu olarak işaretle
router.patch('/read-all', protect as RequestHandler, notificationController.markAllAsRead as RequestHandler);

// Okunmamış bildirim sayısını getir
router.get('/unread-count', protect as RequestHandler, notificationController.getUnreadCount as RequestHandler);

// Bildirimi sil
router.delete('/:notificationId', protect as RequestHandler, notificationController.deleteNotification as RequestHandler);

export default router; 