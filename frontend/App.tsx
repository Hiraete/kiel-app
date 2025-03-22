import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/contexts/AuthContext';

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

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <PaperProvider theme={theme}>
          <AppNavigator />
        </PaperProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
