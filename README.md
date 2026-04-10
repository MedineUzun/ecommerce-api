# Wibesoft E-Ticaret API

## Proje Hakkında
Bu proje, NestJS kullanılarak geliştirilmiş bir e-ticaret backend hizmetidir. Gerçek dünyadaki bir e-ticaret platformunun ihtiyaç duyduğu temel özellikleri (kullanıcı kayıt/giriş, ürün listeleme ve yönetimi, sepet işlemleri ve sipariş oluşturma) tek bir çatı altında toplar.


## Kullanılan Teknolojiler
- **Altyapı**: NestJS
- **Dil**: TypeScript
- **Veritabanı**: MongoDB (Mongoose aracılığıyla)
- **Güvenlik / Kimlik Doğrulama**: JWT (JSON Web Tokens) & bcrypt
- **API Dokümantasyonu**: Swagger / OpenAPI
- **Veri Doğrulama (Validation)**: class-validator & class-transformer

## Kurulum ve Çalıştırma

Bu projeyi kendi bilgisayarınızda (lokalinizde) çalıştırmak için aşağıdaki adımları sırasıyla takip edin:

### 1. Projeyi Bilgisayarınıza İndirin

Projeyi indirmek için iki farklı yöntem kullanabilirsiniz:

**Git Kullanarak**
Eğer bilgisayarınızda Git yüklüyse, terminalinizi (veya komut satırınızı) açın ve şu komutu çalıştırarak projeyi klonlayın:
```bash
git clone https://github.com/MedineUzun/ecommerce-api.git
```
Klonlama tamamlandıktan sonra projenin klasörüne (ana dizine) girmek için şu komutu çalıştırın:
```bash
cd ecommerce-api
```

**ZIP Olarak İndirip Çıkartarak**
Eğer Git kullanmıyorsanız:
1. Projenin bulunduğu GitHub sayfasında sağ üstteki yeşil renkli **"Code"** butonuna tıklayın.
2. Açılan menüden **"Download ZIP"** seçeneğine tıklayın.
3. İnen ZIP dosyasını bilgisayarınızda çalışmak istediğiniz bir klasöre çıkartın.
4. Terminalinizi (veya komut satırını) açın ve çıkarttığınız klasörün bulunduğu konuma gelerek projenin içine girmek için şu komutu çalıştırın (İndirdiğiniz klasör adı muhtemelen `ecommerce-api-main` şeklinde olacaktır):
```bash
cd ecommerce-api-main
```

### 2. Gerekli Paketleri Yükleyin
Projenin ihtiyaç duyduğu Node.js kütüphanelerini kurmak için terminalinizde projeyi indirdiğiniz dizindeyken şu komutu çalıştırın:
```bash
npm install
```


### 3. Çevre Değişkenlerini Ayarlayın
Projenin veritabanına bağlanabilmesi ve güvenliği sağlayabilmesi için bazı özel ayarlar yapılmalıdır.

1. Proje klasörünüzün içinde `.env.example` isimli bir dosya göreceksiniz. Bu dosyanın bir kopyasını aynı yere çıkarın ve adını **`.env`** (başında nokta olacak şekilde) yapın.

2. Oluşturduğunuz `.env` dosyasını Not Defteri veya VS Code gibi bir kod editörüyle açarak kendi bilgilerinizi girin:

**`MONGODB_URI` - MongoDB Bağlantısı Nasıl Kopyalanır?**
- **Bulut Veritabanı (MongoDB Atlas) Kullanıyorsanız:**
  1. [mongodb.com](https://www.mongodb.com/) adresinden hesabınıza giriş yapın / projenizi kurun.
  2. Panelde **"Database"** veya **"Clusters"** bölümünden **"Connect"** (Bağlan) butonuna tıklayın.
  3. Çıkan ekranda **"Drivers"** (veya uygulamanızı bağlama) seçeneğini seçin.
  4. Alt kısımda size verilen bağlantı cümlesini kopyalayın. Şöyle görünmelidir: 
     `mongodb+srv://KULLANICI_ADINIZ:SIFRENIZ@cluster0.abcde.mongodb.net/wibesoft?retryWrites=true&w=majority`
  5. Kopyaladığınız bu metni `env` dosyasında `MONGODB_URI=` eşittir işaretinden hemen sonraya yapıştırın. *Linkte `<password>` yazan yeri silip kendi veritabanı şifrenizi eklemeyi unutmayın!*
     > **Önemli Not:** Bağlantı linkindeki `wibesoft` kelimesi projenin adı değil, kurulacak olan **veritabanının ismidir**. Eğer veritabanınıza farklı bir isim verecekseniz, bağlantı adresindeki `wibesoft` kısmını veritabanı isminizle değiştirmelisiniz.
- **Kendi Bilgisayarınıza Kurulu MongoDB Kullanıyorsanız:**
  Bağlantı adresi genel olarak şu şekildedir:
  `MONGODB_URI=mongodb://127.0.0.1:27017/wibesoft`
  > **Önemli Not:** Buradaki `wibesoft` kısmı da bağlanılacak **veritabanının adını** temsil eder. Eğer kendi veritabanınızı farklı bir isimle oluşturacaksanız, bu kısmı ona göre güncelleyebilirsiniz.

**`JWT_SECRET` - Şifreleme Anahtarı**
Kullanıcı giriş işlemlerinde (token oluştururken) güvenlik için kullanılır. Buraya başkalarının tahmin edemeyeceği, tamamen rastgele karışık harf ve sayılardan oluşan bir metin yazın. 
Örnek: `JWT_SECRET=super_gizli_projem_icin_karma_isaret!`

### 4. Uygulamayı Başlatın
Hazırlıkları başarıyla bitirdiyseniz, projeyi ayağa kaldırmak için terminalde aşağıdaki komutlardan birini çalıştırabilirsiniz:
```bash
# Geliştirici modu önerilir (Kodda bir şeyi değiştirip kaydettiğinizde proje otomatik yeniden başlar)
npm run start:dev

# Standart şekilde çalıştırmak için
npm run start

# Canlı (Production) modunda çalıştırmak için
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
