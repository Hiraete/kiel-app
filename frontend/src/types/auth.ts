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