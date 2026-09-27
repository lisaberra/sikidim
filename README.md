# Şımarık - Yapay Zeka Destekli Stil Danışmanı 👗✨

Şımarık, gardırobunuzdaki kıyafetleri analiz eden, arka planlarını temizleyen ve size en uygun kombinleri yapay zeka (Google Gemini) desteğiyle sunan yeni nesil bir stil danışmanlık uygulamasıdır.

## 🌟 Özellikler
- **Kıyafet Analizi:** Yüklediğiniz kıyafetlerin arka planını temizler ve beyaz fon üzerine alır.
- **Yapay Zeka Destekli Etiketleme:** Kıyafetlerin rengini, türünü, kumaşını ve tarzını Gemini AI ile otomatik olarak tanır.
- **Akıllı Kombin Önerileri:** Gardırobunuzdaki parçalarla hava durumuna, gideceğiniz mekana veya ruh halinize uygun kombinler oluşturur.
- **Şarkıya Göre Kombin:** Dinlediğiniz müziğin vibe'ına uygun kombin önerileri alın.
- **Bibble AI Asistanı:** Barbie Fairytopia'nın sevimli Bibble'ı sizin kişisel stil danışmanınız! Kanat çırparak uçar, tepki verir ve size uygun kombinler önerir.
- **Modern Arayüz:** Kullanıcı dostu, şık ve tepkisel (responsive) tasarım.

## 🛠️ Teknolojiler
- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** FastAPI, Python
- **Yapay Zeka:** Google Gemini AI Model (Flash serisi)

## 🚀 Kurulum

### Backend (Python / FastAPI)
1. `backend` klasörüne gidin.
2. Gerekli kütüphaneleri yükleyin: `pip install -r requirements.txt`
3. `.env` dosyası oluşturup içine `GEMINI_API_KEY` değişkeninizi ekleyin.
4. Sunucuyu başlatın: `uvicorn main:app --reload`
5. **API Dokümantasyonu:** Sunucu çalıştıktan sonra [http://localhost:8000/docs](http://localhost:8000/docs) adresinden backend'e ulaşabilirsiniz.

### Frontend (React / Vite)
1. `frontend` klasörüne gidin.
2. Bağımlılıkları yükleyin: `npm install`
3. Geliştirme sunucusunu başlatın: `npm run dev`
4. **Uygulama Arayüzü:** Uygulama başladığında [http://localhost:3000](http://localhost:3000) adresine giderek arayüzü görüntüleyebilirsiniz.

---
*Bu proje lisaberra tarafından geliştirilmektedir.*
