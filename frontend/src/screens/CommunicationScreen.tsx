import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  Card,
  Text,
  Searchbar,
  Chip,
  IconButton,
  useTheme,
  FAB,
} from 'react-native-paper';

interface CommunicationCard {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  isFavorite: boolean;
}

export default function CommunicationScreen() {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    'Tümü',
    'Duygular',
    'Yiyecekler',
    'Aktiviteler',
    'İhtiyaçlar',
    'Aile',
  ];

  const [cards, setCards] = useState<CommunicationCard[]>([
    {
      id: '1',
      title: 'Mutlu',
      category: 'Duygular',
      imageUrl: 'https://placeholder.com/150',
      isFavorite: true,
    },
    {
      id: '2',
      title: 'Su',
      category: 'İhtiyaçlar',
      imageUrl: 'https://placeholder.com/150',
      isFavorite: false,
    },
    {
      id: '3',
      title: 'Oyun',
      category: 'Aktiviteler',
      imageUrl: 'https://placeholder.com/150',
      isFavorite: true,
    },
    // Daha fazla kart eklenebilir
  ]);

  const toggleFavorite = (id: string) => {
    setCards(
      cards.map((card) =>
        card.id === id ? { ...card, isFavorite: !card.isFavorite } : card
      )
    );
  };

  const filteredCards = cards.filter((card) => {
    const matchesSearch = card.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      !selectedCategory || selectedCategory === 'Tümü' || card.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>
          İletişim Kartları
        </Text>
        <Searchbar
          placeholder="Kart ara..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContainer}
        pagingEnabled={false}
        snapToInterval={0}
      >
        {categories.map((category) => (
          <Chip
            key={category}
            selected={selectedCategory === category}
            onPress={() =>
              setSelectedCategory(
                selectedCategory === category ? null : category
              )
            }
            style={styles.categoryChip}
          >
            {category}
          </Chip>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.cardsContainer}
        contentContainerStyle={styles.cardsGrid}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <View style={styles.cardsGrid}>
          {filteredCards.map((card) => (
            <Card key={card.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <IconButton
                  icon={card.isFavorite ? 'star' : 'star-outline'}
                  size={20}
                  onPress={() => toggleFavorite(card.id)}
                  style={styles.favoriteButton}
                />
              </View>
              <TouchableOpacity
                onPress={() => {
                  // TODO: Kart detay modalı eklenecek
                  console.log('Kart seçildi:', card.id);
                }}
              >
                <Image
                  source={{ uri: card.imageUrl }}
                  style={styles.cardImage}
                />
                <Card.Content>
                  <Text variant="titleMedium" style={styles.cardTitle}>
                    {card.title}
                  </Text>
                </Card.Content>
              </TouchableOpacity>
            </Card>
          ))}
        </View>
      </ScrollView>

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => {
          // TODO: Yeni kart ekleme modalı eklenecek
          console.log('Yeni kart ekle');
        }}
      />
    </View>
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
    marginBottom: 16,
  },
  searchBar: {
    elevation: 0,
    backgroundColor: '#F3F4F6',
  },
  categoryScroll: {
    maxHeight: 56,
    backgroundColor: '#fff',
  },
  categoryContainer: {
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryChip: {
    marginHorizontal: 4,
  },
  cardsContainer: {
    flex: 1,
  },
  cardsGrid: {
    padding: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    margin: '1%',
    elevation: 2,
  },
  cardHeader: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 1,
  },
  favoriteButton: {
    margin: 0,
  },
  cardImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  cardTitle: {
    textAlign: 'center',
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
}); 