# 🚀 PLSM Login Sayfası - Kurulum Rehberi

## 📌 Gereksinimler

Başlamadan önce bilgisayarınızda bunların yüklü olması lazım:
- **Node.js** (18 veya üstü) → https://nodejs.org/
- Bir kod editörü (VS Code öneriyorum) → https://code.visualstudio.com/

## 📦 Adım 1: Proje Klasörünü Aç

1. `plsm` klasörünü bilgisayarınızda istediğiniz yere kopyalayın
2. VS Code'u açın
3. VS Code'da: `File` → `Open Folder` → `plsm` klasörünü seçin

## ⚙️ Adım 2: Bağımlılıkları Yükle

VS Code'da terminal açın (`Terminal` → `New Terminal`) ve şu komutu çalıştırın:

```bash
npm install
```

Bu komut gerekli tüm paketleri indirecek (React, Electron, TypeScript vs.). İlk seferde 2-3 dakika sürebilir.

## ▶️ Adım 3: Uygulamayı Çalıştır

Terminal'de şu komutu yazın:

```bash
npm run dev
```

Bu komut:
1. React uygulamasını başlatacak (http://localhost:5173)
2. Electron penceresini otomatik açacak
3. Login sayfası Electron penceresinde görünecek

✅ Başarılı! Login sayfanız çalışıyor!

## 🔧 Backend Bağlantısı İçin

Backend ekibi API'yi hazırladığında, sadece 1 dosyayı düzenlemeniz gerekiyor:

### Dosya: `src/components/Login.tsx`

Dosyanın en üstünde bu satırı bulun:

```typescript
const API_URL = 'http://localhost:3000/api/auth/login';
```

Backend ekibinin verdiği URL ile değiştirin, örneğin:

```typescript
const API_URL = 'http://192.168.1.100:5000/api/auth/login';
```

Kaydedin, sayfa otomatik yenilenecek!

## 📝 Backend'e Gönderilen Veri

Login butonuna tıkladığınızda, backend'e şu şekilde JSON gönderiliyor:

```json
{
  "email": "kullanici@email.com",
  "password": "sifre123"
}
```

## 📨 Backend'den Beklenen Cevap

Backend başarılı login için şunu dönmeli:

```json
{
  "token": "jwt-token-buraya",
  "user": {
    "id": "123",
    "email": "kullanici@email.com",
    "name": "Kullanıcı Adı"
  }
}
```

Hata durumunda (401 veya 400):

```json
{
  "message": "Hata mesajı buraya"
}
```

## 🛠️ Geliştirme İpuçları

### Console'da Hata Kontrolü

Electron penceresinde sağ tık → `Inspect Element` → `Console` sekmesi
Burada tüm hatalar ve log mesajları görünür.

### Kod Değişikliklerini Görmek

Herhangi bir `.tsx` veya `.css` dosyasını değiştirip kaydettiğinizde sayfa otomatik yenilenir.

### Uygulamayı Kapatmak

Terminal'de `Ctrl + C` tuşuna basın.

## 🎨 Tasarımı Değiştirmek

Login sayfasının görünümünü değiştirmek için:

**Dosya:** `src/components/Login.css`

Örnek değişiklikler:
- Renkleri değiştirmek: `.login-background` içindeki gradient değerlerini değiştir
- Buton rengini değiştirmek: `.login-button` içindeki gradient değerlerini değiştir
- Yazı boyutlarını değiştirmek: `font-size` değerlerini değiştir

## 🐛 Sık Karşılaşılan Sorunlar

### "npm: command not found" hatası
→ Node.js yüklü değil. https://nodejs.org/ adresinden indirin.

### "Port 5173 already in use" hatası
→ Terminal'de `Ctrl + C` ile önceki uygulamayı kapatın, sonra tekrar `npm run dev` çalıştırın.

### Backend'e bağlanamıyorum
→ Backend çalışıyor mu? Backend ekibine sorun.
→ `API_URL` doğru mu? `src/components/Login.tsx` dosyasını kontrol edin.
→ CORS hatası mı? Backend ekibine CORS ayarlarını yapmasını söyleyin.

### Electron penceresi açılmıyor
→ Terminal'i kapatıp tekrar açın.
→ `npm install` komutunu tekrar çalıştırın.

## 📂 Proje Yapısı (Neyi Nerede Bulursun)

```
plsm/
├── src/
│   ├── components/
│   │   ├── Login.tsx      ← Login sayfası kodları
│   │   └── Login.css      ← Login sayfası stilleri
│   ├── App.tsx            ← Ana component
│   ├── main.tsx           ← React başlangıç
│   └── index.css          ← Genel stiller
├── electron/
│   ├── main.js            ← Electron ana dosya
│   └── preload.js         ← Electron preload
├── package.json           ← Proje ayarları
└── index.html             ← HTML template
```

## 📞 Yardım

Bir sorun yaşarsan:
1. Terminal'deki hata mesajını oku
2. Console'daki (F12) hata mesajını kontrol et
3. Google'da hata mesajını arat
4. Ekip arkadaşlarına sor

## ✅ Özet - Hızlı Başlangıç

```bash
# 1. Klasöre gir
cd plsm

# 2. Paketleri yükle (ilk seferde)
npm install

# 3. Çalıştır
npm run dev
```

Hepsi bu kadar! 🎉
