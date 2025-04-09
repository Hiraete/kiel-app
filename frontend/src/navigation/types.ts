export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainStack: undefined;
  MainTabs: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  DailyActivity: { programId: string };
  Exercises: { activityId: string };
  Games: undefined;
  Reports: undefined;
  Profile: undefined;
  Forums: undefined;
  Consultations: undefined;
}; 