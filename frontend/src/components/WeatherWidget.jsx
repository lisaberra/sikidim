import React, { useState, useEffect } from 'react';
import { Sun, CloudRain, Cloud, Wind, Thermometer, MapPin, ArrowRight, Loader2, CloudLightning, CloudSnow, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';

// WMO Hava Durumu Kodlarını Türkçe'ye ve İkonlara Çevirme
const getWeatherInfo = (code) => {
  if (code === 0) return { text: 'Açık / Güneşli', icon: Sun };
  if (code === 1 || code === 2 || code === 3) return { text: 'Parçalı Bulutlu', icon: Cloud };
  if (code === 45 || code === 48) return { text: 'Sisli', icon: Wind };
  if (code >= 51 && code <= 67) return { text: 'Yağmurlu', icon: CloudRain };
  if (code >= 71 && code <= 77) return { text: 'Karlı', icon: CloudSnow };
  if (code >= 80 && code <= 82) return { text: 'Sağanak Yağışlı', icon: CloudRain };
  if (code === 85 || code === 86) return { text: 'Kar Sağanağı', icon: CloudSnow };
  if (code >= 95 && code <= 99) return { text: 'Fırtınalı', icon: CloudLightning };
  return { text: 'Bilinmiyor', icon: Thermometer };
};

export default function WeatherWidget({ onApplyWeather }) {
  const [cityInput, setCityInput] = useState('İstanbul');
  const [currentWeather, setCurrentWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = async (cityName) => {
    if (!cityName.trim()) return;
    setLoading(true);
    setError(null);
    try {
      // 1. Geocoding API ile koordinat bul
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=tr&format=json`);
      const geoData = await geoRes.json();
      
      if (!geoData.results || geoData.results.length === 0) {
        throw new Error('Şehir bulunamadı');
      }

      const { latitude, longitude, name, country } = geoData.results[0];

      // 2. Weather API ile hava durumunu al
      const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code`);
      const weatherData = await weatherRes.json();

      if (!weatherData.current) {
        throw new Error('Hava durumu alınamadı');
      }

      const temp = Math.round(weatherData.current.temperature_2m);
      const code = weatherData.current.weather_code;
      const info = getWeatherInfo(code);

      setCurrentWeather({
        name: `${name}, ${country}`,
        temp: `${temp}°C`,
        status: info.text,
        icon: info.icon,
        promptText: `${name} ${temp}°C ${info.text.toLowerCase()} havada`
      });

    } catch (err) {
      setError(err.message);
      toast.error(err.message === 'Şehir bulunamadı' ? 'Böyle bir şehir bulunamadı.' : 'Hava durumu alınırken hata oluştu.');
      setCurrentWeather(null);
    } finally {
      setLoading(false);
    }
  };

  // İlk açılışta varsayılan şehri getir
  useEffect(() => {
    fetchWeather(cityInput);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWeather(cityInput);
  };

  const IconComponent = currentWeather?.icon || Thermometer;

  return (
    <div className="bg-gradient-to-r from-[#FAF7F2] via-[#EBFBF5] to-[#F0F4FF] p-4 rounded-2xl border border-[#B5EAD7] flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
      
      {/* Sol Kısım: Arama ve İkon */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
        
        {/* İkon */}
        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-[#56B998] shadow-sm border border-[#B5EAD7] shrink-0">
          {loading ? <Loader2 className="w-6 h-6 animate-spin text-[#56B998]" /> : <IconComponent className="w-6 h-6 animate-pulse" />}
        </div>

        {/* Bilgiler ve Arama Kutusu */}
        <div className="flex flex-col w-full sm:w-auto text-center sm:text-left">
          <form onSubmit={handleSearch} className="flex items-center gap-2 border-b border-[#5D4037]/30 pb-1 mb-1 justify-center sm:justify-start">
            <MapPin className="w-3.5 h-3.5 text-[#E89EA7]" />
            <input
              type="text"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              placeholder="Şehir adı yazın..."
              className="bg-transparent font-bold text-[#5D4037] focus:outline-none w-32 placeholder:text-[#5D4037]/50 placeholder:font-normal text-sm"
            />
            <button type="submit" disabled={loading} className="text-[#56B998] hover:text-[#459e81] p-1">
              <Search className="w-4 h-4" />
            </button>
          </form>
          
          <div className="flex items-baseline justify-center sm:justify-start gap-2 h-7">
            {loading ? (
              <span className="text-xs text-[#5D4037] animate-pulse">Hava durumu alınıyor...</span>
            ) : error ? (
              <span className="text-xs text-red-500 font-medium">Şehir bulunamadı</span>
            ) : currentWeather ? (
              <>
                <span className="font-serif text-xl font-bold text-[#5D4037]">{currentWeather.temp}</span>
                <span className="text-xs text-[#56B998] font-semibold">{currentWeather.status}</span>
              </>
            ) : null}
          </div>
        </div>
      </div>

      {/* Sağ Kısım: Prompta Ekle Butonu */}
      <button
        onClick={() => currentWeather && onApplyWeather(currentWeather.promptText)}
        disabled={!currentWeather || loading}
        className="w-full md:w-auto px-4 py-2 rounded-xl text-xs font-bold bg-white text-[#5D4037] border border-[#D7CCC8] hover:bg-[#EBFBF5] hover:border-[#56B998] transition-all flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span>Bu Havayı Prompta Ekle</span>
        <ArrowRight className="w-3.5 h-3.5 text-[#56B998]" />
      </button>
    </div>
  );
}
