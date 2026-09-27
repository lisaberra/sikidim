import React, { useState } from 'react';
import { Shirt, Heart, Sparkles, Clock, MapPin, PieChart, CalendarDays, FlaskConical, Music, User, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { id: 'gardrobum',  label: 'Gardırobum',        icon: Shirt },
  { id: 'favoriler',  label: 'Favoriler',          icon: Heart },
  { id: 'bibble',     label: "Bibble'a Sor",       icon: Sparkles },
  { id: 'gecmis',     label: 'Geçmiş Kombinler',   icon: Clock },
  { id: 'sehir',      label: 'Şehrin Vibeı',       icon: MapPin },
  { id: 'sarki',      label: 'Şarkına Göre',       icon: Music },
  { id: 'analiz',     label: 'Gardrop Analizi',     icon: PieChart },
  { id: 'takvim',     label: 'Takvim',              icon: CalendarDays },
  { id: 'ablation',   label: 'Deneysel Kıyaslama',  icon: FlaskConical },
];

export default function Sidebar({ activePage, setActivePage, onOpenAuth, onOpenProfile, onOpenAdvisor }) {
  const { isLoggedIn, user } = useAuth();

  return (
    <aside className="hidden md:flex w-64 flex-col bg-white/70 backdrop-blur-xl border-r border-kahve-200/30 p-5 gap-6 shrink-0">
      {/* Logo */}
      <button onClick={() => setActivePage('gardrobum')} className="flex items-center gap-3 px-2 pt-1 pb-2 text-left hover:opacity-80 transition-opacity">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pudra-300 via-bebe-300 to-suyesil-300 flex items-center justify-center shadow-soft shrink-0">
          <Shirt className="w-5 h-5 text-kahve-600" />
        </div>
        <div>
          <h1 className="font-serif text-lg font-bold text-kahve-600 leading-tight">Bu Gün</h1>
          <p className="text-[11px] font-semibold text-kahve-400 -mt-0.5">Ne Giysem?</p>
        </div>
      </button>

      {/* User Profile Button */}
      <div className="px-1">
        {isLoggedIn ? (
          <button
            onClick={onOpenProfile}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-gradient-to-r from-pudra-50 to-suyesil-50 border border-pudra-200/50 hover:shadow-soft transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pudra-300 to-bebe-300 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="text-left flex-1 min-w-0">
              <p className="text-xs font-bold text-kahve-600 truncate">{user.name || 'Kullanıcı'}</p>
              <p className="text-[10px] text-kahve-400 truncate">{user.bodyType !== 'Belirtilmedi' ? user.bodyType : 'Profili düzenle'}</p>
            </div>
          </button>
        ) : (
          <button
            onClick={onOpenAuth}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-2xl border border-kahve-200/50 text-kahve-400 hover:bg-white hover:text-kahve-600 hover:shadow-soft transition-all text-sm font-semibold"
          >
            <LogIn className="w-4 h-4" />
            Giriş Yap / Kayıt Ol
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-1.5 flex-1 overflow-y-auto">
        {NAV.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActivePage(id)}
            className={`sidebar-btn ${activePage === id ? 'sidebar-btn-active' : 'sidebar-btn-idle'}`}
          >
            <Icon className="w-[18px] h-[18px]" />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {/* Stil Danışmanı Button */}
      <button
        onClick={onOpenAdvisor}
        className="w-full flex items-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-pudra-100 to-bebe-100 border border-pudra-200/50 text-kahve-600 font-bold text-sm hover:shadow-card transition-all"
      >
        <Sparkles className="w-4 h-4 text-pudra-500" />
        Stil Danışmanım
      </button>

      {/* Bottom Info Card */}
      <div className="bg-gradient-to-br from-suyesil-50 to-bebe-50 rounded-2xl p-4 space-y-1 border border-suyesil-200/50">
        <p className="text-xs font-bold text-kahve-500">SLM + RAG Motoru</p>
        <p className="text-[11px] text-kahve-400 leading-relaxed">
          Qwen2.5 Fine-Tuned + ChromaDB vektör arama ile gardrobunuza özel yapay zeka kombinleri.
        </p>
        <div className="flex items-center gap-1.5 pt-1">
          <span className="w-2 h-2 rounded-full bg-suyesil-500 animate-pulse-soft" />
          <span className="text-[10px] font-semibold text-suyesil-600">Model Aktif</span>
        </div>
      </div>
    </aside>
  );
}
