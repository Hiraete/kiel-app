import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import Chatbot from '../components/Chatbot';

export const ChatbotScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sağlık Asistanı</Text>
        <Text style={styles.subtitle}>
          Sağlık konularında sorularınızı yanıtlamak için buradayım.
        </Text>
      </View>
      <Chatbot />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
}); 