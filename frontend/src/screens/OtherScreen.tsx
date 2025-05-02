import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

type OtherScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Other'>;

const OtherScreen = () => {
  const navigation = useNavigation<OtherScreenNavigationProp>();

  const menuItems = [
    {
      title: 'Egzersizler',
      icon: 'dumbbell',
      screen: 'Exercises',
    },
    {
      title: 'Oyunlar',
      icon: 'gamepad',
      screen: 'Games',
    },
    {
      title: 'İletişim',
      icon: 'message',
      screen: 'Communication',
    },
    {
      title: 'İlerleme',
      icon: 'chart-line',
      screen: 'Progress',
    },
    {
      title: 'Rutinler',
      icon: 'calendar-clock',
      screen: 'Routine',
    },
    {
      title: 'Ayarlar',
      icon: 'cog',
      screen: 'Settings',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Diğer Özellikler</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Oyunlar</Text>
          <View style={styles.grid}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.card}
                onPress={() => navigation.navigate(item.screen as never)}
              >
                <MaterialCommunityIcons name={item.icon as any} size={32} color="#4A90E2" />
                <Text style={styles.cardTitle}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Egzersizler</Text>
          <View style={styles.grid}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.card}
                onPress={() => navigation.navigate(item.screen as never)}
              >
                <MaterialCommunityIcons name={item.icon as any} size={32} color="#4A90E2" />
                <Text style={styles.cardTitle}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rutinler</Text>
          <View style={styles.grid}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.card}
                onPress={() => navigation.navigate(item.screen as never)}
              >
                <MaterialCommunityIcons name={item.icon as any} size={32} color="#4A90E2" />
                <Text style={styles.cardTitle}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>İletişim</Text>
          <View style={styles.grid}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.card}
                onPress={() => navigation.navigate(item.screen as never)}
              >
                <MaterialCommunityIcons name={item.icon as any} size={32} color="#4A90E2" />
                <Text style={styles.cardTitle}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>İlerleme</Text>
          <View style={styles.grid}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.card}
                onPress={() => navigation.navigate(item.screen as never)}
              >
                <MaterialCommunityIcons name={item.icon as any} size={32} color="#4A90E2" />
                <Text style={styles.cardTitle}>{item.title}</Text>
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
    backgroundColor: '#f5f5f5',
  },
  title: {
    margin: 16,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    color: '#333333',
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333333',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
});

export default OtherScreen; 