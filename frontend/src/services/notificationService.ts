import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config';
import { Notification } from '../types';
import api from './api';

export interface NotificationResponse {
  notifications: Notification[];
  total: number;
}

class NotificationService {
  async getNotifications(): Promise<NotificationResponse> {
    try {
      const response = await api.get('/notifications');
      return response.data;
    } catch (error) {
      console.error('Bildirimler alınamadı:', error);
      throw error;
    }
  }

  async markAsRead(notificationId: string): Promise<void> {
    try {
      await api.patch(`/notifications/${notificationId}/read`);
    } catch (error) {
      console.error('Bildirim okundu olarak işaretlenemedi:', error);
      throw error;
    }
  }

  async markAllAsRead(): Promise<void> {
    try {
      await api.patch('/notifications/read-all');
    } catch (error) {
      console.error('Bildirimler okundu olarak işaretlenemedi:', error);
      throw error;
    }
  }

  async getUnreadCount(): Promise<number> {
    try {
      const response = await api.get('/notifications/unread-count');
      return response.data.count;
    } catch (error) {
      console.error('Okunmamış bildirim sayısı alınamadı:', error);
      throw error;
    }
  }
}

export const notificationService = new NotificationService(); 