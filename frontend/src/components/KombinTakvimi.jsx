import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, AlertTriangle, Calendar } from 'lucide-react';

const TURKISH_MONTHS = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

export default function KombinTakvimi({ combos = [], onAssignCombo }) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 8, 1)); // September 2026 default
  const [assignedDays, setAssignedDays] = useState(() => {
    const initial = {};
    combos.forEach(c => {
      if (c.date) initial[c.date] = c.id;
    });
    return initial;
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDayStr, setSelectedDayStr] = useState(null);

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  // Adjust so Monday is 0, Sunday is 6
  const startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const pad = (n) => n < 10 ? '0' + n : n;
  
  const handleDayClick = (dayNum) => {
    const dateStr = `${pad(dayNum)}.${pad(currentMonth + 1)}.${currentYear}`;
    setSelectedDayStr(dateStr);
    setModalOpen(true);
  };

  const handleAssign = (comboId) => {
    setAssignedDays(prev => ({ ...prev, [selectedDayStr]: comboId }));
    if (onAssignCombo) onAssignCombo(selectedDayStr, comboId);
    setModalOpen(false);
  };

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Weekly Summary Strip
  const today = new Date(currentYear, currentMonth, 7); // mock today
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;
  }).reverse();

  // Check repeats in last 7 days
  const recentComboIds = last7Days.map(dateStr => assignedDays[dateStr]).filter(Boolean);
  const hasRepeat = new Set(recentComboIds).size !== recentComboIds.length;

  return (
    <div className="p-6 bg-cream min-h-screen animate-fade-in text-kahve-600">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif font-bold text-kahve-800 flex items-center gap-3">
          <Calendar className="w-8 h-8 text-suyesil" />
          Kombin Takvimi
        </h1>
        <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-full shadow-sm">
          <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 rounded-full transition"><ChevronLeft className="w-5 h-5" /></button>
          <span className="font-medium min-w-[100px] text-center">{TURKISH_MONTHS[currentMonth]} {currentYear}</span>
          <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded-full transition"><ChevronRight className="w-5 h-5" /></button>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-card mb-8">
        <div className="grid grid-cols-7 gap-4 mb-4">
          {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map(d => (
            <div key={d} className="text-center font-bold text-sm text-gray-500">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-4">
          {Array.from({ length: startDay }).map((_, i) => (
            <div key={`empty-${i}`} className="h-24 rounded-2xl bg-gray-50 border border-gray-100 opacity-50"></div>
          ))}
          {daysArray.map(dayNum => {
            const dateStr = `${pad(dayNum)}.${pad(currentMonth + 1)}.${currentYear}`;
            const assignedId = assignedDays[dateStr];
            const combo = combos.find(c => c.id === assignedId);
            
            return (
              <div 
                key={dayNum}
                onClick={() => handleDayClick(dayNum)}
                className="h-24 rounded-2xl border-2 border-dashed border-gray-200 hover:border-pudra flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden relative group"
              >
                {combo ? (
                  <>
                    {combo.image ? (
                      <img src={combo.image} alt={combo.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    ) : (
                      <div className="bg-bebe/20 w-full h-full flex items-center justify-center p-2 text-center text-xs font-medium text-bebe-800">
                        {combo.title}
                      </div>
                    )}
                    <div className="absolute top-1 left-1 bg-white/80 backdrop-blur text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-sm">
                      {dayNum}
                    </div>
                  </>
                ) : (
                  <span className="text-xl font-serif text-gray-400 group-hover:text-pudra">{dayNum}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold mb-4 font-serif">Son 7 Gün Özeti</h2>
        {hasRepeat && (
          <div className="mb-4 bg-orange-100 text-orange-700 px-4 py-2 rounded-xl text-sm flex items-center gap-2 font-medium">
            <AlertTriangle className="w-4 h-4" />
            Dikkat: Son 7 gün içinde aynı kombini tekrar giydiniz!
          </div>
        )}
        <div className="flex gap-4 overflow-x-auto pb-4">
          {last7Days.map((dateStr, idx) => {
            const assignedId = assignedDays[dateStr];
            const combo = combos.find(c => c.id === assignedId);
            return (
              <div key={idx} className="flex-shrink-0 w-32 bg-white rounded-2xl p-2 shadow-sm text-center flex flex-col items-center">
                <div className="text-xs text-gray-500 mb-2">{dateStr}</div>
                <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden mb-2">
                  {combo?.image ? (
                    <img src={combo.image} alt="combo" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[10px] text-gray-400 h-full flex items-center justify-center">{combo ? combo.title : 'Boş'}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto shadow-2xl animate-slide-up">
            <h2 className="text-xl font-serif font-bold mb-4">Kombin Seç ({selectedDayStr})</h2>
            <div className="grid grid-cols-2 gap-4">
              {combos.map(combo => (
                <div 
                  key={combo.id} 
                  onClick={() => handleAssign(combo.id)}
                  className="cursor-pointer bg-gray-50 rounded-2xl p-3 border-2 border-transparent hover:border-suyesil transition-colors"
                >
                  <div className="h-32 bg-gray-200 rounded-xl mb-2 overflow-hidden">
                    {combo.image && <img src={combo.image} alt={combo.title} className="w-full h-full object-cover" />}
                  </div>
                  <div className="font-medium text-sm text-center truncate">{combo.title}</div>
                </div>
              ))}
            </div>
            <button onClick={() => setModalOpen(false)} className="mt-6 w-full btn-secondary py-3 rounded-xl font-medium bg-gray-100 hover:bg-gray-200 transition">
              İptal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
