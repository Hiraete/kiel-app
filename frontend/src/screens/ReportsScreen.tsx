import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, ProgressBar, useTheme } from 'react-native-paper';

export default function ReportsScreen() {
  const theme = useTheme();

  const reports = [
    {
      id: 1,
      title: 'Haftalık İlerleme',
      categories: [
        { name: 'Konuşma', progress: 0.8 },
        { name: 'Egzersizler', progress: 0.6 },
        { name: 'Oyunlar', progress: 0.9 },
      ],
    },
    {
      id: 2,
      title: 'Aylık İlerleme',
      categories: [
        { name: 'Kelime Hazinesi', progress: 0.7 },
        { name: 'Artikülasyon', progress: 0.5 },
        { name: 'Ses Kontrolü', progress: 0.8 },
      ],
    },
  ];

  const statistics = [
    {
      title: 'Tamamlanan Aktiviteler',
      value: '24',
      unit: 'aktivite',
      trend: '+3 geçen haftaya göre',
    },
    {
      title: 'Toplam Çalışma Süresi',
      value: '12.5',
      unit: 'saat',
      trend: '+2.5 geçen haftaya göre',
    },
    {
      title: 'Başarı Oranı',
      value: '85',
      unit: '%',
      trend: '+5% geçen haftaya göre',
    },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={{ color: theme.colors.onBackground }}>
          Gelişim Raporları
        </Text>
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>
          İlerlemenizi takip edin
        </Text>
      </View>

      <View style={styles.content}>
        {/* İstatistikler */}
        <View style={styles.statsGrid}>
          {statistics.map((stat, index) => (
            <Card
              key={index}
              style={[styles.statCard, { backgroundColor: theme.colors.surface }]}
              mode="elevated"
            >
              <Card.Content>
                <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
                  {stat.title}
                </Text>
                <View style={styles.statValue}>
                  <Text
                    variant="headlineMedium"
                    style={{ color: theme.colors.primary }}
                  >
                    {stat.value}
                  </Text>
                  <Text
                    variant="bodySmall"
                    style={{ color: theme.colors.onSurfaceVariant }}
                  >
                    {stat.unit}
                  </Text>
                </View>
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.tertiary }}
                >
                  {stat.trend}
                </Text>
              </Card.Content>
            </Card>
          ))}
        </View>

        {/* İlerleme Raporları */}
        {reports.map((report) => (
          <Card
            key={report.id}
            style={[styles.reportCard, { backgroundColor: theme.colors.surface }]}
            mode="elevated"
          >
            <Card.Content>
              <Text
                variant="titleLarge"
                style={{ color: theme.colors.onSurface, marginBottom: 16 }}
              >
                {report.title}
              </Text>
              {report.categories.map((category, index) => (
                <View key={index} style={styles.category}>
                  <View style={styles.categoryHeader}>
                    <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                      {category.name}
                    </Text>
                    <Text variant="bodyMedium" style={{ color: theme.colors.primary }}>
                      {`${Math.round(category.progress * 100)}%`}
                    </Text>
                  </View>
                  <ProgressBar
                    progress={category.progress}
                    color={theme.colors.primary}
                    style={styles.progressBar}
                  />
                </View>
              ))}
            </Card.Content>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  content: {
    padding: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: '30%',
    borderRadius: 12,
  },
  statValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginVertical: 8,
  },
  reportCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  category: {
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
}); 