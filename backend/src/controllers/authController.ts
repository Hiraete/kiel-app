import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, role } = req.body;

    // Kullanıcı adı ve email kontrolü
    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'Bu kullanıcı adı veya email zaten kullanılıyor'
      });
    }

    // Yeni kullanıcı oluştur
    const user = new User({
      username,
      email,
      password,
      role
    });

    await user.save();

    // JWT token oluştur
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Kullanıcı başarıyla oluşturuldu',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Kayıt hatası:', error);
    res.status(500).json({
      message: 'Kayıt işlemi sırasında bir hata oluştu'
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Kullanıcıyı bul
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: 'Geçersiz email veya şifre'
      });
    }

    // Şifreyi kontrol et
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        message: 'Geçersiz email veya şifre'
      });
    }

    // JWT token oluştur
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Giriş başarılı',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Giriş hatası:', error);
    res.status(500).json({
      message: 'Giriş işlemi sırasında bir hata oluştu'
    });
  }
}; 