import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type RootStackParamList = {
  Forum: { id: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ForumsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');

  const forums = [
    {
      id: '1',
      title: 'Genel Tartışma',
      description: 'Genel konular hakkında tartışma forumu',
      members: 150,
      posts: 320,
      lastActivity: '2 saat önce',
      category: 'Genel',
      isPinned: true,
    },
    {
      id: '2',
      title: 'Eğitim ve Gelişim',
      description: 'Eğitim ve kişisel gelişim konuları',
      members: 89,
      posts: 156,
      lastActivity: '5 saat önce',
      category: 'Eğitim',
      isPinned: false,
    },
    {
      id: '3',
      title: 'Sosyal Etkileşim',
      description: 'Sosyal beceriler ve etkileşim konuları',
      members: 120,
      posts: 245,
      lastActivity: '1 gün önce',
      category: 'Sosyal',
      isPinned: true,
    },
  ];

  const filteredForums = forums.filter(forum =>
    forum.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    forum.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Forumlar</Text>
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons name="magnify" size={24} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Forum ara..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView style={styles.content}>
        {filteredForums.map((forum) => (
          <TouchableOpacity
            key={forum.id}
            style={styles.card}
            onPress={() => navigation.navigate('Forum', { id: forum.id })}
          >
            <View style={styles.cardHeader}>
              <View style={styles.titleContainer}>
                {forum.isPinned && (
                  <MaterialCommunityIcons name="pin" size={20} color="#4A90E2" style={styles.pinIcon} />
                )}
                <Text style={styles.cardTitle}>{forum.title}</Text>
              </View>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{forum.category}</Text>
              </View>
            </View>

            <Text style={styles.description}>{forum.description}</Text>

            <View style={styles.stats}>
              <View style={styles.stat}>
                <MaterialCommunityIcons name="account-group" size={16} color="#666" />
                <Text style={styles.statText}>{forum.members} üye</Text>
              </View>
              <View style={styles.stat}>
                <MaterialCommunityIcons name="message-text" size={16} color="#666" />
                <Text style={styles.statText}>{forum.posts} gönderi</Text>
              </View>
              <View style={styles.stat}>
                <MaterialCommunityIcons name="clock-outline" size={16} color="#666" />
                <Text style={styles.statText}>{forum.lastActivity}</Text>
              </View>
            </View>

            <View style={styles.cardFooter}>
              <TouchableOpacity style={styles.actionButton}>
                <MaterialCommunityIcons name="message-reply-text" size={20} color="#4A90E2" />
                <Text style={styles.actionButtonText}>Yanıtla</Text>
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
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  pinIcon: {
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  categoryBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 8,
  },
  categoryText: {
    color: '#1976D2',
    fontSize: 12,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  stats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 14,
    color: '#666',
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

export default ForumsScreen; 