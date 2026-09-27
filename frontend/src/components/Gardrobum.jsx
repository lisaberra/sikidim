import React, { useState, useRef } from 'react';
import { Search, Plus, Trash2, X, Image as ImageIcon, Camera, Loader2, Bot } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { removeBackground } from '@imgly/background-removal';

const CATEGORIES = ['Tümü', 'Üst', 'Alt', 'Elbise', 'Dış', 'Ayakkabı', 'Aksesuar'];

/* Mock Vision Doğrulama: görselin kıyafet olup olmadığını kontrol eder */
function validateClothingImage(base64str) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const size = 50;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, size, size);
      const data = ctx.getImageData(0, 0, size, size).data;

      // Ortalama parlaklık hesapla
      let totalBrightness = 0;
      for (let i = 0; i < data.length; i += 4) {
        totalBrightness += (data[i] + data[i + 1] + data[i + 2]) / 3;
      }
      const avgBrightness = totalBrightness / (size * size);

      // Çok karanlık (<40) veya çok küçük görsel kontrolü
      if (avgBrightness < 40) {
        resolve({ valid: false, reason: 'Görsel çok karanlık. Lütfen iyi aydınlatılmış bir kıyafet fotoğrafı yükleyin.' });
        return;
      }
      if (img.width < 100 || img.height < 100) {
        resolve({ valid: false, reason: 'Görsel çok küçük. Lütfen daha yüksek çözünürlüklü bir fotoğraf yükleyin.' });
        return;
      }

      // En/boy oranı kontrolü (çok aşırı panoramik/çizgi değilse OK)
      const ratio = img.width / img.height;
      if (ratio > 4 || ratio < 0.25) {
        resolve({ valid: false, reason: 'Görsel oranı uygun değil. Lütfen net ve sadece bir kıyafet içeren bir fotoğraf yükleyin.' });
        return;
      }

      resolve({ valid: true });
    };
    img.onerror = () => resolve({ valid: false, reason: 'Görsel yüklenemedi.' });
    img.src = base64str;
  });
}

