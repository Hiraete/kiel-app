import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, ActivityIndicator } from 'react-native-paper';
import { useAuth } from '../app/contexts/AuthContext';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Profile'>;

interface ProfileScreenProps {
  navigation: ProfileScreenNavigationProp;
}

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      // AuthContext'teki user state'i null olacak ve AppNavigator
      // otomatik olarak Login ekranına yönlendirecek
    } catch (error) {
      console.error('Çıkış yapılırken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          Profil Bilgileri
        </Text>

        <View style={styles.userInfo}>
          <Text variant="titleMedium" style={styles.label}>
            Kullanıcı Adı
          </Text>
          <Text variant="bodyLarge" style={styles.value}>
            {user.username}
          </Text>

          <Text variant="titleMedium" style={styles.label}>
            Email
          </Text>
          <Text variant="bodyLarge" style={styles.value}>
            {user.email}
          </Text>
        </View>

        <Button
          mode="contained"
          onPress={handleLogout}
          loading={loading}
          disabled={loading}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          {loading ? 'Çıkış Yapılıyor...' : 'Çıkış Yap'}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  content: {
    flex: 1,
    padding: 20,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#1F2937',
  },
  userInfo: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    color: '#6B7280',
    marginBottom: 4,
  },
  value: {
    color: '#1F2937',
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
}); 