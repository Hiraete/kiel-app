import { Schema, model, Document } from 'mongoose';
import bcryptjs from 'bcryptjs';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: [true, 'Kullanıcı adı zorunludur'],
    trim: true,
    minlength: [3, 'Kullanıcı adı en az 3 karakter olmalıdır']
  },
  email: {
    type: String,
    required: [true, 'Email adresi zorunludur'],
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Şifre zorunludur'],
    minlength: [6, 'Şifre en az 6 karakter olmalıdır']
  }
}, {
  timestamps: true
});

// Şifreyi hashleme
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Şifre karşılaştırma metodu
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    console.log('Karşılaştırılacak şifreler:', {
      candidate: candidatePassword,
      stored: this.password
    });
    const isMatch = await bcryptjs.compare(candidatePassword, this.password);
    console.log('Şifre eşleşmesi:', isMatch);
    return isMatch;
  } catch (error) {
    console.error('Şifre karşılaştırma hatası:', error);
    throw new Error('Şifre karşılaştırma hatası');
  }
};

export const User = model<IUser>('User', userSchema);
export default User; 