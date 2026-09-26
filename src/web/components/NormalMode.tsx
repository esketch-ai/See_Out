import React from 'react';
import { ArrowRight, ShieldCheck, HeartHandshake, PhoneCall } from 'lucide-react';
import { QuoteDiagnosticsWidget } from './QuoteDiagnosticsWidget.js';
import { FuneralHallSearchWidget } from './FuneralHallSearchWidget.js';
import { LifeArchiveWidget } from './LifeArchiveWidget.js';
import { PackagePricingWidget } from './PackagePricingWidget.js';

export const NormalMode: React.FC<{ onEnterEmergency: () => void }> = ({ onEnterEmergency }) => {
  return (
    <div className="space-y-12 pb-24">
      {/* 긴급 의전 지원 배너 (정중하고 엄숙한 안내) */}
      <div className="bg-gradient-to-r from-mourning-900 via-mourning-800 to-mourning-900 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-crimson-600/30 border border-crimson-600/50 rounded-2xl flex items-center justify-center shrink-0">
            <span className="font-reverence text-2xl font-bold text-nobleGold-100">禮</span>
          </div>
          <div>
            <div className="text-xs font-serif font-bold text-nobleGold-100 uppercase tracking-widest">
              24시간 전국 긴급 의전 지원 핫라인
            </div>
            <div className="text-xl md:text-2xl font-reverence font-black mt-1 text-white">
              임종을 맞이하셨다면, 삼가 2시간 내 곁으로 달려가겠습니다
            </div>
            <p className="text-xs text-gray-400 mt-1">
              국가공인 장례지도사 전담 배정 · 이송 차량 즉시 출동 · 선금 0원 후불 정산
            </p>
          </div>
        </div>

        <button
          onClick={onEnterEmergency}
          className="btn-senior-reverence bg-crimson-600 hover:bg-crimson-700 active:scale-95 text-white px-8 flex items-center justify-center space-x-3 shrink-0 shadow-2xl transition-all cursor-pointer border border-crimson-600/40"
        >
          <span className="font-reverence font-bold text-lg md:text-xl">긴급 의전 출동 요청</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* 1. 상조 증서 정밀 예법 · 원가 진단표 */}
      <section>
        <QuoteDiagnosticsWidget />
      </section>

      {/* 2. 전국 장례식장 시설비 & 빈소 감면 안내 */}
      <section>
        <FuneralHallSearchWidget />
      </section>

      {/* 3. 생애기록관 (Pre-mortem 일상 아카이빙) */}
      <section>
        <LifeArchiveWidget />
      </section>

      {/* 4. 정찰제 패키지 & 원가 공개 */}
      <section>
        <PackagePricingWidget />
      </section>

      {/* 5. 하단 배웅 4대 안심 보증 헌장 */}
      <div className="bg-celadon-900 text-white rounded-3xl p-8 md:p-12 text-center space-y-5 border border-nobleGold-500/30 shadow-lg">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-celadon-800 text-nobleGold-100 text-xs font-serif font-bold border border-nobleGold-500/30">
          <ShieldCheck className="w-4 h-4 text-nobleGold-500" />
          <span>배웅 4대 의전 안심 헌장</span>
        </div>
        <h3 className="text-2xl md:text-4xl font-reverence font-black text-white tracking-tight">
          선금 0원 · 부당 추가금 0원 · 촌지 전면 금지 · 정직한 후불제
        </h3>
        <p className="text-celadon-100 text-base md:text-lg max-w-2xl mx-auto leading-relaxed pt-1">
          고인의 고귀한 생애를 기리는 숭고한 자리에 부당한 상술이 발붙이지 못하도록,
          모든 의전과 시설비는 1원 단위까지 맑고 정직하게 공개합니다.
        </p>
      </div>
    </div>
  );
};
