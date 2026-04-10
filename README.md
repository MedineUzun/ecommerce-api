# Wibesoft E-Ticaret API

## Proje Hakkında
Bu proje, NestJS kullanılarak geliştirilmiş bir e-ticaret arka uç (backend) hizmetidir. Gerçek dünyadaki bir e-ticaret platformunun ihtiyaç duyduğu temel özellikleri (kullanıcı kayıt/giriş, ürün listeleme ve yönetimi, sepet işlemleri ve sipariş oluşturma) tek bir çatı altında toplar.


## Kullanılan Teknolojiler
- **Altyapı**: NestJS
- **Dil**: TypeScript
- **Veritabanı**: MongoDB (Mongoose aracılığıyla)
- **Güvenlik / Kimlik Doğrulama**: JWT (JSON Web Tokens) & bcrypt
- **API Dokümantasyonu**: Swagger / OpenAPI
- **Veri Doğrulama (Validation)**: class-validator & class-transformer

##  Kurulum ve Çalıştırma

### 1. Projeyi İndirin
Projeyi bilgisayarınıza klonlayın ve klasörün içine girin:
```bash
git clone <repository-url>
cd wibesoft
```

### 2. Gerekli Paketleri Yükleyin
Node.js bağımlılıklarını kurmak için:
```bash
npm install
```

### 3. Çevre Değişkenleri (Environment) Ayarları
Projenin çalışması için veritabanı şifreleri gibi bilgilerin girilmesi gerekir. `.env.example` dosyasının bir kopyasını oluşturup adını `.env` yapın:
```bash
cp .env.example .env
```
Ardından bu dosyanın içine girip kendi `MONGODB_URI` adresinizi (Örn: MongoDB Atlas bağlantınız) ve bir `JWT_SECRET` (rastgele şifreleme anahtarı) bilginizi ekleyin.

### 4. Uygulamayı Başlatın
Tercihinize göre projeyi aşağıdaki komutlardan biriyle başlatabilirsiniz:
```bash
# Geliştirici modu (Kod değiştikçe otomatik yenilenir)
npm run start:dev

# Standart çalıştırma
npm run start

# Canlı (Production) modu
npm run start:prod
```

##  API Kullanım Şeması (Endpoints)

| Modül      | HTTP Metodu | Uç Nokta (Endpoint)    | Ne İşe Yarar?                             | Yetki Gerekli mi? |
|------------|-------------|------------------------|-------------------------------------------|-------------------|
| **Kimlik** | POST        | `/api/auth/register`   | Yeni bir kullanıcı kaydı oluşturur.       | Hayır             |
|            | POST        | `/api/auth/login`      | Mevcut kullanıcı için giriş yapar.        | Hayır             |
|            | GET         | `/api/auth/profile`    | Sisteme giren kullanıcının bilgilerini döner.| Evet            |
| **Ürünler**| GET         | `/api/products`        | Ürünleri sayfalı ve aramalı listeler.     | Hayır             |
|            | GET         | `/api/products/:id`    | Sadece tek bir ürünün detaylarını verir.  | Hayır             |
|            | POST        | `/api/products`        | Veritabanına yeni bir ürün ekler.         | Evet              |
|            | PATCH       | `/api/products/:id`    | Eklilen bir ürünü günceller.              | Evet              |
|            | DELETE      | `/api/products/:id`    | Eklilen bir ürünü siler.                  | Evet              |
| **Sepet**  | GET         | `/api/cart`            | Aktif kullanıcının/oturumun sepetini getirir.| Hayır/Evet      |
|            | POST        | `/api/cart/items`      | Sepete yeni bir ürün ekler.               | Hayır/Evet        |
|            | PATCH       | `/api/cart/items/:id`  | Sepetteki ürünün miktarını (adet) değiştirir.| Hayır/Evet     |
|            | DELETE      | `/api/cart/items/:id`  | Belirli bir ürünü sepetten tamamen çıkartır.| Hayır/Evet      |
|            | DELETE      | `/api/cart`            | Sepetin içini tamamen boşaltır.           | Hayır/Evet        |
| **Sipariş**| POST        | `/api/orders`          | Sepetteki işlemi bitirip siparişe dönüştürür.| Evet            |
|            | GET         | `/api/orders`          | Kullanıcının tüm eski/yeni siparişlerini listeler.| Evet         |
|            | GET         | `/api/orders/:id`      | Belirli bir siparişin detaylı faturasını gösterir.| Evet         |

Tüm bunları doğrudan tarayıcınızdan interaktif şekilde test etmek isterseniz projeyi ayağa kaldırdıktan sonra `http://localhost:3000/api/docs` (Swagger) adresine gidebilirsiniz.

## Ekstra Özellikler
- **Standart Yanıtlar ve Hatalar**: Başarılı dönen veriler veya hatalar her zaman tahmin edilebilir bir formatta (`success`, `data`, `statusCode` vb.) döner. 
- **Sistem İzi (Logging)**: Kritik işlemler (Sepete ürün atılması, sipariş tamamlanması vb.) arka planda kaydedilir.
- **Transaction Desteği**: Mongoose Session kullanılarak sipariş oluşturulurken ürünlerin stoktan düşmesi ve sepetin silinmesi işlemi, ikisinden birinde sorun çıkarsa geri alınacak şekilde tasarlanmıştır.

## Notlar
1. **Kullanıcı Yetkileri**: Projede  "Admin / Müşteri" rol dağılımı (RBAC) yoktur. 
2. **Ödeme Altyapısı**: E-ticaret siparişleri "beklemede (pending)" olarak sisteme kaydedilir. Kredi kartı tahsilatı yapan iyzico, Stripe gibi sanal POS entegrasyonlarına hazır olarak kurgulanmıştır.
