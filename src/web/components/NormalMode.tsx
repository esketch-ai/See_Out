import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, FileText, Building2, PackageCheck, BookOpen, Sparkles, PhoneCall, CheckCircle2, HeartHandshake, Scale } from 'lucide-react';
import { MainTab } from './Header.js';
import { QuoteDiagnosticsWidget } from './QuoteDiagnosticsWidget.js';
import { FuneralHallSearchWidget } from './FuneralHallSearchWidget.js';
import { LifeArchiveWidget } from './LifeArchiveWidget.js';
import { PackagePricingWidget } from './PackagePricingWidget.js';
import { TraditionalSeal } from '../design-system/index.js';
import { DualStandbyModal } from './DualStandbyModal.js';
import { CancellationClaimModal } from './CancellationClaimModal.js';
import { LossCreditVoucherModal } from './LossCreditVoucherModal.js';
import { ProfessionalCareModal } from './ProfessionalCareModal.js';
import { CareVertical } from '../../professional-care/index.js';
import { SAMPLE_DUAL_STANDBY, DualStandbyService } from '../../quote-diagnostics/dualStandbyService.js';
import { BENCHMARK_CERT_B_PREMIUM450 } from '../../quote-diagnostics/benchmarkData.js';
import { StatutoryRefundCalculator } from '../../quote-diagnostics/refundCalculator.js';

