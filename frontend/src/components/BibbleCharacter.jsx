import React, { useState, useEffect, useMemo } from 'react';

/* ═══════════════════════════════════════════════════════════════════════
   BibbleCharacter v2.0 — Animasyonlu Bibble (CSS/SVG)
   
   Gerçek Bibble'dan ilham alınarak tasarlanmış — kanat çırpan, zıplayan,
   tepki veren küçük mor-yeşil peri karakteri.
   
   Props:
     - mood: 'mutlu' | 'saskin' | 'havali' | 'kizgin' | 'heyecanli' | 'romantik' | 'melankolik' | 'asi' | 'cool' | 'nostaljik' | 'idle'
     - size: 'sm' | 'md' | 'lg' | 'xl'
     - flying: true/false — idle uçma animasyonu
     - showReaction: true/false — kombine tepki animasyonu
     - reactionText: string — tepki baloncuğu metni
   ═══════════════════════════════════════════════════════════════════════ */

const MOOD_CONFIG = {
  mutlu:      { emoji: '✨', bgGlow: '#e879f9', bodyAnim: 'bibbleBounceHappy', wingSpeed: '0.3s' },
  saskin:     { emoji: '😮', bgGlow: '#818cf8', bodyAnim: 'bibbleWobble', wingSpeed: '0.2s' },
  havali:     { emoji: '😎', bgGlow: '#22d3ee', bodyAnim: 'bibbleFloat', wingSpeed: '0.5s' },
  kizgin:     { emoji: '🔥', bgGlow: '#f87171', bodyAnim: 'bibbleShake', wingSpeed: '0.15s' },
  heyecanli:  { emoji: '🎉', bgGlow: '#f472b6', bodyAnim: 'bibbleBounceHappy', wingSpeed: '0.2s' },
  romantik:   { emoji: '💕', bgGlow: '#fb7185', bodyAnim: 'bibbleFloat', wingSpeed: '0.4s' },
  melankolik: { emoji: '🌧️', bgGlow: '#94a3b8', bodyAnim: 'bibbleSad', wingSpeed: '0.8s' },
  asi:        { emoji: '⚡', bgGlow: '#a855f7', bodyAnim: 'bibbleShake', wingSpeed: '0.2s' },
  cool:       { emoji: '🧊', bgGlow: '#06b6d4', bodyAnim: 'bibbleFloat', wingSpeed: '0.5s' },
  nostaljik:  { emoji: '📻', bgGlow: '#f59e0b', bodyAnim: 'bibbleFloat', wingSpeed: '0.6s' },
  idle:       { emoji: '✨', bgGlow: '#c084fc', bodyAnim: 'bibbleIdle', wingSpeed: '0.4s' },
};

const SIZE_MAP = {
  sm: { w: 40, h: 40, text: 'text-[8px]' },
  md: { w: 64, h: 64, text: 'text-[10px]' },
  lg: { w: 96, h: 96, text: 'text-xs' },
  xl: { w: 128, h: 128, text: 'text-sm' },
};

