import express from 'express';
import { auth } from '../middleware/auth';

const router = express.Router();

// Kullanıcı profili
router.get('/profile', auth, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Korumalı test rotası
router.get('/test', auth, (req, res) => {
  res.json({ message: 'Bu korumalı bir rotadır' });
});

export default router; 