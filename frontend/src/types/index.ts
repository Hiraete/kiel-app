// Kullanıcı ve Kimlik Doğrulama Tipleri
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'uzman' | 'danisan';
  profile: UserProfile;
}

export interface UserProfile {
  phone?: string;
  address?: string;
  expertProfile?: ExpertProfile;
  childProfiles?: ChildProfile[];
  preferences?: UserPreferences;
}

export interface ExpertProfile {
  title: string;
  specialization: string[];
  experience: number;
  rating: number;
  totalReviews: number;
  availability: {
    [key: string]: Array<{ start: string; end: string }>;
  };
}

export interface ChildProfile {
  _id: string;
  name: string;
  birthDate: string;
  gender: 'erkek' | 'kiz';
  autismLevel: 'hafif' | 'orta' | 'agir';
  interests: string[];
  developmentAreas: string[];
}

export interface UserPreferences {
  notifications: boolean;
  language: string;
  theme: 'light' | 'dark';
}

// Aktivite ve Program Tipleri
export interface Activity {
  _id: string;
  title: string;
  description: string;
  type: 'physical' | 'cognitive' | 'social' | 'sensory';
  difficultyLevel: string;
  duration: number;
  materials: string[];
  steps: string[];
  targetSkills: string[];
  ageRange: {
    min: number;
    max: number;
  };
  creator: string;
  ratings: ActivityRating[];
  createdAt: string;
  updatedAt: string;
}

export interface ActivityRating {
  userId: string;
  rating: number;
}

export interface Program {
  _id: string;
  name: string;
  description: string;
  activities: ProgramActivity[];
  creators: string[];
  assignees: string[];
  startDate: string;
  endDate: string;
  progress: number;
  status: 'active' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface ProgramActivity {
  activityId: string;
  order: number;
}

// Randevu Tipleri
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
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  rating?: number;
  review?: string;
}

// Bildirim Tipleri
export interface Notification {
  _id: string;
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  type: 'appointment' | 'system' | 'message';
  relatedId?: string;
}

// API Yanıt Tipleri
export interface AuthResponse {
  token: string;
  user: User;
}

export interface AppointmentResponse {
  appointments: Appointment[];
  total: number;
  page: number;
  limit: number;
}

// Form Tipleri
export interface LoginForm {
  email: string;
  password: string;
  role: 'uzman' | 'danisan';
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  role: 'uzman' | 'danisan';
} 