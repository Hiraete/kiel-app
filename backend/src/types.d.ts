import { Request } from 'express';

interface IUser {
  _id: string;
  email: string;
  password: string;
  role: 'uzman' | 'danisan';
  profile: {
    fullName: string;
    dateOfBirth: string;
    gender: 'erkek' | 'kadın';
    autismLevel: 'hafif' | 'orta' | 'ağır';
    phoneNumber: string;
    address: string;
    preferences: {
      notifications: boolean;
      language: 'tr' | 'en';
      theme: 'light' | 'dark';
    };
  };
  childProfiles: Array<{
    name: string;
    dateOfBirth: string;
    gender: 'erkek' | 'kadın';
    autismLevel: 'hafif' | 'orta' | 'ağır';
  }>;
}

declare global {
  namespace Express {
    interface User {
      id: string;
      role: 'uzman' | 'danisan';
    }
    interface Request {
      user?: User;
    }
  }
} 