import express, { Request, Response, RequestHandler } from 'express';
import { protect } from '../middleware/auth';
import { User } from '../models/User';

const router = express.Router();

// Kullanıcı profili
router.get('/profile', protect as RequestHandler, async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id).select('-password');
    if (!user) {
      res.status(404).json({ message: 'Kullanıcı bulunamadı' });
      return;
    }
    res.json({
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        profile: user.profile
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Korumalı test rotası
router.get('/test', protect as RequestHandler, (_: Request, res: Response): void => {
  res.json({ message: 'Bu korumalı bir rotadır' });
});

export default router; 