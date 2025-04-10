# KielApp - Otizm Destek Uygulaması

KielApp, otizmli çocukların ve ailelerinin günlük yaşamlarını kolaylaştırmak, gelişimlerini desteklemek ve takip etmek için tasarlanmış kapsamlı bir mobil uygulamadır.

## Özellikler

### Kullanıcı Yönetimi
- İki farklı kullanıcı rolü: Uzman (Terapist) ve Danışan (Ebeveyn)
- Güvenli kayıt ve giriş sistemi
- JWT tabanlı kimlik doğrulama
- Profil yönetimi
- Tercih ve ayarlar (tema, bildirimler, dil seçenekleri)

### Ana Özellikler
1. **Günlük Aktivite Takibi**
   - Günlük rutin planlaması
   - Aktivite çizelgeleri
   - Davranış takibi

2. **Egzersiz Programı**
   - Özel eğitim aktiviteleri
   - Görsel destekli alıştırmalar
   - Bireyselleştirilmiş programlar

3. **Eğitici Oyunlar**
   - Sosyal beceri geliştirici oyunlar
   - İnteraktif öğrenme aktiviteleri
   - Ödül sistemi

4. **Gelişim Raporları**
   - Davranış analizi
   - İlerleme grafikleri
   - Dönemsel değerlendirmeler

5. **Forum**
   - Uzman paylaşımları
   - Aile deneyimleri
   - Soru-cevap bölümü

6. **Uzman Görüşmesi**
   - Online danışmanlık sistemi
   - Uzman profilleri ve müsaitlik takvimi
   - Randevu planlama ve takip sistemi
   - Randevu değerlendirme ve puanlama

7. **Bildirim Sistemi**
   - Randevu bildirimleri
   - Mesaj bildirimleri
   - Sistem bildirimleri
   - Bildirim tercihleri yönetimi

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
- Bildirim sistemi

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
- GET /api/users/experts - Uzman listesi
- PUT /api/users/expert-profile - Uzman profili güncelleme

### Aktivite Yönetimi
- GET /api/activities - Aktivite listesi
- POST /api/activities - Yeni aktivite ekleme
- PUT /api/activities/:id - Aktivite güncelleme

### Eğitim Programı
- GET /api/exercises - Aktivite listesi
- GET /api/exercises/:id - Aktivite detayı

### Forum
- GET /api/forum/posts - Forum gönderileri
- POST /api/forum/posts - Yeni gönderi oluşturma
- GET /api/forum/posts/:id - Gönderi detayı

### Uzman Görüşmesi
- GET /api/appointments - Görüşme listesi
- POST /api/appointments - Görüşme talebi oluşturma
- PUT /api/appointments/:id - Görüşme güncelleme
- PUT /api/appointments/:id/cancel - Görüşme iptali
- PUT /api/appointments/:id/confirm - Görüşme onayı
- PUT /api/appointments/:id/rate - Görüşme değerlendirme

### Bildirimler
- GET /api/notifications - Bildirim listesi
- PUT /api/notifications/:id/read - Bildirimi okundu işaretle
- PUT /api/notifications/read-all - Tüm bildirimleri okundu işaretle

## Katkıda Bulunma

1. Bu repository'yi fork edin
2. Feature branch'i oluşturun (`git checkout -b feature/AmazingFeature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some AmazingFeature'`)
4. Branch'inizi push edin (`git push origin feature/AmazingFeature`)
5. Pull Request oluşturun

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.

## İletişim

Proje Sahibi - [@Hiraete](https://github.com/Hiraete)

Proje Linki: [https://github.com/Hiraete/KielApp](https://github.com/Hiraete/KielApp) 