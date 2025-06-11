import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: 'uzman' | 'danisan';
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Yetkilendirme token\'ı bulunamadı' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as {
      id: string;
      role: 'uzman' | 'danisan';
    };

    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    res.status(403).json({ message: 'Geçersiz token' });
  }
};

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token;

    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(401).json({ message: 'Yetkilendirme hatası' });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = (await User.findById(decoded.id).select('-password')) as IUser;

    if (!user) {
      res.status(401).json({ message: 'Geçersiz token' });
      return;
    }

    req.user = {
      id: user.id,
      role: user.role,
    };

    next();
  } catch (error) {
    res.status(401).json({ message: 'Yetkilendirme hatası', error: (error as Error).message });
  }
}; 