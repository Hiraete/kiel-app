import { Request, Response } from 'express';
import { Notification } from '../models/Notification';
import { User } from '../models/User';

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: 'uzman' | 'danisan';
    _id?: string;
  };
}

export class NotificationController {
  // Bildirimleri getir
  async getNotifications(req: AuthRequest, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const notifications = await Notification.find({ userId: req.user?.id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Notification.countDocuments({ userId: req.user?.id });

      res.json({
        notifications,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalNotifications: total
      });
    } catch (error) {
      console.error('Bildirimler alınırken hata:', error);
      res.status(500).json({ message: 'Bildirimler alınırken bir hata oluştu' });
    }
  }

  // Bildirimi okundu olarak işaretle
  async markAsRead(req: AuthRequest, res: Response): Promise<void> {
    try {
      const notification = await Notification.findOneAndUpdate(
        { _id: req.params.notificationId, userId: req.user?.id },
        { isRead: true },
        { new: true }
      );

      if (!notification) {
        res.status(404).json({ message: 'Bildirim bulunamadı' });
        return;
      }

      res.json(notification);
    } catch (error) {
      console.error('Bildirim okundu olarak işaretlenirken hata:', error);
      res.status(500).json({ message: 'Bildirim okundu olarak işaretlenirken bir hata oluştu' });
    }
  }

  // Tüm bildirimleri okundu olarak işaretle
  async markAllAsRead(req: AuthRequest, res: Response): Promise<void> {
    try {
      await Notification.updateMany(
        { userId: req.user?.id, isRead: false },
        { isRead: true }
      );

      res.json({ message: 'Tüm bildirimler okundu olarak işaretlendi' });
    } catch (error) {
      console.error('Tüm bildirimler okundu olarak işaretlenirken hata:', error);
      res.status(500).json({ message: 'Tüm bildirimler okundu olarak işaretlenirken bir hata oluştu' });
    }
  }

  // Okunmamış bildirim sayısını getir
  async getUnreadCount(req: AuthRequest, res: Response): Promise<void> {
    try {
      const count = await Notification.countDocuments({
        userId: req.user?.id,
        isRead: false
      });

      res.json({ count });
    } catch (error) {
      console.error('Okunmamış bildirim sayısı alınırken hata:', error);
      res.status(500).json({ message: 'Okunmamış bildirim sayısı alınırken bir hata oluştu' });
    }
  }

  // Bildirimi sil
  async deleteNotification(req: AuthRequest, res: Response): Promise<void> {
    try {
      const notification = await Notification.findOneAndDelete({
        _id: req.params.notificationId,
        userId: req.user?.id
      });

      if (!notification) {
        res.status(404).json({ message: 'Bildirim bulunamadı' });
        return;
      }

      res.json({ message: 'Bildirim başarıyla silindi' });
    } catch (error) {
      console.error('Bildirim silinirken hata:', error);
      res.status(500).json({ message: 'Bildirim silinirken bir hata oluştu' });
    }
  }
}

export const notificationController = new NotificationController(); 