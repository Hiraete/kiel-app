import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Game {
  id: string;
  title: string;
  description: string;
  icon: string;
  duration: number;
}

const SensoryGameScreen = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const games: Game[] = [
    {
      id: '1',
      title: 'Dokunsal Keşif',
      description: 'Farklı dokuları keşfetme ve tanıma oyunu',
      icon: 'hand-heart',
      duration: 15,
    },
    {
      id: '2',
      title: 'Ses Avı',
      description: 'Farklı sesleri tanıma ve eşleştirme oyunu',
      icon: 'music',
      duration: 20,
    },
    {
      id: '3',
      title: 'Renk Bulmaca',
      description: 'Renkleri eşleştirme ve gruplama oyunu',
      icon: 'palette',
      duration: 15,
    },
    {
      id: '4',
      title: 'Koku Oyunu',
      description: 'Farklı kokuları tanıma ve eşleştirme oyunu',
      icon: 'flower',
      duration: 10,
    },
  ];

  const startGame = (gameId: string) => {
    setSelectedGame(gameId);
    // Oyun başlatma mantığı burada olacak
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Duyusal Oyunlar</Text>
        <Text style={styles.subtitle}>Duyuları geliştiren eğlenceli oyunlar</Text>
      </View>

      <View style={styles.gamesContainer}>
        {games.map(game => (
          <TouchableOpacity
            key={game.id}
            style={[styles.gameCard, selectedGame === game.id && styles.selectedCard]}
            onPress={() => startGame(game.id)}
          >
            <MaterialCommunityIcons
              name={game.icon as any}
              size={32}
              color={selectedGame === game.id ? '#4CAF50' : '#4A90E2'}
            />
            <View style={styles.gameInfo}>
              <Text style={styles.gameTitle}>{game.title}</Text>
              <Text style={styles.gameDescription}>{game.description}</Text>
              <Text style={styles.gameDuration}>{game.duration} dakika</Text>
            </View>
            <MaterialCommunityIcons
              name={selectedGame === game.id ? 'check-circle' : 'play-circle'}
              size={24}
              color={selectedGame === game.id ? '#4CAF50' : '#999'}
            />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  gamesContainer: {
    padding: 16,
  },
  gameCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedCard: {
    backgroundColor: '#F0F8F0',
  },
  gameInfo: {
    flex: 1,
    marginLeft: 12,
  },
  gameTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  gameDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  gameDuration: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
});

export default SensoryGameScreen; 