export default function Gardrobum({ wardrobe, onAdd, onDelete, onPreview, API_URL }) {
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('Tümü');
  const [showModal, setShowModal] = useState(false);
  const fileRef = useRef(null);
  const [detecting, setDetecting] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null); // Custom delete modal state

  /* Modal form state */
  const [form, setForm] = useState({ name: '', category: 'Üst', color: '', image: '', season: 'Dört Mevsim' });

    /* AI Auto-Detect: send image to backend for isolation and analysis */
  const handleFile = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    
    setDetecting(true);
    toast.loading("Yapay Zeka kıyafeti temizliyor ve analiz ediyor...", { id: "process-cloth" });
    
    const formData = new FormData();
    formData.append("file", f);

    try {
      const res = await fetch(`${API_URL}/api/v1/process-clothing`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await res.json();
      
      if (data.status === "success") {
        const meta = data.metadata || {};
        
        if (meta.is_clothing === false) {
          toast.error(meta.bibble_warning || "Bibble diyor ki: Bu bir kıyafet değil! Lütfen geçerli bir kıyafet yükle.", { id: "process-cloth", duration: 5000 });
          return;
        }

        const newItem = {
          name: meta.isim || meta.name || 'Bilinmeyen Kıyafet',
          category: meta.ana_kategori || meta.category || 'Üst',
          sub_category: meta.sub_category || '',
          color: meta.renk || meta.color || 'Bilinmiyor',
          season: meta.mevsim || meta.season || 'Dört Mevsim',
          style: meta.style || '',
          fabric: meta.fabric || '',
          image: data.image_base64
        };
        
        // Tek tıkla otomatik kaydet!
        onAdd(newItem);
        setShowModal(false);
        toast.success('Kıyafet yapay zeka ile eklendi! ✨', { id: "process-cloth" });
      } else {
        toast.error('Analiz başarısız oldu.', { id: "process-cloth" });
      }
    } catch (err) {
      console.error(err);
      toast.error('Bağlantı hatası. Lütfen API ayarlarını kontrol edin.', { id: "process-cloth" });
    } finally {
      setDetecting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.image) return toast.error('Lütfen bir görsel yükleyin!');
    onAdd(form);
    setForm({ name: '', category: 'Üst', color: '', image: '', season: 'Dört Mevsim' });
    setShowModal(false);
    toast.success('Kıyafet başarıyla gardroba eklendi!');
  };

  const filtered = wardrobe.filter(i => {
    const m1 = catFilter === 'Tümü' || i.category === catFilter;
    const m2 = !search || i.name?.toLowerCase().includes(search.toLowerCase()) || i.color?.toLowerCase().includes(search.toLowerCase());
    return m1 && m2;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-serif text-3xl font-bold text-kahve-600">Gardırobum</h2>
          <p className="text-sm text-kahve-400 mt-0.5">{wardrobe.length} parça kıyafet</p>
        </div>

        <button onClick={() => setShowModal(true)} className="btn-primary text-base px-6 py-3 shadow-glow">
          <Plus className="w-5 h-5" />
          Görsel Ekle
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-kahve-300" />
          <input
            type="text"
            placeholder="Kıyafet veya renk ara..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCatFilter(c)}
              className={`shrink-0 px-4 py-2 rounded-2xl text-xs font-bold transition-all duration-200 ${catFilter === c
                  ? 'bg-kahve-600 text-white shadow-soft'
                  : 'bg-white text-kahve-400 border border-kahve-200/50 hover:bg-cream hover:text-kahve-600'
                }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="card p-16 text-center space-y-3">
          <ImageIcon className="mx-auto w-12 h-12 text-pudra-300" />
          <p className="font-bold text-kahve-500">Eşleşen kıyafet bulunamadı</p>
          <p className="text-xs text-kahve-400">Filtre veya arama kriterlerinizi değiştirin.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4">
          {filtered.map(item => (
            <div
              key={item.id}
              className="card overflow-hidden group cursor-pointer"
              onClick={() => onPreview(item)}
            >
              <div className="aspect-[3/4] bg-cream overflow-hidden relative">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-kahve-600 text-[10px] font-bold px-2.5 py-1 rounded-xl shadow-soft border border-kahve-100/50">
                  {item.category}
                </span>
                {onDelete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setItemToDelete(item);
                    }}
                    className="absolute top-2 right-2 p-2 bg-red-50 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-500 hover:text-white shadow-sm"
                    title="Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="p-3 space-y-0.5">
                <h4 className="font-bold text-sm text-kahve-600 truncate">{item.name}</h4>
                <div className="flex justify-between text-xs text-kahve-400">
                  <span>{item.color}</span>
                  <span className="text-suyesil-500 font-semibold">{item.season}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Modal: Görsel Ekle ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-pudra-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h3 className="font-serif text-xl font-bold text-kahve-600">Gardıroba Kıyafet Ekle</h3>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-cream text-kahve-400 hover:text-kahve-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              {/* File Upload */}
              <div 
                className="border-2 border-dashed border-kahve-200 rounded-2xl p-8 text-center bg-cream flex flex-col items-center justify-center cursor-pointer hover:bg-suyesil-50 transition-colors" 
                onClick={() => fileRef.current?.click()}
              >
                {form.image ? (
                  <div className="relative w-full aspect-[3/4]">
                    <img src={form.image} alt="Preview" className="w-full h-full object-contain rounded-xl" />
                    <button type="button" onClick={(e) => { e.stopPropagation(); setForm({ name: '', category: 'Üst', color: '', image: '', season: 'Dört Mevsim' }) }} className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full shadow-sm hover:bg-kiremit-50 hover:text-kiremit-600 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    {detecting ? (
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-12 h-12 text-suyesil-500 animate-spin" />
                        <p className="text-sm font-bold text-kahve-600">Arka plan siliniyor ve analiz ediliyor...</p>
                        <p className="text-xs text-kahve-400">Yapay Zeka (Vision AI) çalışıyor.</p>
                      </div>
                    ) : (
                      <>
                        <div className="w-16 h-16 rounded-full bg-suyesil-100 flex items-center justify-center text-suyesil-600 mb-4 shadow-inner">
                          <ImageIcon className="w-8 h-8" />
                        </div>
                        <p className="text-sm font-bold text-kahve-600">Görsel Yükle</p>
                        <p className="text-xs font-medium text-kahve-400 mt-2">Kıyafet fotoğrafını sürükle veya seç</p>
                      </>
                    )}
                  </>
                )}
                <input type="file" accept="image/*" className="hidden" ref={fileRef} onChange={handleFile} disabled={detecting} />
              </div>

              <div>
                <label className="block text-sm font-medium text-kahve-500 mb-1">Kıyafet Adı (Otomatik)</label>
                <input type="text" readOnly value={form.name} className="w-full px-4 py-3 rounded-xl border border-kahve-200 bg-kahve-50 text-kahve-600 focus:outline-none cursor-not-allowed" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input type="text" readOnly value={form.category} className="input-field bg-kahve-50 text-kahve-600 cursor-not-allowed" />
                <input type="text" readOnly value={form.color} className="input-field bg-kahve-50 text-kahve-600 cursor-not-allowed" />
              </div>

              <input type="text" readOnly value={form.season} className="input-field bg-kahve-50 text-kahve-600 cursor-not-allowed" />

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">İptal</button>
                <button type="submit" className="btn-primary flex-1">Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Custom Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-red-100 text-center space-y-5 transform transition-all scale-100">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500 mb-2">
              <Trash2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-kahve-600 mb-2">Silmek İstediğinize Emin Misiniz?</h3>
              <p className="text-sm text-kahve-400">
                <span className="font-bold text-kahve-600">{itemToDelete.name}</span> isimli kıyafet gardırobunuzdan kalıcı olarak silinecek.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => setItemToDelete(null)} 
                className="flex-1 py-3 px-4 rounded-xl font-bold text-kahve-500 bg-kahve-50 hover:bg-kahve-100 transition-colors"
              >
                İptal
              </button>
              <button 
                onClick={() => {
                  onDelete(itemToDelete.id);
                  setItemToDelete(null);
                  toast.success('Kıyafet silindi!');
                }} 
                className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 transition-colors shadow-glow"
              >
                Evet, Sil
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
