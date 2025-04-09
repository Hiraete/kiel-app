import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userService } from './src/services/userService';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#007AFF',
    primaryContainer: '#E1F0FF',
    secondary: '#5856D6',
    secondaryContainer: '#ECEAFF',
    tertiary: '#34C759',
    tertiaryContainer: '#E3FFF1',
    surface: '#FFFFFF',
    surfaceVariant: '#F3F4F6',
    background: '#FFFFFF',
    error: '#FF3B30',
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onTertiary: '#FFFFFF',
    onSurface: '#1F2937',
    onSurfaceVariant: '#6B7280',
    onBackground: '#1F2937',
    onError: '#FFFFFF',
  },
  roundness: 12,
};

const AuthWrapper = () => {
  const { user, setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const userData = await userService.getProfile();
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth kontrolü sırasında hata:', error);
        await AsyncStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return <AppNavigator />;
};

const App = () => {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <AuthProvider>
          <NavigationContainer>
            <AuthWrapper />
          </NavigationContainer>
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export default App;
