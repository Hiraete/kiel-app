import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/app/utils/db';
import User from '@/app/models/User';

export async function POST(request: Request) {
  try {
    const { email, username, password } = await request.json();

    await dbConnect();

    // Email kontrolü
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Bu email adresi zaten kullanımda' },
        { status: 400 }
      );
    }

    // Şifreyi hashleme
    const hashedPassword = await bcrypt.hash(password, 10);

    // Yeni kullanıcı oluşturma
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });

    return NextResponse.json(
      {
        message: 'Kullanıcı başarıyla oluşturuldu',
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Kayıt hatası:', error);
    return NextResponse.json(
      { error: 'Kayıt işlemi sırasında bir hata oluştu' },
      { status: 500 }
    );
  }
} 