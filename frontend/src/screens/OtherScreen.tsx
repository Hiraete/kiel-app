import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type OtherScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function OtherScreen() {
  const navigation = useNavigation<OtherScreenNavigationProp>();

  const renderQuickAccessCard = (
    title: string,
    icon: keyof typeof MaterialCommunityIcons.glyphMap,
    onPress: () => void
  ) => (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
    >
      <MaterialCommunityIcons
        name={icon}
        size={24}
        color="#4A90E2"
      />
      <Text style={styles.cardTitle}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Diğer Özellikler</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Oyunlar</Text>
          <View style={styles.grid}>
            {renderQuickAccessCard(
              'Hafıza Oyunu',
              'brain',
              () => navigation.navigate('MemoryGame')
            )}
            {renderQuickAccessCard(
              'Eşleştirme Oyunu',
              'cards',
              () => navigation.navigate('MatchingGame')
            )}
            {renderQuickAccessCard(
              'Puzzle',
              'puzzle',
              () => navigation.navigate('PuzzleGame')
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Egzersizler</Text>
          <View style={styles.grid}>
            {renderQuickAccessCard(
              'Fiziksel Egzersizler',
              'run',
              () => navigation.navigate('PhysicalExercises')
            )}
            {renderQuickAccessCard(
              'Bilişsel Egzersizler',
              'brain',
              () => navigation.navigate('CognitiveExercises')
            )}
            {renderQuickAccessCard(
              'Sosyal Egzersizler',
              'account-group',
              () => navigation.navigate('SocialExercises')
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rutinler</Text>
          <View style={styles.grid}>
            {renderQuickAccessCard(
              'Günlük Rutinler',
              'calendar-check',
              () => navigation.navigate('DailyRoutines')
            )}
            {renderQuickAccessCard(
              'Haftalık Rutinler',
              'calendar-week',
              () => navigation.navigate('WeeklyRoutines')
            )}
            {renderQuickAccessCard(
              'Özel Rutinler',
              'star',
              () => navigation.navigate('CustomRoutines')
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>İletişim</Text>
          <View style={styles.grid}>
            {renderQuickAccessCard(
              'İletişim Kartları',
              'card-text',
              () => navigation.navigate('CommunicationCards')
            )}
            {renderQuickAccessCard(
              'Duygu Kartları',
              'emoticon',
              () => navigation.navigate('EmotionCards')
            )}
            {renderQuickAccessCard(
              'Sosyal Hikayeler',
              'book-open',
              () => navigation.navigate('SocialStories')
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>İlerleme</Text>
          <View style={styles.grid}>
            {renderQuickAccessCard(
              'İlerleme Raporu',
              'chart-line',
              () => navigation.navigate('ProgressReport')
            )}
            {renderQuickAccessCard(
              'Başarılar',
              'trophy',
              () => navigation.navigate('Achievements')
            )}
            {renderQuickAccessCard(
              'İstatistikler',
              'chart-bar',
              () => navigation.navigate('Statistics')
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    margin: 16,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    color: '#333333',
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333333',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    width: '30%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
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
    fontSize: 14,
    fontWeight: '600',
    marginTop: 10,
    color: '#333333',
    textAlign: 'center',
  },
}); 