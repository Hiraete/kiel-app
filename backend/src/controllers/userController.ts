import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: 'uzman' | 'danisan';
  };
}

// JWT token oluşturma
const generateToken = (user: IUser): string => {
  return jwt.sign(
    { userId: user._id, role: user.role },
    JWT_SECRET,
    { expiresIn: '1d' }
  );
};

// Kullanıcı kaydı
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    // Email kontrolü
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'Bu email adresi zaten kullanımda' });
      return;
    }

    // Yeni kullanıcı oluştur
    const user = new User({
      name,
      email,
      password,
      role: role || 'danisan',
      profile: {
        preferences: {
          notifications: true,
          language: 'tr',
          theme: 'light',
        },
      },
    });

    await user.save();

    // JWT token oluştur
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: 'Kullanıcı başarıyla oluşturuldu',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
      token,
    });
  } catch (error) {
    console.error('Kayıt hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Kullanıcı girişi
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Kullanıcıyı bul
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: 'Geçersiz email veya şifre' });
      return;
    }

    // Şifreyi kontrol et
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ message: 'Geçersiz email veya şifre' });
      return;
    }

    // JWT token oluştur
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Giriş başarılı',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
      token,
    });
  } catch (error) {
    console.error('Giriş hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
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

// Profil güncelleme
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { name, email, profile } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'Kullanıcı bulunamadı' });
      return;
    }

    // Email değişikliği kontrolü
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({ message: 'Bu email adresi zaten kullanımda' });
        return;
      }
      user.email = email;
    }

    if (name) user.name = name;
    if (profile) user.profile = profile;

    await user.save();

    res.json({
      message: 'Profil başarıyla güncellendi',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
    });
  } catch (error) {
    console.error('Profil güncelleme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Uzman profil güncelleme
export const updateExpertProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: 'Kullanıcı bulunamadı' });
      return;
    }

    if (user.role !== 'uzman') {
      res.status(403).json({ message: 'Bu işlem sadece uzmanlar için geçerlidir' });
      return;
    }

    const expertProfile = req.body;
    user.profile = {
      ...user.profile,
      expertProfile
    };

    await user.save();

    res.json({
      message: 'Uzman profili başarıyla güncellendi',
      expertProfile: user.profile.expertProfile
    });
  } catch (error) {
    console.error('Uzman profil güncelleme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
}; 