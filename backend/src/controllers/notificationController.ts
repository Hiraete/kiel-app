import { Request, Response } from 'express';
import { Notification } from '../models/Notification';

interface AuthRequest extends Request {
  user: {
    id: string;
    role: 'uzman' | 'danisan';
    _id: string;
  };
}

export const getNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const isRead = req.query.isRead ? req.query.isRead === 'true' : undefined;

    const query: any = { userId: req.user._id };
    if (isRead !== undefined) {
      query.isRead = isRead;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalNotifications = await Notification.countDocuments(query);
    const totalPages = Math.ceil(totalNotifications / limit);

    res.json({
      notifications,
      currentPage: page,
      totalPages,
      totalNotifications
    });
  } catch (error) {
    console.error('Bildirimler alınamadı:', error);
    res.status(500).json({ message: 'Bildirimler alınamadı' });
  }
};

export const markAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      res.status(404).json({ message: 'Bildirim bulunamadı' });
      return;
    }

    res.json(notification);
  } catch (error) {
    console.error('Bildirim okundu olarak işaretlenemedi:', error);
    res.status(500).json({ message: 'Bildirim okundu olarak işaretlenemedi' });
  }
};

export const markAllAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await Notification.updateMany(
      { userId: req.user._id, isRead: false },
      { isRead: true }
    );

    res.json({ message: 'Tüm bildirimler okundu olarak işaretlendi' });
  } catch (error) {
    console.error('Bildirimler okundu olarak işaretlenemedi:', error);
    res.status(500).json({ message: 'Bildirimler okundu olarak işaretlenemedi' });
  }
};

export const getUnreadCount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const count = await Notification.countDocuments({
      userId: req.user._id,
      isRead: false
    });

    res.json({ count });
  } catch (error) {
    console.error('Okunmamış bildirim sayısı alınamadı:', error);
    res.status(500).json({ message: 'Okunmamış bildirim sayısı alınamadı' });
  }
};

export const deleteNotification = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!notification) {
      res.status(404).json({ message: 'Bildirim bulunamadı' });
      return;
    }

    res.json({ message: 'Bildirim silindi' });
  } catch (error) {
    console.error('Bildirim silinemedi:', error);
    res.status(500).json({ message: 'Bildirim silinemedi' });
  }
};

export const notificationController = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  deleteNotification
}; 