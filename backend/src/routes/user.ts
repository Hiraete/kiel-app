import express, { Request, Response } from 'express';
import { protect } from '../middleware/auth';
import { User, IUser, ChildProfile } from '../models/User';
import mongoose from 'mongoose';

const router = express.Router();

// Profil bilgilerini getir
router.get('/profile', protect, async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id).select('-password');
    if (!user) {
      res.status(404).json({ message: 'Kullanıcı bulunamadı' });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Profil bilgileri alınamadı' });
  }
});

// Profil güncelle
router.patch('/profile', protect, async (req: Request, res: Response): Promise<void> => {
  const allowedUpdates = ['fullName', 'profile'];
  const updates = Object.keys(req.body);
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    res.status(400).json({ message: 'Geçersiz güncelleme alanları' });
    return;
  }

  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      res.status(404).json({ message: 'Kullanıcı bulunamadı' });
      return;
    }

    updates.forEach(update => {
      if (update === 'profile') {
        user.profile = { ...user.profile, ...req.body.profile };
      } else if (update === 'fullName') {
        user.profile.fullName = req.body.fullName;
      }
    });

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Profil güncellenemedi' });
  }
});

// Uzman profilini güncelle
router.patch('/expert-profile', protect, async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      res.status(404).json({ message: 'Kullanıcı bulunamadı' });
      return;
    }

    if (user.role !== 'uzman') {
      res.status(403).json({ message: 'Bu işlem için yetkiniz yok' });
      return;
    }

    user.profile.expertProfile = {
      ...user.profile.expertProfile,
      ...req.body
    } as IUser['profile']['expertProfile'];

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Uzman profili güncellenemedi' });
  }
});

// Tüm uzmanları getir
router.get('/experts', protect, async (_: Request, res: Response): Promise<void> => {
  try {
    const experts = await User.find({ role: 'uzman' })
      .select('-password')
      .populate('profile.expertProfile');
    res.json(experts);
  } catch (error) {
    res.status(500).json({ message: 'Uzmanlar listesi alınamadı' });
  }
});

// Çocuk profili ekle
router.post('/child-profile', protect, async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      res.status(404).json({ message: 'Kullanıcı bulunamadı' });
      return;
    }

    if (user.role !== 'danisan') {
      res.status(403).json({ message: 'Bu işlem için yetkiniz yok' });
      return;
    }

    const childProfile: ChildProfile = {
      id: new mongoose.Types.ObjectId().toString(),
      ...req.body
    };

    user.childProfiles.push(childProfile);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Çocuk profili eklenemedi' });
  }
});

// Çocuk profilini güncelle
router.patch('/child-profile/:id', protect, async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      res.status(404).json({ message: 'Kullanıcı bulunamadı' });
      return;
    }
    const childProfile = user.childProfiles.find(
      (profile: ChildProfile) => profile.id === req.params.id
    );

    if (!childProfile) {
      res.status(404).json({ message: 'Çocuk profili bulunamadı' });
      return;
    }

    Object.assign(childProfile, req.body);
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Çocuk profili güncellenemedi' });
  }
});

export default router; 