import { Request, Response } from 'express';
import { Activity } from '../models/Activity';
import mongoose from 'mongoose';

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: 'uzman' | 'danisan';
    _id?: string;
  };
}

// Aktivite oluştur
export const createActivity = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const activity = new Activity({
      ...req.body,
      createdBy: req.user?.id,
    });

    await activity.save();
    res.status(201).json(activity);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send('Sunucu hatası');
  }
};

// Tüm aktiviteleri getir
export const getActivities = async (_req: Request, res: Response): Promise<void> => {
  try {
    const activities = await Activity.find()
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name');
    res.json(activities);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send('Sunucu hatası');
  }
};

// Tek bir aktiviteyi getir
export const getActivity = async (req: Request, res: Response): Promise<void> => {
  try {
    const activity = await Activity.findById(req.params.id)
      .populate('createdBy', 'name')
      .populate('ratings.userId', 'name');

    if (!activity) {
      res.status(404).json({ message: 'Aktivite bulunamadı' });
      return;
    }

    res.json(activity);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send('Sunucu hatası');
  }
};

// Aktiviteyi güncelle
export const updateActivity = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      res.status(404).json({ message: 'Aktivite bulunamadı' });
      return;
    }

    if (activity.createdBy.toString() !== req.user?.id) {
      res.status(403).json({ message: 'Bu işlem için yetkiniz yok' });
      return;
    }

    const updatedActivity = await Activity.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(updatedActivity);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send('Sunucu hatası');
  }
};

// Aktiviteyi sil
export const deleteActivity = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      res.status(404).json({ message: 'Aktivite bulunamadı' });
      return;
    }

    if (activity.createdBy.toString() !== req.user?.id) {
      res.status(403).json({ message: 'Bu işlem için yetkiniz yok' });
      return;
    }

    await activity.deleteOne();
    res.json({ message: 'Aktivite başarıyla silindi' });
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send('Sunucu hatası');
  }
};

// Aktiviteye puan ver
export const rateActivity = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      res.status(404).json({ message: 'Aktivite bulunamadı' });
      return;
    }

    if (!req.user?.id) {
      res.status(401).json({ message: 'Yetkilendirme gerekli' });
      return;
    }

    const alreadyRated = activity.ratings.find(
      (r) => r.userId.toString() === req.user?.id
    );

    if (alreadyRated) {
      alreadyRated.rating = req.body.rating;
      alreadyRated.comment = req.body.comment;
    } else {
      activity.ratings.push({
        userId: new mongoose.Types.ObjectId(req.user.id),
        rating: req.body.rating,
        comment: req.body.comment,
      });
    }

    await activity.save();
    res.json(activity);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send('Sunucu hatası');
  }
}; 