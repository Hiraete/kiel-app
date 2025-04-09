import React, { createContext, useContext, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../services/userService';
import { authService } from '../services/api';

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (email: string, password: string, role: 'uzman' | 'danisan') => Promise<void>;
  register: (name: string, email: string, password: string, role: 'uzman' | 'danisan') => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string, role: 'uzman' | 'danisan') => {
    try {
      const response = await authService.login(email, password, role);
      setUser(response.user);
    } catch (error) {
      console.error('Giriş yapılırken hata:', error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, role: 'uzman' | 'danisan') => {
    try {
      const response = await authService.register({ name, email, password, role });
      setUser(response.user);
    } catch (error) {
      console.error('Kayıt olurken hata:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Çıkış yapılırken hata:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}; 