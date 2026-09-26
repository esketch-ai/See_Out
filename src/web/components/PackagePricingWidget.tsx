import React, { useState } from 'react';
import { ChevronDown, Info, ShieldCheck, Sparkles } from 'lucide-react';
import { BAEUNG_PACKAGES, BaeungPackageType } from '../../quote-diagnostics/index.js';
import { TraditionalSeal } from '../design-system/index.js';

export const PackagePricingWidget: React.FC = () => {
  const [selectedPackage, setSelectedPackage] = useState<BaeungPackageType>('economic_3day');
  const [openDetail, setOpenDetail] = useState<boolean>(true);

  const packages = Object.values(BAEUNG_PACKAGES);

  return (
    <div className="bg-[#FFFFFF] rounded-xl shadow-xs border border-[#E3DFD5] p-6 md:p-8 space-y-6">
      {/* 1. 상단 사진 비주얼 헤더 배너 */}
      <div className="relative rounded-lg overflow-hidden h-44 sm:h-52 border border-[#2D2A26] bg-[#121417]">
        <img
          src="/images/hero-memorial.jpg"
          alt="정직 원가 의전 용품 및 제단"
          className="w-full h-full object-cover object-center filter brightness-[0.4] contrast-105"
        />
        {/* 삼국·조선 길상 구름문 은은한 오버레이 */}
        <div className="absolute inset-0 pointer-events-none k-pattern-unmun-dark opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0E10] via-[#0D0E10]/50 to-transparent flex flex-col justify-end p-6 relative z-10">
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded bg-[#19382C]/90 text-[#FAF9F6] text-xs font-serif mb-2 border border-[#2A5442] w-fit">
            <TraditionalSeal sealKey="sincerity" size="sm" />
            <span>선금 0원 · 100% 후불 정산제</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-reverence font-black text-[#FAF9F6] tracking-tight">
            배웅 정직 원가 정찰제 의전 안내
          </h2>
          <p className="text-[#D4CEC2] text-xs sm:text-sm font-serif mt-1">
            유족의 슬픔과 경황없음을 틈탄 어떠한 업셀링이나 강매도 없습니다. 의전의 품격을 지키며 원가를 투명하게 공개합니다.
          </p>
        </div>
      </div>

      {/* 2. 3대 패키지 선택 탭 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {packages.map((pkg) => {
          const isSelected = selectedPackage === pkg.type;
          return (
            <button
              key={pkg.type}
              onClick={() => setSelectedPackage(pkg.type)}
              className={`p-5 rounded-lg text-left border transition-all cursor-pointer ${
                isSelected
                  ? 'border-[#9E7D47] bg-[#F8F5EE] ring-1 ring-[#9E7D47] shadow-xs'
                  : 'border-[#E3DFD5] hover:border-[#9E7D47]/60 bg-[#FAF9F6]'
              }`}
            >
              <div className="text-xs font-serif font-bold text-[#876937]">{pkg.name}</div>
              <div className="text-2xl md:text-3xl font-serif font-black text-[#151719] mt-1.5">
                {pkg.price.toLocaleString()}원
              </div>
              <p className="text-xs text-[#727782] mt-2 leading-relaxed font-serif">{pkg.description}</p>
            </button>
          );
        })}
      </div>

      {/* 3. 원가 상세 투명 공개 아코디언 */}
      <div className="border border-[#E3DFD5] rounded-lg overflow-hidden bg-[#FAF9F6]">
        <button
          onClick={() => setOpenDetail(!openDetail)}
          className="w-full bg-[#FAF9F6] p-4 flex items-center justify-between font-serif font-bold text-[#151719] text-base hover:bg-[#F2EEE6] transition-colors cursor-pointer border-b border-[#E3DFD5]"
        >
          <div className="flex items-center space-x-2">
            <Info className="w-4 h-4 text-[#9E7D47]" />
            <span>선택하신 의전 패키지 원가 명세 및 4대 안심 보증 헌장</span>
          </div>
          <ChevronDown className={`w-4 h-4 text-[#727782] transition-transform ${openDetail ? 'rotate-180' : ''}`} />
        </button>

        {openDetail && (
          <div className="p-5 bg-[#FFFFFF] space-y-3.5 text-sm divide-y divide-[#ECE8E0] font-serif">
            <div className="flex justify-between items-center pt-1">
              <span className="font-bold text-[#42464E]">수의 및 입관 용품</span>
              <span className="font-medium text-[#151719]">
                오동나무 1.5치 규격관 / 대마 100% 특등 수의 (원산지 100% 완전 표기)
              </span>
            </div>
            <div className="flex justify-between items-center pt-3">
              <span className="font-bold text-[#42464E]">전문 인력 예우</span>
              <span className="font-medium text-[#151719]">
                국가공인 1급 장례지도사 1명 전담 배정 (정액 수임료 원칙)
              </span>
            </div>
            <div className="flex justify-between items-center pt-3">
              <span className="font-bold text-[#42464E]">의전 도우미</span>
              <span className="font-medium text-[#151719]">
                표준 시급제 준수 (수고비 · 촌지 일체 요구 금지 / 발생 시 전액 환불)
              </span>
            </div>
            <div className="flex justify-between items-center pt-3">
              <span className="font-bold text-[#42464E]">운구 및 이동 차량</span>
              <span className="font-medium text-[#151719]">
                사전 정찰 요금제 (이송 최적 경로 안내 및 부당 초과 운임 차단)
              </span>
            </div>
            <div className="flex justify-between items-center pt-3 bg-[#F0F5F2] -mx-5 px-5 py-3 rounded-b-lg border-t border-[#BFD4CA]">
              <span className="font-serif font-bold text-[#19382C]">현장 추가금 안심 보증</span>
              <span className="font-serif font-bold text-[#19382C]">
                약정 외 부당 추가금 발생 시 100% 즉시 환불
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
