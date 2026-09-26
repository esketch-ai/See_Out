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

  // 'home' (종합 의전 안내) 탭인 경우: 풍부한 시각 사진과 함께 전체 조망
  return (
    <div className="space-y-12 pb-24">
      {/* 1. 고품격 시각 비주얼 히어로 배너 (사진 이미지 + 24시 긴급 핫라인) */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
        {/* 실제 백국화와 촛불의 경건한 사진 배경 */}
        <img
          src="/images/hero-memorial.jpg"
          alt="배웅 경건 의전 추모 배경"
          className="w-full h-80 sm:h-96 object-cover object-center filter brightness-[0.4] group-hover:scale-102 transition-transform duration-700"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-mourning-950 via-mourning-900/60 to-transparent flex flex-col justify-end p-6 sm:p-10">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-nobleGold-500/20 text-nobleGold-100 border border-nobleGold-500/40 text-xs md:text-sm font-serif">
              <span>謹 弔 · 24시간 전국 전담 의전팀 대기</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-reverence font-black text-white leading-tight">
              고인의 마지막 가시는 길,<br />
              지극한 예(禮)와 정직함으로 모십니다
            </h1>
            <p className="text-sm md:text-base text-gray-200 font-serif leading-relaxed">
              임종을 맞이하셨다면 당황하지 마십시오. 2시간 이내에 전담 장례지도사가 유족의 곁으로 달려가 처음부터 끝까지 정성을 다하겠습니다.
            </p>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={onEnterEmergency}
              className="btn-senior-reverence bg-crimson-600 hover:bg-crimson-700 active:scale-95 text-white px-8 flex items-center justify-center space-x-3 shadow-2xl transition-all cursor-pointer border border-crimson-500/50"
            >
              <span className="font-reverence font-bold text-xl md:text-2xl">🚨 긴급 의전 출동 요청</span>
              <ArrowRight className="w-6 h-6" />
            </button>
            <a
              href="tel:1588-0000"
              className="btn-senior-reverence bg-white/15 hover:bg-white/25 text-white px-7 flex items-center justify-center space-x-2 font-serif text-lg backdrop-blur-sm border border-white/20"
            >
              <PhoneCall className="w-5 h-5 text-nobleGold-100" />
              <span>24시 상황실 즉시 전화</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. 사진 이미지 중심의 4대 핵심 의전 안내 카드 (직관적 시각화) */}
      <div className="space-y-4">
        <div className="flex justify-between items-end border-b border-ink-border pb-3">
          <div>
            <span className="text-xs font-serif font-bold text-nobleGold-700 bg-nobleGold-100 px-3 py-1 rounded-full border border-nobleGold-500/20">
              배웅 4대 핵심 의전 서비스
            </span>
            <h2 className="text-2xl md:text-3xl font-reverence font-black text-ink mt-2">
              사진과 함께 쉽게 살펴보세요
            </h2>
          </div>
          <span className="text-xs md:text-sm text-ink-muted font-serif hidden sm:block">
            사진이나 카드를 누르시면 상세 화면으로 이동합니다
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* 1. 상조 증서 원가 진단 카드 (사진 포함) */}
          <div
            onClick={() => onSelectTab('quote')}
            className="rounded-3xl bg-porcelain border-2 border-ink-border hover:border-celadon-700 hover:shadow-xl transition-all cursor-pointer group overflow-hidden flex flex-col justify-between"
          >
            <div className="relative h-48 sm:h-52 overflow-hidden bg-gray-100">
              <img
                src="/images/escort-ceremony.jpg"
                alt="정중한 의전 지도사 예우"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-mourning-950/80 backdrop-blur-md text-nobleGold-100 px-3 py-1 rounded-full text-xs font-serif font-bold border border-nobleGold-500/30">
                원가 영수증 1:1 비교
              </div>
            </div>

            <div className="p-6 md:p-7 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-xs font-serif font-bold text-nobleGold-700">공정위 법정 환급 산식 준수</span>
                <h3 className="text-2xl font-reverence font-black text-ink mt-1 group-hover:text-celadon-900 transition-colors">
                  기존 상조 증서 정밀 원가 진단
                </h3>
                <p className="text-sm md:text-base text-ink-light mt-2.5 leading-relaxed">
                  보유 중이신 상조 상품을 해약할 때 받게 되는 환급금과 숨은 추가금을 정밀 연산하여 1:1 맞춤 영수증으로 비교해 드립니다.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-ink-border/50 flex items-center justify-between text-celadon-800 font-reverence font-bold text-base md:text-lg">
                <span>영수증 대조표 확인하기</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* 2. 전국 장례식장 시설 및 감면 카드 (사진 포함) */}
          <div
            onClick={() => onSelectTab('funeral-halls')}
            className="rounded-3xl bg-porcelain border-2 border-ink-border hover:border-celadon-700 hover:shadow-xl transition-all cursor-pointer group overflow-hidden flex flex-col justify-between"
          >
            <div className="relative h-48 sm:h-52 overflow-hidden bg-gray-100">
              <img
                src="/images/memorial-altar.jpg"
                alt="정갈한 장례식장 제단 꽃장식"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-mourning-950/80 backdrop-blur-md text-celadon-200 px-3 py-1 rounded-full text-xs font-serif font-bold border border-celadon-600/30">
                전국 1,080곳 전수 데이터
              </div>
            </div>

            <div className="p-6 md:p-7 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-xs font-serif font-bold text-celadon-800">빈소 임대료 최대 30% 감면</span>
                <h3 className="text-2xl font-reverence font-black text-ink mt-1 group-hover:text-celadon-900 transition-colors">
                  전국 장례식장 시설 · 감면 검색
                </h3>
                <p className="text-sm md:text-base text-ink-light mt-2.5 leading-relaxed">
                  거주지 인근 장례식장의 분향실과 안치실 규모를 파악하고, 배웅 사전 등록을 통한 빈소 임대료 감면 혜택을 확인하세요.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-ink-border/50 flex items-center justify-between text-celadon-800 font-reverence font-bold text-base md:text-lg">
                <span>장례식장 시설 검색하기</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* 3. 정찰제 의전 패키지 카드 (사진 포함) */}
          <div
            onClick={() => onSelectTab('packages')}
            className="rounded-3xl bg-porcelain border-2 border-ink-border hover:border-celadon-700 hover:shadow-xl transition-all cursor-pointer group overflow-hidden flex flex-col justify-between"
          >
            <div className="relative h-48 sm:h-52 overflow-hidden bg-gray-100">
              <img
                src="/images/hero-memorial.jpg"
                alt="정직 원가 의전 용품"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-mourning-950/80 backdrop-blur-md text-nobleGold-100 px-3 py-1 rounded-full text-xs font-serif font-bold border border-nobleGold-500/30">
                선금 0원 · 100% 후불제
              </div>
            </div>

            <div className="p-6 md:p-7 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-xs font-serif font-bold text-nobleGold-700">부당 추가금 0원 보증제</span>
                <h3 className="text-2xl font-reverence font-black text-ink mt-1 group-hover:text-celadon-900 transition-colors">
                  정직 원가 정찰제 의전 패키지
                </h3>
                <p className="text-sm md:text-base text-ink-light mt-2.5 leading-relaxed">
                  무빈소(120만), 실속형(250만), 표준형(350만) 등 수의와 관, 인력의 원가를 100% 투명하게 공개하며 촌지를 금지합니다.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-ink-border/50 flex items-center justify-between text-celadon-800 font-reverence font-bold text-base md:text-lg">
                <span>정찰제 패키지 명세 보기</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* 4. 생애기록관 카드 (사진 포함) */}
          <div
            onClick={() => onSelectTab('life-archive')}
            className="rounded-3xl bg-porcelain border-2 border-ink-border hover:border-celadon-700 hover:shadow-xl transition-all cursor-pointer group overflow-hidden flex flex-col justify-between"
          >
            <div className="relative h-48 sm:h-52 overflow-hidden bg-gray-100">
              <img
                src="/images/life-archive.jpg"
                alt="소중한 삶의 기억과 훈장, 옛 사진"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-mourning-950/80 backdrop-blur-md text-nobleGold-100 px-3 py-1 rounded-full text-xs font-serif font-bold border border-nobleGold-500/30">
                사전 기억 봉안소
              </div>
            </div>

            <div className="p-6 md:p-7 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-xs font-serif font-bold text-celadon-800">사후 승계 게이트키퍼 가동</span>
                <h3 className="text-2xl font-reverence font-black text-ink mt-1 group-hover:text-celadon-900 transition-colors">
                  생애기록관 (Pre-mortem 일상 봉안)
                </h3>
                <p className="text-sm md:text-base text-ink-light mt-2.5 leading-relaxed">
                  일기, 상장, 가족 흑백 사진, 육성 회고록 등 평생의 고귀한 흔적을 정갈하게 보존하고, 사후에만 유족에게 전합니다.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-ink-border/50 flex items-center justify-between text-celadon-800 font-reverence font-bold text-base md:text-lg">
                <span>생애기록관 보존 플랜 보기</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 하단 배웅 4대 의전 안심 헌장 */}
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
