import express, { Express, Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import appointmentRoutes from './routes/appointment';
import activityRoutes from './routes/activityRoutes';
import profileRoutes from './routes/profileRoutes';
import programRoutes from './routes/programRoutes';

dotenv.config();

const app = express();

app.use(cors({
  origin: ['http://localhost:8081', 'http://localhost:19006', 'http://192.168.1.117:8081'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/kielapp';
    await mongoose.connect(mongoUri);
    console.log('MongoDB bağlantısı başarılı');
    console.log(`Bağlantı URL'si: ${mongoUri}`);
  } catch (error: any) {
    console.error('MongoDB bağlantı hatası:', error.message);
    process.exit(1);
  }
};
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/appointment', appointmentRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/program', programRoutes);

app.get('/', (_: Request, res: Response) => {
  res.json({ message: 'KielApp API çalışıyor' });
});

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error('Hata detayları:', {
    message: err.message,
    stack: err.stack,
    path: _req.path,
    method: _req.method,
    body: _req.body
  });

  if (err.name === 'ValidationError') {
    res.status(400).json({ message: 'Validasyon hatası', errors: err.errors });
    return;
  }

  if (err.name === 'MongoError' || err.name === 'MongoServerError') {
    res.status(500).json({ message: 'Veritabanı hatası', error: err.message });
    return;
  }

  res.status(500).json({ 
    message: 'Bir hata oluştu',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  });
};

app.use(errorHandler);

const PORT: string | number = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
});
