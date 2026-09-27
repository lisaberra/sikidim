import React, { useState, useEffect } from 'react';
import { MapPin, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';
import BibbleCharacter from './BibbleCharacter';

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

/* Şehir Vibe Haritası (Eski liste, fallback vibe için) */
const CITY_VIBES = {
  'İstanbul': { name: 'İstanbul', vibe: 'Kozmopolit, Şık, Sokak Stili', desc: 'Koşturmalı, şık ve dinamik bir metropol tarzı.', emoji: '🏙️' },
  'Ankara':   { name: 'Ankara', vibe: 'Formal, Klasik, Ofis Şıklığı', desc: 'Ciddi, düzenli ve profesyonel bir başkent havası.', emoji: '🏢' },
  'İzmir':    { name: 'İzmir', vibe: 'Bohem, Efil Efil, Sahil Rahatlığı', desc: 'Rahat, enerjik ve denizin tuzlu ruhunu taşıyan bir stil.', emoji: '🌊' },
  // ... diğerleri API ve AI tarafından halledilecek
};

export default function SehreGoreKombin({ wardrobe, onAddCombo, onPreview, API_URL }) {
  const [city, setCity] = useState('İstanbul');
  const [extra, setExtra] = useState('');
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
        const cityLower = city.trim().toLowerCase().replace(/İ/g, 'i').replace(/I/g, 'ı');
        const trCity = TR_CITIES[cityLower];
        
        let latitude, longitude, resolvedName;

        if (trCity) {
          latitude = trCity.lat;
          longitude = trCity.lon;
          resolvedName = city.trim();
        } else {
          const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city.trim())}&count=3&language=tr&format=json`);
          const geoData = await geoRes.json();

          if (!geoData.results || geoData.results.length === 0) {
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
    setLoading(true);
    setResult(null);
    setBibbleMood('idle');
    
    const knownVibe = CITY_VIBES[city] || CITY_VIBES['İstanbul'];
    const vibeContext = knownVibe 
      ? `${city} şehrinin vibe'ı: "${knownVibe.vibe}". Açıklama: "${knownVibe.desc}". ` 
      : `Lütfen ${city} şehrinin yerel iklimine ve kentsel veya coğrafi yapısına (vibe'ına) tam olarak uygun bir kombin yap. `;
    
    const weatherInfo = weatherData
      ? `Şu anki hava durumu: ${weatherData.temp}°C, ${weatherData.isCold ? 'soğuk' : weatherData.isHot ? 'sıcak' : 'ılıman'}. `
      : '';

    const fullPrompt = `${vibeContext} ${weatherInfo} ${extra ? 'Ek istek: ' + extra : 'Günlük kullanım için.'}`;

    try {
      const res = await fetch(`${API_URL}/api/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: fullPrompt, city, wardrobe: wardrobe, weather: weatherInfo }),
      });
      if(!res.ok) throw new Error();
      const data = await res.json();
      setResult({ ...data, vibePrompt: fullPrompt });
      setBibbleMood(data.bibble_mood || 'cool');
      onPreview([data.top_item, data.bottom_item, data.outer_item, data.shoes_item, data.accessory_item].filter(Boolean));
    } catch {
      // Mock Fallback
      const pickBestMatch = (cat) => {
        const items = wardrobe.filter(w => w.category === cat || w.category === `${cat} Giyim`);
        return items.length > 0 ? items[Math.floor(Math.random() * items.length)] : null;
      };

      const top = pickBestMatch('Üst');
      const bottom = pickBestMatch('Alt');
      const outer = pickBestMatch('Dış');
      const shoes = pickBestMatch('Ayakkabı');
      const accessory = pickBestMatch('Aksesuar');

      setResult({
        title: `${city} Esintisi (Offline)`,
        top_item: top, bottom_item: bottom, outer_item: outer, shoes_item: shoes, accessory_item: accessory,
        vibePrompt: fullPrompt,
        reasoning: "Çevrimdışı modda rastgele bir kombin oluşturuldu.",
        compatibility_score: 85
      });
      setBibbleMood('saskin');
      onPreview([top, bottom, outer, shoes, accessory].filter(Boolean));
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <BibbleCharacter
          mood={result ? bibbleMood : 'cool'}
          size="lg"
          flying={!result}
          showReaction={!!result}
          reactionText={result ? 'İşte bu şehir için mükemmel!' : ''}
        />
        <div>
          <h2 className="font-serif text-3xl font-bold text-kahve-600 flex items-center gap-2">
            Şehre Göre Kombin <MapPin className="w-6 h-6 text-kiremit-500" />
          </h2>
          <p className="text-sm text-kahve-400 mt-1">Gideceğin şehrin havasına ve stiline ayak uydur.</p>
        </div>
      </div>

      <div className="card p-6 space-y-4 shadow-xl border-t-4 border-t-kiremit-400">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-full">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-kiremit-400" />
              <input 
                type="text" 
                value={city} 
                onChange={e => setCity(e.target.value)} 
                placeholder="Hangi şehre gidiyorsun?" 
                className="input-field pl-10 bg-white" 
              />
            </div>
          </div>
          
          <input
            type="text"
            value={extra}
            onChange={e => setExtra(e.target.value)}
            placeholder="Ekstra bir isteğin var mı? (Örn: Müzeye gideceğim)"
            className="input-field bg-white"
          />
        </div>

        {/* Hava Durumu Göstergesi */}
        <div className="flex justify-center md:justify-start">
            {weatherLoading ? (
              <div className="flex items-center gap-2 bg-kahve-50 px-4 py-2 rounded-xl border border-kahve-200 shadow-sm animate-pulse">
                <span className="text-xl">🔍</span>
                <div>
                  <p className="text-[10px] font-extrabold text-kahve-400 uppercase tracking-wide">Hava Aranıyor</p>
                  <p className="text-sm font-bold text-kahve-500">...</p>
                </div>
              </div>
            ) : weatherData ? (
              <div className="flex items-center gap-2 bg-suyesil-50 px-4 py-2 rounded-xl border border-suyesil-200 shadow-sm animate-fade-in">
                <span className="text-xl">{weatherData.isCold ? '❄️' : weatherData.isHot ? '☀️' : '⛅'}</span>
                <div>
                  <p className="text-[10px] font-extrabold text-suyesil-600 uppercase tracking-wide truncate max-w-[150px]" title={resolvedCityName}>{resolvedCityName || city}</p>
                  <p className="text-sm font-bold text-kahve-600">{weatherData.temp}°C</p>
                </div>
              </div>
            ) : city.trim() ? (
              <div className="flex items-center gap-2 bg-red-50 px-3 py-2 rounded-xl border border-red-200 shadow-sm">
                <span className="text-lg">❌</span>
                <p className="text-[10px] font-bold text-red-400">Şehir bulunamadı</p>
              </div>
            ) : null}
        </div>

        <button 
          onClick={generate} 
          disabled={loading || !city.trim() || !weatherData} 
          className="btn-primary w-full py-3 text-base shadow-md disabled:opacity-60"
        >
          {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
          {loading ? 'Şehrin Ritmi Analiz Ediliyor...' : 'Bu Şehre Uygun Kombinle'}
        </button>
      </div>

      {result && (
        <div className="card p-6 border-2 border-kiremit-200 space-y-6 animate-slide-up bg-gradient-to-br from-white to-kiremit-50/20 shadow-2xl">
          <div className="flex justify-between items-start">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-kiremit-600 bg-kiremit-50 px-3 py-1 rounded-full border border-kiremit-200">
                <CheckCircle2 className="w-4 h-4" /> Şehir Vibe'ı Yakalandı
              </span>
              <h3 className="font-serif text-2xl font-bold text-kahve-600 mt-3">{result.title}</h3>
            </div>
            {result.compatibility_score && (
              <div className="text-right">
                <span className="text-2xl font-extrabold text-kiremit-500">%{result.compatibility_score}</span>
                <span className="block text-[10px] font-semibold text-kahve-400 uppercase">Uyum</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { label: 'Üst', item: result.top_item },
              { label: 'Alt', item: result.bottom_item },
              { label: 'Dış', item: result.outer_item },
              { label: 'Ayakkabı', item: result.shoes_item },
              { label: 'Aksesuar', item: result.accessory_item },
            ].map((slot, i) => (
              <div key={i} className="bg-white rounded-2xl p-3 border border-kahve-100 shadow-soft">
                <span className="text-[10px] font-bold text-kahve-400 block mb-2">{slot.label}</span>
                {slot.item ? (
                  <>
                    <div className="aspect-square rounded-xl overflow-hidden bg-cream flex items-center justify-center p-1">
                      <img src={slot.item.image || slot.item.image_url} alt={slot.item.name} className="max-w-full max-h-full object-contain drop-shadow-sm" />
                    </div>
                    <p className="font-bold text-xs text-kahve-600 mt-2 truncate">{slot.item.name}</p>
                  </>
                ) : (
                  <div className="aspect-square rounded-xl bg-cream border border-dashed border-kahve-200 flex items-center justify-center text-[10px] text-kahve-300">
                    Eksik
                  </div>
                )}
              </div>
            ))}
          </div>

          {result.reasoning && (
             <div className="bg-white/80 p-5 rounded-2xl border border-kahve-100 shadow-inner">
               <p className="text-sm text-kahve-600 italic">"{result.reasoning}"</p>
             </div>
          )}

          <button onClick={() => onAddCombo(result)} className="btn-secondary w-full py-3">
            Kombinlerime Ekle
          </button>
        </div>
      )}
    </div>
  );
}
