import React, { useState, useMemo } from 'react';
import {
  FuneralHallService,
  FuneralHallEntity,
  RegionCode,
  FuneralHallCategory
} from '../../funeral-halls/index.js';
import { Search, MapPin, Phone, ShieldCheck, Sparkles, Building2 } from 'lucide-react';
import { TraditionalSeal } from '../design-system/index.js';

export const FuneralHallSearchWidget: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlyPartner, setOnlyPartner] = useState(false);
  const [selectedHall, setSelectedHall] = useState<FuneralHallEntity | null>(null);

  // 검색 결과
  const halls = useMemo(() => {
    return FuneralHallService.searchHalls({
      keyword: keyword.trim() || undefined,
      region: selectedRegion === 'all' ? undefined : (selectedRegion as RegionCode),
      category: selectedCategory === 'all' ? undefined : (selectedCategory as FuneralHallCategory),
      onlyPartner: onlyPartner ? true : undefined
    });
  }, [keyword, selectedRegion, selectedCategory, onlyPartner]);

  // 선택된 식장의 배웅 할인 연산
  const discountInfo = useMemo(() => {
    if (!selectedHall) return null;
    return FuneralHallService.calculateBaeungDiscount(selectedHall.id, 2);
  }, [selectedHall]);

  const stats = FuneralHallService.getRegionalStats();

  const getCategoryLabel = (cat: FuneralHallCategory) => {
    switch (cat) {
      case 'TERTIARY_HOSPITAL':
        return '대학·상급종합병원 부설';
      case 'SPECIALIZED_INDEPENDENT':
        return '독립 전문 장례식장';
      case 'PUBLIC_MUNICIPAL':
        return '공설 및 지방의료원';
      case 'CARE_HOSPITAL':
        return '요양병원 부설';
    }
  };

  return (
    <div className="bg-[#FFFFFF] rounded-xl shadow-xs border border-[#E3DFD5] p-6 md:p-8 space-y-6">
      {/* 1. 상단 사진 비주얼 헤더 배너 */}
      <div className="relative rounded-lg overflow-hidden h-44 sm:h-52 border border-[#2D2A26] bg-[#121417]">
        <img
          src="/images/memorial-altar.jpg"
          alt="정갈한 장례식장 제단 꽃장식"
          className="w-full h-full object-cover object-center filter brightness-[0.4] contrast-105"
        />
        {/* 삼국·조선 길상 구름문 은은한 오버레이 */}
        <div className="absolute inset-0 pointer-events-none k-pattern-unmun-dark opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0E10] via-[#0D0E10]/50 to-transparent flex flex-col justify-end p-6 relative z-10">
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded bg-[#19382C]/90 text-[#FAF9F6] text-xs font-serif mb-2 border border-[#2A5442] w-fit">
            <TraditionalSeal sealKey="peace" size="sm" />
            <span>전국 1,080개 등록 장례식장 전수 데이터 연계</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-reverence font-black text-[#FAF9F6] tracking-tight">
            전국 장례식장 시설 정보 및 빈소 감면 안내
          </h2>
          <p className="text-[#D4CEC2] text-xs sm:text-sm font-serif mt-1">
            거주지 인근 장례식장의 분향실·안치실 규모를 파악하고, 배웅 제휴 빈소 임대료 최대 30% 감면 혜택을 확인하세요.
          </p>
        </div>
      </div>

      {/* 2. 전국 17개 시도별 퀵 통계 칩 바 */}
      <div className="bg-[#FAF9F6] rounded-lg p-4 border border-[#E3DFD5]">
        <div className="text-xs font-serif font-bold text-[#727782] mb-2">
          전국 17개 광역시·도 장사 인프라 분포 (총 1,080개소)
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedRegion('all')}
            className={`px-3 py-1.5 rounded-md font-serif font-medium shrink-0 transition-all cursor-pointer ${
              selectedRegion === 'all'
                ? 'bg-[#19382C] text-[#FAF9F6] border border-[#2D5A46]'
                : 'bg-[#FFFFFF] text-[#42464E] hover:bg-[#FAF9F6] border border-[#E3DFD5]'
            }`}
          >
            전국 전체 (1,080곳)
          </button>
          {stats.map((s) => (
            <button
              key={s.region}
              onClick={() => setSelectedRegion(s.region)}
              className={`px-3 py-1.5 rounded-md font-serif font-medium shrink-0 transition-all cursor-pointer ${
                selectedRegion === s.region
                  ? 'bg-[#19382C] text-[#FAF9F6] border border-[#2D5A46]'
                  : 'bg-[#FFFFFF] text-[#42464E] hover:bg-[#FAF9F6] border border-[#E3DFD5]'
              }`}
            >
              {s.region} ({s.registeredCount})
            </button>
          ))}
        </div>
      </div>

      {/* 3. 검색 및 필터 컨트롤러 */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* 키워드 검색 */}
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 text-[#727782] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="장례식장 명칭 또는 지역(동/구/시)을 입력하세요..."
            className="w-full bg-[#FAF9F6] border border-[#E3DFD5] rounded-md pl-10 pr-4 py-3 text-sm text-[#151719] placeholder-[#8C867B] focus:outline-none focus:border-[#9E7D47]"
          />
        </div>

        {/* 운영 주체 분류 필터 */}
        <div className="md:col-span-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-[#FAF9F6] border border-[#E3DFD5] rounded-md px-3.5 py-3 text-sm font-medium text-[#151719] focus:outline-none focus:border-[#9E7D47] font-serif"
          >
            <option value="all">전체 운영 형태</option>
            <option value="TERTIARY_HOSPITAL">대학·상급병원 부설</option>
            <option value="SPECIALIZED_INDEPENDENT">독립 전문장례식장</option>
            <option value="PUBLIC_MUNICIPAL">공설·지방의료원</option>
            <option value="CARE_HOSPITAL">요양병원 부설</option>
          </select>
        </div>

        {/* 배웅 제휴만 토글 */}
        <div className="md:col-span-3 flex items-center">
          <button
            onClick={() => setOnlyPartner(!onlyPartner)}
            className={`w-full py-3 px-3.5 rounded-md font-serif font-medium text-xs sm:text-sm flex items-center justify-center space-x-1.5 border transition-all cursor-pointer ${
              onlyPartner
                ? 'bg-[#19382C] text-[#FAF9F6] border-[#2D5A46]'
                : 'bg-[#FAF9F6] text-[#42464E] border-[#E3DFD5] hover:bg-[#FFFFFF]'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-[#9E7D47]" />
            <span>배웅 제휴 감면 식장만 보기</span>
          </button>
        </div>
      </div>

      {/* 4. 장례식장 카드 리스트 (검색 결과) */}
      <div className="space-y-3">
        <div className="text-xs font-serif font-bold text-[#727782]">
          조회된 장례식장 ({halls.length}개소)
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-[480px] overflow-y-auto pr-1">
          {halls.map((hall) => {
            const isSelected = selectedHall?.id === hall.id;
            return (
              <div
                key={hall.id}
                onClick={() => setSelectedHall(hall)}
                className={`p-4 rounded-lg border transition-all cursor-pointer text-left ${
                  isSelected
                    ? 'border-[#9E7D47] bg-[#F8F5EE] shadow-sm ring-1 ring-[#9E7D47]'
                    : 'border-[#E3DFD5] hover:border-[#9E7D47]/60 bg-[#FFFFFF]'
                }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="text-[10px] font-serif font-medium text-[#727782] bg-[#FAF9F6] px-1.5 py-0.5 rounded border border-[#E3DFD5]">
                      {getCategoryLabel(hall.category)}
                    </span>
                    <h4 className="font-reverence font-bold text-base text-[#151719] mt-1">{hall.name}</h4>
                  </div>
                  {hall.isBaeungPartner && (
                    <span className="shrink-0 text-xs font-serif font-bold bg-[#F0F5F2] text-[#19382C] px-2 py-0.5 rounded border border-[#BFD4CA]">
                      임대료 {Math.round(hall.discountRate * 100)}% 감면
                    </span>
                  )}
                </div>

                <div className="text-xs text-[#727782] mt-2 flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-[#9E7D47]" />
                  <span className="truncate">{hall.address}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-[#ECE8E0] text-xs">
                  <div>
                    <span className="text-[#727782]">빈소 / 안치: </span>
                    <span className="font-bold text-[#151719]">{hall.roomCount}실 / {hall.capacityCount}구</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[#727782]">1일 추정: </span>
                    <span className="font-serif font-bold text-[#151719]">{hall.dailyRentEstimate.toLocaleString()}원</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. 선택된 식장 상세 및 배웅 할인 견적 카드 */}
      {selectedHall && discountInfo && (
        <div className="bg-[#132B22] text-[#FAF9F6] rounded-xl p-6 md:p-8 shadow-md space-y-5 border border-[#2D5A46]">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-serif text-[#C2A26A]">
                선택하신 장례식장 예우 및 빈소 감면 견적
              </span>
              <h3 className="text-xl md:text-2xl font-reverence font-black mt-1 text-[#FAF9F6]">
                {selectedHall.name}
              </h3>
              <p className="text-xs text-[#BFD4CA] mt-1 font-serif">{selectedHall.address} (대표: {selectedHall.phone})</p>
            </div>
            <button
              onClick={() => setSelectedHall(null)}
              className="text-xs bg-white/10 hover:bg-white/20 text-[#FAF9F6] px-3 py-1 rounded cursor-pointer font-serif"
            >
              닫기 ✕
            </button>
          </div>

          <div className="bg-[#0E1E18] rounded-lg p-5 border border-[#2A5442] grid grid-cols-1 sm:grid-cols-3 gap-4 text-center font-serif">
            <div>
              <div className="text-xs text-[#8C9E96]">일반 2일(48시간) 빈소 임대료</div>
              <div className="text-base font-bold mt-1 text-[#DCE8E2]">
                {discountInfo.standardTotalRent.toLocaleString()}원
              </div>
            </div>
            <div className="border-t sm:border-t-0 sm:border-x border-[#2A5442] pt-3 sm:pt-0">
              <div className="text-xs text-[#C2A26A] font-bold">
                배웅 제휴 감면 ({discountInfo.discountRatePercentage}%)
              </div>
              <div className="text-lg font-bold text-[#C2A26A] mt-1">
                -{discountInfo.discountAmount.toLocaleString()}원
              </div>
            </div>
            <div className="border-t sm:border-t-0 border-[#2A5442] pt-3 sm:pt-0">
              <div className="text-xs text-[#FAF9F6] font-bold">배웅 회원 최종 부담 임대료</div>
              <div className="text-xl font-bold text-[#FAF9F6] mt-1">
                {discountInfo.discountedTotalRent.toLocaleString()}원
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1 font-serif">
            <div className="text-xs text-[#A2B8AF] leading-relaxed">
              * 조문객 수와 평형에 따라 실제 임대료는 변동될 수 있으며, 배웅 사전 등록 시 빈소 우선 확보 및 감면 조율이 정중히 지원됩니다.
            </div>
            <a
              href={`tel:${selectedHall.phone}`}
              className="px-5 py-2.5 bg-[#9E7D47] hover:bg-[#B38E52] text-[#0D0E10] font-black text-sm flex items-center space-x-2 shrink-0 rounded-md shadow-sm"
            >
              <Phone className="w-4 h-4" />
              <span>장례식장 직통 문의</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
