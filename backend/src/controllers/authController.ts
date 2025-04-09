import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, role } = req.body;

    // Email kontrolü
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Bu email adresi zaten kullanımda' });
    }

    // Yeni kullanıcı oluştur
    const user = new User({
      email,
      password,
      role,
      profile: {
        fullName: '',
        dateOfBirth: '',
        gender: 'erkek',
        autismLevel: 'hafif',
        phoneNumber: '',
        address: '',
        preferences: {
          notifications: true,
          language: 'tr',
          theme: 'light',
        },
      },
      childProfiles: [],
    });

    await user.save();

    // Token oluştur
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(201).json({
      message: 'Kullanıcı başarıyla oluşturuldu',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        profile: user.profile,
        childProfiles: user.childProfiles,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, role } = req.body;

    // Kullanıcıyı bul
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Geçersiz email veya şifre' });
    }

    // Rol kontrolü
    if (user.role !== role) {
      return res.status(401).json({ message: 'Bu hesap türü için giriş yapamazsınız' });
    }

    // Şifre kontrolü
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Geçersiz email veya şifre' });
    }

    // Token oluştur
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      message: 'Giriş başarılı',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        profile: user.profile,
        childProfiles: user.childProfiles,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
}; 