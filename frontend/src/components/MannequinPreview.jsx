import React, { useState, useMemo, useEffect } from 'react';
import { X, Camera } from 'lucide-react';
import html2canvas from 'html2canvas';

/* ═══════════════════════════════════════════════════════════════════════
   Gerçekçi İnsan Silueti v3.0 — Anatomik olarak doğru, uzun, zarif form.
   Referans görsel baz alınarak: belirgin yüz hattı, ince bel, doğal
   kalça geçişi, uzun bacaklar, belirgin ayak formu.
   Cinsiyet + vücut tipine göre bezier curve'ler değişir.
   ═══════════════════════════════════════════════════════════════════════ */
export const DynamicSilhouette = ({ bodyType, gender }) => {
  const isMale = gender === 'Erkek';

  const dims = useMemo(() => {
    if (isMale) {
      switch (bodyType.toLowerCase()) {
        case 'ters üçgen': return { shoulder: 30, bust: 24, waist: 18, hip: 17, legW: 7.5, neckW: 4 };
        case 'üçgen': return { shoulder: 20, bust: 20, waist: 22, hip: 24, legW: 8.5, neckW: 3.8 };
        case 'kaşık': case 'oval': case 'elma': return { shoulder: 22, bust: 22, waist: 26, hip: 22, legW: 8.5, neckW: 4 };
        case 'dikdörtgen': return { shoulder: 23, bust: 22, waist: 21, hip: 21, legW: 7.5, neckW: 3.8 };
        case 'kum saati': return { shoulder: 26, bust: 24, waist: 17, hip: 23, legW: 7.5, neckW: 3.8 };
        case 'atletik': return { shoulder: 28, bust: 24, waist: 19, hip: 20, legW: 7.5, neckW: 4 };
        default: return { shoulder: 24, bust: 22, waist: 19, hip: 20, legW: 7.5, neckW: 3.8 };
      }
    } else {
      switch (bodyType.toLowerCase()) {
        case 'ters üçgen': return { shoulder: 25, bust: 23, waist: 15, hip: 17, legW: 6.5, neckW: 3.2 };
        case 'üçgen': case 'armut': return { shoulder: 18, bust: 18, waist: 15, hip: 27, legW: 7.5, neckW: 3.2 };
        case 'kaşık': case 'elma': case 'oval': return { shoulder: 20, bust: 21, waist: 24, hip: 21, legW: 7.5, neckW: 3.4 };
        case 'dikdörtgen': return { shoulder: 20, bust: 19, waist: 18, hip: 19, legW: 6.5, neckW: 3.2 };
        case 'kum saati': return { shoulder: 22, bust: 23, waist: 13, hip: 24, legW: 6.5, neckW: 3.2 };
        case 'atletik': return { shoulder: 23, bust: 21, waist: 16, hip: 20, legW: 6.5, neckW: 3.4 };
        default: return { shoulder: 21, bust: 21, waist: 14, hip: 22, legW: 6.5, neckW: 3.2 };
      }
    }
  }, [bodyType, isMale]);

  const { shoulder: s, bust: b, waist: w, hip: h, legW, neckW } = dims;
  const cx = 60;

  // Saç — kadın uzun dalgalı, erkek kısa
  const hairPath = isMale
    ? `M ${cx-9} 13 C ${cx-11} 5, ${cx+11} 5, ${cx+9} 13 L ${cx+8} 18 C ${cx+6} 14, ${cx-6} 14, ${cx-8} 18 Z`
    : `M ${cx-10} 13 C ${cx-12} 3, ${cx+12} 3, ${cx+10} 13
       L ${cx+11} 26 Q ${cx+13} 38, ${cx+9} 46
       L ${cx+7} 48 Q ${cx+5} 44, ${cx+4} 40
       L ${cx-4} 40 Q ${cx-5} 44, ${cx-7} 48
       L ${cx-9} 46 Q ${cx-13} 38, ${cx-11} 26 Z`;

  // Gövde — omuz → göğüs → bel → kalça
  const torsoPath = `
    M ${cx-s} 42
    C ${cx-s} 48, ${cx-b-1} 54, ${cx-b} 62
    C ${cx-b+1} 70, ${cx-w} 78, ${cx-w} 90
    C ${cx-w} 102, ${cx-h+2} 114, ${cx-h} 130
    L ${cx-h} 142
    L ${cx+h} 142
    L ${cx+h} 130
    C ${cx+h-2} 114, ${cx+w} 102, ${cx+w} 90
    C ${cx+w} 78, ${cx+b-1} 70, ${cx+b} 62
    C ${cx+b+1} 54, ${cx+s} 48, ${cx+s} 42
    Z
  `;

  // Sol kol
  const leftArm = `
    M ${cx-s} 44
    C ${cx-s-2} 56, ${cx-s-4} 78, ${cx-s-5} 100
    C ${cx-s-5.5} 112, ${cx-s-5} 124, ${cx-s-4} 140
    L ${cx-s-4} 148
    Q ${cx-s-4} 152, ${cx-s-2} 152
    L ${cx-s-1} 152
    Q ${cx-s+1} 152, ${cx-s+1} 148
    L ${cx-s+1} 140
    C ${cx-s} 124, ${cx-s+1} 112, ${cx-s+1} 100
    C ${cx-s+1} 78, ${cx-s+1} 56, ${cx-s+2} 46
  `;

  // Sağ kol
  const rightArm = `
    M ${cx+s} 44
    C ${cx+s+2} 56, ${cx+s+4} 78, ${cx+s+5} 100
    C ${cx+s+5.5} 112, ${cx+s+5} 124, ${cx+s+4} 140
    L ${cx+s+4} 148
    Q ${cx+s+4} 152, ${cx+s+2} 152
    L ${cx+s+1} 152
    Q ${cx+s-1} 152, ${cx+s-1} 148
    L ${cx+s-1} 140
    C ${cx+s} 124, ${cx+s-1} 112, ${cx+s-1} 100
    C ${cx+s-1} 78, ${cx+s-1} 56, ${cx+s-2} 46
  `;

  // Sol bacak
  const leftLeg = `
    M ${cx-h} 142
    L ${cx-h+2} 142
    C ${cx-legW-2} 170, ${cx-legW-1} 210, ${cx-legW} 250
    C ${cx-legW} 265, ${cx-legW+0.5} 278, ${cx-legW+1} 290
    L ${cx-legW-2} 296
    Q ${cx-legW-4} 300, ${cx-legW-3} 302
    L ${cx-legW+6} 302
    Q ${cx-legW+7} 300, ${cx-legW+5} 296
    L ${cx-legW+4} 290
    C ${cx-legW+4} 278, ${cx-legW+3} 265, ${cx-legW+3} 250
    C ${cx-legW+2} 210, ${cx-2} 170, ${cx-1} 142
  `;

  // Sağ bacak
  const rightLeg = `
    M ${cx+1} 142
    C ${cx+2} 170, ${cx+legW-2} 210, ${cx+legW-3} 250
    C ${cx+legW-3} 265, ${cx+legW-4} 278, ${cx+legW-4} 290
    L ${cx+legW-5} 296
    Q ${cx+legW-7} 300, ${cx+legW-6} 302
    L ${cx+legW+3} 302
    Q ${cx+legW+4} 300, ${cx+legW+2} 296
    L ${cx+legW-1} 290
    C ${cx+legW-0.5} 278, ${cx+legW} 265, ${cx+legW} 250
    C ${cx+legW+1} 210, ${cx+legW+2} 170, ${cx+h-2} 142
    L ${cx+h} 142
  `;

  return (
    <svg
      viewBox="0 0 120 310"
      className="w-full h-full absolute inset-0 pointer-events-none transition-all duration-700 ease-in-out"
      style={{ zIndex: 1 }}
    >
      <defs>
        <linearGradient id="skinGradV3" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f5e6d8" />
          <stop offset="40%" stopColor="#edddd0" />
          <stop offset="100%" stopColor="#e0cbb8" />
        </linearGradient>
        <linearGradient id="hairGradV3" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={isMale ? "#5D4037" : "#3E2723"} />
          <stop offset="100%" stopColor={isMale ? "#795548" : "#5D4037"} />
        </linearGradient>
        <filter id="softShadowV3">
          <feGaussianBlur in="SourceAlpha" stdDeviation="0.8" />
          <feOffset dx="0" dy="0.5" />
          <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g filter="url(#softShadowV3)" opacity="0.92">
        {/* Saç */}
        <path d={hairPath} fill="url(#hairGradV3)" opacity="0.9" />

        {/* Kafa — zarif oval */}
        <ellipse cx={cx} cy="20" rx="9" ry="12" fill="url(#skinGradV3)" />

        {/* Yüz detayları */}
        {/* Kaşlar */}
        <line x1={cx-4} y1="16" x2={cx-2} y2="15.5" stroke="#c4a088" strokeWidth="0.5" strokeLinecap="round" />
        <line x1={cx+2} y1="15.5" x2={cx+4} y2="16" stroke="#c4a088" strokeWidth="0.5" strokeLinecap="round" />
        {/* Gözler */}
        <ellipse cx={cx-3} cy="18" rx="1.2" ry="0.6" fill="#8D6E63" opacity="0.5" />
        <ellipse cx={cx+3} cy="18" rx="1.2" ry="0.6" fill="#8D6E63" opacity="0.5" />
        {/* Burun */}
        <path d={`M ${cx} 19 L ${cx-0.8} 22.5 Q ${cx} 23.2, ${cx+0.8} 22.5`} fill="none" stroke="#d4b5a0" strokeWidth="0.35" strokeLinecap="round" />
        {/* Dudaklar */}
        <path d={`M ${cx-2} 25 Q ${cx} 26.5, ${cx+2} 25`} fill="none" stroke="#d4a090" strokeWidth="0.4" strokeLinecap="round" />
        <path d={`M ${cx-1.5} 25 Q ${cx} 24, ${cx+1.5} 25`} fill="none" stroke="#d4a090" strokeWidth="0.35" strokeLinecap="round" />

        {/* Kulaklar */}
        <ellipse cx={cx-9} cy="20" rx="1.5" ry="2.5" fill="url(#skinGradV3)" />
        <ellipse cx={cx+9} cy="20" rx="1.5" ry="2.5" fill="url(#skinGradV3)" />

        {/* Boyun */}
        <rect x={cx-neckW} y="31" width={neckW*2} height="11" rx="3" fill="url(#skinGradV3)" />

        {/* Gövde */}
        <path d={torsoPath} fill="url(#skinGradV3)" />

        {/* Kollar */}
        <path d={leftArm} fill="url(#skinGradV3)" opacity="0.88" />
        <path d={rightArm} fill="url(#skinGradV3)" opacity="0.88" />

        {/* Eller */}
        <ellipse cx={cx-s-2} cy="152" rx="2.5" ry="3" fill="url(#skinGradV3)" opacity="0.85" />
        <ellipse cx={cx+s+2} cy="152" rx="2.5" ry="3" fill="url(#skinGradV3)" opacity="0.85" />

        {/* Bacaklar */}
        <path d={leftLeg} fill="url(#skinGradV3)" />
        <path d={rightLeg} fill="url(#skinGradV3)" />
      </g>
    </svg>
  );
};

