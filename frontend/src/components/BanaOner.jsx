import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, RefreshCw, CheckCircle2, MapPin } from 'lucide-react';
import BibbleCharacter, { FloatingBibble } from './BibbleCharacter';

const PRESETS = [
  'Kırmızı ve siyah tonlarında şık akşam yemeği',
  'Toprak tonlarında klasik sonbahar görünümü',
  'Siyah ve beyaz minimalist spor stil',
  'Lacivert ofis şıklığı',
  'Pudra tonlarında romantik sahil kombini',
  'Gotik tarz: siyah, deri, zincirler',
  'Street style: oversize, sneaker, şehirli',
  'Bohem: toprak tonları, doğal kumaşlar',
];

/* ═══ Türkiye 81 İl Koordinat Tablosu (Geocoding API fallback) ═══ */
const TR_CITIES = {
  'adana': { lat: 37.00, lon: 35.32 }, 'adıyaman': { lat: 37.76, lon: 38.28 },
  'afyon': { lat: 38.74, lon: 30.54 }, 'afyonkarahisar': { lat: 38.74, lon: 30.54 },
  'ağrı': { lat: 39.72, lon: 43.05 }, 'aksaray': { lat: 38.37, lon: 34.03 },
  'amasya': { lat: 40.65, lon: 35.83 }, 'ankara': { lat: 39.93, lon: 32.86 },
  'antalya': { lat: 36.90, lon: 30.70 }, 'ardahan': { lat: 41.11, lon: 42.70 },
  'artvin': { lat: 41.18, lon: 41.82 }, 'aydın': { lat: 37.85, lon: 27.85 },
  'balıkesir': { lat: 39.65, lon: 27.89 }, 'bartın': { lat: 41.64, lon: 32.34 },
  'batman': { lat: 37.88, lon: 41.13 }, 'bayburt': { lat: 40.26, lon: 40.23 },
  'bilecik': { lat: 40.06, lon: 30.00 }, 'bingöl': { lat: 38.88, lon: 40.50 },
  'bitlis': { lat: 38.40, lon: 42.11 }, 'bolu': { lat: 40.73, lon: 31.61 },
  'burdur': { lat: 37.72, lon: 30.29 }, 'bursa': { lat: 40.19, lon: 29.06 },
  'çanakkale': { lat: 40.15, lon: 26.41 }, 'çankırı': { lat: 40.60, lon: 33.62 },
  'çorum': { lat: 40.55, lon: 34.96 }, 'denizli': { lat: 37.77, lon: 29.09 },
  'diyarbakır': { lat: 37.92, lon: 40.22 }, 'düzce': { lat: 40.84, lon: 31.16 },
  'edirne': { lat: 41.68, lon: 26.56 }, 'elazığ': { lat: 38.67, lon: 39.22 },
  'erzincan': { lat: 39.75, lon: 39.49 }, 'erzurum': { lat: 39.90, lon: 41.28 },
  'eskişehir': { lat: 39.78, lon: 30.52 }, 'gaziantep': { lat: 37.07, lon: 37.38 },
  'giresun': { lat: 40.91, lon: 38.39 }, 'gümüşhane': { lat: 40.46, lon: 39.48 },
  'hakkari': { lat: 37.58, lon: 43.74 }, 'hatay': { lat: 36.40, lon: 36.35 },
  'ığdır': { lat: 39.92, lon: 44.05 }, 'isparta': { lat: 37.76, lon: 30.55 },
  'istanbul': { lat: 41.01, lon: 28.98 }, 'İstanbul': { lat: 41.01, lon: 28.98 },
  'izmir': { lat: 38.42, lon: 27.14 }, 'İzmir': { lat: 38.42, lon: 27.14 },
  'kahramanmaraş': { lat: 37.58, lon: 36.94 }, 'karabük': { lat: 41.20, lon: 32.63 },
  'karaman': { lat: 37.18, lon: 33.23 }, 'kars': { lat: 40.60, lon: 43.09 },
  'kastamonu': { lat: 41.39, lon: 33.78 }, 'kayseri': { lat: 38.73, lon: 35.48 },
  'kilis': { lat: 36.72, lon: 37.12 }, 'kırıkkale': { lat: 39.85, lon: 33.51 },
  'kırklareli': { lat: 41.73, lon: 27.23 }, 'kırşehir': { lat: 39.15, lon: 34.17 },
  'kocaeli': { lat: 40.77, lon: 29.92 }, 'konya': { lat: 37.87, lon: 32.48 },
  'kütahya': { lat: 39.42, lon: 29.98 }, 'malatya': { lat: 38.36, lon: 38.32 },
  'manisa': { lat: 38.61, lon: 27.43 }, 'mardin': { lat: 37.31, lon: 40.74 },
  'mersin': { lat: 36.80, lon: 34.63 }, 'muğla': { lat: 37.21, lon: 28.36 },
  'muş': { lat: 38.73, lon: 41.49 }, 'nevşehir': { lat: 38.62, lon: 34.71 },
  'niğde': { lat: 37.97, lon: 34.68 }, 'ordu': { lat: 40.98, lon: 37.88 },
  'osmaniye': { lat: 37.07, lon: 36.25 }, 'rize': { lat: 41.02, lon: 40.52 },
  'sakarya': { lat: 40.69, lon: 30.40 }, 'samsun': { lat: 41.29, lon: 36.33 },
  'şanlıurfa': { lat: 37.17, lon: 38.79 }, 'siirt': { lat: 37.93, lon: 41.94 },
  'sinop': { lat: 42.03, lon: 35.15 }, 'sivas': { lat: 39.75, lon: 37.01 },
  'şırnak': { lat: 37.52, lon: 42.46 }, 'tekirdağ': { lat: 40.98, lon: 27.51 },
  'tokat': { lat: 40.31, lon: 36.55 }, 'trabzon': { lat: 41.00, lon: 39.72 },
  'tunceli': { lat: 39.11, lon: 39.55 }, 'uşak': { lat: 38.67, lon: 29.41 },
  'van': { lat: 38.49, lon: 43.38 }, 'yalova': { lat: 40.66, lon: 29.27 },
  'yozgat': { lat: 39.82, lon: 34.80 }, 'zonguldak': { lat: 41.45, lon: 31.79 },
};

