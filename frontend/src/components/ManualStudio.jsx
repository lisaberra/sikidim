import React, { useState } from 'react';
import { Palette, Sparkles, Heart, CheckCircle2, RotateCcw, Plus, Layers } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ManualStudio({ wardrobe, onAddFavorite }) {
  const [selectedTop, setSelectedTop] = useState(wardrobe.find(i => i.category === 'Üst Giyim') || null);
  const [selectedBottom, setSelectedBottom] = useState(wardrobe.find(i => i.category === 'Alt Giyim') || null);
  const [selectedOuter, setSelectedOuter] = useState(wardrobe.find(i => i.category === 'Dış Giyim') || null);
  const [selectedShoes, setSelectedShoes] = useState(wardrobe.find(i => i.category === 'Ayakkabı') || null);
  const [selectedAccessory, setSelectedAccessory] = useState(wardrobe.find(i => i.category === 'Aksesuar') || null);

  const [outfitTitle, setOutfitTitle] = useState('Benim Özel Tasarım Kombinim');
  const [isSaved, setIsSaved] = useState(false);

  // Filter items by category for slot selectors
  const tops = wardrobe.filter(i => i.category === 'Üst Giyim');
  const bottoms = wardrobe.filter(i => i.category === 'Alt Giyim');
  const outers = wardrobe.filter(i => i.category === 'Dış Giyim');
  const shoesList = wardrobe.filter(i => i.category === 'Ayakkabı');
  const accessories = wardrobe.filter(i => i.category === 'Aksesuar');

  // Calculate harmony score based on color diversity & contrast
  const calculateHarmony = () => {
    let score = 70;
    const colors = [selectedTop?.color, selectedBottom?.color, selectedOuter?.color, selectedShoes?.color].filter(Boolean);
    const uniqueColors = new Set(colors);
    
    if (uniqueColors.size === 1) score += 25; // Monokrom bonus
    else if (uniqueColors.size === 2) score += 28; // Uyumlu ikili bonus
    else if (uniqueColors.size === 3) score += 20; // Dengeli üçlü bonus
    else score += 10;

    return Math.min(score, 99);
  };

  const harmonyScore = calculateHarmony();

  const handleSaveOutfit = () => {
    if (isSaved) return;

    const outfit = {
      id: 'manual-' + Date.now(),
      title: outfitTitle || 'Özel Manuel Kombin',
      top_item: selectedTop,
      bottom_item: selectedBottom,
      outer_item: selectedOuter,
      shoes_item: selectedShoes,
      accessory_item: selectedAccessory,
      reasoning: "Kullanıcı stüdyo tuvalinde kıyafet parçalarını bizzat eşleştirerek özel stil kombinasyonunu oluşturdu.",
      style_tips: ["Kişisel stil tercihinize göre aksesuarları arttırabilir veya dış giyimi omuzlarınıza alabilirsiniz."],
      compatibility_score: harmonyScore,
      weather_suitability: "Özel Tasarım Stil Kombini",
      color_palette: [selectedTop?.color, selectedBottom?.color, selectedOuter?.color].filter(Boolean)
    };

    onAddFavorite(outfit);
    setIsSaved(true);

    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#B5EAD7', '#F7C5CC', '#C7CEEA', '#8D6E63']
    });
  };

  const handleResetCanvas = () => {
    setSelectedTop(null);
    setSelectedBottom(null);
    setSelectedOuter(null);
    setSelectedShoes(null);
    setSelectedAccessory(null);
    setIsSaved(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Banner */}
      <div className="glass-card p-6 bg-gradient-to-r from-[#FAF7F2] via-[#EBFBF5] to-[#FFF0F2]">
        <div className="flex items-center gap-2 mb-1">
          <span className="badge-suyesili px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5" /> Manuel Stil Stüdyosu
          </span>
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#5D4037]">
          Kendi Kombinini Tuvalde Tasarla
        </h2>
        <p className="text-sm text-[#8D6E63]">
          Gardrobundaki parçaları tek tek seçip tuvale yerleştir. Renk tekerleği uyum skorunu canlı incele ve favorilerine kaydet!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Canvas Display & Control Panel */}
        <div className="lg:col-span-2 glass-card p-6 space-y-6 bg-white">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#FAF7F2]">
            <input
              type="text"
              value={outfitTitle}
              onChange={e => { setOutfitTitle(e.target.value); setIsSaved(false); }}
              className="font-serif text-xl font-bold text-[#5D4037] bg-transparent border-b border-dashed border-[#D7CCC8] focus:outline-none focus:border-[#56B998] px-1"
            />

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xl font-extrabold text-[#56B998]">%{harmonyScore}</span>
                <span className="block text-[10px] font-semibold text-[#8D6E63]">Renk Uyumu</span>
              </div>

              <button
                onClick={handleResetCanvas}
                className="p-2.5 rounded-xl border border-[#D7CCC8] text-[#8D6E63] hover:bg-[#FAF7F2]"
                title="Tuvali Temizle"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={handleSaveOutfit}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm ${
                  isSaved
                    ? 'bg-[#FFF0F2] text-[#E89EA7] border border-[#F7C5CC]'
                    : 'bg-[#56B998] text-white hover:opacity-90'
                }`}
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-[#E89EA7]' : ''}`} />
                {isSaved ? 'Kaydedildi' : 'Kombini Kaydet'}
              </button>
            </div>
          </div>

          {/* Combined Visual Canvas */}
          <div className="bg-[#FAF7F2] p-6 rounded-3xl border border-[#D7CCC8]/50 min-h-[360px] flex items-center justify-center">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 w-full">
              {[
                { label: 'Üst Giyim', item: selectedTop, setter: setSelectedTop },
                { label: 'Alt Giyim', item: selectedBottom, setter: setSelectedBottom },
                { label: 'Dış Giyim', item: selectedOuter, setter: setSelectedOuter },
                { label: 'Ayakkabı', item: selectedShoes, setter: setSelectedShoes },
                { label: 'Aksesuar', item: selectedAccessory, setter: setSelectedAccessory }
              ].map((slot, i) => (
                <div key={i} className="bg-white rounded-2xl p-3 border border-[#D7CCC8]/40 shadow-sm flex flex-col justify-between space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold text-[#8D6E63]">
                    <span>{slot.label}</span>
                    {slot.item && (
                      <button onClick={() => slot.setter(null)} className="text-red-400 hover:text-red-600 font-bold">✕</button>
                    )}
                  </div>

                  {slot.item ? (
                    <div className="space-y-1.5">
                      <div className="aspect-square rounded-xl overflow-hidden bg-[#FAF7F2]">
                        <img src={slot.item.image_url} alt={slot.item.name} className="w-full h-full object-cover" />
                      </div>
                      <p className="font-bold text-xs text-[#5D4037] truncate">{slot.item.name}</p>
                      <span className="badge-suyesili px-2 py-0.5 rounded text-[10px] font-semibold block text-center truncate">{slot.item.color}</span>
                    </div>
                  ) : (
                    <div className="aspect-square rounded-xl bg-[#FAF7F2] border border-dashed border-[#D7CCC8] flex flex-col items-center justify-center text-[10px] text-[#8D6E63] p-2 text-center">
                      <Plus className="w-5 h-5 text-[#8D6E63] mb-1" />
                      Parça Seç
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Item Selector Drawers */}
        <div className="glass-card p-6 space-y-4 bg-white overflow-y-auto max-h-[600px]">
          <h3 className="font-serif text-lg font-bold text-[#5D4037] flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#56B998]" /> Gardroptan Eşle
          </h3>

          {/* Slot Selectors */}
          <div className="space-y-4 text-xs">
            {/* Tops */}
            <div>
              <label className="block font-bold text-[#5D4037] mb-1">Üst Giyim</label>
              <select
                value={selectedTop?.id || ''}
                onChange={e => setSelectedTop(wardrobe.find(i => i.id === e.target.value) || null)}
                className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#D7CCC8] font-semibold"
              >
                <option value="">-- Üst Giyim Seç --</option>
                {tops.map(t => (
                  <option key={t.id} value={t.id}>{t.name} ({t.color})</option>
                ))}
              </select>
            </div>

            {/* Bottoms */}
            <div>
              <label className="block font-bold text-[#5D4037] mb-1">Alt Giyim</label>
              <select
                value={selectedBottom?.id || ''}
                onChange={e => setSelectedBottom(wardrobe.find(i => i.id === e.target.value) || null)}
                className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#D7CCC8] font-semibold"
              >
                <option value="">-- Alt Giyim Seç --</option>
                {bottoms.map(b => (
                  <option key={b.id} value={b.id}>{b.name} ({b.color})</option>
                ))}
              </select>
            </div>

            {/* Outers */}
            <div>
              <label className="block font-bold text-[#5D4037] mb-1">Dış Giyim</label>
              <select
                value={selectedOuter?.id || ''}
                onChange={e => setSelectedOuter(wardrobe.find(i => i.id === e.target.value) || null)}
                className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#D7CCC8] font-semibold"
              >
                <option value="">-- Dış Giyim Seç (Opsiyonel) --</option>
                {outers.map(o => (
                  <option key={o.id} value={o.id}>{o.name} ({o.color})</option>
                ))}
              </select>
            </div>

            {/* Shoes */}
            <div>
              <label className="block font-bold text-[#5D4037] mb-1">Ayakkabı</label>
              <select
                value={selectedShoes?.id || ''}
                onChange={e => setSelectedShoes(wardrobe.find(i => i.id === e.target.value) || null)}
                className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#D7CCC8] font-semibold"
              >
                <option value="">-- Ayakkabı Seç --</option>
                {shoesList.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.color})</option>
                ))}
              </select>
            </div>

            {/* Accessories */}
            <div>
              <label className="block font-bold text-[#5D4037] mb-1">Aksesuar</label>
              <select
                value={selectedAccessory?.id || ''}
                onChange={e => setSelectedAccessory(wardrobe.find(i => i.id === e.target.value) || null)}
                className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#D7CCC8] font-semibold"
              >
                <option value="">-- Aksesuar Seç (Opsiyonel) --</option>
                {accessories.map(a => (
                  <option key={a.id} value={a.id}>{a.name} ({a.color})</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
