import mongoose from 'mongoose';

export interface IUser {
  email: string;
  username: string;
  password: string;
  createdAt: Date;
}

const userSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Email gereklidir'],
    unique: true,
  },
  username: {
    type: String,
    required: [true, 'Kullanıcı adı gereklidir'],
  },
  password: {
    type: String,
    required: [true, 'Şifre gereklidir'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.User || mongoose.model<IUser>('User', userSchema); 