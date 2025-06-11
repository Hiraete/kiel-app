import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  ExpertProfile: { expertId: string };
  CreateAppointment: { expertId: string };
  Appointments: undefined;
  AppointmentDetail: { appointmentId: string };
  VideoCall: { appointmentId: string; expertId: string };
  Exercises: { activityId: string };
  DailyActivity: { programId: string };
  DailyProgram: undefined;
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
  DailyActivity: undefined;
  Exercises: undefined;
  Games: undefined;
  Reports: undefined;
  Profile: undefined;
  Forums: undefined;
  Consultations: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, T>; 