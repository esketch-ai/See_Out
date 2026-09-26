import React, { useState } from 'react';
import {
  AlertCircle,
  FileText,
  Building2,
  PackageCheck,
  BookOpen,
  LayoutDashboard,
  ZoomIn,
  PhoneCall,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { TraditionalSeal } from '../design-system/index.js';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: { id: MainTab; label: string; seal: string; desc: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: '종합 의전 안내', seal: '禮', desc: '홈 요약 및 4대 핵심 서비스 둘러보기', icon: LayoutDashboard },
    { id: 'quote', label: '상조 증서 원가 진단', seal: '眞', desc: '3초 카메라 스캔 & 1:1 맞춤 영수증 비교', icon: FileText },
    { id: 'funeral-halls', label: '전국 장례식장 시설 · 감면', seal: '安', desc: '전국 1,080곳 빈소 시설 & 30% 감면 혜택', icon: Building2 },
    { id: 'packages', label: '정찰제 의전 패키지', seal: '誠', desc: '무빈소·실속형·표준형 100% 투명 정찰제', icon: PackageCheck },
    { id: 'life-archive', label: '생애기록관 (사전 봉안)', seal: '永', desc: '고인의 삶을 영구 보존하는 디지털 추모관', icon: BookOpen }
  ];

  const handleSelectNav = (tabId: MainTab) => {
    onSelectTab(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-porcelain/98 backdrop-blur-md border-b-2 border-ink-border shadow-sm">
      {/* 1. 최상단 브랜드 및 긴급 지원 바 */}
      <div className="max-w-5xl mx-auto px-4 py-3 sm:py-3.5 flex items-center justify-between border-b border-ink-border/60">
        {/* Brand */}
        <div
          onClick={() => {
            onToggleMode(false);
            handleSelectNav('home');
          }}
          className="flex items-center space-x-2.5 sm:space-x-3.5 cursor-pointer group"
        >
          <div
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center font-reverence font-black text-xl sm:text-2xl text-white shadow-md transition-all shrink-0 ${
              isEmergencyMode ? 'bg-crimson-600 ring-2 ring-crimson-400' : 'bg-celadon-800 ring-2 ring-nobleGold-500/40 group-hover:scale-102'
            }`}
          >
            배웅
          </div>
          <div>
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <span className="font-reverence font-black text-xl sm:text-2xl md:text-3xl tracking-tight text-ink">
                배웅
              </span>
              {/* 전통 붉은 전각 낙관 인장 컴포넌트 */}
              <TraditionalSeal sealKey="courtesy" size="md" />
              <span className="text-[11px] sm:text-xs px-2 sm:px-2.5 py-0.5 rounded font-serif font-bold bg-nobleGold-50 text-nobleGold-700 border border-nobleGold-500/30 hidden sm:inline">
                정직원가 의전
              </span>
            </div>
            <p className="hidden sm:block text-xs md:text-sm text-ink-muted font-serif font-medium mt-0.5">
              삼가 고인을 기리며, 최고의 예우와 정직한 원가로 곁을 지킵니다
            </p>
          </div>
        </div>

        {/* 우측 유틸리티: 노안 배려 글자 확대 버튼 + 긴급 의전 핫라인 + 모바일 햄버거 토글 */}
        <div className="flex items-center space-x-1.5 sm:space-x-2.5">
          {/* 글자 크기 토글 (어르신 배려 모드) */}
          <button
            onClick={onToggleLargeFont}
            className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-1 sm:space-x-1.5 border transition-all cursor-pointer ${
              isLargeFont
                ? 'bg-nobleGold-100 border-nobleGold-500 text-nobleGold-800 ring-2 ring-nobleGold-500/20'
                : 'bg-hanji border-ink-border text-ink-light hover:bg-porcelain'
            }`}
            title="노안 어르신을 위한 큰 글씨 모드"
          >
            <ZoomIn className="w-4 h-4 text-nobleGold-600" />
            <span className="font-serif">{isLargeFont ? '글씨: 크게' : '글씨 확대'}</span>
          </button>

          {/* 비상 긴급 출동 핫라인 토글 */}
          <button
            onClick={() => onToggleMode(!isEmergencyMode)}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-reverence font-bold flex items-center space-x-1.5 sm:space-x-2 shadow-sm transition-all cursor-pointer ${
              isEmergencyMode
                ? 'bg-crimson-700 text-white ring-2 ring-crimson-400'
                : 'bg-crimson-600 hover:bg-crimson-700 text-white'
            }`}
          >
            <AlertCircle className="w-4 h-4 animate-pulse" />
            <span className="hidden sm:inline">{isEmergencyMode ? '평시 화면 복귀 ✕' : '🚨 24시 긴급 의전'}</span>
            <span className="sm:hidden">{isEmergencyMode ? '복귀 ✕' : '🚨 긴급'}</span>
          </button>

          {/* 모바일 햄버거 메뉴 토글 버튼 */}
          {!isEmergencyMode && (
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-hanji border border-ink-border text-ink hover:bg-porcelain focus:outline-none cursor-pointer"
              aria-label="메뉴 열기"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-crimson-700" />
              ) : (
                <Menu className="w-5 h-5 text-ink" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* 2-A. 데스크톱 5대 핵심 메뉴 내비게이션 바 (GNB) */}
      {!isEmergencyMode && (
        <nav className="hidden md:block bg-hanji/90">
          <div className="max-w-5xl mx-auto px-4 flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectNav(item.id)}
                  className={`py-3.5 px-4 md:px-5 text-base md:text-lg font-reverence font-bold flex items-center space-x-2 shrink-0 border-b-3 transition-all cursor-pointer ${
                    isActive
                      ? 'border-celadon-800 text-celadon-900 bg-porcelain shadow-xs'
                      : 'border-transparent text-ink-muted hover:text-ink hover:bg-porcelain/60'
                  }`}
                >
                  <span className={`text-[11px] px-1.5 py-0.2 rounded font-serif font-black ${
                    isActive ? 'bg-celadon-800 text-nobleGold-200' : 'bg-ink-border text-ink-muted'
                  }`}>
                    {item.seal}
                  </span>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-celadon-800' : 'text-ink-muted'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}

      {/* 2-B. 모바일 수평 스크롤 내비게이션 탭 (메뉴 닫혀있을 때 상시 노출) */}
      {!isEmergencyMode && !isMobileMenuOpen && (
        <nav className="md:hidden bg-hanji border-b border-ink-border/50 overflow-x-auto scrollbar-none px-3 py-2">
          <div className="flex space-x-2 min-w-max">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectNav(item.id)}
                  className={`py-2 px-3 text-xs sm:text-sm font-reverence font-bold rounded-xl flex items-center space-x-1.5 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-celadon-800 text-white shadow-xs'
                      : 'bg-porcelain border border-ink-border text-ink-light hover:bg-celadon-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-nobleGold-300' : 'text-ink-muted'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}

      {/* 2-C. 모바일 전체 드로어 메뉴 (햄버거 클릭 시 시원시원한 전면 리스트) */}
      {!isEmergencyMode && isMobileMenuOpen && (
        <div className="md:hidden bg-porcelain border-b-2 border-celadon-800 shadow-xl p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="text-xs font-serif font-bold text-ink-muted px-1 pb-1 border-b border-ink-border flex justify-between items-center">
            <span>배웅 주요 서비스 메뉴 선택</span>
            <span className="text-celadon-800 font-bold">5개 메뉴 바로가기</span>
          </div>

          <div className="space-y-2 pt-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectNav(item.id)}
                  className={`w-full p-4 rounded-2xl flex items-center justify-between text-left transition-all cursor-pointer border-2 ${
                    isActive
                      ? 'border-celadon-700 bg-celadon-50 text-celadon-900 shadow-sm ring-1 ring-celadon-700/20'
                      : 'border-ink-border bg-hanji/80 text-ink hover:bg-porcelain'
                  }`}
                >
                  <div className="flex items-center space-x-3.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isActive ? 'bg-celadon-800 text-white' : 'bg-porcelain border border-ink-border text-ink-muted'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-reverence font-bold text-base text-ink">{item.label}</div>
                      <div className="text-xs text-ink-muted font-serif mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 shrink-0 ${isActive ? 'text-celadon-800' : 'text-ink-border'}`} />
                </button>
              );
            })}
          </div>

          {/* 모바일 드로어 하단 빠른 지원 바 */}
          <div className="pt-3 border-t border-ink-border flex flex-col space-y-2">
            <a
              href="tel:1588-0000"
              className="w-full py-3.5 px-4 bg-crimson-600 hover:bg-crimson-700 text-white font-reverence font-bold text-sm rounded-xl flex items-center justify-center space-x-2 shadow-md cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 animate-bounce" />
              <span>24시 긴급 장례 상담 전화: 1588-0000 (즉시 연결)</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

