import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, useTheme, Card, IconButton } from 'react-native-paper';

export default function ActivitiesScreen() {
  const theme = useTheme();

  const dailyActivities = [
    {
      id: 1,
      title: 'Kahvaltı Zamanı',
      time: '08:00',
      icon: 'food',
      completed: false,
    },
    {
      id: 2,
      title: 'Egzersiz',
      time: '09:30',
      icon: 'run',
      completed: true,
    },
    {
      id: 3,
      title: 'Öğrenme Oyunu',
      time: '11:00',
      icon: 'gamepad-variant',
      completed: false,
    },
    {
      id: 4,
      title: 'Öğle Yemeği',
      time: '12:30',
      icon: 'food-fork-drink',
      completed: false,
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={{ color: theme.colors.onBackground }}>
            Günlük Aktiviteler
          </Text>
          <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant }}>
            23 Mart 2024, Cumartesi
          </Text>
        </View>

        <View style={styles.content}>
          {dailyActivities.map((activity) => (
            <Card
              key={activity.id}
              style={[styles.card, { backgroundColor: theme.colors.surface }]}
              mode="elevated"
            >
              <Card.Content style={styles.cardContent}>
                <View style={styles.activityInfo}>
                  <IconButton
                    icon={activity.icon}
                    size={24}
                    iconColor={theme.colors.primary}
                  />
                  <View style={styles.activityText}>
                    <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
                      {activity.title}
                    </Text>
                    <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                      {activity.time}
                    </Text>
                  </View>
                </View>
                <IconButton
                  icon={activity.completed ? 'check-circle' : 'circle-outline'}
                  size={24}
                  iconColor={activity.completed ? theme.colors.primary : theme.colors.onSurfaceVariant}
                  onPress={() => {}}
                />
              </Card.Content>
            </Card>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    padding: 16,
    paddingTop: 48,
    gap: 8,
  },
  content: {
    padding: 16,
    gap: 12,
  },
  card: {
    marginBottom: 8,
    borderRadius: 12,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  activityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  activityText: {
    marginLeft: 8,
    flex: 1,
  },
}); 