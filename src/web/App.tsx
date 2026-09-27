import React, { useState, useEffect } from 'react';
import { Header, MainTab } from './components/Header.js';
import { NormalMode } from './components/NormalMode.js';
import { EmergencyMode } from './components/EmergencyMode.js';
import { LegalPolicyModal } from './components/LegalPolicyModal.js';
import { LegalDocumentType } from '../legal/types.js';
import { PhoneCall } from 'lucide-react';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<MainTab>('home');
  const [isEmergencyMode, setIsEmergencyMode] = useState<boolean>(false);
  const [isLargeFont, setIsLargeFont] = useState<boolean>(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState<boolean>(false);
  const [selectedLegalDoc, setSelectedLegalDoc] = useState<LegalDocumentType>('PRIVACY_POLICY');

  const handleOpenLegal = (type: LegalDocumentType) => {
    setSelectedLegalDoc(type);
    setIsLegalModalOpen(true);
  };

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

          <footer className="mt-20 pt-10 border-t border-[#E3DFD5] text-center text-xs md:text-sm text-[#727782] space-y-4 font-serif">
            {/* 30년+ 전문변호인단 법률 감수 공식 약관 링크 바 */}
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-bold text-[#42464E]">
              <button
                onClick={() => handleOpenLegal('TERMS_OF_SERVICE')}
                className="hover:text-[#19382C] underline decoration-[#9E7D47] underline-offset-4 cursor-pointer"
              >
                서비스 이용약관
              </button>
              <span className="text-[#C2A26A]">|</span>
              <button
                onClick={() => handleOpenLegal('PRIVACY_POLICY')}
                className="text-[#19382C] hover:text-[#204738] font-black underline decoration-[#19382C] underline-offset-4 cursor-pointer"
              >
                개인정보 처리방침
              </button>
              <span className="text-[#C2A26A]">|</span>
              <button
                onClick={() => handleOpenLegal('LOCATION_TERMS')}
                className="hover:text-[#19382C] underline decoration-[#9E7D47] underline-offset-4 cursor-pointer"
              >
                위치기반서비스 약관
              </button>
              <span className="text-[#C2A26A]">|</span>
              <button
                onClick={() => handleOpenLegal('OPT_OUT_REGULATION')}
                className="hover:text-[#19382C] underline decoration-[#9E7D47] underline-offset-4 cursor-pointer"
              >
                e하늘 공공데이터 & 옵트아웃 규정
              </button>
              <span className="text-[#C2A26A]">|</span>
              <button
                onClick={() => handleOpenLegal('DIGITAL_LEGACY_POLICY')}
                className="hover:text-[#19382C] underline decoration-[#9E7D47] underline-offset-4 cursor-pointer"
              >
                디지털 유산 사후 승계 규약
              </button>
            </div>

            <p className="font-bold text-[#151719] text-sm md:text-base">
              배웅(Bae-ung) 라이프엔딩 플랫폼 — 고인의 마지막 가시는 길, 최고의 예우로 곁을 지키겠습니다
            </p>
            <p className="text-xs text-[#8C867B] leading-relaxed">
              사단법인 한국장례협회 등록 데이터 및 보건복지부 e하늘 장사정보시스템 공공 표준 준수<br />
              법률 및 컴플라이언스: 대한변호사협회 등록 30년+ 전문변호인단 법률 감수 완료 | CPO 개인정보보호책임자: privacy@baeung.kr | Themis-AI PARA 거버넌스
            </p>
          </footer>
        </div>
      )}

      {/* 30년+ 전문변호인단 법률 감수 약관 및 컴플라이언스 모달 */}
      <LegalPolicyModal
        isOpen={isLegalModalOpen}
        initialDocType={selectedLegalDoc}
        onClose={() => setIsLegalModalOpen(false)}
      />

      {/* 5090 시니어 안심 모바일 플로팅 핫라인 바 (화면 하단 상시 고정) */}
      {!isEmergencyMode && (
        <aside className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#121417]/95 backdrop-blur-md border-t border-[#2C2822] p-3 px-4 flex items-center justify-between shadow-2xl text-[#FAF9F6]">
          <div className="flex flex-col">
            <span className="text-[11px] font-serif text-[#A39E93]">
              24시 장례지도사 직통 상황실
            </span>
            <span className="text-sm font-reverence font-bold text-[#FAF9F6] tracking-tight">
              1588-0000 (전국 무료)
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <a
              href="tel:1588-0000"
              className="px-4 py-2 bg-[#19382C] border border-[#2D5A46] text-[#FAF9F6] font-serif font-bold text-xs rounded-md flex items-center space-x-1.5 cursor-pointer hover:bg-[#204738]"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#C2A26A]" />
              <span>즉시 전화 연결</span>
            </a>
          </div>
        </aside>
      )}
    </div>
  );
};

export default App;
