import mongoose from 'mongoose';
import { User } from '../models/User';
import { Appointment } from '../models/Appointment';
import { Notification } from '../models/Notification';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/kielapp';

async function main() {
  await mongoose.connect(MONGO_URI);

  // Kullanıcıyı bul
  const user = await User.findOne({ email: 'emircanemircan@gmail.com' });
  if (!user) {
    console.error('Kullanıcı bulunamadı!');
    process.exit(1);
  }

  // Örnek randevu ekle
  const appointment = await Appointment.create({
    expert: { id: 'uzmanid1', name: 'Dr. Uzman' },
    client: { id: user._id, name: user.profile.fullName },
    date: new Date('2024-07-01T14:00:00Z'),
    startTime: '14:00',
    endTime: '14:30',
    status: 'accepted',
    notes: 'Test randevusu',
  });

  // Örnek bildirim ekle
  await Notification.create({
    userId: user._id,
    title: 'Yeni Randevu',
    message: 'Yeni bir randevunuz var.',
    type: 'appointment',
    isRead: false,
    createdAt: new Date(),
    relatedId: appointment._id,
  });

  console.log('Randevu ve bildirim başarıyla eklendi!');
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
}); 