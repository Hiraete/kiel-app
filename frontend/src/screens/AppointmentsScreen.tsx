import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Alert } from 'react-native';
import { Card, Text, Button, ActivityIndicator, useTheme } from 'react-native-paper';
import { appointmentService, Appointment } from '../services/appointmentService';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type NavigationProp = NativeStackNavigationProp<any, 'Appointments'>;

export default function AppointmentsScreen() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const fetchAppointments = useCallback(async () => {
    try {
      setError(null);
      const data = await appointmentService.getAppointments();
      setAppointments(data.appointments || []);
    } catch (error: any) {
      console.error('Randevular yüklenemedi:', error);
      setError(error.message || 'Randevular yüklenirken bir hata oluştu');
      
      if (error.message === 'Oturum açmanız gerekiyor') {
        Alert.alert(
          'Oturum Hatası',
          'Lütfen tekrar giriş yapın',
          [
            {
              text: 'Tamam',
              onPress: () => navigation.navigate('Login' as never)
            }
          ]
        );
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [navigation]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAppointments();
  }, [fetchAppointments]);

  const handleStatusChange = async (id: string, status: Appointment['status']) => {
    try {
      setLoading(true);
      await appointmentService.updateAppointmentStatus(id, status);
      await fetchAppointments();
      Alert.alert('Başarılı', 'Randevu durumu güncellendi');
    } catch (error: any) {
      console.error('Randevu durumu güncellenemedi:', error);
      Alert.alert('Hata', error.message || 'Randevu durumu güncellenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    try {
      setLoading(true);
      await appointmentService.cancelAppointment(id);
      await fetchAppointments();
      Alert.alert('Başarılı', 'Randevu iptal edildi');
    } catch (error: any) {
      console.error('Randevu iptal edilemedi:', error);
      Alert.alert('Hata', error.message || 'Randevu iptal edilirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'pending':
        return '#FFA500'; // Turuncu
      case 'accepted':
        return theme.colors.primary;
      case 'completed':
        return '#4CAF50'; // Yeşil
      case 'cancelled':
        return theme.colors.error;
      default:
        return theme.colors.onSurface;
    }
  };

  const getStatusText = (status: Appointment['status']) => {
    switch (status) {
      case 'pending':
        return 'Beklemede';
      case 'accepted':
        return 'Onaylandı';
      case 'completed':
        return 'Tamamlandı';
      case 'cancelled':
        return 'İptal Edildi';
      default:
        return status;
    }
  };

  const renderAppointment = ({ item }: { item: Appointment }) => {
    return (
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium">{item.expert.fullName}</Text>
          <Text variant="bodyMedium">
            {format(new Date(item.date), 'dd MMMM yyyy', { locale: tr })}
          </Text>
          <Text variant="bodyMedium">
            {item.startTime} - {item.endTime}
          </Text>
          <Text 
            variant="bodyMedium" 
            style={{ color: getStatusColor(item.status) }}
          >
            {getStatusText(item.status)}
          </Text>
          {item.notes && <Text variant="bodyMedium">{item.notes}</Text>}
        </Card.Content>
        <Card.Actions>
          {item.status === 'pending' && (
            <>
              <Button 
                onPress={() => handleStatusChange(item._id, 'accepted')}
                mode="contained"
                style={styles.actionButton}
              >
                Onayla
              </Button>
              <Button 
                onPress={() => handleCancel(item._id)}
                mode="outlined"
                style={[styles.actionButton, styles.cancelButton]}
              >
                İptal Et
              </Button>
            </>
          )}
        </Card.Actions>
      </Card>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text variant="titleMedium" style={styles.errorText}>{error}</Text>
        <Button 
          mode="contained" 
          onPress={fetchAppointments}
          style={styles.retryButton}
        >
          Tekrar Dene
        </Button>
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
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Henüz randevu bulunmuyor</Text>
        }
      />
    </View>
  );
}

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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    marginTop: 10,
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  actionButton: {
    marginRight: 8,
  },
  cancelButton: {
    borderColor: 'red',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
}); 