import React from 'react';
import {
  AlertCircle,
  FileText,
  Building2,
  PackageCheck,
  BookOpen,
  LayoutDashboard,
  ZoomIn,
  PhoneCall
} from 'lucide-react';

export type MainTab = 'home' | 'quote' | 'funeral-halls' | 'packages' | 'life-archive';

interface HeaderProps {
  currentTab: MainTab;
  onSelectTab: (tab: MainTab) => void;
  isEmergencyMode: boolean;
  onToggleMode: (emergency: boolean) => void;
  isLargeFont: boolean;
  onToggleLargeFont: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  isEmergencyMode,
  onToggleMode,
  isLargeFont,
  onToggleLargeFont
}) => {
  const navItems: { id: MainTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: '종합 의전 안내', icon: LayoutDashboard },
    { id: 'quote', label: '상조 증서 원가 진단', icon: FileText },
    { id: 'funeral-halls', label: '전국 장례식장 시설 · 감면', icon: Building2 },
    { id: 'packages', label: '정찰제 의전 패키지', icon: PackageCheck },
    { id: 'life-archive', label: '생애기록관 (사전 봉안)', icon: BookOpen }
  ];

  return (
    <header className="sticky top-0 z-50 bg-porcelain/98 backdrop-blur-md border-b-2 border-ink-border shadow-sm">
      {/* 1. 최상단 브랜드 및 긴급 지원 바 */}
      <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center justify-between border-b border-ink-border/60">
        {/* Brand */}
        <div
          onClick={() => {
            onToggleMode(false);
            onSelectTab('home');
          }}
          className="flex items-center space-x-3.5 cursor-pointer"
        >
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center font-reverence font-black text-2xl text-white shadow-md transition-all ${
              isEmergencyMode ? 'bg-crimson-600 ring-2 ring-crimson-400' : 'bg-celadon-800 ring-2 ring-nobleGold-500/40'
            }`}
          >
            배웅
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-reverence font-black text-2xl md:text-3xl tracking-tight text-ink">
                배웅
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded font-serif font-bold bg-nobleGold-100 text-nobleGold-700 border border-nobleGold-500/30">
                예우의전 禮
              </span>
            </div>
            <p className="text-xs md:text-sm text-ink-muted font-serif font-medium mt-0.5">
              삼가 고인을 기리며, 최고의 예우와 정직한 원가로 곁을 지킵니다
            </p>
          </div>
        </div>

        {/* 우측 유틸리티: 노안 배려 글자 확대 버튼 + 긴급 의전 핫라인 */}
        <div className="flex items-center space-x-2.5">
          {/* 글자 크기 토글 (어르신 배려 모드) */}
          <button
            onClick={onToggleLargeFont}
            className={`px-3 py-2 rounded-xl text-xs md:text-sm font-bold flex items-center space-x-1.5 border transition-all ${
              isLargeFont
                ? 'bg-nobleGold-100 border-nobleGold-500 text-nobleGold-800 ring-2 ring-nobleGold-500/20'
                : 'bg-hanji border-ink-border text-ink-light hover:bg-porcelain'
            }`}
            title="노안 어르신을 위한 큰 글씨 모드"
          >
            <ZoomIn className="w-4 h-4 text-nobleGold-600" />
            <span className="font-serif">{isLargeFont ? '글씨: 아주 크게' : '글씨 확대'}</span>
          </button>

          {/* 비상 긴급 출동 핫라인 토글 */}
          <button
            onClick={() => onToggleMode(!isEmergencyMode)}
            className={`px-4 py-2 rounded-xl text-sm font-reverence font-bold flex items-center space-x-2 shadow-sm transition-all ${
              isEmergencyMode
                ? 'bg-crimson-700 text-white ring-2 ring-crimson-400'
                : 'bg-crimson-600 hover:bg-crimson-700 text-white'
            }`}
          >
            <AlertCircle className="w-4 h-4 animate-pulse" />
            <span>{isEmergencyMode ? '평시 화면 복귀 ✕' : '🚨 24시 긴급 의전'}</span>
          </button>
        </div>
      </div>

      {/* 2. 시원시원한 5대 핵심 메뉴 내비게이션 바 (GNB) */}
      {!isEmergencyMode && (
        <nav className="bg-hanji/90 overflow-x-auto scrollbar-none">
          <div className="max-w-5xl mx-auto px-4 flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`py-3.5 px-4 md:px-5 text-base md:text-lg font-reverence font-bold flex items-center space-x-2 shrink-0 border-b-3 transition-all cursor-pointer ${
                    isActive
                      ? 'border-celadon-800 text-celadon-900 bg-porcelain shadow-xs'
                      : 'border-transparent text-ink-muted hover:text-ink hover:bg-porcelain/60'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-celadon-800' : 'text-ink-muted'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
};
