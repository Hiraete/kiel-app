import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'uzman' | 'danisan';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string, role: 'uzman' | 'danisan') => Promise<void>;
  register: (name: string, email: string, password: string, role: 'uzman' | 'danisan') => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      const storedToken = await AsyncStorage.getItem('token');

      if (currentUser && storedToken) {
        setUser(currentUser);
        setToken(storedToken);
        setLoading(false);
        return true;
      } else {
        setUser(null);
        setToken(null);
        setLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Token kontrol hatası:', error);
      setUser(null);
      setToken(null);
      setLoading(false);
      return false;
    }
  };

  const login = async (email: string, password: string, role: 'uzman' | 'danisan') => {
    try {
      const response = await authService.login(email, password, role);
      setUser(response.user);
      setToken(response.token);
    } catch (error: any) {
      console.error('Giriş hatası:', error);
      throw new Error(error.response?.data?.message || 'Giriş yapılırken bir hata oluştu');
    }
  };

  const register = async (name: string, email: string, password: string, role: 'uzman' | 'danisan') => {
    try {
      const response = await authService.register({ name, email, password, role });
      setUser(response.user);
      setToken(response.token);
    } catch (error: any) {
      console.error('Kayıt hatası:', error);
      throw new Error(error.response?.data?.message || 'Kayıt olurken bir hata oluştu');
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error('Çıkış hatası:', error);
      throw error;
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 