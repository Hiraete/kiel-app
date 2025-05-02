import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  ExpertProfile: { expertId: string };
  CreateAppointment: { expertId: string };
  Appointments: undefined;
  AppointmentDetail: { appointmentId: string };
  Exercises: { activityId: string };
  DailyActivity: { programId: string };
  SensoryGame: undefined;
  SocialInteraction: undefined;
  MemoryGame: undefined;
  MatchingGame: undefined;
  PuzzleGame: undefined;
  PhysicalExercises: undefined;
  CognitiveExercises: undefined;
  SocialExercises: undefined;
  DailyRoutines: undefined;
  WeeklyRoutines: undefined;
  CustomRoutines: undefined;
  CommunicationCards: undefined;
  EmotionCards: undefined;
  SocialStories: undefined;
  ProgressReport: undefined;
  Achievements: undefined;
  Statistics: undefined;
  Chat: { expertId: string; expertName: string; expertImage?: string };
};

export type MainTabParamList = {
  Home: undefined;
  Profile: undefined;
  Settings: undefined;
  Other: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, T>; 