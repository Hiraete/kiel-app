import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type ExercisesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Exercises'>;

const exercises = [
  {
    id: '1',
    title: 'Duyusal Entegrasyon Egzersizleri',
    description: 'Duyusal işleme becerilerini geliştirmeye yönelik aktiviteler',
    icon: 'hand-pointing-right' as const,
    category: 'Duyusal',
  },
  {
    id: '2',
    title: 'Motor Beceri Geliştirme',
    description: 'İnce ve kaba motor becerileri geliştiren egzersizler',
    icon: 'run' as const,
    category: 'Motor',
  },
  {
    id: '3',
    title: 'Sosyal Etkileşim Aktiviteleri',
    description: 'Sosyal becerileri geliştiren grup çalışmaları',
    icon: 'account-group' as const,
    category: 'Sosyal',
  },
  {
    id: '4',
    title: 'İletişim Becerileri',
    description: 'Sözel ve sözel olmayan iletişim becerilerini geliştiren egzersizler',
    icon: 'message-text' as const,
    category: 'İletişim',
  },
  {
    id: '5',
    title: 'Dikkat ve Odaklanma',
    description: 'Dikkat süresini ve odaklanmayı artıran aktiviteler',
    icon: 'brain' as const,
    category: 'Bilişsel',
  },
  {
    id: '6',
    title: 'Hafıza Geliştirme Egzersizleri',
    description: 'Kısa ve uzun süreli hafızayı güçlendiren aktiviteler',
    icon: 'brain' as const,
    category: 'Bilişsel',
  },
];

const ExercisesScreen = () => {
  const navigation = useNavigation<ExercisesScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tümü');

  const categories = ['Tümü', 'Duyusal', 'Motor', 'Sosyal', 'İletişim', 'Bilişsel'];

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exercise.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Tümü' || exercise.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleStartExercise = (exerciseId: string) => {
    navigation.navigate('ExerciseDetail', { exerciseId });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Egzersizler</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Egzersiz ara..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#666"
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
      >
        {categories.map(category => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.selectedCategory,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.selectedCategoryText,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.exercisesList}>
        {filteredExercises.map(exercise => (
          <TouchableOpacity key={exercise.id} style={styles.exerciseCard}>
            <View style={styles.exerciseIcon}>
              <MaterialCommunityIcons name={exercise.icon} size={32} color="#4A90E2" />
            </View>
            <View style={styles.exerciseContent}>
              <Text style={styles.exerciseTitle}>{exercise.title}</Text>
              <Text style={styles.exerciseDescription}>{exercise.description}</Text>
              <View style={styles.exerciseFooter}>
                <Text style={styles.exerciseCategory}>{exercise.category}</Text>
                <TouchableOpacity 
                  style={styles.startButton}
                  onPress={() => handleStartExercise(exercise.id)}
                >
                  <Text style={styles.startButtonText}>Başla</Text>
                  <MaterialCommunityIcons name="arrow-right" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    color: '#333',
  },
  categoriesContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  selectedCategory: {
    backgroundColor: '#4A90E2',
  },
  categoryText: {
    color: '#666',
    fontSize: 14,
  },
  selectedCategoryText: {
    color: '#fff',
  },
  exercisesList: {
    flex: 1,
    padding: 16,
  },
  exerciseCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  exerciseIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  exerciseContent: {
    flex: 1,
  },
  exerciseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  exerciseDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  exerciseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exerciseCategory: {
    fontSize: 12,
    color: '#4A90E2',
    backgroundColor: '#E8F0FE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  startButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 4,
  },
});

export default ExercisesScreen; 