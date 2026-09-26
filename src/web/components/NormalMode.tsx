import React from 'react';
import { ArrowRight, ShieldCheck, FileText, Building2, PackageCheck, BookOpen, Sparkles, PhoneCall } from 'lucide-react';
import { MainTab } from './Header.js';
import { QuoteDiagnosticsWidget } from './QuoteDiagnosticsWidget.js';
import { FuneralHallSearchWidget } from './FuneralHallSearchWidget.js';
import { LifeArchiveWidget } from './LifeArchiveWidget.js';
import { PackagePricingWidget } from './PackagePricingWidget.js';

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
  // 1. 특정 탭 선택 시 해당 컴포넌트 전용 상세 뷰 렌더링
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
        <FuneralHallSearchWidget />
      </div>
    );
  }

  if (currentTab === 'packages') {
    return (
      <div className="space-y-6 pb-20">
        <PackagePricingWidget />
      </div>
    );
  }

  if (currentTab === 'life-archive') {
    return (
      <div className="space-y-6 pb-20">
        <LifeArchiveWidget />
      </div>
    );
  }

  // 2. 'home' (종합 의전 안내) 탭인 경우: 전체 핵심 조망 + 4대 대형 바로가기 카드
  return (
    <div className="space-y-12 pb-24">
      {/* 24시 긴급 의전 지원 배너 (정중하고 엄숙한 최상단 배너) */}
      <div className="bg-gradient-to-r from-mourning-950 via-mourning-900 to-mourning-950 text-white rounded-3xl p-6 md:p-9 shadow-xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-5">
          <div className="w-16 h-16 bg-crimson-600/30 border border-crimson-600/60 rounded-3xl flex items-center justify-center shrink-0">
            <span className="font-reverence text-3xl font-black text-nobleGold-100">禮</span>
          </div>
          <div>
            <div className="text-xs md:text-sm font-serif font-bold text-nobleGold-100 uppercase tracking-widest">
              24시간 전국 긴급 의전 지원 상황실
            </div>
            <div className="text-2xl md:text-3xl font-reverence font-black mt-1 text-white leading-tight">
              임종을 맞이하셨다면, 삼가 2시간 내 곁으로 달려가겠습니다
            </div>
            <p className="text-sm md:text-base text-gray-300 mt-2 font-serif">
              국가공인 장례지도사 전담 배정 · 이송 차량 즉시 출동 · 선금 0원 후불 정산
            </p>
          </div>
        </div>

        <button
          onClick={onEnterEmergency}
          className="btn-senior-reverence bg-crimson-600 hover:bg-crimson-700 active:scale-95 text-white px-8 flex items-center justify-center space-x-3 shrink-0 shadow-2xl transition-all cursor-pointer border border-crimson-500/50"
        >
          <span className="font-reverence font-bold text-xl md:text-2xl">긴급 의전 출동 요청</span>
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>

      {/* 4대 핵심 의전 메뉴 대형 안내 카드 (노안 어르신 맞춤 시원한 레이아웃) */}
      <div className="space-y-4">
        <div className="flex justify-between items-end border-b border-ink-border pb-3">
          <div>
            <span className="text-xs font-serif font-bold text-nobleGold-700 bg-nobleGold-100 px-3 py-1 rounded-full border border-nobleGold-500/20">
              배웅 4대 핵심 의전 안내
            </span>
            <h2 className="text-2xl md:text-3xl font-reverence font-black text-ink mt-2">
              필요하신 항목을 선택하시면 더욱 자세히 안내해 드립니다
            </h2>
          </div>
          <span className="text-xs md:text-sm text-ink-muted font-serif hidden sm:block">
            상단 메뉴를 통해서도 언제든 이동하실 수 있습니다
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          {/* 1. 상조 증서 원가 진단 카드 */}
          <div
            onClick={() => onSelectTab('quote')}
            className="p-7 md:p-8 rounded-3xl bg-porcelain border-2 border-ink-border hover:border-celadon-700 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-nobleGold-100 border border-nobleGold-500/30 flex items-center justify-center text-nobleGold-700 mb-5 group-hover:scale-105 transition-transform">
                <FileText className="w-7 h-7" />
              </div>
              <span className="text-xs font-serif font-bold text-nobleGold-700">공정거래위원회 법정 환급 산식</span>
              <h3 className="text-2xl font-reverence font-black text-ink mt-1 group-hover:text-celadon-900 transition-colors">
                기존 상조 증서 정밀 원가 진단
              </h3>
              <p className="text-sm md:text-base text-ink-light mt-2.5 leading-relaxed">
                보유 중이신 상조 상품을 해약할 때 받게 되는 법정 환급금과 현장 추가금을 연산하여 1:1 맞춤 영수증으로 비교해 드립니다.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-ink-border/50 flex items-center justify-between text-celadon-800 font-reverence font-bold text-base md:text-lg">
              <span>영수증 1:1 비교표 자세히 보기</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 2. 전국 장례식장 시설 및 감면 카드 */}
          <div
            onClick={() => onSelectTab('funeral-halls')}
            className="p-7 md:p-8 rounded-3xl bg-porcelain border-2 border-ink-border hover:border-celadon-700 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-celadon-100 border border-celadon-600/30 flex items-center justify-center text-celadon-800 mb-5 group-hover:scale-105 transition-transform">
                <Building2 className="w-7 h-7" />
              </div>
              <span className="text-xs font-serif font-bold text-celadon-800">전국 1,080개 등록 식장 전수 연계</span>
              <h3 className="text-2xl font-reverence font-black text-ink mt-1 group-hover:text-celadon-900 transition-colors">
                전국 장례식장 시설 · 감면 검색
              </h3>
              <p className="text-sm md:text-base text-ink-light mt-2.5 leading-relaxed">
                거주지 인근 장례식장의 분향실과 안치실 규모를 파악하고, 배웅 사전 등록을 통한 빈소 임대료 최대 30% 감면을 확인하세요.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-ink-border/50 flex items-center justify-between text-celadon-800 font-reverence font-bold text-base md:text-lg">
              <span>장례식장 시설 검색 자세히 보기</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 3. 정찰제 의전 패키지 카드 */}
          <div
            onClick={() => onSelectTab('packages')}
            className="p-7 md:p-8 rounded-3xl bg-porcelain border-2 border-ink-border hover:border-celadon-700 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-nobleGold-100 border border-nobleGold-500/30 flex items-center justify-center text-nobleGold-700 mb-5 group-hover:scale-105 transition-transform">
                <PackageCheck className="w-7 h-7" />
              </div>
              <span className="text-xs font-serif font-bold text-nobleGold-700">선금 0원 · 정직한 후불 정산제</span>
              <h3 className="text-2xl font-reverence font-black text-ink mt-1 group-hover:text-celadon-900 transition-colors">
                정직 원가 정찰제 의전 패키지
              </h3>
              <p className="text-sm md:text-base text-ink-light mt-2.5 leading-relaxed">
                무빈소(120만), 실속형(250만), 표준형(350만) 등 수의와 관, 인력의 원가를 투명하게 공개하며 부당 추가금 0원을 보증합니다.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-ink-border/50 flex items-center justify-between text-celadon-800 font-reverence font-bold text-base md:text-lg">
              <span>정찰제 패키지 명세 자세히 보기</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 4. 생애기록관 카드 */}
          <div
            onClick={() => onSelectTab('life-archive')}
            className="p-7 md:p-8 rounded-3xl bg-porcelain border-2 border-ink-border hover:border-celadon-700 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-celadon-100 border border-celadon-600/30 flex items-center justify-center text-celadon-800 mb-5 group-hover:scale-105 transition-transform">
                <BookOpen className="w-7 h-7" />
              </div>
              <span className="text-xs font-serif font-bold text-celadon-800">사전 기억 봉안 & 사후 승계 게이트키퍼</span>
              <h3 className="text-2xl font-reverence font-black text-ink mt-1 group-hover:text-celadon-900 transition-colors">
                생애기록관 (Pre-mortem 일상 봉안)
              </h3>
              <p className="text-sm md:text-base text-ink-light mt-2.5 leading-relaxed">
                일기, 상장, 가족 사진, 육성 회고록 등 평생의 삶의 흔적을 정갈하게 보존하고, 사후에만 안전하게 유족에게 전합니다.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-ink-border/50 flex items-center justify-between text-celadon-800 font-reverence font-bold text-base md:text-lg">
              <span>생애기록관 보존 플랜 자세히 보기</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* 하단 배웅 4대 의전 안심 헌장 */}
      <div className="bg-celadon-900 text-white rounded-3xl p-8 md:p-12 text-center space-y-5 border border-nobleGold-500/30 shadow-lg">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-celadon-800 text-nobleGold-100 text-xs md:text-sm font-serif font-bold border border-nobleGold-500/30">
          <ShieldCheck className="w-4 h-4 text-nobleGold-500" />
          <span>배웅 4대 의전 안심 헌장</span>
        </div>
        <h3 className="text-2xl md:text-4xl font-reverence font-black text-white tracking-tight leading-snug">
          선금 0원 · 부당 추가금 0원 · 촌지 전면 금지 · 정직한 후불제
        </h3>
        <p className="text-celadon-100 text-base md:text-lg max-w-2xl mx-auto leading-relaxed pt-1 font-serif">
          고인의 고귀한 생애를 기리는 숭고한 자리에 부당한 상술이 발붙이지 못하도록,
          모든 의전과 시설비는 1원 단위까지 맑고 정직하게 공개합니다.
        </p>
      </div>
    </div>
  );
};
