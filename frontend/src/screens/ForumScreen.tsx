import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, useTheme } from 'react-native-paper';

const forumPosts = [
  {
    id: 1,
    title: 'Günlük Egzersizlerin Önemi',
    author: 'Dr. Ayşe Yılmaz',
    content: 'Günlük egzersizler, fiziksel ve mental sağlığımız için...',
    date: '2024-03-20',
  },
  {
    id: 2,
    title: 'Doğru Beslenme İpuçları',
    author: 'Dyt. Mehmet Demir',
    content: 'Sağlıklı bir yaşam için beslenme düzenimiz...',
    date: '2024-03-19',
  },
];

export default function ForumScreen() {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text variant="headlineMedium" style={styles.title}>
          Forum
        </Text>
        
        {forumPosts.map((post) => (
          <Card key={post.id} style={styles.card} mode="elevated">
            <Card.Content>
              <Text variant="titleLarge">{post.title}</Text>
              <Text variant="bodyMedium" style={styles.author}>
                {post.author} • {post.date}
              </Text>
              <Text variant="bodyMedium" style={styles.content}>
                {post.content}
              </Text>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollContent: {
    padding: 16,
  },
  title: {
    marginBottom: 20,
    color: '#1F2937',
  },
  card: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  author: {
    color: '#6B7280',
    marginVertical: 8,
  },
  content: {
    color: '#374151',
  },
});
