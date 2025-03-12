import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';

interface DecodedToken {
  id: string;
  email: string;
}

interface AuthRequest extends Request {
  user?: IUser;
  headers: {
    authorization?: string;
  };
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  let token: string | undefined;

  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      // Token'ı al
      token = req.headers.authorization.split(' ')[1];

      // Token'ı doğrula
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

      // Kullanıcıyı bul ve şifreyi hariç tut
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        res.status(401).json({ message: 'Kullanıcı bulunamadı' });
        return;
      }

      req.user = user;
      next();
    } catch (error) {
      if (error instanceof Error) {
        res.status(401).json({ message: 'Yetkilendirme başarısız', error: error.message });
      } else {
        res.status(401).json({ message: 'Yetkilendirme başarısız' });
      }
      return;
    }
  } else {
    res.status(401).json({ message: 'Token bulunamadı' });
    return;
  }
}; 