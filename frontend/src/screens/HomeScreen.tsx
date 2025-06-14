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
import { RootStackParamList } from '../types';
import { Activity, Program, Appointment } from '../types/index';
import api from '../services/api';
import { Button } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [activitiesResponse, programsResponse, appointmentsResponse] = await Promise.all([
        api.get('/activities'),
        api.get('/programs'),
        api.get('/appointments'),
      ]);

      setActivities(activitiesResponse.data.activities);
      setPrograms(programsResponse.data.programs);
      setAppointments(appointmentsResponse.data.appointments);
    } catch (error) {
      console.error('Veri yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return; // Kullanıcı yoksa veri çekme
    fetchData();
  }, [user]);

  useEffect(() => {
    // Eğer veri gelmiyorsa örnek veri ekle
    if (appointments.length === 0) {
      setAppointments([
        {
          _id: '1',
          expert: { _id: 'e1', name: 'Dr. Uzman' },
          client: { _id: 'c1', name: 'Danışan' },
          date: new Date().toISOString(),
          startTime: '10:00',
          endTime: '10:30',
          status: 'scheduled',
        } as any
      ]);
    }
    if (activities.length === 0) {
      setActivities([
        {
          _id: 'a1',
          title: 'Duyu Oyunu',
          description: 'Duyu gelişimi için oyun.',
          type: 'sensory',
          difficultyLevel: 'Kolay',
          duration: 20,
          materials: [],
          steps: [],
          targetSkills: [],
          ageRange: { min: 3, max: 7 },
          creator: '',
          ratings: [],
          createdAt: '',
          updatedAt: '',
        } as any
      ]);
    }
    if (programs.length === 0) {
      setPrograms([
        {
          _id: 'p1',
          name: 'Günlük Program',
          description: 'Örnek program açıklaması.',
          activities: [],
          creators: [],
          assignees: [],
          startDate: '',
          endDate: '',
          progress: 50,
          status: 'active',
          createdAt: '',
          updatedAt: '',
        } as any
      ]);
    }
  }, [appointments, activities, programs]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };
  const handleAppointmentPress = (appointment: Appointment) => {
    navigation.navigate('AppointmentDetail', { appointmentId: appointment._id } as any);
  };

  const renderAppointmentItem = (appointment: Appointment) => {
    const isUpcoming = appointment.status === 'scheduled' || appointment.status === 'confirmed';
    return (
      <TouchableOpacity
        key={appointment._id}
        style={[styles.appointmentCard, isUpcoming && styles.upcomingAppointment]}
        onPress={() => handleAppointmentPress(appointment)}
      >
        <MaterialCommunityIcons
          name="calendar-clock"
          size={24}
          color="#4A90E2"
        />
        <Text style={styles.cardTitle}>{new Date(appointment.date).toLocaleDateString('tr-TR')}</Text>
        <Text style={styles.cardDescription}>
          {new Date(appointment.date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
        </Text>
        <View style={styles.cardFooter}>
          <Text style={styles.cardStatus}>
            {appointment.status === 'scheduled' ? 'Planlandı' : 
             appointment.status === 'completed' ? 'Tamamlandı' : 'İptal Edildi'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderActivityCard = (activity: Activity) => (
    <TouchableOpacity
      key={activity._id}
      style={styles.card}
      onPress={() => {
        switch (activity.type) {
          case 'sensory':
            navigation.navigate('SensoryGame');
            break;
          case 'social':
            navigation.navigate('SocialInteraction');
            break;
          default:
            navigation.navigate('Exercises', { activityId: activity._id } as any);
        }
      }}
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
      onPress={() => navigation.navigate('DailyActivity', { programId: program._id } as any)}
    >
      <MaterialCommunityIcons name="calendar-check" size={24} color="#4A90E2" />
      <Text style={styles.cardTitle}>{program.name}</Text>
      <Text style={styles.cardDescription}>{program.description}</Text>
      <Text style={styles.cardMeta}>İlerleme: %{program.progress}</Text>
      <Text style={styles.cardMeta}>Durum: {program.status}</Text>
    </TouchableOpacity>
  );

  const getActivityIcon = (type: string): keyof typeof MaterialCommunityIcons.glyphMap => {
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
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.title}>
        Hoş Geldiniz, {user?.name}
      </Text>
      
      {/* Geniş butonlar */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 16 }}>
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: '#4A90E2', margin: 8, borderRadius: 12, padding: 24, alignItems: 'center' }}
          onPress={() => navigation.navigate('VideoChat' as any)}
        >
          <MaterialCommunityIcons name="video" size={32} color="#fff" />
          <Text style={{ color: '#fff', fontSize: 18, marginTop: 8 }}>Görüntülü Sohbet</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: '#34C759', margin: 8, borderRadius: 12, padding: 24, alignItems: 'center' }}
          onPress={() => navigation.navigate('Chat', { expertId: 'dummyId', expertName: user?.name || 'Uzman' } as any)}
        >
          <MaterialCommunityIcons name="chat" size={32} color="#fff" />
          <Text style={{ color: '#fff', fontSize: 18, marginTop: 8 }}>Sohbet</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Yaklaşan Randevular</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScrollContent}
        >
          {appointments.map(renderAppointmentItem)}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Günlük Aktiviteler</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScrollContent}
        >
          {activities.map(renderActivityCard)}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Aktif Programlar</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScrollContent}
        >
          {programs.map(renderProgramCard)}
        </ScrollView>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Appointments' as never)}
          style={styles.button}
        >
          Tüm Randevular
        </Button>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('CreateAppointment' as never)}
          style={styles.button}
        >
          Yeni Randevu
        </Button>
      </View>

      <TouchableOpacity
        style={styles.chatButton}
        onPress={() => navigation.navigate('Chatbot' as any)}
      >
        <MaterialCommunityIcons name="message-text" size={24} color="#fff" />
        <Text style={styles.chatButtonText}>Sağlık Asistanı</Text>
      </TouchableOpacity>
    </ScrollView>
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
    fontSize: 24,
    fontWeight: '600',
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
  appointmentCard: {
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
  upcomingAppointment: {
    backgroundColor: '#E8F5E9',
  },
  cardMeta: {
    fontSize: 12,
    color: '#666666',
  },
  chatButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    padding: 15,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  horizontalScrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
}); 