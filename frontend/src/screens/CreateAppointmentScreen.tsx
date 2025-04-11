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
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../contexts/AuthContext';
import { appointmentService } from '../services/appointmentService';
import { userService } from '../services/api';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

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

  useEffect(() => {
    fetchExperts();
  }, []);

  const fetchExperts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/experts');
      const data = await response.json();
      setExperts(data.experts);
    } catch (error) {
      console.error('Uzmanlar yüklenirken hata:', error);
      Alert.alert('Hata', 'Uzmanlar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleCreateAppointment = async () => {
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
      await appointmentService.createAppointment({
        expertId: selectedExpert._id,
        date: selectedDate.toISOString(),
        startTime,
        endTime,
        notes,
      });

      Alert.alert('Başarılı', 'Randevu başarıyla oluşturuldu', [
        {
          text: 'Tamam',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error('Randevu oluşturulurken hata:', error);
      Alert.alert('Hata', 'Randevu oluşturulurken bir hata oluştu');
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
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {experts.map((expert) => (
            <TouchableOpacity
              key={expert._id}
              style={[
                styles.expertCard,
                selectedExpert?._id === expert._id && styles.selectedExpertCard,
              ]}
              onPress={() => setSelectedExpert(expert)}
            >
              <Text style={styles.expertName}>{expert.name}</Text>
              <Text style={styles.expertSpecialization}>
                {expert.profile.expertProfile.specialization}
              </Text>
              {expert.profile.expertProfile.rating && (
                <Text style={styles.expertRating}>
                  ⭐ {expert.profile.expertProfile.rating.toFixed(1)} ({expert.profile.expertProfile.totalReviews} değerlendirme)
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tarih Seçimi</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateButtonText}>
            {format(selectedDate, 'dd MMMM yyyy', { locale: tr })}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
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
        <View style={styles.timeInputContainer}>
          <TextInput
            style={styles.timeInput}
            placeholder="Başlangıç (örn: 09:00)"
            value={startTime}
            onChangeText={setStartTime}
          />
          <TextInput
            style={styles.timeInput}
            placeholder="Bitiş (örn: 10:00)"
            value={endTime}
            onChangeText={setEndTime}
          />
        </View>
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
      >
        <Text style={styles.createButtonText}>Randevu Oluştur</Text>
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
  timeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeInput: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    width: '48%',
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