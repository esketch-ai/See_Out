import { lazyModal, warmAll } from './design-system/LazyModal.js';
import React, { Suspense, useState, useEffect } from 'react';
import { Header, MainTab } from './components/Header.js';
import { NormalMode } from './components/NormalMode.js';
import { SharedObituaryView } from './components/SharedObituaryView.js';
import {
  SHARE_HASH_KEY,
  decodeShareLink,
  type SharedObituary,
} from './life-archive/obituaryShare.js';
import { EmergencyMode } from './components/EmergencyMode.js';
import { LegalDocumentType } from '../legal/types.js';
import { PhoneCall, Mic, Building2 } from 'lucide-react';

// 약관 및 고도화 모달 지연 로딩
const legalModal = lazyModal(() => import('./components/LegalPolicyModal.js'));
const voiceModal = lazyModal(() => import('./components/SeniorVoiceAssistantModal.js'));
const partnerModal = lazyModal(() => import('./components/PartnerPortalModal.js'));
const LegalPolicyModal = legalModal.Comp;
const SeniorVoiceAssistantModal = voiceModal.Comp;
const PartnerPortalModal = partnerModal.Comp;
const PRELOAD_MODALS = [legalModal.preload, voiceModal.preload, partnerModal.preload];

const MainApp: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<MainTab>('home');
  const [isEmergencyMode, setIsEmergencyMode] = useState<boolean>(false);
  const [isLargeFont, setIsLargeFont] = useState<boolean>(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState<boolean>(false);
  const [selectedLegalDoc, setSelectedLegalDoc] = useState<LegalDocumentType>('PRIVACY_POLICY');
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState<boolean>(false);
  const [isPartnerPortalOpen, setIsPartnerPortalOpen] = useState<boolean>(false);

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

  // ★ 하단 안내바 높이를 실시간으로 재고 CSS 변수로 노출한다.
  //
  //  왜: 음성 FAB 의 위치를 bottom-20(고정 80px) 에 두었더니, 「큰 글씨」 를
  //  켜면 안내바가 81px → 141px 로 자라며 FAB 를 덮었다. 360px 폭 기기에서
  //  FAB 의 누를 수 있는 면적이 100% → 33% 로 떨어졌다.
  //  즉 「노안을 돕는 버튼」 이 「노안을 위한 버튼」 을 가렸다.
  //  높이는 글자 크기·줄바꿈·문宽度에 따라 달라지므로 숫자로 가정하면 안 된다.
  useEffect(() => {
    const bar = document.querySelector('[data-bottom-bar]');
    const root = document.documentElement;
    if (!bar) return;
    const apply = () => {
      const h = Math.round(bar.getBoundingClientRect().height);
      root.style.setProperty('--bottom-bar-h', `${h}px`);
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(bar);
    return () => { ro.disconnect(); root.style.removeProperty('--bottom-bar-h'); };
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
        isEmergencyMode ? 'bg-[#FAF9F6]' : 'bg-hanji'
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
        onOpenVoiceAssistant={() => setIsVoiceAssistantOpen(true)}
        onOpenPartnerPortal={() => setIsPartnerPortalOpen(true)}
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

          <footer className="mt-20 pt-10 border-t border-[#DCD6C9] text-center text-[0.8125rem] md:text-sm text-[#5A5E66] space-y-3 font-serif">
            {/* 30년+ 전문변호인단 법률 감수 공식 약관 링크 바
             ★ 손 떨림 — 30px 로 측정한 적었다. 약관은 동의의 근거 문서다. */}
            <div className="k-tap-list text-[0.8125rem] font-bold text-[#5A5E66]">
              <button
                onClick={() => handleOpenLegal('TERMS_OF_SERVICE')}
                className="k-tap k-tap-pad hover:text-[#19382C] underline decoration-[#6E5429] underline-offset-4 cursor-pointer"
              >
                서비스 이용약관
              </button>
              <button
                onClick={() => handleOpenLegal('PRIVACY_POLICY')}
                className="k-tap k-tap-pad text-[#19382C] hover:text-[#2D4F43] font-black underline decoration-[#19382C] underline-offset-4 cursor-pointer"
              >
                개인정보 처리방침
              </button>
              <button
                onClick={() => handleOpenLegal('LOCATION_TERMS')}
                className="k-tap k-tap-pad hover:text-[#19382C] underline decoration-[#6E5429] underline-offset-4 cursor-pointer"
              >
                위치기반서비스 약관
              </button>
              <button
                onClick={() => handleOpenLegal('OPT_OUT_REGULATION')}
                className="k-tap k-tap-pad hover:text-[#19382C] underline decoration-[#6E5429] underline-offset-4 cursor-pointer"
              >
                e하늘 공공데이터 &amp; 옵트아웃 규정
              </button>
              <button
                onClick={() => handleOpenLegal('DIGITAL_LEGACY_POLICY')}
                className="k-tap k-tap-pad hover:text-[#19382C] underline decoration-[#6E5429] underline-offset-4 cursor-pointer"
              >
                디지털 유산 사후 승계 규약
              </button>
              {/* 파트너용은 유족 약관과 섞이지 않게 구분선으로 분리한다.
             세로 파이프는 줄바꿈 위치에 따라 끝에 홀로 남아 어색해진다. */}
              <button
                onClick={() => setIsPartnerPortalOpen(true)}
                className="k-tap k-tap-pad ml-3 border-l border-[#DCD6C9] pl-4 hover:text-[#19382C] underline decoration-[#6E5429] underline-offset-4 cursor-pointer"
              >
                장례식장 B2B 파트너 전용 포털 (SaaS)
              </button>
            </div>

            <p className="font-bold text-[#151719] text-[1.125rem]">
              배웅(Bae-ung) 라이프엔딩 플랫폼 — 고인의 마지막 가시는 길, 최고의 예우로 곁을 지키겠습니다
            </p>
            <p className="text-[1.125rem] text-[#5A5E66] leading-relaxed">
              사단법인 한국장례협회 등록 데이터 및 보건복지부 e하늘 장사정보시스템 공공 표준 준수<br />
              법률 검토: 대한변호사협회 등록 30년 이상 전문변호인단 감수 완료 | CPO 개인정보보호책임자: <a href="mailto:privacy@baeung.kr" className="underline underline-offset-4 hover:text-[#19382C]">privacy@baeung.kr</a> | Themis-AI PARA 거버넌스
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

      {/* 어르신 무타자 음성 대화형 어시스턴트 모달 */}
      {isVoiceAssistantOpen && (
        <Suspense fallback={null}>
          <SeniorVoiceAssistantModal
            onClose={() => setIsVoiceAssistantOpen(false)}
            onNavigateToEmergency={() => {
              setIsVoiceAssistantOpen(false);
              setIsEmergencyMode(true);
            }}
            onSelectHall={(hallName) => {
              setIsVoiceAssistantOpen(false);
              setCurrentTab('funeral-halls');
            }}
            onOpenPackagePricing={() => {
              setIsVoiceAssistantOpen(false);
              setCurrentTab('packages');
            }}
            onOpenQuoteDiagnostics={() => {
              setIsVoiceAssistantOpen(false);
              setCurrentTab('quote');
            }}
          />
        </Suspense>
      )}

      {/* B2B 장례식장 파트너 비즈니스 포털 모달 */}
      {isPartnerPortalOpen && (
        <Suspense fallback={null}>
          <PartnerPortalModal
            onClose={() => setIsPartnerPortalOpen(false)}
          />
        </Suspense>
      )}

      {/* 5090 시니어 무타자 음성 어시스턴트 플로팅 버튼 */}
      {!isEmergencyMode && (
        <div className="fixed right-4 md:right-8 z-40 fab-above-bar">
          <button
            type="button"
            onClick={() => setIsVoiceAssistantOpen(true)}
            className="px-4 py-3 bg-[#19382C] hover:bg-[#2D4F43] text-white rounded-full font-serif font-bold text-[0.875rem] flex items-center space-x-2 shadow-2xl border-2 border-[#C2A26A] transition-transform hover:scale-105 cursor-pointer ring-4 ring-[#19382C]/20"
            aria-label="어르신 무타자 음성 안내 열기"
          >
            <div className="w-6 h-6 rounded-full bg-[#0D0E10] flex items-center justify-center text-[#C2A26A]">
              <Mic className="w-3.5 h-3.5" />
            </div>
            <span>무타자 말로 찾기</span>
          </button>
        </div>
      )}

      {/* 5090 시니어 안심 모바일 플로팅 핫라인 바 (화면 하단 상시 고정) */}
      {!isEmergencyMode && (
        <aside data-bottom-bar className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#141618]/95 backdrop-blur-md border-t border-[#3D382E] p-3 px-4 flex items-center justify-between shadow-2xl text-[#FAF9F6]">
          <div className="flex flex-col">
            <span className="text-[0.8125rem] font-serif text-[#8A929D]">
              24시 장례지도사 직통 상황실
            </span>
            <span className="text-sm font-reverence font-bold text-[#FAF9F6] tracking-tight">
              1588-0000 (전국 무료)
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <a
              href="tel:1588-0000"
              className="k-tap k-tap-lg px-4 py-2 bg-[#19382C] border border-[#2D4F43] text-[#FAF9F6] font-serif font-bold text-[0.8125rem] rounded-md flex items-center space-x-1.5 cursor-pointer hover:bg-[#2D4F43]"
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

export const App: React.FC = () => {
  // ★ 링크(#b=…)로 들어온 경우 — 수신자에게는 부고장 한 장만 보여 준다.
  //   앱 크롬(헤더·탭·하단 안내바·음성 버튼)을 같이 얹으면 「부고장」 이 아니라
  //   「알림 없는 앱」 이 된다. 조문객은 그것만 원하지 않는다.
  //
  //   여기서 early return 해도 안전한 이유: 이 컴포넌트의 훅 목록은 고정이다.
  //   조건이 바뀌는 것은 MainApp 의 마운트 여부뿐이라 React #300 이 나지 않는다.
  const [shared, setShared] = useState<{ data: SharedObituary | null; broken: boolean } | null>(null);

  useEffect(() => {
    const read = () => {
      const h = window.location.hash;
      if (!h || !h.startsWith(`#${SHARE_HASH_KEY}=`)) {
        setShared(null);
        return;
      }
      const data = decodeShareLink(h);
      setShared({ data, broken: !data });
    };
    read();
    window.addEventListener('hashchange', read);
    return () => window.removeEventListener('hashchange', read);
  }, []);

  if (shared) return <SharedObituaryView data={shared.data!} broken={shared.broken} />;
  return <MainApp />;
};

export default App;
