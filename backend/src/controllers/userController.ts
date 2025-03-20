import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// JWT token oluşturma fonksiyonu
const generateToken = (user: any): string => {
  const payload = {
    userId: user._id,
    email: user.email,
    username: user.username
  };
  
  return jwt.sign(
    payload,
    process.env.JWT_SECRET || 'defaultsecret',
    { expiresIn: '30d' } // Token süresini 30 güne çıkaralım
  );
};

// Kullanıcı kaydı
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Register isteği:', req.body);
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ message: 'Tüm alanlar zorunludur' });
      return;
    }

    // Email kontrolü
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'Bu email adresi zaten kullanımda' });
      return;
    }

    // Yeni kullanıcı oluşturma
    const user = new User({
      username,
      email,
      password // Model'deki pre-save hook şifreyi hashleyecek
    });

    await user.save();
    
    // Token oluştur ve gönder
    const token = generateToken(user);
    res.status(201).json({
      message: 'Kullanıcı başarıyla oluşturuldu',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error: any) {
    console.error('Register hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// Kullanıcı girişi
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Login isteği:', req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('Email veya şifre eksik');
      res.status(400).json({ message: 'Email ve şifre zorunludur' });
      return;
    }

    // Kullanıcı kontrolü
    const user = await User.findOne({ email });
    console.log('Bulunan kullanıcı:', user);

    if (!user) {
      console.log('Kullanıcı bulunamadı:', email);
      res.status(400).json({ message: 'Kullanıcı bulunamadı' });
      return;
    }

    // Şifre kontrolü
    const validPassword = await user.comparePassword(password);
    console.log('Şifre kontrolü sonucu:', validPassword);

    if (!validPassword) {
      console.log('Geçersiz şifre');
      res.status(400).json({ message: 'Geçersiz şifre' });
      return;
    }

    // Token oluştur ve gönder
    const token = generateToken(user);
    console.log('Token oluşturuldu:', token);

    res.json({
      success: true,
      message: 'Giriş başarılı',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (error: any) {
    console.error('Login hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      res.status(404).json({ message: 'Kullanıcı bulunamadı' });
      return;
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const { username, email } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'Kullanıcı bulunamadı' });
      return;
    }

    if (username) user.username = username;
    if (email) user.email = email;

    await user.save();
    res.json({ message: 'Profil başarıyla güncellendi' });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
}; 