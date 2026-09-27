# Şıkıdım - Yapay Zeka Destekli Stil Danışmanı 👗✨

Şıkıdım, gardırobunuzdaki kıyafetleri analiz eden, arka planlarını temizleyen ve size en uygun kombinleri yapay zeka (Google Gemini) desteğiyle sunan yeni nesil bir stil danışmanlık uygulamasıdır.

## 🌟 Özellikler
- **Kıyafet Analizi:** Yüklediğiniz kıyafetlerin arka planını temizler ve beyaz fon üzerine alır.
- **Yapay Zeka Destekli Etiketleme:** Kıyafetlerin rengini, türünü, kumaşını ve tarzını Gemini AI ile otomatik olarak tanır.
- **Akıllı Kombin Önerileri:** Gardırobunuzdaki parçalarla hava durumuna, gideceğiniz mekana veya ruh halinize uygun kombinler oluşturur.
- **Modern Arayüz:** Kullanıcı dostu, şık ve tepkisel (responsive) tasarım.

## 🛠️ Teknolojiler
- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** FastAPI, Python
- **Yapay Zeka:** Google Gemini AI Model (Flash & Lite serisi)

## 🚀 Kurulum

### Backend (Python / FastAPI)
1. `backend` klasörüne gidin.
2. Gerekli kütüphaneleri yükleyin: `pip install -r requirements.txt`
3. `.env` dosyası oluşturup içine `GEMINI_API_KEY` değişkeninizi ekleyin.
4. Sunucuyu başlatın: `uvicorn main:app --reload`

### Frontend (React / Vite)
1. `frontend` klasörüne gidin.
2. Bağımlılıkları yükleyin: `npm install`
3. Geliştirme sunucusunu başlatın: `npm run dev`

---
*Bu proje lisaberra tarafından geliştirilmektedir.*
