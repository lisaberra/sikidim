import React from 'react';
import { Heart, ArrowRight, Star } from 'lucide-react';

export default function Favoriler({ favorites, wardrobe, onGoGecmis }) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-serif text-3xl font-bold text-kahve-600">Favoriler</h2>
          <p className="text-sm text-kahve-400 mt-0.5">{favorites.length} favori kombin</p>
        </div>

        {/* Favorilere Ekle → Geçmiş Kombinler'e git */}
        <button onClick={onGoGecmis} className="btn-primary text-base px-6 py-3">
          <Heart className="w-5 h-5 fill-white" />
          Favorilere Ekle
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      </div>

      {/* Favori Grid */}
      {favorites.length === 0 ? (
        <div className="card p-16 text-center space-y-3">
          <Star className="mx-auto w-12 h-12 text-pudra-300" />
          <p className="font-bold text-kahve-500">Henüz favori eklemediniz</p>
          <p className="text-xs text-kahve-400">
            Geçmiş kombilerinize gidip kalp ikonuna basarak favori ekleyebilirsiniz.
          </p>
          <button onClick={onGoGecmis} className="btn-secondary inline-flex mt-2">
            <ArrowRight className="w-4 h-4" />
            Geçmiş Kombinlere Git
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {favorites.map(combo => (
            <div key={combo.id} className="card overflow-hidden">
              <div className="aspect-[4/5] bg-cream overflow-hidden relative">
                <img src={combo.image} alt={combo.title} className="w-full h-full object-cover" />
                <div className="absolute top-2.5 right-2.5 p-2 bg-white/90 backdrop-blur-sm rounded-xl shadow-soft">
                  <Heart className="w-4 h-4 text-pudra-400 fill-pudra-400" />
                </div>
              </div>
              <div className="p-4 space-y-1">
                <h4 className="font-bold text-sm text-kahve-600">{combo.title}</h4>
                <p className="text-xs text-kahve-400">{combo.date}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
