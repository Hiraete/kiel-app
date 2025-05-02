import express, { RequestHandler } from 'express';
import { authenticate } from '../middleware/auth';
import { getMessages, sendMessage, markAsRead } from '../controllers/chatController';

const router = express.Router();

// Tüm mesajları getir
router.get('/messages/:receiverId', authenticate, getMessages as RequestHandler);

// Yeni mesaj gönder
router.post('/send', authenticate, sendMessage as RequestHandler);

// Mesajları okundu olarak işaretle
router.put('/read/:senderId', authenticate, markAsRead as RequestHandler);

export default router; 