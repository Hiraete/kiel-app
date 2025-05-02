import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../types';
import { StackNavigationProp } from '@react-navigation/stack';

type ExercisesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Exercises'>;

const ExercisesScreen = () => {
  const navigation = useNavigation<ExercisesScreenNavigationProp>();

  const exercises = [
    {
      title: 'Fiziksel Egzersizler',
      icon: 'run',
      description: 'Motor becerilerini geliştiren egzersizler',
    },
    {
      title: 'Bilişsel Egzersizler',
      icon: 'brain',
      description: 'Düşünme ve problem çözme becerilerini geliştiren egzersizler',
    },
    {
      title: 'Sosyal Egzersizler',
      icon: 'account-group',
      description: 'Sosyal etkileşimi artıran egzersizler',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.grid}>
        {exercises.map((exercise, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => {
              // İlgili egzersiz detay sayfasına yönlendirme
              console.log(`${exercise.title} seçildi`);
            }}
          >
            <MaterialCommunityIcons name={exercise.icon as any} size={32} color="#4A90E2" />
            <Text style={styles.cardTitle}>{exercise.title}</Text>
            <Text style={styles.cardDescription}>{exercise.description}</Text>
          </TouchableOpacity>
        ))}
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
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
    marginTop: 8,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  cardDescription: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default ExercisesScreen; 