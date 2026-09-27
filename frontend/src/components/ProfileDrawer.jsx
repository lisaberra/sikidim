import React, { useState } from 'react';
import { X, Save, Ruler, Weight, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const BODY_TYPES = ['Belirtilmedi', 'Kum Saati', 'Atletik', 'Elma', 'Armut', 'Dikdörtgen'];

export default function ProfileDrawer({ onClose }) {
  const { user, updateProfile, logout } = useAuth();
  const [height, setHeight] = useState(user.height || '');
  const [weight, setWeight] = useState(user.weight || '');
  const [bodyType, setBodyType] = useState(user.bodyType || 'Belirtilmedi');
  const [gender, setGender] = useState(user.gender || 'Belirtilmedi');

  const handleSave = () => {
    updateProfile({ height, weight, bodyType, gender });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div
        className="w-full max-w-sm h-full bg-white/95 backdrop-blur-xl shadow-2xl border-l border-white/60 p-6 space-y-6 animate-slide-in-right overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <h3 className="font-serif text-xl font-bold text-kahve-600">Profilim</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-cream text-kahve-400 hover:text-kahve-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center gap-2 py-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-pudra-300 via-bebe-300 to-suyesil-300 flex items-center justify-center shadow-card">
            <User className="w-10 h-10 text-white" />
          </div>
          <p className="font-bold text-kahve-600">{user.name || 'Misafir'}</p>
          <p className="text-xs text-kahve-400">{user.email || ''}</p>
        </div>

        {/* Fiziksel Bilgiler */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-kahve-500 flex items-center gap-2">
            <Ruler className="w-4 h-4" /> Fiziksel Bilgiler
          </h4>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-kahve-400 block mb-1">Boy (cm)</label>
              <input
                type="number"
                value={height}
                onChange={e => setHeight(e.target.value)}
                placeholder="170"
                className="input-field text-center"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-kahve-400 block mb-1">Kilo (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={e => setWeight(e.target.value)}
                placeholder="65"
                className="input-field text-center"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <label className="text-xs font-semibold text-kahve-400 block mb-1">Vücut Tipi</label>
              <select value={bodyType} onChange={e => setBodyType(e.target.value)} className="input-field">
                {BODY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-kahve-400 block mb-1">Cinsiyet</label>
              <select value={gender} onChange={e => setGender(e.target.value)} className="input-field">
                <option value="Belirtilmedi">Belirtilmedi</option>
                <option value="Kadın">Kadın</option>
                <option value="Erkek">Erkek</option>
              </select>
            </div>
          </div>
        </div>

        {/* BMI Preview */}
        {height && weight && (
          <div className="bg-suyesil-50 border border-suyesil-200 rounded-2xl p-4 text-center">
            <p className="text-xs font-bold text-suyesil-600 mb-1">Vücut Kitle İndeksi (BMI)</p>
            <p className="text-2xl font-extrabold text-kahve-600">
              {(weight / ((height / 100) ** 2)).toFixed(1)}
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="space-y-3 pt-2">
          <button onClick={handleSave} className="btn-primary w-full py-3">
            <Save className="w-4 h-4" /> Kaydet
          </button>
          <button
            onClick={() => { logout(); onClose(); }}
            className="btn-secondary w-full py-2.5 text-pudra-500 border-pudra-200 hover:bg-pudra-50"
          >
            Çıkış Yap
          </button>
        </div>
      </div>
    </div>
  );
}
