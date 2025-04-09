import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { MainTabParamList } from '../navigation/types';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Activity, Program } from '../types';
import api from '../services/api';
import { Button } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [activitiesResponse, programsResponse] = await Promise.all([
        api.get('/activities'),
        api.get('/programs'),
      ]);

      setActivities(activitiesResponse.data.activities);
      setPrograms(programsResponse.data.programs);
    } catch (error) {
      console.error('Veri yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const renderActivityCard = (activity: Activity) => (
    <TouchableOpacity
      key={activity._id}
      style={styles.card}
      onPress={() => navigation.navigate('Exercises', { activityId: activity._id })}
    >
      <MaterialCommunityIcons
        name={getActivityIcon(activity.type)}
        size={24}
        color="#4A90E2"
      />
      <Text style={styles.cardTitle}>{activity.title}</Text>
      <Text style={styles.cardDescription} numberOfLines={2}>
        {activity.description}
      </Text>
      <View style={styles.cardFooter}>
        <Text style={styles.cardDifficulty}>
          Zorluk: {activity.difficultyLevel}
        </Text>
        <Text style={styles.cardDuration}>
          {activity.duration} dakika
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderProgramCard = (program: Program) => (
    <TouchableOpacity
      key={program._id}
      style={styles.card}
      onPress={() => navigation.navigate('DailyActivity', { programId: program._id })}
    >
      <MaterialCommunityIcons
        name="calendar-check"
        size={24}
        color="#4A90E2"
      />
      <Text style={styles.cardTitle}>{program.name}</Text>
      <Text style={styles.cardDescription} numberOfLines={2}>
        {program.description}
      </Text>
      <View style={styles.cardFooter}>
        <Text style={styles.cardProgress}>
          İlerleme: {program.progress}%
        </Text>
        <Text style={styles.cardStatus}>
          {program.status === 'active' ? 'Aktif' : 'Tamamlandı'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'physical':
        return 'run';
      case 'cognitive':
        return 'brain';
      case 'social':
        return 'account-group';
      case 'sensory':
        return 'hand-heart';
      default:
        return 'star';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Hoş Geldiniz, {user?.name}
      </Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Günlük Aktiviteler</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {activities.map(renderActivityCard)}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Aktif Programlar</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {programs.map(renderProgramCard)}
        </ScrollView>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Appointments')}
          style={styles.button}
        >
          Randevularım
        </Button>

        {user?.role === 'danisan' && (
          <Button
            mode="contained"
            onPress={() => navigation.navigate('CreateAppointment')}
            style={styles.button}
          >
            Yeni Randevu
          </Button>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333333',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginRight: 15,
    width: 280,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
    color: '#333333',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666666',
    marginTop: 5,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cardDifficulty: {
    fontSize: 12,
    color: '#666666',
  },
  cardDuration: {
    fontSize: 12,
    color: '#666666',
  },
  cardProgress: {
    fontSize: 12,
    color: '#4A90E2',
  },
  cardStatus: {
    fontSize: 12,
    color: '#4CAF50',
  },
  buttonContainer: {
    gap: 16,
  },
  button: {
    paddingVertical: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 