/* ── SVG Bibble Karakteri ── */
function BibbleSVG({ size = 64, wingSpeed = '0.4s', mood = 'idle' }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} style={{ overflow: 'visible' }}>
      <defs>
        <radialGradient id="bodyGrad" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#a7f3d0" />
          <stop offset="100%" stopColor="#6ee7b7" />
        </radialGradient>
        <radialGradient id="bellyGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#d8b4fe" />
          <stop offset="100%" stopColor="#c084fc" />
        </radialGradient>
        <radialGradient id="cheekGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fbcfe8" />
          <stop offset="100%" stopColor="#f9a8d4" />
        </radialGradient>
      </defs>
      
      {/* Sol Kanat */}
      <g style={{ transformOrigin: '35px 45px', animation: `bibbleWingFlap ${wingSpeed} ease-in-out infinite alternate` }}>
        <ellipse cx="18" cy="38" rx="18" ry="12" fill="#c4b5fd" opacity="0.7" transform="rotate(-30 18 38)" />
        <ellipse cx="15" cy="32" rx="14" ry="9" fill="#ddd6fe" opacity="0.5" transform="rotate(-35 15 32)" />
      </g>
      
      {/* Sağ Kanat */}
      <g style={{ transformOrigin: '85px 45px', animation: `bibbleWingFlap ${wingSpeed} ease-in-out infinite alternate-reverse` }}>
        <ellipse cx="102" cy="38" rx="18" ry="12" fill="#c4b5fd" opacity="0.7" transform="rotate(30 102 38)" />
        <ellipse cx="105" cy="32" rx="14" ry="9" fill="#ddd6fe" opacity="0.5" transform="rotate(35 105 32)" />
      </g>
      
      {/* Gövde */}
      <ellipse cx="60" cy="62" rx="28" ry="32" fill="url(#bodyGrad)" />
      
      {/* Karnı — mor lekeler */}
      <ellipse cx="60" cy="70" rx="18" ry="20" fill="url(#bellyGrad)" opacity="0.4" />
      <circle cx="50" cy="65" r="5" fill="#c084fc" opacity="0.3" />
      <circle cx="68" cy="72" r="4" fill="#c084fc" opacity="0.25" />
      <circle cx="55" cy="78" r="3.5" fill="#c084fc" opacity="0.3" />
      
      {/* Baş */}
      <ellipse cx="60" cy="35" rx="22" ry="20" fill="url(#bodyGrad)" />
      
      {/* Kulaklar */}
      <ellipse cx="38" cy="22" rx="6" ry="10" fill="#86efac" transform="rotate(-15 38 22)" />
      <ellipse cx="40" cy="22" rx="4" ry="7" fill="#bbf7d0" transform="rotate(-15 40 22)" />
      <ellipse cx="82" cy="22" rx="6" ry="10" fill="#86efac" transform="rotate(15 82 22)" />
      <ellipse cx="80" cy="22" rx="4" ry="7" fill="#bbf7d0" transform="rotate(15 80 22)" />
      
      {/* Saç (pembe) */}
      <ellipse cx="60" cy="18" rx="16" ry="10" fill="#f9a8d4" />
      <ellipse cx="55" cy="14" rx="8" ry="7" fill="#fbcfe8" />
      <ellipse cx="65" cy="15" rx="7" ry="6" fill="#f472b6" opacity="0.6" />
      <circle cx="60" cy="12" r="5" fill="#f472b6" />
      
      {/* Gözler */}
      <ellipse cx="50" cy="35" rx="6" ry="7" fill="white" />
      <ellipse cx="70" cy="35" rx="6" ry="7" fill="white" />
      <circle cx={mood === 'saskin' ? 51 : 52} cy="36" r="3.5" fill="#3b0764" />
      <circle cx={mood === 'saskin' ? 69 : 68} cy="36" r="3.5" fill="#3b0764" />
      <circle cx="53" cy="34" r="1.2" fill="white" />
      <circle cx="69" cy="34" r="1.2" fill="white" />
      
      {/* Burun */}
      <ellipse cx="60" cy="41" rx="3" ry="2.5" fill="#f9a8d4" />
      
      {/* Ağız — mood'a göre */}
      {mood === 'mutlu' || mood === 'heyecanli' ? (
        <path d="M52 46 Q60 54 68 46" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" />
      ) : mood === 'saskin' ? (
        <ellipse cx="60" cy="48" rx="4" ry="5" fill="#7c3aed" opacity="0.6" />
      ) : mood === 'kizgin' || mood === 'asi' ? (
        <path d="M53 48 Q60 44 67 48" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" />
      ) : mood === 'melankolik' ? (
        <path d="M53 49 Q60 45 67 49" fill="none" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" />
      ) : (
        <path d="M54 47 Q60 51 66 47" fill="none" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" />
      )}
      
      {/* Yanaklar */}
      <circle cx="42" cy="42" r="4" fill="url(#cheekGrad)" opacity="0.5" />
      <circle cx="78" cy="42" r="4" fill="url(#cheekGrad)" opacity="0.5" />
      
      {/* Ayaklar */}
      <ellipse cx="50" cy="92" rx="7" ry="4" fill="#86efac" />
      <ellipse cx="70" cy="92" rx="7" ry="4" fill="#86efac" />
      
      {/* Kollar */}
      <ellipse cx="33" cy="60" rx="5" ry="8" fill="#6ee7b7" transform="rotate(15 33 60)" />
      <ellipse cx="87" cy="60" rx="5" ry="8" fill="#6ee7b7" transform="rotate(-15 87 60)" />
    </svg>
  );
}

