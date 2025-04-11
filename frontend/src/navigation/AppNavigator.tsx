import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { ExpertProfileScreen } from '../screens/ExpertProfileScreen';
import HomeScreen from '../screens/HomeScreen';
import AppointmentScreen from '../screens/AppointmentScreen';
import { CreateAppointmentScreen } from '../screens/CreateAppointmentScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import AppointmentsScreen from '../screens/AppointmentsScreen';
import OtherScreen from '../screens/OtherScreen';
import SensoryGameScreen from '../screens/SensoryGameScreen';
import SocialInteractionScreen from '../screens/SocialInteractionScreen';
import DailyProgramScreen from '../screens/DailyProgramScreen';

const Stack = createNativeStackNavigator();
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
      <Tab.Screen name="Appointments" component={AppointmentsScreen} options={{ title: 'Randevular' }} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Bildirimler' }} />
      <Tab.Screen name="Other" component={OtherScreen} options={{ title: 'Diğer' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profil' }} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { user } = useAuth();

  return (
    <Stack.Navigator>
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
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator; 