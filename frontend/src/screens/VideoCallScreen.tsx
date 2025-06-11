import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RootStackScreenProps, RootStackParamList } from '../types';
import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import { connect, Room } from 'twilio-video';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ZegoUIKitPrebuiltCall, ONE_ON_ONE_VIDEO_CALL_CONFIG } from '@zegocloud/zego-uikit-prebuilt-call-rn';
import { useAuth } from '../contexts/AuthContext';
import { appointmentService } from '../services/appointmentService';

type VideoCallScreenRouteProp = RouteProp<RootStackParamList, 'VideoCall'>;

const VideoCallScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<VideoCallScreenRouteProp>();
  const { id: appointmentId, id :expertId } = route.params; // 'id' olarak değiştirildi
  const [room, setRoom] = useState<Room | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);

  useEffect(() => {
    initializeCall();
    return () => {
      if (room) {
        room.disconnect();
      }
    };
  }, []);

  const initializeCall = async () => {
    try {
      // Twilio token'ı al
      const response = await fetch('http://localhost:5000/api/video/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await AsyncStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          appointmentId,
          expertId,
        }),
      });

      if (!response.ok) {
        throw new Error('Token alınamadı');
      }

      const { token } = await response.json();

      // Odaya bağlan
      const twilioRoom = await connect(token, {
        name: appointmentId,
        audio: true,
        video: true,
      });

      setRoom(twilioRoom);
    } catch (error) {
      console.error('Görüntülü konuşma başlatılırken hata:', error);
      Alert.alert(
        'Hata',
        'Görüntülü konuşma başlatılamadı. Lütfen tekrar deneyin.',
        [{ text: 'Tamam', onPress: () => navigation.goBack() }]
      );
    }
  };

  const toggleMute = () => {
    if (room) {
      room.localParticipant.audioTracks.forEach((publication) => {
        if (publication.track) {
          if (isMuted) {
            publication.track.enable();
          } else {
            publication.track.disable();
          }
        }
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleCamera = () => {
    if (room) {
      room.localParticipant.videoTracks.forEach((publication) => {
        if (publication.track) {
          if (isCameraOff) {
            publication.track.enable();
          } else {
            publication.track.disable();
          }
        }
      });
      setIsCameraOff(!isCameraOff);
    }
  };

  const toggleSpeaker = () => {
    if (Platform.OS === 'ios') {
      // iOS'ta hoparlör kontrolü için native modül kullanılmalı
    }
    setIsSpeakerOn(!isSpeakerOn);
  };

  const endCall = () => {
    if (room) {
      room.disconnect();
    }
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.videoContainer}>
        {/* Video görüntüleri burada gösterilecek */}
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlButton, isMuted && styles.controlButtonActive]}
          onPress={toggleMute}
        >
          <MaterialCommunityIcons
            name={isMuted ? 'microphone-off' : 'microphone'}
            size={24}
            color="#fff"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.endCallButton]}
          onPress={endCall}
        >
          <MaterialCommunityIcons name="phone-off" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, isCameraOff && styles.controlButtonActive]}
          onPress={toggleCamera}
        >
          <MaterialCommunityIcons
            name={isCameraOff ? 'video-off' : 'video'}
            size={24}
            color="#fff"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, !isSpeakerOn && styles.controlButtonActive]}
          onPress={toggleSpeaker}
        >
          <MaterialCommunityIcons
            name={isSpeakerOn ? 'volume-high' : 'volume-off'}
            size={24}
            color="#fff"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoContainer: {
    flex: 1,
    backgroundColor: '#333',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonActive: {
    backgroundColor: '#ff4444',
  },
  endCallButton: {
    backgroundColor: '#ff4444',
    width: 60,
    height: 60,
    borderRadius: 30,
  },
});

export default VideoCallScreen; 