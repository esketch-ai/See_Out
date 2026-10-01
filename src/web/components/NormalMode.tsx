import React, { Suspense, useEffect, useState } from 'react';
import { ArrowRight, ShieldCheck, FileText, Building2, PackageCheck, BookOpen, Sparkles, PhoneCall, CheckCircle2, HeartHandshake, Scale } from 'lucide-react';
import { MainTab } from './Header.js';
import { QuoteDiagnosticsWidget } from './QuoteDiagnosticsWidget.js';
import { FuneralHallSearchWidget } from './FuneralHallSearchWidget.js';
import { LifeArchiveWidget } from './LifeArchiveWidget.js';
import { PackagePricingWidget } from './PackagePricingWidget.js';
import { TraditionalSeal } from '../design-system/index.js';
import { lazyModal, warmAll } from '../design-system/LazyModal.js';
import { CareVertical } from '../../professional-care/index.js';
import { SAMPLE_DUAL_STANDBY, DualStandbyService } from '../../quote-diagnostics/dualStandbyService.js';
import { BENCHMARK_CERT_B_PREMIUM450 } from '../../quote-diagnostics/benchmarkData.js';
import { StatutoryRefundCalculator } from '../../quote-diagnostics/refundCalculator.js';
import { KmacaWarmHome } from './KmacaWarmHome.js';

import { DEFAULT_FUNERAL_SETTING, FuneralSetting } from '../../life-archive/index.js';
import { VirtualCallService } from '../../tracking/index.js';

// ── 팝업 4종은 코드 분할한다 ─────────────────────────────────────────
// 첫 화면(종합 의전)에 필요 없는 보조 화면이라 유족이 누른 뒤에 처음 필요하다.
// 정적 import 로 두면 749KB 를 전부 첫 화면에 싣게 된다.
const dualStandby = lazyModal(() => import('./DualStandbyModal.js'));
const claimModal = lazyModal(() => import('./CancellationClaimModal.js'));
const voucherModal = lazyModal(() => import('./LossCreditVoucherModal.js'));
const careModal = lazyModal(() => import('./ProfessionalCareModal.js'));
const DualStandbyModal = dualStandby.Comp;
const CancellationClaimModal = claimModal.Comp;
const LossCreditVoucherModal = voucherModal.Comp;
const ProfessionalCareModal = careModal.Comp;

const PRELOAD_MODALS = [
  dualStandby.preload,
  claimModal.preload,
  voucherModal.preload,
  careModal.preload,
];

interface NormalModeProps {
  currentTab: MainTab;
  onSelectTab: (tab: MainTab) => void;
  onEnterEmergency: () => void;
}

