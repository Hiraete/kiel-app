import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from './userService';
import Constants from 'expo-constants';

// API URL'ini ortama göre ayarla
const API_URL = __DEV__ 
  ? 'http://192.168.1.117:5000/api'  // Geliştirme
  : 'https://api.kielapp.com/api';   // Prodüksiyon

console.log('API URL:', API_URL);

// Axios instance oluşturma
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 saniye timeout
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('@KielApp:token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Token süresi dolmuşsa ve refresh token varsa
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem('@KielApp:refreshToken');
        
        if (refreshToken) {
          const response = await api.post('/auth/refresh-token', {
            refreshToken,
          });

          const { token } = response.data;
          await AsyncStorage.setItem('@KielApp:token', token);

          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token da geçersizse kullanıcıyı logout yap
        await AsyncStorage.removeItem('@KielApp:token');
        await AsyncStorage.removeItem('@KielApp:refreshToken');
        await AsyncStorage.removeItem('@KielApp:user');
        
        // Burada bir event emitter kullanarak uygulama genelinde logout eventi tetikleyebilirsiniz
        // EventEmitter.emit('LOGOUT');
      }
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
      await AsyncStorage.setItem('@KielApp:token', response.data.token);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Giriş yapma
  login: async (email: string, password: string, role: 'uzman' | 'danisan' = 'danisan') => {
    try {
      const response = await api.post('/auth/login', { email, password, role });
      if (response.data.token) {
        await AsyncStorage.setItem('@KielApp:token', response.data.token);
        return response.data;
      } else {
        throw new Error('Token alınamadı');
      }
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Giriş yapılırken bir hata oluştu');
      }
      throw new Error('Sunucuya bağlanılamadı');
    }
  },

  // Çıkış yapma
  logout: async () => {
    try {
      await AsyncStorage.removeItem('@KielApp:token');
    } catch (error) {
      throw error;
    }
  },

  // Mevcut kullanıcıyı getir
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
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

// Token kontrolü için test fonksiyonu
export const checkAuthStatus = async () => {
  try {
    const token = await AsyncStorage.getItem('@KielApp:token');
    const refreshToken = await AsyncStorage.getItem('@KielApp:refreshToken');
    const user = await AsyncStorage.getItem('@KielApp:user');
    
    console.log('Auth Durumu:', {
      token: token ? 'Var' : 'Yok',
      refreshToken: refreshToken ? 'Var' : 'Yok',
      user: user ? 'Var' : 'Yok'
    });
    
    return {
      isAuthenticated: !!token,
      hasRefreshToken: !!refreshToken,
      hasUser: !!user
    };
  } catch (error) {
    console.error('Auth durumu kontrol edilirken hata:', error);
    return {
      isAuthenticated: false,
      hasRefreshToken: false,
      hasUser: false
    };
  }
};

export default api;