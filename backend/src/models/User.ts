import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'uzman' | 'danisan';
  profile: {
    phone?: string;
    address?: string;
    expertProfile?: {
      title: string;
      specialization: string[];
      experience: number;
      rating: number;
      totalReviews: number;
      availability: {
        [key: string]: Array<{ start: string; end: string }>;
      };
    };
    childProfiles?: Array<{
      id: string;
      name: string;
      birthDate: string;
      gender: 'erkek' | 'kiz';
      autismLevel: 'hafif' | 'orta' | 'agir';
      interests: string[];
      developmentAreas: string[];
    }>;
    preferences?: {
      notifications: boolean;
      language: string;
      theme: 'light' | 'dark';
    };
  };
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['uzman', 'danisan'], required: true },
  profile: {
    phone: String,
    address: String,
    expertProfile: {
      title: String,
      specialization: [String],
      experience: Number,
      rating: { type: Number, default: 0 },
      totalReviews: { type: Number, default: 0 },
      availability: {
        type: Map,
        of: [{
          start: String,
          end: String
        }]
      }
    },
    childProfiles: [{
      id: String,
      name: String,
      birthDate: String,
      gender: { type: String, enum: ['erkek', 'kiz'] },
      autismLevel: { type: String, enum: ['hafif', 'orta', 'agir'] },
      interests: [String],
      developmentAreas: [String]
    }],
    preferences: {
      notifications: { type: Boolean, default: true },
      language: { type: String, default: 'tr' },
      theme: { type: String, enum: ['light', 'dark'], default: 'light' }
    }
  }
}, {
  timestamps: true
});

// Şifre hashleme middleware
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

// Şifre karşılaştırma metodu
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);
