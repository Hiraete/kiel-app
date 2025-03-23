import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import {
  Text,
  useTheme,
  Card,
  IconButton,
  FAB,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const theme = useTheme();
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const activities = [ 
    {
      id: 1,
      title: 'Günlük Aktivite',
      description: 'Bugünkü aktivitelerinizi planlayın',
      icon: 'calendar-today',
      screen: 'DailyActivity',
    },
    {
      id: 2,
      title: 'Egzersizler',
      description: 'Size özel egzersiz programı',
      icon: 'run',
      screen: 'Exercises',
    },
    {
      id: 3,
      title: 'Oyunlar',
      description: 'Eğlenceli öğrenme oyunları',
      icon: 'gamepad-variant',
      screen: 'Games',
    },
    {
      id: 4,
      title: 'Raporlar',
      description: 'Gelişim raporlarınız',
      icon: 'chart-line',
      screen: 'Reports',
    },{
      id: 5,
      title: 'Forum',
      description: 'Uzmanlarımızın ve danışanlarımızın yazdığı yardımcı yazılar',
      icon: 'comment',
      screen: 'Forum',
    },{
      id: 6,
      title: 'Uzmanlarla Görüşme',
      description: 'Uzmanlarımızla görüşme yapın',
      icon: '<FontAwesomeIcon icon="fa-solid fa-envelope" />',
      screen: 'Consultation',
    }
  ] as const;

  return (
    <View style={[styles.container, { backgroundColor: '#F3F4F6' }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.header, { backgroundColor: '#FFFFFF' }]}>
          <View style={styles.headerContent}>
            <View style={styles.userInfo}>
              <IconButton
                icon="account"
                size={32}
                iconColor="#007AFF"
              />
              <View style={styles.welcomeText}>
                <Text variant="titleLarge" style={{ color: '#1F2937' }}>
                  Hoş Geldiniz
                </Text>
                <Text variant="bodyMedium" style={{ color: '#6B7280' }}>
                  Bugün nasıl hissediyorsunuz?
                </Text>
              </View>
            </View>
            <IconButton
              icon="bell-outline"
              size={24}
              iconColor="#1F2937"
              onPress={() => {}}
            />
          </View>
        </View>

        <View style={styles.content}>
          <Text 
            variant="titleLarge" 
            style={[styles.sectionTitle, { color: '#1F2937' }]}
          >
            Aktiviteler
          </Text>

          <View style={styles.grid}>
            {activities.map((activity) => (
              <Card
                key={activity.id}
                style={[styles.card, { backgroundColor: '#FFFFFF' }]}
                onPress={() => navigation.navigate(activity.screen)}
                mode="elevated"
              >
                <Card.Content style={styles.cardContent}>
                  <IconButton
                    icon={activity.icon}
                    size={32}
                    iconColor="#007AFF"
                    style={styles.cardIcon}
                  />
                  <Text variant="titleMedium" style={[styles.cardTitle, { color: '#1F2937' }]}>
                    {activity.title}
                  </Text>
                  <Text variant="bodySmall" style={{ color: '#6B7280' }}>
                    {activity.description}
                  </Text>
                </Card.Content>
              </Card>
            ))}
          </View>
        </View>
      </ScrollView>

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: '#007AFF' }]}
        onPress={() => {}}
        color="#FFFFFF"
      />
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
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  welcomeText: {
    marginLeft: 8,
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  card: {
    width: '47%',
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    alignItems: 'center',
    gap: 8,
    padding: 16,
  },
  cardIcon: {
    margin: 0,
  },
  cardTitle: {
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
}); 