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

type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

export const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    passwordConfirmation?: string;
    general?: string;
  }>({});

  const { register } = useAuth();
  const navigation = useNavigation<RegisterScreenNavigationProp>();

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    if (!name) {
      newErrors.name = 'İsim alanı gereklidir';
    }
    
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

    if (!passwordConfirmation) {
      newErrors.passwordConfirmation = 'Şifre tekrarı gereklidir';
    } else if (password !== passwordConfirmation) {
      newErrors.passwordConfirmation = 'Şifreler eşleşmiyor';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    try {
      if (!validateForm()) {
        return;
      }

      setLoading(true);
      setErrors({});
      
      await register(name, email, password);
      navigation.navigate('MainTabs');
    } catch (error: any) {
      console.error('Register error:', error);
      setErrors({
        general: error.message || 'Kayıt olurken bir hata oluştu. Lütfen bilgilerinizi kontrol edin.'
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
        <Text style={styles.title}>Kayıt Ol</Text>
        
        {errors.general && (
          <Text style={styles.errorText}>{errors.general}</Text>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, errors.name ? styles.inputError : null]}
            placeholder="İsim"
            value={name}
            onChangeText={(text) => {
              setName(text);
              setErrors(prev => ({ ...prev, name: undefined }));
            }}
            editable={!loading}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

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

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, errors.passwordConfirmation ? styles.inputError : null]}
            placeholder="Şifre Tekrarı"
            value={passwordConfirmation}
            onChangeText={(text) => {
              setPasswordConfirmation(text);
              setErrors(prev => ({ ...prev, passwordConfirmation: undefined }));
            }}
            secureTextEntry
            editable={!loading}
          />
          {errors.passwordConfirmation && (
            <Text style={styles.errorText}>{errors.passwordConfirmation}</Text>
          )}
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Kayıt Ol</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => navigation.navigate('Login')}
          disabled={loading}
        >
          <Text style={styles.loginLinkText}>
            Zaten hesabınız var mı? Giriş yapın
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
  roleContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'center',
  },
  roleButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  roleButtonActive: {
    backgroundColor: '#007AFF',
  },
  roleButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  roleButtonTextActive: {
    color: '#fff',
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
  loginLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginLinkText: {
    color: '#007AFF',
    fontSize: 16,
  },
}); 