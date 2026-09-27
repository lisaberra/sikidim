import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const DEFAULT_USER = {
  name: '',
  email: '',
  height: '',
  weight: '',
  bodyType: 'Belirtilmedi',
  gender: 'Belirtilmedi',
  isAdmin: false,
};

// ── Validasyon sabitleri ─────────────────────────────────────────────────────
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MIN_PASSWORD_LENGTH = 6;

// Basit in-memory kayıt defteri (sayfa yenilendiğinde kalır değil — gerçek
// backend olmadığı için, kayıtlı kullanıcıları localStorage'da saklıyoruz)
const USERS_KEY = 'bng_registered_users';

function getRegisteredUsers() {
  try {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    // Varsayılan bir admin hesabı ekleyelim ki test etmek kolay olsun
    if (!users.find(u => u.email === 'admin@admin.com')) {
      users.push({
        name: 'Demo Admin',
        email: 'admin@admin.com',
        password: 'password123', // Test şifresi
        height: '170',
        weight: '65',
        bodyType: 'kum saati',
        gender: 'Kadın'
      });
    }
    return users;
  } catch {
    return [];
  }
}

function saveRegisteredUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

const getInitialUser = () => {
  const saved = localStorage.getItem('bng_user');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return DEFAULT_USER;
    }
  }
  return DEFAULT_USER;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getInitialUser);
  const [isLoggedIn, setIsLoggedIn] = useState(user.email !== '');

  /**
   * Giriş Yap — validasyon yapar, hata fırlatır.
   * @throws {Error} Hata mesajıyla
   */
  const login = (email, password) => {
    // ── 1. Format validasyonu ───────────────────────────────────────────────
    if (!email || !email.trim()) {
      throw new Error('E-posta adresi boş bırakılamaz.');
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      throw new Error('Geçerli bir e-posta adresi girin. (örn: ad@domain.com)');
    }
    if (!password || password.length < MIN_PASSWORD_LENGTH) {
      throw new Error(`Şifre en az ${MIN_PASSWORD_LENGTH} karakter olmalıdır.`);
    }

    // ── 2. Kayıtlı kullanıcı kontrolü ──────────────────────────────────────
    const users = getRegisteredUsers();
    const found = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());

    if (!found) {
      throw new Error('Bu e-posta ile kayıtlı hesap bulunamadı. Önce kayıt olun.');
    }
    if (found.password !== password) {
      throw new Error('Şifre yanlış. Lütfen tekrar deneyin.');
    }

    // ── 3. Giriş başarılı ──────────────────────────────────────────────────
    const sessionUser = {
      name: found.name,
      email: found.email,
      height: found.height || '',
      weight: found.weight || '',
      bodyType: found.bodyType || 'Belirtilmedi',
      gender: found.gender || 'Belirtilmedi',
      isAdmin: found.email.toLowerCase().includes('admin')
    };
    setUser(sessionUser);
    setIsLoggedIn(true);
    localStorage.setItem('bng_user', JSON.stringify(sessionUser));
  };

  /**
   * Kayıt Ol — validasyon yapar, kullanıcıyı kaydeder, hata fırlatır.
   * @throws {Error}
   */
  const register = (name, email, password, gender = 'Belirtilmedi') => {
    // ── Format validasyonu ──────────────────────────────────────────────────
    if (!name || !name.trim() || name.trim().length < 2) {
      throw new Error('Ad Soyad en az 2 karakter olmalıdır.');
    }
    if (!email || !email.trim()) {
      throw new Error('E-posta adresi boş bırakılamaz.');
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      throw new Error('Geçerli bir e-posta adresi girin. (örn: ad@domain.com)');
    }
    if (!password || password.length < MIN_PASSWORD_LENGTH) {
      throw new Error(`Şifre en az ${MIN_PASSWORD_LENGTH} karakter olmalıdır.`);
    }

    // ── Duplicate kontrolü ─────────────────────────────────────────────────
    const users = getRegisteredUsers();
    const exists = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (exists) {
      throw new Error('Bu e-posta adresi zaten kayıtlı. Giriş yapmayı deneyin.');
    }

    // ── Kaydet ────────────────────────────────────────────────────────────
    const newUser = { name: name.trim(), email: email.trim().toLowerCase(), password, height: '', weight: '', bodyType: 'Belirtilmedi', gender };
    saveRegisteredUsers([...users, newUser]);

    // Otomatik giriş
    const sessionUser = { 
      name: newUser.name, 
      email: newUser.email, 
      height: '', 
      weight: '', 
      bodyType: 'Belirtilmedi', 
      gender,
      isAdmin: newUser.email.toLowerCase().includes('admin')
    };
    setUser(sessionUser);
    setIsLoggedIn(true);
    localStorage.setItem('bng_user', JSON.stringify(sessionUser));
  };

  const logout = () => {
    setUser(DEFAULT_USER);
    setIsLoggedIn(false);
    localStorage.removeItem('bng_user');
  };

  const updateProfile = (updates) => {
    setUser(prev => {
      const updated = { ...prev, ...updates };
      return updated;
    });

    const updatedUser = { ...user, ...updates };
    localStorage.setItem('bng_user', JSON.stringify(updatedUser));

    // Kayıtlı kullanıcı listesini de güncelle
    const users = getRegisteredUsers();
    const idx = users.findIndex(u => u.email === updatedUser.email);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updates };
      saveRegisteredUsers(users);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
