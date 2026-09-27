import re

with open('frontend/src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace getDemoWardrobe
new_wardrobe = '''const getDemoWardrobe = (gender) => {
  const isMale = gender === 'Erkek';
  
  const common = [
    { id: 'w1', name: 'Beyaz Basic Tiþört', category: 'Üst', color: 'Beyaz', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&auto=format&fit=crop&q=80', season: 'Dört Mevsim' },
    { id: 'w2', name: 'Siyah Basic Tiþört', category: 'Üst', color: 'Siyah', image: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=400&auto=format&fit=crop&q=80', season: 'Dört Mevsim' },
    { id: 'w3', name: 'Mavi Kot Pantolon', category: 'Alt', color: 'Mavi', image: 'https://images.unsplash.com/photo-1542272604-780c8d47b096?w=400&auto=format&fit=crop&q=80', season: 'Dört Mevsim' },
    { id: 'w4', name: 'Siyah Kot Pantolon', category: 'Alt', color: 'Siyah', image: 'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=400&auto=format&fit=crop&q=80', season: 'Dört Mevsim' },
    { id: 'w5', name: 'Beyaz Sneaker Ayakkabý', category: 'Ayakkabý', color: 'Beyaz', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&auto=format&fit=crop&q=80', season: 'Dört Mevsim' },
    { id: 'w6', name: 'Siyah Basic Ayakkabý', category: 'Ayakkabý', color: 'Siyah', image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&auto=format&fit=crop&q=80', season: 'Dört Mevsim' },
  ];

  if (isMale) {
    return [
      ...common,
      { id: 'w7', name: 'Siyah Sýrt Çantasý', category: 'Aksesuar', color: 'Siyah', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&auto=format&fit=crop&q=80', season: 'Dört Mevsim' },
      { id: 'w8', name: 'Siyah Bere', category: 'Aksesuar', color: 'Siyah', image: 'https://images.unsplash.com/photo-1576871337635-b1a134707e7b?w=400&auto=format&fit=crop&q=80', season: 'Kýþ' },
    ];
  }

  // Kadýn / Belirtilmedi
  return [
    ...common,
    { id: 'w7', name: 'Siyah Çanta', category: 'Aksesuar', color: 'Siyah', image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=400&auto=format&fit=crop&q=80', season: 'Dört Mevsim' },
    { id: 'w8', name: 'Þal', category: 'Aksesuar', color: 'Bej', image: 'https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?w=400&auto=format&fit=crop&q=80', season: 'Sonbahar' },
  ];
};'''

content = re.sub(r'const getDemoWardrobe = \(gender\) => \{.*?\n\};\n', new_wardrobe + '\n', content, flags=re.DOTALL)

# Replace useEffect for AuthModal and wardrobe initialization
old_use_effect = r'''  /\* .*? \*/\n  useEffect\(\(\) => \{\n    if \(\!isLoggedIn\) \{\n      setWardrobe\(\[\]\);\n      const timer = setTimeout\(\(\) => setShowAuth\(true\), 100\);\n      return \(\) => clearTimeout\(timer\);\n    \} else \{\n      setShowAuth\(false\); // .*?\n      const saved = localStorage\.getItem\('demo_wardrobe'\);\n      if \(saved\) \{\n        setWardrobe\(JSON\.parse\(saved\)\);\n      \} else if \(user\?\.isAdmin\) \{\n        setWardrobe\(getDemoWardrobe\(user\.gender\)\);\n      \} else \{\n        setWardrobe\(\[\]\);\n      \}\n    \}\n  \}, \[isLoggedIn, user\]\);'''

new_use_effect = '''  /* Ýlk açýlýþta veya giriþ durumunda gardrobu yükle */
  useEffect(() => {
    if (!isLoggedIn) {
      setWardrobe(getDemoWardrobe('Kadýn')); // Giriþ yapmadan da site kullanýlabilmeli, varsayýlan gardýrobu yükle
    } else {
      setShowAuth(false); // Giriþ yapýldýysa modalý kapat
      const saved = localStorage.getItem('demo_wardrobe');
      if (saved) {
        setWardrobe(JSON.parse(saved));
      } else {
        setWardrobe(getDemoWardrobe(user?.gender || 'Kadýn'));
      }
    }
  }, [isLoggedIn, user]);'''

content = re.sub(old_use_effect, new_use_effect, content, flags=re.DOTALL)

with open('frontend/src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