export default function BanaOner({ wardrobe, favorites = [], onAddCombo, onPreview, API_URL }) {
  const [prompt, setPrompt] = useState('');
  const [city, setCity] = useState('İstanbul');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [resolvedCityName, setResolvedCityName] = useState('');
  const [bibbleMood, setBibbleMood] = useState('idle');

  // Hava durumunu çek — Open-Meteo + TR_CITIES fallback
  useEffect(() => {
    const fetchWeather = async () => {
      if (!city.trim()) { setWeatherData(null); return; }
      setWeatherLoading(true);
      try {
        // 1. Türkiye il tablosunda var mı kontrol et
        const cityLower = city.trim().toLowerCase().replace(/İ/g, 'i').replace(/I/g, 'ı');
        const trCity = TR_CITIES[cityLower];
        
        let latitude, longitude, resolvedName;

        if (trCity) {
          // Direkt koordinat kullan
          latitude = trCity.lat;
          longitude = trCity.lon;
          resolvedName = city.trim();
        } else {
          // 2. Geocoding API ile ara (TR öncelikli, sonra global)
          const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city.trim())}&count=3&language=tr&format=json`);
          const geoData = await geoRes.json();

          if (!geoData.results || geoData.results.length === 0) {
            // İngilizce ile tekrar dene
            const geoResEN = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city.trim())}&count=3&language=en&format=json`);
            const geoDataEN = await geoResEN.json();
            
            if (!geoDataEN.results || geoDataEN.results.length === 0) {
              setWeatherData(null);
              setResolvedCityName('');
              setWeatherLoading(false);
              return;
            }
            latitude = geoDataEN.results[0].latitude;
            longitude = geoDataEN.results[0].longitude;
            resolvedName = `${geoDataEN.results[0].name}, ${geoDataEN.results[0].country}`;
          } else {
            latitude = geoData.results[0].latitude;
            longitude = geoData.results[0].longitude;
            resolvedName = `${geoData.results[0].name}, ${geoData.results[0].country}`;
          }
        }

        setResolvedCityName(resolvedName);

        // 3. Hava durumunu çek
        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
        const json = await weatherRes.json();
        const cw = json.current_weather;
        setWeatherData({
          temp: cw.temperature,
          code: cw.weathercode,
          isCold: cw.temperature < 15,
          isHot: cw.temperature > 25,
          cityFull: resolvedName
        });
      } catch (e) {
        setWeatherData(null);
        setResolvedCityName('');
      }
      setWeatherLoading(false);
    };

    const timeout = setTimeout(fetchWeather, 600);
    return () => clearTimeout(timeout);
  }, [city]);

  const generate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResult(null);
    setBibbleMood('idle');

    try {
      const recentCombos = (favorites || []).slice(0, 5).map(f => ({
        title: f.title || '',
        items: f.items || []
      }));

      const weatherInfo = weatherData
        ? `${resolvedCityName || city} - ${weatherData.temp}°C, ${weatherData.isCold ? 'soğuk' : weatherData.isHot ? 'sıcak' : 'ılıman'}`
        : null;

      const res = await fetch(`${API_URL}/api/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          city,
          wardrobe: wardrobe,
          weather: weatherInfo,
          favorites: favorites,
          recent_combos: recentCombos
        }),
      });
      if (!res.ok) throw new Error("API Offline");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
      setBibbleMood(data.bibble_mood || 'mutlu');
      if (data.top_item || data.bottom_item) {
        onPreview([data.top_item, data.bottom_item, data.outer_item, data.shoes_item, data.accessory_item].filter(Boolean));
      }
    } catch {
      /* Offline fallback */
      const normalize = (str) => (str || '').toLowerCase();
      const promptWords = prompt.toLowerCase().split(/\s+/).filter(Boolean);

      const scoreItem = (item) => {
        let score = 0;
        const nameWords = item.name.toLowerCase().split(/\s+/);
        const color = normalize(item.color);

        promptWords.forEach(pw => {
          if (nameWords.some(nw => nw.includes(pw) || pw.includes(nw))) score += 5;
          if (color.includes(pw) || pw.includes(color)) score += 6;
        });
        return score;
      };

      const pickBest = (cat) => {
        const items = wardrobe.filter(i => i.category === cat || i.category === `${cat} Giyim`);
        if (items.length === 0) return null;
        items.sort((a, b) => scoreItem(b) - scoreItem(a));
        return items[0];
      };

      const top = pickBest('Üst');
      const bot = pickBest('Alt');
      const outer = pickBest('Dış');
      const shoe = pickBest('Ayakkabı');
      const acc = pickBest('Aksesuar');

      setResult({
        title: 'Bibble Offline Kombini',
        top_item: top, bottom_item: bot, outer_item: outer, shoes_item: shoe, accessory_item: acc,
        reasoning: 'Yapay zeka motoru çevrimdışı olduğu için en uygun eşleştirme yapıldı.',
        compatibility_score: Math.floor(Math.random() * 15) + 80,
        bibble_mood: 'saskin',
        style_tips: ['Aksesuarlarla tarzınızı vurgulayın.'],
      });
      setBibbleMood('saskin');
      onPreview([top, bot, outer, shoe, acc].filter(Boolean));
    }
    setLoading(false);
  };

  // Bibble mood görseli
  const bibbleMoodImage = useMemo(() => {
    const map = {
      mutlu: '/bibble/bibble2.jpg', saskin: '/bibble/bibble3.jpg',
      havali: '/bibble/bibble1.jpg', heyecanli: '/bibble/bibble2.jpg',
      kizgin: '/bibble/bibble3.jpg', romantik: '/bibble/bibble2.jpg',
      idle: '/bibble/bibble1.jpg',
    };
    return map[bibbleMood] || '/bibble/bibble1.jpg';
  }, [bibbleMood]);

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto relative">
      {/* Arka planda uçan Bibble */}
      <FloatingBibble active={!result} />

      {/* Header Bibble */}
      <div className="flex items-center gap-4">
        <BibbleCharacter
          mood={result ? bibbleMood : 'idle'}
          size="lg"
          flying={!result}
          showReaction={!!result}
          reactionText={result ? (bibbleMood === 'mutlu' ? 'Yip yip! 💜' : bibbleMood === 'saskin' ? 'Oha! 😮' : bibbleMood === 'havali' ? 'Cool! 😎' : bibbleMood === 'kizgin' ? 'Hmph! 🔥' : 'Bibble! ✨') : ''}
        />
        <div className="text-left">
          <h2 className="font-serif text-3xl font-bold text-kahve-600">Bibble'a Sor <span className="text-purple-400">💜</span></h2>
          <p className="text-sm text-kahve-400 mt-1">Tarz, renk paleti veya etkinlik yaz — Bibble senin için gardırobundan kombin önersin!</p>
        </div>
      </div>

      {/* Prompt Area */}
      <div className="card p-6 md:p-8 space-y-6 shadow-xl bg-white/80 backdrop-blur-sm border border-kahve-100/50">

        {/* Presets */}
        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
          {PRESETS.map((p, i) => (
            <button
              key={i}
              onClick={() => setPrompt(p)}
              className="text-xs font-semibold px-3 py-1.5 rounded-full bg-cream border border-kahve-200/50 text-kahve-500 hover:bg-suyesil-50 hover:border-suyesil-300 hover:text-suyesil-600 hover:shadow-sm transition-all"
            >
              {p.length > 36 ? p.slice(0, 36) + '…' : p}
            </button>
          ))}
        </div>

        {/* Inputs Layout */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-full md:w-1/2">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-kahve-300" />
              <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="Şehir (Hava durumu için — tüm iller)"
                className="input-field pl-10 w-full"
              />
            </div>
            {weatherLoading ? (
              <div className="flex items-center gap-2 bg-kahve-50 px-4 py-2 rounded-xl border border-kahve-200 shadow-sm animate-pulse shrink-0">
                <span className="text-xl">🔍</span>
                <div>
                  <p className="text-[10px] font-extrabold text-kahve-400 uppercase tracking-wide">Hava Aranıyor</p>
                  <p className="text-sm font-bold text-kahve-500">...</p>
                </div>
              </div>
            ) : weatherData ? (
              <div className="flex items-center gap-2 bg-suyesil-50 px-4 py-2 rounded-xl border border-suyesil-200 shadow-sm animate-fade-in shrink-0">
                <span className="text-xl">{weatherData.isCold ? '❄️' : weatherData.isHot ? '☀️' : '⛅'}</span>
                <div>
                  <p className="text-[10px] font-extrabold text-suyesil-600 uppercase tracking-wide truncate max-w-[120px]" title={resolvedCityName}>{resolvedCityName || city}</p>
                  <p className="text-sm font-bold text-kahve-600">{weatherData.temp}°C</p>
                </div>
              </div>
            ) : city.trim() ? (
              <div className="flex items-center gap-2 bg-red-50 px-3 py-2 rounded-xl border border-red-200 shadow-sm shrink-0">
                <span className="text-lg">❌</span>
                <p className="text-[10px] font-bold text-red-400">Şehir bulunamadı</p>
              </div>
            ) : null}
          </div>

          <div className="w-full">
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              rows={3}
              placeholder="Örn: Akşam yemeği için siyah ağırlıklı şık bir kombin... veya 'gotik tarz istiyorum' gibi her şeyi yazabilirsin!"
              className="input-field w-full resize-none text-base p-4"
            />
          </div>

          <button
            onClick={generate}
            disabled={loading || !prompt.trim()}
            className="btn-primary w-full md:w-auto self-end py-3 px-8 text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
          >
            {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            {loading ? 'Bibble Düşünüyor…' : "Bibble'a Sor 💜"}
          </button>
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className="card p-6 md:p-8 border-2 border-suyesil-300 space-y-6 animate-slide-up bg-gradient-to-b from-white to-suyesil-50/30 shadow-2xl">
          <div className="flex justify-between items-start">
            <div>
              <span className="inline-flex items-center gap-2 text-sm font-extrabold text-purple-600 bg-purple-50 pr-5 pl-2 py-2 rounded-full border-2 border-purple-200 shadow-md">
                <BibbleCharacter mood={bibbleMood} size="sm" />
                Bibble'ın Önerisi
              </span>
              <h3 className="font-serif text-3xl font-bold text-kahve-600 mt-4">{result.title}</h3>
            </div>
            <div className="text-right">
              <span className="text-3xl font-extrabold text-suyesil-500">%{result.compatibility_score}</span>
              <span className="block text-[10px] font-semibold text-kahve-400 uppercase tracking-wider mt-1">Uyum Skoru</span>
            </div>
          </div>

          {/* Items Row */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: 'Üst Giyim', item: result.top_item },
              { label: 'Alt Giyim', item: result.bottom_item },
              { label: 'Dış Giyim', item: result.outer_item },
              { label: 'Ayakkabı', item: result.shoes_item },
              { label: 'Aksesuar', item: result.accessory_item },
            ].map((slot, i) => (
              <div key={i} className="bg-white rounded-2xl p-3 border border-kahve-100/50 shadow-soft flex flex-col hover:shadow-md transition-shadow">
                <span className="text-[10px] font-bold text-kahve-400 block mb-2 uppercase tracking-wider">{slot.label}</span>
                {slot.item ? (
                  <>
                    <div className="aspect-square rounded-xl overflow-hidden bg-cream mb-2 flex items-center justify-center p-2">
                      <img src={slot.item.image || slot.item.image_url} alt={slot.item.name} className="max-w-full max-h-full object-contain drop-shadow-sm" />
                    </div>
                    <p className="font-bold text-xs text-kahve-600 truncate mt-auto">{slot.item.name}</p>
                  </>
                ) : (
                  <div className="aspect-square rounded-xl bg-cream border-2 border-dashed border-kahve-100 flex items-center justify-center text-xs font-medium text-kahve-300">
                    Eksik
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Reasoning — Bibble tepkisi */}
          <div className="bg-purple-50/70 p-6 rounded-2xl border border-purple-200 shadow-inner flex gap-5 items-center relative overflow-hidden">
            <BibbleCharacter mood={bibbleMood} size="lg" showReaction={false} className="hidden md:block shrink-0" />
            <div className="relative z-10">
              <p className="text-sm font-extrabold text-purple-600 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Bibble Diyor Ki:
              </p>
              <p className="text-base text-kahve-700 leading-relaxed font-semibold italic">"{result.reasoning}"</p>
            </div>
          </div>

          {/* Stil Tüyoları */}
          {result.style_tips && result.style_tips.length > 0 && (
            <div className="bg-suyesil-50/50 p-4 rounded-2xl border border-suyesil-200">
              <p className="text-[10px] font-bold text-suyesil-600 mb-2 uppercase tracking-wider">💡 Stil Tüyoları</p>
              <ul className="space-y-1">
                {result.style_tips.map((tip, i) => (
                  <li key={i} className="text-xs text-kahve-600 font-medium">• {tip}</li>
                ))}
              </ul>
            </div>
          )}

          <button onClick={() => onAddCombo(result)} className="btn-secondary w-full py-4 text-base font-bold shadow-md hover:shadow-lg transition-shadow">
            Bu Kombini Kaydet
          </button>
        </div>
      )}
    </div>
  );
}
