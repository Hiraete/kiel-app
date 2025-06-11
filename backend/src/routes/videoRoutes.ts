import express, { Response, RequestHandler, Request } from 'express';
import { generateToken } from '../controllers/videoController';
import { protect, authenticateToken } from '../middleware/auth';

// AuthRequest tipini burada tanımla
interface AuthRequest extends Request {
  user?: {
    id: string;
    role: 'uzman' | 'danisan';
    _id?: string;
  };
}

const router = express.Router();

router.post('/token', protect as RequestHandler, generateToken as RequestHandler);

// Video token endpoint'i
router.post('/video-token', authenticateToken as RequestHandler, async (_req: AuthRequest, res: Response) => {
  try {
    // Burada video token'ı oluşturma mantığı eklenecek
    const token = 'video-token-placeholder';
    res.json({ token });
  } catch (error) {
    console.error('Video token oluşturma hatası:', error);
    res.status(500).json({ message: 'Video token oluşturulamadı' });
  }
});

export default router; 