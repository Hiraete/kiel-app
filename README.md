# KielApp - Fizyoterapi Asistanı

KielApp, fizyoterapi sürecini kolaylaştırmak ve hastaların tedavi süreçlerini daha etkili hale getirmek için tasarlanmış bir mobil uygulamadır.

## Özellikler

### Kullanıcı Yönetimi
- İki farklı kullanıcı rolü: Uzman (Fizyoterapist) ve Danışan (Hasta)
- Güvenli kayıt ve giriş sistemi
- JWT tabanlı kimlik doğrulama
- Profil yönetimi

### Ana Özellikler
1. **Günlük Aktivite Takibi**
   - Günlük egzersiz programı
   - Aktivite planlaması
   - İlerleme takibi

2. **Egzersiz Programı**
   - Kişiselleştirilmiş egzersiz listeleri
   - Video destekli egzersiz açıklamaları
   - Zorluk seviyesi ayarlaması

3. **Eğitici Oyunlar**
   - Rehabilitasyon sürecini destekleyen oyunlar
   - İnteraktif alıştırmalar
   - Motivasyon sistemi

4. **Gelişim Raporları**
   - Detaylı ilerleme grafikleri
   - Performans analizi
   - Dönemsel karşılaştırmalar

5. **Forum**
   - Uzman yazıları
   - Deneyim paylaşımları
   - Soru-cevap bölümü

6. **Uzman Görüşmesi**
   - Online görüşme talep sistemi
   - Uzman profilleri ve değerlendirmeleri
   - Randevu yönetimi

## Teknik Altyapı

### Frontend
- React Native
- TypeScript
- React Navigation
- React Native Paper (UI Kütüphanesi)
- AsyncStorage (Yerel Depolama)
- Axios (HTTP İstekleri)

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- RESTful API

## Kurulum

1. Gerekli paketlerin yüklenmesi:
```bash
npm install
```

2. Geliştirme ortamında çalıştırma:
```bash
npm start
```

3. Android için build alma:
```bash
npm run android
```

4. iOS için build alma:
```bash
npm run ios
```

## Ortam Değişkenleri

`.env` dosyasında aşağıdaki değişkenleri tanımlayın:

```env
API_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret
```

## API Endpoints

### Kimlik Doğrulama
- POST /api/auth/register - Yeni kullanıcı kaydı
- POST /api/auth/login - Kullanıcı girişi

### Kullanıcı İşlemleri
- GET /api/users/profile - Kullanıcı profili
- PUT /api/users/profile - Profil güncelleme

### Aktivite Yönetimi
- GET /api/activities - Aktivite listesi
- POST /api/activities - Yeni aktivite ekleme
- PUT /api/activities/:id - Aktivite güncelleme

### Egzersiz Programı
- GET /api/exercises - Egzersiz listesi
- GET /api/exercises/:id - Egzersiz detayı

### Forum
- GET /api/forum/posts - Forum gönderileri
- POST /api/forum/posts - Yeni gönderi oluşturma
- GET /api/forum/posts/:id - Gönderi detayı

### Uzman Görüşmesi
- GET /api/consultations - Görüşme listesi
- POST /api/consultations - Görüşme talebi oluşturma
- PUT /api/consultations/:id - Görüşme durumu güncelleme

## Katkıda Bulunma

1. Bu repository'yi fork edin
2. Feature branch'i oluşturun (`git checkout -b feature/AmazingFeature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some AmazingFeature'`)
4. Branch'inizi push edin (`git push origin feature/AmazingFeature`)
5. Pull Request oluşturun

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.

## İletişim

Proje Sahibi - [@emircannn](https://github.com/emircannn)

Proje Linki: [https://github.com/emircannn/KielApp](https://github.com/emircannn/KielApp) 