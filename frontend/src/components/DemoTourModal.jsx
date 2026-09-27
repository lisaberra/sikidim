import React, { useState } from 'react';
import { Presentation, Shirt, Sparkles, BarChart3, CheckCircle2, ArrowRight, X, Play } from 'lucide-react';

export default function DemoTourModal({ isOpen, onClose, setActiveTab, onResetDemo }) {
  const [currentStep, setCurrentStep] = useState(1);

  if (!isOpen) return null;

  const steps = [
    {
      step: 1,
      title: "1. Aşama: Gardrop Envanteri ve Veri Seti",
      icon: Shirt,
      color: "#E89EA7",
      description: "Projemiz jenerik chatbot'lardan farklı olarak doğrudan kullanıcının kendi fiziki gardrop parçaları üzerinde çalışır.",
      actionText: "Demo Gardrobu Yükle & Gardrobuma Git",
      action: () => {
        onResetDemo();
        setActiveTab('wardrobe');
      }
    },
    {
      step: 2,
      title: "2. Aşama: Fine-Tuned SLM + ChromaDB RAG Sorgusu",
      icon: Sparkles,
      color: "#56B998",
      description: "Qwen2.5-3B modeline LoRA ile eğitilen kombin mantığı verilmiştir. RAG motoru ise vektör veritabanından kullanıcı envanterini saniyeler içinde çeker.",
      actionText: "AI Öneri Sekmesine Git",
      action: () => {
        setActiveTab('recommend');
      }
    },
    {
      step: 3,
      title: "3. Aşama: Akademik Metrikler & Ablation Study",
      icon: BarChart3,
      color: "#628DC9",
      description: "RAG mimarisinin eklenmesiyle Gardrop Envanter Sadakati %18.5'ten %98.2'ye çıkmış, Hayali Ürün (Hallucination) oranı %1.8'e düşürülmüştür.",
      actionText: "Deneysel Metrikler Sayfasına Git",
      action: () => {
        setActiveTab('eval');
      }
    }
  ];

  const activeInfo = steps.find(s => s.step === currentStep) || steps[0];
  const StepIcon = activeInfo.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl p-6 w-full max-w-lg border-2 border-[#F7C5CC] shadow-2xl space-y-5 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="badge-pudra px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
            <Presentation className="w-3.5 h-3.5" /> Danışman Hoca Sunum Rehberi
          </span>
          <span className="text-xs font-bold text-[#8D6E63]">Adım {currentStep} / 3</span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold shadow-md" style={{ backgroundColor: activeInfo.color }}>
              <StepIcon className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#5D4037]">
              {activeInfo.title}
            </h3>
          </div>

          <p className="text-xs text-[#5D4037] leading-relaxed bg-[#FAF7F2] p-4 rounded-2xl border border-[#D7CCC8]/50">
            {activeInfo.description}
          </p>
        </div>

        {/* Action Button for Current Step */}
        <button
          onClick={() => {
            activeInfo.action();
            if (currentStep < 3) setCurrentStep(currentStep + 1);
            else onClose();
          }}
          className="w-full py-3 rounded-2xl font-bold text-xs text-white shadow-md flex items-center justify-center gap-2 transition-all hover:opacity-90"
          style={{ backgroundColor: activeInfo.color }}
        >
          <Play className="w-4 h-4 fill-white" />
          <span>{activeInfo.actionText}</span>
        </button>

        {/* Step Navigation Dots */}
        <div className="flex justify-between items-center pt-2 border-t border-[#FAF7F2]">
          <div className="flex items-center gap-1.5">
            {[1, 2, 3].map(stepNum => (
              <button
                key={stepNum}
                onClick={() => setCurrentStep(stepNum)}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentStep === stepNum ? 'bg-[#5D4037] w-6' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          <button onClick={onClose} className="text-xs font-bold text-[#8D6E63] hover:underline">
            Sunumu Bitir
          </button>
        </div>
      </div>
    </div>
  );
}
