import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ReportsScreen = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('haftalık');

  const reports = [
    {
      id: '1',
      title: 'Günlük Aktivite Raporu',
      period: 'Son 7 gün',
      date: '2024-03-20',
      type: 'Aktivite',
      status: 'Tamamlandı',
      icon: 'chart-line',
    },
    {
      id: '2',
      title: 'Gelişim Değerlendirmesi',
      period: 'Aylık',
      date: '2024-03-01',
      type: 'Değerlendirme',
      status: 'Hazırlanıyor',
      icon: 'chart-bar',
    },
    {
      id: '3',
      title: 'Sosyal Etkileşim Analizi',
      period: 'Haftalık',
      date: '2024-03-18',
      type: 'Analiz',
      status: 'Tamamlandı',
      icon: 'chart-bubble',
    },
  ];

  const periods = [
    { id: 'günlük', label: 'Günlük' },
    { id: 'haftalık', label: 'Haftalık' },
    { id: 'aylık', label: 'Aylık' },
    { id: 'yıllık', label: 'Yıllık' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Tamamlandı':
        return '#4CAF50';
      case 'Hazırlanıyor':
        return '#FFC107';
      default:
        return '#666';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Raporlar</Text>
        <View style={styles.periodSelector}>
          {periods.map((period) => (
            <TouchableOpacity
              key={period.id}
              style={[
                styles.periodButton,
                selectedPeriod === period.id && styles.periodButtonActive,
              ]}
              onPress={() => setSelectedPeriod(period.id)}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  selectedPeriod === period.id && styles.periodButtonTextActive,
                ]}
              >
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView style={styles.content}>
        {reports.map((report) => (
          <TouchableOpacity key={report.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.titleContainer}>
                <MaterialCommunityIcons name={report.icon as any} size={24} color="#4A90E2" />
                <Text style={styles.cardTitle}>{report.title}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(report.status) }]}>
                <Text style={styles.statusText}>{report.status}</Text>
              </View>
            </View>

            <View style={styles.cardDetails}>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="calendar" size={20} color="#666" />
                <Text style={styles.detailText}>{report.date}</Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="clock-outline" size={20} color="#666" />
                <Text style={styles.detailText}>{report.period}</Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="tag" size={20} color="#666" />
                <Text style={styles.detailText}>{report.type}</Text>
              </View>
            </View>

            <View style={styles.cardFooter}>
              <TouchableOpacity style={styles.actionButton}>
                <MaterialCommunityIcons name="download" size={20} color="#4A90E2" />
                <Text style={styles.actionButtonText}>İndir</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <MaterialCommunityIcons name="share-variant" size={20} color="#4A90E2" />
                <Text style={styles.actionButtonText}>Paylaş</Text>
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
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  periodButtonText: {
    fontSize: 14,
    color: '#666',
  },
  periodButtonTextActive: {
    color: '#4A90E2',
    fontWeight: '500',
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 8,
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

export default ReportsScreen; 