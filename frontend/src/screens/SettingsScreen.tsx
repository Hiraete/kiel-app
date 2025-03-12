import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  List,
  Switch,
  Divider,
  Button,
  Text,
  useTheme,
  Avatar,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Login: undefined;
};

type SettingsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

export default function SettingsScreen() {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const theme = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [soundEffects, setSoundEffects] = useState(true);

  const handleLogout = () => {
    // TODO: Logout işlemi eklenecek
    navigation.navigate('Login');
  };

  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Ayarlar</Text>
      <View style={styles.profileSection}>
        <Avatar.Image
          size={80}
          source={{ uri: 'https://placeholder.com/80' }}
        />
        <View style={styles.profileInfo}>
          <Text variant="titleLarge">Ebeveyn Adı</Text>
          <Text variant="bodyMedium" style={styles.emailText}>
            ebeveyn@email.com
          </Text>
        </View>
      </View>

      <List.Section>
        <List.Subheader>Uygulama Ayarları</List.Subheader>
        <List.Item
          title="Bildirimler"
          description="Bildirim tercihlerinizi yönetin"
          left={props => <List.Icon {...props} icon="bell" />}
        />
        <List.Item
          title="Gizlilik"
          description="Gizlilik ayarlarınızı yönetin"
          left={props => <List.Icon {...props} icon="shield" />}
        />
        <List.Item
          title="Karanlık Mod"
          description="Koyu tema kullan"
          left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
          right={() => (
            <Switch value={darkMode} onValueChange={setDarkMode} />
          )}
        />
        <Divider />
        <List.Item
          title="Ses Efektleri"
          description="Uygulama ses efektlerini yönet"
          left={(props) => <List.Icon {...props} icon="volume-high" />}
          right={() => (
            <Switch
              value={soundEffects}
              onValueChange={setSoundEffects}
            />
          )}
        />
      </List.Section>

      <List.Section>
        <List.Subheader>Hesap</List.Subheader>
        <List.Item
          title="Profili Düzenle"
          left={(props) => <List.Icon {...props} icon="account-edit" />}
          onPress={() => {
            // TODO: Profil düzenleme sayfası eklenecek
            console.log('Profili düzenle');
          }}
        />
        <Divider />
        <List.Item
          title="Şifre Değiştir"
          left={(props) => <List.Icon {...props} icon="lock-reset" />}
          onPress={() => {
            // TODO: Şifre değiştirme modalı eklenecek
            console.log('Şifre değiştir');
          }}
        />
        <Divider />
        <List.Item
          title="Veri Yedekleme"
          left={(props) => <List.Icon {...props} icon="cloud-upload" />}
          onPress={() => {
            // TODO: Yedekleme sayfası eklenecek
            console.log('Veri yedekle');
          }}
        />
      </List.Section>

      <List.Section>
        <List.Subheader>Destek</List.Subheader>
        <List.Item
          title="Yardım ve SSS"
          left={(props) => <List.Icon {...props} icon="help-circle" />}
          onPress={() => {
            // TODO: Yardım sayfası eklenecek
            console.log('Yardım ve SSS');
          }}
        />
        <Divider />
        <List.Item
          title="Geri Bildirim Gönder"
          left={(props) => <List.Icon {...props} icon="message" />}
          onPress={() => {
            // TODO: Geri bildirim formu eklenecek
            console.log('Geri bildirim');
          }}
        />
        <Divider />
        <List.Item
          title="Hakkında"
          left={(props) => <List.Icon {...props} icon="information" />}
          onPress={() => {
            // TODO: Hakkında sayfası eklenecek
            console.log('Hakkında');
          }}
        />
      </List.Section>

      <Button
        mode="contained"
        icon="logout"
        onPress={handleLogout}
        style={styles.logoutButton}
        buttonColor="#DC2626"
      >
        Çıkış Yap
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  profileSection: {
    padding: 24,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileInfo: {
    marginLeft: 16,
  },
  emailText: {
    color: '#6B7280',
    marginTop: 4,
  },
  logoutButton: {
    margin: 16,
  },
  title: {
    marginBottom: 24,
  },
}); 