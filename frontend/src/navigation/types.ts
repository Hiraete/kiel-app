import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  ExpertProfile: { expertId: string };
  CreateAppointment: { expertId: string };
  Appointments: undefined;
  Exercises: { activityId: string };
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
};

export type MainTabParamList = {
  Home: undefined;
  Profile: undefined;
  Settings: undefined;
  Other: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, T>; 