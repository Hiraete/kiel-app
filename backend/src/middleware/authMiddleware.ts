import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers['authorization'];
    console.log('Auth header:', authHeader);
    
    if (!authHeader) {
      res.status(401).json({ 
        success: false,
        message: 'Yetkilendirme başlığı bulunamadı'
      });
      return;
    }

    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;
      
    console.log('Token:', token);

    if (!token) {
      res.status(401).json({ 
        success: false,
        message: 'Yetkilendirme token\'ı bulunamadı'
      });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultsecret');
    console.log('Decoded token:', decoded);
    
    (req as any).user = decoded;
    next();
  } catch (error: any) {
    console.error('Token doğrulama hatası:', error);
    res.status(403).json({ 
      success: false,
      message: 'Geçersiz token',
      error: error.message
    });
  }
}; 