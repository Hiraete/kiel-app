import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkAuthStatus } from './api';

export interface Appointment {
  _id: string;
  expert: {
    _id: string;
    fullName: string;
    profile: any;
  };
  client: {
    _id: string;
    fullName: string;
    profile: any;
  };
  date: string;
  startTime: string;
  endTime: string;
  notes?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  rating?: number;
  review?: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateAppointmentPayload {
  expertId: string;
  date: string;
  startTime: string;
  endTime: string;
  notes?: string;
}

interface AppointmentFilter {
  status?: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  expertId?: string;
  clientId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export const appointmentService = {
  createAppointment: async (payload: CreateAppointmentPayload) => {
    try {
      const authStatus = await checkAuthStatus();
      if (!authStatus.isAuthenticated) {
        throw new Error('Oturum açmanız gerekiyor');
      }

      const response = await api.post('/appointments', payload);
      return response.data;
    } catch (error: any) {
      console.error('Randevu oluşturma hatası:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Randevu oluşturulurken bir hata oluştu');
    }
  },

  getAppointments: async (filters?: AppointmentFilter) => {
    try {
      const authStatus = await checkAuthStatus();
      if (!authStatus.isAuthenticated) {
        throw new Error('Oturum açmanız gerekiyor');
      }

      const response = await api.get('/appointments', { params: filters });
      return response.data;
    } catch (error: any) {
      console.error('Randevuları getirme hatası:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Randevular yüklenirken bir hata oluştu');
    }
  },

  getAppointmentById: async (id: string) => {
    try {
      const authStatus = await checkAuthStatus();
      if (!authStatus.isAuthenticated) {
        throw new Error('Oturum açmanız gerekiyor');
      }

      const response = await api.get(`/appointments/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Randevu detayı getirme hatası:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Randevu detayı yüklenirken bir hata oluştu');
    }
  },

  updateAppointment: async (id: string, payload: Partial<CreateAppointmentPayload>) => {
    try {
      const authStatus = await checkAuthStatus();
      if (!authStatus.isAuthenticated) {
        throw new Error('Oturum açmanız gerekiyor');
      }

      const response = await api.put(`/appointments/${id}`, payload);
      return response.data;
    } catch (error: any) {
      console.error('Randevu güncelleme hatası:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Randevu güncellenirken bir hata oluştu');
    }
  },

  cancelAppointment: async (id: string) => {
    try {
      const authStatus = await checkAuthStatus();
      if (!authStatus.isAuthenticated) {
        throw new Error('Oturum açmanız gerekiyor');
      }

      const response = await api.put(`/appointments/${id}/cancel`);
      return response.data;
    } catch (error: any) {
      console.error('Randevu iptal hatası:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Randevu iptal edilirken bir hata oluştu');
    }
  },

  confirmAppointment: async (id: string) => {
    try {
      const authStatus = await checkAuthStatus();
      if (!authStatus.isAuthenticated) {
        throw new Error('Oturum açmanız gerekiyor');
      }

      const response = await api.put(`/appointments/${id}/confirm`);
      return response.data;
    } catch (error: any) {
      console.error('Randevu onaylama hatası:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Randevu onaylanırken bir hata oluştu');
    }
  },

  rateAppointment: async (id: string, rating: number, review?: string) => {
    try {
      const authStatus = await checkAuthStatus();
      if (!authStatus.isAuthenticated) {
        throw new Error('Oturum açmanız gerekiyor');
      }

      const response = await api.put(`/appointments/${id}/rate`, { rating, review });
      return response.data;
    } catch (error: any) {
      console.error('Randevu değerlendirme hatası:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Randevu değerlendirilirken bir hata oluştu');
    }
  },

  getExperts: async () => {
    const response = await api.get('/users/experts');
    return response.data;
  },

  updateAppointmentStatus: async (id: string, status: Appointment['status']) => {
    try {
      const authStatus = await checkAuthStatus();
      if (!authStatus.isAuthenticated) {
        throw new Error('Oturum açmanız gerekiyor');
      }

      const response = await api.patch(`/appointments/${id}/status`, { status });
      return response.data;
    } catch (error: any) {
      console.error('Randevu durumu güncelleme hatası:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Randevu durumu güncellenirken bir hata oluştu');
    }
  }
}; 