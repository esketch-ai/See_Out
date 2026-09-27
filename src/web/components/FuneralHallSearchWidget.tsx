import React, { useState, useMemo, useEffect } from 'react';
import {
  FuneralHallService,
  FuneralHallEntity,
  RegionCode,
  FuneralHallCategory
} from '../../funeral-halls/index.js';
import {
  Search,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Building2,
  Copy,
  Check,
  Car,
  Train,
  Clock,
  ExternalLink,
  Flame,
  ArrowRight,
  Layers,
  ChevronRight,
  X
} from 'lucide-react';
import { TraditionalSeal } from '../design-system/index.js';
import { FuneralHallMap } from './FuneralHallMap.js';

export interface FuneralHallSearchWidgetProps {
  selectedFuneralHallId?: string;
  onSelectHallForFuneral?: (hall: FuneralHallEntity) => void;
  onNavigateToLifeArchive?: () => void;
}

export const FuneralHallSearchWidget: React.FC<FuneralHallSearchWidgetProps> = ({
  selectedFuneralHallId,
  onSelectHallForFuneral,
  onNavigateToLifeArchive
}) => {
  const [keyword, setKeyword] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlyPartner, setOnlyPartner] = useState(false);
  const [selectedHall, setSelectedHall] = useState<FuneralHallEntity | null>(null);
  const [stayDays, setStayDays] = useState<2 | 3>(2);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [isSynced, setIsSynced] = useState(false);
  const [mobileViewTab, setMobileViewTab] = useState<'list' | 'map' | 'detail'>('list');

  // 검색 결과
  const halls = useMemo(() => {
    return FuneralHallService.searchHalls({
      keyword: keyword.trim() || undefined,
      region: selectedRegion === 'all' ? undefined : (selectedRegion as RegionCode),
      category: selectedCategory === 'all' ? undefined : (selectedCategory as FuneralHallCategory),
      onlyPartner: onlyPartner ? true : undefined
    });
  }, [keyword, selectedRegion, selectedCategory, onlyPartner]);

  // 최초 로드 시 또는 검색 결과 변경 시 첫 번째 식장 자동 선택
  useEffect(() => {
    if (halls.length > 0) {
      // 기존 선택된 식장이 현재 결과에 없으면 첫 번째 식장 선택
      if (!selectedHall || !halls.some((h) => h.id === selectedHall.id)) {
        setSelectedHall(halls[0]);
      }
    } else {
      setSelectedHall(null);
    }
  }, [halls]);

  // 선택된 식장의 배웅 할인 연산 (2일장 vs 3일장)
  const discountInfo = useMemo(() => {
    if (!selectedHall) return null;
    return FuneralHallService.calculateBaeungDiscount(selectedHall.id, stayDays);
  }, [selectedHall, stayDays]);

  const stats = FuneralHallService.getRegionalStats();

  const handleCopyAddress = (addr: string) => {
    navigator.clipboard?.writeText(addr);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleSelectHallWithMobile = (hall: FuneralHallEntity) => {
    setSelectedHall(hall);
    // 모바일에서는 상세 탭으로 자동 이동
    if (window.innerWidth < 768) {
      setMobileViewTab('detail');
    }
  };

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

  // 평형별 단가 데이터 (엔티티에 없으면 추정치 기반 생성)
  const roomTypes = useMemo(() => {
    if (!selectedHall) return [];
    if (selectedHall.roomTypes && selectedHall.roomTypes.length > 0) {
      return selectedHall.roomTypes;
    }
    const base = selectedHall.dailyRentEstimate;
    return [
      { name: '소형 (30~35평형)', pyeong: 35, dailyPrice: Math.round(base * 0.65), recommendedGuests: '가족장 / 50명 내외' },
      { name: '중형 (45~60평형)', pyeong: 55, dailyPrice: base, recommendedGuests: '일반 조문객 150명 내외' },
      { name: '특실 (70~90평형)', pyeong: 80, dailyPrice: Math.round(base * 1.5), recommendedGuests: '대형 조문 250명 이상' },
      { name: 'VIP실 (120~140평형)', pyeong: 130, dailyPrice: Math.round(base * 2.2), recommendedGuests: '사회장·의전 전용' }
    ];
  }, [selectedHall]);

  return (
    <div className="bg-[#FFFFFF] rounded-xl shadow-xs border border-[#DCD6C9] p-5 md:p-8 space-y-6">
      {/* 1. 상단 사진 비주얼 헤더 배너 */}
      <div className="relative rounded-lg overflow-hidden h-44 sm:h-52 border border-[#3D382E] bg-[#141618]">
        <img
          src="/images/memorial-altar.jpg"
          alt="정갈한 장례식장 제단 꽃장식"
          className="w-full h-full object-cover object-center filter brightness-[0.4] contrast-105"
        />
        {/* 삼국·조선 길상 구름문 은은한 오버레이 */}
        <div className="absolute inset-0 pointer-events-none k-pattern-unmun-dark opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0E10] via-[#0D0E10]/50 to-transparent flex flex-col justify-end p-6 relative z-10">
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded bg-[#19382C]/90 text-[#FAF9F6] text-xs font-serif mb-2 border border-[#2D4F43] w-fit">
            <TraditionalSeal sealKey="peace" size="sm" />
            <span>전국 1,080개 등록 장례식장 전수 데이터 연계</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-reverence font-black text-[#FAF9F6] tracking-tight">
            전국 장례식장 시설 지도 및 빈소 감면 명세
          </h2>
          <p className="text-[#8A929D] text-xs sm:text-sm font-serif mt-1">
            거주지 인근 장례식장의 분향실·안치실 규모와 화장장 거리를 파악하고, 배웅 제휴 빈소 임대료 최대 30% 감면 혜택을 확인하세요.
          </p>
        </div>
      </div>

      {/* 2. 전국 17개 시도별 퀵 통계 칩 바 */}
      <div className="bg-[#FAF9F6] rounded-lg p-3.5 md:p-4 border border-[#DCD6C9]">
        <div className="text-xs font-serif font-bold text-[#5A5E66] mb-2 flex items-center justify-between">
          <span>전국 17개 광역시·도 장사 인프라 분포 (총 1,080개소)</span>
          <span className="text-[13px] text-[#6E5429] hidden sm:inline">※ 시도를 클릭하시면 해당 지역으로 즉시 지도와 목록이 필터링됩니다</span>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedRegion('all')}
            className={`px-3 py-1.5 rounded-md font-serif font-medium shrink-0 transition-all cursor-pointer ${
              selectedRegion === 'all'
                ? 'bg-[#19382C] text-[#FAF9F6] border border-[#2D4F43] shadow-xs font-bold'
                : 'bg-[#FFFFFF] text-[#42464E] hover:bg-[#FAF9F6] border border-[#DCD6C9]'
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
                  ? 'bg-[#19382C] text-[#FAF9F6] border border-[#2D4F43] shadow-xs font-bold'
                  : 'bg-[#FFFFFF] text-[#42464E] hover:bg-[#FAF9F6] border border-[#DCD6C9]'
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
          <Search className="w-4 h-4 text-[#5A5E66] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="장례식장 명칭 또는 지역(동/구/시)을 입력하세요..."
            className="w-full bg-[#FAF9F6] border border-[#DCD6C9] rounded-md pl-10 pr-4 py-3 text-sm text-[#151719] placeholder-[#5A5E66] focus:outline-none focus:border-[#9E7D47]"
          />
        </div>

        {/* 운영 주체 분류 필터 */}
        <div className="md:col-span-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-[#FAF9F6] border border-[#DCD6C9] rounded-md px-3.5 py-3 text-sm font-medium text-[#151719] focus:outline-none focus:border-[#9E7D47] font-serif"
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
                ? 'bg-[#19382C] text-[#FAF9F6] border-[#2D4F43]'
                : 'bg-[#FAF9F6] text-[#42464E] border-[#DCD6C9] hover:bg-[#FFFFFF]'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-[#6E5429]" />
            <span>배웅 제휴 감면 식장만 보기</span>
          </button>
        </div>
      </div>

      {/* 모바일 전용 뷰 탭 스위처 */}
      <div className="md:hidden flex bg-[#FAF9F6] p-1 rounded-lg border border-[#DCD6C9] text-xs font-serif">
        <button
          onClick={() => setMobileViewTab('list')}
          className={`flex-1 py-2 rounded text-center font-medium transition-all ${
            mobileViewTab === 'list' ? 'bg-[#19382C] text-white font-bold shadow-xs' : 'text-[#5A5E66]'
          }`}
        >
          목록 ({halls.length})
        </button>
        <button
          onClick={() => setMobileViewTab('map')}
          className={`flex-1 py-2 rounded text-center font-medium transition-all ${
            mobileViewTab === 'map' ? 'bg-[#19382C] text-white font-bold shadow-xs' : 'text-[#5A5E66]'
          }`}
        >
          Google 지도 보기
        </button>
        {selectedHall && (
          <button
            onClick={() => setMobileViewTab('detail')}
            className={`flex-1 py-2 rounded text-center font-medium transition-all ${
              mobileViewTab === 'detail' ? 'bg-[#19382C] text-white font-bold shadow-xs' : 'text-[#5A5E66]'
            }`}
          >
            선택 식장 상세
          </button>
        )}
      </div>

      {/* 4. [신규 마스터-디테일 스플릿 뷰] 좌측 검색 목록 vs 우측 인터랙티브 지도 & 정밀 제원 시트 */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* ─── [좌측 컬럼: 장례식장 목록] (md:col-span-5) ─── */}
        <div className={`md:col-span-5 space-y-3 ${mobileViewTab !== 'list' ? 'hidden md:block' : ''}`}>
          <div className="flex items-center justify-between text-xs font-serif font-bold text-[#5A5E66] px-1">
            <span>조회된 장례식장 ({halls.length}개소)</span>
            <span className="text-[13px] text-[#6E5429]">원하시는 식장을 선택하세요</span>
          </div>

          <div className="space-y-2.5 max-h-[750px] overflow-y-auto pr-1">
            {halls.length === 0 ? (
              <div className="p-8 text-center text-[#5A5E66] font-serif bg-[#FAF9F6] rounded-lg border border-[#DCD6C9]">
                조건에 맞는 장례식장이 없습니다.<br />검색어나 필터 조건을 변경해 보세요.
              </div>
            ) : (
              halls.map((hall) => {
                const isSelected = selectedHall?.id === hall.id;
                return (
                  <div
                    key={hall.id}
                    onClick={() => handleSelectHallWithMobile(hall)}
                    className={`p-4 rounded-lg border transition-all cursor-pointer text-left relative ${
                      isSelected
                        ? 'border-2 border-[#19382C] bg-[#F7F5F0] shadow-sm ring-1 ring-[#19382C]/10'
                        : 'border-[#DCD6C9] hover:border-[#9E7D47]/70 bg-[#FFFFFF]'
                    }`}
                  >
                    {/* 선택 인디케이터 바 */}
                    {isSelected && (
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#19382C] rounded-l-lg" />
                    )}

                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className="text-[13px] font-serif font-medium text-[#5A5E66] bg-[#FAF9F6] px-1.5 py-0.5 rounded border border-[#DCD6C9]">
                          {getCategoryLabel(hall.category)}
                        </span>
                        <h4 className="font-reverence font-bold text-base md:text-lg text-[#151719] mt-1">
                          {hall.name}
                        </h4>
                      </div>
                      {hall.isBaeungPartner ? (
                        <span className="shrink-0 text-xs font-serif font-bold bg-[#DCE8E2] text-[#19382C] px-2 py-0.5 rounded border border-[#DCE8E2] flex items-center space-x-1">
                          <Sparkles className="w-3 h-3 text-[#6E5429]" />
                          <span>{Math.round(hall.discountRate * 100)}% 감면</span>
                        </span>
                      ) : (
                        <span className="shrink-0 text-[13px] font-serif text-[#5A5E66] bg-[#FAF9F6] px-2 py-0.5 rounded border border-[#DCD6C9]">
                          일반 등록
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-[#5A5E66] mt-2 flex items-center space-x-1 font-serif">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-[#6E5429]" />
                      <span className="truncate">{hall.address}</span>
                    </div>

                    {hall.nearestSubway && (
                      <div className="text-[13px] text-[#5A5E66] mt-1 flex items-center space-x-1 font-serif">
                        <Train className="w-3 h-3 shrink-0 text-[#19382C]" />
                        <span className="truncate">{hall.nearestSubway}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-[#DCD6C9] text-xs font-serif">
                      <div>
                        <span className="text-[#5A5E66]">빈소/안치: </span>
                        <span className="font-bold text-[#151719]">{hall.roomCount}실 / {hall.capacityCount}구</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[#5A5E66]">1일 평균: </span>
                        <span className="font-reverence font-bold text-[#19382C] text-sm">
                          {hall.dailyRentEstimate.toLocaleString()}원
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ─── [우측 컬럼: 인터랙티브 지도 + 선택된 식장 종합 상세 시트] (md:col-span-7) ─── */}
        <div className={`md:col-span-7 space-y-4 md:sticky md:top-24 ${mobileViewTab === 'list' ? 'hidden md:block' : ''}`}>
          {/* 1. 상단 인터랙티브 위치 지도 */}
          <div className={`${mobileViewTab === 'detail' ? 'hidden md:block' : ''}`}>
            <FuneralHallMap
              halls={halls}
              selectedHall={selectedHall}
              onSelectHall={(hall) => {
                setSelectedHall(hall);
                if (window.innerWidth < 768) {
                  setMobileViewTab('detail');
                }
              }}
              selectedRegion={selectedRegion}
              onSelectRegion={setSelectedRegion}
            />
          </div>

          {/* 2. 선택된 식장 정밀 제원 및 감면 명세 시트 */}
          {selectedHall && discountInfo ? (
            <div className={`rounded-xl border border-[#DCD6C9] bg-[#FFFFFF] shadow-sm overflow-hidden ${mobileViewTab === 'map' ? 'hidden md:block' : ''}`}>
              {/* 시트 상단 헤더 배너 (고품격 심록 & 황동) */}
              <div className="bg-[#141618] text-[#FAF9F6] p-5 relative overflow-hidden">
                <div className="pointer-events-none absolute inset-0 k-pattern-geummun opacity-25" />
                <div className="relative z-10 flex justify-between items-start gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[13px] font-serif font-bold text-[#C2A26A] bg-[#19382C] px-2 py-0.5 rounded border border-[#2D4F43]">
                        {getCategoryLabel(selectedHall.category)}
                      </span>
                      {selectedHall.isBaeungPartner && (
                        <span className="text-[13px] font-serif font-bold bg-[#9E7D47] text-[#0D0E10] px-2 py-0.5 rounded">
                          ★ 빈소 {discountInfo.discountRatePercentage}% 감면 제휴 식장
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl md:text-2xl font-reverence font-bold text-[#FAF9F6] mt-2">
                      {selectedHall.name}
                    </h3>
                    <div className="flex items-center space-x-2 text-xs text-[#8A929D] font-serif mt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#C2A26A] shrink-0" />
                      <span className="truncate">{selectedHall.address}</span>
                      <button
                        onClick={() => handleCopyAddress(selectedHall.address)}
                        className="p-1 hover:text-white transition-colors cursor-pointer shrink-0"
                        title="주소 복사"
                      >
                        {copiedAddress ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <a
                    href={`tel:${selectedHall.phone}`}
                    className="p-3 bg-[#19382C] hover:bg-[#2D4F43] text-[#FAF9F6] rounded-lg border border-[#2D4F43] flex items-center justify-center shrink-0 cursor-pointer shadow-sm group"
                    title="전화 걸기"
                  >
                    <Phone className="w-5 h-5 text-[#C2A26A] group-hover:scale-110 transition-transform" />
                  </a>
                </div>
              </div>

              {/* 시트 본문 콘텐츠 */}
              <div className="p-5 md:p-6 space-y-5">
                {/* 2-A. [실시간 견적기] 2일장 vs 3일장 감면 계산기 */}
                <div className="bg-[#FAF9F6] border border-[#DCD6C9] rounded-lg p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DCD6C9] pb-2.5">
                    <span className="font-serif font-bold text-xs md:text-sm text-[#151719] flex items-center space-x-1.5">
                      <Sparkles className="w-4 h-4 text-[#6E5429]" />
                      <span>빈소 임대료 감면 혜택 계산기</span>
                    </span>
                    <div className="flex bg-[#FAF9F6] p-0.5 rounded border border-[#DCD6C9] text-xs font-serif">
                      <button
                        onClick={() => setStayDays(2)}
                        className={`px-3 py-1 rounded transition-all cursor-pointer ${
                          stayDays === 2 ? 'bg-[#19382C] text-white font-bold' : 'text-[#5A5E66] hover:text-[#151719]'
                        }`}
                      >
                        2일장 (통상 48시간)
                      </button>
                      <button
                        onClick={() => setStayDays(3)}
                        className={`px-3 py-1 rounded transition-all cursor-pointer ${
                          stayDays === 3 ? 'bg-[#19382C] text-white font-bold' : 'text-[#5A5E66] hover:text-[#151719]'
                        }`}
                      >
                        3일장 (72시간)
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center font-serif py-1">
                    <div>
                      <div className="text-[13px] text-[#5A5E66]">일반 정상 임대료</div>
                      <div className="text-sm md:text-base font-bold text-[#42464E] mt-0.5">
                        {discountInfo.standardTotalRent.toLocaleString()}원
                      </div>
                    </div>
                    <div className="border-x border-[#DCD6C9]">
                      <div className="text-[13px] text-[#6E5429] font-bold">
                        배웅 제휴 감면 ({discountInfo.discountRatePercentage}%)
                      </div>
                      <div className="text-sm md:text-base font-bold text-[#8B2520] mt-0.5">
                        -{discountInfo.discountAmount.toLocaleString()}원
                      </div>
                    </div>
                    <div>
                      <div className="text-[13px] text-[#19382C] font-bold">배웅 회원 최종가</div>
                      <div className="text-base md:text-lg font-reverence font-black text-[#19382C] mt-0.5">
                        {discountInfo.discountedTotalRent.toLocaleString()}원
                      </div>
                    </div>
                  </div>

                  {selectedHall.isBaeungPartner && (
                    <div className="bg-[#DCE8E2] border border-[#DCE8E2] rounded p-2 text-center text-xs font-serif text-[#19382C]">
                      💡 배웅 사전 등록 시 <b>{discountInfo.discountAmount.toLocaleString()}원</b>이 현장에서 자동 감면 적용됩니다.
                    </div>
                  )}
                </div>

                {/* 2-B. [정밀 제원 1] 평형별 빈소 규격 및 1일 임대료 단가표 */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-serif font-bold text-[#151719]">
                    <span className="flex items-center space-x-1.5">
                      <Building2 className="w-4 h-4 text-[#6E5429]" />
                      <span>분향실 규격별 상세 제원 및 1일 요금표</span>
                    </span>
                    <span className="text-[13px] text-[#5A5E66]">총 {selectedHall.roomCount}개 분향실 운영</span>
                  </div>

                  <div className="border border-[#DCD6C9] rounded-lg overflow-hidden text-xs font-serif">
                    <table className="w-full text-left divide-y divide-[#DCD6C9]">
                      <thead className="bg-[#FAF9F6] text-[#5A5E66] font-medium">
                        <tr>
                          <th className="py-2.5 px-3">빈소 규격</th>
                          <th className="py-2.5 px-3">권장 조문객 규모</th>
                          <th className="py-2.5 px-3 text-right">1일 임대료</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#DCD6C9] bg-[#FFFFFF]">
                        {roomTypes.map((rt, idx) => (
                          <tr key={idx} className="hover:bg-[#FAF9F6]">
                            <td className="py-2.5 px-3 font-medium text-[#151719]">{rt.name}</td>
                            <td className="py-2.5 px-3 text-[#5A5E66]">{rt.recommendedGuests}</td>
                            <td className="py-2.5 px-3 text-right font-reverence font-bold text-[#19382C]">
                              {rt.dailyPrice.toLocaleString()}원
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 2-C. [정밀 제원 2] 연계 화장시설(승화원) 이동 시간 및 거리 */}
                {selectedHall.nearestCrematorium && (
                  <div className="p-3.5 rounded-lg border border-[#DCD6C9] bg-[#FAF9F6] space-y-1.5 text-xs font-serif">
                    <div className="flex items-center justify-between font-bold text-[#151719]">
                      <span className="flex items-center space-x-1.5">
                        <Flame className="w-4 h-4 text-[#8B2520]" />
                        <span>가장 가까운 연계 화장장 (승화원)</span>
                      </span>
                      <span className="text-[#8B2520]">
                        약 {selectedHall.crematoriumTravelMinutes}분 소요 ({selectedHall.crematoriumDistanceKm}km)
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[#5A5E66]">
                      <span>시설명: <b>{selectedHall.nearestCrematorium}</b></span>
                      <span>운구 차량 이동 지원</span>
                    </div>
                    <p className="text-[13px] text-[#5A5E66] pt-1 border-t border-[#DCD6C9]">
                      ※ 발인 당일 승화원 화장 접수 및 전용 리무진 운구는 배웅 1급 장례지도사가 원스톱으로 전담합니다.
                    </p>
                  </div>
                )}

                {/* 2-D. [정밀 제원 3] 교통 접근성 및 주차 인프라 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-serif">
                  <div className="p-3 rounded-lg border border-[#DCD6C9] bg-[#FFFFFF] space-y-1">
                    <span className="text-[#5A5E66] flex items-center space-x-1 font-bold">
                      <Train className="w-3.5 h-3.5 text-[#19382C]" />
                      <span>대중교통 안내</span>
                    </span>
                    <p className="text-[#151719] font-medium leading-relaxed">
                      {selectedHall.nearestSubway || '대중교통 및 버스 노선 완비'}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg border border-[#DCD6C9] bg-[#FFFFFF] space-y-1">
                    <span className="text-[#5A5E66] flex items-center space-x-1 font-bold">
                      <Car className="w-3.5 h-3.5 text-[#6E5429]" />
                      <span>주차 시설 안내</span>
                    </span>
                    <p className="text-[#151719] font-medium leading-relaxed">
                      {selectedHall.parking}
                    </p>
                  </div>
                </div>

                {/* 2-E. 유족 편의시설 칩 */}
                <div>
                  <div className="text-xs font-serif font-bold text-[#5A5E66] mb-1.5">제공 편의시설</div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedHall.conveniences.map((conv, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[13px] font-serif bg-[#FAF9F6] text-[#42464E] border border-[#DCD6C9]"
                      >
                        ✓ {conv}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 2-E-2. 3대 모듈 실시간 연계 액션 버튼 */}
                <div className="pt-2 border-t border-[#DCD6C9] space-y-2">
                  <button
                    onClick={() => {
                      onSelectHallForFuneral?.(selectedHall);
                      setIsSynced(true);
                      setTimeout(() => setIsSynced(false), 3500);
                    }}
                    className={`w-full py-2.5 px-4 rounded-md font-serif font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer border ${
                      isSynced
                        ? 'bg-[#19382C] text-[#FAF9F6] border-[#2D4F43]'
                        : 'bg-[#9E7D47]/15 hover:bg-[#9E7D47]/25 text-[#6E5429] border-[#9E7D47]/40'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-[#6E5429]" />
                    <span>
                      {isSynced
                        ? `✓ [${selectedHall.name}] 생애기록관 부고장에 실시간 연동 완료!`
                        : `이 장례식장을 생애기록관 모바일 부고장에 실시간 연동`}
                    </span>
                  </button>

                  {isSynced && onNavigateToLifeArchive && (
                    <button
                      onClick={onNavigateToLifeArchive}
                      className="w-full text-center text-xs text-[#19382C] font-bold underline cursor-pointer hover:text-[#2D4F43]"
                    >
                      동기화된 생애기록관 부고장 확인하러 가기 ➔
                    </button>
                  )}
                </div>

                {/* 2-F. 하단 의전 신청 액션 바 */}
                <div className="pt-2 border-t border-[#DCD6C9] flex flex-col sm:flex-row gap-2.5">
                  <a
                    href={`tel:${selectedHall.phone}`}
                    className="flex-1 py-3 px-4 bg-[#FAF9F6] hover:bg-[#FAF9F6] text-[#151719] border border-[#DCD6C9] rounded-md font-serif font-bold text-xs md:text-sm flex items-center justify-center space-x-2 transition-all"
                  >
                    <Phone className="w-4 h-4 text-[#6E5429]" />
                    <span>장례식장 직통 문의 ({selectedHall.phone})</span>
                  </a>

                  <a
                    href="tel:1588-0000"
                    className="flex-1 py-3 px-4 bg-[#19382C] hover:bg-[#2D4F43] text-[#FAF9F6] border border-[#2D4F43] rounded-md font-serif font-bold text-xs md:text-sm flex items-center justify-center space-x-2 transition-all shadow-xs"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#C2A26A]" />
                    <span>배웅 24시 빈소 우선 배정 신청</span>
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-[#5A5E66] font-serif bg-[#FAF9F6] rounded-xl border border-[#DCD6C9]">
              좌측 목록이나 지도에서 장례식장을 선택하시면<br />상세 시설 제원과 실시간 빈소 감면 명세가 노출됩니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
