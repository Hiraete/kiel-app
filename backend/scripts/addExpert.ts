import mongoose from 'mongoose';
import { User } from '../src/models/User';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kielapp';

async function addExpert() {
  await mongoose.connect(MONGODB_URI);

  const expert = new User({
    email: 'uzman1@example.com',
    password: '123456',
    role: 'uzman',
    profile: {
      fullName: 'Dr. Uzman Deneme',
      dateOfBirth: '1980-01-01',
      gender: 'erkek',
      autismLevel: 'hafif',
      phoneNumber: '5551112233',
      address: 'İstanbul',
      preferences: {
        notifications: true,
        language: 'tr',
        theme: 'light',
      },
      expertProfile: {
        specialization: ['Psikolog', 'Aile Danışmanı'],
        experience: 10,
        bio: '10 yıllık deneyimli uzman.',
        rating: 4.8,
        totalReviews: 25,
        availability: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: false,
          sunday: false,
        },
      },
    },
    childProfiles: [],
  });

  await expert.save();
  console.log('Uzman başarıyla eklendi!');
  await mongoose.disconnect();
}

addExpert().catch((err) => {
  console.error('Uzman eklenirken hata:', err);
  mongoose.disconnect();
}); 