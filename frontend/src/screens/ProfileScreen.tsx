import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../navigation/types';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { API_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ProfileScreenProps = {
  navigation: BottomTabNavigationProp<MainTabParamList, 'Profile'>;
};

interface ChildProfile {
  _id: string;
  name: string;
  dateOfBirth: string;
  gender: 'erkek' | 'kiz';
  autismLevel: 'hafif' | 'orta' | 'agir';
  interests: string[];
  developmentAreas: string[];
}

interface UserProfile {
  fullName: string;
  dateOfBirth: string;
  gender: 'erkek' | 'kiz';
  autismLevel: 'hafif' | 'orta' | 'agir';
  profilePicture?: string;
  phoneNumber: string;
  address: string;
  preferences: {
    notifications: boolean;
    language: string;
    theme: 'light' | 'dark';
  };
}

interface Profile {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  birthDate?: string;
  gender?: 'erkek' | 'kiz';
  profileImage?: string;
  preferences?: {
    notifications: boolean;
    language: string;
    theme: string;
  };
  expertProfile?: {
    title: string;
    specialization: string[];
    experience: number;
    rating: number;
    totalReviews: number;
    availability: {
      monday: { start: string; end: string; }[];
      tuesday: { start: string; end: string; }[];
      wednesday: { start: string; end: string; }[];
      thursday: { start: string; end: string; }[];
      friday: { start: string; end: string; }[];
      saturday: { start: string; end: string; }[];
      sunday: { start: string; end: string; }[];
    };
  };
  childProfiles?: Array<{
    name: string;
    birthDate: string;
    gender: 'erkek' | 'kiz';
    autismLevel: string;
    interests: string[];
    developmentAreas: string[];
  }>;
}

export const ProfileScreen = () => {
  const { user, setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<Profile>(user?.profile || {});

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      
      const response = await fetch(`${API_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });

      const data = await response.json();

      if (response.ok) {
        if (user) {
          setUser({
            ...user,
            profile: data.user.profile
          });
        }
        setIsEditing(false);
        Alert.alert('Başarılı', 'Profil başarıyla güncellendi');
      } else {
        Alert.alert('Hata', data.message || 'Profil güncellenirken bir hata oluştu');
      }
    } catch (error) {
      Alert.alert('Hata', 'Profil güncellenirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const renderProfileField = (label: string, value: string | undefined, key: keyof Profile) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      {isEditing ? (
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={(text) => setProfile({ ...profile, [key]: text })}
          placeholder={`${label} giriniz`}
        />
      ) : (
        <Text style={styles.value}>{value || 'Belirtilmemiş'}</Text>
      )}
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profil Bilgileri</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setIsEditing(!isEditing)}
        >
          <Text style={styles.editButtonText}>
            {isEditing ? 'İptal' : 'Düzenle'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {renderProfileField('Ad', profile.firstName, 'firstName')}
        {renderProfileField('Soyad', profile.lastName, 'lastName')}
        {renderProfileField('Telefon', profile.phone, 'phone')}
        {renderProfileField('Adres', profile.address, 'address')}
        {renderProfileField('Doğum Tarihi', profile.birthDate, 'birthDate')}
        {renderProfileField('Cinsiyet', profile.gender, 'gender')}
      </View>

      {isEditing && (
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={isLoading}
        >
          <Text style={styles.saveButtonText}>Kaydet</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  editButton: {
    padding: 8,
  },
  editButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  childProfile: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  childName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  value: {
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
}); 