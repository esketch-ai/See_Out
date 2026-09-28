import { lazyModal, warmAll } from './design-system/LazyModal.js';
import React, { Suspense, useState, useEffect } from 'react';
import { Header, MainTab } from './components/Header.js';
import { NormalMode } from './components/NormalMode.js';
import { EmergencyMode } from './components/EmergencyMode.js';
import { LegalDocumentType } from '../legal/types.js';
import { PhoneCall } from 'lucide-react';

// 약관은 유족이 하단 링크를 눌러야 처음 읽히는 보조 화면이다.
// 첫 화면 735KB 에 실을 이유가 없어 조각으로 뺀다.
const legalModal = lazyModal(() => import('./components/LegalPolicyModal.js'));
const LegalPolicyModal = legalModal.Comp;
const PRELOAD_MODALS = [legalModal.preload];



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

  // 모달 조각을 한가할 때 미리 받는다.
  // 조각이 늦으면 유족은 「멈췄다」고 판단해 두 번 누른다. 이중안심 대상이므로
  // 클릭 지연을 감수하지 않는다 — 네트워크가 한가할 때 끝내둔다.
  useEffect(() => {
    warmAll(PRELOAD_MODALS);
  }, []);

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

          <footer className="mt-20 pt-10 border-t border-[#DCD6C9] text-center text-[13px] md:text-sm text-[#5A5E66] space-y-3 font-serif">
            {/* 30년+ 전문변호인단 법률 감수 공식 약관 링크 바 */}
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[13px] font-bold text-[#5A5E66]">
              <button
                onClick={() => handleOpenLegal('TERMS_OF_SERVICE')}
                className="hover:text-[#19382C] underline decoration-[#6E5429] underline-offset-4 cursor-pointer"
              >
                서비스 이용약관
              </button>
              <span className="text-[#C2A26A]">|</span>
              <button
                onClick={() => handleOpenLegal('PRIVACY_POLICY')}
                className="text-[#19382C] hover:text-[#2D4F43] font-black underline decoration-[#19382C] underline-offset-4 cursor-pointer"
              >
                개인정보 처리방침
              </button>
              <span className="text-[#C2A26A]">|</span>
              <button
                onClick={() => handleOpenLegal('LOCATION_TERMS')}
                className="hover:text-[#19382C] underline decoration-[#6E5429] underline-offset-4 cursor-pointer"
              >
                위치기반서비스 약관
              </button>
              <span className="text-[#C2A26A]">|</span>
              <button
                onClick={() => handleOpenLegal('OPT_OUT_REGULATION')}
                className="hover:text-[#19382C] underline decoration-[#6E5429] underline-offset-4 cursor-pointer"
              >
                e하늘 공공데이터 & 옵트아웃 규정
              </button>
              <span className="text-[#C2A26A]">|</span>
              <button
                onClick={() => handleOpenLegal('DIGITAL_LEGACY_POLICY')}
                className="hover:text-[#19382C] underline decoration-[#6E5429] underline-offset-4 cursor-pointer"
              >
                디지털 유산 사후 승계 규약
              </button>
            </div>

            <p className="font-bold text-[#151719] text-sm md:text-base">
              배웅(Bae-ung) 라이프엔딩 플랫폼 — 고인의 마지막 가시는 길, 최고의 예우로 곁을 지키겠습니다
            </p>
            <p className="text-[13px] text-[#5A5E66] leading-relaxed">
              사단법인 한국장례협회 등록 데이터 및 보건복지부 e하늘 장사정보시스템 공공 표준 준수<br />
              법률 및 컴플라이언스: 대한변호사협회 등록 30년+ 전문변호인단 법률 감수 완료 | CPO 개인정보보호책임자: privacy@baeung.kr | Themis-AI PARA 거버넌스
            </p>
          </footer>
        </div>
      )}

      {/* 30년+ 전문변호인단 법률 감수 약관 및 컴플라이언스 모달 */}
      <Suspense fallback={null}>
        <LegalPolicyModal
          isOpen={isLegalModalOpen}
          initialDocType={selectedLegalDoc}
          onClose={() => setIsLegalModalOpen(false)}
        />
      </Suspense>

      {/* 5090 시니어 안심 모바일 플로팅 핫라인 바 (화면 하단 상시 고정) */}
      {!isEmergencyMode && (
        <aside className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#141618]/95 backdrop-blur-md border-t border-[#3D382E] p-3 px-4 flex items-center justify-between shadow-2xl text-[#FAF9F6]">
          <div className="flex flex-col">
            <span className="text-[13px] font-serif text-[#8A929D]">
              24시 장례지도사 직통 상황실
            </span>
            <span className="text-sm font-reverence font-bold text-[#FAF9F6] tracking-tight">
              1588-0000 (전국 무료)
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <a
              href="tel:1588-0000"
              className="px-4 py-2 bg-[#19382C] border border-[#2D4F43] text-[#FAF9F6] font-serif font-bold text-[13px] rounded-md flex items-center space-x-1.5 cursor-pointer hover:bg-[#2D4F43]"
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
