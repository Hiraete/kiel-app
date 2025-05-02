import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { appointmentService } from '../services/appointmentService';
import { Appointment, AppointmentStatus } from '../types';

type RouteParams = {
  appointmentId: string;
};

const AppointmentDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { appointmentId } = route.params as RouteParams;
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointmentDetails();
  }, [appointmentId]);

  const fetchAppointmentDetails = async () => {
    try {
      const data = await appointmentService.getAppointmentById(appointmentId);
      setAppointment(data);
    } catch (error) {
      console.error('Randevu detayları alınırken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  if (!appointment) {
    return (
      <View style={styles.container}>
        <Text>Randevu bulunamadı</Text>
      </View>
    );
  }

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case 'pending':
        return styles.statuspending;
      case 'confirmed':
        return styles.statusconfirmed;
      case 'completed':
        return styles.statuscompleted;
      case 'cancelled':
        return styles.statuscancelled;
      case 'scheduled':
        return styles.statusscheduled;
      default:
        return styles.value;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <MaterialCommunityIcons name="calendar" size={24} color="#4A90E2" />
          <Text style={styles.title}>Randevu Detayları</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Uzman:</Text>
          <Text style={styles.value}>{appointment.expert.name}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Danışan:</Text>
          <Text style={styles.value}>{appointment.client.name}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Tarih:</Text>
          <Text style={styles.value}>{appointment.date}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Saat:</Text>
          <Text style={styles.value}>{appointment.startTime} - {appointment.endTime}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Durum:</Text>
          <Text style={[styles.value, getStatusColor(appointment.status)]}>
            {appointment.status}
          </Text>
        </View>

        {appointment.notes && (
          <View style={styles.detailRow}>
            <Text style={styles.label}>Notlar:</Text>
            <Text style={styles.value}>{appointment.notes}</Text>
          </View>
        )}

        {appointment.rating && (
          <View style={styles.detailRow}>
            <Text style={styles.label}>Değerlendirme:</Text>
            <View style={styles.ratingContainer}>
              {[...Array(5)].map((_, index) => (
                <MaterialCommunityIcons
                  key={index}
                  name={index < appointment.rating! ? 'star' : 'star-outline'}
                  size={20}
                  color="#FFD700"
                />
              ))}
            </View>
          </View>
        )}

        {appointment.review && (
          <View style={styles.detailRow}>
            <Text style={styles.label}>Yorum:</Text>
            <Text style={styles.value}>{appointment.review}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#333',
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  label: {
    width: '30%',
    fontSize: 16,
    color: '#666',
  },
  value: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statuspending: {
    color: '#FFA500',
  },
  statusconfirmed: {
    color: '#4CAF50',
  },
  statuscompleted: {
    color: '#2196F3',
  },
  statuscancelled: {
    color: '#F44336',
  },
  statusscheduled: {
    color: '#9C27B0',
  },
} as const);

export default AppointmentDetailScreen; 