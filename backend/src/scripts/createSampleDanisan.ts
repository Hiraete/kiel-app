import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { Appointment } from '../models/Appointment';
import { Notification } from '../models/Notification';
import { Program } from '../models/Program';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/kielapp';

async function main() {
  await mongoose.connect(MONGO_URI);

  // 0. Uzman oluştur (eğer yoksa)
  let uzman = await User.findOne({ email: 'uzman1@gmail.com' });
  let uzmanPassword = await bcrypt.hash('123456', 10);
  if (!uzman) {
    uzman = await User.create({
      email: 'uzman1@gmail.com',
      password: uzmanPassword,
      role: 'uzman',
      profile: {
        fullName: 'Dr. Uzman',
        dateOfBirth: '1980-01-01',
        gender: 'erkek',
        autismLevel: 'hafif',
        phoneNumber: '5550000000',
        address: 'Ankara',
        preferences: {
          notifications: true,
          language: 'tr',
          theme: 'light',
        },
        expertProfile: {
          title: 'Çocuk Psikoloğu',
          specialization: ['Otizm'],
          experience: 10,
          rating: 5,
          totalReviews: 100,
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
  }

  // 1. Danışan (ebeveyn) oluştur
  const danisanPassword = await bcrypt.hash('123456', 10);
  const danisan = await User.create({
    email: 'ebeveyn5@gmail.com',
    password: danisanPassword,
    role: 'danisan',
    profile: {
      fullName: 'Ayşe Yılmaz',
      dateOfBirth: '1985-05-10',
      gender: 'kadın',
      autismLevel: 'hafif',
      phoneNumber: '5551234567',
      address: 'İstanbul',
      preferences: {
        notifications: true,
        language: 'tr',
        theme: 'light',
      },
    },
    childProfiles: [
      {
        id: 'cocukid1',
        name: 'Mehmet Yılmaz',
        birthDate: '2015-03-15',
        gender: 'erkek',
        autismLevel: 'orta',
        interests: ['lego', 'resim'],
        developmentAreas: ['iletişim', 'motor beceri'],
      },
    ],
  });

  // 2. Randevu oluştur
  const appointment = await Appointment.create({
    expert: { id: uzman._id, name: uzman.profile.fullName },
    client: { id: danisan._id, name: danisan.profile.fullName },
    date: new Date('2024-06-12T12:00:00Z'),
    startTime: '12:00',
    endTime: '12:30',
    status: 'accepted',
    notes: 'İlk görüşme',
  });

  // 3. Bildirim oluştur
  await Notification.create({
    userId: danisan._id,
    title: 'Randevu Onayı',
    message: 'Randevunuz onaylandı.',
    type: 'appointment',
    isRead: false,
    createdAt: new Date('2024-06-01T09:00:00Z'),
    relatedId: appointment._id,
  });

  // 4. Program oluştur
  await Program.create({
    name: 'Gelişim Programı',
    description: 'Otizmli çocuklar için gelişim programı.',
    activities: [],
    createdBy: uzman._id,
    assignedTo: danisan._id,
    startDate: new Date('2024-06-01'),
    endDate: new Date('2024-07-01'),
    progress: [],
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  console.log('Örnek danışan, uzman ve ilişkili veriler başarıyla eklendi!');
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
}); 