/* ═══════════════════════════════════════════════════════════════════════
   ClothingLayer v2.0 — Kıyafeti mannequin üzerine yerleştirirken
   background removal + clean overlay sağlar
   ═══════════════════════════════════════════════════════════════════════ */
export const ClothingLayer = ({ item, category, onRemove }) => {
  if (!item) return null;

  const posMap = {
    'Üst': { top: '12%', left: '12%', width: '76%', height: '30%' },
    'Alt': { top: '40%', left: '14%', width: '72%', height: '30%' },
    'Dış': { top: '10%', left: '8%', width: '84%', height: '38%' },
    'Elbise': { top: '12%', left: '12%', width: '76%', height: '55%' },
    'Ayakkabı': { top: '82%', left: '18%', width: '64%', height: '16%' },
    'Aksesuar': { top: '2%', left: '30%', width: '40%', height: '12%' },
  };

  const pos = posMap[category] || posMap['Aksesuar'];
  const zMap = { 'Alt': 2, 'Elbise': 2, 'Üst': 3, 'Dış': 4, 'Ayakkabı': 5, 'Aksesuar': 6 };

  return (
    <div
      className="absolute transition-all duration-500 ease-out"
      style={{ ...pos, zIndex: zMap[category] || 3 }}
    >
      <img
        src={item.image || item.image_url}
        alt={item.name}
        className="w-full h-full object-contain drop-shadow-md"
        style={{
          mixBlendMode: 'multiply',
          filter: 'contrast(1.05) saturate(1.1)',
        }}
      />
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════
   MannequinPreview v3.0 — Ana bileşen
   ═══════════════════════════════════════════════════════════════════════ */
export default function MannequinPreview({
  items = [],
  bodyType: initialBodyType = 'normal',
  gender: initialGender = 'Kadın',
  userHeight,
  userWeight,
  onRemoveItem,
  onSaveCombo,
}) {
  const [gender, setGender] = useState(initialGender === 'Erkek' ? 'Erkek' : 'Kadın');
  const [height, setHeight] = useState(userHeight || 165);
  const [weight, setWeight] = useState(userWeight || 55);
  const [isVtonLoading, setIsVtonLoading] = useState(false);

  useEffect(() => {
    if (userHeight) setHeight(Number(userHeight));
  }, [userHeight]);
  useEffect(() => {
    if (userWeight) setWeight(Number(userWeight));
  }, [userWeight]);
  useEffect(() => {
    if (initialGender && initialGender !== 'Belirtilmedi') setGender(initialGender);
  }, [initialGender]);

  // VTON Loading simülasyonu
  useEffect(() => {
    if (items.length > 0) {
      setIsVtonLoading(true);
      const t = setTimeout(() => setIsVtonLoading(false), 1200);
      return () => clearTimeout(t);
    }
  }, [items]);

  const handleCapture = async () => {
    const area = document.getElementById('mannequin-area');
    if (!area || !onSaveCombo) return;

    const hasTop = items.some(i => i?.category === 'Üst' || i?.category === 'Üst Giyim');
    const hasBot = items.some(i => i?.category === 'Alt' || i?.category === 'Alt Giyim');
    const hasDress = items.some(i => i?.category === 'Elbise' || i?.category === 'Elbise Giyim');
    const hasShoes = items.some(i => i?.category === 'Ayakkabı');

    if (!((hasTop && hasBot && hasShoes) || (hasDress && hasShoes))) {
      alert("Kombini kaydetmek için en az Üst+Alt+Ayakkabı veya Elbise+Ayakkabı giyilmiş olmalıdır!");
      return;
    }

    try {
      const canvas = await html2canvas(area, { backgroundColor: null, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      onSaveCombo(imgData, items);
    } catch (err) {
      console.error("Kolaj alınamadı:", err);
    }
  };

  const hasItems = items.length > 0;

  const getItem = (category) => {
    const mappedCats = [category, `${category} Giyim`];
    return items.find(i => mappedCats.includes(i?.category)) || null;
  };

  const topItem = getItem('Üst');
  const botItem = getItem('Alt');
  const outItem = getItem('Dış');
  const dressItem = getItem('Elbise');
  const shoeItem = getItem('Ayakkabı');
  const accItem = getItem('Aksesuar');

  // BMI → Vücut Tipi
  const bodyType = useMemo(() => {
    if (initialBodyType && initialBodyType !== 'normal' && initialBodyType !== 'Belirtilmedi') {
      return initialBodyType;
    }
    if (height && weight) {
      const h = height / 100;
      const bmi = weight / (h * h);
      if (bmi < 18.5) return 'dikdörtgen';
      if (bmi < 25) return 'kum saati';
      if (bmi < 30) return 'armut';
      return 'elma';
    }
    return 'kum saati';
  }, [height, weight, initialBodyType]);

  const bodyLabel = {
    'dikdörtgen': '▬ Dikdörtgen',
    'kum saati': '⏳ Kum Saati',
    'kaşık': '🥄 Kaşık',
    'oval': '🥄 Oval',
    'elma': '🍎 Elma',
    'armut': '🍐 Armut',
    'ters üçgen': '🔻 Ters Üçgen',
    'üçgen': '🔺 Üçgen',
    'atletik': '💪 Atletik',
  }[bodyType.toLowerCase()] || `👗 ${bodyType}`;

  return (
    <div className="flex flex-col h-full p-4 gap-3 animate-fade-in">
      {/* Başlık + Kontroller */}
      <div className="text-center space-y-2">
        <h3 className="font-serif text-lg font-bold text-kahve-600">Sanal Kombin</h3>

        {/* Cinsiyet Seçimi */}
        <div className="flex justify-center gap-2">
          {['Kadın', 'Erkek'].map(g => (
            <button
              key={g}
              onClick={() => setGender(g)}
              className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all duration-200 ${gender === g
                  ? 'bg-kahve-600 text-white shadow-soft'
                  : 'bg-white text-kahve-400 border border-kahve-200/50 hover:bg-cream'
                }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Boy / Kilo */}
        <div className="flex justify-center items-center gap-2">
          <div className="flex flex-col items-center">
            <label className="text-[9px] text-kahve-400 mb-0.5">Boy</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-12 text-[11px] text-center border border-kahve-200 rounded-lg p-0.5 focus:outline-none focus:border-kahve-400 bg-white"
            />
          </div>
          <div className="flex flex-col items-center">
            <label className="text-[9px] text-kahve-400 mb-0.5">Kilo</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-12 text-[11px] text-center border border-kahve-200 rounded-lg p-0.5 focus:outline-none focus:border-kahve-400 bg-white"
            />
          </div>
        </div>

        <p className="text-[10px] text-kahve-500 font-semibold">{bodyLabel}</p>
      </div>

      {/* Manken Alanı */}
      <div
        id="mannequin-area"
        className="flex-1 relative min-h-[400px] bg-gradient-to-b from-white to-cream/40 rounded-3xl overflow-hidden shadow-inner border border-kahve-100 flex items-center justify-center"
      >
        {!hasItems && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-[1px]">
            <p className="text-xs font-semibold text-kahve-500 bg-white/90 backdrop-blur-sm inline-block px-5 py-3 rounded-full shadow-lg border border-kahve-100 text-center animate-pulse-soft">
              👗 Kombinlemek için bir ürün seçin
            </p>
          </div>
        )}

        {isVtonLoading && (
          <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm animate-fade-in">
            <div className="w-10 h-10 border-4 border-kahve-200 border-t-kahve-500 rounded-full animate-spin mb-3"></div>
            <p className="text-[10px] font-extrabold text-kahve-600 bg-white/90 px-3 py-1 rounded-full shadow-sm">AI Virtual Try-On işleniyor...</p>
          </div>
        )}

        <div className="relative w-full h-full max-w-[240px] mx-auto">
          <DynamicSilhouette bodyType={bodyType} gender={gender} />
          <ClothingLayer item={botItem} category="Alt" onRemove={onRemoveItem} />
          {dressItem && <ClothingLayer item={dressItem} category="Elbise" onRemove={onRemoveItem} />}
          <ClothingLayer item={topItem} category="Üst" onRemove={onRemoveItem} />
          <ClothingLayer item={outItem} category="Dış" onRemove={onRemoveItem} />
          <ClothingLayer item={shoeItem} category="Ayakkabı" onRemove={onRemoveItem} />
          <ClothingLayer item={accItem} category="Aksesuar" onRemove={onRemoveItem} />
        </div>
      </div>

      {/* Seçili Ürünler Listesi */}
      {hasItems && (
        <div className="space-y-1 border-t border-kahve-100/50 pt-2 max-h-[120px] overflow-y-auto">
          {items.filter(Boolean).map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-xs bg-white/70 backdrop-blur-sm p-1 rounded-xl border border-kahve-50 shadow-sm">
              <div className="w-7 h-7 rounded-lg overflow-hidden bg-white shrink-0 border border-kahve-100/50 flex items-center justify-center">
                {(item.image || item.image_url) ? (
                  <img src={item.image || item.image_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[9px] text-kahve-300">👕</span>
                )}
              </div>
              <div className="truncate flex-1">
                <span className="font-bold text-kahve-600 block truncate text-[10px]">{item.name}</span>
              </div>
              {onRemoveItem && (
                <button
                  onClick={() => onRemoveItem(item.category)}
                  className="w-5 h-5 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center transition-colors shrink-0"
                >
                  <X className="w-3 h-3 text-red-500" />
                </button>
              )}
            </div>
          ))}

          <button
            onClick={handleCapture}
            className="w-full mt-2 py-2 flex items-center justify-center gap-2 btn-primary rounded-xl text-xs"
          >
            <Camera className="w-4 h-4" />
            Bu Kombini Kaydet
          </button>
        </div>
      )}
    </div>
  );
}
