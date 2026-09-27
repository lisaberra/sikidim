import React, { useState } from 'react';
import { Heart, Trash2, Clock, Shirt, X } from 'lucide-react';
import MannequinPreview, { DynamicSilhouette, ClothingLayer } from './MannequinPreview';

// Mini manken silüeti üzerinde kıyafetleri gösteren fallback
const MiniMannequinFallback = ({ items }) => {
  if (!items || items.length === 0) return <div className="w-full h-full bg-cream" />;
  
  const getItem = (cat) => items.find(i => i.category === cat || i.category === `${cat} Giyim`);
  
  return (
    <div className="w-full h-full bg-gradient-to-b from-white to-cream/60 relative overflow-hidden flex items-center justify-center pointer-events-none">
      <div className="relative w-full h-[140%] max-w-[200px] mt-12">
        <DynamicSilhouette bodyType="kum saati" gender="Kadın" />
        <ClothingLayer item={getItem('Alt')} category="Alt" />
        {getItem('Elbise') && <ClothingLayer item={getItem('Elbise')} category="Elbise" />}
        <ClothingLayer item={getItem('Üst')} category="Üst" />
        <ClothingLayer item={getItem('Dış')} category="Dış" />
        <ClothingLayer item={getItem('Ayakkabı')} category="Ayakkabı" />
        <ClothingLayer item={getItem('Aksesuar')} category="Aksesuar" />
      </div>
    </div>
  );
};

const FallbackCollage = MiniMannequinFallback; // Use the same for modal

