import { api } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:5000/api';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'uzman' | 'danisan';
  profile: {
    phone?: string;
    address?: string;
    birthDate?: string;
    emergencyContact?: string;
    profileImage?: string;
    expertProfile?: {
      title: string;
      specialization: string[];
      experience: number;
      rating: number;
      totalReviews: number;
      availability: {
        monday: Array<{ start: string; end: string }>;
        tuesday: Array<{ start: string; end: string }>;
        wednesday: Array<{ start: string; end: string }>;
        thursday: Array<{ start: string; end: string }>;
        friday: Array<{ start: string; end: string }>;
        saturday: Array<{ start: string; end: string }>;
        sunday: Array<{ start: string; end: string }>;
      };
    };
    childProfiles?: Array<{
      name: string;
      birthDate: string;
      gender: 'erkek' | 'kiz';
      autismLevel: string;
      interests: string[];
      developmentAreas: string[];
    }>;
  };
}

export interface LoginResponse {
  token: string;
  user: User;
}

export const login = async (
  email: string,
  password: string,
  role: 'uzman' | 'danisan'
): Promise<LoginResponse> => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, role }),
  });

  if (!response.ok) {
    throw new Error('Giriş işlemi başarısız oldu');
  }

  const data = await response.json();
  return data;
};

export const register = async (
  name: string,
  email: string,
  password: string,
  role: 'uzman' | 'danisan'
): Promise<LoginResponse> => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password, role }),
  });

  if (!response.ok) {
    throw new Error('Kayıt işlemi başarısız oldu');
  }

  const data = await response.json();
  return data;
};

export const userService = {
  async getProfile() {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${API_URL}/users/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Profil bilgileri alınamadı');
    }

    return response.json();
  },

  async updateProfile(profileData: Partial<User['profile']>) {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${API_URL}/users/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new Error('Profil güncellenemedi');
    }

    return response.json();
  },

  async updateExpertProfile(expertProfileData: User['profile']['expertProfile']) {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${API_URL}/users/expert-profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(expertProfileData),
    });

    if (!response.ok) {
      throw new Error('Uzman profili güncellenemedi');
    }

    return response.json();
  },

  async getExperts(): Promise<User[]> {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${API_URL}/users/experts`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Uzmanlar alınamadı');
    }

    return response.json();
  },
}; 