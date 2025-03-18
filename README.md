# Kiel App - Otizm Destek Uygulaması

Kiel App, otizmli çocukların ebeveynlerine destek olmak amacıyla geliştirilmiş bir mobil uygulamadır. Uygulama, çocukların günlük rutinlerini takip etme, gelişimlerini izleme ve iletişim becerilerini geliştirme konularında yardımcı olmayı amaçlamaktadır.

## Özellikler

- Kullanıcı kaydı ve girişi
- Günlük rutinlerin planlanması ve takibi
- Görsel iletişim kartları
- Gelişim takibi ve raporlama
- Etkinlik planlaması
- Hatırlatıcılar ve bildirimler

## Teknolojiler

### Frontend
- React Native
- TypeScript
- Expo
- React Navigation
- AsyncStorage

### Backend
- PHP
- Laravel
- MySQL
- JWT Authentication

## Kurulum

### Backend (PHP/Laravel)
1. Backend dizinine gidin:
```bash
cd backend
```

2. Composer bağımlılıklarını yükleyin:
```bash
composer install
```

3. .env dosyasını oluşturun:
```bash
cp .env.example .env
```

4. Veritabanı ayarlarını yapılandırın ve migration'ları çalıştırın:
```bash
php artisan migrate
```

### Frontend (React Native)
1. Frontend dizinine gidin:
```bash
cd frontend
```

2. NPM bağımlılıklarını yükleyin:
```bash
npm install
```

3. Uygulamayı başlatın:
```bash
npm start
```

## Katkıda Bulunma

1. Bu repoyu fork edin
2. Feature branch'i oluşturun (`git checkout -b feature/AmazingFeature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some AmazingFeature'`)
4. Branch'inizi push edin (`git push origin feature/AmazingFeature`)
5. Pull Request oluşturun

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın. 