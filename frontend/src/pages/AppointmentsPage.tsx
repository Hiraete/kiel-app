import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface Appointment {
  id: string;
  title: string;
  date: string;
  time: string;
  specialist: string;
  status: 'Onaylandı' | 'Beklemede';
  location: string;
}

// Örnek randevu verileri
const sampleAppointments: Appointment[] = [
  {
    id: '1',
    title: 'Dil Terapisi Seansı',
    date: '2024-03-25',
    time: '10:00',
    specialist: 'Dr. Ayşe Yılmaz',
    status: 'Onaylandı',
    location: 'Online',
  },
  {
    id: '2',
    title: 'Davranış Terapisi',
    date: '2024-03-26',
    time: '14:30',
    specialist: 'Dr. Mehmet Demir',
    status: 'Beklemede',
    location: 'Klinik',
  },
  {
    id: '3',
    title: 'Aile Danışmanlığı',
    date: '2024-03-27',
    time: '11:00',
    specialist: 'Dr. Zeynep Kaya',
    status: 'Onaylandı',
    location: 'Online',
  },
  {
    id: '4',
    title: 'Grup Terapisi',
    date: '2024-03-28',
    time: '15:00',
    specialist: 'Dr. Ali Öztürk',
    status: 'Beklemede',
    location: 'Klinik',
  },
];

const AppointmentsPage = () => {
  const renderAppointmentItem = ({ item }: { item: Appointment }) => (
    <TouchableOpacity style={styles.appointmentCard}>
      <View style={styles.appointmentHeader}>
        <Text style={styles.appointmentTitle}>{item.title}</Text>
        <View style={[
          styles.statusBadge,
          { backgroundColor: item.status === 'Onaylandı' ? '#4CAF50' : '#FFA000' }
        ]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      
      <View style={styles.appointmentDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={20} color="#666" />
          <Text style={styles.detailText}>{item.date}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={20} color="#666" />
          <Text style={styles.detailText}>{item.time}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="person-outline" size={20} color="#666" />
          <Text style={styles.detailText}>{item.specialist}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={20} color="#666" />
          <Text style={styles.detailText}>{item.location}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Randevularım</Text>
      </View>
      
      <FlatList
        data={sampleAppointments}
        renderItem={renderAppointmentItem}
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
  appointmentCard: {
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
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  appointmentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  appointmentDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
});

export default AppointmentsPage; 