import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const games = [
  {
    key: 'SensoryGame',
    title: 'Duyu Oyunu',
    icon: <MaterialCommunityIcons name="hand-heart" size={36} color="#4A90E2" />,
    description: 'Duyusal gelişim için oyunlar.'
  },
  {
    key: 'PuzzleGame',
    title: 'Puzzle Oyunu',
    icon: <MaterialCommunityIcons name="puzzle" size={36} color="#F5A623" />,
    description: 'Parçaları birleştir, resmi tamamla.'
  },
  {
    key: 'MemoryGame',
    title: 'Hafıza Oyunu',
    icon: <MaterialCommunityIcons name="brain" size={36} color="#7ED957" />,
    description: 'Eş kartları bul, hafızanı güçlendir.'
  },
  {
    key: 'MatchingGame',
    title: 'Eşleştirme Oyunu',
    icon: <MaterialCommunityIcons name="shape" size={36} color="#FF6F61" />,
    description: 'Benzerleri bul ve eşleştir.'
  },
];

export default function GamesScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Oyunlar</Text>
      <Text style={styles.subHeader}>Aşağıdaki oyunlardan birini seçebilirsiniz:</Text>
      <View style={styles.gamesContainer}>
        {games.map((game) => (
          <TouchableOpacity
            key={game.key}
            style={styles.gameCard}
            onPress={() => navigation.navigate(game.key as never)}
          >
            {game.icon}
            <Text style={styles.gameTitle}>{game.title}</Text>
            <Text style={styles.gameDesc}>{game.description}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subHeader: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  gamesContainer: {
    width: '100%',
    gap: 20,
  },
  gameCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  gameTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 12,
    color: '#222',
  },
  gameDesc: {
    fontSize: 14,
    color: '#888',
    marginTop: 6,
    textAlign: 'center',
  },
}); 