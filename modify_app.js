const fs = require('fs');
let content = fs.readFileSync('frontend/src/App.jsx', 'utf-8');

const newWardrobe = `const getDemoWardrobe = (gender) => {
  const isMale = gender === 'Erkek';
  
  const common = [
    { id: 'w1', name: 'Beyaz Basic Tişört', category: 'Üst', color: 'Beyaz', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&auto=format&fit=crop&q=80', season: 'Dört Mevsim' },
    { id: 'w2', name: 'Siyah Basic Tişört', category: 'Üst', color: 'Siyah', image: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=400&auto=format&fit=crop&q=80', season: 'Dört Mevsim' },
    { id: 'w3', name: 'Mavi Kot Pantolon', category: 'Alt', color: 'Mavi', image: 'https://images.unsplash.com/photo-1542272604-780c8d47b096?w=400&auto=format&fit=crop&q=80', season: 'Dört Mevsim' },
    { id: 'w4', name: 'Siyah Kot Pantolon', category: 'Alt', color: 'Siyah', image: 'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=400&auto=format&fit=crop&q=80', season: 'Dört Mevsim' },
    { id: 'w5', name: 'Beyaz Sneaker Ayakkabı', category: 'Ayakkabı', color: 'Beyaz', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&auto=format&fit=crop&q=80', season: 'Dört Mevsim' },
    { id: 'w6', name: 'Siyah Basic Ayakkabı', category: 'Ayakkabı', color: 'Siyah', image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&auto=format&fit=crop&q=80', season: 'Dört Mevsim' },
  ];

  if (isMale) {
    return [
      ...common,
      { id: 'w7', name: 'Siyah Sırt Çantası', category: 'Aksesuar', color: 'Siyah', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&auto=format&fit=crop&q=80', season: 'Dört Mevsim' },
      { id: 'w8', name: 'Siyah Bere', category: 'Aksesuar', color: 'Siyah', image: 'https://images.unsplash.com/photo-1576871337635-b1a134707e7b?w=400&auto=format&fit=crop&q=80', season: 'Kış' },
    ];
  }

  // Kadın / Belirtilmedi
  return [
    ...common,
    { id: 'w7', name: 'Siyah Çanta', category: 'Aksesuar', color: 'Siyah', image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=400&auto=format&fit=crop&q=80', season: 'Dört Mevsim' },
    { id: 'w8', name: 'Şal', category: 'Aksesuar', color: 'Bej', image: 'https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?w=400&auto=format&fit=crop&q=80', season: 'Sonbahar' },
  ];
};`

content = content.replace(/const getDemoWardrobe = \(gender\) => \{[\s\S]*?\n\};\n/, newWardrobe + '\n');

const oldEffectRegex = /\/\*\s*İlk açılışta veya giriş durumunda gardrobu yükle\s*\*\/[\s\S]*?\}, \[isLoggedIn, user\]\);/;
const newEffect = `/* İlk açılışta veya giriş durumunda gardrobu yükle */
  useEffect(() => {
    if (!isLoggedIn) {
      setWardrobe(getDemoWardrobe('Kadın')); // Giriş yapmadan da site kullanılabilmeli, varsayılan gardırobu yükle
    } else {
      setShowAuth(false); // Giriş yapıldıysa modalı kapat
      const saved = localStorage.getItem('demo_wardrobe');
      if (saved) {
        setWardrobe(JSON.parse(saved));
      } else {
        setWardrobe(getDemoWardrobe(user?.gender || 'Kadın'));
      }
    }
  }, [isLoggedIn, user]);`

content = content.replace(oldEffectRegex, newEffect);

fs.writeFileSync('frontend/src/App.jsx', content, 'utf-8');