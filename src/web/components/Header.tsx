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
  ChevronRight,
  Mic
} from 'lucide-react';
import { TraditionalSeal, BaeungLogo } from '../design-system/index.js';

export type MainTab = 'home' | 'quote' | 'funeral-halls' | 'packages' | 'life-archive';

interface HeaderProps {
  currentTab: MainTab;
  onSelectTab: (tab: MainTab) => void;
  isEmergencyMode: boolean;
  onToggleMode: (emergency: boolean) => void;
  isLargeFont: boolean;
  onToggleLargeFont: () => void;
  onOpenVoiceAssistant?: () => void;
  onOpenPartnerPortal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  isEmergencyMode,
  onToggleMode,
  isLargeFont,
  onToggleLargeFont,
  onOpenVoiceAssistant,
  onOpenPartnerPortal
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: { id: MainTab; label: string; desc: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: '종합 의전', desc: '홈 요약 및 4대 핵심 서비스 둘러보기', icon: LayoutDashboard },
    { id: 'quote', label: '원가 진단', desc: '3초 증서 사진 판독 & 1:1 맞춤 영수증 비교', icon: FileText },
    { id: 'funeral-halls', label: '장례식장', desc: '전국 1,080곳 빈소 시설 & 30% 감면 혜택', icon: Building2 },
    { id: 'packages', label: '정찰 패키지', desc: '무빈소·2일가족장·실속·품격 4대 투명 정찰제', icon: PackageCheck },
    { id: 'life-archive', label: '생애기록관', desc: '모바일 부고장 & 생애 평전 (살아온 이야기)', icon: BookOpen }
  ];

  const handleSelectNav = (tabId: MainTab) => {
    onSelectTab(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b shadow-xs relative overflow-hidden transition-colors ${
        isEmergencyMode
          ? 'bg-[#141618] border-[#3D382E] text-[#F7F5F0]'
          : 'bg-[#FAF9F6] border-[#DCD6C9] text-[#151719]'
      }`}
    >
      {/* 은은한 전통 문양 오버레이 (비상 모드는 금문, 평시는 창호 격자문) */}
      <div
        className={`pointer-events-none absolute inset-0 ${
          isEmergencyMode
            ? 'k-pattern-geummun opacity-25'
            : 'k-pattern-gyeokja opacity-15'
        }`}
      />

      {/* 1. 최상단 브랜드 및 품격 있는 의전 지원 바 */}
      <div className="max-w-5xl mx-auto px-4 py-3 sm:py-3.5 flex items-center justify-between relative z-10">
        {/* Brand Identity */}
        <div
          onClick={() => {
            onToggleMode(false);
            handleSelectNav('home');
          }}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          {/* 브랜드 문장(Logo Mark): 처마와 사립문 */}
          <BaeungLogo
            variant="symbol"
            theme={isEmergencyMode ? 'dark' : 'light'}
            size={44}
            className="group-hover:scale-103 transition-transform"
          />
          <div>
            <div className="flex items-center space-x-2">
              <span
                className={`font-reverence font-black text-xl sm:text-2xl tracking-wider ${
                  isEmergencyMode ? 'text-[#FAF9F6]' : 'text-[#19382C]'
                }`}
              >
                배 웅
              </span>
              {/* 전통 주사 낙관 인장 */}
              <TraditionalSeal sealKey="courtesy" size="sm" />
              <span
                className={`text-[13px] px-2 py-0.5 rounded font-serif font-medium border hidden sm:inline ${
                  isEmergencyMode
                    ? 'bg-[#1F2226] text-[#8A929D] border-[#3D382E]'
                    : 'bg-[#19382C]/10 text-[#19382C] border-[#19382C]/20'
                }`}
              >
                {isEmergencyMode ? '24시 긴급 의전 가동' : '지극한 정성 · 정직한 동행'}
              </span>
            </div>
            <p
              className={`hidden sm:block text-[13px] font-serif mt-0.5 tracking-tight ${
                isEmergencyMode ? 'text-[#8A929D]' : 'text-[#5A5E66]'
              }`}
            >
              {isEmergencyMode
                ? '삼가 고인의 명복을 빌며, 24시간 가장 가까이에서 곁을 지킵니다'
                : '삼가 고인의 명복을 빌며, 지극한 정성과 맑은 마음으로 곁을 지킵니다'}
            </p>
          </div>
        </div>

        {/* 우측 유틸리티: 노안 배려 글자 확대 버튼 + 품격 있는 24시 의전 지원 + 모바일 메뉴 */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* 글자 크기 토글 (어르신 배려 모드) */}
          <button
            onClick={onToggleLargeFont}
            className={`px-2.5 sm:px-3 py-1.5 rounded-md text-[13px] sm:text-sm font-serif font-medium flex items-center space-x-1.5 border transition-all cursor-pointer ${
              isEmergencyMode
                ? isLargeFont
                  ? 'bg-[#9E7D47]/20 border-[#9E7D47] text-[#F5EBD8] ring-1 ring-[#9E7D47]/40'
                  : 'bg-[#1F2226] border-[#3D382E] text-[#8A929D] hover:text-[#F7F5F0] hover:border-[#9E7D47]/50'
                : isLargeFont
                  ? 'bg-[#19382C]/10 border-[#19382C] text-[#19382C] ring-1 ring-[#19382C]/30'
                  : 'bg-[#FFFFFF] border-[#DCD6C9] text-[#5A5E66] hover:text-[#19382C] hover:border-[#19382C]/50'
            }`}
            title="노안 어르신을 위한 큰 글씨 모드"
          >
            <ZoomIn
              className={`w-3.5 h-3.5 ${
                isEmergencyMode
                  ? 'text-[#C2A26A]'
                  : isLargeFont
                    ? 'text-[#19382C]'
                    : 'text-[#6E5429]'
              }`}
            />
            <span>{isLargeFont ? '글씨: 크게' : '글씨 확대'}</span>
          </button>

          {/* 24시 긴급 의전 지원 핫라인 토글 */}
          <button
            onClick={() => onToggleMode(!isEmergencyMode)}
            className={`px-3 sm:px-3.5 py-1.5 rounded-md text-[13px] sm:text-sm font-serif font-bold flex items-center space-x-1.5 border transition-all cursor-pointer ${
              isEmergencyMode
                ? 'bg-[#8B2520] border-[#8B2520] text-[#FAF9F6] shadow-sm'
                : 'bg-[#FAF0EF] border-[#8B2520]/40 text-[#8B2520] hover:bg-[#8B2520] hover:text-[#FAF9F6]'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full animate-pulse ${
                isEmergencyMode ? 'bg-[#FAF9F6]' : 'bg-[#8B2520]'
              }`}
            />
            <span className="hidden sm:inline">{isEmergencyMode ? '평시 안내 복귀 ✕' : '24시 긴급 의전 접수'}</span>
            <span className="sm:hidden">{isEmergencyMode ? '복귀 ✕' : '24시 접수'}</span>
          </button>

          {/* 모바일 메뉴 토글 버튼 */}
          {!isEmergencyMode && (
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md bg-[#FFFFFF] border border-[#DCD6C9] text-[#5A5E66] hover:text-[#19382C] focus:outline-none cursor-pointer"
              aria-label="메뉴 열기"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-[#19382C]" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* 2-A. 데스크톱 5대 핵심 메뉴 내비게이션 바 (GNB) */}
      {!isEmergencyMode && (
        <nav className="hidden md:block bg-[#FFFFFF] border-t border-[#DCD6C9]">
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
                      ? 'border-[#19382C] text-[#19382C] bg-[#FAF9F6] font-bold'
                      : 'border-transparent text-[#5A5E66] hover:text-[#19382C] hover:bg-[#FAF9F6]/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#19382C]' : 'text-[#5A5E66]'}`} />
                  <span className="tracking-tight">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}

      {/* 2-B. 모바일 수평 스크롤 내비게이션 탭 (메뉴 닫혀있을 때 상시 노출) */}
      {!isEmergencyMode && !isMobileMenuOpen && (
        <nav className="md:hidden bg-[#FFFFFF] border-t border-[#DCD6C9] overflow-x-auto scrollbar-none px-3 py-2">
          <div className="flex space-x-1.5 min-w-max">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectNav(item.id)}
                  className={`py-1.5 px-3 text-[13px] font-serif font-medium rounded-md flex items-center space-x-1.5 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#19382C] text-[#FAF9F6] border border-[#2D4F43]'
                      : 'bg-[#FAF9F6] border border-[#DCD6C9] text-[#5A5E66]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#FAF9F6]' : 'text-[#5A5E66]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}

      {/* 2-C. 모바일 전체 드로어 메뉴 */}
      {!isEmergencyMode && isMobileMenuOpen && (
        <div className="md:hidden bg-[#FAF9F6] border-b border-[#DCD6C9] shadow-xl p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="text-[13px] font-serif text-[#5A5E66] px-1 pb-2 border-b border-[#DCD6C9] flex justify-between items-center">
            <span>배웅 전통 라이프엔딩 주요 의전</span>
            <span className="text-[#19382C] font-bold">5대 정례 메뉴</span>
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
                      ? 'border-[#19382C] bg-[#FFFFFF] text-[#19382C]'
                      : 'border-[#DCD6C9] bg-[#FFFFFF] text-[#5A5E66] hover:bg-[#F1EDE3]'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 ${
                        isActive ? 'bg-[#19382C] text-[#FAF9F6]' : 'bg-[#FAF9F6] text-[#19382C]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div
                        className={`font-serif font-bold text-sm ${
                          isActive ? 'text-[#19382C]' : 'text-[#151719]'
                        }`}
                      >
                        {item.label}
                      </div>
                      <div className="text-[13px] text-[#5A5E66] font-serif mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#19382C]' : 'text-[#5A5E66]'}`} />
                </button>
              );
            })}
          </div>

          {/* 모바일 드로어 B2B 파트너 포털 */}
          {onOpenPartnerPortal && (
            <div className="pt-2 border-t border-[#DCD6C9]">
              <button
                type="button"
                onClick={() => {
                  onOpenPartnerPortal();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left p-3 rounded-lg bg-[#FFFFFF] border border-[#DCD6C9] text-[#151719] font-serif font-bold text-[13px] flex items-center justify-between cursor-pointer hover:bg-[#F1EDE3]"
              >
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-[#19382C]" />
                  <span>장례식장 B2B 파트너 전용 포털 (SaaS)</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#19382C]" />
              </button>
            </div>
          )}

          {/* 모바일 드로어 하단 핫라인 */}
          <div className="pt-2 border-t border-[#DCD6C9]">
            <a
              href="tel:1588-0000"
              className="w-full py-3 px-4 bg-[#19382C] border border-[#2D4F43] text-[#FAF9F6] font-serif font-bold text-[13px] rounded-md flex items-center justify-center space-x-2 cursor-pointer hover:bg-[#2D4F43]"
            >
              <PhoneCall className="w-4 h-4 text-[#FAF9F6]" />
              <span>24시간 장례지도사 직통 상담: 1588-0000 (무료)</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

