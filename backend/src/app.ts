import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import profileRoutes from './routes/profileRoutes';
import activityRoutes from './routes/activityRoutes';
import programRoutes from './routes/programRoutes';
import notificationRoutes from './routes/notificationRoutes';
import userRoutes from './routes/userRoutes';
import appointmentRoutes from './routes/appointmentRoutes';

interface CustomError extends Error {
  status?: number;
  errors?: any;
}

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:8081', 'http://localhost:19006', 'http://192.168.1.117:8081'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);

// MongoDB bağlantısı
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kielapp';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB bağlantısı başarılı');
  })
  .catch((error) => {
    console.error('MongoDB bağlantı hatası:', error);
    process.exit(1);
  });

// Hata yönetimi middleware
app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
  console.error('Hata detayları:', {
    message: err.message,
    stack: err.stack,
    status: err.status,
    errors: err.errors,
    path: req.path,
    method: req.method,
    body: req.body
  });

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Bir hata oluştu',
    errors: err.errors,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});

export default app; 