import { DEFAULT_FUNERAL_SETTING, FuneralSetting } from '../../life-archive/index.js';
import { VirtualCallService } from '../../tracking/index.js';

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
  // 3대 모듈(전국 장례식장, 정찰 패키지, 생애기록관) 간 실시간 동기화 상태
  const [funeralSetting, setFuneralSetting] = useState<FuneralSetting>(DEFAULT_FUNERAL_SETTING);

  // 듀얼 스탠바이 & 소비자 권익 보호 모달 상태
  const [isDualStandbyModalOpen, setIsDualStandbyModalOpen] = useState(false);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);

  // 생전·유족 심리상담 & 상속 전문 변호사 부가 서비스 모달 상태
  const [isCareModalOpen, setIsCareModalOpen] = useState(false);
  const [careModalVertical, setCareModalVertical] = useState<CareVertical>('PSYCHOLOGY_CARE');

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
      {/* 1. 고품격 시각 비주얼 히어로 배너 (경건한 추모와 24시 긴급 지원) */}
      <div className="relative rounded-xl overflow-hidden shadow-lg border border-[#2D2A26] bg-[#121417]">
        {/* 실제 백국화와 촛불의 경건한 사진 배경 */}
        <img
          src="/images/hero-memorial.jpg"
          alt="배웅 경건 의전 추모 배경"
          className="w-full h-80 sm:h-96 object-cover object-center filter brightness-[0.38] contrast-105"
        />

        {/* 삼국·조선 전통 길상 구름문(雲紋) 은은한 오버레이 */}
        <div className="absolute inset-0 pointer-events-none k-pattern-unmun-dark opacity-35" />

        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0E10] via-[#0D0E10]/70 to-transparent flex flex-col justify-end p-6 sm:p-10 relative z-10">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-[#19382C]/80 text-[#D8CEBA] border border-[#2A5442] text-xs md:text-sm font-serif">
              <TraditionalSeal sealKey="mourningCondolence" size="sm" />
              <span>至誠奉送 · 24시간 전국 전담 의전 지도사 대기</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-reverence font-black text-[#FAF9F6] leading-tight tracking-tight">
              고인의 마지막 가시는 길,<br />
              지극한 예(禮)와 정직함으로 모십니다
            </h1>
            <p className="text-sm md:text-base text-[#D4CEC2] font-serif leading-relaxed">
              임종을 맞이하셨다면 당황하지 마십시오. 2시간 이내에 국가공인 1급 장례지도사가 유족의 곁으로 달려가 처음부터 끝까지 정성을 다하겠습니다.
            </p>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={onEnterEmergency}
              className="btn-senior-reverence bg-[#19382C] hover:bg-[#204738] active:scale-[0.99] text-[#FAF9F6] px-8 flex items-center justify-center space-x-3 shadow-md transition-all cursor-pointer border border-[#2D5A46]"
            >
              <span className="font-reverence font-bold text-lg md:text-xl">24시 긴급 의전 지원 접수</span>
              <ArrowRight className="w-5 h-5 text-[#C2A26A]" />
            </button>
            <a
              href="tel:1588-0000"
              className="btn-senior-reverence bg-[#0D0E10]/80 hover:bg-[#1A1D20] text-[#FAF9F6] px-7 flex items-center justify-center space-x-2 font-serif text-base border border-[#9E7D47]/60"
            >
              <PhoneCall className="w-4 h-4 text-[#C2A26A]" />
              <span>상황실 직통 1588-0000</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. [조성우 수석 디자이너 감수] 전통 미학 단아한 여백과 사색(四色) 철학 배너 */}
      <div className="bg-[#FFFFFF] border border-[#E3DFD5] rounded-xl p-7 md:p-9 relative shadow-xs overflow-hidden">
        {/* 한옥 살창 격자문(格子紋) 은은한 워터마크 */}
        <div className="pointer-events-none absolute inset-0 k-pattern-gyeokja opacity-35" />
        <div className="max-w-3xl mx-auto text-center space-y-4 relative z-10">
          <div className="flex items-center justify-center space-x-2 text-[#9E7D47] font-serif text-xs md:text-sm font-semibold tracking-wider">
            <span className="w-6 h-[1px] bg-[#C2A26A]" />
            <span>생애 마지막 가시는 길, 가장 정갈하고 맑은 배웅</span>
            <span className="w-6 h-[1px] bg-[#C2A26A]" />
          </div>
          <p className="text-xl md:text-2xl font-reverence font-bold text-[#151719] leading-relaxed tracking-tight">
            “한 인간의 숭고한 삶을 기리는 자리는 번쩍이는 상술이 아닌,<br className="hidden sm:inline" />
            단아한 한지와 은은한 백자의 품격으로 채워져야 합니다.”
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 text-xs font-serif border-t border-[#ECE8E0]">
            <div className="p-2 text-center">
              <div className="font-bold text-[#151719] text-sm">眞 · 원가 공개</div>
              <div className="text-[#727782] text-[11px] mt-0.5">거짓 없는 실비 대조</div>
            </div>
            <div className="p-2 text-center">
              <div className="font-bold text-[#151719] text-sm">安 · 안식 안내</div>
              <div className="text-[#727782] text-[11px] mt-0.5">전국 1,080곳 빈소 시설</div>
            </div>
            <div className="p-2 text-center">
              <div className="font-bold text-[#151719] text-sm">誠 · 정찰 예우</div>
              <div className="text-[#727782] text-[11px] mt-0.5">선금 없는 후불 정산제</div>
            </div>
            <div className="p-2 text-center">
              <div className="font-bold text-[#151719] text-sm">永 · 생애 보존</div>
              <div className="text-[#727782] text-[11px] mt-0.5">디지털 사전 기억 봉안</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 4대 핵심 의전 도록(圖錄) 카드 */}
      <div className="space-y-4">
        <div className="flex justify-between items-end border-b border-[#E3DFD5] pb-3">
          <div>
            <span className="text-xs font-serif font-bold text-[#9E7D47]">
              배웅 4대 핵심 의전 정례 서비스
            </span>
            <h2 className="text-2xl md:text-3xl font-reverence font-black text-[#151719] mt-1 tracking-tight">
              주요 서비스 둘러보기
            </h2>
          </div>
          <span className="text-xs text-[#727782] font-serif hidden sm:block">
            카드를 누르시면 상세 안내 화면으로 이동합니다
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
          {/* 1. 상조 증서 원가 진단 카드 */}
          <div
            onClick={() => onSelectTab('quote')}
            className="k-card-heritage group cursor-pointer overflow-hidden flex flex-col justify-between"
          >
            <div className="relative h-48 sm:h-52 overflow-hidden bg-gray-100">
              <img
                src="/images/escort-ceremony.jpg"
                alt="정중한 의전 지도사 예우"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-[#0D0E10]/80 text-[#FAF9F6] px-2.5 py-1 rounded text-xs font-serif font-bold border border-[#9E7D47]/40 flex items-center space-x-1.5">
                <span className="text-[#C2A26A] font-bold">01 眞</span>
                <span>원가 영수증 1:1 비교</span>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-xs font-serif font-bold text-[#9E7D47]">공정위 법정 환급 산식 준수</span>
                <h3 className="text-xl sm:text-2xl font-reverence font-bold text-[#151719] mt-1 group-hover:text-[#19382C] transition-colors">
                  기존 상조 증서 정밀 원가 진단
                </h3>
                <p className="text-sm text-[#42464E] mt-2 leading-relaxed font-serif">
                  보유 중이신 상조 상품을 해약할 때 받게 되는 환급금과 숨은 추가금을 정밀 연산하여 1:1 맞춤 영수증으로 비교해 드립니다.
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#ECE8E0] flex items-center justify-between text-[#19382C] font-serif font-bold text-sm">
                <span>영수증 대조표 확인하기</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* 2. 전국 장례식장 시설 및 감면 카드 */}
          <div
            onClick={() => onSelectTab('funeral-halls')}
            className="k-card-heritage group cursor-pointer overflow-hidden flex flex-col justify-between"
          >
            <div className="relative h-48 sm:h-52 overflow-hidden bg-gray-100">
              <img
                src="/images/memorial-altar.jpg"
                alt="정갈한 장례식장 제단 꽃장식"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-[#0D0E10]/80 text-[#FAF9F6] px-2.5 py-1 rounded text-xs font-serif font-bold border border-[#2A5442] flex items-center space-x-1.5">
                <span className="text-[#C2A26A] font-bold">02 安</span>
                <span>전국 1,080곳 전수 데이터</span>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-xs font-serif font-bold text-[#19382C]">빈소 임대료 최대 30% 감면</span>
                <h3 className="text-xl sm:text-2xl font-reverence font-bold text-[#151719] mt-1 group-hover:text-[#19382C] transition-colors">
                  전국 장례식장 시설 · 감면 검색
                </h3>
                <p className="text-sm text-[#42464E] mt-2 leading-relaxed font-serif">
                  거주지 인근 장례식장의 분향실과 안치실 규모를 파악하고, 배웅 사전 등록을 통한 빈소 임대료 감면 혜택을 확인하세요.
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#ECE8E0] flex items-center justify-between text-[#19382C] font-serif font-bold text-sm">
                <span>장례식장 시설 검색하기</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* 3. 정찰제 의전 패키지 카드 */}
          <div
            onClick={() => onSelectTab('packages')}
            className="k-card-heritage group cursor-pointer overflow-hidden flex flex-col justify-between"
          >
            <div className="relative h-48 sm:h-52 overflow-hidden bg-gray-100">
              <img
                src="/images/hero-memorial.jpg"
                alt="정직 원가 의전 용품"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-[#0D0E10]/80 text-[#FAF9F6] px-2.5 py-1 rounded text-xs font-serif font-bold border border-[#9E7D47]/40 flex items-center space-x-1.5">
                <span className="text-[#C2A26A] font-bold">03 誠</span>
                <span>선금 0원 · 100% 후불 정산</span>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-xs font-serif font-bold text-[#9E7D47]">부당 추가금 0원 보증제</span>
                <h3 className="text-xl sm:text-2xl font-reverence font-bold text-[#151719] mt-1 group-hover:text-[#19382C] transition-colors">
                  정직 원가 정찰제 의전 패키지
                </h3>
                <p className="text-sm text-[#42464E] mt-2 leading-relaxed font-serif">
                  무빈소(120만), 2일가족장(180만), 실속형(250만), 품격형(350만) 등 수의·관·차량 원가를 100% 투명하게 공개하며 촌지를 금지합니다.
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#ECE8E0] flex items-center justify-between text-[#19382C] font-serif font-bold text-sm">
                <span>정찰제 패키지 명세 보기</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* 4. 생애기록관 카드 */}
          <div
            onClick={() => onSelectTab('life-archive')}
            className="k-card-heritage group cursor-pointer overflow-hidden flex flex-col justify-between"
          >
            <div className="relative h-48 sm:h-52 overflow-hidden bg-gray-100">
              <img
                src="/images/life-archive.jpg"
                alt="소중한 삶의 기억과 훈장, 옛 사진"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-[#0D0E10]/80 text-[#FAF9F6] px-2.5 py-1 rounded text-xs font-serif font-bold border border-[#9E7D47]/40 flex items-center space-x-1.5">
                <span className="text-[#C2A26A] font-bold">04 永</span>
                <span>사전 기억 봉안소</span>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-xs font-serif font-bold text-[#19382C]">사후 승계 게이트키퍼 가동</span>
                <h3 className="text-xl sm:text-2xl font-reverence font-bold text-[#151719] mt-1 group-hover:text-[#19382C] transition-colors">
                  생애기록관 (Pre-mortem 일상 봉안)
                </h3>
                <p className="text-sm text-[#42464E] mt-2 leading-relaxed font-serif">
                  스마트폰 연락처 사전 동기화, 원터치 부고 발송, 생전 사진 갤러리 및 고인의 삶을 엮은 생애 평전 스토리북을 제공합니다.
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#ECE8E0] flex items-center justify-between text-[#19382C] font-serif font-bold text-sm">
                <span>생애기록관 보존 플랜 보기</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3.5. [옵션 2 특화] 배웅 듀얼 스탠바이 (Dual-Standby) 사전 무약정 등록 퀵 런처 배너 */}
      <div className="bg-[#FAF9F6] border-2 border-[#19382C] rounded-xl p-6 sm:p-8 space-y-6 shadow-sm relative overflow-hidden">
        {/* 한옥 살창 격자문 은은한 워터마크 */}
        <div className="pointer-events-none absolute inset-0 k-pattern-gyeokja opacity-25" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-[#19382C]/10 text-[#19382C] text-xs font-serif font-bold border border-[#19382C]/20">
              <ShieldCheck className="w-4 h-4 text-[#19382C]" />
              <span>기존 상조 가입 고객 전용 · 사전 무약정 0원</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-reverence font-black text-[#151719] tracking-tight">
              기존 상조 해약 걱정 없이,<br className="hidden sm:inline" />
              <span className="text-[#19382C]">배웅 듀얼 스탠바이 (비용 0원)</span>로 안심을 더하세요
            </h3>
            <p className="text-xs sm:text-sm text-[#42464E] font-serif leading-relaxed">
              기존 선불식 상조는 해약하지 않고 그대로 두십시오. 위급한 순간 1초 만에 최적의 의전을 선택할 수 있는 <b>우선 출동권</b>과 <b>50만 원 상당의 해약 손실 보전 바우처</b>를 지금 즉시 0원에 확보해 드립니다.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 text-xs font-serif text-[#151719]">
              <div className="flex items-center space-x-1.5 bg-[#FFFFFF] p-2 rounded border border-[#E3DFD5]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#19382C] shrink-0" />
                <span className="truncate">사전 약정금 0원</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-[#FFFFFF] p-2 rounded border border-[#E3DFD5]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#19382C] shrink-0" />
                <span className="truncate">24시 전담 지도사 배정</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-[#FFFFFF] p-2 rounded border border-[#E3DFD5]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#19382C] shrink-0" />
                <span className="truncate">50만 원 보전 바우처</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <button
              onClick={() => setIsDualStandbyModalOpen(true)}
              className="py-3.5 px-6 bg-[#19382C] hover:bg-[#204738] active:scale-[0.99] text-[#FAF9F6] rounded-xl font-reverence font-bold text-sm sm:text-base flex items-center justify-center space-x-2 shadow-md transition-all cursor-pointer border border-[#2D5A46]"
            >
              <ShieldCheck className="w-4 h-4 text-[#C2A26A]" />
              <span>🛡️ 듀얼 스탠바이 등록증 발급</span>
            </button>
            <button
              onClick={() => onSelectTab('quote')}
              className="py-3.5 px-6 bg-[#FFFFFF] hover:bg-[#F3EFE6] text-[#19382C] border border-[#19382C]/30 active:scale-[0.99] rounded-xl font-serif font-bold text-sm sm:text-base flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <span>📊 내 상조 증서 1:1 원가 진단</span>
              <ArrowRight className="w-4 h-4 text-[#19382C]" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. [신규 이정환 박사·조성우 수석 감수] 전통 3일장 상장례(喪葬禮) 3폭 병풍(屛風) 정례 절차도 */}
      <div className="bg-[#FFFFFF] border border-[#E3DFD5] rounded-xl p-6 md:p-9 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E3DFD5] pb-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-[#9E7D47] text-xs font-serif font-bold mb-1">
              <span>禮 · 전통 상장례(喪葬禮) 3일장 표준 예법</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-reverence font-black text-[#151719] tracking-tight">
              고인을 모시는 3일간의 숭고한 여정
            </h3>
            <p className="text-xs sm:text-sm text-[#727782] mt-1 leading-relaxed font-serif">
              임종의 순간부터 영원한 안식까지, 국가공인 1급 장례지도사가 유족의 곁을 24시간 정성껏 지킵니다.
            </p>
          </div>
          <span className="text-xs text-[#727782] font-serif">
            보건복지부 국가장사표준 및 전통의례 준수
          </span>
        </div>

        {/* 3폭 병풍 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 1일차 */}
          <div className="k-screen-panel p-6 flex flex-col justify-between space-y-4 relative">
            <div className="pointer-events-none absolute inset-0 k-pattern-gyeokja opacity-25" />
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-serif font-bold text-[#19382C] bg-[#F0F5F2] px-2.5 py-0.5 rounded border border-[#BFD4CA]">
                  첫째 날
                </span>
                <span className="text-xs font-mono text-[#727782]">Day 1</span>
              </div>
              <h4 className="font-reverence font-bold text-lg md:text-xl text-[#151719] mt-2">
                初終 · 安息 (초종과 안식)
              </h4>
              <p className="text-xs text-[#727782] mt-1 font-serif">
                임종 즉시 고인을 정중히 운구하고 유족의 쉼터를 마련합니다.
              </p>
              <ul className="mt-4 space-y-2 text-xs md:text-sm text-[#42464E] font-serif">
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
            <div className="pt-3 border-t border-[#ECE8E0] text-[11px] text-[#19382C] font-serif font-bold relative z-10">
              ✓ 전문 장례지도사 2시간 이내 현장 배치
            </div>
          </div>

          {/* 2일차 */}
          <div className="k-screen-panel p-6 flex flex-col justify-between space-y-4 border-2 border-[#9E7D47]/40 bg-[#FAF9F6] relative">
            <div className="pointer-events-none absolute inset-0 k-pattern-gyeokja opacity-35" />
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-serif font-bold text-[#876937] bg-[#F8F5EE] px-2.5 py-0.5 rounded border border-[#E4D5BC]">
                  둘째 날 · 핵심 의례
                </span>
                <span className="text-xs font-mono text-[#727782]">Day 2</span>
              </div>
              <h4 className="font-reverence font-bold text-lg md:text-xl text-[#151719] mt-2">
                殮襲 · 入棺 (궁중염습과 입관)
              </h4>
              <p className="text-xs text-[#727782] mt-1 font-serif">
                고인에게 마지막 새 옷을 입혀드리고 온 가족이 작별합니다.
              </p>
              <ul className="mt-4 space-y-2 text-xs md:text-sm text-[#42464E] font-serif">
                <li className="flex items-start space-x-2">
                  <span className="text-[#9E7D47] font-bold">•</span>
                  <span>국가공인 1급 지도사 2인 전통 궁중 습염 집전</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-[#9E7D47] font-bold">•</span>
                  <span>최고급 명품 수의 정갈한 착의 및 한지 장정</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-[#9E7D47] font-bold">•</span>
                  <span>생화(生花) 꽃구름 침상 입관식 및 향낭 봉안</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-[#9E7D47] font-bold">•</span>
                  <span>종교별 추모식(기독교·천주교·불교·유교 제례)</span>
                </li>
              </ul>
            </div>
            <div className="pt-3 border-t border-[#ECE8E0] text-[11px] text-[#876937] font-serif font-bold relative z-10">
              ✓ 꽃장식/수의 강매 및 촌지 요구 100% 금지
            </div>
          </div>

          {/* 3일차 */}
          <div className="k-screen-panel p-6 flex flex-col justify-between space-y-4 relative">
            <div className="pointer-events-none absolute inset-0 k-pattern-gyeokja opacity-25" />
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-serif font-bold text-[#19382C] bg-[#F0F5F2] px-2.5 py-0.5 rounded border border-[#BFD4CA]">
                  셋째 날
                </span>
                <span className="text-xs font-mono text-[#727782]">Day 3</span>
              </div>
              <h4 className="font-reverence font-bold text-lg md:text-xl text-[#151719] mt-2">
                發靷 · 奉安 (발인과 영구안식)
              </h4>
              <p className="text-xs text-[#727782] mt-1 font-serif">
                고인을 편안한 영구 안식처로 모시는 마지막 배웅입니다.
              </p>
              <ul className="mt-4 space-y-2 text-xs md:text-sm text-[#42464E] font-serif">
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
            <div className="pt-3 border-t border-[#ECE8E0] text-[11px] text-[#19382C] font-serif font-bold relative z-10">
              ✓ 추가 장거리 운임 바가지 일절 없음
            </div>
          </div>
        </div>
      </div>

      {/* 4.5. [신규 부가 서비스] 생전 마음돌봄·유족 사별 애도 심리상담 & 상속·유산·채무방어 전문 변호사 상담 */}
      <div className="bg-[#FAF9F6] border-2 border-[#19382C]/30 rounded-xl p-6 md:p-8 space-y-6 shadow-sm relative overflow-hidden">
        {/* 살창 격자문 은은한 워터마크 */}
        <div className="pointer-events-none absolute inset-0 k-pattern-gyeokja opacity-25" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-[#19382C]/10 text-[#19382C] text-xs font-serif font-bold border border-[#19382C]/20">
              <Sparkles className="w-3.5 h-3.5 text-[#C2A26A]" />
              <span>전문가 연계 부가 서비스 · 변호사법 제34조 준수 (알선 수수료 0원)</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-reverence font-black text-[#151719] tracking-tight">
              마음의 치유부터 상속의 안심까지,<br className="hidden sm:inline" />
              <span className="text-[#19382C]">공인 전문가 직통 상담</span>으로 지켜드립니다
            </h3>
            <p className="text-xs sm:text-sm text-[#42464E] font-serif leading-relaxed">
              임종 전 불안과 사별 후 유족의 비탄을 치유하는 <b>국가공인 1급 심리상담</b>과
              빚 대물림 방지(3개월 골든타임 한정승인) 및 유산 분할을 위한 <b>대한변협 등록 상속 전문 변호사</b>를
              플랫폼 중개 수수료 없이 100% 무료 직통 디렉터리로 연결합니다.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs font-serif text-[#151719]">
              <div className="flex items-center space-x-2 bg-[#FFFFFF] p-2.5 rounded-lg border border-[#E3DFD5]">
                <HeartHandshake className="w-4 h-4 text-[#19382C] shrink-0" />
                <div>
                  <span className="font-bold block">생전 마음돌봄 & 유족 사별 애도상담</span>
                  <span className="text-[11px] text-[#727782]">보건복지부 1급 정신건강임상심리사 정찰제</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 bg-[#FFFFFF] p-2.5 rounded-lg border border-[#E3DFD5]">
                <Scale className="w-4 h-4 text-[#876937] shrink-0" />
                <div>
                  <span className="font-bold block">상속포기 3개월 골든타임 & 유산 분할</span>
                  <span className="text-[11px] text-[#727782]">대한변협 등록 상속전문변호사 0원 직통</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <button
              onClick={() => {
                setCareModalVertical('PSYCHOLOGY_CARE');
                setIsCareModalOpen(true);
              }}
              className="py-3 px-5 bg-[#19382C] hover:bg-[#204738] active:scale-[0.99] text-[#FAF9F6] rounded-xl font-serif font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-xs transition-all cursor-pointer border border-[#2D5A46]"
            >
              <HeartHandshake className="w-4 h-4 text-[#C2A26A]" />
              <span>🌿 전문 심리상담 (애도치유) 안내</span>
            </button>
            <button
              onClick={() => {
                setCareModalVertical('LEGAL_INHERITANCE');
                setIsCareModalOpen(true);
              }}
              className="py-3 px-5 bg-[#FFFFFF] hover:bg-[#F3EFE6] text-[#19382C] border border-[#19382C]/30 active:scale-[0.99] rounded-xl font-serif font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <Scale className="w-4 h-4 text-[#876937]" />
              <span>⚖️ 상속 변호사 & 골든타임 계산기</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5. 하단 배웅 4대 의전 안심 헌장 */}
      <div className="bg-[#132B22] text-[#FAF9F6] rounded-xl p-8 md:p-12 text-center space-y-4 border border-[#2D5A46] shadow-sm relative overflow-hidden">
        {/* 전통 비단 금문 패턴 은은한 오버레이 */}
        <div className="pointer-events-none absolute inset-0 k-pattern-geummun opacity-30" />
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-[#19382C] text-[#C2A26A] text-xs md:text-sm font-serif border border-[#2A5442]">
            <ShieldCheck className="w-4 h-4 text-[#C2A26A]" />
            <span>배웅 4대 의전 안심 헌장</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-reverence font-bold text-[#FAF9F6] tracking-tight leading-snug">
            선금 0원 · 부당 추가금 0원 · 촌지 전면 금지 · 정직한 후불제
          </h3>
          <p className="text-[#BFD4CA] text-sm md:text-base max-w-2xl mx-auto leading-relaxed pt-1 font-serif">
            고인의 고귀한 생애를 기리는 숭고한 자리에 부당한 상술이 발붙이지 못하도록,
            모든 의전과 시설비는 1원 단위까지 맑고 정직하게 공개합니다.
          </p>
        </div>
      </div>

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
            claimantName: '김정우',
            claimantPhone: '010-3849-2910',
            claimantAddress: '서울특별시 송파구 올림픽로 300 (신천동)',
            refundBank: '신한은행',
            refundAccount: '110-384-291028',
            refundHolder: '김정우'
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
    </div>
  );
};
