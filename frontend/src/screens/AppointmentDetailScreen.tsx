import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { appointmentService } from '../services/appointmentService';
import { Appointment, AppointmentStatus } from '../types/auth';
import { RootStackScreenProps } from '../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = RootStackScreenProps<'AppointmentDetail'>;

const AppointmentDetailScreen = ({ navigation, route }: Props) => {
  const { appointmentId } = route.params;
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const data = await appointmentService.getAppointmentById(appointmentId);
        setAppointment(data);
      } catch (error) {
        console.error('Randevu detayları yüklenirken hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId]);

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
        <Text>Randevu bulunamadı.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Randevu Detayları</Text>
        <View style={[styles.statusBadge, styles[`status${appointment.status}`]]}>
          <Text style={styles.statusText}>
            {appointment.status === 'pending' && 'Beklemede'}
            {appointment.status === 'confirmed' && 'Onaylandı'}
            {appointment.status === 'completed' && 'Tamamlandı'}
            {appointment.status === 'cancelled' && 'İptal Edildi'}
            {appointment.status === 'scheduled' && 'Planlandı'}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Uzman</Text>
        <Text style={styles.sectionContent}>{appointment.expert.name}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tarih ve Saat</Text>
        <Text style={styles.sectionContent}>
          {new Date(appointment.date).toLocaleDateString('tr-TR')} - {appointment.startTime} - {appointment.endTime}
        </Text>
      </View>

      {appointment.notes && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notlar</Text>
          <Text style={styles.sectionContent}>{appointment.notes}</Text>
        </View>
      )}

      {appointment.status === 'confirmed' && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.videoCallButton]}
            onPress={() => {
              if (appointment) {
                (navigation as any).navigate('VideoCall', {
                  appointmentId: appointment._id,
                  expertId: appointment.expert._id,
                });
              }
            }}
          >
            <MaterialCommunityIcons name="video" size={24} color="#fff" />
            <Text style={styles.buttonText}>Görüntülü Konuşma</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statuspending: {
    backgroundColor: '#FFA726',
  },
  statusconfirmed: {
    backgroundColor: '#66BB6A',
  },
  statuscompleted: {
    backgroundColor: '#42A5F5',
  },
  statuscancelled: {
    backgroundColor: '#EF5350',
  },
  statusscheduled: {
    backgroundColor: '#7E57C2',
  },
  statusText: {
    color: '#fff',
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 18,
    color: '#333',
  },
  buttonContainer: {
    marginTop: 24,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
  },
  videoCallButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default AppointmentDetailScreen; 