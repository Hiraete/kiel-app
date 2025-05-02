export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Profile: undefined;
  Appointments: undefined;
  CreateAppointment: undefined;
  Notifications: undefined;
  Exercises: undefined;
  DailyActivity: { programId: string };
  Other: undefined;
  Games: undefined;
  Communication: undefined;
  Progress: undefined;
  Routine: undefined;
  Settings: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Appointments: undefined;
  Notifications: undefined;
  Profile: undefined;
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