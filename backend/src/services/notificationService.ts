import { Notification } from '../models/Notification';
import { User } from '../models/User';

export class NotificationService {
  // Bildirim oluştur
  static async createNotification(
    userId: string,
    type: 'program' | 'consultation' | 'message' | 'progress' | 'system',
    title: string,
    content: string,
    data: any = {}
  ) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('Kullanıcı bulunamadı');
    }

    const notification = new Notification({
      userId,
      type,
      title,
      content,
      data,
    });
    await notification.save();
    return notification;
  }

  // Kullanıcının bildirimlerini getir
  static async getUserNotifications(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Notification.countDocuments({ userId });
    return { notifications, total };
  }

  // Okunmamış bildirimleri getir
  static async getUnreadNotifications(userId: string) {
    return await Notification.find({ userId, read: false })
      .sort({ createdAt: -1 });
  }

  // Bildirimi okundu olarak işaretle
  static async markAsRead(notificationId: string, userId: string) {
    return await Notification.findOneAndUpdate(
      { _id: notificationId, userId },
      { read: true },
      { new: true }
    );
  }

  // Tüm bildirimleri okundu olarak işaretle
  static async markAllAsRead(userId: string) {
    return await Notification.updateMany(
      { userId, read: false },
      { read: true }
    );
  }

  // Bildirim sil
  static async deleteNotification(notificationId: string, userId: string) {
    return await Notification.findOneAndDelete({ _id: notificationId, userId });
  }

  // Program bildirimi oluştur
  static async createProgramNotification(
    programId: string,
    userId: string,
    title: string,
    content: string
  ) {
    return await this.createNotification(
      userId,
      'program',
      title,
      content,
      { programId }
    );
  }

  // Danışmanlık bildirimi oluştur
  static async createConsultationNotification(
    consultationId: string,
    userId: string,
    title: string,
    content: string
  ) {
    return await this.createNotification(
      userId,
      'consultation',
      title,
      content,
      { consultationId }
    );
  }

  // Mesaj bildirimi oluştur
  static async createMessageNotification(
    messageId: string,
    userId: string,
    title: string,
    content: string
  ) {
    return await this.createNotification(
      userId,
      'message',
      title,
      content,
      { messageId }
    );
  }

  // İlerleme bildirimi oluştur
  static async createProgressNotification(
    activityId: string,
    userId: string,
    title: string,
    content: string
  ) {
    return await this.createNotification(
      userId,
      'progress',
      title,
      content,
      { activityId }
    );
  }

  // Sistem bildirimi oluştur
  static async createSystemNotification(
    userId: string,
    title: string,
    content: string,
    data: any = {}
  ) {
    return await this.createNotification(
      userId,
      'system',
      title,
      content,
      data
    );
  }
} 