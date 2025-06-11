import { Router } from 'express';
import { sendMessage } from '../controllers/chatbotController';

const router = Router();

router.post('/chatbot', sendMessage);

export default router; 