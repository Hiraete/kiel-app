import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, List, useTheme } from 'react-native-paper';

export default function DailyActivityScreen() {
  const theme = useTheme();

  const activities = [
    {
      id: 1,
      title: 'Sabah Egzersizi',
      time: '09:00',
      completed: true,
    },
    {
      id: 2,
      title: 'Konuşma Pratiği',
      time: '11:00',
      completed: false,
    },
    {
      id: 3,
      title: 'Öğle Yemeği',
      time: '13:00',
      completed: false,
    },
    {
      id: 4,
      title: 'Oyun Zamanı',
      time: '15:00',
      completed: false,
    },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={{ color: theme.colors.onBackground }}>
          Günlük Aktiviteler
        </Text>
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>
          Bugünkü planınız
        </Text>
      </View>

      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <List.Section>
            {activities.map((activity) => (
              <List.Item
                key={activity.id}
                title={activity.title}
                description={activity.time}
                left={props => (
                  <List.Icon
                    {...props}
                    icon={activity.completed ? 'check-circle' : 'clock-outline'}
                    color={activity.completed ? theme.colors.primary : theme.colors.onSurfaceVariant}
                  />
                )}
              />
            ))}
          </List.Section>
        </Card.Content>
      </Card>
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
  card: {
    margin: 16,
    borderRadius: 12,
  },
}); 