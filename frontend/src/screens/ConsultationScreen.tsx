import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Avatar, Button, useTheme } from 'react-native-paper';

const experts = [
  {
    id: 1,
    name: 'Dr. Ayşe Yılmaz',
    specialty: 'Fizyoterapist',
    experience: '10 yıl deneyim',
    rating: 4.8,
    available: true,
  },
  {
    id: 2,
    name: 'Dr. Mehmet Demir',
    specialty: 'Spor Hekimi',
    experience: '15 yıl deneyim',
    rating: 4.9,
    available: true,
  },
];

export default function ConsultationScreen() {
  const theme = useTheme();

  const handleConsultation = (expertId: number) => {
    // Görüşme başlatma mantığı burada olacak
    console.log('Görüşme talep edildi:', expertId);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text variant="headlineMedium" style={styles.title}>
          Uzmanlarla Görüşme
        </Text>

        {experts.map((expert) => (
          <Card key={expert.id} style={styles.card} mode="elevated">
            <Card.Content style={styles.cardContent}>
              <View style={styles.expertInfo}>
                <Avatar.Text 
                  size={50} 
                  label={expert.name.split(' ').map(n => n[0]).join('')} 
                />
                <View style={styles.expertDetails}>
                  <Text variant="titleMedium">{expert.name}</Text>
                  <Text variant="bodyMedium" style={styles.specialty}>
                    {expert.specialty}
                  </Text>
                  <Text variant="bodySmall" style={styles.experience}>
                    {expert.experience} • ⭐ {expert.rating}
                  </Text>
                </View>
              </View>
              
              <Button
                mode="contained"
                onPress={() => handleConsultation(expert.id)}
                style={styles.button}
              >
                {expert.available ? 'Görüşme Talep Et' : 'Müsait Değil'}
              </Button>
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
  cardContent: {
    gap: 16,
  },
  expertInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  expertDetails: {
    flex: 1,
  },
  specialty: {
    color: '#6B7280',
    marginTop: 4,
  },
  experience: {
    color: '#6B7280',
    marginTop: 4,
  },
  button: {
    marginTop: 8,
  },
});
