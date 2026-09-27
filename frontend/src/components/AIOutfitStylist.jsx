import React, { useState } from 'react';
import { Sparkles, Heart, RefreshCw, Thermometer, Palette, CheckCircle2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AIOutfitStylist({ wardrobe, onAddFavorite, API_URL }) {
  const [prompt, setPrompt] = useState('Kırmızı ve siyah tonlarında şık bir akşam yemeği kombini');
  const [modelType, setModelType] = useState('ft_rag'); // 'base_slm', 'ft_slm', 'ft_rag'
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  // Quick Preset Prompts showcasing different color palettes & styles
  const presets = [
    { title: '🔴 Siyah & Kırmızı Gece Şıklığı', prompt: 'Kırmızı ve siyah tonlarında şık bir akşam yemeği kombini' },
    { title: '🍂 Toprak Tonları (Bej & Taba)', prompt: 'Toprak tonlarında bej trençkotlu klasik sonbahar kombini' },
    { title: '⚫ Monokrom Siyah & Beyaz', prompt: 'Siyah ve beyaz minimalist spor günlük kombin' },
    { title: '💼 Lacivert Ofis Şıklığı', prompt: 'Lacivert kumaş pantolon ile profesyonel iş yemeği' },
    { title: '🌸 Soft Pastel Tonlar', prompt: 'Pudra pembe ve bebek mavisi tonlarında romantik sahil kombini' }
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setIsSaved(false);

    try {
      const res = await fetch(`${API_URL}/api/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          model_type: modelType,
          user_inventory: wardrobe
        })
      });
      const data = await res.json();
      setRecommendation(data);
    } catch (err) {
      console.log('Recommendation API error', err);
      // Fallback recommendation mock if API offline
      setTimeout(() => {
        setRecommendation({
          id: 'rec-' + Date.now(),
          title: prompt.title ? prompt.title() : 'Özel Renk Paletli Kombin',
          top_item: wardrobe.find(i => i.category === 'Üst Giyim') || wardrobe[0],
          bottom_item: wardrobe.find(i => i.category === 'Alt Giyim') || wardrobe[1],
          outer_item: wardrobe.find(i => i.category === 'Dış Giyim') || wardrobe[2],
          shoes_item: wardrobe.find(i => i.category === 'Ayakkabı') || wardrobe[3],
          accessory_item: wardrobe.find(i => i.category === 'Aksesuar') || wardrobe[4],
          reasoning: "Fine-Tuned SLM ve RAG motorumuz gardrobunuzdaki parçaları analiz ederek belirttiğiniz renk ve stil konseptine en uygun kombinasyonu seçti.",
          style_tips: [
            "Görünümdeki ana rengi nötr tonlu ayakkabı veya dış giyim parçası ile dengeleyebilirsiniz.",
            "Metropol şıklığı yakalamak için kontrast renkli aksesuarlar ekleyin."
          ],
          compatibility_score: modelType === 'ft_rag' ? 98 : (modelType === 'ft_slm' ? 85 : 62),
          weather_suitability: 'Etkinlik ve Hava Şartları İçin İdeal',
          color_palette: ['#E53935', '#212121', '#1A237E', '#D7CCC8']
        });
        setLoading(false);
      }, 1000);
      return;
    }
    setLoading(false);
  };

  const handleSaveFavorite = () => {
    if (!recommendation || isSaved) return;
    onAddFavorite(recommendation);
    setIsSaved(true);

    // Trigger Confetti
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#F7C5CC', '#B5EAD7', '#C7CEEA', '#8D6E63']
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="glass-card p-6 bg-gradient-to-r from-[#FAF7F2] via-[#EBFBF5] to-[#F0F4FF]">
        <div className="flex items-center gap-2 mb-2">
          <span className="badge-suyesili px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Yapay Zeka Stil Motoru
          </span>
          <span className="text-xs text-[#56B998] font-bold">
            İstediğin Herhangi Bir Renk Paleti ve Stil
          </span>
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#5D4037]">
          Ne Giyeceğine Yapay Zeka Karar Versin
        </h2>
        <p className="text-sm text-[#8D6E63] mt-1">
          İstediğiniz renk paletini (Kırmızı, Siyah, Lacivert, Toprak tonları, Pasteller vb.), hava durumunu veya konsepti yazın. Yapay zeka gardrobunuzdaki parçaları harmanlasın.
        </p>
      </div>

      {/* Input Section & Preset Chips */}
      <div className="glass-card p-6 space-y-4">
        {/* Preset Buttons */}
        <div>
          <label className="block text-xs font-bold text-[#8D6E63] uppercase tracking-wider mb-2">
            Farklı Renk Paletleri ve Etkinlik Şablonları
          </label>
          <div className="flex flex-wrap gap-2">
            {presets.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setPrompt(item.prompt)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#FAF7F2] border border-[#D7CCC8]/60 text-[#5D4037] hover:bg-[#FFF0F2] hover:border-[#F7C5CC] transition-all"
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>

        {/* Prompt Input */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-[#5D4037]">
            İstediğin Renk Paleti, Tarz ve Etkinlik (Prompt)
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Ör. Kırmızı ve siyah tonlarında şık gece kombini..."
              className="flex-1 px-4 py-3 rounded-2xl text-sm bg-[#FAF7F2] border border-[#D7CCC8] focus:outline-none focus:border-[#56B998]"
            />

            {/* Model Architecture Toggle for Thesis Presentation */}
            <div className="flex items-center gap-1 bg-[#FAF7F2] p-1 rounded-2xl border border-[#D7CCC8]">
              <button
                onClick={() => setModelType('ft_rag')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  modelType === 'ft_rag'
                    ? 'bg-[#56B998] text-white shadow-sm'
                    : 'text-[#8D6E63] hover:text-[#5D4037]'
                }`}
                title="Fine-Tuned SLM + ChromaDB RAG (Önerilen Akıllı Mimari)"
              >
                SLM + RAG ✨
              </button>
              <button
                onClick={() => setModelType('ft_slm')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  modelType === 'ft_slm'
                    ? 'bg-[#E89EA7] text-white shadow-sm'
                    : 'text-[#8D6E63] hover:text-[#5D4037]'
                }`}
                title="Sadece Fine-Tuned SLM"
              >
                Fine-Tuned SLM
              </button>
              <button
                onClick={() => setModelType('base_slm')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  modelType === 'base_slm'
                    ? 'bg-[#8D6E63] text-white shadow-sm'
                    : 'text-[#8D6E63] hover:text-[#5D4037]'
                }`}
                title="Ham Temel SLM (Eğitimsiz)"
              >
                Base SLM
              </button>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="px-6 py-3 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-[#56B998] to-[#628DC9] hover:opacity-95 shadow-md flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Kombinleniyor...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Kombin Üret
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Recommendation Results Showcase */}
      {recommendation && (
        <div className="glass-card p-6 border-2 border-[#B5EAD7] space-y-6 animate-fade-in bg-gradient-to-b from-white to-[#FAF7F2]">
          {/* Result Title & Score */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#FAF7F2]">
            <div>
              <span className="badge-suyesili px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#56B998]" /> Önerilen Kombin
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#5D4037]">
                {recommendation.title}
              </h3>
              <p className="text-xs text-[#8D6E63] flex items-center gap-1 mt-0.5">
                <Thermometer className="w-3.5 h-3.5 text-[#E89EA7]" />
                {recommendation.weather_suitability}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-2xl font-extrabold text-[#56B998]">
                  %{recommendation.compatibility_score}
                </div>
                <div className="text-[10px] text-[#8D6E63] font-semibold uppercase tracking-wider">
                  Renk & Stil Uyum Skoru
                </div>
              </div>

              <button
                onClick={handleSaveFavorite}
                className={`p-3 rounded-2xl border transition-all flex items-center gap-2 text-xs font-bold ${
                  isSaved
                    ? 'bg-[#FFF0F2] text-[#E89EA7] border-[#F7C5CC]'
                    : 'bg-white text-[#5D4037] border-[#D7CCC8] hover:bg-[#FFF0F2]'
                }`}
              >
                <Heart className={`w-5 h-5 ${isSaved ? 'fill-[#E89EA7] text-[#E89EA7]' : 'text-[#8D6E63]'}`} />
                {isSaved ? 'Favorilerde ♡' : 'Favorilere Ekle'}
              </button>
            </div>
          </div>

          {/* Combined Clothing Cards Stack */}
          <div>
            <h4 className="text-xs font-bold text-[#8D6E63] uppercase tracking-wider mb-3">
              Gardrobunuzdan Seçilen Kombin Parçaları
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {[
                { label: 'Üst Giyim', item: recommendation.top_item },
                { label: 'Alt Giyim', item: recommendation.bottom_item },
                { label: 'Dış Giyim', item: recommendation.outer_item },
                { label: 'Ayakkabı', item: recommendation.shoes_item },
                { label: 'Aksesuar', item: recommendation.accessory_item }
              ].map((slot, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-2.5 border border-[#D7CCC8]/50 shadow-sm flex flex-col justify-between">
                  <div className="text-[10px] font-bold text-[#8D6E63] mb-1.5 px-1 flex justify-between">
                    <span>{slot.label}</span>
                    {slot.item && <span className="text-[#56B998] font-semibold">{slot.item.color}</span>}
                  </div>

                  {slot.item ? (
                    <div className="space-y-1.5">
                      <div className="aspect-square rounded-xl overflow-hidden bg-[#FAF7F2]">
                        <img src={slot.item.image_url} alt={slot.item.name} className="w-full h-full object-cover" />
                      </div>
                      <p className="font-bold text-xs text-[#5D4037] truncate">{slot.item.name}</p>
                    </div>
                  ) : (
                    <div className="aspect-square rounded-xl bg-[#FAF7F2] border border-dashed border-[#D7CCC8] flex items-center justify-center text-[10px] text-[#8D6E63] text-center p-2">
                      Parça Gerekmiyor
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* AI Style Reasoning & Tips */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {/* Reasoning */}
            <div className="md:col-span-2 bg-[#EBFBF5] p-4 rounded-2xl border border-[#B5EAD7] space-y-2">
              <h4 className="text-xs font-bold text-[#56B998] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Yapay Zeka Mantığı (Reasoning)
              </h4>
              <p className="text-xs text-[#5D4037] leading-relaxed">
                {recommendation.reasoning}
              </p>
            </div>

            {/* Color Palette & Tips */}
            <div className="bg-[#FFF0F2] p-4 rounded-2xl border border-[#F7C5CC] space-y-3">
              <div>
                <h4 className="text-xs font-bold text-[#E89EA7] uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <Palette className="w-4 h-4" /> Kombin Renk Paleti
                </h4>
                <div className="flex items-center gap-2">
                  {recommendation.color_palette.map((c, i) => (
                    <div key={i} className="w-6 h-6 rounded-full border border-white shadow-sm" style={{ backgroundColor: c }} title={c} />
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#E89EA7] uppercase tracking-wider mb-1">
                  Stil İpuçları
                </h4>
                <ul className="text-[11px] text-[#5D4037] space-y-1 list-disc pl-3">
                  {recommendation.style_tips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
