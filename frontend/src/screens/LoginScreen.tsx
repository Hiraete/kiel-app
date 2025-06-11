import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  
  const { login } = useAuth();
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    if (!email) {
      newErrors.email = 'E-posta adresi gereklidir';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Geçerli bir e-posta adresi giriniz';
    }
    
    if (!password) {
      newErrors.password = 'Şifre gereklidir';
    } else if (password.length < 6) {
      newErrors.password = 'Şifre en az 6 karakter olmalıdır';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    try {
      if (!validateForm()) {
        return;
      }
      setLoading(true);
      setErrors({});
      
      console.log('Login isteği gönderiliyor:', { email, password });
      const response = await login(email, password);
      console.log('Login başarılı, response:', response);
      const token = await AsyncStorage.getItem('@KielApp:token');
      console.log('AsyncStorage TOKEN:', token);
      navigation.navigate('MainTabs');
    } catch (error: any) {
      console.error('Login hatası:', error);
      console.error('Hata detayları:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      setErrors({ 
        general: error.response?.data?.message || 
                error.response?.data?.errors?.[0]?.msg || 
                error.message || 
                'Giriş yapılırken bir hata oluştu. Lütfen bilgilerinizi kontrol edin.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Giriş Yap</Text>
        
        {errors.general && (
          <Text style={styles.errorText}>{errors.general}</Text>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, errors.email ? styles.inputError : null]}
            placeholder="E-posta"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setErrors(prev => ({ ...prev, email: undefined }));
            }}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!loading}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, errors.password ? styles.inputError : null]}
            placeholder="Şifre"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setErrors(prev => ({ ...prev, password: undefined }));
            }}
            secureTextEntry
            editable={!loading}
          />
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Giriş Yap</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerLink}
          onPress={() => navigation.navigate('Register')}
          disabled={loading}
        >
          <Text style={styles.registerLinkText}>
            Hesabınız yok mu? Kayıt olun
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#ff3b30',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 12,
    marginTop: 5,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerLinkText: {
    color: '#007AFF',
    fontSize: 16,
  },
}); 