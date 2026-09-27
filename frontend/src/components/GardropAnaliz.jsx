import React, { useMemo } from 'react';
import { PieChart, BarChart2, Calendar, AlertCircle } from 'lucide-react';

const COLOR_MAP = {
  'Siyah': '#212121',
  'Kırmızı': '#E53935',
  'Lacivert': '#1A237E',
  'Bej': '#D7CCC8',
  'Ekru': '#F5F5DC',
  'Mavi': '#42A5F5',
  'Yeşil': '#2E7D32',
  'Beyaz': '#E0E0E0',
  'Pudra Pembe': '#F7C5CC'
};

const CATEGORY_COLORS = {
  'Üst': 'var(--color-pudra, #fecdd3)',
  'Alt': 'var(--color-suyesil, #bbf7d0)',
  'Dış': 'var(--color-bebe, #bfdbfe)',
  'Ayakkabı': 'var(--color-kahve, #d6d3d1)',
  'Aksesuar': '#fde047'
};

export default function GardropAnaliz({ wardrobe = [], combos = [] }) {
  // Category Dist
  const categoryCounts = useMemo(() => {
    const counts = {};
    wardrobe.forEach(item => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, [wardrobe]);

  const totalItems = wardrobe.length || 1;
  let currentAngle = 0;
  const pieGradients = Object.entries(categoryCounts).map(([cat, count]) => {
    const percentage = (count / totalItems) * 100;
    const start = currentAngle;
    const end = currentAngle + percentage;
    currentAngle = end;
    return `${CATEGORY_COLORS[cat] || '#ccc'} ${start}% ${end}%`;
  }).join(', ');

  // Color Dist
  const colorCounts = useMemo(() => {
    const counts = {};
    wardrobe.forEach(item => {
      counts[item.color] = (counts[item.color] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [wardrobe]);

  // Seasonal Dist
  const seasonCounts = useMemo(() => {
    const counts = { 'Yaz': 0, 'Kış': 0, 'İlkbahar': 0, 'Sonbahar': 0, 'Dört Mevsim': 0 };
    wardrobe.forEach(item => {
      if (counts[item.season] !== undefined) {
        counts[item.season] += 1;
      }
    });
    return counts;
  }, [wardrobe]);

  // Least combined items
  const itemComboCounts = useMemo(() => {
    const counts = {};
    wardrobe.forEach(item => { counts[item.id] = 0; });
    combos.forEach(combo => {
      combo.items?.forEach(itemId => {
        if (counts[itemId] !== undefined) counts[itemId]++;
      });
    });
    
    return wardrobe
      .map(item => ({ ...item, comboCount: counts[item.id] }))
      .sort((a, b) => a.comboCount - b.comboCount)
      .slice(0, 3);
  }, [wardrobe, combos]);

  return (
    <div className="p-6 bg-cream min-h-screen text-kahve-600 animate-fade-in">
      <h1 className="text-3xl font-serif font-bold mb-8 text-kahve-800 flex items-center gap-3">
        <PieChart className="w-8 h-8 text-pudra" />
        Gardrop Analizi
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Category Pie Chart */}
        <div className="card glass p-6 rounded-3xl shadow-soft bg-white">
          <h2 className="text-xl font-bold mb-6 font-serif flex items-center gap-2">
            <PieChart className="w-5 h-5 text-suyesil" />
            Kategori Dağılımı
          </h2>
          <div className="flex items-center justify-around">
            <div 
              className="w-48 h-48 rounded-full shadow-inner"
              style={{ background: `conic-gradient(${pieGradients || '#ccc 0% 100%'})` }}
            ></div>
            <div className="flex flex-col gap-2">
              {Object.entries(categoryCounts).map(([cat, count]) => (
                <div key={cat} className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[cat] || '#ccc' }}></span>
                  <span className="text-sm font-medium">{cat} ({count})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Color Distribution */}
        <div className="card glass p-6 rounded-3xl shadow-soft bg-white">
          <h2 className="text-xl font-bold mb-6 font-serif flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-bebe" />
            Renk Dağılımı
          </h2>
          <div className="flex flex-col gap-4">
            {colorCounts.map(([color, count]) => (
              <div key={color} className="flex items-center gap-3">
                <div className="w-24 text-sm font-medium truncate">{color}</div>
                <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${(count / totalItems) * 100}%`,
                      backgroundColor: COLOR_MAP[color] || '#999'
                    }}
                  ></div>
                </div>
                <div className="w-8 text-sm font-bold text-right">{count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Seasonal Dist */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 font-serif flex items-center gap-2">
          <Calendar className="w-5 h-5 text-pudra" />
          Mevsimsel Dağılım
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(seasonCounts).map(([season, count]) => (
            <div key={season} className="p-4 bg-white rounded-2xl shadow-sm text-center border-b-4 border-suyesil">
              <div className="text-sm text-gray-500 mb-1">{season}</div>
              <div className="text-2xl font-bold text-kahve-800">{count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Least Combined Items */}
      <div>
        <h2 className="text-xl font-bold mb-4 font-serif flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-400" />
          En Az Kombinlenen Parçalar
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {itemComboCounts.map(item => (
            <div key={item.id} className="relative bg-white rounded-2xl shadow-card p-4 flex flex-col items-center animate-slide-up">
              <div className="absolute top-3 right-3 bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Az Kullanılıyor
              </div>
              <div className="w-32 h-32 bg-gray-50 rounded-xl mb-4 overflow-hidden flex items-center justify-center">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-400 text-xs">Görsel Yok</span>
                )}
              </div>
              <h3 className="font-medium text-center">{item.name}</h3>
              <p className="text-xs text-gray-500 mt-1">Kombin Sayısı: {item.comboCount}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
