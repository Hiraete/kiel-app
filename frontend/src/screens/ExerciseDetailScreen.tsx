import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';

type ExerciseDetailScreenRouteProp = RouteProp<RootStackParamList, 'ExerciseDetail'>;

interface ExerciseStep {
  title: string;
  description: string;
  image: string;
}

interface Exercise {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  steps: ExerciseStep[];
}

const exercises: Record<string, Exercise> = {
  '5': {
    id: '5',
    title: 'Dikkat ve Odaklanma',
    description: 'Dikkat süresini ve odaklanmayı artıran aktiviteler',
    duration: '15-20 dakika',
    difficulty: 'Orta',
    steps: [
      {
        title: 'Hazırlık',
        description: 'Sessiz ve rahat bir ortamda oturun. Derin nefes alın ve rahatlayın.',
        image: 'https://example.com/preparation.jpg',
      },
      {
        title: 'Nefes Egzersizi',
        description: '4 saniye nefes alın, 4 saniye tutun, 4 saniye verin. Bu döngüyü 5 kez tekrarlayın.',
        image: 'https://example.com/breathing.jpg',
      },
      {
        title: 'Odaklanma Oyunu',
        description: 'Bir nesneye 2 dakika boyunca odaklanın. Dikkatiniz dağılırsa nazikçe tekrar nesneye dönün.',
        image: 'https://example.com/focus.jpg',
      },
    ],
  },
  '6': {
    id: '6',
    title: 'Hafıza Geliştirme Egzersizleri',
    description: 'Kısa ve uzun süreli hafızayı güçlendiren aktiviteler',
    duration: '20-25 dakika',
    difficulty: 'Orta',
    steps: [
      {
        title: 'Hazırlık',
        description: 'Rahat bir pozisyon alın ve zihninizi boşaltın.',
        image: 'https://example.com/preparation.jpg',
      },
      {
        title: 'Kelime Zinciri',
        description: 'Size verilen 10 kelimeyi sırasıyla tekrarlayın. Sonra tersten sayın.',
        image: 'https://example.com/words.jpg',
      },
      {
        title: 'Görsel Hafıza',
        description: 'Size gösterilen resimleri 30 saniye inceleyin, sonra hatırladıklarınızı çizin.',
        image: 'https://example.com/visual.jpg',
      },
      {
        title: 'Sayı Dizisi',
        description: 'Size okunan sayıları tekrarlayın. Her seferinde bir sayı eklenerek zorluk artırılır.',
        image: 'https://example.com/numbers.jpg',
      },
    ],
  },
};

const ExerciseDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<ExerciseDetailScreenRouteProp>();
  const [currentStep, setCurrentStep] = useState(0);

  const exerciseId = route.params.exerciseId;
  const exercise = exercises[exerciseId];

  if (!exercise) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Egzersiz Bulunamadı</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleNext = () => {
    if (currentStep < exercise.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Egzersiz tamamlandı
      navigation.goBack();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>{exercise.title}</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="clock-outline" size={20} color="#666" />
            <Text style={styles.infoText}>{exercise.duration}</Text>
          </View>
          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="signal" size={20} color="#666" />
            <Text style={styles.infoText}>{exercise.difficulty}</Text>
          </View>
        </View>

        <Text style={styles.description}>{exercise.description}</Text>

        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>Adım {currentStep + 1}: {exercise.steps[currentStep].title}</Text>
          <Text style={styles.stepDescription}>{exercise.steps[currentStep].description}</Text>
          <View style={styles.imagePlaceholder}>
            <MaterialCommunityIcons name="image" size={48} color="#ccc" />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, currentStep === 0 && styles.disabledButton]}
          onPress={handlePrevious}
          disabled={currentStep === 0}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
          <Text style={styles.buttonText}>Önceki</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>
            {currentStep === exercise.steps.length - 1 ? 'Tamamla' : 'Sonraki'}
          </Text>
          <MaterialCommunityIcons name="arrow-right" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  infoText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 14,
  },
  description: {
    fontSize: 16,
    color: '#333',
    marginBottom: 24,
    lineHeight: 24,
  },
  stepContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    lineHeight: 24,
  },
  imagePlaceholder: {
    height: 200,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A90E2',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 8,
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 8,
  },
});

export default ExerciseDetailScreen; 