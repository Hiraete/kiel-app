import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

type ActivityType = 'physical' | 'cognitive' | 'social' | 'sensory';

interface Activity {
  id: string;
  title: string;
  type: ActivityType;
  duration: number;
  completed: boolean;
}

const DailyProgramScreen = () => {
  const [activities, setActivities] = useState<Activity[]>([
    { id: '1', title: 'Duyusal Oyun', type: 'sensory', duration: 30, completed: false },
    { id: '2', title: 'Sosyal Etkileşim', type: 'social', duration: 45, completed: false },
    { id: '3', title: 'Fiziksel Egzersiz', type: 'physical', duration: 20, completed: false },
    { id: '4', title: 'Bilişsel Egzersiz', type: 'cognitive', duration: 25, completed: false },
  ]);

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'physical':
        return 'run';
      case 'cognitive':
        return 'brain';
      case 'social':
        return 'account-group';
      case 'sensory':
        return 'hand-heart';
      default:
        return 'star';
    }
  };

  const toggleActivity = (id: string) => {
    setActivities(activities.map(activity =>
      activity.id === id ? { ...activity, completed: !activity.completed } : activity
    ));
  };

  const getProgress = () => {
    const completed = activities.filter(activity => activity.completed).length;
    return (completed / activities.length) * 100;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Günlük Program</Text>
          <Text style={styles.subtitle}>Temel becerileri geliştirmeye yönelik program</Text>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressInfo}>
            <Text style={styles.progressTitle}>Günlük İlerleme</Text>
            <Text style={styles.progressPercentage}>{Math.round(getProgress())}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${getProgress()}%` }]} />
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>3/5</Text>
              <Text style={styles.statLabel}>Aktivite</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>2</Text>
              <Text style={styles.statLabel}>Tamamlanan</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>Kalan</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Günün Aktiviteleri</Text>
          <View style={styles.activitiesContainer}>
            {activities.map(activity => (
              <TouchableOpacity
                key={activity.id}
                style={[styles.activityCard, activity.completed && styles.completedCard]}
                onPress={() => toggleActivity(activity.id)}
              >
                <MaterialCommunityIcons
                  name={getActivityIcon(activity.type)}
                  size={24}
                  color={activity.completed ? '#4CAF50' : '#4A90E2'}
                />
                <View style={styles.activityInfo}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityDuration}>{activity.duration} dakika</Text>
                </View>
                <MaterialCommunityIcons
                  name={activity.completed ? 'check-circle' : 'circle-outline'}
                  size={24}
                  color={activity.completed ? '#4CAF50' : '#999'}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 20,
    backgroundColor: '#007AFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  progressSection: {
    backgroundColor: 'white',
    padding: 20,
    marginTop: 12,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  progressPercentage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  activitiesContainer: {
    gap: 12,
  },
  activityCard: {
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
  completedCard: {
    backgroundColor: '#F0F8F0',
  },
  activityInfo: {
    flex: 1,
    marginLeft: 12,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  activityDuration: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});

export default DailyProgramScreen; 