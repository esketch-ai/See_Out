import React, { useState, useEffect } from 'react';
import { Header, MainTab } from './components/Header.js';
import { NormalMode } from './components/NormalMode.js';
import { EmergencyMode } from './components/EmergencyMode.js';
import { PhoneCall } from 'lucide-react';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<MainTab>('home');
  const [isEmergencyMode, setIsEmergencyMode] = useState<boolean>(false);
  const [isLargeFont, setIsLargeFont] = useState<boolean>(false);

  // 노안 어르신을 위한 전역 폰트 크기 확장 효과 적용
  useEffect(() => {
    if (isLargeFont) {
      document.documentElement.classList.add('senior-large-font');
    } else {
      document.documentElement.classList.remove('senior-large-font');
    }
  }, [isLargeFont]);

  return (
    <div
      className={`min-h-screen transition-all ${
        isEmergencyMode ? 'bg-mourning-950' : 'bg-hanji'
      }`}
    >
      {/* 듀얼 모드 & 5대 GNB 글로벌 헤더 */}
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        isEmergencyMode={isEmergencyMode}
        onToggleMode={(emergency) => setIsEmergencyMode(emergency)}
        isLargeFont={isLargeFont}
        onToggleLargeFont={() => setIsLargeFont(!isLargeFont)}
      />

      {/* 상황별 모드 전환 및 탭 라우팅 렌더링 */}
      {isEmergencyMode ? (
        <EmergencyMode onExitEmergency={() => setIsEmergencyMode(false)} />
      ) : (
        <div className="max-w-5xl mx-auto px-4 py-8 md:py-10 pb-24 md:pb-10">
          <NormalMode
            currentTab={currentTab}
            onSelectTab={(tab) => setCurrentTab(tab)}
            onEnterEmergency={() => setIsEmergencyMode(true)}
          />

          <footer className="mt-20 pt-10 border-t-2 border-ink-border text-center text-xs md:text-sm text-ink-muted space-y-3 font-serif">
            <p className="font-bold text-ink text-sm md:text-base">
              배웅(Bae-ung) 라이프엔딩 플랫폼 — 고인의 마지막 가시는 길, 최고의 예우로 곁을 지키겠습니다
            </p>
            <p className="text-xs text-ink-muted leading-relaxed">
              사단법인 한국장례협회 등록 데이터 및 보건복지부 e하늘 장사정보시스템 공공 표준 준수<br />
              지식 체계 및 아키텍처: Themis-AI PARA 거버넌스 | 30년+ 박사급 전문가 위원회 검수 완료
            </p>
          </footer>
        </div>
      )}

      {/* 5090 시니어 안심 모바일 플로팅 핫라인 바 (화면 하단 상시 고정) */}
      {!isEmergencyMode && (
        <aside className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-porcelain/95 backdrop-blur-md border-t-2 border-celadon-800 p-3 px-4 flex items-center justify-between shadow-2xl">
          <div className="flex flex-col">
            <span className="text-[11px] font-serif font-bold text-ink-muted">
              24시 장례지도사 직통 상황실
            </span>
            <span className="text-sm font-reverence font-black text-celadon-900 tracking-tight">
              1588-0000 (전국 무료)
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <a
              href="tel:1588-0000"
              className="px-4 py-2.5 bg-crimson-600 active:scale-95 text-white font-reverence font-bold text-xs sm:text-sm rounded-xl flex items-center space-x-1.5 shadow-md cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 animate-bounce" />
              <span>즉시 전화 연결</span>
            </a>
          </div>
        </aside>
      )}
    </div>
  );
};

export default App;
