import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Message {
  sender: 'user' | 'chatbot';
  content: string;
  type: 'text';
  createdAt: string;
}

const responses: { [key: string]: string[] } = {
  'merhaba': [
    'Merhaba! Size nasıl yardımcı olabilirim?',
    'Hoş geldiniz! Sağlık konusunda sorularınızı yanıtlamak için buradayım.',
    'Merhaba! Bugün size nasıl yardımcı olabilirim?'
  ],
  'randevu': [
    'Randevu almak için ana sayfadaki "Randevu Al" butonuna tıklayabilirsiniz.',
    'Randevu işlemleri için lütfen ana sayfadaki randevu bölümünü kullanın.',
    'Size en uygun zamanı seçmek için randevu sayfasını ziyaret edebilirsiniz.'
  ],
  'uzman': [
    'Uzmanlarımız hakkında bilgi almak için "Uzmanlar" sayfasını ziyaret edebilirsiniz.',
    'Tüm uzmanlarımızın detaylı bilgilerine ana sayfadaki uzmanlar bölümünden ulaşabilirsiniz.',
    'Uzman kadromuz hakkında bilgi almak için uzmanlar sayfasını inceleyebilirsiniz.'
  ],
  'sağlık': [
    'Sağlıklı yaşam için düzenli egzersiz yapmanızı ve dengeli beslenmenizi öneririm.',
    'Sağlıklı bir yaşam için günde en az 8 saat uyku ve düzenli spor önemlidir.',
    'Sağlığınız için düzenli check-up yaptırmanızı ve doktor kontrollerinizi aksatmamanızı öneririm.'
  ],
  'beslenme': [
    'Dengeli beslenme için protein, karbonhidrat ve yağları yeterli miktarda tüketmelisiniz.',
    'Günde en az 2 litre su içmeyi ve meyve-sebze tüketimine özen göstermeyi unutmayın.',
    'Sağlıklı beslenme için işlenmiş gıdalardan uzak durup, doğal besinleri tercih etmelisiniz.'
  ],
  'spor': [
    'Haftada en az 3 gün 30 dakika egzersiz yapmanızı öneririm.',
    'Spor yaparken vücudunuzu dinlemeyi ve aşırıya kaçmamayı unutmayın.',
    'Düzenli spor yapmak hem fiziksel hem de mental sağlığınız için çok faydalıdır.'
  ],
  'teşekkür': [
    'Rica ederim! Başka bir sorunuz olursa yardımcı olmaktan mutluluk duyarım.',
    'Ne demek, her zaman yardımcı olmaya çalışırım!',
    'Rica ederim! Sağlıklı günler dilerim.'
  ],
  'görüşürüz': [
    'İyi günler! Tekrar görüşmek üzere.',
    'Sağlıklı günler! İhtiyacınız olursa yine buradayım.',
    'Hoşça kalın! Başka sorularınız olursa beklerim.'
  ]
};

const defaultResponses: string[] = [
  'Üzgünüm, bu konuda size yardımcı olamıyorum. Lütfen başka bir soru sorun.',
  'Bu konu hakkında bilgim yok. Sağlık, beslenme veya spor konularında sorularınızı yanıtlayabilirim.',
  'Bu konuda size yardımcı olamıyorum. Sağlık danışmanı olarak sağlık, beslenme ve spor konularında bilgi verebilirim.'
];

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getRandomResponse = (responses: string[]): string => {
    const randomIndex = Math.floor(Math.random() * responses.length);
    return responses[randomIndex];
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      sender: 'user',
      content: input,
      type: 'text',
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Anahtar kelime kontrolü
    const lowerMessage = input.toLowerCase();
    let botResponse = '';

    for (const [key, responseList] of Object.entries(responses)) {
      if (lowerMessage.includes(key)) {
        botResponse = getRandomResponse(responseList);
        break;
      }
    }

    if (!botResponse) {
      botResponse = getRandomResponse(defaultResponses);
    }

    const botMessage: Message = {
      sender: 'chatbot',
      content: botResponse,
      type: 'text',
      createdAt: new Date().toISOString()
    };

    setTimeout(() => {
      setMessages(prev => [...prev, botMessage]);
      setLoading(false);
    }, 500); // Kısa bir gecikme ekleyerek daha doğal bir konuşma hissi veriyoruz
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map((message, index) => (
          <View
            key={index}
            style={[
              styles.messageBubble,
              message.sender === 'user' ? styles.userMessage : styles.botMessage
            ]}
          >
            <Text style={[
              styles.messageText,
              message.sender === 'user' ? styles.userMessageText : styles.botMessageText
            ]}>
              {message.content}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Mesajınızı yazın..."
          placeholderTextColor="#999"
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, (!input.trim() || loading) && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!input.trim() || loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Icon name="send" size={24} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 20,
    marginBottom: 8,
  },
  userMessage: {
    backgroundColor: '#4A90E2',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  botMessage: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
  },
  userMessageText: {
    color: '#fff',
  },
  botMessageText: {
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
});

export default Chatbot; 