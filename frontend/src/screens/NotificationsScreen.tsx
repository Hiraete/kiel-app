import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Card, Title, Paragraph, Button, ActivityIndicator } from 'react-native-paper';
import { notificationService } from '../services/notificationService';
import { Notification } from '../types';

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async () => {
    try {
      const response = await notificationService.getNotifications();
      setNotifications(response.notifications);
    } catch (error) {
      console.error('Bildirimler alınamadı:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (notification: Notification) => {
    try {
      await notificationService.markAsRead(notification._id);
      setNotifications(notifications.map(n => 
        n._id === notification._id ? { ...n, isRead: true } : n
      ));
    } catch (error) {
      console.error('Bildirim okundu olarak işaretlenemedi:', error);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Title>Bildirim Bulunmuyor</Title>
          <Paragraph>Henüz hiç bildiriminiz yok.</Paragraph>
        </View>
      ) : (
        notifications.map((notification) => (
          <Card
            key={notification._id}
            style={[
              styles.card,
              !notification.isRead && styles.unreadCard
            ]}
          >
            <Card.Content>
              <Title>{notification.title}</Title>
              <Paragraph>{notification.message}</Paragraph>
              <Paragraph style={styles.date}>{new Date(notification.date).toLocaleDateString()}</Paragraph>
            </Card.Content>
            {!notification.isRead && (
              <Card.Actions>
                <Button onPress={() => handleMarkAsRead(notification)}>
                  Okundu Olarak İşaretle
                </Button>
              </Card.Actions>
            )}
          </Card>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  card: {
    margin: 10,
    elevation: 2,
  },
  unreadCard: {
    backgroundColor: '#e3f2fd',
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
});

export default NotificationsScreen; 