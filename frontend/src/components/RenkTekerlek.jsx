import React, { useMemo } from 'react';
import { Palette, Info } from 'lucide-react';

const HUE_MAP = {
  'Kırmızı': 0,
  'Bej': 30,
  'Ekru': 45,
  'Yeşil': 120,
  'Mavi': 210,
  'Lacivert': 235,
  'Pudra Pembe': 350,
  'Siyah': null,
  'Beyaz': null
};

const REAL_COLORS = {
  'Kırmızı': '#E53935',
  'Bej': '#D7CCC8',
  'Ekru': '#F5F5DC',
  'Yeşil': '#2E7D32',
  'Mavi': '#42A5F5',
  'Lacivert': '#1A237E',
  'Pudra Pembe': '#F7C5CC',
  'Siyah': '#212121',
  'Beyaz': '#E0E0E0'
};

export default function RenkTekerlek({ selectedColors = [] }) {
  const { chromaticColors, achromaticColors, harmony } = useMemo(() => {
    const chromatic = [];
    const achromatic = [];
    
    selectedColors.forEach(c => {
      if (HUE_MAP[c] !== null && HUE_MAP[c] !== undefined) {
        chromatic.push({ name: c, hue: HUE_MAP[c], hex: REAL_COLORS[c] });
      } else if (REAL_COLORS[c]) {
        achromatic.push({ name: c, hex: REAL_COLORS[c] });
      }
    });

    let harmonyType = { label: 'Serbest Kombinasyon', color: 'bg-kahve-100 text-kahve-800' };

    if (chromatic.length === 2) {
      const diff = Math.abs(chromatic[0].hue - chromatic[1].hue);
      if (diff >= 150 && diff <= 210) {
        harmonyType = { label: 'Komplementer (Tamamlayıcı)', color: 'bg-green-100 text-green-800' };
      } else if (diff >= 20 && diff <= 70) {
        harmonyType = { label: 'Analog (Yakın Tonlar)', color: 'bg-blue-100 text-blue-800' };
      }
    } else if (chromatic.length === 3) {
      const hues = chromatic.map(c => c.hue).sort((a, b) => a - b);
      const diff1 = Math.abs(hues[0] - hues[1]);
      const diff2 = Math.abs(hues[1] - hues[2]);
      const diff3 = Math.abs((hues[2] - 360) - hues[0]);
      
      if (
        (diff1 > 90 && diff1 < 150) && 
        (diff2 > 90 && diff2 < 150) && 
        (diff3 > 90 && diff3 < 150)
      ) {
        harmonyType = { label: 'Triadik (Üçlü Uyum)', color: 'bg-purple-100 text-purple-800' };
      }
    }

    return { chromaticColors: chromatic, achromaticColors: achromatic, harmony: harmonyType };
  }, [selectedColors]);

  return (
    <div className="p-8 bg-cream rounded-3xl shadow-soft flex flex-col items-center text-kahve-700 animate-fade-in w-full max-w-lg mx-auto">
      <h2 className="text-2xl font-serif font-bold mb-6 flex items-center gap-2">
        <Palette className="w-6 h-6 text-pudra" />
        Renk Uyumu
      </h2>

      <div className="relative mb-8">
        {/* The Color Wheel */}
        <div 
          className="w-[240px] h-[240px] rounded-full shadow-card border-4 border-white"
          style={{
            background: 'conic-gradient(red, #ff7b00, yellow, #00ff00, cyan, blue, #8800ff, magenta, red)'
          }}
        ></div>
        
        {/* Dots */}
        {chromaticColors.map((color, idx) => {
          const angle = (color.hue - 90) * (Math.PI / 180);
          const radius = 100; // slightly inside
          const cx = 120 + radius * Math.cos(angle);
          const cy = 120 + radius * Math.sin(angle);
          
          return (
            <div 
              key={idx}
              className="absolute w-5 h-5 rounded-full border-2 border-white shadow-sm transition-all duration-500"
              style={{
                left: `${cx}px`,
                top: `${cy}px`,
                backgroundColor: color.hex,
                transform: 'translate(-50%, -50%)'
              }}
              title={color.name}
            ></div>
          );
        })}
      </div>

      <div className={`px-4 py-2 rounded-full font-bold text-sm mb-6 flex items-center gap-2 shadow-sm ${harmony.color}`}>
        <Info className="w-4 h-4" />
        {harmony.label}
      </div>

      <div className="flex flex-wrap justify-center gap-3 w-full">
        {selectedColors.map((c, i) => (
          <div key={i} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-100">
            <span 
              className="w-3 h-3 rounded-full shadow-inner" 
              style={{ backgroundColor: REAL_COLORS[c] || '#ccc' }}
            ></span>
            <span className="text-sm font-medium">{c}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
