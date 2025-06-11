import mongoose from 'mongoose';
import { Notification } from '../src/models/Notification';
import { Appointment } from '../src/models/Appointment';

async function seed() {
  await mongoose.connect('mongodb://localhost:27017/kielapp');

  // Bildirimleri temizle ve ekle
  await Notification.deleteMany({});
  await Notification.insertMany([
    {
      userId: new mongoose.Types.ObjectId(),
      type: 'system',
      title: 'Hoş geldiniz!',
      message: 'Uygulamamıza hoş geldiniz.',
      isRead: false,
      data: {},
    },
    {
      userId: new mongoose.Types.ObjectId(),
      type: 'appointment',
      title: 'Randevu Onayı',
      message: 'Randevunuz onaylandı.',
      isRead: false,
      data: {},
    },
  ]);

  // Randevuları temizle ve ekle
  await Appointment.deleteMany({});
  await Appointment.insertMany([
    {
      expert: { id: '1', name: 'Dr. Uzman' },
      client: { id: '2', name: 'Danışan Ali' },
      date: new Date('2024-06-10'),
      startTime: '10:00',
      endTime: '10:30',
      notes: 'İlk görüşme',
      status: 'pending',
    },
    {
      expert: { id: '1', name: 'Dr. Uzman' },
      client: { id: '3', name: 'Danışan Ayşe' },
      date: new Date('2024-06-12'),
      startTime: '14:00',
      endTime: '14:30',
      notes: 'Kontrol görüşmesi',
      status: 'accepted',
    },
  ]);

  console.log('Dummy bildirim ve randevu verileri eklendi!');
  process.exit();
}

seed(); 