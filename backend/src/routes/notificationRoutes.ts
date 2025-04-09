import express from 'express';
import { notificationController } from '../controllers/notificationController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

// Tüm bildirimleri getir
router.get('/', authenticateToken, notificationController.getNotifications);

// Bildirimi okundu olarak işaretle
router.patch('/:notificationId/read', authenticateToken, notificationController.markAsRead);

// Tüm bildirimleri okundu olarak işaretle
router.patch('/read-all', authenticateToken, notificationController.markAllAsRead);

// Okunmamış bildirim sayısını getir
router.get('/unread-count', authenticateToken, notificationController.getUnreadCount);

// Bildirimi sil
router.delete('/:notificationId', authenticateToken, notificationController.deleteNotification);

export default router; 