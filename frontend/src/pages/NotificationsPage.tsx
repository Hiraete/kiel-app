import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Örnek bildirim verileri
const sampleNotifications: Notification[] = [
  {
    id: '1',
    title: 'Yeni Randevu Onayı',
    message: 'Dil Terapisi randevunuz onaylandı.',
    date: '2024-03-24 09:30',
    type: 'appointment',
    isRead: false,
  },
  {
    id: '2',
    title: 'Program Güncellemesi',
    message: 'Haftalık programınız güncellendi.',
    date: '2024-03-23 15:45',
    type: 'program',
    isRead: true,
  },
  {
    id: '3',
    title: 'Yeni Mesaj',
    message: 'Dr. Ayşe Yılmaz size mesaj gönderdi.',
    date: '2024-03-22 11:20',
    type: 'message',
    isRead: false,
  },
  {
    id: '4',
    title: 'Randevu Hatırlatması',
    message: 'Yarın saat 10:00\'da Davranış Terapisi randevunuz var.',
    date: '2024-03-21 16:00',
    type: 'reminder',
    isRead: true,
  },
];

interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'appointment' | 'program' | 'message' | 'reminder';
  isRead: boolean;
}

const NotificationsPage = () => {
  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity style={[
      styles.notificationCard,
      !item.isRead && styles.unreadCard
    ]}>
      <View style={styles.notificationHeader}>
        <View style={styles.titleContainer}>
          <Ionicons 
            name={getIconName(item.type)} 
            size={24} 
            color={getIconColor(item.type)} 
            style={styles.icon}
          />
          <Text style={styles.notificationTitle}>{item.title}</Text>
        </View>
        {!item.isRead && <View style={styles.unreadDot} />}
      </View>
      
      <Text style={styles.notificationMessage}>{item.message}</Text>
      <Text style={styles.notificationDate}>{item.date}</Text>
    </TouchableOpacity>
  );

  const getIconName = (type: Notification['type']) => {
    switch (type) {
      case 'appointment':
        return 'calendar';
      case 'program':
        return 'book';
      case 'message':
        return 'chatbubble';
      case 'reminder':
        return 'alarm';
      default:
        return 'notifications';
    }
  };

  const getIconColor = (type: Notification['type']) => {
    switch (type) {
      case 'appointment':
        return '#4CAF50';
      case 'program':
        return '#2196F3';
      case 'message':
        return '#9C27B0';
      case 'reminder':
        return '#FF9800';
      default:
        return '#666';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bildirimler</Text>
      </View>
      
      <FlatList
        data={sampleNotifications}
        renderItem={renderNotificationItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  listContainer: {
    padding: 16,
  },
  notificationCard: {
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
  unreadCard: {
    backgroundColor: '#f0f7ff',
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2196F3',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  notificationDate: {
    fontSize: 12,
    color: '#999',
  },
});

export default NotificationsPage; 