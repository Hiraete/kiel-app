import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'uzman' | 'danisan';
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: 'uzman' | 'danisan') => Promise<void>;
  register: (username: string, email: string, password: string, role: 'uzman' | 'danisan') => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Kullanıcı bilgisi alınamadı:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string, role: 'uzman' | 'danisan') => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }),
      });

      if (!response.ok) {
        throw new Error('Giriş başarısız');
      }

      const data = await response.json();
      const userData = {
        id: data.user.id,
        username: data.user.username,
        email: data.user.email,
        role: data.user.role,
        token: data.token,
      };

      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Giriş hatası:', error);
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string, role: 'uzman' | 'danisan') => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, role }),
      });

      if (!response.ok) {
        throw new Error('Kayıt başarısız');
      }

      const data = await response.json();
      const userData = {
        id: data.user.id,
        username: data.user.username,
        email: data.user.email,
        role: data.user.role,
        token: data.token,
      };

      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Kayıt hatası:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Çıkış hatası:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 