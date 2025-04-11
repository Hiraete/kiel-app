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
  Switch,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/api';

interface TimeSlot {
  start: string;
  end: string;
}

interface ExpertProfile {
  title: string;
  specialization: string[];
  experience: number;
  rating: number;
  totalReviews: number;
  availability: {
    monday: TimeSlot[];
    tuesday: TimeSlot[];
    wednesday: TimeSlot[];
    thursday: TimeSlot[];
    friday: TimeSlot[];
    saturday: TimeSlot[];
    sunday: TimeSlot[];
  };
}

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
type Day = typeof DAYS[number];

export const ExpertProfileScreen = () => {
  const { user } = useAuth();
  const [expertProfile, setExpertProfile] = useState<ExpertProfile>({
    title: '',
    specialization: [],
    experience: 0,
    rating: 0,
    totalReviews: 0,
    availability: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
    },
  });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Day | null>(null);
  const [newTimeSlot, setNewTimeSlot] = useState<TimeSlot>({ start: '', end: '' });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await userService.getProfile();
      if (response.user?.profile?.expertProfile) {
        setExpertProfile(response.user.profile.expertProfile);
      }
    } catch (error) {
      Alert.alert('Hata', 'Profil bilgileri yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await userService.updateExpertProfile(expertProfile);
      setIsEditing(false);
      Alert.alert('Başarılı', 'Profil başarıyla güncellendi');
    } catch (error) {
      Alert.alert('Hata', 'Profil güncellenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const addTimeSlot = () => {
    if (!selectedDay || !newTimeSlot.start || !newTimeSlot.end) return;

    const updatedProfile = { ...expertProfile };
    updatedProfile.availability[selectedDay].push({ ...newTimeSlot });
    setExpertProfile(updatedProfile);
    setNewTimeSlot({ start: '', end: '' });
  };

  const removeTimeSlot = (day: Day, index: number) => {
    const updatedProfile = { ...expertProfile };
    updatedProfile.availability[day].splice(index, 1);
    setExpertProfile(updatedProfile);
  };

  const renderAvailability = () => {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Müsaitlik Durumu</Text>
        {DAYS.map((day) => (
          <View key={day} style={styles.dayContainer}>
            <Text style={styles.dayTitle}>{day}</Text>
            {isEditing && (
              <View style={styles.timeSlotInput}>
                <TextInput
                  style={[styles.input, styles.timeInput]}
                  placeholder="Başlangıç (HH:MM)"
                  value={newTimeSlot.start}
                  onChangeText={(text) => setNewTimeSlot({ ...newTimeSlot, start: text })}
                />
                <TextInput
                  style={[styles.input, styles.timeInput]}
                  placeholder="Bitiş (HH:MM)"
                  value={newTimeSlot.end}
                  onChangeText={(text) => setNewTimeSlot({ ...newTimeSlot, end: text })}
                />
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => {
                    setSelectedDay(day);
                    addTimeSlot();
                  }}
                >
                  <Text style={styles.addButtonText}>Ekle</Text>
                </TouchableOpacity>
              </View>
            )}
            <View style={styles.timeSlots}>
              {expertProfile.availability[day].map((slot: TimeSlot, index: number) => (
                <View key={index} style={styles.timeSlot}>
                  <Text style={styles.timeSlotText}>
                    {slot.start} - {slot.end}
                  </Text>
                  {isEditing && (
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeTimeSlot(day, index)}
                    >
                      <Text style={styles.removeButtonText}>×</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderSpecialties = () => {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Uzmanlık Alanları</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={expertProfile.specialization.join(', ')}
            onChangeText={(text) =>
              setExpertProfile({
                ...expertProfile,
                specialization: text.split(',').map((s) => s.trim()),
              })
            }
            placeholder="Uzmanlık alanlarını virgülle ayırarak girin"
          />
        ) : (
          <View style={styles.tags}>
            {expertProfile.specialization.map((specialty, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{specialty}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderExperience = () => {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Deneyim</Text>
        {isEditing ? (
          <TextInput
            style={[styles.input, styles.textArea]}
            value={expertProfile.experience.toString()}
            onChangeText={(text) =>
              setExpertProfile({ ...expertProfile, experience: parseInt(text) })
            }
            multiline
            numberOfLines={4}
            placeholder="Deneyimlerinizi girin"
          />
        ) : (
          <Text style={styles.text}>{expertProfile.experience.toString()}</Text>
        )}
      </View>
    );
  };

  const renderRating = () => {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rating</Text>
        {isEditing ? (
          <TextInput
            style={[styles.input, styles.textArea]}
            value={expertProfile.rating.toString()}
            onChangeText={(text) =>
              setExpertProfile({ ...expertProfile, rating: parseInt(text) })
            }
            multiline
            numberOfLines={4}
            placeholder="Rating girin"
          />
        ) : (
          <Text style={styles.text}>{expertProfile.rating.toString()}</Text>
        )}
      </View>
    );
  };

  const renderTotalReviews = () => {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Toplam İncelemeler</Text>
        {isEditing ? (
          <TextInput
            style={[styles.input, styles.textArea]}
            value={expertProfile.totalReviews.toString()}
            onChangeText={(text) =>
              setExpertProfile({ ...expertProfile, totalReviews: parseInt(text) })
            }
            multiline
            numberOfLines={4}
            placeholder="Toplam incelemeler girin"
          />
        ) : (
          <Text style={styles.text}>{expertProfile.totalReviews.toString()}</Text>
        )}
      </View>
    );
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
      <View style={styles.header}>
        <Text style={styles.title}>Uzman Profili</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setIsEditing(!isEditing)}
        >
          <Text style={styles.editButtonText}>
            {isEditing ? 'Kaydet' : 'Düzenle'}
          </Text>
        </TouchableOpacity>
      </View>

      {renderSpecialties()}
      {renderExperience()}
      {renderRating()}
      {renderTotalReviews()}
      {renderAvailability()}

      {isEditing && (
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Değişiklikleri Kaydet</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  editButton: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#007AFF',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  timeInput: {
    flex: 1,
    marginRight: 8,
  },
  timeSlotInput: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  dayContainer: {
    marginBottom: 16,
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  timeSlots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 4,
  },
  timeSlotText: {
    fontSize: 14,
  },
  removeButton: {
    marginLeft: 8,
  },
  removeButtonText: {
    fontSize: 18,
    color: '#ff3b30',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 14,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 