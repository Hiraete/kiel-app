# KielApp Backend

KielApp'in backend servisi, Node.js ve TypeScript kullanılarak geliştirilmiş RESTful API'dir.

## Özellikler

### Kullanıcı Yönetimi
- Uzman ve danışan kaydı
- Profil yönetimi
- Güvenli kimlik doğrulama
- Rol tabanlı yetkilendirme

### Mesajlaşma Sistemi
- Uzman ve danışanlar arası gerçek zamanlı mesajlaşma
- Mesaj okundu bildirimleri
- Mesaj geçmişi görüntüleme

### Profil Yönetimi
- Uzman profilleri (uzmanlık alanları, deneyim, değerlendirmeler)
- Danışan profilleri (çocuk bilgileri, terapi geçmişi)
- Profil fotoğrafı yükleme

### Terapi Takibi
- Terapi seansları planlama
- İlerleme takibi
- Notlar ve değerlendirmeler

## Teknik Detaylar

### Kullanılan Teknolojiler
- Node.js
- Express.js
- MongoDB
- TypeScript
- JWT Authentication
- RESTful API

### API Endpoint'leri

#### Kullanıcı İşlemleri
- `POST /api/users/register` - Yeni kullanıcı kaydı
- `POST /api/users/login` - Kullanıcı girişi
- `GET /api/users/profile` - Profil bilgileri
- `PUT /api/users/profile` - Profil güncelleme

#### Mesajlaşma
- `GET /api/chat/messages/:receiverId` - Mesajları getir
- `POST /api/chat/send` - Yeni mesaj gönder
- `PUT /api/chat/read/:senderId` - Mesajları okundu olarak işaretle

## Kurulum

1. Gerekli paketleri yükleyin:
```bash
npm install
```

2. `.env` dosyasını oluşturun:
```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
```

3. Uygulamayı başlatın:
```bash
npm run dev
```

## Proje Yapısı

```
backend/
├── src/
│   ├── controllers/     # API controller'ları
│   ├── models/          # MongoDB modelleri
│   ├── routes/          # API route'ları
│   ├── middleware/      # Middleware fonksiyonları
│   ├── types/           # TypeScript tip tanımlamaları
│   └── app.ts           # Ana uygulama dosyası
├── package.json
├── tsconfig.json
└── README.md
```

## Katkıda Bulunma

1. Bu repository'yi fork edin
2. Yeni bir branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## İletişim

Proje Yöneticisi - [@emirc](https://github.com/emirc)

Proje Linki: [https://github.com/emirc/KielApp](https://github.com/emirc/KielApp) 