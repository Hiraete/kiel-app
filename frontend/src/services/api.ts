import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from './userService';

// Geliştirme ortamı için localhost kullanıyoruz
const API_URL = 'http://localhost:3000/api';

// Axios instance oluşturma
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - her istekte token'ı ekle
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - hata durumunda token'ı temizle
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

// Auth servisleri
export const authService = {
  // Kayıt olma
  register: async (userData: { 
    name: string;
    email: string; 
    password: string;
    role: 'uzman' | 'danisan';
  }) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error: any) {
      console.error('Register error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Giriş yapma
  login: async (email: string, password: string, role: 'uzman' | 'danisan') => {
    try {
      const response = await api.post('/auth/login', { email, password, role });
      if (response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Çıkış yapma
  logout: async () => {
    try {
      await AsyncStorage.removeItem('token');
    } catch (error: any) {
      console.error('Logout error:', error);
      throw error;
    }
  },
};

// Kullanıcı işlemleri
export const userService = {
  // Profil güncelleme
  updateProfile: async (profileData: Partial<User['profile']>) => {
    const response = await api.patch('/users/profile', profileData);
    return response.data;
  },

  // Uzman profil güncelleme
  updateExpertProfile: async (expertProfileData: User['profile']['expertProfile']) => {
    const response = await api.patch('/users/expert-profile', expertProfileData);
    return response.data;
  },

  // Profil bilgilerini getirme
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Uzmanları getirme
  getExperts: async () => {
    const response = await api.get('/users/experts');
    return response.data;
  },
};

// Randevu işlemleri
export const appointmentService = {
  createAppointment: async (appointmentData: any) => {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  },

  getAppointments: async () => {
    const response = await api.get('/appointments');
    return response.data;
  },

  updateAppointmentStatus: async (appointmentId: string, status: string) => {
    const response = await api.patch(`/appointments/${appointmentId}/status`, { status });
    return response.data;
  },
};

export default api;