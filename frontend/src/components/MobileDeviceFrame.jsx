import React from 'react';
import { Smartphone, Battery, Wifi, Signal } from 'lucide-react';

export default function MobileDeviceFrame({ children }) {
  return (
    <div className="py-6 flex justify-center items-center bg-[#FAF7F2] min-h-[85vh] animate-fade-in">
      <div className="relative w-full max-w-[395px] h-[780px] bg-black rounded-[50px] p-3 shadow-2xl border-4 border-gray-800 ring-1 ring-gray-900 overflow-hidden flex flex-col">
        {/* Smartphone Dynamic Island Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-50 flex items-center justify-between px-3">
          <div className="w-2.5 h-2.5 rounded-full bg-gray-900 border border-gray-800" />
          <div className="w-2.5 h-2.5 rounded-full bg-blue-900/40" />
        </div>

        {/* Status Bar */}
        <div className="pt-2 px-6 pb-1 flex justify-between items-center text-[11px] font-bold text-gray-800 bg-white/90 backdrop-blur-md z-40 rounded-t-[38px]">
          <span>09:41</span>
          <div className="flex items-center gap-1.5">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Screen Content */}
        <div className="flex-1 bg-[#FAF7F2] overflow-y-auto rounded-b-[38px] relative">
          {children}
        </div>

        {/* Home Bar Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-400 rounded-full z-50" />
      </div>
    </div>
  );
}
