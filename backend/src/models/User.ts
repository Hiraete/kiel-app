import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface ChildProfile {
  id: string;
  name: string;
  birthDate: string;
  gender: 'erkek' | 'kadın';
  autismLevel: 'hafif' | 'orta' | 'ağır';
  interests: string[];
  developmentAreas: string[];
}

export interface IUser extends Document {
  email: string;
  password: string;
  role: 'uzman' | 'danisan';
  profile: {
    fullName: string;
    dateOfBirth: string;
    gender: 'erkek' | 'kadın';
    autismLevel: 'hafif' | 'orta' | 'ağır';
    phoneNumber: string;
    address: string;
    preferences: {
      notifications: boolean;
      language: 'tr' | 'en';
      theme: 'light' | 'dark';
    };
    expertProfile?: {
      title: string;
      specialization: string[];
      experience: number;
      rating: number;
      totalReviews: number;
      availability: {
        monday: boolean;
        tuesday: boolean;
        wednesday: boolean;
        thursday: boolean;
        friday: boolean;
        saturday: boolean;
        sunday: boolean;
      };
    };
  };
  childProfiles: ChildProfile[];
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['uzman', 'danisan'],
      required: true,
    },
    profile: {
      fullName: {
        type: String,
        default: '',
      },
      dateOfBirth: {
        type: String,
        default: '',
      },
      gender: {
        type: String,
        enum: ['erkek', 'kadın'],
        default: 'erkek',
      },
      autismLevel: {
        type: String,
        enum: ['hafif', 'orta', 'ağır'],
        default: 'hafif',
      },
      phoneNumber: {
        type: String,
        default: '',
      },
      address: {
        type: String,
        default: '',
      },
      preferences: {
        notifications: {
          type: Boolean,
          default: true,
        },
        language: {
          type: String,
          enum: ['tr', 'en'],
          default: 'tr',
        },
        theme: {
          type: String,
          enum: ['light', 'dark'],
          default: 'light',
        },
      },
      expertProfile: {
        title: String,
        specialization: [String],
        experience: Number,
        rating: { type: Number, default: 0 },
        totalReviews: { type: Number, default: 0 },
        availability: {
          monday: { type: Boolean, default: false },
          tuesday: { type: Boolean, default: false },
          wednesday: { type: Boolean, default: false },
          thursday: { type: Boolean, default: false },
          friday: { type: Boolean, default: false },
          saturday: { type: Boolean, default: false },
          sunday: { type: Boolean, default: false },
        },
      },
    },
    childProfiles: [{
      id: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      birthDate: {
        type: String,
        required: true,
      },
      gender: {
        type: String,
        enum: ['erkek', 'kadın'],
        required: true,
      },
      autismLevel: {
        type: String,
        enum: ['hafif', 'orta', 'ağır'],
        required: true,
      },
      interests: [{
        type: String,
      }],
      developmentAreas: [{
        type: String,
      }],
    }],
  },
  {
    timestamps: true,
  }
);

// Şifre hashleme middleware
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error as Error);
  }
});

// Şifre karşılaştırma metodu
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);