export const NormalMode: React.FC<NormalModeProps> = ({
  currentTab,
  onSelectTab,
  onEnterEmergency
}) => {
  // 이 탭의 모달 조각을 미리 받는다 — 클릭 지연을 없애기 위함
  useEffect(() => {
    warmAll(PRELOAD_MODALS);
  }, []);

  // 3대 모듈(전국 장례식장, 정찰 패키지, 생애기록관) 간 실시간 동기화 상태
  const [funeralSetting, setFuneralSetting] = useState<FuneralSetting>(DEFAULT_FUNERAL_SETTING);

  // 듀얼 스탠바이 & 소비자 권익 보호 모달 상태
  const [isDualStandbyModalOpen, setIsDualStandbyModalOpen] = useState(false);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);

  // 생전·유족 심리상담 & 상속 전문 변호사 부가 서비스 모달 상태
  const [isCareModalOpen, setIsCareModalOpen] = useState(false);
  const [careModalVertical, setCareModalVertical] = useState<CareVertical>('PSYCHOLOGY_CARE');

  // KmacaWarmHome 아래에 보존되는 기존 의전 도록의 펼침 상태.
  // ★ 탭 분기 위에 둬야 한다. 탭 분기 안에서 훅을 부르면 탭을 바꿀 때 훅 개수가
  //   달라져 React #310 으로 죽는다. 실제로 그런 일이 있었다.
  // ★ 기본값 true — 접어 두면 감사 도구가 이 영역을 통째로 못 본다.
  const [isLegacyCeremonyOpen, setIsLegacyCeremonyOpen] = useState(true);
  const [activeCeremonyTab, setActiveCeremonyTab] = useState<'3DAY' | 'NO_ALTAR'>('3DAY');

  // 특정 탭 선택 시 해당 컴포넌트 전용 상세 뷰 렌더링
  if (currentTab === 'quote') {
  return (
      <div className="space-y-6 pb-20">
        <QuoteDiagnosticsWidget />
      </div>
    );
  }

  if (currentTab === 'funeral-halls') {
    return (
      <div className="space-y-6 pb-20">
        <FuneralHallSearchWidget
          selectedFuneralHallId={funeralSetting.funeralHallId}
          onSelectHallForFuneral={(hall) => {
            const virtPhone = VirtualCallService.getVirtualNumberForHall(hall.id);
            const crematoriumText = hall.nearestCrematorium
              ? `${hall.nearestCrematorium}${hall.crematoriumDistanceKm ? ` (차량 ${hall.crematoriumDistanceKm}km)` : ''}`
              : '서울시립승화원 (벽제 화장장)';
            setFuneralSetting((prev: FuneralSetting) => ({
              ...prev,
              funeralHallId: hall.id,
              funeralHallName: hall.name,
              address: hall.address,
              phone: hall.phone,
              virtualPhone: virtPhone,
              nearestSubway: hall.nearestSubway || '대중교통 접근 용이',
              discountRate: Math.round(hall.discountRate * 100),
              crematoriumName: crematoriumText,
              roomName: hall.roomTypes?.[0]?.name || '특실 1호실',
              navigationLink: `https://map.kakao.com/link/search/${encodeURIComponent(hall.name)}`
            }));
          }}
          onNavigateToLifeArchive={() => onSelectTab('life-archive')}
        />
      </div>
    );
  }

  if (currentTab === 'packages') {
    return (
      <div className="space-y-6 pb-20">
        <PackagePricingWidget
          onSelectPackageForFuneral={(pkg) => {
            setFuneralSetting((prev: FuneralSetting) => ({
              ...prev,
              packageType: pkg.type,
              packageName: pkg.name,
              packagePrice: pkg.price
            }));
          }}
          onNavigateToLifeArchive={() => onSelectTab('life-archive')}
        />
      </div>
    );
  }

  if (currentTab === 'life-archive') {
    return (
      <div className="space-y-6 pb-20">
        <LifeArchiveWidget
          funeralSetting={funeralSetting}
          onUpdateFuneralSetting={setFuneralSetting}
          onNavigateTab={(tab) => onSelectTab(tab as MainTab)}
        />
      </div>
    );
  }

  // 'home' (종합 의전 안내) 탭인 경우: 풍부한 시각 사진과 함께 전체 조망
  return (
    <div className="space-y-12 pb-24">
      {/* ── 시안 A: 밝고 따뜻한 KMACA형 홈 (docs/ORCA_TASK.md) ── */}
      <KmacaWarmHome
        onOpenQuoteDiagnostics={() => onSelectTab('quote')}
        onOpenFuneralHallSearch={() => onSelectTab('funeral-halls')}
        onOpenFixedPackages={() => onSelectTab('packages')}
        onOpenDualStandby={() => setIsDualStandbyModalOpen(true)}
        onOpenVoucher={() => setIsVoucherModalOpen(true)}
        onOpenCare={(vertical) => {
          setCareModalVertical(vertical);
          setIsCareModalOpen(true);
        }}
        onEnterEmergency={onEnterEmergency}
      />

      {/* ─── 4번 개선: 전통 3일장 & 무빈소 2일장 맞춤형 스텝 바 & 다이어트 상세 도록 ─── */}
      <div className="bg-[#FFFFFF] border border-[#DCD6C9] rounded-2xl p-4 sm:p-5 shadow-xs space-y-3 font-serif">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DCD6C9] pb-3">
          <div className="flex items-center space-x-2">
            <span className="text-[0.8125rem] font-bold px-2 py-0.5 rounded bg-[#19382C]/10 text-[#19382C] border border-[#19382C]/20">
              맞춤 일정 안내
            </span>
            <span className="text-sm font-bold text-[#151719]">
              가족 상황에 맞는 장례 방식을 선택하세요
            </span>
          </div>
          <span className="text-[0.8125rem] text-[#5A5E66]">
            선택하신 방식의 상세 일정과 필수 준비사항이 아래에 펼쳐집니다
          </span>
        </div>

        {/* 1줄 미니 스텝 바 (전통 3일장 vs 무빈소 2일장 2-탭 전환) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* 전통 3일장 1줄 미니 스텝 */}
          <button
            type="button"
            aria-expanded={isLegacyCeremonyOpen && activeCeremonyTab === '3DAY'}
            aria-controls="legacy-ceremony-detail"
            onClick={() => {
              if (activeCeremonyTab === '3DAY' && isLegacyCeremonyOpen) {
                setIsLegacyCeremonyOpen(false);
              } else {
                setActiveCeremonyTab('3DAY');
                setIsLegacyCeremonyOpen(true);
              }
            }}
            className={`p-3.5 rounded-xl text-left transition-all group cursor-pointer flex items-center justify-between gap-2 border ${
              activeCeremonyTab === '3DAY' && isLegacyCeremonyOpen
                ? 'border-2 border-[#19382C] bg-[#FFFFFF] shadow-sm ring-1 ring-[#19382C]/20'
                : 'border-[#DCD6C9] bg-[#FAF9F6] hover:bg-[#F1EDE3]'
            }`}
          >
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5 mb-1">
                <span className={`text-[0.8125rem] font-bold px-2 py-0.5 rounded ${
                  activeCeremonyTab === '3DAY' && isLegacyCeremonyOpen
                    ? 'bg-[#19382C] text-[#FAF9F6]'
                    : 'bg-[#DCE8E2] text-[#19382C]'
                }`}>
                  전통 3일장
                </span>
                <span className="text-sm font-bold text-[#151719]">빈소 조문형</span>
                {activeCeremonyTab === '3DAY' && isLegacyCeremonyOpen && (
                  <span className="text-[0.8125rem] text-[#19382C] font-bold">● 선택됨</span>
                )}
              </div>
              <div className="text-[0.8125rem] text-[#42464E] flex items-center gap-1.5 flex-wrap">
                <span>1일차 초종·안식</span>
                <span className="text-[#19382C] font-bold">➔</span>
                <span>2일차 염습·입관</span>
                <span className="text-[#19382C] font-bold">➔</span>
                <span>3일차 발인·승화</span>
              </div>
            </div>
            <span className="text-[0.8125rem] font-bold text-[#19382C] shrink-0 group-hover:translate-x-0.5 transition-transform">
              {activeCeremonyTab === '3DAY' && isLegacyCeremonyOpen ? '접기 ▲' : '상세보기 ▼'}
            </span>
          </button>

          {/* 무빈소 2일장 1줄 미니 스텝 */}
          <button
            type="button"
            aria-expanded={isLegacyCeremonyOpen && activeCeremonyTab === 'NO_ALTAR'}
            aria-controls="legacy-ceremony-detail"
            onClick={() => {
              if (activeCeremonyTab === 'NO_ALTAR' && isLegacyCeremonyOpen) {
                setIsLegacyCeremonyOpen(false);
              } else {
                setActiveCeremonyTab('NO_ALTAR');
                setIsLegacyCeremonyOpen(true);
              }
            }}
            className={`p-3.5 rounded-xl text-left transition-all group cursor-pointer flex items-center justify-between gap-2 border ${
              activeCeremonyTab === 'NO_ALTAR' && isLegacyCeremonyOpen
                ? 'border-2 border-[#19382C] bg-[#FFFFFF] shadow-sm ring-1 ring-[#19382C]/20'
                : 'border-[#DCD6C9] bg-[#FAF9F6] hover:bg-[#F1EDE3]'
            }`}
          >
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5 mb-1">
                <span className={`text-[0.8125rem] font-bold px-2 py-0.5 rounded ${
                  activeCeremonyTab === 'NO_ALTAR' && isLegacyCeremonyOpen
                    ? 'bg-[#19382C] text-[#FAF9F6]'
                    : 'bg-[#F1E9DB] text-[#6E5429]'
                }`}>
                  무빈소 2일장
                </span>
                <span className="text-sm font-bold text-[#151719]">가족 직례형</span>
                {activeCeremonyTab === 'NO_ALTAR' && isLegacyCeremonyOpen && (
                  <span className="text-[#19382C] font-bold text-[0.8125rem]">● 선택됨</span>
                )}
              </div>
              <div className="text-[0.8125rem] text-[#42464E] flex items-center gap-1.5 flex-wrap">
                <span>1일차 안식·추모입관</span>
                <span className="text-[#6E5429] font-bold">➔</span>
                <span>2일차 발인·화장승화</span>
              </div>
            </div>
            <span className="text-[0.8125rem] font-bold text-[#6E5429] shrink-0 group-hover:translate-x-0.5 transition-transform">
              {activeCeremonyTab === 'NO_ALTAR' && isLegacyCeremonyOpen ? '접기 ▲' : '상세보기 ▼'}
            </span>
          </button>
        </div>

        {/* 통합 접기/펼치기 토글 바 */}
        <button
          type="button"
          aria-expanded={isLegacyCeremonyOpen}
          aria-controls="legacy-ceremony-detail"
          onClick={() => setIsLegacyCeremonyOpen((v) => !v)}
          className="w-full py-2.5 px-4 bg-[#FFFFFF] hover:bg-[#FAF9F6] border border-[#DCD6C9] text-[#19382C] text-sm font-bold rounded-lg flex items-center justify-center space-x-2 transition-colors cursor-pointer"
        >
          <span>
            {isLegacyCeremonyOpen
              ? `${activeCeremonyTab === '3DAY' ? '전통 3일장' : '무빈소 2일장'} 상세 일정 접기 ▲`
              : `${activeCeremonyTab === '3DAY' ? '전통 3일장' : '무빈소 2일장'} 상세 일정 및 주요 서비스 보기 ▼`}
          </span>
        </button>
      </div>

      <div id="legacy-ceremony-detail" hidden={!isLegacyCeremonyOpen} className="space-y-8 font-serif">
        {/* ── 1. 선택된 장례 방식 맞춤 상세 일정 패널 (전통 3일장 vs 무빈소 2일장) ── */}
        {activeCeremonyTab === '3DAY' ? (
          <div className="bg-[#FFFFFF] border border-[#DCD6C9] rounded-2xl p-6 md:p-8 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DCD6C9] pb-4">
              <div>
                <div className="inline-flex items-center space-x-2 text-[#6E5429] text-[0.8125rem] font-bold mb-1">
                  <span>전통 3일장 표준 예법과 72시간 정례 일정</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-reverence font-black text-[#151719] tracking-tight">
                  고인을 모시는 3일간의 숭고한 여정 (빈소 조문형)
                </h3>
                <p className="text-[1.125rem] sm:text-[1.125rem] text-[#5A5E66] mt-1 leading-relaxed">
                  임종 즉시 고인 이송부터 조문객 맞이, 궁중 습염, 발인, 영구 안치까지 국가공인 1급 장례지도사가 곁을 지킵니다.
                </p>
              </div>
              <span className="text-[0.8125rem] text-[#19382C] font-bold px-2.5 py-1 rounded bg-[#DCE8E2] shrink-0 self-start sm:self-auto">
                보건복지부 국가장사표준 준수
              </span>
            </div>

            {/* 3폭 병풍 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 1일차 */}
              <div className="k-screen-panel k-corner-bracket p-6 flex flex-col justify-between space-y-4 relative">
                <div className="pointer-events-none absolute inset-0 k-pattern-gyeokja opacity-25" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="text-[0.8125rem] font-serif font-bold text-[#19382C] bg-[#DCE8E2] px-2.5 py-0.5 rounded border border-[#DCE8E2]">
                      첫째 날
                    </span>
                    <span className="text-[0.8125rem] font-mono text-[#5A5E66]">Day 1</span>
                  </div>
                  <h4 className="font-reverence font-bold text-lg md:text-xl text-[#151719] mt-2">
                    첫째 날: 임종과 편안한 안식
                  </h4>
                  <p className="text-[1.125rem] text-[#5A5E66] mt-1 font-serif">
                    임종 즉시 고인을 정중히 운구하고 유족의 쉼터를 마련합니다.
                  </p>
                  <ul className="mt-4 space-y-2 text-[0.8125rem] md:text-sm text-[#42464E] font-serif">
                    <li className="flex items-start space-x-2">
                      <span className="text-[#19382C] font-bold">•</span>
                      <span>고인 전용 앰뷸런스 전국 즉시 출동 및 이송</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-[#19382C] font-bold">•</span>
                      <span>원하시는 장례식장 안치실 안치 및 빈소 제단 설치</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-[#19382C] font-bold">•</span>
                      <span>모바일 정중 부고장 무료 제작 및 친지 발송</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-[#19382C] font-bold">•</span>
                      <span>화장시설(승화원) 예약 원스톱 대행 지원</span>
                    </li>
                  </ul>
                </div>
                <div className="pt-3 border-t border-[#DCD6C9] text-[0.8125rem] text-[#19382C] font-serif font-bold relative z-10">
                  ✓ 전문 장례지도사 2시간 이내 현장 배치
                </div>
              </div>

              {/* 2일차 */}
              <div className="k-screen-panel k-corner-bracket p-6 flex flex-col justify-between space-y-4 border-2 border-[#9E7D47]/40 bg-[#FAF9F6] relative">
                <div className="pointer-events-none absolute inset-0 k-pattern-gyeokja opacity-35" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="text-[0.8125rem] font-serif font-bold text-[#6E5429] bg-[#F1E9DB] px-2.5 py-0.5 rounded border border-[#F1E9DB]">
                      둘째 날 · 핵심 의례
                    </span>
                    <span className="text-[0.8125rem] font-mono text-[#5A5E66]">Day 2</span>
                  </div>
                  <h4 className="font-reverence font-bold text-lg md:text-xl text-[#151719] mt-2">
                    둘째 날: 정갈한 입관과 염습
                  </h4>
                  <p className="text-[1.125rem] text-[#5A5E66] mt-1 font-serif">
                    고인에게 마지막 새 옷을 입혀드리고 온 가족이 작별합니다.
                  </p>
                  <ul className="mt-4 space-y-2 text-[0.8125rem] md:text-sm text-[#42464E] font-serif">
                    <li className="flex items-start space-x-2">
                      <span className="text-[#6E5429] font-bold">•</span>
                      <span>국가공인 1급 지도사 2인 전통 궁중 습염 집전</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-[#6E5429] font-bold">•</span>
                      <span>최고급 명품 수의 정갈한 착의 및 한지 장정</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-[#6E5429] font-bold">•</span>
                      <span>생화 꽃구름 침상 입관식 및 향낭 봉안</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-[#6E5429] font-bold">•</span>
                      <span>종교별 추모식(기독교·천주교·불교·유교 제례)</span>
                    </li>
                  </ul>
                </div>
                <div className="pt-3 border-t border-[#DCD6C9] text-[0.8125rem] text-[#6E5429] font-serif font-bold relative z-10">
                  ✓ 꽃장식/수의 강매 및 촌지 요구 100% 금지
                </div>
              </div>

              {/* 3일차 */}
              <div className="k-screen-panel k-corner-bracket p-6 flex flex-col justify-between space-y-4 relative">
                <div className="pointer-events-none absolute inset-0 k-pattern-gyeokja opacity-25" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="text-[0.8125rem] font-serif font-bold text-[#19382C] bg-[#DCE8E2] px-2.5 py-0.5 rounded border border-[#DCE8E2]">
                      셋째 날
                    </span>
                    <span className="text-[0.8125rem] font-mono text-[#5A5E66]">Day 3</span>
                  </div>
                  <h4 className="font-reverence font-bold text-lg md:text-xl text-[#151719] mt-2">
                    셋째 날: 정중한 발인과 영면
                  </h4>
                  <p className="text-[1.125rem] text-[#5A5E66] mt-1 font-serif">
                    고인을 편안한 영구 안식처로 모시는 마지막 배웅입니다.
                  </p>
                  <ul className="mt-4 space-y-2 text-[0.8125rem] md:text-sm text-[#42464E] font-serif">
                    <li className="flex items-start space-x-2">
                      <span className="text-[#19382C] font-bold">•</span>
                      <span>정중한 발인제 및 추모 영결식 거행</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-[#19382C] font-bold">•</span>
                      <span>고인전용 최신형 리무진 및 가족 버스 운구</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-[#19382C] font-bold">•</span>
                      <span>승화원 화장 접수 및 수골(유골함 봉안) 의식</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-[#19382C] font-bold">•</span>
                      <span>봉안당, 수목장, 잔디장 안치 전 과정 동행</span>
                    </li>
                  </ul>
                </div>
                <div className="pt-3 border-t border-[#DCD6C9] text-[0.8125rem] text-[#19382C] font-serif font-bold relative z-10">
                  ✓ 추가 장거리 운임 바가지 일절 없음
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="bg-[#FFFFFF] border border-[#DCD6C9] rounded-2xl p-6 md:p-8 space-y-6 shadow-xs font-serif">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DCD6C9] pb-4">
              <div>
                <div className="inline-flex items-center space-x-2 text-[#6E5429] text-[0.8125rem] font-bold mb-1">
                  <span>무빈소 · 2일 가족장 48시간 직례 일정</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-reverence font-black text-[#151719] tracking-tight">
                  무빈소(2일장): 직계가족 중심의 조용하고 경건한 배웅 (가족 직례형)
                </h3>
                <p className="text-[1.125rem] sm:text-[1.125rem] text-[#5A5E66] mt-1 leading-relaxed">
                  빈소를 차리지 않고 안치실 안식 후 입관 및 화장·봉안으로 이어지는 120만 원 정찰의 합리적이고 경건한 가족장입니다.
                </p>
              </div>
              <span className="text-[0.8125rem] text-[#6E5429] font-bold px-2.5 py-1 rounded bg-[#F1E9DB] shrink-0 self-start sm:self-auto">
                120만 원 100% 정찰 보증
              </span>
            </div>

            {/* 무빈소 2폭 병풍 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 1일차 */}
              <div className="k-screen-panel k-corner-bracket p-6 flex flex-col justify-between space-y-4 relative">
                <div className="pointer-events-none absolute inset-0 k-pattern-gyeokja opacity-25" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="text-[0.8125rem] font-serif font-bold text-[#19382C] bg-[#DCE8E2] px-2.5 py-0.5 rounded border border-[#DCE8E2]">
                      첫째 날 · 안식과 입관
                    </span>
                    <span className="text-[0.8125rem] font-mono text-[#5A5E66]">Day 1</span>
                  </div>
                  <h4 className="font-reverence font-bold text-lg md:text-xl text-[#151719] mt-2">
                    첫째 날: 안식과 가족 전용 추모 입관
                  </h4>
                  <p className="text-[1.125rem] text-[#5A5E66] mt-1 font-serif">
                    고인을 정중히 운구하여 안치실에 모신 후, 직계가족만 참여하는 경건한 생화 꽃구름 입관식을 거행합니다.
                  </p>
                  <ul className="mt-4 space-y-2 text-[0.8125rem] md:text-sm text-[#42464E] font-serif">
                    <li className="flex items-start space-x-2">
                      <span className="text-[#19382C] font-bold">•</span>
                      <span>고인 전용 앰뷸런스 전국 즉시 출동 및 장례식장 안치실 안식</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-[#19382C] font-bold">•</span>
                      <span>국가공인 1급 지도사 2인 전통 궁중 습염 및 정갈한 명품 수의 착의</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-[#19382C] font-bold">•</span>
                      <span>생화 꽃구름 침상 입관식 및 직계가족 단독 추모 예식 집전</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-[#19382C] font-bold">•</span>
                      <span>화장시설(승화원) 예약 원스톱 대행 및 가족 전용 휴게 공간 배정</span>
                    </li>
                  </ul>
                </div>
                <div className="pt-3 border-t border-[#DCD6C9] text-[0.8125rem] text-[#19382C] font-serif font-bold relative z-10">
                  ✓ 불필요한 빈소 임대료 및 제단꽃 강매 0원
                </div>
              </div>

              {/* 2일차 */}
              <div className="k-screen-panel k-corner-bracket p-6 flex flex-col justify-between space-y-4 border-2 border-[#9E7D47]/40 bg-[#FAF9F6] relative">
                <div className="pointer-events-none absolute inset-0 k-pattern-gyeokja opacity-35" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="text-[0.8125rem] font-serif font-bold text-[#6E5429] bg-[#F1E9DB] px-2.5 py-0.5 rounded border border-[#F1E9DB]">
                      둘째 날 · 발인과 승화
                    </span>
                    <span className="text-[0.8125rem] font-mono text-[#5A5E66]">Day 2</span>
                  </div>
                  <h4 className="font-reverence font-bold text-lg md:text-xl text-[#151719] mt-2">
                    둘째 날: 정중한 발인과 승화원 봉안
                  </h4>
                  <p className="text-[1.125rem] text-[#5A5E66] mt-1 font-serif">
                    고인의 마지막 가시는 길을 리무진으로 모시고 승화원에서 화장 및 안치를 마칩니다.
                  </p>
                  <ul className="mt-4 space-y-2 text-[0.8125rem] md:text-sm text-[#42464E] font-serif">
                    <li className="flex items-start space-x-2">
                      <span className="text-[#6E5429] font-bold">•</span>
                      <span>정중한 발인 영결 의식 및 고인 전용 최신형 리무진 운구</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-[#6E5429] font-bold">•</span>
                      <span>승화원(화장장) 동행 및 화장 접수·수골(유골함 봉안) 의식 전담 지원</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-[#6E5429] font-bold">•</span>
                      <span>최고급 유골함 봉안 및 봉안당/수목장/자연장 안치 동행</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-[#6E5429] font-bold">•</span>
                      <span>의전 종료 후 1원 단위까지 투명한 실비 영수증 정산</span>
                    </li>
                  </ul>
                </div>
                <div className="pt-3 border-t border-[#DCD6C9] text-[0.8125rem] text-[#6E5429] font-serif font-bold relative z-10">
                  ✓ 숨은 추가금 없는 100% 후불 정산 보증
                </div>
              </div>
            </div>

          </div>
        )}

      {/* 3. 4대 핵심 의전 정례 서비스 — 3일장 / 무빈소 연동형 슬림 카드 */}
      <div className="space-y-4 font-serif">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DCD6C9] pb-3">
          <div>
            <div className="inline-flex items-center space-x-2 text-[#6E5429] text-[0.8125rem] font-bold mb-0.5">
              <span>{activeCeremonyTab === '3DAY' ? '전통 3일장(빈소형) 연계' : '무빈소 2일장(직례형) 연계'}</span>
              <span>•</span>
              <span>4대 핵심 정례 서비스</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-reverence font-bold text-[#151719] tracking-tight">
              {activeCeremonyTab === '3DAY' ? '전통 3일장 맞춤 핵심 서비스' : '무빈소 2일장 맞춤 핵심 서비스'}
            </h3>
          </div>
          <span className="text-[0.8125rem] text-[#5A5E66] hidden sm:block">
            카드를 누르시면 상세 안내 화면으로 이동합니다
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* 1. 상조 증서 안심 진단 카드 */}
          <button
            type="button"
            onClick={() => onSelectTab('quote')}
            className="k-card-heritage k-changho-texture group cursor-pointer overflow-hidden p-5 sm:p-6 flex flex-col justify-between w-full text-left rounded-xl border border-[#DCD6C9] bg-[#FFFFFF] hover:border-[#19382C] hover:shadow-xs transition-all"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[0.8125rem] font-bold text-[#6E5429] bg-[#F1E9DB] px-2.5 py-0.5 rounded border border-[#F1E9DB]">
                  01 · {activeCeremonyTab === '3DAY' ? '3일장 실비 대조' : '무빈소 환급 대조'}
                </span>
                <span className="text-[0.8125rem] font-mono text-[#5A5E66]">공정위 법정산식 준수</span>
              </div>
              <h4 className="text-lg sm:text-xl font-reverence font-bold text-[#151719] mt-2.5 group-hover:text-[#19382C] transition-colors">
                기존 상조 증서 정밀 안심 진단
              </h4>
              <p className="text-[1.125rem] text-[#42464E] mt-1.5 leading-relaxed">
                {activeCeremonyTab === '3DAY'
                  ? '보유 중이신 상조 상품의 해약환급금과 배웅 3일장 실비를 1:1 대조하여 숨은 추가금 없는 최적 견적을 산출합니다.'
                  : '고가 상조 상품 해약 후 무빈소 120만 원 직례 진행 시 돌려받는 실 환급금을 1:1 맞춤 영수증으로 정밀 연산해 드립니다.'}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#DCD6C9] flex items-center justify-between text-[#19382C] font-bold text-[0.8125rem]">
              <span>{activeCeremonyTab === '3DAY' ? '3일장 영수증 대조표 확인하기' : '무빈소 환급 대조표 확인하기'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* 2. 전국 장례식장 시설 및 감면 카드 */}
          <button
            type="button"
            onClick={() => onSelectTab('funeral-halls')}
            className="k-card-heritage k-changho-texture group cursor-pointer overflow-hidden p-5 sm:p-6 flex flex-col justify-between w-full text-left rounded-xl border border-[#DCD6C9] bg-[#FFFFFF] hover:border-[#19382C] hover:shadow-xs transition-all"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[0.8125rem] font-bold text-[#19382C] bg-[#DCE8E2] px-2.5 py-0.5 rounded border border-[#DCE8E2]">
                  02 · {activeCeremonyTab === '3DAY' ? '빈소 임대료 최대 30% 감면' : '빈소 비용 0원 · 전용 안치실'}
                </span>
                <span className="text-[0.8125rem] font-mono text-[#5A5E66]">전국 1,080곳 데이터</span>
              </div>
              <h4 className="text-lg sm:text-xl font-reverence font-bold text-[#151719] mt-2.5 group-hover:text-[#19382C] transition-colors">
                전국 장례식장 시설 · 감면 검색
              </h4>
              <p className="text-[1.125rem] text-[#42464E] mt-1.5 leading-relaxed">
                {activeCeremonyTab === '3DAY'
                  ? '거주지 인근 장례식장의 분향실·접객실 규모를 파악하고, 배웅 사전 등록을 통한 빈소 임대료 감면 혜택을 확인하세요.'
                  : '빈소를 차리지 않고 고인을 정갈하게 모실 수 있는 인근 안치실 규모와 승화원(화장장) 원스톱 예약 절차를 안내합니다.'}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#DCD6C9] flex items-center justify-between text-[#19382C] font-bold text-[0.8125rem]">
              <span>{activeCeremonyTab === '3DAY' ? '장례식장 빈소 감면 검색하기' : '안치실 시설 및 화장장 검색하기'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* 3. 정찰제 의전 패키지 카드 */}
          <button
            type="button"
            onClick={() => onSelectTab('packages')}
            className="k-card-heritage k-changho-texture group cursor-pointer overflow-hidden p-5 sm:p-6 flex flex-col justify-between w-full text-left rounded-xl border border-[#DCD6C9] bg-[#FFFFFF] hover:border-[#19382C] hover:shadow-xs transition-all"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[0.8125rem] font-bold text-[#6E5429] bg-[#F1E9DB] px-2.5 py-0.5 rounded border border-[#F1E9DB]">
                  03 · {activeCeremonyTab === '3DAY' ? '실속 250만 · 품격 350만' : '무빈소 120만 원 100% 정찰'}
                </span>
                <span className="text-[0.8125rem] font-mono text-[#5A5E66]">부당 추가금 0원 보증</span>
              </div>
              <h4 className="text-lg sm:text-xl font-reverence font-bold text-[#151719] mt-2.5 group-hover:text-[#19382C] transition-colors">
                정직한 예우 정찰제 의전 패키지
              </h4>
              <p className="text-[1.125rem] text-[#42464E] mt-1.5 leading-relaxed">
                {activeCeremonyTab === '3DAY'
                  ? '전통 3일장에 필수적인 최고급 수의·오동나무관·고인 리무진·접객 도우미 품목 단가를 100% 투명 공개하며 촌지를 금지합니다.'
                  : '빈소 없이 직계가족만으로 조용하고 품격 있게 모시는 120만 원 단일 정찰 직례 패키지의 모든 포함 품목을 확인하세요.'}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#DCD6C9] flex items-center justify-between text-[#19382C] font-bold text-[0.8125rem]">
              <span>{activeCeremonyTab === '3DAY' ? '3일장 정찰 패키지 명세 보기' : '무빈소 120만 정찰 명세 보기'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* 4. 생애기록관 카드 */}
          <button
            type="button"
            onClick={() => onSelectTab('life-archive')}
            className="k-card-heritage k-changho-texture group cursor-pointer overflow-hidden p-5 sm:p-6 flex flex-col justify-between w-full text-left rounded-xl border border-[#DCD6C9] bg-[#FFFFFF] hover:border-[#19382C] hover:shadow-xs transition-all"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[0.8125rem] font-bold text-[#19382C] bg-[#DCE8E2] px-2.5 py-0.5 rounded border border-[#DCE8E2]">
                  04 · {activeCeremonyTab === '3DAY' ? '모바일 부고 · 빈소 디지털 헌정' : '가족 부고 · 생애 평전 스토리북'}
                </span>
                <span className="text-[0.8125rem] font-mono text-[#5A5E66]">사전 기억 보존</span>
              </div>
              <h4 className="text-lg sm:text-xl font-reverence font-bold text-[#151719] mt-2.5 group-hover:text-[#19382C] transition-colors">
                생애기록관 (소중한 삶의 일상 봉안)
              </h4>
              <p className="text-[1.125rem] text-[#42464E] mt-1.5 leading-relaxed">
                {activeCeremonyTab === '3DAY'
                  ? '친지와 조문객을 위한 원터치 정중 부고장 무료 발송과 장례식장 빈소 키오스크 디지털 헌정 화면을 연동 지원합니다.'
                  : '직계가족 중심의 조용한 부고 알림과 고인의 삶을 따뜻하게 엮은 생애 평전 스토리북으로 마지막 기억을 보존합니다.'}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#DCD6C9] flex items-center justify-between text-[#19382C] font-bold text-[0.8125rem]">
              <span>{activeCeremonyTab === '3DAY' ? '부고장 및 생애기록관 보기' : '가족 부고 및 생애기록관 보기'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </div>

      {/* 4. [배웅 안심 연계 케어] 이중안심 사전등록 · 전문 심리상담 · 상속 전문 변호사 */}
      <div className="bg-[#FAF9F6] border border-[#DCD6C9] rounded-2xl p-6 sm:p-7 space-y-5 shadow-xs relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 k-pattern-gyeokja opacity-20" />
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DCD6C9] pb-3">
          <div>
            <div className="inline-flex items-center space-x-2 text-[#6E5429] text-[0.8125rem] font-serif font-bold mb-0.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C2A26A]" />
              <span>배웅 안심 연계 케어 · 사전 비용 0원 & 알선 수수료 0원</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-reverence font-bold text-[#151719] tracking-tight">
              가족의 마음과 권익을 지키는 3대 안심 특화 서비스
            </h3>
          </div>
          <span className="text-[0.8125rem] text-[#5A5E66] font-serif">
            변호사법 제34조 준수 및 보건복지부 공인 연계
          </span>
        </div>

        {/* 3대 안심 서비스 3열 콤팩트 카드 그리드 */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* 카드 1: 이중안심 사전등록 */}
          <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#DCD6C9] flex flex-col justify-between space-y-3 shadow-xs">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[0.8125rem] font-bold text-[#19382C] bg-[#DCE8E2] px-2 py-0.5 rounded border border-[#DCE8E2]">
                  기존 상조 그대로 유지
                </span>
                <span className="text-[0.8125rem] font-mono text-[#5A5E66]">0원 안심 대비</span>
              </div>
              <h4 className="font-reverence font-bold text-base sm:text-lg text-[#151719]">
                이중안심 사전등록증
              </h4>
              <p className="text-[1.125rem] text-[#42464E] leading-relaxed font-serif">
                기존 상조는 해약하지 마시고 그대로 두십시오. 비상 즉시 출동권과 50만 원 손실 보전 지원권을 0원에 미리 확보해 드립니다.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsDualStandbyModalOpen(true)}
              className="w-full py-2.5 px-3 bg-[#19382C] hover:bg-[#2D4F43] active:scale-[0.99] text-[#FAF9F6] rounded-lg font-serif font-bold text-[0.8125rem] flex items-center justify-center space-x-1.5 transition-colors cursor-pointer border border-[#2D4F43]"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#C2A26A]" />
              <span>이중안심 등록증 발급 (0원)</span>
            </button>
          </div>

          {/* 카드 2: 전문 심리상담 */}
          <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#DCD6C9] flex flex-col justify-between space-y-3 shadow-xs">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[0.8125rem] font-bold text-[#19382C] bg-[#DCE8E2] px-2 py-0.5 rounded border border-[#DCE8E2]">
                  국가공인 1급 애도치유
                </span>
                <span className="text-[0.8125rem] font-mono text-[#5A5E66]">사전·사별 상담</span>
              </div>
              <h4 className="font-reverence font-bold text-base sm:text-lg text-[#151719]">
                전문 심리상담 (마음돌봄)
              </h4>
              <p className="text-[1.125rem] text-[#42464E] leading-relaxed font-serif">
                임종을 앞둔 불안과 사별 후 유족의 비탄을 따뜻하게 보듬는 보건복지부 1급 정신건강임상심리사 1:1 안심 상담입니다.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setCareModalVertical('PSYCHOLOGY_CARE');
                setIsCareModalOpen(true);
              }}
              className="w-full py-2.5 px-3 bg-[#FAF9F6] hover:bg-[#F1EDE3] active:scale-[0.99] text-[#19382C] rounded-lg font-serif font-bold text-[0.8125rem] flex items-center justify-center space-x-1.5 transition-colors cursor-pointer border border-[#DCD6C9]"
            >
              <HeartHandshake className="w-3.5 h-3.5 text-[#19382C]" />
              <span>전문 심리상담 안내</span>
            </button>
          </div>

          {/* 카드 3: 상속 전문 변호사 */}
          <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#DCD6C9] flex flex-col justify-between space-y-3 shadow-xs">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[0.8125rem] font-bold text-[#6E5429] bg-[#F1E9DB] px-2 py-0.5 rounded border border-[#F1E9DB]">
                  대한변협 등록 전문
                </span>
                <span className="text-[0.8125rem] font-mono text-[#5A5E66]">수수료 0원 직통</span>
              </div>
              <h4 className="font-reverence font-bold text-base sm:text-lg text-[#151719]">
                상속 변호사 & 골든타임
              </h4>
              <p className="text-[1.125rem] text-[#42464E] leading-relaxed font-serif">
                빚 대물림 방지(3개월 골든타임 한정승인)와 상속 재산 분할을 위한 대한변협 등록 상속전문변호사 직통 연결입니다.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setCareModalVertical('LEGAL_INHERITANCE');
                setIsCareModalOpen(true);
              }}
              className="w-full py-2.5 px-3 bg-[#FAF9F6] hover:bg-[#F1EDE3] active:scale-[0.99] text-[#6E5429] rounded-lg font-serif font-bold text-[0.8125rem] flex items-center justify-center space-x-1.5 transition-colors cursor-pointer border border-[#DCD6C9]"
            >
              <Scale className="w-3.5 h-3.5 text-[#6E5429]" />
              <span>상속 변호사 직통 상담</span>
            </button>
          </div>
        </div>

        {/* 하단 1줄 단아한 안심 헌장 띠 */}
        <div className="relative z-10 pt-3 border-t border-[#DCD6C9] flex flex-col sm:flex-row items-center justify-between gap-2 text-[0.8125rem] text-[#5A5E66] font-serif">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-[#19382C] shrink-0" />
            <span className="font-bold text-[#151719]">배웅 4대 의전 안심 헌장:</span>
            <span>선금 0원 · 부당 추가금 0원 · 촌지 전면 금지 · 정직한 100% 후불 정산</span>
          </div>
          <span className="text-[#19382C] font-bold shrink-0">보건복지부 국가장사표준 100% 준수</span>
        </div>
      </div>
      </div>
      {/* ↑ 기존 의전 도록 끝 — 위 disclosure 가 접으면 이 구간이 사라진다 */}

      {/* 코드가 조각으로 나뉘어 늦게 올 수 있다. 그동안 빈 화면을 보여주지 않는다. */}
      <Suspense fallback={null}>
      {/* [옵션 2 모달 1] 듀얼 스탠바이 사전 안심 등록증 모달 */}
      {isDualStandbyModalOpen && (
        <DualStandbyModal
          initialData={SAMPLE_DUAL_STANDBY}
          onClose={() => setIsDualStandbyModalOpen(false)}
          onOpenCancellationClaim={() => {
            setIsDualStandbyModalOpen(false);
            setIsClaimModalOpen(true);
          }}
          onOpenVoucherModal={() => {
            setIsDualStandbyModalOpen(false);
            setIsVoucherModalOpen(true);
          }}
        />
      )}

      {/* [옵션 2 모달 2] 공정위 법정 해약환급금 내용증명 모달 */}
      {isClaimModalOpen && (
        <CancellationClaimModal
          claimData={DualStandbyService.createCancellationClaim({
            cert: BENCHMARK_CERT_B_PREMIUM450,
            refund: StatutoryRefundCalculator.calculateRefund(BENCHMARK_CERT_B_PREMIUM450),
            claimantName: BENCHMARK_CERT_B_PREMIUM450.subscriberName,
            claimantPhone: BENCHMARK_CERT_B_PREMIUM450.subscriberPhone,
            claimantAddress: BENCHMARK_CERT_B_PREMIUM450.subscriberAddress,
            refundBank: BENCHMARK_CERT_B_PREMIUM450.refundBank,
            refundAccount: BENCHMARK_CERT_B_PREMIUM450.refundAccount,
            refundHolder: BENCHMARK_CERT_B_PREMIUM450.refundHolder
          })}
          onClose={() => setIsClaimModalOpen(false)}
        />
      )}

      {/* [옵션 2 모달 3] 해약 손실 보전 바우처 모달 */}
      {isVoucherModalOpen && (
        <LossCreditVoucherModal
          creditAmount={500_000}
          existingCompany="B상조 (보람상조)"
          onClose={() => setIsVoucherModalOpen(false)}
          onOpenDualStandby={() => {
            setIsVoucherModalOpen(false);
            setIsDualStandbyModalOpen(true);
          }}
        />
      )}

      {/* [부가 서비스 모달] 전문 심리상담 및 상속 변호사 안심 디렉터리 모달 */}
      <ProfessionalCareModal
        isOpen={isCareModalOpen}
        initialVertical={careModalVertical}
        onClose={() => setIsCareModalOpen(false)}
      />
      </Suspense>
    </div>
  );
};
