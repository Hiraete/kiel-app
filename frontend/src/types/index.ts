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

// Bildirim Tipleri
export type NotificationType = 'appointment' | 'system' | 'message';

export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
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

// Navigasyon Tipleri
export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  Profile: undefined;
  Appointments: undefined;
  CreateAppointment: undefined;
  AppointmentDetail: { appointmentId: string };
  Exercises: { activityId: string };
  DailyActivity: { programId: string };
  Games: undefined;
  MemoryGame: undefined;
  MatchingGame: undefined;
  PuzzleGame: undefined;
  SensoryGame: undefined;
  SocialInteraction: undefined;
  Notifications: undefined;
  Other: undefined;
  Communication: undefined;
  Progress: undefined;
  Routine: undefined;
  Settings: undefined;
};

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