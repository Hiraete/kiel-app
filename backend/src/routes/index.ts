import express from 'express';
import chatbotRoutes from './chatbotRoutes';

const router = express.Router();

router.use('/api/chat', chatbotRoutes);

export default router; 