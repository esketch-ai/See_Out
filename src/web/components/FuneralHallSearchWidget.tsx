import React, { useState, useMemo } from 'react';
import {
  FuneralHallService,
  FuneralHallEntity,
  RegionCode,
  FuneralHallCategory
} from '../../funeral-halls/index.js';
import { Building2, Search, MapPin, Phone, ShieldCheck, Check, Sparkles, Filter } from 'lucide-react';

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
    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 md:p-8 space-y-6">
      {/* 헤더 */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>전국 1,080개 등록 장례식장 전수 데이터 연계</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
          전국 장례식장 시설비 & 배웅 제휴 할인 검색
        </h2>
        <p className="text-gray-600 mt-1.5 text-base">
          거주지 인근 장례식장의 분향실·안치실 규모와 배웅 단독 **빈소 임대료 최대 30% 감면 혜택**을 확인하세요.
        </p>
      </div>

      {/* 전국 시도별 퀵 통계 칩 바 */}
      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
        <div className="text-xs font-bold text-gray-500 mb-2">전국 17개 시·도 인프라 분포 (총 1,080개소)</div>
        <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedRegion('all')}
            className={`px-3 py-1.5 rounded-full font-bold shrink-0 transition-all ${
              selectedRegion === 'all' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            전국 전체 (1,080곳)
          </button>
          {stats.map((s) => (
            <button
              key={s.region}
              onClick={() => setSelectedRegion(s.region)}
              className={`px-3 py-1.5 rounded-full font-bold shrink-0 transition-all ${
                selectedRegion === s.region
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {s.region} ({s.registeredCount})
            </button>
          ))}
        </div>
      </div>

      {/* 검색 및 필터 컨트롤러 */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* 키워드 검색 */}
        <div className="md:col-span-6 relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="장례식장 이름 또는 지역(동/구/시) 검색..."
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-4 py-3.5 text-base focus:outline-none focus:border-emerald-600"
          />
        </div>

        {/* 운영 주체 분류 필터 */}
        <div className="md:col-span-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-sm font-semibold text-gray-700 focus:outline-none focus:border-emerald-600"
          >
            <option value="all">전체 운영 주체</option>
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
            className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm flex items-center justify-center space-x-2 border transition-all ${
              onlyPartner
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>배웅 제휴 할인만 보기</span>
          </button>
        </div>
      </div>

      {/* 장례식장 카드 리스트 (검색 결과) */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-gray-500">
          검색된 장례식장 ({halls.length}개소)
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[460px] overflow-y-auto pr-1">
          {halls.map((hall) => {
            const isSelected = selectedHall?.id === hall.id;
            return (
              <div
                key={hall.id}
                onClick={() => setSelectedHall(hall)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer text-left ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-md ring-2 ring-emerald-600/20'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="text-[11px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                      {getCategoryLabel(hall.category)}
                    </span>
                    <h4 className="font-extrabold text-base text-gray-900 mt-1">{hall.name}</h4>
                  </div>
                  {hall.isBaeungPartner && (
                    <span className="shrink-0 text-xs font-extrabold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                      임대료 {Math.round(hall.discountRate * 100)}% 할인
                    </span>
                  )}
                </div>

                <div className="text-xs text-gray-500 mt-2 flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                  <span className="truncate">{hall.address}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-gray-100 text-xs">
                  <div>
                    <span className="text-gray-400">빈소 / 안치: </span>
                    <span className="font-bold text-gray-800">{hall.roomCount}실 / {hall.capacityCount}구</span>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-400">1일 추정: </span>
                    <span className="font-extrabold text-gray-900">{hall.dailyRentEstimate.toLocaleString()}원</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 선택된 식장 상세 및 배웅 할인 견적 팝업/카드 */}
      {selectedHall && discountInfo && (
        <div className="bg-emerald-950 text-white rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-bold text-emerald-400">선택된 장례식장 견적 시뮬레이션</span>
              <h3 className="text-2xl font-black mt-1">{selectedHall.name}</h3>
              <p className="text-xs text-emerald-200/80 mt-0.5">{selectedHall.address} ({selectedHall.phone})</p>
            </div>
            <button
              onClick={() => setSelectedHall(null)}
              className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-full"
            >
              닫기 ✕
            </button>
          </div>

          <div className="bg-emerald-900/60 rounded-2xl p-4 border border-emerald-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-xs text-emerald-300">정상 2일(48시간) 임대료</div>
              <div className="text-lg font-bold mt-1">{discountInfo.standardTotalRent.toLocaleString()}원</div>
            </div>
            <div className="border-t sm:border-t-0 sm:border-x border-emerald-800 pt-2 sm:pt-0">
              <div className="text-xs text-yellow-300 font-bold">배웅 제휴 감면액 ({discountInfo.discountRatePercentage}%)</div>
              <div className="text-lg font-black text-yellow-400 mt-1">
                -{discountInfo.discountAmount.toLocaleString()}원
              </div>
            </div>
            <div className="border-t sm:border-t-0 border-emerald-800 pt-2 sm:pt-0">
              <div className="text-xs text-emerald-300 font-bold">배웅 회원 최종 부담 임대료</div>
              <div className="text-xl font-black text-emerald-300 mt-1">
                {discountInfo.discountedTotalRent.toLocaleString()}원
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <div className="text-xs text-emerald-300">
              ℹ️ 빈소 평형에 따라 단가가 상이할 수 있으며, 배웅 사전 등록 시 100% 우선 배정 및 감면이 적용됩니다.
            </div>
            <a
              href={`tel:${selectedHall.phone}`}
              className="btn-senior bg-emerald-500 hover:bg-emerald-400 text-gray-950 px-6 font-black text-sm flex items-center space-x-2 shrink-0 rounded-xl"
            >
              <Phone className="w-4 h-4" />
              <span>식장 직통 문의</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
