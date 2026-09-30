import React, { useState } from 'react';
import { useModalA11y } from './ModalShell.js';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Trees,
  Sparkles,
  Phone,
  FileCheck,
  Scale,
  Award,
  ChevronRight,
  Info,
  MapPin,
  Clock,
  Calculator,
  ArrowRight
} from 'lucide-react';
import {
  AffiliateService,
  AffiliatePartnerEntity,
  AffiliateCategory,
  AffiliateVerificationResult,
  AffiliateDistrictMatch
} from '../../affiliate-partners/index.js';

interface AffiliatePartnersModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: AffiliateCategory;
}

export const AffiliatePartnersModal: React.FC<AffiliatePartnersModalProps> = ({
  isOpen,
  onClose,
  defaultCategory
}) => {
  // 공용 셸과 동일한 모달 접근성 계약 (포커스 트랩 · ESC · aria-modal)
  const { overlayProps, panelProps } = useModalA11y(onClose, isOpen);
  const [selectedCategory, setSelectedCategory] = useState<AffiliateCategory | 'ALL'>(
    defaultCategory || 'ALL'
  );
  const [activeTab, setActiveTab] = useState<'LIST' | 'PILOT_MATCH' | 'SIMULATOR'>('LIST');

  // 시범 권역 매칭 상태
  const [selectedDistrict, setSelectedDistrict] = useState<string>('성남시 분당구');
  const [selectedPackageItems, setSelectedPackageItems] = useState<{ [partnerId: string]: number }>({
    'aff-colum-bundang': 0,
    'aff-clearing-baeung': 0
  });

  // 입점 심사 시뮬레이터 상태
  const [simCategory, setSimCategory] = useState<AffiliateCategory>('COLUMBARIUM');
  const [simName, setSimName] = useState('');
  const [simLicense, setSimLicense] = useState('');
  const [simAdText, setSimAdText] = useState('');
  const [simHasPricing, setSimHasPricing] = useState(true);
  const [simResult, setSimResult] = useState<AffiliateVerificationResult | null>(null);

  if (!isOpen) return null;

  const allPartners = AffiliateService.getAllPartners();
  const pilotDistricts = AffiliateService.getPilotDistricts();
  const districtMatch: AffiliateDistrictMatch = AffiliateService.getNearestAffiliatesForDistrict(selectedDistrict);

  const filteredPartners =
    selectedCategory === 'ALL'
      ? allPartners
      : AffiliateService.getPartnersByCategory(selectedCategory);

  const handleRunSimulation = (e: React.FormEvent) => {
    e.preventDefault();
    const result = AffiliateService.verifyPartnerAdmission({
      partnerId: `sim-${Date.now()}`,
      category: simCategory,
      name: simName || '테스트 제휴업체',
      licenseNumber: simLicense,
      adText: simAdText,
      hasTransparentPricing: simHasPricing
    });
    setSimResult(result);
  };

  const loadPresetSample = (type: 'COLUMBARIUM' | 'WOODLAND' | 'ESTATE' | 'EXAGGERATED' | 'INVALID_LICENSE') => {
    switch (type) {
      case 'COLUMBARIUM':
        setSimCategory('COLUMBARIUM');
        setSimName('분당 메모리얼파크 실내 봉안당');
        setSimLicense('제2012-성남분당-사설봉안-04호');
        setSimAdText('장사법 제15조 설치신고 완료 항온항습 무결점 영구 안치실 정찰제');
        setSimHasPricing(true);
        setSimResult(AffiliateService.verifyPartnerAdmission({
          partnerId: 'sim-preset-colum',
          category: 'COLUMBARIUM',
          name: '분당 메모리얼파크 실내 봉안당',
          licenseNumber: '제2012-성남분당-사설봉안-04호',
          adText: '장사법 제15조 설치신고 완료 항온항습 무결점 영구 안치실 정찰제',
          hasTransparentPricing: true
        }));
        break;
      case 'WOODLAND':
        setSimCategory('WOODLAND_BURIAL');
        setSimName('용인 로뎀나무 수목장림');
        setSimLicense('제2019-용인처인-자연장지-05호');
        setSimAdText('장사법 제16조 자연장지 허가 소나무 주목 사계절 안식처');
        setSimHasPricing(true);
        setSimResult(AffiliateService.verifyPartnerAdmission({
          partnerId: 'sim-preset-wood',
          category: 'WOODLAND_BURIAL',
          name: '용인 로뎀나무 수목장림',
          licenseNumber: '제2019-용인처인-자연장지-05호',
          adText: '장사법 제16조 자연장지 허가 소나무 주목 사계절 안식처',
          hasTransparentPricing: true
        }));
        break;
      case 'ESTATE':
        setSimCategory('ESTATE_CLEARING');
        setSimName('배웅 안심 유품정리 케어단');
        setSimLicense('제2021-서울마포-폐기물수집운반-51호');
        setSimAdText('폐기물관리법 제25조 정식 허가 차량 직영 운행 및 바이오 공간 살균');
        setSimHasPricing(true);
        setSimResult(AffiliateService.verifyPartnerAdmission({
          partnerId: 'sim-preset-estate',
          category: 'ESTATE_CLEARING',
          name: '배웅 안심 유품정리 케어단',
          licenseNumber: '제2021-서울마포-폐기물수집운반-51호',
          adText: '폐기물관리법 제25조 정식 허가 차량 직영 운행 및 바이오 공간 살균',
          hasTransparentPricing: true
        }));
        break;
      case 'EXAGGERATED':
        setSimCategory('COLUMBARIUM');
        setSimName('수도권 최고급 봉안당');
        setSimLicense('제2023-경기-사설봉안-08호');
        setSimAdText('전국 최저가 보장 로열층 마감임박 파격 할인 혜택');
        setSimHasPricing(true);
        setSimResult(AffiliateService.verifyPartnerAdmission({
          partnerId: 'sim-preset-bad-ad',
          category: 'COLUMBARIUM',
          name: '수도권 최고급 봉안당',
          licenseNumber: '제2023-경기-사설봉안-08호',
          adText: '전국 최저가 보장 로열층 마감임박 파격 할인 혜택',
          hasTransparentPricing: true
        }));
        break;
      case 'INVALID_LICENSE':
        setSimCategory('ESTATE_CLEARING');
        setSimName('개인 용달 청소');
        setSimLicense('일반사업자-1234');
        setSimAdText('폐기물 적법 처리 대행 서비스');
        setSimHasPricing(false);
        setSimResult(AffiliateService.verifyPartnerAdmission({
          partnerId: 'sim-preset-bad-lic',
          category: 'ESTATE_CLEARING',
          name: '개인 용달 청소',
          licenseNumber: '일반사업자-1234',
          adText: '폐기물 적법 처리 대행 서비스',
          hasTransparentPricing: false
        }));
        break;
    }
  };

  const getCategoryBadge = (cat: AffiliateCategory) => {
    switch (cat) {
      case 'COLUMBARIUM':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[13px] font-serif font-bold bg-[#FAF9F6] text-[#6E5429] border border-[#DCD6C9]">
            <Building2 className="w-3.5 h-3.5 text-[#9E7D47]" />
            <span>실내 봉안당</span>
          </span>
        );
      case 'WOODLAND_BURIAL':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[13px] font-serif font-bold bg-[#DCE8E2] text-[#19382C] border border-[#DCE8E2]">
            <Trees className="w-3.5 h-3.5 text-[#19382C]" />
            <span>수목장림 자연장지</span>
          </span>
        );
      case 'ESTATE_CLEARING':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[13px] font-serif font-bold bg-[#FAF9F6] text-[#6E5429] border border-[#DCD6C9]">
            <Sparkles className="w-3.5 h-3.5 text-[#6E5429]" />
            <span>유품정리·특수케어</span>
          </span>
        );
    }
  };

  // 패키지 정찰 비용 합산
  const packageCostSelections = Object.entries(selectedPackageItems)
    .filter(([_, itemIdx]) => itemIdx >= 0)
    .map(([partnerId, itemIdx]) => ({ partnerId, itemIndex: itemIdx }));
  const packageEstimate = AffiliateService.calculateAffiliatePackageCost(packageCostSelections);

  return (
    <div {...overlayProps} onKeyDown={panelProps.onKeyDown} className="fixed inset-0 z-50 bg-[#0D0E10]/85 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto font-serif">
      <div {...panelProps} className="bg-[#FAF9F6] rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl border border-[#DCD6C9] flex flex-col my-auto max-h-[94vh]">
        {/* 1. 상단 컨트롤 툴바 */}
        <div className="bg-[#141618] text-[#FAF9F6] p-4 px-6 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-[#19382C] text-[#C2A26A] flex items-center justify-center border border-[#2D4F43]">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-reverence font-bold text-base sm:text-lg text-[#FAF9F6]">
                배웅 인증 3대 장사 제휴처 (봉안당 · 수목장 · 유품정리)
              </h3>
              <p className="text-[13px] text-[#A8B2A9]">
                지자체 정식 인허가 필증 검증 완료 · 리베이트 0원 투명 정찰제
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-[#FAF9F6]/10 hover:bg-[#FAF9F6]/20 text-[#FAF9F6] transition-colors cursor-pointer"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. 상단 3대 탭 (제휴사 목록 vs 시범 권역 매칭 vs 입점 심사 시뮬레이터) */}
        <div className="flex border-b border-[#DCD6C9] bg-[#FFFFFF] px-6 text-[13px] sm:text-sm font-medium overflow-x-auto">
          <button
            onClick={() => setActiveTab('LIST')}
            className={`py-3 px-4 border-b-2 font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'LIST'
                ? 'border-[#19382C] text-[#19382C]'
                : 'border-transparent text-[#5A5E66] hover:text-[#151719]'
            }`}
          >
            엄선 부가 제휴사 목록 ({allPartners.length}곳)
          </button>
          <button
            onClick={() => setActiveTab('PILOT_MATCH')}
            className={`py-3 px-4 border-b-2 font-bold transition-all whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'PILOT_MATCH'
                ? 'border-[#19382C] text-[#19382C]'
                : 'border-transparent text-[#5A5E66] hover:text-[#151719]'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-[#19382C]" />
            <span>시범 권역 30분 안심 매칭</span>
          </button>
          <button
            onClick={() => setActiveTab('SIMULATOR')}
            className={`py-3 px-4 border-b-2 font-bold transition-all whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'SIMULATOR'
                ? 'border-[#19382C] text-[#19382C]'
                : 'border-transparent text-[#5A5E66] hover:text-[#151719]'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-[#9E7D47]" />
            <span>4대 입점 심사 & 자격 검증기</span>
          </button>
        </div>

        {/* 3. 모달 본문 */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-5">
          {activeTab === 'LIST' && (
            <>
              {/* 공정위 리베이트 방지 & 법령 고지 배너 */}
              <div className="bg-[#FAF9F6] border border-[#F1E9DB] rounded-xl p-4 text-[13px] space-y-2">
                <div className="flex items-start space-x-2 text-[#6E5429]">
                  <Scale className="w-4 h-4 shrink-0 mt-0.5 text-[#9E7D47]" />
                  <div>
                    <span className="font-bold text-[#6E5429]">
                      공정거래위원회 리베이트 제재(2026.03) 방지 & 100% 정찰제 원칙
                    </span>
                    <p className="text-[13px] text-[#6E5429] mt-0.5 leading-relaxed">
                      배웅은 제휴 봉안당·수목장·유품정리 업체로부터 알선 수수료(소개비)를 1원도 수취하지 않습니다.
                      오직 정액제 광고 계약(월 25만~30만원)으로 운영되며, 플랫폼 중간 마진이 없어 유족에게 가장 투명한 가격이 보장됩니다.
                    </p>
                  </div>
                </div>
              </div>

              {/* 카테고리 필터 버튼 그룹 */}
              <div className="flex flex-wrap gap-2 text-[13px]">
                {[
                  { key: 'ALL', label: `전체 보기 (${allPartners.length})` },
                  { key: 'COLUMBARIUM', label: '🏛️ 실내외 봉안당 (3)' },
                  { key: 'WOODLAND_BURIAL', label: '🌲 수목장림 자연장지 (3)' },
                  { key: 'ESTATE_CLEARING', label: '🧹 유품정리·특수케어 (2)' }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setSelectedCategory(tab.key as AffiliateCategory | 'ALL')}
                    className={`px-3 py-1.5 rounded-lg border font-medium transition-all cursor-pointer ${
                      selectedCategory === tab.key
                        ? 'bg-[#19382C] text-[#FAF9F6] border-[#2D4F43] font-bold shadow-xs'
                        : 'bg-[#FFFFFF] text-[#42464E] border-[#DCD6C9] hover:bg-[#FAF9F6]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* 제휴사 카드 리스트 */}
              <div className="space-y-4">
                {filteredPartners.map((partner) => (
                  <div
                    key={partner.id}
                    className="bg-[#FFFFFF] border border-[#DCD6C9] rounded-xl p-5 shadow-xs space-y-4 hover:border-[#9E7D47]/60 transition-all"
                  >
                    {/* 상단 상호 및 인허가 정보 */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DCD6C9] pb-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          {getCategoryBadge(partner.category)}
                          <span className="text-[13px] text-[#5A5E66] font-medium">{partner.region} {partner.district}</span>
                        </div>
                        <h4 className="font-reverence font-bold text-lg text-[#151719] mt-1">
                          {partner.name}
                        </h4>
                        <p className="text-[13px] text-[#5A5E66] mt-0.5">{partner.address}</p>
                      </div>

                      <div className="flex flex-col items-start sm:items-end">
                        <span className="inline-flex items-center space-x-1 text-[13px] font-bold text-[#19382C] bg-[#DCE8E2] px-2 py-0.5 rounded border border-[#DCE8E2]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#19382C]" />
                          <span>인허가 검증 완료</span>
                        </span>
                        <span className="text-[13px] text-[#5A5E66] mt-1 font-mono">
                          {partner.licenseNumber}
                        </span>
                      </div>
                    </div>

                    {/* 법적 근거 및 권역 이동 정보 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[13px]">
                      <div className="bg-[#FAF9F6] p-2.5 rounded-lg border border-[#DCD6C9] text-[#5A5E66] flex items-center space-x-2">
                        <FileCheck className="w-4 h-4 text-[#9E7D47] shrink-0" />
                        <span className="min-w-0 break-words">{partner.statutoryClause} · 심사일 {partner.verifiedDate}</span>
                      </div>
                      <div className="bg-[#FAF9F6] p-2.5 rounded-lg border border-[#DCD6C9] text-[#5A5E66] flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-[#19382C] shrink-0" />
                        <span className="min-w-0 break-words">
                          시범 권역 접근성: 성남 분당({partner.targetDistrictEstimates?.['성남시 분당구']?.travelTimeMinutes ?? '-'}분) · 강남({partner.targetDistrictEstimates?.['강남구']?.travelTimeMinutes ?? '-'}분)
                        </span>
                      </div>
                    </div>

                    {/* 투명 정찰 가격표 */}
                    <div>
                      <div className="text-[13px] font-bold text-[#151719] mb-2 flex items-center justify-between">
                        <span>공식 정찰 가격표 (원가 투명 공개)</span>
                        <span className="text-[13px] text-[#6E5429] font-normal">※ 부당 추가 비용 청구 불가</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                        {partner.pricingInfo.map((item, idx) => (
                          <div
                            key={idx}
                            className="p-3 bg-[#FAF9F6] rounded-lg border border-[#DCD6C9] flex flex-col justify-between"
                          >
                            <div>
                              <div className="font-bold text-[13px] text-[#151719]">{item.name}</div>
                              <div className="text-[13px] text-[#5A5E66] mt-0.5 leading-snug">
                                {item.description}
                              </div>
                            </div>
                            <div className="mt-2 pt-2 border-t border-[#DCD6C9] flex justify-between items-baseline">
                              <span className="text-[13px] text-[#5A5E66]">{item.unit}</span>
                              <span className="font-reverence font-bold text-sm text-[#19382C]">
                                {item.price.toLocaleString()}원
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 주요 특장점 태그 */}
                    <div className="flex flex-wrap gap-1.5">
                      {partner.features.map((feat, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[13px] bg-[#F7F5F0] text-[#5A5E66] border border-[#DCD6C9]"
                        >
                          ✓ {feat}
                        </span>
                      ))}
                    </div>

                    {/* 직통 연락처 액션 버튼 */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-[#DCD6C9]">
                      <div className="text-[13px] text-[#5A5E66]">
                        안내: 배웅 직통 통화 시 플랫폼 알선 수수료 0원 및 정찰 혜택이 적용됩니다.
                      </div>
                      <a
                        href={`tel:${partner.phone}`}
                        className="w-full sm:w-auto px-4 py-2 bg-[#19382C] hover:bg-[#2D4F43] text-[#FAF9F6] rounded-lg text-[13px] font-bold flex items-center justify-center space-x-1.5 transition-colors shadow-xs"
                      >
                        <Phone className="w-3.5 h-3.5 text-[#C2A26A]" />
                        <span>직통 상담 연결 ({partner.phone})</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ─── 2. 시범 권역 30분 안심 매칭 탭 ─── */}
          {activeTab === 'PILOT_MATCH' && (
            <div className="space-y-5">
              {/* 상단 시범 자치구 선택 영역 */}
              <div className="bg-[#FFFFFF] border border-[#DCD6C9] rounded-xl p-5 space-y-3">
                <div className="flex items-center space-x-2 text-[#19382C]">
                  <MapPin className="w-5 h-5 text-[#19382C]" />
                  <h4 className="font-bold text-base text-[#151719]">
                    시범 타깃 권역(강남4구·성남) 30분 최단거리 안심 매칭
                  </h4>
                </div>
                <p className="text-[13px] text-[#5A5E66]">
                  장례식장 발인 후 영결식장에서 30~40분 내 도달 가능한 최적의 봉안시설, 수목장림 및 사후 유품정리 3대 제휴 세트입니다.
                </p>

                {/* 6대 자치구 선택 칩 */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {pilotDistricts.map((district) => (
                    <button
                      key={district}
                      onClick={() => setSelectedDistrict(district)}
                      className={`px-3.5 py-1.5 rounded-lg border text-[13px] font-medium transition-all cursor-pointer ${
                        selectedDistrict === district
                          ? 'bg-[#19382C] text-[#FAF9F6] border-[#2D4F43] font-bold shadow-xs'
                          : 'bg-[#FAF9F6] text-[#42464E] border-[#DCD6C9] hover:bg-[#F1EDE3]'
                      }`}
                    >
                      {district}
                    </button>
                  ))}
                </div>
              </div>

              {/* 매칭 결과 카드 3종 (봉안당 / 수목장 / 유품정리) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. 봉안당 매칭 */}
                {districtMatch.matchedColumbarium && (
                  <div className="bg-[#FFFFFF] border border-[#DCD6C9] rounded-xl p-4 flex flex-col justify-between space-y-3 shadow-xs">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[13px] font-bold bg-[#FAF9F6] text-[#6E5429] border border-[#DCD6C9]">
                          <Building2 className="w-3.5 h-3.5 text-[#9E7D47]" />
                          <span>실내 봉안당</span>
                        </span>
                        <span className="text-[13px] font-bold text-[#19382C] bg-[#DCE8E2] px-2 py-0.5 rounded">
                          {districtMatch.matchedColumbarium.estimate.travelTimeMinutes}분 ({districtMatch.matchedColumbarium.estimate.distanceKm}km)
                        </span>
                      </div>
                      <h5 className="font-reverence font-bold text-base text-[#151719] mt-2">
                        {districtMatch.matchedColumbarium.partner.name}
                      </h5>
                      <p className="text-[13px] text-[#5A5E66] mt-0.5">
                        {districtMatch.matchedColumbarium.partner.address}
                      </p>
                      <div className="mt-3 space-y-1.5 text-[13px]">
                        <div className="font-bold text-[#151719]">추천 안치 품목 선택:</div>
                        {districtMatch.matchedColumbarium.partner.pricingInfo.map((p, idx) => (
                          <label
                            key={idx}
                            className={`flex items-start justify-between p-2 rounded border cursor-pointer ${
                              selectedPackageItems[districtMatch.matchedColumbarium!.partner.id] === idx
                                ? 'bg-[#DCE8E2]/40 border-[#19382C]'
                                : 'bg-[#FAF9F6] border-[#DCD6C9]'
                            }`}
                          >
                            <div className="flex items-center space-x-1.5">
                              <input
                                type="radio"
                                name="colum-package"
                                checked={selectedPackageItems[districtMatch.matchedColumbarium!.partner.id] === idx}
                                onChange={() =>
                                  setSelectedPackageItems((prev) => ({
                                    ...prev,
                                    [districtMatch.matchedColumbarium!.partner.id]: idx
                                  }))
                                }
                                className="text-[#19382C] focus:ring-[#19382C]"
                              />
                              <span className="text-[#151719]">{p.name}</span>
                            </div>
                            <span className="font-bold text-[#19382C]">{p.price.toLocaleString()}원</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="pt-2 border-t border-[#DCD6C9] flex items-center justify-between text-[13px]">
                      <span className="text-[#5A5E66] font-mono">{districtMatch.matchedColumbarium.partner.licenseNumber}</span>
                      <a
                        href={`tel:${districtMatch.matchedColumbarium.partner.phone}`}
                        className="font-bold text-[#19382C] hover:underline"
                      >
                        상담 {districtMatch.matchedColumbarium.partner.phone}
                      </a>
                    </div>
                  </div>
                )}

                {/* 2. 수목장림 매칭 */}
                {districtMatch.matchedWoodlandBurial && (
                  <div className="bg-[#FFFFFF] border border-[#DCD6C9] rounded-xl p-4 flex flex-col justify-between space-y-3 shadow-xs">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[13px] font-bold bg-[#DCE8E2] text-[#19382C] border border-[#DCE8E2]">
                          <Trees className="w-3.5 h-3.5 text-[#19382C]" />
                          <span>수목장림 자연장지</span>
                        </span>
                        <span className="text-[13px] font-bold text-[#19382C] bg-[#DCE8E2] px-2 py-0.5 rounded">
                          {districtMatch.matchedWoodlandBurial.estimate.travelTimeMinutes}분 ({districtMatch.matchedWoodlandBurial.estimate.distanceKm}km)
                        </span>
                      </div>
                      <h5 className="font-reverence font-bold text-base text-[#151719] mt-2">
                        {districtMatch.matchedWoodlandBurial.partner.name}
                      </h5>
                      <p className="text-[13px] text-[#5A5E66] mt-0.5">
                        {districtMatch.matchedWoodlandBurial.partner.address}
                      </p>
                      <div className="mt-3 space-y-1.5 text-[13px]">
                        <div className="font-bold text-[#151719]">추천 수목 품목 선택:</div>
                        {districtMatch.matchedWoodlandBurial.partner.pricingInfo.map((p, idx) => (
                          <label
                            key={idx}
                            className={`flex items-start justify-between p-2 rounded border cursor-pointer ${
                              selectedPackageItems[districtMatch.matchedWoodlandBurial!.partner.id] === idx
                                ? 'bg-[#DCE8E2]/40 border-[#19382C]'
                                : 'bg-[#FAF9F6] border-[#DCD6C9]'
                            }`}
                          >
                            <div className="flex items-center space-x-1.5">
                              <input
                                type="radio"
                                name="wood-package"
                                checked={selectedPackageItems[districtMatch.matchedWoodlandBurial!.partner.id] === idx}
                                onChange={() =>
                                  setSelectedPackageItems((prev) => ({
                                    ...prev,
                                    [districtMatch.matchedWoodlandBurial!.partner.id]: idx
                                  }))
                                }
                                className="text-[#19382C] focus:ring-[#19382C]"
                              />
                              <span className="text-[#151719]">{p.name}</span>
                            </div>
                            <span className="font-bold text-[#19382C]">{p.price.toLocaleString()}원</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="pt-2 border-t border-[#DCD6C9] flex items-center justify-between text-[13px]">
                      <span className="text-[#5A5E66] font-mono">{districtMatch.matchedWoodlandBurial.partner.licenseNumber}</span>
                      <a
                        href={`tel:${districtMatch.matchedWoodlandBurial.partner.phone}`}
                        className="font-bold text-[#19382C] hover:underline"
                      >
                        상담 {districtMatch.matchedWoodlandBurial.partner.phone}
                      </a>
                    </div>
                  </div>
                )}

                {/* 3. 유품정리 케어단 매칭 */}
                {districtMatch.matchedEstateClearing && (
                  <div className="bg-[#FFFFFF] border border-[#DCD6C9] rounded-xl p-4 flex flex-col justify-between space-y-3 shadow-xs">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[13px] font-bold bg-[#FAF9F6] text-[#6E5429] border border-[#DCD6C9]">
                          <Sparkles className="w-3.5 h-3.5 text-[#6E5429]" />
                          <span>유품정리·특수케어</span>
                        </span>
                        <span className="text-[13px] font-bold text-[#19382C] bg-[#DCE8E2] px-2 py-0.5 rounded">
                          {districtMatch.matchedEstateClearing.estimate.travelTimeMinutes}분 내 출동 ({districtMatch.matchedEstateClearing.estimate.distanceKm}km)
                        </span>
                      </div>
                      <h5 className="font-reverence font-bold text-base text-[#151719] mt-2">
                        {districtMatch.matchedEstateClearing.partner.name}
                      </h5>
                      <p className="text-[13px] text-[#5A5E66] mt-0.5">
                        {districtMatch.matchedEstateClearing.partner.address}
                      </p>
                      <div className="mt-3 space-y-1.5 text-[13px]">
                        <div className="font-bold text-[#151719]">사후 유품 케어 범위 선택:</div>
                        {districtMatch.matchedEstateClearing.partner.pricingInfo.map((p, idx) => (
                          <label
                            key={idx}
                            className={`flex items-start justify-between p-2 rounded border cursor-pointer ${
                              selectedPackageItems[districtMatch.matchedEstateClearing!.partner.id] === idx
                                ? 'bg-[#DCE8E2]/40 border-[#19382C]'
                                : 'bg-[#FAF9F6] border-[#DCD6C9]'
                            }`}
                          >
                            <div className="flex items-center space-x-1.5">
                              <input
                                type="radio"
                                name="estate-package"
                                checked={selectedPackageItems[districtMatch.matchedEstateClearing!.partner.id] === idx}
                                onChange={() =>
                                  setSelectedPackageItems((prev) => ({
                                    ...prev,
                                    [districtMatch.matchedEstateClearing!.partner.id]: idx
                                  }))
                                }
                                className="text-[#19382C] focus:ring-[#19382C]"
                              />
                              <span className="text-[#151719]">{p.name}</span>
                            </div>
                            <span className="font-bold text-[#19382C]">{p.price.toLocaleString()}원</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="pt-2 border-t border-[#DCD6C9] flex items-center justify-between text-[13px]">
                      <span className="text-[#5A5E66] font-mono">{districtMatch.matchedEstateClearing.partner.licenseNumber}</span>
                      <a
                        href={`tel:${districtMatch.matchedEstateClearing.partner.phone}`}
                        className="font-bold text-[#19382C] hover:underline"
                      >
                        상담 {districtMatch.matchedEstateClearing.partner.phone}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* 실시간 합산 원가 시뮬레이션 바우처 박스 */}
              <div className="bg-[#FFFFFF] border-2 border-[#19382C] rounded-xl p-5 space-y-3 shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DCD6C9] pb-3">
                  <div className="flex items-center space-x-2">
                    <Calculator className="w-5 h-5 text-[#19382C]" />
                    <span className="font-reverence font-bold text-base text-[#151719]">
                      선택 부가 서비스 정찰 합산 견적 ({selectedDistrict} 기준)
                    </span>
                  </div>
                  <div className="text-[13px] text-[#6E5429] bg-[#FAF9F6] px-3 py-1 rounded border border-[#DCD6C9]">
                    알선 수수료(소개비 20~30%) 0원 · 전액 유족 비용 절감
                  </div>
                </div>

                <div className="space-y-2">
                  {packageEstimate.itemsDetail.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-[13px] text-[#42464E]">
                      <span>• [{item.partnerName}] {item.itemName} ({item.unit})</span>
                      <span className="font-mono font-bold text-[#151719]">{item.price.toLocaleString()}원</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-[#DCD6C9] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-[13px] text-[#5A5E66]">
                    ※ 배웅 인증 파트너는 현장에서 추가 비용 청구가 법적으로 차단됩니다.
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-[13px] text-[#5A5E66]">합산 정찰 원가:</span>
                    <span className="font-reverence font-bold text-2xl text-[#19382C]">
                      {packageEstimate.totalCost.toLocaleString()}원
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── 3. 4대 입점 심사 시뮬레이터 탭 ─── */}
          {activeTab === 'SIMULATOR' && (
            <div className="space-y-5">
              <div className="bg-[#FAF9F6] border border-[#F1E9DB] rounded-xl p-4 text-[13px] space-y-2">
                <h4 className="font-bold text-sm text-[#6E5429] flex items-center space-x-1.5">
                  <Scale className="w-4 h-4 text-[#9E7D47]" />
                  <span>배웅 1단계 사업계획서 4.4절 기준 부가 제휴사 입점 심사 기준</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-[13px] text-[#6E5429] mt-2">
                  <div className="p-2.5 bg-white rounded border border-[#DCD6C9]">
                    <div className="font-bold text-[#19382C]">1. 법정 인허가 필수</div>
                    <div className="mt-1">
                      장사법 제15조(봉안) / 제16조(수목장) / 폐기물관리법 제25조(수집운반) 관할 지자체 신고필증
                    </div>
                  </div>
                  <div className="p-2.5 bg-white rounded border border-[#DCD6C9]">
                    <div className="font-bold text-[#19382C]">2. 표시광고법 위반 배제</div>
                    <div className="mt-1">
                      '최저가', '마감임박', '100% 보장', '전국 1위', '단독 특가' 등 소비자 오인 문구 일체 불허
                    </div>
                  </div>
                  <div className="p-2.5 bg-white rounded border border-[#DCD6C9]">
                    <div className="font-bold text-[#19382C]">3. 원가 정찰 가격표</div>
                    <div className="mt-1">
                      상담 후 추가금 요구 방지를 위한 품목별 정찰 가격표 사전 제출 및 공개 의무화
                    </div>
                  </div>
                </div>
              </div>

              {/* 퀵 테스트 프리셋 샘플 버튼 바 */}
              <div className="bg-[#FFFFFF] border border-[#DCD6C9] rounded-xl p-4 space-y-2">
                <div className="text-[13px] font-bold text-[#151719] flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#19382C]" />
                  <span>원클릭 심사 케이스 검증 (사전 검증 샘플 로더)</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1 text-[13px]">
                  <button
                    type="button"
                    onClick={() => loadPresetSample('COLUMBARIUM')}
                    className="px-3 py-1.5 rounded-lg bg-[#FAF9F6] hover:bg-[#F1EDE3] text-[#19382C] border border-[#DCD6C9] font-medium transition-colors cursor-pointer"
                  >
                    🏛️ 봉안당 합격 샘플 (분당)
                  </button>
                  <button
                    type="button"
                    onClick={() => loadPresetSample('WOODLAND')}
                    className="px-3 py-1.5 rounded-lg bg-[#FAF9F6] hover:bg-[#F1EDE3] text-[#19382C] border border-[#DCD6C9] font-medium transition-colors cursor-pointer"
                  >
                    🌲 수목장림 합격 샘플 (용인)
                  </button>
                  <button
                    type="button"
                    onClick={() => loadPresetSample('ESTATE')}
                    className="px-3 py-1.5 rounded-lg bg-[#FAF9F6] hover:bg-[#F1EDE3] text-[#19382C] border border-[#DCD6C9] font-medium transition-colors cursor-pointer"
                  >
                    🧹 유품정리 합격 샘플 (배웅)
                  </button>
                  <button
                    type="button"
                    onClick={() => loadPresetSample('EXAGGERATED')}
                    className="px-3 py-1.5 rounded-lg bg-[#FAF0EF] hover:bg-[#FAF0EF]/80 text-[#8B2520] border border-[#DCD6C9] font-medium transition-colors cursor-pointer"
                  >
                    ⚠️ 과장광고 반려 샘플
                  </button>
                  <button
                    type="button"
                    onClick={() => loadPresetSample('INVALID_LICENSE')}
                    className="px-3 py-1.5 rounded-lg bg-[#FAF0EF] hover:bg-[#FAF0EF]/80 text-[#8B2520] border border-[#DCD6C9] font-medium transition-colors cursor-pointer"
                  >
                    🚫 인허가 미비 반려 샘플
                  </button>
                </div>
              </div>

              {/* 시뮬레이션 폼 */}
              <form onSubmit={handleRunSimulation} className="bg-[#FFFFFF] border border-[#DCD6C9] rounded-xl p-5 space-y-4">
                <h5 className="font-bold text-sm text-[#151719]">
                  신규 제휴사 입점 적격성 셀프 심사 테스트
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[13px] font-bold text-[#42464E] mb-1">
                      업종 카테고리
                    </label>
                    <select
                      value={simCategory}
                      onChange={(e) => setSimCategory(e.target.value as AffiliateCategory)}
                      className="w-full bg-[#FAF9F6] border border-[#DCD6C9] rounded-md p-2.5 text-[13px] text-[#151719]"
                    >
                      <option value="COLUMBARIUM">봉안시설 (사설 봉안당 - 장사법 제15조)</option>
                      <option value="WOODLAND_BURIAL">수목장림 (사설 자연장지 - 장사법 제16조)</option>
                      <option value="ESTATE_CLEARING">유품정리 (폐기물 수집운반 - 폐기물관리법 제25조)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[13px] font-bold text-[#42464E] mb-1">
                      업체명 (상호)
                    </label>
                    <input
                      type="text"
                      value={simName}
                      onChange={(e) => setSimName(e.target.value)}
                      placeholder="예: 하늘숲 공원 봉안당"
                      className="w-full bg-[#FAF9F6] border border-[#DCD6C9] rounded-md p-2.5 text-[13px] text-[#151719]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-[#42464E] mb-1">
                    지자체 인허가 필증 번호 (예: 제2024-경기광주-사설봉안-03호, 제2021-서울마포-폐기물수집운반-51호)
                  </label>
                  <input
                    type="text"
                    value={simLicense}
                    onChange={(e) => setSimLicense(e.target.value)}
                    placeholder="지자체 정식 인허가 번호를 입력하세요"
                    className="w-full bg-[#FAF9F6] border border-[#DCD6C9] rounded-md p-2.5 text-[13px] text-[#151719]"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-[#42464E] mb-1">
                    신청 광고 문구 (과장 광고 필터링 검사용)
                  </label>
                  <input
                    type="text"
                    value={simAdText}
                    onChange={(e) => setSimAdText(e.target.value)}
                    placeholder="예: '최저가 보장 로열층 마감임박' 등 입력 시 자동 반려됩니다"
                    className="w-full bg-[#FAF9F6] border border-[#DCD6C9] rounded-md p-2.5 text-[13px] text-[#151719]"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="checkbox"
                    id="hasPricing"
                    checked={simHasPricing}
                    onChange={(e) => setSimHasPricing(e.target.checked)}
                    className="rounded border-[#DCD6C9] text-[#19382C] focus:ring-[#19382C]"
                  />
                  <label htmlFor="hasPricing" className="text-[13px] text-[#42464E] font-medium cursor-pointer">
                    품목별 투명 정찰 가격표 서류를 사전 제출하였습니다.
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-[#19382C] hover:bg-[#2D4F43] text-[#FAF9F6] rounded-md font-serif font-bold text-[13px] transition-colors cursor-pointer"
                >
                  심사 기준 검증 실행하기
                </button>
              </form>

              {/* 시뮬레이션 결과창 */}
              {simResult && (
                <div
                  className={`p-4 rounded-xl border text-[13px] space-y-2 ${
                    simResult.passed
                      ? 'bg-[#DCE8E2] border-[#DCE8E2] text-[#19382C]'
                      : 'bg-[#FAF0EF] border-[#FAF0EF] text-[#8B2520]'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {simResult.passed ? (
                      <CheckCircle2 className="w-5 h-5 text-[#19382C]" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-[#8B2520]" />
                    )}
                    <span className="font-bold text-sm">
                      {simResult.passed
                        ? '입점 자격 심사 합격 (배웅 인증 파트너 자격 충족)'
                        : '입점 자격 심사 반려'}
                    </span>
                  </div>

                  <div className="space-y-1 text-[13px] pt-1 border-t border-black/10">
                    <div>
                      • 법정 인허가 서류 유효성:{' '}
                      <span className="font-bold">
                        {simResult.checks.licenseValid ? '✓ 적합 (정상 필증 확인)' : '✗ 부적합'}
                      </span>
                      {simResult.parsedDetails?.licenseYear && (
                        <span className="ml-2 text-[13px] font-normal">
                          (인가연도: {simResult.parsedDetails.licenseYear}년, 관할: {simResult.parsedDetails.issuingDistrict})
                        </span>
                      )}
                    </div>
                    <div>
                      • 정밀 법정 서식 정합성:{' '}
                      <span className="font-bold">
                        {simResult.checks.licenseFormatValid ? '✓ 완전 일치' : '⚠️ 일부 서식 차이'}
                      </span>
                    </div>
                    <div>
                      • 표시광고법 금칙어 검사:{' '}
                      <span className="font-bold">
                        {simResult.checks.prohibitedWordsPassed
                          ? '✓ 적합 (금칙어 미검출)'
                          : '✗ 부적합 (허위·과장 광고 문구 검출)'}
                      </span>
                    </div>
                    <div>
                      • 품목별 원가 정찰 가격표 제출:{' '}
                      <span className="font-bold">
                        {simResult.checks.pricingDisclosed ? '✓ 적합 (가격표 공개)' : '✗ 미제출'}
                      </span>
                    </div>
                  </div>

                  {simResult.disqualificationReason && (
                    <div className="pt-2 text-[13px] font-bold text-[#8B2520]">
                      반려 사유: {simResult.disqualificationReason}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 4. 모달 하단 고정 닫기 풋터 */}
        <div className="bg-[#FAF9F6] p-4 px-6 border-t border-[#DCD6C9] flex items-center justify-between shrink-0">
          <span className="text-[13px] text-[#5A5E66]">
            배웅 파트너십 문의: partner@baeung.kr · 1588-0000
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#FAF9F6] hover:bg-[#FAF9F6] text-[#151719] border border-[#DCD6C9] rounded-md text-[13px] font-bold transition-colors cursor-pointer"
          >
            창 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
