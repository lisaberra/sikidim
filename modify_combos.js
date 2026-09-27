const fs = require('fs');
let content = fs.readFileSync('frontend/src/App.jsx', 'utf-8');

const newCombos = `const DEMO_PAST_COMBOS = [
  { id: 'c1', title: 'Günlük Rahat Şıklık', date: '06.09.2026', items: ['w1','w3','w5','w7'], image: '', liked: true },
  { id: 'c2', title: 'Serin Bahar Akşamı', date: '05.09.2026', items: ['w2','w4','w6','w8'], image: '', liked: true },
];`;

content = content.replace(/const DEMO_PAST_COMBOS = \[[\s\S]*?\];/m, newCombos);

fs.writeFileSync('frontend/src/App.jsx', content, 'utf-8');