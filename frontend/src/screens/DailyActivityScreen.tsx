import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const DailyActivityScreen = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const activities = [
    {
      id: '1',
      title: 'Sabah Rutini',
      time: '08:00',
      status: 'Tamamlandı',
      icon: 'weather-sunny',
    },
    {
      id: '2',
      title: 'Egzersiz',
      time: '10:00',
      status: 'Devam Ediyor',
      icon: 'dumbbell',
    },
    {
      id: '3',
      title: 'Öğle Yemeği',
      time: '12:30',
      status: 'Bekliyor',
      icon: 'food',
    },
    {
      id: '4',
      title: 'Sosyal Etkileşim',
      time: '14:00',
      status: 'Bekliyor',
      icon: 'account-group',
    },
    {
      id: '5',
      title: 'Akşam Rutini',
      time: '20:00',
      status: 'Bekliyor',
      icon: 'moon-waning-crescent',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Tamamlandı':
        return '#4CAF50';
      case 'Devam Ediyor':
        return '#2196F3';
      case 'Bekliyor':
        return '#FFC107';
      default:
        return '#666';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Günlük Aktivite</Text>
          <TouchableOpacity style={styles.dateButton}>
            <MaterialCommunityIcons name="calendar" size={24} color="#4A90E2" />
            <Text style={styles.dateText}>
              {selectedDate.toLocaleDateString('tr-TR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {activities.map((activity) => (
            <View key={activity.id} style={styles.activityCard}>
              <View style={styles.activityHeader}>
                <View style={styles.activityTitleContainer}>
                  <MaterialCommunityIcons name={activity.icon as any} size={24} color="#4A90E2" />
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                </View>
                <Text style={styles.activityTime}>{activity.time}</Text>
              </View>
              <View style={styles.activityFooter}>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(activity.status) }]}>
                  <Text style={styles.statusText}>{activity.status}</Text>
                </View>
                <TouchableOpacity style={styles.detailButton}>
                  <Text style={styles.detailButtonText}>Detaylar</Text>
                  <MaterialCommunityIcons name="chevron-right" size={20} color="#4A90E2" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  dateText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#4A90E2',
  },
  content: {
    padding: 16,
  },
  activityCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  activityTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  activityTime: {
    fontSize: 16,
    color: '#666',
  },
  activityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  detailButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailButtonText: {
    color: '#4A90E2',
    fontSize: 14,
    marginRight: 4,
  },
});

export default DailyActivityScreen; 