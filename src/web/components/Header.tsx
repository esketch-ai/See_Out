import React from 'react';
import { AlertCircle, HeartHandshake, PhoneCall } from 'lucide-react';

interface HeaderProps {
  isEmergencyMode: boolean;
  onToggleMode: (emergency: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ isEmergencyMode, onToggleMode }) => {
  return (
    <header className="sticky top-0 z-50 bg-porcelain/95 backdrop-blur-md shadow-sm border-b border-ink-border">
      <div className="max-w-4xl mx-auto px-4 py-3.5 flex items-center justify-between">
        {/* Brand: 한국적 기품과 예우의 상징 */}
        <div className="flex items-center space-x-3">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center font-reverence font-bold text-xl text-white shadow-sm transition-colors ${
              isEmergencyMode ? 'bg-crimson-600' : 'bg-celadon-700'
            }`}
          >
            배웅
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-reverence font-extrabold text-2xl tracking-tight text-ink">
                배웅
              </span>
              <span className="text-xs px-2 py-0.5 rounded font-serif font-bold bg-nobleGold-100 text-nobleGold-700 border border-nobleGold-500/20">
                예우의전 禮
              </span>
            </div>
            <p className="text-xs text-ink-muted font-medium mt-0.5">
              삼가 고인을 기리며, 정직과 예의로 곁을 지킵니다
            </p>
          </div>
        </div>

        {/* 듀얼 모드 토글 스위처 (시니어 안심 인터페이스) */}
        <div className="flex items-center bg-hanji p-1 rounded-2xl border border-ink-border">
          <button
            onClick={() => onToggleMode(false)}
            className={`px-3.5 py-2 rounded-xl text-sm font-bold flex items-center space-x-1.5 transition-all ${
              !isEmergencyMode
                ? 'bg-porcelain text-celadon-900 shadow-sm border border-ink-border/80 font-bold'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            <HeartHandshake className="w-4 h-4 text-celadon-700" />
            <span>평시 (사전대비 · 기록)</span>
          </button>

          <button
            onClick={() => onToggleMode(true)}
            className={`px-3.5 py-2 rounded-xl text-sm font-bold flex items-center space-x-1.5 transition-all ${
              isEmergencyMode
                ? 'bg-crimson-600 text-white shadow-sm'
                : 'text-crimson-600 hover:bg-crimson-50'
            }`}
          >
            <AlertCircle className="w-4 h-4" />
            <span>긴급 의전 (임종 발생)</span>
          </button>
        </div>
      </div>
    </header>
  );
};
