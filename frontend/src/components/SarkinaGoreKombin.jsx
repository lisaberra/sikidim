import React, { useState, useMemo } from 'react';
import { Music, Sparkles, RefreshCw, CheckCircle2, Lock, Mic2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import BibbleCharacter from './BibbleCharacter';

// Basit offline etiketleme (fallback)
function detectMood(text) {
  const lower = text.toLowerCase();
  const moods = [
    { keyword: 'rock', mood: 'Asi & Grunge', colors: ['Siyah', 'Kırmızı', 'Gri'], style: 'Grunge' },
    { keyword: 'pop', mood: 'Canlı & Renkli', colors: ['Pembe', 'Sarı', 'Beyaz'], style: 'Casual' },
    { keyword: 'slow', mood: 'Romantik', colors: ['Bordo', 'Krem', 'Pudra'], style: 'Şık' },
    { keyword: 'jazz', mood: 'Klasik & Şık', colors: ['Siyah', 'Altın', 'Zümrüt'], style: 'Klasik' },
    { keyword: 'indie', mood: 'Bohem', colors: ['Kahverengi', 'Hardal', 'Haki'], style: 'Bohem' }
  ];
  for (let { keyword, ...data } of moods) {
    if (lower.includes(keyword)) return data;
  }
  return { mood: 'Sofistike', colors: ['Siyah', 'Beyaz', 'Bej'], style: 'Klasik' };
}

function getDateKey() {
  return new Date().toISOString().slice(0, 10);
}

export default function SarkinaGoreKombin({ wardrobe, combos = [], onAddCombo, API_URL }) {
  const [song, setSong] = useState('');
  const [artist, setArtist] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const usageCount = useMemo(() => {
    const lastUseDate = localStorage.getItem('bng_song_combo_date');
    if (lastUseDate !== getDateKey()) {
      localStorage.setItem('bng_song_combo_count', '0');
      return 0;
    }
    return parseInt(localStorage.getItem('bng_song_combo_count') || '0', 10);
  }, []);

  const [usedCount, setUsedCount] = useState(usageCount);
  const maxUses = 5; // Limiti 5 yaptık

  const generate = async () => {
    if (!song.trim()) return;

    if (usedCount >= maxUses) {
      toast.error(`Bu özelliği günde en fazla ${maxUses} kez kullanabilirsiniz!`);
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const prompt = `Dinlediğim şu şarkının HİSSİYATINI, TÜRÜNÜ (pop, rock, indie vb.), DÖNEMİNİ ve SANATÇISININ STİLİNİ (temposunu, akor yapısını) detaylıca analiz et ve buna uygun derinlemesine bir kombin öner:\nŞarkı: "${song}"\nSanatçı: "${artist || 'Belirtilmedi'}"`;
      
      const res = await fetch(`${API_URL}/api/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, wardrobe: wardrobe }),
      });
      if(!res.ok) throw new Error();
      const data = await res.json();
      
      const moodColors = data.color_palette && data.color_palette.length > 0 ? data.color_palette : ['Siyah', 'Beyaz'];
      
      const combo = {
        title: `🎵 ${song.slice(0, 20)} Kombini`,
        top: data.top_item,
        bottom: data.bottom_item,
        shoes: data.shoes_item,
        outer: data.outer_item,
        accessory: data.accessory_item,
        mood: data.title || "Müzikal Vibe",
        moodColors: moodColors,
        reasoning: data.reasoning,
        bibbleMood: data.bibble_mood || 'cool'
      };

      setResult(combo);
      
      const newCount = usedCount + 1;
      localStorage.setItem('bng_song_combo_date', getDateKey());
      localStorage.setItem('bng_song_combo_count', newCount.toString());
      setUsedCount(newCount);
    } catch (e) {
      toast.error("Yapay zeka şu an şarkıyı analiz edemedi, basit mod kullanılıyor.");
      const mood = detectMood(song + ' ' + artist);
      const matchingItems = wardrobe.filter(item =>
        mood.colors.includes(item.color) || item.style === mood.style
      );
      const pick = (cat) => {
        const filtered = matchingItems.filter(i => i.category === cat || i.category === `${cat} Giyim`);
        if (filtered.length === 0) return wardrobe.filter(i => i.category === cat || i.category === `${cat} Giyim`)[0] || null;
        return filtered[Math.floor(Math.random() * filtered.length)];
      };
      
      setResult({
        title: `🎵 ${song.slice(0, 20)} Kombini`,
        top: pick('Üst'), bottom: pick('Alt'), shoes: pick('Ayakkabı'), outer: pick('Dış'), accessory: pick('Aksesuar'),
        mood: mood.mood, moodColors: mood.colors, reasoning: "Çevrimdışı mod: Basit etiket eşleştirme.",
        bibbleMood: 'saskin'
      });
      
      const newCount = usedCount + 1;
      localStorage.setItem('bng_song_combo_date', getDateKey());
      localStorage.setItem('bng_song_combo_count', newCount.toString());
      setUsedCount(newCount);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <BibbleCharacter
          mood={result ? result.bibbleMood : 'idle'}
          size="lg"
          flying={!result}
          showReaction={!!result}
          reactionText={result ? 'Bu şarkının tarzı tam senlik!' : ''}
        />
        <div>
          <h2 className="font-serif text-3xl font-bold text-kahve-600 flex items-center gap-2">
            <Music className="w-8 h-8 text-pudra-400" /> Şarkıya Göre Kombin
          </h2>
          <p className="text-sm text-kahve-400 mt-0.5">Dinlediğin müziğin ritmi ve stili gardırobuna yansısın.</p>
        </div>
      </div>

      {usedCount >= maxUses && !result && (
        <div className="bg-pudra-50 border border-pudra-200 rounded-2xl p-4 flex items-center gap-3">
          <Lock className="w-5 h-5 text-pudra-500 shrink-0" />
          <div>
            <p className="text-sm font-bold text-pudra-600">Günlük hakkınızı kullandınız</p>
            <p className="text-xs text-kahve-400">Bu özelliği günde en fazla {maxUses} kez kullanabilirsiniz. Yarın tekrar deneyin!</p>
          </div>
        </div>
      )}

      <div className="card p-6 space-y-4 shadow-xl border-t-4 border-t-pudra-400 bg-white/80 backdrop-blur-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Music className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-pudra-500" />
            <input
              type="text"
              value={song}
              onChange={e => setSong(e.target.value)}
              placeholder="Şarkı Adı (Örn: Bohemian Rhapsody)"
              className="input-field pl-10"
              disabled={(usedCount >= maxUses) && result === null}
            />
          </div>
          <div className="relative">
            <Mic2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-pudra-500" />
            <input
              type="text"
              value={artist}
              onChange={e => setArtist(e.target.value)}
              placeholder="Sanatçı (İsteğe bağlı, ama daha iyi sonuç verir)"
              className="input-field pl-10"
              disabled={(usedCount >= maxUses) && result === null}
            />
          </div>
        </div>

        <button
          onClick={generate}
          disabled={loading || (usedCount >= maxUses && result === null) || !song.trim()}
          className="btn-primary w-full py-3 text-base bg-gradient-to-r from-pudra-400 to-purple-400 shadow-md"
        >
          {loading
            ? <><RefreshCw className="w-5 h-5 animate-spin" /> Şarkı Analiz Ediliyor...</>
            : <><Sparkles className="w-5 h-5" /> Şarkının Vibe'ını Yakala</>
          }
        </button>
      </div>

      {result && (
        <div className="card p-6 border-2 border-pudra-300 space-y-5 animate-slide-up bg-gradient-to-br from-white to-pudra-50/30 shadow-2xl">
          <div className="flex justify-between items-start">
            <div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-200 shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5" /> Müzikal Stil: {result.mood}
              </span>
              <h3 className="font-serif text-2xl font-bold text-kahve-600 mt-3">{result.title}</h3>
              {artist && <p className="text-sm font-semibold text-kahve-400 mt-1">by {artist}</p>}
            </div>
            <div className="flex gap-1.5 flex-wrap justify-end max-w-[120px]">
              {result.moodColors.map((c, i) => (
                <span key={i} className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-kahve-200 text-kahve-600 font-bold shadow-sm">{c}</span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { label: 'Üst', item: result.top },
              { label: 'Alt', item: result.bottom },
              { label: 'Dış', item: result.outer },
              { label: 'Ayakkabı', item: result.shoes },
              { label: 'Aksesuar', item: result.accessory },
            ].map((slot, i) => (
              <div key={i} className="bg-white rounded-2xl p-2.5 border border-kahve-100 shadow-soft flex flex-col">
                <span className="text-[10px] font-bold text-kahve-400 block mb-2">{slot.label}</span>
                {slot.item ? (
                  <>
                    <div className="aspect-square rounded-xl overflow-hidden bg-cream mb-2 flex items-center justify-center p-1">
                      <img src={slot.item.image || slot.item.image_url} alt={slot.item.name} className="max-w-full max-h-full object-contain drop-shadow-sm" />
                    </div>
                    <p className="font-bold text-xs text-kahve-600 truncate mt-auto">{slot.item.name}</p>
                  </>
                ) : (
                  <div className="aspect-square rounded-xl bg-cream border border-dashed border-kahve-200 flex items-center justify-center text-[10px] text-kahve-300">
                    Eksik
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-purple-50/70 p-5 rounded-2xl border border-purple-200 shadow-inner">
            <p className="text-sm text-kahve-700 italic font-medium flex gap-2">
              <span className="text-xl">🎵</span> "{result.reasoning}"
            </p>
          </div>

          <button
            onClick={() => {
              if (onAddCombo) {
                onAddCombo({
                  title: result.title,
                  items: [result.top?.id, result.bottom?.id, result.shoes?.id, result.outer?.id, result.accessory?.id].filter(Boolean),
                  image: result.top?.image || result.top?.image_url,
                });
              }
              toast.success('Kombin geçmişe eklendi!');
            }}
            className="btn-secondary w-full py-3"
          >
            Kombinlerime Ekle
          </button>
        </div>
      )}
    </div>
  );
}
