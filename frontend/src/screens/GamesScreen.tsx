import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, Card, Button, useTheme } from 'react-native-paper';


import MemoryGame from "../components/MemoryGame"; 

export default function GamesScreen() {
  const theme = useTheme();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const games = [
    {
      id: 1,
      title: 'Kelime Eşleştirme',
      description: 'Kelimeleri doğru resimlerle eşleştirin',
      difficulty: 'Kolay',
      imageUrl: 'https://placekitten.com/200/200',
    },
    {
      id: 2,
      title: 'Ses Bulmaca',
      description: 'Sesleri dinleyip doğru harfi bulun',
      difficulty: 'Orta',
      imageUrl: 'https://placekitten.com/201/200',
    },
    {
      id: 3,
      title: 'Hafıza Kartları',
      description: 'Eşleşen kartları bulun',
      difficulty: 'Zor',
      imageUrl: 'https://placekitten.com/202/200',
    },
    {
      id: 4,
      title: 'Hikaye Zamanı',
      description: 'Resimli hikayeler ile okuma pratiği yapın',
      difficulty: 'Kolay',
      imageUrl: 'https://placekitten.com/203/200',
    },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={{ color: theme.colors.onBackground }}>
          Eğitici Oyunlar
        </Text>
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>
          Eğlenerek öğrenin
        </Text>
      </View>

      {selectedGame === 'memory' ? (
        <MemoryGame /> 
      ) : (
        <View style={styles.content}>
          {games.map((game) => (
            <Card
              key={game.id}
              style={[styles.card, { backgroundColor: theme.colors.surface }]}
              mode="elevated"
            >
              <Card.Cover source={{ uri: game.imageUrl }} style={styles.cardImage} />
              <Card.Content style={styles.cardContent}>
                <Text variant="titleLarge" style={{ color: theme.colors.onSurface }}>
                  {game.title}
                </Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
                  {game.description}
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.secondary, marginTop: 8 }}>
                  Zorluk: {game.difficulty}
                </Text>
              </Card.Content>
              <Card.Actions>
                <Button mode="contained" onPress={() => game.id === 3 && setSelectedGame('memory')}>
                  Oyna
                </Button>
              </Card.Actions>
            </Card>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  content: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardImage: {
    height: 200,
  },
  cardContent: {
    padding: 16,
  },
});
