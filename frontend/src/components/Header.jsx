import React from 'react';
import { Shirt, Sparkles, Heart, BarChart3, Palette, Smartphone, Laptop, Presentation } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, isMobilePreview, setIsMobilePreview, onOpenDemoTour }) {
  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-[#F7C5CC]/40 px-4 lg:px-8 py-3 transition-all shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#F7C5CC] via-[#C7CEEA] to-[#B5EAD7] flex items-center justify-center shadow-md">
            <Shirt className="w-6 h-6 text-[#5D4037]" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#5D4037] tracking-tight">
              Bu Gün Ne Giysem
            </h1>
            <p className="text-xs text-[#8D6E63] font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#56B998] inline-block animate-ping"></span>
              SLM + RAG Tabanlı Akıllı Gardrop Asistanı
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 bg-[#FAF7F2] p-1.5 rounded-2xl border border-[#D7CCC8]/40 overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('wardrobe')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'wardrobe'
                ? 'bg-white text-[#5D4037] shadow-sm border border-[#F7C5CC]'
                : 'text-[#8D6E63] hover:text-[#5D4037] hover:bg-white/50'
            }`}
          >
            <Shirt className="w-4 h-4 text-[#E89EA7]" />
            Gardrobum
          </button>

          <button
            onClick={() => setActiveTab('recommend')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'recommend'
                ? 'bg-gradient-to-r from-[#F7C5CC] to-[#B5EAD7] text-[#5D4037] shadow-sm'
                : 'text-[#8D6E63] hover:text-[#5D4037] hover:bg-white/50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#56B998]" />
            AI Öneri
          </button>

          <button
            onClick={() => setActiveTab('studio')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'studio'
                ? 'bg-white text-[#5D4037] shadow-sm border border-[#B5EAD7]'
                : 'text-[#8D6E63] hover:text-[#5D4037] hover:bg-white/50'
            }`}
          >
            <Palette className="w-4 h-4 text-[#56B998]" />
            Manuel Stüdyo
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'favorites'
                ? 'bg-white text-[#5D4037] shadow-sm border border-[#F7C5CC]'
                : 'text-[#8D6E63] hover:text-[#5D4037] hover:bg-white/50'
            }`}
          >
            <Heart className="w-4 h-4 text-[#E89EA7] fill-[#E89EA7]" />
            Beğeniler
          </button>

          <button
            onClick={() => setActiveTab('eval')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'eval'
                ? 'bg-[#C7CEEA] text-[#5D4037] shadow-sm font-extrabold'
                : 'text-[#8D6E63] hover:text-[#5D4037] hover:bg-white/50'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-[#628DC9]" />
            Deneysel Metrikler
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Hoca Sunum Rehberi Button */}
          <button
            onClick={onOpenDemoTour}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#FFF0F2] text-[#E89EA7] border border-[#F7C5CC] hover:bg-[#F7C5CC] hover:text-white transition-all shadow-sm"
            title="Danışman Hoca İçin 2 Dakikalık Canlı Sunum Rehberi"
          >
            <Presentation className="w-4 h-4" />
            Hoca Sunumu
          </button>

          {/* Mobile Toggle Button */}
          <button
            onClick={() => setIsMobilePreview(!isMobilePreview)}
            className={`hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
              isMobilePreview
                ? 'bg-[#5D4037] text-white border-[#5D4037]'
                : 'bg-white text-[#8D6E63] border-[#D7CCC8] hover:border-[#8D6E63]'
            }`}
            title="Mobil Görünüm Simülatörü"
          >
            {isMobilePreview ? <Laptop className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
            {isMobilePreview ? 'Masaüstü' : 'Mobil'}
          </button>
        </div>
      </div>
    </header>
  );
}
