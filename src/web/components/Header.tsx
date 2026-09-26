import React from 'react';
import { AlertCircle, ShieldCheck, HeartHandshake, PhoneCall } from 'lucide-react';

interface HeaderProps {
  isEmergencyMode: boolean;
  onToggleMode: (emergency: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ isEmergencyMode, onToggleMode }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur shadow-sm border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-2">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-状況 items-center justify-center font-black text-xl text-white ${isEmergencyMode ? 'bg-emergency-600' : 'bg-emerald-600'}`}>
            배
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-xl tracking-tight text-gray-900">배웅</span>
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-gray-100 text-gray-600">Bae-ung</span>
            </div>
            <p className="text-xs text-gray-500 font-medium">선불식 거품 없는 투명 원가 라이프엔딩</p>
          </div>
        </div>

        {/* 듀얼 모드 토글 스위처 (핵심 UI 아키텍처) */}
        <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200">
          <button
            onClick={() => onToggleMode(false)}
            className={`px-3 py-1.5 rounded-lg text-sm font-bold flex items-center space-x-1 transition-all ${
              !isEmergencyMode
                ? 'bg-white text-emerald-800 shadow-sm border border-gray-200'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>평시(대비/기록)</span>
          </button>

          <button
            onClick={() => onToggleMode(true)}
            className={`px-3 py-1.5 rounded-lg text-sm font-bold flex items-center space-x-1 transition-all ${
              isEmergencyMode
                ? 'bg-emergency-600 text-white shadow-sm'
                : 'text-emergency-600 hover:bg-emergency-50'
            }`}
          >
            <AlertCircle className="w-4 h-4 animate-pulse" />
            <span>🚨 1초 긴급출동</span>
          </button>
        </div>
      </div>
    </header>
  );
};
