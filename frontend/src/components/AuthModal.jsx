import React, { useState } from 'react';
import { X, LogIn, UserPlus, Mail, Lock, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ onClose }) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('Belirtilmedi');

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (mode === 'login') {
        login(email, password);
        toast.success(`Hoş geldiniz!`);
      } else {
        register(name, email, password, gender);
        toast.success(`Kayıt başarılı, hoş geldiniz!`);
      }
      onClose();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 w-full max-w-md shadow-2xl border border-white/60 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h3 className="font-serif text-2xl font-bold text-kahve-600">
            {mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
          </h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-cream text-kahve-400 hover:text-kahve-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toggle */}
        <div className="flex bg-cream rounded-2xl p-1">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${mode === 'login' ? 'bg-white text-kahve-600 shadow-soft' : 'text-kahve-400'}`}
          >
            <LogIn className="w-4 h-4 inline mr-1.5" /> Giriş Yap
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${mode === 'register' ? 'bg-white text-kahve-600 shadow-soft' : 'text-kahve-400'}`}
          >
            <UserPlus className="w-4 h-4 inline mr-1.5" /> Kayıt Ol
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-kahve-300" />
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Ad Soyad" className="input-field pl-10" />
              </div>
              <div className="relative">
                <select value={gender} onChange={e => setGender(e.target.value)} className="input-field">
                  <option value="Belirtilmedi">Cinsiyet (Belirtilmedi)</option>
                  <option value="Kadın">Kadın</option>
                  <option value="Erkek">Erkek</option>
                </select>
              </div>
            </>
          )}
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-kahve-300" />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="E-posta" required className="input-field pl-10" />
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-kahve-300" />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Şifre" required className="input-field pl-10" />
          </div>
          <button type="submit" className="btn-primary w-full py-3 text-base">
            {mode === 'login' ? 'Giriş Yap' : 'Hesap Oluştur'}
          </button>
        </form>

        <p className="text-center text-xs text-kahve-400">
          Mock authentication — veriler localStorage'da saklanır.
        </p>
      </div>
    </div>
  );
}
