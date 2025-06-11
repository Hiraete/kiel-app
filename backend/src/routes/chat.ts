import express, { RequestHandler } from 'express';
import { protect } from '../middleware/auth';
import { getMessages, sendMessage, markAsRead } from '../controllers/chatController';

const router = express.Router();

// Tüm mesajları getir
router.get('/messages/:receiverId', protect as RequestHandler, getMessages as RequestHandler);

// Yeni mesaj gönder
router.post('/send', protect as RequestHandler, sendMessage as RequestHandler);

// Mesajları okundu olarak işaretle
router.put('/read/:senderId', protect as RequestHandler, markAsRead as RequestHandler);

export default router; 