import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

interface JwtPayload {
  userId: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Token'ı header'dan al
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Yetkilendirme token\'ı bulunamadı' });
    }

    // Token'ı doğrula
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    // Kullanıcıyı bul
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'Geçersiz token' });
    }

    // Kullanıcıyı request nesnesine ekle
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Lütfen giriş yapın' });
  }
}; 