import React, { useState } from 'react';
import { ShieldCheck, ChevronDown, Check, Info } from 'lucide-react';
import { BAEUNG_PACKAGES, BaeungPackageType } from '../../quote-diagnostics/index.js';

export const PackagePricingWidget: React.FC = () => {
  const [selectedPackage, setSelectedPackage] = useState<BaeungPackageType>('economic_3day');
  const [openDetail, setOpenDetail] = useState<boolean>(true);

  const packages = Object.values(BAEUNG_PACKAGES);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 md:p-8 space-y-6">
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>선금 0원 / 후불 정산제</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
          배웅 투명 원가 정찰제 패키지
        </h2>
        <p className="text-gray-600 mt-1.5 text-base">
          중간 유통 거품과 현장 강매를 100% 제거한 정찰 가격입니다. 장례 완료 후 후불 정산됩니다.
        </p>
      </div>

      {/* 패키지 선택 탭 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {packages.map((pkg) => (
          <button
            key={pkg.type}
            onClick={() => setSelectedPackage(pkg.type)}
            className={`p-5 rounded-2xl text-left border-2 transition-all ${
              selectedPackage === pkg.type
                ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600/20'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-sm font-bold text-emerald-800">{pkg.name}</div>
            <div className="text-2xl font-black text-gray-900 mt-1">
              {pkg.price.toLocaleString()}원
            </div>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">{pkg.description}</p>
          </button>
        ))}
      </div>

      {/* 원가 상세 투명 공개 (아코디언) */}
      <div className="border border-gray-200 rounded-2xl overflow-hidden">
        <button
          onClick={() => setOpenDetail(!openDetail)}
          className="w-full bg-gray-50 p-4 flex items-center justify-between font-bold text-gray-800 hover:bg-gray-100"
        >
          <div className="flex items-center space-x-2">
            <Info className="w-4 h-4 text-emerald-600" />
            <span>선택한 패키지 원가 상세 명세 및 4대 안심 보증</span>
          </div>
          <ChevronDown className={`w-4 h-4 transition-transform ${openDetail ? 'rotate-180' : ''}`} />
        </button>

        {openDetail && (
          <div className="p-5 bg-white space-y-4 text-sm divide-y divide-gray-100">
            <div className="flex justify-between items-center pt-2">
              <span className="font-semibold text-gray-700">수의 및 입관 용품</span>
              <span className="text-gray-900 font-bold">오동나무 규격관 / 대마 100% 특등 수의 (원산지 전면 표기)</span>
            </div>
            <div className="flex justify-between items-center pt-3">
              <span className="font-semibold text-gray-700">전문 인력 지원</span>
              <span className="text-gray-900 font-bold">국가공인 1급 장례지도사 1명 전담 배정 (정액 수임료)</span>
            </div>
            <div className="flex justify-between items-center pt-3">
              <span className="font-semibold text-gray-700">의전 도우미</span>
              <span className="text-gray-900 font-bold">표준 시급제 준수 (수고비/촌지 일체 요구 금지)</span>
            </div>
            <div className="flex justify-between items-center pt-3">
              <span className="font-semibold text-gray-700">운구 및 이동 차량</span>
              <span className="text-gray-900 font-bold">사전 정찰 요금제 (이동 경로 최적화 안내)</span>
            </div>
            <div className="flex justify-between items-center pt-3 bg-emerald-50/50 -mx-5 px-5 py-3 rounded-b-xl">
              <span className="font-bold text-emerald-900">현장 추가금 보증제</span>
              <span className="font-extrabold text-emerald-700">부당 추가금 요구 시 100% 즉시 환불</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
