import { Request, Response } from 'express';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Kullanıcı kaydı
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'Bu email adresi zaten kullanımda' });
      return;
    }

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

    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
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
    res.status(500).json({ message: 'Sunucu hatası', error: (error as Error).message });
  }
};

// Kullanıcı girişi
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: 'Geçersiz email veya şifre' });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ message: 'Geçersiz email veya şifre' });
      return;
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
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
    res.status(500).json({ message: 'Sunucu hatası', error: (error as Error).message });
  }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Yetkilendirme gerekli' });
      return;
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      res.status(404).json({ message: 'Kullanıcı bulunamadı' });
      return;
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: (error as Error).message });
  }
};

// Profil güncelleme
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Yetkilendirme gerekli' });
      return;
    }

    const { fullName, dateOfBirth, gender, autismLevel, phoneNumber, address, preferences } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'Kullanıcı bulunamadı' });
      return;
    }

    user.profile = {
      ...user.profile,
      fullName: fullName || user.profile.fullName,
      dateOfBirth: dateOfBirth || user.profile.dateOfBirth,
      gender: gender || user.profile.gender,
      autismLevel: autismLevel || user.profile.autismLevel,
      phoneNumber: phoneNumber || user.profile.phoneNumber,
      address: address || user.profile.address,
      preferences: {
        ...user.profile.preferences,
        ...preferences,
      },
    };

    await user.save();

    res.json({
      message: 'Profil başarıyla güncellendi',
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        profile: user.profile,
        childProfiles: user.childProfiles,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: (error as Error).message });
  }
};

// Uzman profil güncelleme
export const updateExpertProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Yetkilendirme gerekli' });
      return;
    }

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
    res.status(500).json({ message: 'Sunucu hatası', error: (error as Error).message });
  }
}; 