import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Notification {
  _id: string;
  userId: string;
  type: 'appointment' | 'system' | 'message';
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

interface NotificationResponse {
  notifications: Notification[];
  currentPage: number;
  totalPages: number;
  totalNotifications: number;
}

interface NotificationFilter {
  page?: number;
  limit?: number;
  isRead?: boolean;
}

export class NotificationService {
  async getNotifications(filters?: NotificationFilter): Promise<NotificationResponse> {
    const response = await api.get('/notifications', { params: filters });
    return response.data;
  }

  async markAsRead(notificationId: string): Promise<Notification> {
    const response = await api.patch(`/notifications/${notificationId}/read`);
    return response.data;
  }

  async markAllAsRead(): Promise<void> {
    await api.patch('/notifications/mark-all-read');
  }

  async getUnreadCount(): Promise<number> {
    const response = await api.get('/notifications/unread-count');
    return response.data.count;
  }

  async deleteNotification(notificationId: string): Promise<void> {
    await api.delete(`/notifications/${notificationId}`);
  }
}

export const notificationService = new NotificationService(); 