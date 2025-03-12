import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes';

// Ortam değişkenlerini yükle
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB bağlantısı
mongoose.connect(process.env.MONGODB_URI!)
  .then(() => console.log('MongoDB\'ye başarıyla bağlandı'))
  .catch((error: Error) => console.error('MongoDB bağlantı hatası:', error));

// Rotaları ekle
app.use('/api/users', userRoutes);

// Ana rota
app.get('/', (req: Request, res: Response) => {
  res.send('KielApp API çalışıyor');
});

// Sunucuyu başlat
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
}); 