import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import authRoutes from './routes/auth';
import protectedRoutes from './routes/protected';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'KielApp API çalışıyor' });
});

// MongoDB bağlantısı ve sunucuyu başlatma
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda çalışıyor`);
  });
}); 