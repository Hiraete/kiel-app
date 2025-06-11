import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';
import { User } from '../types';

interface AuthContextData {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      const token = await AsyncStorage.getItem('@KielApp:token');
      const userData = await AsyncStorage.getItem('@KielApp:user');

      if (token && userData) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading stored data:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      await AsyncStorage.setItem('@KielApp:token', token);
      await AsyncStorage.setItem('@KielApp:user', JSON.stringify(user));
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
    } catch (error: any) {
      console.error('Login error:', error);
      console.log('Detaylı hata:', error.response?.data);
      setError(error.response?.data?.message || error.response?.data?.errors || 'Giriş yapılırken bir hata oluştu');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post('/auth/register', {
        name,
        email,
        password
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Kayıt işlemi başarısız oldu');
      }

      const { token, user } = response.data;

      await AsyncStorage.setItem('@KielApp:token', token);
      await AsyncStorage.setItem('@KielApp:user', JSON.stringify(user));

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
    } catch (error: any) {
      console.error('Register error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Kayıt olurken bir hata oluştu';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.put('/users/profile', userData);
      const updatedUser = response.data.user;

      await AsyncStorage.setItem('@KielApp:user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error: any) {
      console.error('Update user error:', error);
      setError(error.response?.data?.message || 'Profil güncellenirken bir hata oluştu');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);

      await AsyncStorage.removeItem('@KielApp:token');
      await AsyncStorage.removeItem('@KielApp:user');

      delete api.defaults.headers.common['Authorization'];
      setUser(null);
    } catch (error: any) {
      console.error('Logout error:', error);
      setError('Çıkış yapılırken bir hata oluştu');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}; 