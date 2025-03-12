import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';

// JWT token oluşturma fonksiyonu
const generateToken = (user: IUser): string => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: '30d' }
  );
};

// Kullanıcı kaydı
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    // Kullanıcı zaten var mı kontrol et
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: 'Bu email adresi zaten kullanılıyor' });
      return;
    }

    // Yeni kullanıcı oluştur
    const user = await User.create({
      username,
      email,
      password
    });

    // Token oluştur ve yanıt ver
    const token = generateToken(user);
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    } else {
      res.status(500).json({ message: 'Bilinmeyen bir hata oluştu' });
    }
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

    // Token oluştur ve yanıt ver
    const token = generateToken(user);
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    } else {
      res.status(500).json({ message: 'Bilinmeyen bir hata oluştu' });
    }
  }
}; 