import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { appointmentService } from '../services/appointmentService';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { User } from '../services/userService';

interface Appointment {
  _id: string;
  expert: {
    _id: string;
    name: string;
  };
  client: {
    _id: string;
    name: string;
  };
  date: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  rating?: number;
  review?: string;
}

const AppointmentScreen = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');

  const loadAppointments = useCallback(async (pageNum: number = 1, shouldRefresh: boolean = false) => {
    try {
      const response = await appointmentService.getAppointments({
        page: pageNum,
        limit: 10
      });
      const newAppointments = response.appointments;
      
      if (shouldRefresh) {
        setAppointments(newAppointments);
      } else {
        setAppointments(prev => [...prev, ...newAppointments]);
      }
      
      setHasMore(newAppointments.length === 10);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Randevular yüklenirken hata:', error.message);
        Alert.alert('Hata', error.message);
      } else {
        console.error('Randevular yüklenirken hata:', error);
        Alert.alert('Hata', 'Randevular yüklenirken bir hata oluştu');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    loadAppointments(1, true);
  }, [loadAppointments]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadAppointments(nextPage);
    }
  }, [loading, hasMore, page, loadAppointments]);

  const handleCancel = async (appointmentId: string) => {
    try {
      await appointmentService.updateAppointment(appointmentId, { status: 'cancelled' });
      setAppointments(prev =>
        prev.map(apt => 
          apt._id === appointmentId ? { ...apt, status: 'cancelled' } : apt
        )
      );
      Alert.alert('Başarılı', 'Randevu başarıyla iptal edildi');
    } catch (error) {
      if (error instanceof Error) {
        console.error('Randevu iptal edilirken hata:', error.message);
        Alert.alert('Hata', error.message);
      } else {
        console.error('Randevu iptal edilirken hata:', error);
        Alert.alert('Hata', 'Randevu iptal edilirken bir hata oluştu');
      }
    }
  };

  const handleRate = async (appointmentId: string, rating: number, review: string) => {
    try {
      await appointmentService.rateAppointment(appointmentId, rating, review);
      setAppointments(prev =>
        prev.map(apt => 
          apt._id === appointmentId ? { ...apt, rating, review } : apt
        )
      );
      Alert.alert('Başarılı', 'Randevu başarıyla değerlendirildi');
    } catch (error) {
      if (error instanceof Error) {
        console.error('Randevu değerlendirilirken hata:', error.message);
        Alert.alert('Hata', error.message);
      } else {
        console.error('Randevu değerlendirilirken hata:', error);
        Alert.alert('Hata', 'Randevu değerlendirilirken bir hata oluştu');
      }
    }
  };

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleCreateAppointment = async () => {
    if (!selectedTime) {
      Alert.alert('Hata', 'Lütfen bir saat seçin');
      return;
    }

    if (!user) {
      Alert.alert('Hata', 'Kullanıcı bilgisi bulunamadı');
      return;
    }

    try {
      setLoading(true);
      const [startTime, endTime] = selectedTime.split('-').map((t) => t.trim());
      
      await appointmentService.createAppointment({
        expertId: user._id,
        date: selectedDate.toISOString(),
        startTime,
        endTime,
        notes,
      });

      Alert.alert('Başarılı', 'Randevu başarıyla oluşturuldu');
      setSelectedTime('');
      setNotes('');
      loadAppointments(1, true);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Hata', error.message);
      } else {
        Alert.alert('Hata', 'Randevu oluşturulurken bir hata oluştu');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status: Appointment['status']) => {
    switch (status) {
      case 'pending':
        return 'Beklemede';
      case 'confirmed':
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
    const isExpert = user?.role === 'uzman';
    const otherUser = isExpert ? item.client : item.expert;
    const formattedDate = format(new Date(item.date), 'dd MMMM yyyy', { locale: tr });
    
    return (
      <View style={styles.appointmentCard}>
        <Text style={styles.userName}>
          {isExpert ? 'Danışan' : 'Uzman'}: {otherUser.name}
        </Text>
        <Text style={styles.dateTime}>
          {formattedDate} - {item.startTime} - {item.endTime}
        </Text>
        <Text style={styles.status}>
          Durum: {getStatusText(item.status)}
        </Text>
        {item.notes && <Text style={styles.notes}>Notlar: {item.notes}</Text>}
        {item.status === 'completed' && !item.rating && (
          <TouchableOpacity
            style={styles.rateButton}
            onPress={() => handleRate(item._id, 5, '')}
          >
            <Text style={styles.rateButtonText}>Değerlendir</Text>
          </TouchableOpacity>
        )}
        {item.status === 'pending' && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => handleCancel(item._id)}
          >
            <Text style={styles.cancelButtonText}>İptal Et</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={appointments}
        renderItem={renderAppointment}
        keyExtractor={item => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Henüz randevunuz bulunmuyor</Text>
        }
      />
    </View>
  );
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
  appointmentCard: {
    backgroundColor: 'white',
    padding: 15,
    margin: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  dateTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  status: {
    fontSize: 14,
    color: '#444',
    marginBottom: 5,
  },
  notes: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  rateButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  rateButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  cancelButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
});

export default AppointmentScreen; 