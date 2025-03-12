import express, { Request, Response, ErrorRequestHandler } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes';

// Ortam değişkenlerini yükle
dotenv.config();

const app = express();

// CORS ayarları
app.use(cors({
  origin: ['http://localhost:8081', 'http://localhost:19006', 'http://192.168.1.117:8081'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// MongoDB bağlantısı
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI!);
    console.log(`MongoDB'ye başarıyla bağlandı: ${conn.connection.host}`);
  } catch (error: any) {
    console.error('MongoDB bağlantı hatası:', error.message);
    process.exit(1);
  }
};

connectDB();

// API rotaları
app.use('/api/auth', userRoutes); // /auth endpoint'i altına taşıyoruz

// Ana rota
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'KielApp API çalışıyor' }); // HTML yerine JSON dönüyoruz
});

// Hata yakalama middleware
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error('Hata detayları:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body
  });
  
  if (err.name === 'ValidationError') {
    res.status(400).json({ 
      message: 'Validasyon hatası',
      errors: err.errors 
    });
    return;
  }
  
  if (err.name === 'MongoError' || err.name === 'MongoServerError') {
    res.status(500).json({ 
      message: 'Veritabanı hatası',
      error: err.message 
    });
    return;
  }

  res.status(500).json({ 
    message: 'Bir hata oluştu',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  });
};

app.use(errorHandler);

// Sunucuyu başlat
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
}); 