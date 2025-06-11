// Kullanıcı tipi tanımı
export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

// Giriş formu için tip tanımı
export interface LoginForm {
  email: string;
  password: string;
}

// Kayıt formu için tip tanımı
export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

// Kimlik doğrulama yanıtı için tip tanımı
export interface AuthResponse {
  user: User;
  token: string;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'scheduled';

export interface Appointment {
  _id: string;
  expert: {
    _id: string;
    name: string;
  };
  client: {
    _id: string;
    name: string;
  };
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  notes?: string;
  rating?: number;
  review?: string;
} 