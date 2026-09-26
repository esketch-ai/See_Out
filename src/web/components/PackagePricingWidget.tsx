import React, { useState } from 'react';
import { ChevronDown, Info, ShieldCheck } from 'lucide-react';
import { BAEUNG_PACKAGES, BaeungPackageType } from '../../quote-diagnostics/index.js';

export const PackagePricingWidget: React.FC = () => {
  const [selectedPackage, setSelectedPackage] = useState<BaeungPackageType>('economic_3day');
  const [openDetail, setOpenDetail] = useState<boolean>(true);

  const packages = Object.values(BAEUNG_PACKAGES);

  return (
    <div className="bg-porcelain rounded-3xl shadow-sm border border-ink-border p-6 md:p-10 space-y-8">
      {/* 헤더 */}
      <div className="border-b border-ink-border pb-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-nobleGold-100 text-nobleGold-700 text-xs font-serif font-bold mb-3 border border-nobleGold-500/20">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>선금 0원 · 100% 후불 정산제</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-reverence font-black text-ink tracking-tight">
          배웅 정직 원가 정찰제 의전 안내
        </h2>
        <p className="text-ink-light mt-2 text-base md:text-lg leading-relaxed">
          유족의 슬픔과 경황없음을 틈탄 어떠한 업셀링이나 강매도 없습니다. 의전의 품격을 지키며 원가를 투명하게 공개합니다.
        </p>
      </div>

      {/* 3대 패키지 선택 탭 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {packages.map((pkg) => (
          <button
            key={pkg.type}
            onClick={() => setSelectedPackage(pkg.type)}
            className={`p-6 rounded-2xl text-left border-2 transition-all ${
              selectedPackage === pkg.type
                ? 'border-celadon-700 bg-celadon-50/60 ring-2 ring-celadon-700/20 shadow-md'
                : 'border-ink-border hover:border-ink-muted/50 bg-hanji/40'
            }`}
          >
            <div className="text-sm font-serif font-bold text-celadon-800">{pkg.name}</div>
            <div className="text-2xl md:text-3xl font-reverence font-black text-ink mt-2">
              {pkg.price.toLocaleString()}원
            </div>
            <p className="text-xs text-ink-muted mt-2.5 leading-relaxed">{pkg.description}</p>
          </button>
        ))}
      </div>

      {/* 원가 상세 투명 공개 아코디언 */}
      <div className="border border-ink-border rounded-2xl overflow-hidden bg-hanji/30">
        <button
          onClick={() => setOpenDetail(!openDetail)}
          className="w-full bg-hanji/80 p-5 flex items-center justify-between font-reverence font-bold text-ink text-base md:text-lg hover:bg-hanji transition-colors"
        >
          <div className="flex items-center space-x-2.5">
            <Info className="w-5 h-5 text-nobleGold-500" />
            <span>선택하신 의전 패키지 원가 명세 및 4대 안심 보증 헌장</span>
          </div>
          <ChevronDown className={`w-5 h-5 text-ink-muted transition-transform ${openDetail ? 'rotate-180' : ''}`} />
        </button>

        {openDetail && (
          <div className="p-6 bg-porcelain space-y-4 text-sm md:text-base divide-y divide-ink-border/50">
            <div className="flex justify-between items-center pt-2">
              <span className="font-bold text-ink-light">수의 및 입관 용품</span>
              <span className="font-reverence font-bold text-ink">
                오동나무 1.5치 규격관 / 대마 100% 특등 수의 (원산지 100% 완전 표기)
              </span>
            </div>
            <div className="flex justify-between items-center pt-4">
              <span className="font-bold text-ink-light">전문 인력 예우</span>
              <span className="font-reverence font-bold text-ink">
                국가공인 1급 장례지도사 1명 전담 배정 (정액 수임료 원칙)
              </span>
            </div>
            <div className="flex justify-between items-center pt-4">
              <span className="font-bold text-ink-light">의전 도우미</span>
              <span className="font-reverence font-bold text-ink">
                표준 시급제 준수 (수고비 · 촌지 일체 요구 금지 / 발생 시 전액 환불)
              </span>
            </div>
            <div className="flex justify-between items-center pt-4">
              <span className="font-bold text-ink-light">운구 및 이동 차량</span>
              <span className="font-reverence font-bold text-ink">
                사전 정찰 요금제 (이송 최적 경로 안내 및 부당 초과 운임 차단)
              </span>
            </div>
            <div className="flex justify-between items-center pt-4 bg-celadon-50/70 -mx-6 px-6 py-4 rounded-b-xl border-t border-celadon-200">
              <span className="font-serif font-bold text-celadon-900">현장 추가금 안심 보증</span>
              <span className="font-reverence font-black text-celadon-800">
                약정 외 부당 추가금 발생 시 100% 즉시 환불
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
