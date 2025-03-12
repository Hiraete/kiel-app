import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Card,
  Text,
  Button,
  IconButton,
  ProgressBar,
  useTheme,
  Divider,
} from 'react-native-paper';

interface ProgressCategory {
  id: string;
  title: string;
  progress: number;
  lastUpdate: string;
  description: string;
}

export default function ProgressScreen() {
  const theme = useTheme();
  const [categories, setCategories] = useState<ProgressCategory[]>([
    {
      id: '1',
      title: 'İletişim Becerileri',
      progress: 0.7,
      lastUpdate: '2024-03-11',
      description: 'Sözel ve sözel olmayan iletişim gelişimi',
    },
    {
      id: '2',
      title: 'Sosyal Etkileşim',
      progress: 0.5,
      lastUpdate: '2024-03-10',
      description: 'Akranlarla ve yetişkinlerle etkileşim',
    },
    {
      id: '3',
      title: 'Günlük Yaşam Becerileri',
      progress: 0.8,
      lastUpdate: '2024-03-09',
      description: 'Öz bakım ve bağımsız yaşam becerileri',
    },
    {
      id: '4',
      title: 'Bilişsel Gelişim',
      progress: 0.6,
      lastUpdate: '2024-03-08',
      description: 'Problem çözme ve öğrenme becerileri',
    },
  ]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>
          Gelişim Takibi
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Çocuğunuzun gelişim alanlarındaki ilerlemesi
        </Text>
      </View>

      <View style={styles.content}>
        {categories.map((category) => (
          <Card key={category.id} style={styles.card}>
            <Card.Content>
              <View style={styles.categoryHeader}>
                <Text variant="titleMedium" style={styles.categoryTitle}>
                  {category.title}
                </Text>
                <IconButton
                  icon="pencil"
                  size={20}
                  onPress={() => {
                    // TODO: Düzenleme modalı eklenecek
                    console.log('Düzenle:', category.id);
                  }}
                />
              </View>

              <ProgressBar
                progress={category.progress}
                color={theme.colors.primary}
                style={styles.progressBar}
              />

              <Text variant="bodyMedium" style={styles.description}>
                {category.description}
              </Text>

              <Divider style={styles.divider} />

              <View style={styles.footer}>
                <Text variant="bodySmall" style={styles.updateText}>
                  Son güncelleme: {formatDate(category.lastUpdate)}
                </Text>
                <Button
                  mode="text"
                  onPress={() => {
                    // TODO: Detay sayfasına yönlendirme eklenecek
                    console.log('Detaylar:', category.id);
                  }}
                >
                  Detaylar
                </Button>
              </View>
            </Card.Content>
          </Card>
        ))}
      </View>

      <Button
        mode="contained"
        icon="plus"
        onPress={() => {
          // TODO: Yeni kategori ekleme modalı eklenecek
          console.log('Yeni kategori ekle');
        }}
        style={styles.addButton}
      >
        Yeni Kategori Ekle
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    padding: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    color: '#1E40AF',
    marginBottom: 4,
  },
  subtitle: {
    color: '#6B7280',
  },
  content: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryTitle: {
    color: '#1F2937',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 16,
  },
  description: {
    color: '#4B5563',
    marginBottom: 16,
  },
  divider: {
    marginVertical: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  updateText: {
    color: '#6B7280',
  },
  addButton: {
    margin: 16,
  },
}); 