import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, useTheme } from 'react-native-paper';

export default function ExercisesScreen() {
  const theme = useTheme();

  const exercises = [
    {
      id: 1,
      title: 'Nefes Egzersizleri',
      description: 'Doğru nefes alma teknikleri',
      duration: '10 dakika',
      level: 'Başlangıç',
    },
    {
      id: 2,
      title: 'Ses Egzersizleri',
      description: 'Temel ses çalışmaları',
      duration: '15 dakika',
      level: 'Orta',
    },
    {
      id: 3,
      title: 'Artikülasyon',
      description: 'Harf ve hece çalışmaları',
      duration: '20 dakika',
      level: 'İleri',
    },
    {
      id: 4,
      title: 'Ritim Çalışması',
      description: 'Temel ritim egzersizleri',
      duration: '15 dakika',
      level: 'Başlangıç',
    },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={{ color: theme.colors.onBackground }}>
          Egzersizler
        </Text>
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>
          Size özel egzersiz programı
        </Text>
      </View>

      <View style={styles.content}>
        {exercises.map((exercise) => (
          <Card
            key={exercise.id}
            style={[styles.card, { backgroundColor: theme.colors.surface }]}
            mode="elevated"
          >
            <Card.Content>
              <Text variant="titleLarge" style={{ color: theme.colors.onSurface }}>
                {exercise.title}
              </Text>
              <Text
                variant="bodyMedium"
                style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}
              >
                {exercise.description}
              </Text>
              <View style={styles.details}>
                <Text variant="bodySmall" style={{ color: theme.colors.primary }}>
                  {exercise.duration}
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.secondary }}>
                  {exercise.level}
                </Text>
              </View>
            </Card.Content>
            <Card.Actions>
              <Button mode="contained" onPress={() => {}}>
                Başla
              </Button>
            </Card.Actions>
          </Card>
        ))}
      </View>
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
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
}); 