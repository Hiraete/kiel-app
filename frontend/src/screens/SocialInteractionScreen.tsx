import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Activity {
  id: string;
  title: string;
  description: string;
  icon: string;
  duration: number;
  level: 'Başlangıç' | 'Orta' | 'İleri';
}

const SocialInteractionScreen = () => {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);

  const activities: Activity[] = [
    {
      id: '1',
      title: 'Göz Teması',
      description: 'Göz teması kurma ve sürdürme alıştırması',
      icon: 'eye',
      duration: 10,
      level: 'Başlangıç',
    },
    {
      id: '2',
      title: 'Sıra Alma',
      description: 'Sıra alma ve bekleme becerisi geliştirme',
      icon: 'account-group',
      duration: 15,
      level: 'Orta',
    },
    {
      id: '3',
      title: 'Duygu Tanıma',
      description: 'Temel duyguları tanıma ve ifade etme',
      icon: 'emoticon',
      duration: 20,
      level: 'Orta',
    },
    {
      id: '4',
      title: 'Sosyal Hikaye',
      description: 'Sosyal durumları anlama ve yorumlama',
      icon: 'book-open',
      duration: 25,
      level: 'İleri',
    },
  ];

  const startActivity = (activityId: string) => {
    setSelectedActivity(activityId);
    // Aktivite başlatma mantığı burada olacak
  };

  const getLevelColor = (level: Activity['level']) => {
    switch (level) {
      case 'Başlangıç':
        return '#4CAF50';
      case 'Orta':
        return '#FFC107';
      case 'İleri':
        return '#F44336';
      default:
        return '#999';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sosyal Etkileşim</Text>
        <Text style={styles.subtitle}>Sosyal becerileri geliştiren aktiviteler</Text>
      </View>

      <View style={styles.activitiesContainer}>
        {activities.map(activity => (
          <TouchableOpacity
            key={activity.id}
            style={[styles.activityCard, selectedActivity === activity.id && styles.selectedCard]}
            onPress={() => startActivity(activity.id)}
          >
            <MaterialCommunityIcons
              name={activity.icon as any}
              size={32}
              color={selectedActivity === activity.id ? '#4CAF50' : '#4A90E2'}
            />
            <View style={styles.activityInfo}>
              <Text style={styles.activityTitle}>{activity.title}</Text>
              <Text style={styles.activityDescription}>{activity.description}</Text>
              <View style={styles.activityDetails}>
                <Text style={styles.activityDuration}>{activity.duration} dakika</Text>
                <View style={[styles.levelBadge, { backgroundColor: getLevelColor(activity.level) }]}>
                  <Text style={styles.levelText}>{activity.level}</Text>
                </View>
              </View>
            </View>
            <MaterialCommunityIcons
              name={selectedActivity === activity.id ? 'check-circle' : 'play-circle'}
              size={24}
              color={selectedActivity === activity.id ? '#4CAF50' : '#999'}
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
  activitiesContainer: {
    padding: 16,
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
  selectedCard: {
    backgroundColor: '#F0F8F0',
  },
  activityInfo: {
    flex: 1,
    marginLeft: 12,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  activityDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  activityDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  activityDuration: {
    fontSize: 12,
    color: '#999',
    marginRight: 8,
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },
});

export default SocialInteractionScreen; 