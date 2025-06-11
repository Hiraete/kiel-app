import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
  TextInput,
  ScrollView,
  Share,
  Alert,
} from 'react-native';
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  mediaDevices,
} from 'react-native-webrtc';
import { io } from 'socket.io-client';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const configuration = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
};

const VideoChatScreen = () => {
  const [roomId, setRoomId] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [localStream, setLocalStream] = useState<any>(null);
  const [remoteStream, setRemoteStream] = useState<any>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [messages, setMessages] = useState<Array<{text: string, sender: string}>>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isChatVisible, setIsChatVisible] = useState(false);
  
  const socketRef = useRef<any>(null);
  const peerConnectionRef = useRef<any>(null);
  const navigation = useNavigation();
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const newRoomId = Math.random().toString(36).substring(7);
    setRoomId(newRoomId);

    // WebRTC ve Socket.io kurulumu
    setupWebRTC();
    setupSocket(newRoomId);

    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track: any) => track.stop());
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const setupWebRTC = async () => {
    try {
      const stream = await mediaDevices.getUserMedia({
        audio: true,
        video: {
          width: { min: 640 },
          height: { min: 480 },
          frameRate: { min: 30 },
          facingMode: 'user',
        },
      });

      setLocalStream(stream);
      peerConnectionRef.current = new RTCPeerConnection(configuration);

      // Yerel medya akışını peer connection'a ekle
      stream.getTracks().forEach((track: any) => {
        peerConnectionRef.current.addTrack(track, stream);
      });

      // Uzak medya akışını dinle
      peerConnectionRef.current.ontrack = (event: any) => {
        setRemoteStream(event.streams[0]);
      };

      // ICE adaylarını dinle
      peerConnectionRef.current.onicecandidate = (event: any) => {
        if (event.candidate) {
          socketRef.current.emit('ice-candidate', {
            candidate: event.candidate,
            roomId,
          });
        }
      };
    } catch (err) {
      console.error('WebRTC kurulum hatası:', err);
    }
  };

  const setupSocket = (newRoomId: string) => {
    socketRef.current = io('http://localhost:5000');

    socketRef.current.on('connect', () => {
      setIsConnected(true);
      socketRef.current.emit('join-room', newRoomId);
    });

    socketRef.current.on('user-joined', async () => {
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);
      socketRef.current.emit('offer', {
        offer,
        roomId: newRoomId,
      });
    });

    socketRef.current.on('offer', async (data: any) => {
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.offer));
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);
      socketRef.current.emit('answer', {
        answer,
        roomId: newRoomId,
      });
    });

    socketRef.current.on('answer', async (data: any) => {
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
    });

    socketRef.current.on('ice-candidate', async (data: any) => {
      if (data.candidate) {
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    });

    // Sohbet mesajlarını dinle
    socketRef.current.on('chat-message', (data: { text: string, sender: string }) => {
      setMessages(prev => [...prev, data]);
      scrollViewRef.current?.scrollToEnd({ animated: true });
    });
  };

  const shareRoomId = async () => {
    try {
      await Share.share({
        message: `Görüntülü sohbet odasına katılmak için bu ID'yi kullanın: ${roomId}`,
      });
    } catch (error) {
      Alert.alert('Hata', 'Oda ID\'si paylaşılamadı.');
    }
  };

  const sendMessage = () => {
    if (newMessage.trim() && socketRef.current) {
      const messageData = {
        text: newMessage.trim(),
        sender: 'Ben',
        roomId,
      };
      socketRef.current.emit('chat-message', messageData);
      setMessages(prev => [...prev, messageData]);
      setNewMessage('');
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }
  };

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track: any) => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleCamera = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track: any) => {
        track.enabled = !track.enabled;
      });
      setIsCameraOff(!isCameraOff);
    }
  };

  const handleEndCall = () => {
    if (localStream) {
      localStream.getTracks().forEach((track: any) => track.stop());
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={shareRoomId} style={styles.roomIdContainer}>
          <Text style={styles.roomId}>Oda ID: {roomId}</Text>
          <MaterialCommunityIcons name="share" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.endCallButton} onPress={handleEndCall}>
          <MaterialCommunityIcons name="phone-off" size={24} color="white" />
          <Text style={styles.endCallText}>Görüşmeyi Sonlandır</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.videoContainer}>
        {remoteStream && (
          <RTCView
            streamURL={remoteStream.toURL()}
            style={styles.remoteVideo}
            objectFit="cover"
          />
        )}
        {localStream && (
          <RTCView
            streamURL={localStream.toURL()}
            style={styles.localVideo}
            objectFit="cover"
          />
        )}
      </View>

      {isChatVisible && (
        <View style={styles.chatContainer}>
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
          >
            {messages.map((msg, index) => (
              <View
                key={index}
                style={[
                  styles.messageBubble,
                  msg.sender === 'Ben' ? styles.myMessage : styles.theirMessage,
                ]}
              >
                <Text style={styles.messageText}>{msg.text}</Text>
              </View>
            ))}
          </ScrollView>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Mesajınızı yazın..."
              placeholderTextColor="#666"
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <MaterialCommunityIcons name="send" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={toggleMute}>
          <MaterialCommunityIcons
            name={isMuted ? 'microphone-off' : 'microphone'}
            size={24}
            color="white"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={toggleCamera}>
          <MaterialCommunityIcons
            name={isCameraOff ? 'video-off' : 'video'}
            size={24}
            color="white"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => setIsChatVisible(!isChatVisible)}
        >
          <MaterialCommunityIcons
            name={isChatVisible ? 'message-off' : 'message'}
            size={24}
            color="white"
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    padding: 16,
    backgroundColor: '#1a1a1a',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roomIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2c2c2c',
    padding: 8,
    borderRadius: 8,
  },
  roomId: {
    color: '#fff',
    fontSize: 16,
  },
  endCallButton: {
    backgroundColor: '#ff4444',
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  endCallText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  remoteVideo: {
    flex: 1,
    backgroundColor: '#2c2c2c',
  },
  localVideo: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 100,
    height: 150,
    backgroundColor: '#2c2c2c',
    borderRadius: 8,
  },
  chatContainer: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    width: 300,
    height: 400,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  messagesContainer: {
    flex: 1,
    padding: 10,
  },
  messagesContent: {
    paddingBottom: 10,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 12,
    marginVertical: 5,
  },
  myMessage: {
    backgroundColor: '#4A90E2',
    alignSelf: 'flex-end',
  },
  theirMessage: {
    backgroundColor: '#2c2c2c',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#fff',
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#1a1a1a',
  },
  input: {
    flex: 1,
    backgroundColor: '#2c2c2c',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    color: '#fff',
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#4A90E2',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#1a1a1a',
  },
  controlButton: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 30,
    marginHorizontal: 10,
  },
});

export default VideoChatScreen; 