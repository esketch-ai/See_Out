import React from 'react';
import { AlertTriangle, ArrowRight, ShieldCheck, HeartHandshake, PhoneCall } from 'lucide-react';
import { QuoteDiagnosticsWidget } from './QuoteDiagnosticsWidget.js';
import { LifeArchiveWidget } from './LifeArchiveWidget.js';
import { PackagePricingWidget } from './PackagePricingWidget.js';

export const NormalMode: React.FC<{ onEnterEmergency: () => void }> = ({ onEnterEmergency }) => {
  return (
    <div className="space-y-10 pb-20">
      {/* 긴급 핫라인 CTA 배너 (임종 대비 연결) */}
      <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white rounded-3xl p-5 md:p-6 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center shrink-0">
            <AlertTriangle className="w-7 h-7 text-yellow-300 animate-pulse" />
          </div>
          <div>
            <div className="text-xs font-bold text-red-100 uppercase tracking-wider">
              24시 전국 긴급 출동 핫라인
            </div>
            <div className="text-xl md:text-2xl font-black">
              지금 임종하셨나요? 2시간 내 현장 도착
            </div>
          </div>
        </div>

        <button
          onClick={onEnterEmergency}
          className="btn-senior bg-white hover:bg-red-50 text-red-600 px-6 flex items-center justify-center space-x-2 shrink-0 shadow-lg text-lg font-black transition-transform active:scale-95"
        >
          <span>🚨 1초 긴급 출동 요청</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* 1. 상조 견적 진단기 (트랙 1 엔진 연동) */}
      <section>
        <QuoteDiagnosticsWidget />
      </section>

      {/* 2. 생애기록관 (Pre-mortem 아카이빙) */}
      <section>
        <LifeArchiveWidget />
      </section>

      {/* 3. 정찰제 패키지 & 원가 공개 */}
      <section>
        <PackagePricingWidget />
      </section>

      {/* 4. 하단 안심 보증 스티커 배너 */}
      <div className="bg-emerald-900 text-white rounded-3xl p-6 md:p-8 text-center space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-800 text-emerald-200 text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>배웅 4대 안심 보증 헌장</span>
        </div>
        <h3 className="text-2xl md:text-3xl font-black">
          선금 0원 · 현장 추가금 0원 · 촌지 전면 금지 · 후불 정산
        </h3>
        <p className="text-emerald-200 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
          유족의 슬픔과 경황없음을 이용한 어떠한 부당 이득도 배웅에서는 발생하지 않습니다.
          모든 의전과 시설비는 100% 투명하게 공개됩니다.
        </p>
      </div>
    </div>
  );
};
