import mongoose from 'mongoose';
import { User } from './models/User';

async function testDB() {
  try {
    // MongoDB bağlantısı
    await mongoose.connect('mongodb://localhost:27017/kielapp');
    console.log('MongoDB bağlantısı başarılı');

    // Tüm kullanıcıları bul
    const users = await User.find({});
    console.log('\nTüm kullanıcılar:');
    users.forEach(user => {
      console.log({
        id: user._id,
        email: user.email,
        role: user.role,
        hasPassword: !!user.password
      });
    });

    // Belirli bir email ile kullanıcı ara
    const testEmail = 'test3@test.com';
    const user = await User.findOne({ email: testEmail });
    console.log('\nAranan kullanıcı:', user ? {
      id: user._id,
      email: user.email,
      role: user.role,
      hasPassword: !!user.password
    } : 'Kullanıcı bulunamadı');

  } catch (error) {
    console.error('Hata:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nMongoDB bağlantısı kapatıldı');
  }
}

testDB(); 