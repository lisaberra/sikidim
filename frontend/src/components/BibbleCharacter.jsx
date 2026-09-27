import React, { useState, useEffect, useMemo } from 'react';

/* ═══════════════════════════════════════════════════════════════════════
   BibbleCharacter v1.0 — Uçan, tepki veren Bibble bileşeni
   Props:
     - mood: 'mutlu' | 'saskin' | 'havali' | 'kizgin' | 'heyecanli' | 'romantik' | 'melankolik' | 'asi' | 'cool' | 'nostaljik' | 'idle'
     - size: 'sm' | 'md' | 'lg' | 'xl'
     - flying: true/false — idle uçma animasyonu
     - showReaction: true/false — kombine tepki animasyonu
     - reactionText: string — tepki baloncuğu metni
   ═══════════════════════════════════════════════════════════════════════ */

const BIBBLE_IMAGES = {
  default: '/bibble/bibble1.jpg',
  happy: '/bibble/bibble2.jpg',
  surprised: '/bibble/bibble3.jpg',
  summer: '/bibble/bibble_summer.jpg',
  winter: '/bibble/bibble_winter.jpg',
};

const MOOD_CONFIG = {
  mutlu: { img: 'happy', animation: 'bibbleBounce', emoji: '✨', bgColor: 'from-yellow-200 to-pink-200' },
  saskin: { img: 'surprised', animation: 'bibbleWobble', emoji: '😮', bgColor: 'from-blue-200 to-purple-200' },
  havali: { img: 'default', animation: 'bibbleFloat', emoji: '😎', bgColor: 'from-indigo-200 to-cyan-200' },
  kizgin: { img: 'surprised', animation: 'bibbleShake', emoji: '🔥', bgColor: 'from-red-200 to-orange-200' },
  heyecanli: { img: 'happy', animation: 'bibbleBounce', emoji: '🎉', bgColor: 'from-pink-200 to-purple-200' },
  romantik: { img: 'happy', animation: 'bibbleFloat', emoji: '💕', bgColor: 'from-pink-200 to-rose-200' },
  melankolik: { img: 'default', animation: 'bibbleFloat', emoji: '🌧️', bgColor: 'from-slate-200 to-blue-200' },
  asi: { img: 'surprised', animation: 'bibbleShake', emoji: '⚡', bgColor: 'from-purple-300 to-red-200' },
  cool: { img: 'default', animation: 'bibbleFloat', emoji: '🧊', bgColor: 'from-cyan-200 to-teal-200' },
  nostaljik: { img: 'default', animation: 'bibbleFloat', emoji: '📻', bgColor: 'from-amber-200 to-orange-200' },
  idle: { img: 'default', animation: 'bibbleFly', emoji: '✨', bgColor: 'from-purple-200 to-pink-200' },
};

const SIZE_MAP = {
  sm: { container: 'w-10 h-10', text: 'text-[8px]' },
  md: { container: 'w-16 h-16', text: 'text-[10px]' },
  lg: { container: 'w-24 h-24', text: 'text-xs' },
  xl: { container: 'w-32 h-32', text: 'text-sm' },
};

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
  const imgSrc = BIBBLE_IMAGES[config.img] || BIBBLE_IMAGES.default;

  // Sparkle efekti
  useEffect(() => {
    if (mood === 'heyecanli' || mood === 'mutlu') {
      const interval = setInterval(() => {
        setSparkles(prev => {
          const newSparkle = {
            id: Date.now(),
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 8 + 4,
          };
          return [...prev.slice(-8), newSparkle];
        });
      }, 400);
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
          className="absolute pointer-events-none animate-sparkle"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            fontSize: `${s.size}px`,
          }}
        >
          ✨
        </div>
      ))}

      {/* Ana Bibble görseli */}
      <div
        className={`${sizeConfig.container} relative ${flying ? 'animate-bibbleFly' : `animate-${config.animation}`}`}
        style={{
          borderWidth: '3px',
          boxShadow: '0 8px 32px rgba(147, 51, 234, 0.3)',
        }}
      >
        <img
          src={imgSrc}
          alt="Bibble"
          className="w-full h-full object-cover"
        />

        {/* Mood emoji overlay */}
        {mood !== 'idle' && (
          <div className="absolute -top-1 -right-1 text-lg animate-bounce">
            {config.emoji}
          </div>
        )}
      </div>

      {/* Tepki baloncuğu */}
      {showReaction && reactionText && (
        <div className={`mt-2 px-3 py-1.5 rounded-2xl bg-gradient-to-r ${config.bgColor} text-kahve-700 ${sizeConfig.text} font-bold shadow-md animate-slideUp max-w-[180px] text-center relative`}>
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-gradient-to-br from-purple-200 to-pink-200 rotate-45 rounded-sm"></div>
          {reactionText}
        </div>
      )}
    </div>
  );
}

/* Küçük uçan Bibble — Sayfa arka planında süzülen versiyon */
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
      className="fixed pointer-events-none z-40 transition-all duration-1000 ease-in-out opacity-30 hover:opacity-60"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: `rotate(${Math.sin(Date.now() / 2000) * 10}deg)`,
      }}
    >
      <div className="w-16 h-16 animate-bibbleFly drop-shadow-2xl">
        <img src="/bibble/bibble1.jpg" alt="" className="w-full h-full object-contain" style={{ mixBlendMode: 'multiply' }} />
      </div>
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
        {[0, 1, 2].map(i => (
          <span key={i} className="text-[6px] animate-sparkle" style={{ animationDelay: `${i * 0.2}s` }}>✨</span>
        ))}
      </div>
    </div>
  );
}
