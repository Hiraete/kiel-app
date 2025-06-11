import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const CARD_PAIRS = ['🍎', '🍌', '🍇', '🍓'];

function shuffle(array: any[]) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

export default function MemoryGameScreen() {
  const [cards, setCards] = useState<{ value: string; id: number; matched: boolean }[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [lock, setLock] = useState(false);

  useEffect(() => {
    // Kartları başlat
    const initialCards = shuffle(
      [...CARD_PAIRS, ...CARD_PAIRS].map((value, i) => ({ value, id: i, matched: false }))
    );
    setCards(initialCards);
    setFlipped([]);
    setMatched([]);
    setLock(false);
  }, []);

  useEffect(() => {
    if (flipped.length === 2) {
      setLock(true);
      setTimeout(() => {
        const [first, second] = flipped;
        if (cards[first].value === cards[second].value) {
          setMatched((prev) => [...prev, first, second]);
        }
        setFlipped([]);
        setLock(false);
      }, 800);
    }
  }, [flipped]);

  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      Alert.alert('Tebrikler!', 'Tüm kartları eşleştirdiniz!', [
        { text: 'Yeniden Oyna', onPress: resetGame }
      ]);
    }
  }, [matched, cards]);

  const handleCardPress = (index: number) => {
    if (lock || flipped.includes(index) || matched.includes(index)) return;
    setFlipped((prev) => [...prev, index]);
  };

  const resetGame = () => {
    const newCards = shuffle(
      [...CARD_PAIRS, ...CARD_PAIRS].map((value, i) => ({ value, id: i, matched: false }))
    );
    setCards(newCards);
    setFlipped([]);
    setMatched([]);
    setLock(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hafıza Oyunu</Text>
      <View style={styles.grid}>
        {cards.map((card, idx) => {
          const isOpen = flipped.includes(idx) || matched.includes(idx);
          return (
            <TouchableOpacity
              key={card.id}
              style={[styles.card, isOpen && styles.cardOpen]}
              onPress={() => handleCardPress(idx)}
              activeOpacity={isOpen ? 1 : 0.7}
            >
              <Text style={styles.cardText}>{isOpen ? card.value : '?'}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
        <Text style={styles.resetText}>Yeniden Başlat</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 240,
    justifyContent: 'center',
    marginBottom: 24,
  },
  card: {
    width: 50,
    height: 70,
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  cardOpen: {
    backgroundColor: '#e0f7fa',
  },
  cardText: {
    fontSize: 32,
    color: '#333',
  },
  resetButton: {
    marginTop: 16,
    backgroundColor: '#4A90E2',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  resetText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 