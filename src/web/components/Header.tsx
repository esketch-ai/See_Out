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

  const navItems: { id: MainTab; label: string; hanja: string; seal: string; desc: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: '종합 의전', hanja: '綜合儀典', seal: '禮', desc: '홈 요약 및 4대 핵심 서비스 둘러보기', icon: LayoutDashboard },
    { id: 'quote', label: '원가 진단', hanja: '原價診斷', seal: '眞', desc: '3초 카메라 스캔 & 1:1 맞춤 영수증 비교', icon: FileText },
    { id: 'funeral-halls', label: '장례식장', hanja: '葬禮式場', seal: '安', desc: '전국 1,080곳 빈소 시설 & 30% 감면 혜택', icon: Building2 },
    { id: 'packages', label: '정찰 패키지', hanja: '定札儀禮', seal: '誠', desc: '무빈소·실속형·표준형 100% 투명 정찰제', icon: PackageCheck },
    { id: 'life-archive', label: '생애기록관', hanja: '生涯記錄', seal: '永', desc: '고인의 삶을 영구 보존하는 사전 봉안관', icon: BookOpen }
  ];

  const handleSelectNav = (tabId: MainTab) => {
    onSelectTab(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#121417] border-b border-[#2C2822] shadow-md text-[#F7F5F0]">
      {/* 1. 최상단 브랜드 및 품격 있는 의전 지원 바 */}
      <div className="max-w-5xl mx-auto px-4 py-3 sm:py-3.5 flex items-center justify-between">
        {/* Brand Identity */}
        <div
          onClick={() => {
            onToggleMode(false);
            handleSelectNav('home');
          }}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          {/* 브랜드 문장(Logo Mark) */}
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-md bg-[#19382C] border border-[#2A5442] flex items-center justify-center font-reverence font-black text-xl text-[#F7F5F0] shadow-sm tracking-tight">
            배웅
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-reverence font-black text-xl sm:text-2xl tracking-wider text-[#FAF9F6]">
                배 웅
              </span>
              {/* 전통 주사 낙관 인장 */}
              <TraditionalSeal sealKey="courtesy" size="sm" />
              <span className="text-[11px] px-2 py-0.5 rounded font-serif font-medium bg-[#1F2227] text-[#D8CEBA] border border-[#3D372E] hidden sm:inline">
                至誠奉送 · 정직원가 의전
              </span>
            </div>
            <p className="hidden sm:block text-xs text-[#A39E93] font-serif mt-0.5 tracking-tight">
              삼가 고인의 명복을 빌며, 지극한 정성과 투명한 원가로 곁을 지킵니다
            </p>
          </div>
        </div>

        {/* 우측 유틸리티: 노안 배려 글자 확대 버튼 + 품격 있는 24시 의전 지원 + 모바일 메뉴 */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* 글자 크기 토글 (어르신 배려 모드) */}
          <button
            onClick={onToggleLargeFont}
            className={`px-2.5 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm font-serif font-medium flex items-center space-x-1.5 border transition-all cursor-pointer ${
              isLargeFont
                ? 'bg-[#9E7D47]/20 border-[#9E7D47] text-[#F5EBD8] ring-1 ring-[#9E7D47]/40'
                : 'bg-[#1A1D20] border-[#363229] text-[#BDB7AA] hover:text-[#F7F5F0] hover:border-[#9E7D47]/50'
            }`}
            title="노안 어르신을 위한 큰 글씨 모드"
          >
            <ZoomIn className="w-3.5 h-3.5 text-[#C2A26A]" />
            <span>{isLargeFont ? '글씨: 크게' : '글씨 확대'}</span>
          </button>

          {/* 24시 긴급 의전 지원 핫라인 토글 */}
          <button
            onClick={() => onToggleMode(!isEmergencyMode)}
            className={`px-3 sm:px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-serif font-bold flex items-center space-x-1.5 border transition-all cursor-pointer ${
              isEmergencyMode
                ? 'bg-[#8B2520] border-[#B83E38] text-white shadow-sm'
                : 'bg-[#9E7D47]/15 border-[#9E7D47]/80 text-[#F4E9D5] hover:bg-[#9E7D47]/25'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#C2A26A] animate-pulse" />
            <span className="hidden sm:inline">{isEmergencyMode ? '평시 안내 복귀 ✕' : '24시 긴급 의전 접수'}</span>
            <span className="sm:hidden">{isEmergencyMode ? '복귀 ✕' : '24시 접수'}</span>
          </button>

          {/* 모바일 메뉴 토글 버튼 */}
          {!isEmergencyMode && (
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md bg-[#1A1D20] border border-[#363229] text-[#D8D2C5] hover:text-white focus:outline-none cursor-pointer"
              aria-label="메뉴 열기"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-[#C2A26A]" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* 2-A. 데스크톱 5대 핵심 메뉴 내비게이션 바 (GNB) */}
      {!isEmergencyMode && (
        <nav className="hidden md:block bg-[#0D0E10] border-t border-[#23201B]">
          <div className="max-w-5xl mx-auto px-4 flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectNav(item.id)}
                  className={`py-3 px-4 text-sm sm:text-base font-serif font-medium flex items-center space-x-2 shrink-0 border-b-2 transition-all cursor-pointer ${
                    isActive
                      ? 'border-[#C2A26A] text-[#FAF9F6] bg-[#16181B]'
                      : 'border-transparent text-[#9E988D] hover:text-[#FAF9F6] hover:bg-[#16181B]/50'
                  }`}
                >
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-serif ${
                    isActive ? 'bg-[#9E7D47] text-[#0E1012] font-black' : 'bg-[#212429] text-[#8C867B]'
                  }`}>
                    {item.seal}
                  </span>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#C2A26A]' : 'text-[#7D776D]'}`} />
                  <span className="tracking-tight">{item.label}</span>
                  <span className="text-[11px] text-[#69645B] font-normal hidden lg:inline">({item.hanja})</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}

      {/* 2-B. 모바일 수평 스크롤 내비게이션 탭 (메뉴 닫혀있을 때 상시 노출) */}
      {!isEmergencyMode && !isMobileMenuOpen && (
        <nav className="md:hidden bg-[#0D0E10] border-t border-[#23201B] overflow-x-auto scrollbar-none px-3 py-2">
          <div className="flex space-x-1.5 min-w-max">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectNav(item.id)}
                  className={`py-1.5 px-3 text-xs font-serif font-medium rounded-md flex items-center space-x-1.5 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#19382C] text-[#FAF9F6] border border-[#2D5A46]'
                      : 'bg-[#16181B] border border-[#2A2722] text-[#9E988D]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#C2A26A]' : 'text-[#7D776D]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}

      {/* 2-C. 모바일 전체 드로어 메뉴 */}
      {!isEmergencyMode && isMobileMenuOpen && (
        <div className="md:hidden bg-[#121417] border-b border-[#2C2822] shadow-2xl p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="text-xs font-serif text-[#A39E93] px-1 pb-2 border-b border-[#2C2822] flex justify-between items-center">
            <span>배웅 전통 라이프엔딩 주요 의전</span>
            <span className="text-[#C2A26A]">5대 정례 메뉴</span>
          </div>

          <div className="space-y-1.5 pt-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectNav(item.id)}
                  className={`w-full p-3.5 rounded-lg flex items-center justify-between text-left transition-all cursor-pointer border ${
                    isActive
                      ? 'border-[#9E7D47] bg-[#19382C]/40 text-[#FAF9F6]'
                      : 'border-[#26231E] bg-[#16181B] text-[#D8D2C5] hover:bg-[#1E2125]'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 ${
                        isActive ? 'bg-[#9E7D47] text-[#0E1012] font-black' : 'bg-[#212429] text-[#C2A26A]'
                      }`}
                    >
                      <span className="text-xs font-serif">{item.seal}</span>
                    </div>
                    <div>
                      <div className="font-serif font-bold text-sm text-[#FAF9F6]">
                        {item.label} <span className="text-xs text-[#8C867B] font-normal font-sans">({item.hanja})</span>
                      </div>
                      <div className="text-[11px] text-[#8C867B] font-serif mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#C2A26A]' : 'text-[#4A463F]'}`} />
                </button>
              );
            })}
          </div>

          {/* 모바일 드로어 하단 핫라인 */}
          <div className="pt-2 border-t border-[#26231E]">
            <a
              href="tel:1588-0000"
              className="w-full py-3 px-4 bg-[#19382C] border border-[#2D5A46] text-[#FAF9F6] font-serif font-bold text-xs rounded-md flex items-center justify-center space-x-2 cursor-pointer hover:bg-[#204738]"
            >
              <PhoneCall className="w-4 h-4 text-[#C2A26A]" />
              <span>24시간 장례지도사 직통 상담: 1588-0000 (무료)</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

