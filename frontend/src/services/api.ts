import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Geliştirme ortamı için IP adresini kullanıyoruz
const API_URL = 'http://192.168.1.117:5000/api';

// Axios instance oluşturma
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor - her istekte token kontrolü
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      console.log('Request config:', {
        url: config.url,
        method: config.method,
        headers: config.headers,
        data: config.data
      });
      return config;
    } catch (error) {
      console.error('Request interceptor error:', error);
      return config;
    }
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - hata yönetimi
api.interceptors.response.use(
  (response) => {
    console.log('Response:', {
      status: response.status,
      data: response.data
    });
    return response;
  },
  async (error) => {
    console.error('Response error:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
    }
    return Promise.reject(error);
  }
);

// Auth servisleri
export const authService = {
  // Kayıt olma
  register: async (userData: { username: string; email: string; password: string }) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.token) {
        await AsyncStorage.setItem('userToken', response.data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error: any) {
      console.error('Register error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Giriş yapma
  login: async (credentials: { email: string; password: string }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.token) {
        await AsyncStorage.setItem('userToken', response.data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
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
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
    } catch (error: any) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  // Mevcut kullanıcı bilgilerini getirme
  getCurrentUser: async () => {
    try {
      const userDataStr = await AsyncStorage.getItem('userData');
      const token = await AsyncStorage.getItem('userToken');
      if (!userDataStr || !token) return null;
      return JSON.parse(userDataStr);
    } catch (error: any) {
      console.error('Get current user error:', error);
      return null;
    }
  },
};

export default api; 