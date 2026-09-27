import React, { useState } from 'react';
import { Heart, Trash2, Calendar, Tag, Sparkles } from 'lucide-react';

export default function Favorites({ favorites, setFavorites, API_URL }) {
  const [selectedOutfit, setSelectedOutfit] = useState(null);

  const handleDelete = (id) => {
    setFavorites(favorites.filter(f => f.id !== id));
    fetch(`${API_URL}/api/favorites/${id}`, { method: 'DELETE' }).catch(err => console.log(err));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="glass-card p-6 bg-gradient-to-r from-[#FAF7F2] via-[#FFF0F2] to-[#EBFBF5]">
        <div className="flex items-center gap-2 mb-1">
          <span className="badge-pudra px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 fill-[#E89EA7]" /> Favori Albümlerim
          </span>
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#5D4037]">
          Beğendiğin Kombinler
        </h2>
        <p className="text-sm text-[#8D6E63]">
          Yapay zekanın senin için ürettiği veya kendi beğendiğin kombinlerin gardrop arşivin.
        </p>
      </div>

      {/* Favorites List / Grid */}
      {favorites.length === 0 ? (
        <div className="glass-card p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#FFF0F2] flex items-center justify-center mx-auto text-[#E89EA7]">
            <Heart className="w-8 h-8 fill-[#E89EA7]" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#5D4037]">Henüz Favori Kombin Yok</h3>
          <p className="text-xs text-[#8D6E63] max-w-md mx-auto">
            Yapay Zeka Öneri sekmesinden üretilen harika kombinleri beğenip kalpleyerek buraya kaydedebilirsiniz.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map(fav => (
            <div key={fav.id} className="glass-card p-5 space-y-4 flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="badge-suyesili px-2.5 py-0.5 rounded-md text-[10px] font-bold">
                      %{fav.outfit.compatibility_score} Uyumlu
                    </span>
                    <h3 className="font-serif text-lg font-bold text-[#5D4037] mt-1">
                      {fav.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => handleDelete(fav.id)}
                    className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                    title="Favorilerden Çıkar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Clothing Thumbnails Strip */}
                <div className="grid grid-cols-4 gap-1.5 bg-[#FAF7F2] p-2 rounded-2xl border border-[#D7CCC8]/40">
                  {[
                    fav.outfit.top_item,
                    fav.outfit.bottom_item,
                    fav.outfit.outer_item,
                    fav.outfit.shoes_item
                  ].map((item, i) => (
                    item ? (
                      <div key={i} className="aspect-square rounded-xl overflow-hidden bg-white border border-[#D7CCC8]/30">
                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div key={i} className="aspect-square rounded-xl bg-white/50 border border-dashed border-[#D7CCC8]" />
                    )
                  ))}
                </div>

                <p className="text-xs text-[#5D4037] line-clamp-2 italic">
                  "{fav.outfit.reasoning}"
                </p>
              </div>

              <div className="pt-3 border-t border-[#FAF7F2] flex items-center justify-between text-[11px] text-[#8D6E63]">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#E89EA7]" /> {fav.saved_at}
                </span>
                <button
                  onClick={() => setSelectedOutfit(fav.outfit)}
                  className="font-bold text-[#56B998] hover:underline flex items-center gap-1"
                >
                  Detayları Gör →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Outfit Detail Modal */}
      {selectedOutfit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg border border-[#F7C5CC] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-[#FAF7F2]">
              <h3 className="font-serif text-xl font-bold text-[#5D4037]">{selectedOutfit.title}</h3>
              <button onClick={() => setSelectedOutfit(null)} className="text-gray-400 font-bold">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Üst Giyim', item: selectedOutfit.top_item },
                { label: 'Alt Giyim', item: selectedOutfit.bottom_item },
                { label: 'Dış Giyim', item: selectedOutfit.outer_item },
                { label: 'Ayakkabı', item: selectedOutfit.shoes_item }
              ].map((slot, idx) => (
                slot.item && (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-[#FAF7F2] rounded-2xl border border-[#D7CCC8]/40">
                    <img src={slot.item.image_url} alt={slot.item.name} className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <span className="text-[9px] font-bold text-[#8D6E63]">{slot.label}</span>
                      <h4 className="font-bold text-xs text-[#5D4037]">{slot.item.name}</h4>
                    </div>
                  </div>
                )
              ))}
            </div>

            <div className="bg-[#EBFBF5] p-3 rounded-2xl border border-[#B5EAD7] text-xs text-[#5D4037]">
              <strong>AI Mantığı:</strong> {selectedOutfit.reasoning}
            </div>

            <div className="text-right">
              <button
                onClick={() => setSelectedOutfit(null)}
                className="px-5 py-2 rounded-xl font-bold text-xs bg-[#5D4037] text-white"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
