import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

// Screens
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { ExpertProfileScreen } from '../screens/ExpertProfileScreen';
import HomeScreen from '../screens/HomeScreen';
import AppointmentScreen from '../screens/AppointmentScreen';
import { CreateAppointmentScreen } from '../screens/CreateAppointmentScreen';
import NotificationsPage from '../pages/NotificationsPage';
import AppointmentsPage from '../pages/AppointmentsPage';
import OtherScreen from '../screens/OtherScreen';
import SensoryGameScreen from '../screens/SensoryGameScreen';
import SocialInteractionScreen from '../screens/SocialInteractionScreen';
import DailyProgramScreen from '../screens/DailyProgramScreen';
import AppointmentDetailScreen from '../screens/AppointmentDetailScreen';
import MemoryGameScreen from '../screens/MemoryGameScreen';
import MatchingGameScreen from '../screens/MatchingGameScreen';
import PuzzleGameScreen from '../screens/PuzzleGameScreen';
import VideoCallScreen from '../screens/VideoCallScreen';
import VideoChatScreen from '../screens/VideoChatScreen';
import ExercisesScreen from '../screens/ExercisesScreen';
import ExerciseDetailScreen from '../screens/ExerciseDetailScreen';
import SettingsScreen from '../screens/SettingsScreen';
import RoutineScreen from '../screens/RoutineScreen';
import ProgressScreen from '../screens/ProgressScreen';
import CommunicationScreen from '../screens/CommunicationScreen';
import ChatScreen from '../screens/ChatScreen';
import DailyActivityScreen from '../screens/DailyActivityScreen';
import ConsultationsScreen from '../screens/ConsultationsScreen';
import ConsultationScreen from '../screens/ConsultationScreen';
import ForumsScreen from '../screens/ForumsScreen';
import ForumScreen from '../screens/ForumScreen';
import ReportsScreen from '../screens/ReportsScreen';
import ActivitiesScreen from '../screens/ActivitiesScreen';
import { ChatbotScreen } from '../screens/ChatbotScreen';
import GamesScreen from '../screens/GamesScreen';

const Stack = createNativeStackNavigator<RootStackParamList & { Chatbot: undefined }>();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  const { user } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Appointments') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Notifications') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'Other') {
            iconName = focused ? 'apps' : 'apps-outline';
          } else if (route.name === 'Games') {
            iconName = focused ? 'game-controller' : 'game-controller-outline';
          } else {
            iconName = 'help-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Ana Sayfa' }} />
      <Tab.Screen name="Appointments" component={AppointmentsPage} options={{ title: 'Randevular' }} />
      <Tab.Screen name="Notifications" component={NotificationsPage} options={{ title: 'Bildirimler' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profil' }} />
      <Tab.Screen name="Other" component={OtherScreen} options={{ title: 'Diğer' }} />
      <Tab.Screen
        name="Games"
        component={GamesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="game-controller-outline" size={size} color={color} />
          ),
          tabBarLabel: 'Oyunlar',
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { user } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      {!user ? (
        // Auth screens
        <>
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Register" 
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
        </>
      ) : (
        // App screens
        <>
          <Stack.Screen
            name="MainTabs"
            component={MainTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ExpertProfile"
            component={ExpertProfileScreen}
            options={{ title: 'Uzman Profili' }}
          />
          <Stack.Screen
            name="CreateAppointment"
            component={CreateAppointmentScreen}
            options={{ title: 'Randevu Oluştur' }}
          />
          <Stack.Screen
            name="AppointmentDetail"
            component={AppointmentDetailScreen as any}
            options={{ title: 'Randevu Detayı' }}
          />
          <Stack.Screen
            name="VideoCall"
            component={VideoCallScreen as any}
            options={{ 
              title: 'Görüntülü Görüşme',
              headerShown: false 
            }}
          />
          <Stack.Screen
            name="SensoryGame"
            component={SensoryGameScreen}
            options={{ title: 'Duyusal Oyun' }}
          />
          <Stack.Screen
            name="SocialInteraction"
            component={SocialInteractionScreen}
            options={{ title: 'Sosyal Etkileşim' }}
          />
          <Stack.Screen
            name="DailyProgram"
            component={DailyProgramScreen}
            options={{ title: 'Günlük Program' }}
          />
          <Stack.Screen
            name="MemoryGame"
            component={MemoryGameScreen}
            options={{ title: 'Hafıza Oyunu' }}
          />
          <Stack.Screen
            name="MatchingGame"
            component={MatchingGameScreen}
            options={{ title: 'Eşleştirme Oyunu' }}
          />
          <Stack.Screen
            name="PuzzleGame"
            component={PuzzleGameScreen}
            options={{ title: 'Puzzle Oyunu' }}
          />
          <Stack.Screen
            name="VideoChat"
            component={VideoChatScreen}
            options={{
              title: 'Görüntülü Görüşme',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Exercises"
            component={ExercisesScreen}
            options={{ title: 'Egzersizler' }}
          />
          <Stack.Screen
            name="ExerciseDetail"
            component={ExerciseDetailScreen}
            options={{ title: 'Egzersiz Detayı' }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ title: 'Ayarlar' }}
          />
          <Stack.Screen
            name="Routine"
            component={RoutineScreen}
            options={{ title: 'Rutinler' }}
          />
          <Stack.Screen
            name="Progress"
            component={ProgressScreen}
            options={{ title: 'İlerleme' }}
          />
          <Stack.Screen
            name="Communication"
            component={CommunicationScreen}
            options={{ title: 'İletişim' }}
          />
          <Stack.Screen
            name="Chat"
            component={ChatScreen as React.ComponentType<any>}
            options={{ title: 'Sohbet' }}
          />
          <Stack.Screen
            name="DailyActivity"
            component={DailyActivityScreen}
            options={{ title: 'Günlük Aktivite' }}
          />
          <Stack.Screen
            name="Consultations"
            component={ConsultationsScreen}
            options={{ title: 'Görüşmeler' }}
          />
          <Stack.Screen
            name="Consultation"
            component={ConsultationScreen}
            options={{ title: 'Görüşme Detayı' }}
          />
          <Stack.Screen
            name="Forums"
            component={ForumsScreen}
            options={{ title: 'Forumlar' }}
          />
          <Stack.Screen
            name="Forum"
            component={ForumScreen}
            options={{ title: 'Forum Detayı' }}
          />
          <Stack.Screen
            name="Reports"
            component={ReportsScreen}
            options={{ title: 'Raporlar' }}
          />
          <Stack.Screen
            name="Activities"
            component={ActivitiesScreen}
            options={{ title: 'Aktiviteler' }}
          />
          <Stack.Screen
            name="Chatbot"
            component={ChatbotScreen as React.ComponentType<any>}
            options={{ title: 'Sağlık Asistanı' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator; 
