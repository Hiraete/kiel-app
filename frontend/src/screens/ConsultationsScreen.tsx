import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type RootStackParamList = {
  Consultation: { id: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ConsultationsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');

  const consultations = [
    {
      id: '1',
      title: 'Psikolojik Danışmanlık',
      expert: 'Dr. Ayşe Yılmaz',
      date: '2024-03-20',
      time: '14:00',
      status: 'Aktif',
      type: 'Görüntülü',
      notes: 'İlk görüşme ve değerlendirme',
    },
    {
      id: '2',
      title: 'Aile Danışmanlığı',
      expert: 'Uzm. Mehmet Demir',
      date: '2024-03-25',
      time: '10:30',
      status: 'Planlandı',
      type: 'Yüz yüze',
      notes: 'Aile içi iletişim konuları',
    },
    {
      id: '3',
      title: 'Gelişim Değerlendirmesi',
      expert: 'Dr. Zeynep Kaya',
      date: '2024-03-28',
      time: '15:45',
      status: 'Bekliyor',
      type: 'Görüntülü',
      notes: 'Aylık değerlendirme görüşmesi',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aktif':
        return '#4CAF50';
      case 'Planlandı':
        return '#2196F3';
      case 'Bekliyor':
        return '#FFC107';
      default:
        return '#666';
    }
  };

  const filteredConsultations = consultations.filter(consultation =>
    consultation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    consultation.expert.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Danışmalar</Text>
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons name="magnify" size={24} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Danışma veya uzman ara..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView style={styles.content}>
        {filteredConsultations.map((consultation) => (
          <TouchableOpacity
            key={consultation.id}
            style={styles.card}
            onPress={() => navigation.navigate('Consultation', { id: consultation.id })}
          >
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.cardTitle}>{consultation.title}</Text>
                <Text style={styles.expertName}>{consultation.expert}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(consultation.status) }]}>
                <Text style={styles.statusText}>{consultation.status}</Text>
              </View>
            </View>

            <View style={styles.cardDetails}>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="calendar" size={20} color="#666" />
                <Text style={styles.detailText}>{consultation.date}</Text>
                <MaterialCommunityIcons name="clock-outline" size={20} color="#666" style={styles.detailIcon} />
                <Text style={styles.detailText}>{consultation.time}</Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="video" size={20} color="#666" />
                <Text style={styles.detailText}>{consultation.type}</Text>
              </View>
              <Text style={styles.notes}>{consultation.notes}</Text>
            </View>

            <View style={styles.cardFooter}>
              <TouchableOpacity style={styles.actionButton}>
                <MaterialCommunityIcons name="video" size={20} color="#4A90E2" />
                <Text style={styles.actionButtonText}>Görüntülü Görüşme</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <MaterialCommunityIcons name="message" size={20} color="#4A90E2" />
                <Text style={styles.actionButtonText}>Mesaj</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  content: {
    padding: 16,
  },
  card: {
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  expertName: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
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
  cardDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  detailIcon: {
    marginLeft: 16,
  },
  notes: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  actionButtonText: {
    color: '#4A90E2',
    fontSize: 14,
    marginLeft: 4,
  },
});

export default ConsultationsScreen; 