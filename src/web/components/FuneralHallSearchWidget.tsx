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
    <div className="bg-porcelain rounded-3xl shadow-sm border border-ink-border p-6 md:p-10 space-y-8">
      {/* 1. 상단 사진 비주얼 헤더 배너 */}
      <div className="relative rounded-2xl overflow-hidden h-44 sm:h-56 border border-ink-border k-corner-bracket">
        <img
          src="/images/memorial-altar.jpg"
          alt="정갈한 장례식장 제단 꽃장식"
          className="w-full h-full object-cover object-center filter brightness-[0.55]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-mourning-950 via-mourning-950/40 to-transparent flex flex-col justify-end p-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-celadon-500/20 text-celadon-200 text-xs font-serif font-bold mb-2 border border-celadon-600/30 w-fit">
            <TraditionalSeal sealKey="peace" size="sm" />
            <span>전국 1,080개 등록 장례식장 전수 데이터 연계</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-reverence font-black text-white tracking-tight flex items-center space-x-2">
            <span>전국 장례식장 시설 정보 및 빈소 감면 안내</span>
            <TraditionalSeal sealKey="peace" size="md" />
          </h2>
          <p className="text-gray-200 text-xs sm:text-sm font-serif mt-1">
            거주지 인근 장례식장의 분향실·안치실 규모를 파악하고, 배웅 제휴 빈소 임대료 최대 30% 감면 혜택을 확인하세요.
          </p>
        </div>
      </div>

      {/* 2. 전국 17개 시도별 퀵 통계 칩 바 */}
      <div className="bg-hanji rounded-2xl p-4 border border-ink-border">
        <div className="text-xs font-serif font-bold text-ink-muted mb-2.5">
          전국 17개 광역시·도 장사 인프라 분포 (총 1,080개소)
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedRegion('all')}
            className={`px-3.5 py-2 rounded-xl font-bold shrink-0 transition-all ${
              selectedRegion === 'all'
                ? 'bg-celadon-700 text-white shadow-sm'
                : 'bg-porcelain text-ink-light hover:bg-white border border-ink-border'
            }`}
          >
            전국 전체 (1,080곳)
          </button>
          {stats.map((s) => (
            <button
              key={s.region}
              onClick={() => setSelectedRegion(s.region)}
              className={`px-3.5 py-2 rounded-xl font-bold shrink-0 transition-all ${
                selectedRegion === s.region
                  ? 'bg-celadon-700 text-white shadow-sm'
                  : 'bg-porcelain text-ink-light hover:bg-white border border-ink-border'
              }`}
            >
              {s.region} ({s.registeredCount})
            </button>
          ))}
        </div>
      </div>

      {/* 3. 검색 및 필터 컨트롤러 */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
        {/* 키워드 검색 */}
        <div className="md:col-span-6 relative">
          <Search className="w-5 h-5 text-ink-muted absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="장례식장 명칭 또는 지역(동/구/시)을 입력하세요..."
            className="w-full bg-hanji border border-ink-border rounded-2xl pl-12 pr-4 py-4 text-base text-ink placeholder-ink-muted focus:outline-none focus:border-celadon-700"
          />
        </div>

        {/* 운영 주체 분류 필터 */}
        <div className="md:col-span-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-hanji border border-ink-border rounded-2xl px-4 py-4 text-sm font-bold text-ink focus:outline-none focus:border-celadon-700"
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
            className={`w-full py-4 px-4 rounded-2xl font-bold text-sm flex items-center justify-center space-x-2 border transition-all ${
              onlyPartner
                ? 'bg-celadon-700 text-white border-celadon-700 shadow-sm'
                : 'bg-hanji text-ink-light border-ink-border hover:bg-porcelain'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-nobleGold-500" />
            <span>배웅 제휴 감면 식장만 보기</span>
          </button>
        </div>
      </div>

      {/* 4. 장례식장 카드 리스트 (검색 결과) */}
      <div className="space-y-3">
        <div className="text-xs font-serif font-bold text-ink-muted">
          조회된 장례식장 ({halls.length}개소)
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[480px] overflow-y-auto pr-1">
          {halls.map((hall) => {
            const isSelected = selectedHall?.id === hall.id;
            return (
              <div
                key={hall.id}
                onClick={() => setSelectedHall(hall)}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer text-left ${
                  isSelected
                    ? 'border-celadon-700 bg-celadon-50/50 shadow-md ring-2 ring-celadon-700/20'
                    : 'border-ink-border hover:border-ink-muted/50 bg-porcelain'
                }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="text-[11px] font-serif font-bold text-ink-muted bg-hanji px-2 py-0.5 rounded border border-ink-border/60">
                      {getCategoryLabel(hall.category)}
                    </span>
                    <h4 className="font-reverence font-bold text-lg text-ink mt-1.5">{hall.name}</h4>
                  </div>
                  {hall.isBaeungPartner && (
                    <span className="shrink-0 text-xs font-serif font-bold bg-celadon-100 text-celadon-800 px-2.5 py-1 rounded-full border border-celadon-600/20">
                      임대료 {Math.round(hall.discountRate * 100)}% 감면
                    </span>
                  )}
                </div>

                <div className="text-xs text-ink-muted mt-2.5 flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-nobleGold-500" />
                  <span className="truncate">{hall.address}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-ink-border/50 text-xs">
                  <div>
                    <span className="text-ink-muted">빈소 / 안치: </span>
                    <span className="font-bold text-ink">{hall.roomCount}실 / {hall.capacityCount}구</span>
                  </div>
                  <div className="text-right">
                    <span className="text-ink-muted">1일 추정: </span>
                    <span className="font-reverence font-bold text-ink">{hall.dailyRentEstimate.toLocaleString()}원</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. 선택된 식장 상세 및 배웅 할인 견적 팝업/카드 */}
      {selectedHall && discountInfo && (
        <div className="bg-gradient-to-br from-celadon-900 to-mourning-900 text-white rounded-3xl p-6 md:p-8 shadow-xl space-y-5 border border-nobleGold-500/30">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-serif font-bold text-nobleGold-100">
                선택하신 장례식장 예우 및 빈소 감면 견적
              </span>
              <h3 className="text-2xl md:text-3xl font-reverence font-black mt-1 text-white">
                {selectedHall.name}
              </h3>
              <p className="text-xs text-gray-300 mt-1">{selectedHall.address} (대표: {selectedHall.phone})</p>
            </div>
            <button
              onClick={() => setSelectedHall(null)}
              className="text-xs bg-white/10 hover:bg-white/20 text-gray-300 px-3.5 py-1.5 rounded-full"
            >
              닫기 ✕
            </button>
          </div>

          <div className="bg-white/5 rounded-2xl p-5 border border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xs text-gray-400">일반 2일(48시간) 빈소 임대료</div>
              <div className="text-lg font-reverence font-bold mt-1 text-gray-200">
                {discountInfo.standardTotalRent.toLocaleString()}원
              </div>
            </div>
            <div className="border-t sm:border-t-0 sm:border-x border-white/10 pt-3 sm:pt-0">
              <div className="text-xs text-nobleGold-100 font-serif font-bold">
                배웅 제휴 감면 혜택 ({discountInfo.discountRatePercentage}%)
              </div>
              <div className="text-xl font-reverence font-black text-nobleGold-100 mt-1">
                -{discountInfo.discountAmount.toLocaleString()}원
              </div>
            </div>
            <div className="border-t sm:border-t-0 border-white/10 pt-3 sm:pt-0">
              <div className="text-xs text-celadon-200 font-bold">배웅 회원 최종 부담 임대료</div>
              <div className="text-2xl font-reverence font-black text-celadon-200 mt-1">
                {discountInfo.discountedTotalRent.toLocaleString()}원
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
            <div className="text-xs text-gray-300 leading-relaxed">
              * 조문객 수와 평형에 따라 실제 임대료는 변동될 수 있으며, 배웅 사전 등록 시 빈소 우선 확보 및 감면 조율이 정중히 지원됩니다.
            </div>
            <a
              href={`tel:${selectedHall.phone}`}
              className="btn-senior-reverence bg-nobleGold-500 hover:bg-nobleGold-600 text-gray-950 px-6 font-black text-base flex items-center space-x-2 shrink-0 rounded-2xl shadow-lg"
            >
              <Phone className="w-5 h-5" />
              <span>장례식장 직통 문의</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