export default function GecmisKombinler({ combos, wardrobe, onToggleFav, onDelete, onMarkWorn, onPreview }) {
  const [selectedCombo, setSelectedCombo] = useState(null);

  // Helper to map item IDs to full item details from the wardrobe
  const getComboItems = (itemIds) => {
    if (!itemIds || !Array.isArray(itemIds)) return [];
    return itemIds.map(id => wardrobe.find(w => w.id === id)).filter(Boolean);
  };



  return (
    <div className="space-y-6 animate-fade-in relative">
      <div>
        <h2 className="font-serif text-3xl font-bold text-kahve-600">Geçmiş Kombinler</h2>
        <p className="text-sm text-kahve-400 mt-0.5">{combos.length} kombin</p>
      </div>

      {combos.length === 0 ? (
        <div className="card p-16 text-center space-y-3">
          <Clock className="mx-auto w-12 h-12 text-bebe-300" />
          <p className="font-bold text-kahve-500">Henüz geçmiş kombin yok</p>
          <p className="text-xs text-kahve-400">"Bana Öner" sayfasından kombin oluşturun.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {combos.map(combo => {
            const items = getComboItems(combo.items);
            return (
              <div 
                key={combo.id} 
                className="card overflow-hidden group cursor-pointer" 
                onClick={() => {
                  setSelectedCombo(combo);
                  if (onPreview) onPreview(items); // Show in mannequin when clicked
                }}
              >
                <div className="aspect-[4/5] bg-cream overflow-hidden relative">
                  {combo.image && combo.image.length > 50 ? (
                    <img src={combo.image} alt={combo.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <MiniMannequinFallback items={items} />
                  )}

                  {/* Overlay Actions */}
                  <div className="absolute top-2.5 right-2.5 flex flex-col gap-2 z-10">
                    <button
                      onClick={(e) => { e.stopPropagation(); onToggleFav(combo.id); }}
                      className={`p-2 rounded-xl shadow-soft backdrop-blur-sm transition-all ${
                        combo.liked
                          ? 'bg-pudra-100 border border-pudra-300'
                          : 'bg-white/90 border border-white/50 hover:bg-pudra-50'
                      }`}
                      title={combo.liked ? 'Favorilerden çıkar' : 'Favorilere ekle'}
                    >
                      <Heart className={`w-4 h-4 transition-colors ${combo.liked ? 'text-pudra-500 fill-pudra-400' : 'text-kahve-400'}`} />
                    </button>

                    <button
                      onClick={(e) => { e.stopPropagation(); onDelete(combo.id); }}
                      className="p-2 rounded-xl bg-white/90 backdrop-blur-sm border border-white/50 shadow-soft hover:bg-red-50 hover:border-red-200 transition-all"
                      title="Kombini sil"
                    >
                      <Trash2 className="w-4 h-4 text-kahve-400 hover:text-red-500 transition-colors" />
                    </button>

                    <button
                      onClick={(e) => { e.stopPropagation(); onMarkWorn && onMarkWorn(combo.items || []); }}
                      className="p-2 rounded-xl bg-white/90 backdrop-blur-sm border border-white/50 shadow-soft hover:bg-suyesil-50 hover:border-suyesil-200 transition-all mt-6"
                      title="Kombini Giydim (Kirliler Sepetine At)"
                    >
                      <Shirt className="w-4 h-4 text-suyesil-500 transition-colors" />
                    </button>
                  </div>

                  {/* Date Badge */}
                  <span className="absolute bottom-2.5 left-2.5 bg-white/90 backdrop-blur-sm text-kahve-600 text-[10px] font-bold px-2.5 py-1 rounded-xl shadow-soft z-10">
                    {combo.date}
                  </span>
                </div>

                <div className="p-4">
                  <h4 className="font-bold text-sm text-kahve-600">{combo.title}</h4>
                  <p className="text-xs text-kahve-400 mt-1">Detayları görmek için tıkla</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Kombin Detay Modal */}
      {selectedCombo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedCombo(null)}>
          <div 
            className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 md:p-8 w-full max-w-2xl shadow-2xl border border-white/60 space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-serif text-2xl font-bold text-kahve-600">{selectedCombo.title}</h3>
                <p className="text-sm text-kahve-400 mt-1">{selectedCombo.date}</p>
              </div>
              <button onClick={() => setSelectedCombo(null)} className="p-2 rounded-xl hover:bg-cream text-kahve-400 hover:text-kahve-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              {/* Snapshot Image or Fallback */}
              <div className="w-full md:w-1/3 aspect-[4/5] bg-cream rounded-2xl overflow-hidden shadow-soft shrink-0 border border-kahve-100/50">
                {selectedCombo.image && selectedCombo.image.length > 50 ? (
                   <img src={selectedCombo.image} alt={selectedCombo.title} className="w-full h-full object-cover" />
                ) : (
                   <FallbackCollage items={getComboItems(selectedCombo.items)} />
                )}
              </div>

              {/* Items List */}
              <div className="flex-1 space-y-4">
                <h4 className="text-sm font-bold text-kahve-500 uppercase tracking-wider">Kombin Parçaları</h4>
                {getComboItems(selectedCombo.items).length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {getComboItems(selectedCombo.items).map(item => (
                      <div key={item.id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-kahve-100/50 shadow-sm">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-cream shrink-0 flex items-center justify-center p-1">
                          <img src={item.image || item.image_url} alt={item.name} className="max-w-full max-h-full object-contain drop-shadow-sm" />
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-bold text-kahve-600 truncate">{item.name}</p>
                          <p className="text-[10px] text-kahve-400">{item.category} • {item.color}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-kahve-50/50 rounded-xl border border-dashed border-kahve-200 text-center text-xs text-kahve-400">
                    Bu kombine ait parça detayları bulunamadı.
                  </div>
                )}

                {/* Ek aksiyonlar */}
                <div className="pt-4 flex gap-3">
                  <button 
                    onClick={() => { onMarkWorn && onMarkWorn(selectedCombo.items || []); setSelectedCombo(null); }}
                    className="flex-1 bg-suyesil-50 text-suyesil-600 font-bold text-xs py-3 rounded-xl border border-suyesil-200 hover:bg-suyesil-100 transition-colors"
                  >
                    Kirliler Sepetine At
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
