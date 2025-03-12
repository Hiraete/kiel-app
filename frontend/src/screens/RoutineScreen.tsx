import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Card,
  Text,
  Button,
  IconButton,
  Checkbox,
  useTheme,
  FAB,
} from 'react-native-paper';

interface Routine {
  id: string;
  title: string;
  time: string;
  completed: boolean;
  description?: string;
}

export default function RoutineScreen() {
  const theme = useTheme();
  const [routines, setRoutines] = useState<Routine[]>([
    {
      id: '1',
      title: 'Kahvaltı',
      time: '08:00',
      completed: false,
      description: 'Sağlıklı bir kahvaltı yapın',
    },
    {
      id: '2',
      title: 'Egzersiz',
      time: '09:30',
      completed: false,
      description: 'Basit fiziksel aktiviteler',
    },
    {
      id: '3',
      title: 'Öğrenme Zamanı',
      time: '11:00',
      completed: false,
      description: 'Eğitici aktiviteler ve oyunlar',
    },
  ]);

  const toggleRoutine = (id: string) => {
    setRoutines(
      routines.map((routine) =>
        routine.id === id
          ? { ...routine, completed: !routine.completed }
          : routine
      )
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text variant="titleLarge" style={styles.title}>
            Bugünkü Rutinler
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            {new Date().toLocaleDateString('tr-TR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>

        <View style={styles.routineList}>
          {routines.map((routine) => (
            <Card key={routine.id} style={styles.routineCard}>
              <Card.Content style={styles.routineContent}>
                <View style={styles.routineHeader}>
                  <View style={styles.routineInfo}>
                    <Text variant="titleMedium">{routine.title}</Text>
                    <Text variant="bodySmall" style={styles.timeText}>
                      {routine.time}
                    </Text>
                  </View>
                  <Checkbox
                    status={routine.completed ? 'checked' : 'unchecked'}
                    onPress={() => toggleRoutine(routine.id)}
                  />
                </View>
                {routine.description && (
                  <Text variant="bodyMedium" style={styles.description}>
                    {routine.description}
                  </Text>
                )}
              </Card.Content>
            </Card>
          ))}
        </View>
      </ScrollView>

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => {
          // TODO: Yeni rutin ekleme modalı eklenecek
          console.log('Yeni rutin ekle');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    color: '#1E40AF',
    marginBottom: 4,
  },
  subtitle: {
    color: '#6B7280',
  },
  routineList: {
    padding: 16,
  },
  routineCard: {
    marginBottom: 16,
    elevation: 2,
  },
  routineContent: {
    padding: 16,
  },
  routineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  routineInfo: {
    flex: 1,
  },
  timeText: {
    color: '#6B7280',
    marginTop: 4,
  },
  description: {
    color: '#4B5563',
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
}); 