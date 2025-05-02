import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const MatchingGameScreen = () => {
  const [cards, setCards] = useState<{ id: number; image: string }[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedCards, setMatchedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  const images = [
    { id: 1, image: 'https://picsum.photos/200/200?random=1' },
    { id: 2, image: 'https://picsum.photos/200/200?random=2' },
    { id: 3, image: 'https://picsum.photos/200/200?random=3' },
    { id: 4, image: 'https://picsum.photos/200/200?random=4' },
    { id: 5, image: 'https://picsum.photos/200/200?random=5' },
    { id: 6, image: 'https://picsum.photos/200/200?random=6' },
  ];

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const gameCards = [...images, ...images].sort(() => Math.random() - 0.5);
    setCards(gameCards);
    setFlippedCards([]);
    setMatchedCards([]);
    setMoves(0);
  };

  const handleCardPress = (index: number) => {
    if (flippedCards.length === 2 || flippedCards.includes(index) || matchedCards.includes(index)) {
      return;
    }

    const newFlippedCards = [...flippedCards, index];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      const [firstIndex, secondIndex] = newFlippedCards;
      
      if (cards[firstIndex].id === cards[secondIndex].id) {
        setMatchedCards([...matchedCards, firstIndex, secondIndex]);
        setFlippedCards([]);
        
        if (matchedCards.length + 2 === cards.length) {
          Alert.alert('Tebrikler!', `Oyunu ${moves + 1} hamlede tamamladınız!`);
        }
      } else {
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Eşleştirme Oyunu</Text>
        <Text style={styles.moves}>Hamle: {moves}</Text>
      </View>

      <View style={styles.grid}>
        {cards.map((card, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.card,
              flippedCards.includes(index) && styles.flippedCard,
              matchedCards.includes(index) && styles.matchedCard,
            ]}
            onPress={() => handleCardPress(index)}
          >
            {flippedCards.includes(index) || matchedCards.includes(index) ? (
              <Image source={{ uri: card.image }} style={styles.cardImage} />
            ) : (
              <MaterialCommunityIcons name="image" size={32} color="#4A90E2" />
            )}
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.resetButton} onPress={initializeGame}>
        <Text style={styles.resetButtonText}>Yeniden Başla</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  moves: {
    fontSize: 18,
    color: '#666',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
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
  flippedCard: {
    backgroundColor: '#E1F0FF',
  },
  matchedCard: {
    backgroundColor: '#E3FFF1',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  resetButton: {
    backgroundColor: '#4A90E2',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MatchingGameScreen; 