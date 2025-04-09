import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Card, Text, Button, ActivityIndicator, useTheme } from 'react-native-paper';
import { appointmentService, Appointment } from '../services/appointmentService';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

export default function AppointmentsScreen() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();
  const theme = useTheme();

  const fetchAppointments = async () => {
    try {
      const data = await appointmentService.getAppointments();
      setAppointments(data);
    } catch (error) {
      console.error('Randevular yüklenemedi:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusChange = async (id: string, status: Appointment['status']) => {
    try {
      await appointmentService.updateAppointmentStatus(id, status);
      fetchAppointments();
    } catch (error) {
      console.error('Randevu durumu güncellenemedi:', error);
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await appointmentService.cancelAppointment(id);
      fetchAppointments();
    } catch (error) {
      console.error('Randevu iptal edilemedi:', error);
    }
  };

  const renderAppointment = ({ item }: { item: Appointment }) => {
    const isExpert = user?.role === 'uzman';
    const isClient = user?.role === 'danisan';
    const isPending = item.status === 'pending';
    const isCompleted = item.status === 'completed';

    return (
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium">
            {isExpert ? item.client.name : item.expert.name}
          </Text>
          <Text variant="bodyMedium">
            {format(new Date(item.date), 'dd MMMM yyyy', { locale: tr })}
          </Text>
          <Text variant="bodyMedium">
            {item.startTime} - {item.endTime}
          </Text>
          <Text variant="bodyMedium" style={{ color: getStatusColor(item.status) }}>
            {getStatusText(item.status)}
          </Text>
          {item.notes && <Text variant="bodyMedium">{item.notes}</Text>}
        </Card.Content>
        <Card.Actions>
          {isExpert && isPending && (
            <>
              <Button onPress={() => handleStatusChange(item._id, 'accepted')}>
                Kabul Et
              </Button>
              <Button onPress={() => handleStatusChange(item._id, 'rejected')}>
                Reddet
              </Button>
            </>
          )}
          {isClient && isPending && (
            <Button onPress={() => handleCancel(item._id)}>
              İptal Et
            </Button>
          )}
          {isExpert && !isCompleted && (
            <Button onPress={() => handleStatusChange(item._id, 'completed')}>
              Tamamlandı
            </Button>
          )}
        </Card.Actions>
      </Card>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={appointments}
        renderItem={renderAppointment}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchAppointments} />
        }
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const getStatusColor = (status: Appointment['status']) => {
  switch (status) {
    case 'pending':
      return '#FFA500';
    case 'accepted':
      return '#008000';
    case 'rejected':
      return '#FF0000';
    case 'completed':
      return '#0000FF';
    case 'cancelled':
      return '#808080';
    default:
      return '#000000';
  }
};

const getStatusText = (status: Appointment['status']) => {
  switch (status) {
    case 'pending':
      return 'Beklemede';
    case 'accepted':
      return 'Kabul Edildi';
    case 'rejected':
      return 'Reddedildi';
    case 'completed':
      return 'Tamamlandı';
    case 'cancelled':
      return 'İptal Edildi';
    default:
      return status;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
}); 