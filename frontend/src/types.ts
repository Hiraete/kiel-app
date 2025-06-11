import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  MainTabs: undefined;
  Home: undefined;
  Login: undefined;
  Register: undefined;
  Profile: undefined;
  ExpertProfile: undefined;
  CreateAppointment: undefined;
  AppointmentDetail: { id: string };
  VideoCall: { id: string };
  Settings: undefined;
  Exercises: undefined;
  ExerciseDetail: { exerciseId: string };
  Consultations: undefined;
  Consultation: { id: string };
  Forums: undefined;
  Forum: { id: string };
  Reports: undefined;
  Report: { id: string };
  Notifications: undefined;
  Appointments: undefined;
  Messages: undefined;
  VideoChat: undefined;
  DailyActivity: undefined;
  DailyProgram: undefined;
  Activities: undefined;
  Games: undefined;
  PuzzleGame: undefined;
  MatchingGame: undefined;
  MemoryGame: undefined;
  SensoryGame: undefined;
  SocialInteraction: undefined;
  Progress: undefined;
  Routine: undefined;
  Communication: undefined;
  Chat: { id: string };
  Other: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  DailyActivity: undefined;
  Exercises: undefined;
  Games: undefined;
  Reports: undefined;
  Profile: undefined;
  Forums: undefined;
  Consultations: undefined;
  Appointments: undefined;
  Notifications: undefined;
  Other: undefined;
};

export interface Activity {
  _id: string;
  name: string;
  description: string;
  duration: number;
  difficulty: 'kolay' | 'orta' | 'zor';
  category: string;
  materials?: string[];
  steps: string[];
  tips?: string[];
  imageUrl?: string;
}

export interface Program {
  _id: string;
  name: string;
  description: string;
  activities: {
    activityId: string;
    order: number;
    completed: boolean;
    notes?: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export type RootStackScreenProps<T extends keyof RootStackParamList> = {
  navigation: RootStackNavigationProp;
  route: RouteProp<RootStackParamList, T>;
};

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'uzman' | 'danisan';
  profile: {
    phone?: string;
    address?: string;
    bio?: string;
    expertProfile?: {
      title: string;
      specialization: string[];
      experience: number;
      rating: number;
      totalReviews: number;
      availability: {
        monday: boolean;
        tuesday: boolean;
        wednesday: boolean;
        thursday: boolean;
        friday: boolean;
        saturday: boolean;
        sunday: boolean;
      };
    };
    childProfiles?: {
      name: string;
      age: number;
      gender: 'male' | 'female' | 'other';
      specialNeeds?: string;
    }[];
    preferences?: {
      language: string;
      notifications: boolean;
      darkMode: boolean;
    };
  };
} 