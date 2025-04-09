import express, { Request, Response } from 'express';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const { body, validationResult } = require('express-validator');

const router = express.Router();

interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role?: 'uzman' | 'danisan';
}

interface LoginRequest {
  email: string;
  password: string;
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
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { email, password, name, role } = req.body;

      // Check if user already exists
      let user = await User.findOne({ email });
      if (user) {
        res.status(400).json({ message: 'Bu email adresi zaten kullanımda' });
        return;
      }

      // Create new user
      user = new User({
        email,
        password,
        name,
        role: role || 'danisan',
        profile: {
          preferences: {
            notifications: true,
            language: 'tr',
            theme: 'light',
          },
        },
      });

      // Hash password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

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
        { expiresIn: '1h' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error: any) {
      console.error(error.message);
      res.status(500).send('Sunucu hatası');
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
  async (req: Request<{}, {}, LoginRequest>, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { email, password } = req.body;

      // Check if user exists
      let user = await User.findOne({ email });
      if (!user) {
        res.status(400).json({ message: 'Geçersiz kullanıcı bilgileri' });
        return;
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        res.status(400).json({ message: 'Geçersiz kullanıcı bilgileri' });
        return;
      }

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
        { expiresIn: '1h' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error: any) {
      console.error(error.message);
      res.status(500).send('Sunucu hatası');
    }
  }
);

export default router;
