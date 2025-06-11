import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Platform,
  FlatList,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { appointmentService } from '../services/appointmentService';
import { useAuth } from '../contexts/AuthContext';

interface Expert {
  _id: string;
  name: string;
  profile: {
    expertProfile: {
      specialization: string;
      experience: number;
      bio: string;
      rating?: number;
      totalReviews?: number;
    };
  };
}

const AVAILABLE_HOURS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30'
];

export const CreateAppointmentScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [notes, setNotes] = useState('');
  const [experts, setExperts] = useState<Expert[]>([]);
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    fetchExperts();
  }, []);

  const fetchExperts = async () => {
    try {
      setLoading(true);
      const response = await appointmentService.getExperts();
      console.log('Uzmanlar:', response);
      setExperts(response);
    } catch (error) {
      console.error('Uzmanlar yüklenirken hata:', error);
      Alert.alert('Hata', 'Uzmanlar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (date) {
      setSelectedDate(date);
    }
    if (Platform.OS === 'web' && event?.target?.value) {
      setSelectedDate(new Date(event.target.value));
    }
  };

  const handleTimeSelect = (time: string) => {
    if (!startTime) {
      setStartTime(time);
    } else {
      const startIndex = AVAILABLE_HOURS.indexOf(startTime);
      const endIndex = AVAILABLE_HOURS.indexOf(time);
      
      if (endIndex <= startIndex) {
        Alert.alert('Hata', 'Bitiş saati başlangıç saatinden sonra olmalıdır');
        return;
      }
      
      setEndTime(time);
      setShowTimePicker(false);
    }
  };

  const handleCreateAppointment = async () => {
    if (!user) {
      Alert.alert('Hata', 'Kullanıcı bilgisi bulunamadı');
      return;
    }
    if (!selectedExpert) {
      Alert.alert('Hata', 'Lütfen bir uzman seçin');
      return;
    }
    if (!startTime || !endTime) {
      Alert.alert('Hata', 'Lütfen başlangıç ve bitiş saatlerini seçin');
      return;
    }
    try {
      setLoading(true);
      const response = await appointmentService.createAppointment({
        expertId: selectedExpert._id,
        date: selectedDate.toISOString(),
        startTime,
        endTime,
        notes,
      });
      console.log('Randevu oluşturuldu:', response);
      Alert.alert('Başarılı', 'Randevu başarıyla oluşturuldu', [
        {
          text: 'Tamam',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      console.error('Randevu oluşturulurken hata:', error);
      Alert.alert('Hata', error?.response?.data?.message || 'Randevu oluşturulurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Uzman Seçimi</Text>
        {experts.length === 0 && (
          <Text style={{ color: 'red', marginBottom: 10 }}>Hiç uzman bulunamadı.</Text>
        )}
        <FlatList
          horizontal
          data={experts}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.expertCard,
                selectedExpert?._id === item._id && styles.selectedExpertCard,
              ]}
              onPress={() => setSelectedExpert(item)}
            >
              <Text style={styles.expertName}>{item.name || '-'}</Text>
              <Text style={styles.expertSpecialization}>
                {Array.isArray(item.profile?.expertProfile?.specialization)
                  ? item.profile.expertProfile.specialization.join(', ')
                  : item.profile?.expertProfile?.specialization || '-'}
              </Text>
              {item.profile?.expertProfile?.rating && (
                <Text style={styles.expertRating}>
                  ⭐ {item.profile.expertProfile.rating.toFixed(1)} ({item.profile.expertProfile.totalReviews} değerlendirme)
                </Text>
              )}
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tarih Seçimi</Text>
        {Platform.OS === 'web' ? (
          <input
            type="date"
            value={format(selectedDate, 'yyyy-MM-dd')}
            min={format(new Date(), 'yyyy-MM-dd')}
            onChange={handleDateChange}
            style={{ padding: 10, borderRadius: 10, borderColor: '#ccc', marginBottom: 10 }}
          />
        ) : (
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateButtonText}>
              {format(selectedDate, 'd MMMM yyyy', { locale: tr })}
            </Text>
          </TouchableOpacity>
        )}
        {showDatePicker && Platform.OS !== 'web' && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Saat Seçimi</Text>
        <View style={styles.timeSelectionContainer}>
          <TouchableOpacity
            style={styles.timeButton}
            onPress={() => setShowTimePicker(true)}
          >
            <Text style={styles.timeButtonText}>
              {startTime ? `${startTime} - ${endTime || 'Seçiniz'}` : 'Saat Seçin'}
            </Text>
          </TouchableOpacity>
        </View>
        {showTimePicker && (
          <View style={styles.timePickerContainer}>
            {AVAILABLE_HOURS.map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeSlot,
                  (time === startTime || time === endTime) && styles.selectedTimeSlot,
                ]}
                onPress={() => handleTimeSelect(time)}
              >
                <Text style={[
                  styles.timeSlotText,
                  (time === startTime || time === endTime) && styles.selectedTimeSlotText,
                ]}>
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notlar</Text>
        <TextInput
          style={styles.notesInput}
          placeholder="Randevu ile ilgili notlarınız..."
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
        />
      </View>

      <TouchableOpacity
        style={styles.createButton}
        onPress={handleCreateAppointment}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.createButtonText}>Randevu Oluştur</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  expertCard: {
    backgroundColor: 'white',
    padding: 15,
    marginRight: 10,
    borderRadius: 10,
    width: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selectedExpertCard: {
    borderColor: '#0066cc',
    borderWidth: 2,
  },
  expertName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  expertSpecialization: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  expertRating: {
    fontSize: 14,
    color: '#666',
  },
  dateButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  dateButtonText: {
    fontSize: 16,
  },
  timeSelectionContainer: {
    marginBottom: 10,
  },
  timeButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  timeButtonText: {
    fontSize: 16,
  },
  timePickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
  },
  timeSlot: {
    width: '23%',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  selectedTimeSlot: {
    backgroundColor: '#0066cc',
  },
  timeSlotText: {
    color: '#333',
  },
  selectedTimeSlotText: {
    color: 'white',
  },
  notesInput: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    height: 100,
    textAlignVertical: 'top',
  },
  createButton: {
    backgroundColor: '#0066cc',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 