export default function BibbleCharacter({
  mood = 'idle',
  size = 'md',
  flying = false,
  showReaction = false,
  reactionText = '',
  className = '',
}) {
  const [sparkles, setSparkles] = useState([]);
  const config = MOOD_CONFIG[mood] || MOOD_CONFIG.idle;
  const sizeConfig = SIZE_MAP[size] || SIZE_MAP.md;

  // Sparkle efekti
  useEffect(() => {
    if (mood === 'heyecanli' || mood === 'mutlu') {
      const interval = setInterval(() => {
        setSparkles(prev => {
          const newSparkle = {
            id: Date.now() + Math.random(),
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 8 + 4,
          };
          return [...prev.slice(-6), newSparkle];
        });
      }, 500);
      return () => clearInterval(interval);
    } else {
      setSparkles([]);
    }
  }, [mood]);

  return (
    <div className={`relative inline-flex flex-col items-center ${className}`}>
      {/* Sparkle parçacıkları */}
      {sparkles.map(s => (
        <div
          key={s.id}
          className="absolute pointer-events-none"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            fontSize: `${s.size}px`,
            animation: 'sparkleFloat 1s ease-out forwards',
          }}
        >
          ✨
        </div>
      ))}

      {/* Glow efekti */}
      <div
        className="absolute inset-0 rounded-full blur-xl opacity-30"
        style={{ backgroundColor: config.bgGlow }}
      />

      {/* Ana Bibble */}
      <div
        style={{
          width: sizeConfig.w,
          height: sizeConfig.h,
          animation: flying
            ? 'bibbleFlyAround 3s ease-in-out infinite'
            : `${config.bodyAnim} 1.5s ease-in-out infinite`,
        }}
      >
        <BibbleSVG size={sizeConfig.w} wingSpeed={config.wingSpeed} mood={mood} />
      </div>

      {/* Mood emoji overlay */}
      {mood !== 'idle' && (
        <div
          className="absolute -top-1 -right-1 text-lg"
          style={{ animation: 'emojiBounce 0.6s ease-in-out infinite alternate' }}
        >
          {config.emoji}
        </div>
      )}

      {/* Tepki baloncuğu */}
      {showReaction && reactionText && (
        <div
          className={`mt-2 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 ${sizeConfig.text} font-bold shadow-md max-w-[180px] text-center relative`}
          style={{ animation: 'slideUp 0.4s ease-out' }}
        >
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-gradient-to-br from-purple-100 to-pink-100 rotate-45 rounded-sm" />
          {reactionText}
        </div>
      )}
    </div>
  );
}

/* Küçük uçan Bibble — Sayfa arka planında süzülen animasyonlu versiyon */
export function FloatingBibble({ active = true }) {
  const [position, setPosition] = useState({ x: 85, y: 15 });

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setPosition({
        x: 60 + Math.sin(Date.now() / 3000) * 25,
        y: 10 + Math.cos(Date.now() / 2500) * 12,
      });
    }, 50);
    return () => clearInterval(interval);
  }, [active]);

  if (!active) return null;

  return (
    <div
      className="fixed pointer-events-none z-40 transition-all duration-1000 ease-in-out opacity-40 hover:opacity-70"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
      }}
    >
      <div style={{ animation: 'bibbleFlyAround 2s ease-in-out infinite' }}>
        <BibbleSVG size={48} wingSpeed="0.25s" mood="idle" />
      </div>
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
        {[0, 1, 2].map(i => (
          <span
            key={i}
            className="text-[6px]"
            style={{ animation: `sparkleFloat 1.5s ease-out infinite`, animationDelay: `${i * 0.3}s` }}
          >
            ✨
          </span>
        ))}
      </div>
    </div>
  );
}
