import express, { Request, Response } from 'express';
import { User } from '../models/User';

import jwt from 'jsonwebtoken';
const { body, validationResult } = require('express-validator');

const router = express.Router();

interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role?: 'uzman' | 'danisan';
}

// Register route
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Geçerli bir email adresi giriniz'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Şifre en az 6 karakter olmalıdır'),
    body('name').not().isEmpty().withMessage('İsim alanı zorunludur'),
  ],
  async (req: Request<{}, {}, RegisterRequest>, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log('Validasyon hatası:', errors.array());
        res.status(400).json({ 
          success: false,
          message: 'Validasyon hatası',
          errors: errors.array() 
        });
        return;
      }

      const { email, password, name } = req.body;

      // Check if user already exists
      let user = await User.findOne({ email });
      if (user) {
        res.status(400).json({ 
          success: false,
          message: 'Bu email adresi zaten kullanımda' 
        });
        return;
      }

      // Create new user
      user = new User({
        email,
        password,
        name,
        role: 'danisan',
        profile: {
          fullName: name,
          preferences: {
            notifications: true,
            language: 'tr',
            theme: 'light',
          },
        },
      });

      await user.save();

      // Create JWT token
      const payload = {
        user: {
          id: user.id,
          role: user.role,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' },
        (err, token) => {
          if (err) {
            console.error('Token oluşturma hatası:', err);
            res.status(500).json({ 
              success: false,
              message: 'Token oluşturulurken bir hata oluştu' 
            });
            return;
          }
          res.status(201).json({ 
            success: true,
            message: 'Kayıt başarılı',
            token,
            user: {
              id: user.id,
              email: user.email,
              role: user.role
            }
          });
        }
      );
    } catch (error: any) {
      console.error('Kayıt hatası:', error);
      res.status(500).json({ 
        success: false,
        message: 'Sunucu hatası',
        error: error.message 
      });
    }
  }
);

// Login route
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Geçerli bir email adresi giriniz'),
    body('password').exists().withMessage('Şifre alanı zorunludur'),
  ],
  async (req: Request, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log('Validasyon hatası:', errors.array());
        res.status(400).json({ 
          success: false,
          message: 'Validasyon hatası',
          errors: errors.array() 
        });
        return;
      }

      const { email, password } = req.body;
      console.log('Login isteği alındı:', { email });

      // Kullanıcıyı bul
      let user = await User.findOne({ email });
      if (!user) {
        console.log('Kullanıcı bulunamadı:', email);
        res.status(400).json({ 
          success: false,
          message: 'Bu email adresi ile kayıtlı kullanıcı bulunamadı' 
        });
        return;
      }

      // Şifre kontrolü
      console.log('Şifre kontrolü yapılıyor...');
      const isMatch = await user.comparePassword(password);
      console.log('Şifre kontrolü sonucu:', isMatch);

      if (!isMatch) {
        console.log('Şifre uyuşmazlığı:', email);
        res.status(400).json({ 
          success: false,
          message: 'Şifre hatalı' 
        });
        return;
      }

      // JWT token oluştur
      const payload = {
        user: {
          id: user.id,
          role: user.role,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' },
        (err, token) => {
          if (err) {
            console.error('Token oluşturma hatası:', err);
            res.status(500).json({ 
              success: false,
              message: 'Token oluşturulurken bir hata oluştu' 
            });
            return;
          }
          
          console.log('Login başarılı:', { email, role: user.role });
          res.json({
            success: true,
            message: 'Giriş başarılı',
            token,
            user: {
              id: user.id,
              email: user.email,
              role: user.role,
              profile: user.profile,
              childProfiles: user.childProfiles,
            }
          });
        }
      );
    } catch (error: any) {
      console.error('Login işlemi hatası:', error);
      res.status(500).json({ 
        success: false,
        message: 'Sunucu hatası',
        error: error.message 
      });
    }
  }
);

export default router; 