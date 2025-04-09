import { Request } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: 'uzman' | 'danisan';
    name: string;
    _id?: string;
  };
}

export const auth = async (req: AuthRequest, res: any, next: any) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as {
      id: string;
      role: 'uzman' | 'danisan';
      name: string;
    };

    req.user = {
      id: decoded.id,
      role: decoded.role,
      name: decoded.name
    };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Lütfen giriş yapın' });
  }
}; 