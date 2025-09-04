# Node.js MongoDB İletişim Yönetim Uygulaması

Bu proje, Node.js ve MongoDB kullanarak geliştirilmiş bir iletişim yönetim uygulamasıdır. Kullanıcı kayıt/giriş sistemi, JWT token tabanlı kimlik doğrulama ve iletişim bilgileri yönetimi özelliklerini içerir.

## 🚀 Özellikler

- ✅ Kullanıcı kayıt ve giriş sistemi
- ✅ JWT token tabanlı kimlik doğrulama
- ✅ Bcrypt ile şifre hashleme
- ✅ Session yönetimi
- ✅ İletişim bilgileri CRUD işlemleri
- ✅ Kullanıcı bazlı veri izolasyonu
- ✅ RESTful API tasarımı
- ✅ Error handling ve validation
- ✅ MongoDB Atlas entegrasyonu

## 📋 Gereksinimler

- Node.js (v16+)
- MongoDB Atlas hesabı
- npm veya yarn

## 🛠️ Kurulum

### 1. Projeyi Klonlayın

```bash
git clone https://github.com/Okan-ozdemir/nodejs-hw-mongodb.git
cd nodejs-hw-mongodb
```

### 2. Bağımlılıkları Yükleyin

```bash
npm install
```

### 3. Environment Variables

`.env` dosyasını oluşturun ve aşağıdaki değişkenleri ekleyin:

```env
PORT=3000
MONGODB_USER=your_mongodb_username
MONGODB_PASSWORD=your_mongodb_password
MONGODB_URL=cluster0.xxxxx.mongodb.net
MONGODB_DB=contactsDB
JWT_SECRET=your_256_bit_jwt_secret
JWT_REFRESH_SECRET=your_256_bit_refresh_secret
```

### 4. Uygulamayı Başlatın

**Development mode:**

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

## 🧪 Test

```bash
# Tüm test'leri çalıştır
npm test

# Test'leri izle
npm run test:watch

# Coverage raporu
npm run test:coverage

# Linting
npm run lint
```

## 📚 API Dokümantasyonu

### Ana Endpoint

```
GET / - API bilgileri
```

### 🔐 Authentication Endpoints

#### Kullanıcı Kaydı

```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**

```json
{
  "status": 201,
  "message": "Successfully registered a user!",
  "data": {
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Kullanıcı Girişi

```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**

```json
{
  "status": 200,
  "message": "Successfully logged in an user!",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Token Yenileme

```http
POST /auth/refresh
Cookie: refreshToken=your_refresh_token
```

#### Çıkış

```http
POST /auth/logout
Authorization: Bearer your_access_token
```

### 👥 Contacts Endpoints

**Not:** Tüm contact endpoint'leri için `Authorization: Bearer <token>` header'ı gereklidir.

#### Tüm İletişim Bilgilerini Listele

```http
GET /contacts?page=1&perPage=10&sortBy=name&sortOrder=asc&type=work&isFavourite=true
Authorization: Bearer your_access_token
```

**Response (200):**

```json
{
  "status": 200,
  "message": "Successfully found contacts!",
  "data": {
    "data": [...],
    "page": 1,
    "perPage": 10,
    "totalItems": 25,
    "totalPages": 3,
    "hasPreviousPage": false,
    "hasNextPage": true
  }
}
```

#### İletişim Bilgisi Oluştur

```http
POST /contacts
Authorization: Bearer your_access_token
Content-Type: application/json

{
  "name": "Jane Smith",
  "phoneNumber": "+1234567890",
  "email": "jane@example.com",
  "contactType": "personal",
  "isFavourite": false
}
```

#### İletişim Bilgisini Güncelle

```http
PATCH /contacts/:contactId
Authorization: Bearer your_access_token
Content-Type: application/json

{
  "name": "Jane Smith Updated",
  "phoneNumber": "+0987654321"
}
```

#### İletişim Bilgisini Sil

```http
DELETE /contacts/:contactId
Authorization: Bearer your_access_token
```

## 🔧 Query Parameters

### Contacts Listeleme

- `page`: Sayfa numarası (varsayılan: 1)
- `perPage`: Sayfa başına öğe sayısı (varsayılan: 10)
- `sortBy`: Sıralama alanı (name, email, phoneNumber, createdAt)
- `sortOrder`: Sıralama yönü (asc, desc)
- `type`: İletişim tipi filtresi (work, home, personal)
- `isFavourite`: Favori filtresi (true, false)

## 📊 Veritabanı Şeması

### User Model

```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Session Model

```javascript
{
  userId: ObjectId (ref: User, required),
  accessToken: String (required),
  refreshToken: String (required),
  accessTokenValidUntil: Date (required),
  refreshTokenValidUntil: Date (required)
}
```

### Contact Model

```javascript
{
  name: String (required),
  phoneNumber: String (required),
  email: String,
  isFavourite: Boolean (default: false),
  contactType: String (enum: work/home/personal, required),
  userId: ObjectId (ref: User, required),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔒 Güvenlik

- **JWT Token'ları**: 256-bit secret'lar ile şifrelenmiş
- **Şifre Hashleme**: bcrypt ile 10 salt rounds
- **Token Süreleri**: Access (15dk), Refresh (30 gün)
- **Session Yönetimi**: Eski session'lar otomatik silinir
- **User Isolation**: Kullanıcılar sadece kendi verilerine erişebilir

## 🚀 Deployment

### Render.com

1. GitHub repository'nizi bağlayın
2. Branch olarak `hw5-auth` seçin
3. Environment variables'ları ekleyin
4. Build Command: `npm install`
5. Start Command: `npm start`

## 📝 Scripts

```json
{
  "start": "node src/index.js",
  "dev": "nodemon src/index.js",
  "test": "cross-env NODE_ENV=test jest",
  "test:watch": "cross-env NODE_ENV=test jest --watch",
  "test:coverage": "cross-env NODE_ENV=test jest --coverage",
  "lint": "eslint src/**/*.js",
  "lint:fix": "eslint src/**/*.js --fix"
}
```

## 🏗️ Proje Yapısı

```
src/
├── controllers/
│   ├── auth.js
│   └── contacts.js
├── db/
│   ├── User.js
│   ├── Session.js
│   ├── Contact.js
│   └── initMongoConnection.js
├── middlewares/
│   ├── authenticate.js
│   ├── errorHandler.js
│   ├── isValidId.js
│   ├── notFoundHandler.js
│   └── validateBody.js
├── routers/
│   ├── auth.js
│   └── contacts.js
├── schemas/
│   ├── auth.js
│   └── contact.js
├── services/
│   ├── auth.js
│   └── contacts.js
├── utils/
│   └── ctrlWrapper.js
├── index.js
└── server.js
```

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

- **GitHub**: [Okan-ozdemir](https://github.com/Okan-ozdemir)
- **LinkedIn**: [Okan Özdemir](https://linkedin.com/in/okan-ozdemir)

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!
