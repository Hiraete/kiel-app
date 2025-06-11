import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const GRID_SIZE = 3;
const TOTAL_PIECES = GRID_SIZE * GRID_SIZE;

function shuffle(array: any[]) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

export default function PuzzleGameScreen() {
  const [pieces, setPieces] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    resetGame();
  }, []);

  useEffect(() => {
    if (pieces.length > 0 && pieces.every((val, idx) => val === idx)) {
      Alert.alert('Tebrikler!', 'Puzzle tamamlandı!', [
        { text: 'Yeniden Oyna', onPress: resetGame }
      ]);
    }
  }, [pieces]);

  const handlePiecePress = (idx: number) => {
    if (selected === null) {
      setSelected(idx);
    } else if (selected === idx) {
      setSelected(null);
    } else {
      // Swap
      const newPieces = [...pieces];
      [newPieces[selected], newPieces[idx]] = [newPieces[idx], newPieces[selected]];
      setPieces(newPieces);
      setSelected(null);
    }
  };

  const resetGame = () => {
    const arr = Array.from({ length: TOTAL_PIECES }, (_, i) => i);
    setPieces(shuffle(arr));
    setSelected(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Puzzle Oyunu</Text>
      <View style={styles.grid}>
        {pieces.map((piece, idx) => (
          <TouchableOpacity
            key={idx}
            style={[styles.piece, selected === idx && styles.selectedPiece]}
            onPress={() => handlePiecePress(idx)}
            activeOpacity={0.7}
          >
            {/* Burada gerçek bir resim yerine renkli kutular ve parça numarası gösteriyoruz */}
            <View style={[styles.imagePart, { backgroundColor: COLORS[piece % COLORS.length] }]}/>
            <Text style={styles.pieceText}>{piece + 1}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
        <Text style={styles.resetText}>Yeniden Başlat</Text>
      </TouchableOpacity>
    </View>
  );
}

const COLORS = ['#FFB74D', '#4FC3F7', '#81C784', '#E57373', '#BA68C8', '#FFD54F', '#A1887F', '#90A4AE', '#F06292'];

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
    width: 240,
    height: 240,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#eee',
  },
  piece: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#fafafa',
  },
  selectedPiece: {
    borderColor: '#4A90E2',
    borderWidth: 3,
  },
  imagePart: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginBottom: 4,
  },
  pieceText: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
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