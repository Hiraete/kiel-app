import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const PuzzleGameScreen = () => {
  const [puzzle, setPuzzle] = useState<number[]>([]);
  const [emptyIndex, setEmptyIndex] = useState<number>(0);
  const [moves, setMoves] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 0];
    const shuffled = numbers.sort(() => Math.random() - 0.5);
    setPuzzle(shuffled);
    setEmptyIndex(shuffled.indexOf(0));
    setMoves(0);
    setIsComplete(false);
  };

  const handleTilePress = (index: number) => {
    if (isComplete) return;

    const row = Math.floor(index / 3);
    const col = index % 3;
    const emptyRow = Math.floor(emptyIndex / 3);
    const emptyCol = emptyIndex % 3;

    if (
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow)
    ) {
      const newPuzzle = [...puzzle];
      newPuzzle[emptyIndex] = newPuzzle[index];
      newPuzzle[index] = 0;
      setPuzzle(newPuzzle);
      setEmptyIndex(index);
      setMoves(moves + 1);

      if (isPuzzleComplete(newPuzzle)) {
        setIsComplete(true);
        Alert.alert('Tebrikler!', `Puzzle'ı ${moves + 1} hamlede tamamladınız!`);
      }
    }
  };

  const isPuzzleComplete = (currentPuzzle: number[]) => {
    for (let i = 0; i < currentPuzzle.length - 1; i++) {
      if (currentPuzzle[i] !== i + 1) return false;
    }
    return currentPuzzle[currentPuzzle.length - 1] === 0;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Puzzle Oyunu</Text>
        <Text style={styles.moves}>Hamle: {moves}</Text>
      </View>

      <View style={styles.grid}>
        {puzzle.map((number, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.tile,
              number === 0 && styles.emptyTile,
              isComplete && styles.completeTile,
            ]}
            onPress={() => handleTilePress(index)}
          >
            {number !== 0 && (
              <Text style={styles.tileText}>{number}</Text>
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
    aspectRatio: 1,
  },
  tile: {
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
  emptyTile: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  completeTile: {
    backgroundColor: '#E3FFF1',
  },
  tileText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
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

export default PuzzleGameScreen; 