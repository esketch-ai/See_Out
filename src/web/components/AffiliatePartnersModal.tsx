import React, { useState } from 'react';
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
  Info
} from 'lucide-react';
import {
  AffiliateService,
  AffiliatePartnerEntity,
  AffiliateCategory,
  AffiliateVerificationResult
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
  const [selectedCategory, setSelectedCategory] = useState<AffiliateCategory | 'ALL'>(
    defaultCategory || 'ALL'
  );
  const [activeTab, setActiveTab] = useState<'LIST' | 'SIMULATOR'>('LIST');

  // 입점 심사 시뮬레이터 상태
  const [simCategory, setSimCategory] = useState<AffiliateCategory>('COLUMBARIUM');
  const [simName, setSimName] = useState('');
  const [simLicense, setSimLicense] = useState('');
  const [simAdText, setSimAdText] = useState('');
  const [simHasPricing, setSimHasPricing] = useState(true);
  const [simResult, setSimResult] = useState<AffiliateVerificationResult | null>(null);

  if (!isOpen) return null;

  const allPartners = AffiliateService.getAllPartners();
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

  const getCategoryBadge = (cat: AffiliateCategory) => {
    switch (cat) {
      case 'COLUMBARIUM':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-serif font-bold bg-[#EAE5D9] text-[#5C4D32] border border-[#D5CBBA]">
            <Building2 className="w-3.5 h-3.5 text-[#9E7D47]" />
            <span>실내 봉안당</span>
          </span>
        );
      case 'WOODLAND_BURIAL':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-serif font-bold bg-[#E8F0EC] text-[#19382C] border border-[#BFD4CA]">
            <Trees className="w-3.5 h-3.5 text-[#19382C]" />
            <span>수목장림 자연장지</span>
          </span>
        );
      case 'ESTATE_CLEARING':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-serif font-bold bg-[#F3EFEA] text-[#694F38] border border-[#DECFC0]">
            <Sparkles className="w-3.5 h-3.5 text-[#876937]" />
            <span>유품정리·특수케어</span>
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0D0E10]/85 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto font-serif">
      <div className="bg-[#FAF9F6] rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl border border-[#E3DFD5] flex flex-col my-auto max-h-[94vh]">
        {/* 1. 상단 컨트롤 툴바 */}
        <div className="bg-[#121417] text-[#FAF9F6] p-4 px-6 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-[#19382C] text-[#C2A26A] flex items-center justify-center border border-[#2D5A46]">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-reverence font-bold text-base sm:text-lg text-[#FAF9F6]">
                배웅 인증 3대 장사 제휴처 (봉안당 · 수목장 · 유품정리)
              </h3>
              <p className="text-[11px] text-[#A8B2A9]">
                지자체 정식 인허가 필증 검증 완료 · 리베이트 0원 투명 정찰제
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-[#FAF9F6]/10 hover:bg-[#FAF9F6]/20 text-[#FAF9F6] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. 상단 탭 (제휴사 목록 vs 입점 심사 시뮬레이터) */}
        <div className="flex border-b border-[#E3DFD5] bg-[#FFFFFF] px-6 text-xs sm:text-sm font-medium">
          <button
            onClick={() => setActiveTab('LIST')}
            className={`py-3 px-4 border-b-2 font-bold transition-all cursor-pointer ${
              activeTab === 'LIST'
                ? 'border-[#19382C] text-[#19382C]'
                : 'border-transparent text-[#727782] hover:text-[#151719]'
            }`}
          >
            엄선 부가 제휴사 목록 ({allPartners.length}곳)
          </button>
          <button
            onClick={() => setActiveTab('SIMULATOR')}
            className={`py-3 px-4 border-b-2 font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'SIMULATOR'
                ? 'border-[#19382C] text-[#19382C]'
                : 'border-transparent text-[#727782] hover:text-[#151719]'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-[#9E7D47]" />
            <span>4대 입점 심사 기준 & 자격 검증기</span>
          </button>
        </div>

        {/* 3. 모달 스크롤 본문 */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-5">
          {activeTab === 'LIST' ? (
            <>
              {/* 공정위 리베이트 방지 & 법령 고지 배너 */}
              <div className="bg-[#FAF7F0] border border-[#E8DEC8] rounded-xl p-4 text-xs space-y-2">
                <div className="flex items-start space-x-2 text-[#7A5B28]">
                  <Scale className="w-4 h-4 shrink-0 mt-0.5 text-[#9E7D47]" />
                  <div>
                    <span className="font-bold text-[#573F17]">
                      공정거래위원회 리베이트 제재(2026.03) 방지 & 100% 정찰제 원칙
                    </span>
                    <p className="text-[11px] text-[#69532A] mt-0.5 leading-relaxed">
                      배웅은 제휴 봉안당·수목장·유품정리 업체로부터 알선 수수료(소개비)를 1원도 수취하지 않습니다.
                      오직 정액제 광고 계약(월 25만~30만원)으로 운영되며, 플랫폼 중간 마진이 없어 유족에게 가장 투명한 가격이 보장됩니다.
                    </p>
                  </div>
                </div>
              </div>

              {/* 카테고리 필터 버튼 그룹 */}
              <div className="flex flex-wrap gap-2 text-xs">
                {[
                  { key: 'ALL', label: `전체 보기 (${allPartners.length})` },
                  { key: 'COLUMBARIUM', label: '🏛️ 실내 봉안당 (2)' },
                  { key: 'WOODLAND_BURIAL', label: '🌲 수목장림 자연장지 (2)' },
                  { key: 'ESTATE_CLEARING', label: '🧹 유품정리·특수케어 (2)' }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setSelectedCategory(tab.key as AffiliateCategory | 'ALL')}
                    className={`px-3 py-1.5 rounded-lg border font-medium transition-all cursor-pointer ${
                      selectedCategory === tab.key
                        ? 'bg-[#19382C] text-[#FAF9F6] border-[#2D5A46] font-bold shadow-xs'
                        : 'bg-[#FFFFFF] text-[#42464E] border-[#E3DFD5] hover:bg-[#FAF9F6]'
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
                    className="bg-[#FFFFFF] border border-[#E3DFD5] rounded-xl p-5 shadow-xs space-y-4 hover:border-[#9E7D47]/60 transition-all"
                  >
                    {/* 상단 상호 및 인허가 정보 */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#ECE8E0] pb-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          {getCategoryBadge(partner.category)}
                          <span className="text-xs text-[#727782] font-medium">{partner.region}</span>
                        </div>
                        <h4 className="font-reverence font-bold text-lg text-[#151719] mt-1">
                          {partner.name}
                        </h4>
                        <p className="text-xs text-[#5C6166] mt-0.5">{partner.address}</p>
                      </div>

                      <div className="flex flex-col items-start sm:items-end">
                        <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-[#19382C] bg-[#F0F5F2] px-2 py-0.5 rounded border border-[#BFD4CA]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#19382C]" />
                          <span>인허가 검증 완료</span>
                        </span>
                        <span className="text-[10px] text-[#727782] mt-1 font-mono">
                          {partner.licenseNumber}
                        </span>
                      </div>
                    </div>

                    {/* 법적 근거 고지 */}
                    <div className="text-[11px] bg-[#FAF9F6] p-2.5 rounded-lg border border-[#E3DFD5] text-[#5C6166] flex items-center space-x-2">
                      <FileCheck className="w-4 h-4 text-[#9E7D47] shrink-0" />
                      <span>{partner.licenseType} (자격 심사: {partner.verifiedDate})</span>
                    </div>

                    {/* 투명 정찰 가격표 */}
                    <div>
                      <div className="text-xs font-bold text-[#151719] mb-2 flex items-center justify-between">
                        <span>공식 정찰 가격표 (원가 투명 공개)</span>
                        <span className="text-[10px] text-[#9E7D47] font-normal">※ 부당 추가 비용 청구 불가</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                        {partner.pricingInfo.map((item, idx) => (
                          <div
                            key={idx}
                            className="p-3 bg-[#FAF9F6] rounded-lg border border-[#E3DFD5] flex flex-col justify-between"
                          >
                            <div>
                              <div className="font-bold text-xs text-[#151719]">{item.name}</div>
                              <div className="text-[11px] text-[#727782] mt-0.5 leading-snug">
                                {item.description}
                              </div>
                            </div>
                            <div className="mt-2 pt-2 border-t border-[#ECE8E0] flex justify-between items-baseline">
                              <span className="text-[10px] text-[#8C867B]">{item.unit}</span>
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
                          className="px-2 py-0.5 rounded text-[11px] bg-[#F7F5F0] text-[#5C564B] border border-[#E3DDD0]"
                        >
                          ✓ {feat}
                        </span>
                      ))}
                    </div>

                    {/* 직통 연락처 액션 버튼 */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-[#ECE8E0]">
                      <div className="text-[11px] text-[#727782]">
                        안내: 배웅 직통 통화 시 플랫폼 알선 수수료 0원 및 정찰 혜택이 적용됩니다.
                      </div>
                      <a
                        href={`tel:${partner.phone}`}
                        className="w-full sm:w-auto px-4 py-2 bg-[#19382C] hover:bg-[#204738] text-[#FAF9F6] rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors shadow-xs"
                      >
                        <Phone className="w-3.5 h-3.5 text-[#C2A26A]" />
                        <span>직통 상담 연결 ({partner.phone})</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* ─── 4대 입점 심사 시뮬레이터 ─── */
            <div className="space-y-5">
              <div className="bg-[#FAF7F0] border border-[#E8DEC8] rounded-xl p-4 text-xs space-y-2">
                <h4 className="font-bold text-sm text-[#573F17] flex items-center space-x-1.5">
                  <Scale className="w-4 h-4 text-[#9E7D47]" />
                  <span>배웅 1단계 사업계획서 4.4절 기준 부가 제휴사 입점 심사 기준</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-[11px] text-[#69532A] mt-2">
                  <div className="p-2.5 bg-white rounded border border-[#DECFC0]">
                    <div className="font-bold text-[#19382C]">1. 법정 인허가 필수</div>
                    <div className="mt-1">
                      장사법 제15조(봉안) / 제16조(수목장) / 폐기물관리법 제25조(수집운반) 관할 지자체 신고필증
                    </div>
                  </div>
                  <div className="p-2.5 bg-white rounded border border-[#DECFC0]">
                    <div className="font-bold text-[#19382C]">2. 표시광고법 위반 배제</div>
                    <div className="mt-1">
                      '최저가', '마감임박', '100% 보장', '전국 1위', '단독 특가' 등 소비자 오인 문구 일체 불허
                    </div>
                  </div>
                  <div className="p-2.5 bg-white rounded border border-[#DECFC0]">
                    <div className="font-bold text-[#19382C]">3. 원가 정찰 가격표</div>
                    <div className="mt-1">
                      상담 후 추가금 요구 방지를 위한 품목별 정찰 가격표 사전 제출 및 공개 의무화
                    </div>
                  </div>
                </div>
              </div>

              {/* 시뮬레이션 폼 */}
              <form onSubmit={handleRunSimulation} className="bg-[#FFFFFF] border border-[#E3DFD5] rounded-xl p-5 space-y-4">
                <h5 className="font-bold text-sm text-[#151719]">
                  신규 제휴사 입점 적격성 셀프 심사 테스트
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#42464E] mb-1">
                      업종 카테고리
                    </label>
                    <select
                      value={simCategory}
                      onChange={(e) => setSimCategory(e.target.value as AffiliateCategory)}
                      className="w-full bg-[#FAF9F6] border border-[#E3DFD5] rounded-md p-2.5 text-xs text-[#151719]"
                    >
                      <option value="COLUMBARIUM">봉안시설 (사설 봉안당)</option>
                      <option value="WOODLAND_BURIAL">수목장림 (사설 자연장지)</option>
                      <option value="ESTATE_CLEARING">유품정리 (생활폐기물 수집운반)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#42464E] mb-1">
                      업체명 (상호)
                    </label>
                    <input
                      type="text"
                      value={simName}
                      onChange={(e) => setSimName(e.target.value)}
                      placeholder="예: 하늘숲 공원 봉안당"
                      className="w-full bg-[#FAF9F6] border border-[#E3DFD5] rounded-md p-2.5 text-xs text-[#151719]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#42464E] mb-1">
                    지자체 인허가 필증 번호 (예: 제2024-경기-사설봉안-12호, 폐기물수집운반 허가 등)
                  </label>
                  <input
                    type="text"
                    value={simLicense}
                    onChange={(e) => setSimLicense(e.target.value)}
                    placeholder="지자체 정식 인허가 번호를 입력하세요"
                    className="w-full bg-[#FAF9F6] border border-[#E3DFD5] rounded-md p-2.5 text-xs text-[#151719]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#42464E] mb-1">
                    신청 광고 문구 (과장 광고 필터링 검사용)
                  </label>
                  <input
                    type="text"
                    value={simAdText}
                    onChange={(e) => setSimAdText(e.target.value)}
                    placeholder="예: '최저가 보장 로열층 마감임박' 등 입력 시 자동 반려됩니다"
                    className="w-full bg-[#FAF9F6] border border-[#E3DFD5] rounded-md p-2.5 text-xs text-[#151719]"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="checkbox"
                    id="hasPricing"
                    checked={simHasPricing}
                    onChange={(e) => setSimHasPricing(e.target.checked)}
                    className="rounded border-[#E3DFD5] text-[#19382C] focus:ring-[#19382C]"
                  />
                  <label htmlFor="hasPricing" className="text-xs text-[#42464E] font-medium cursor-pointer">
                    품목별 투명 정찰 가격표 서류를 사전 제출하였습니다.
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-[#19382C] hover:bg-[#204738] text-[#FAF9F6] rounded-md font-serif font-bold text-xs transition-colors cursor-pointer"
                >
                  심사 기준 검증 실행하기
                </button>
              </form>

              {/* 시뮬레이션 결과창 */}
              {simResult && (
                <div
                  className={`p-4 rounded-xl border text-xs space-y-2 ${
                    simResult.passed
                      ? 'bg-[#F0F5F2] border-[#BFD4CA] text-[#19382C]'
                      : 'bg-[#FDF2F2] border-[#F5C2C2] text-[#8B2520]'
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

                  <div className="space-y-1 text-[11px] pt-1 border-t border-black/10">
                    <div>
                      • 법정 인허가 서류 유효성:{' '}
                      <span className="font-bold">
                        {simResult.checks.licenseValid ? '✓ 적합 (정상 필증 확인)' : '✗ 부적합'}
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
                    <div className="pt-2 text-[11px] font-bold text-[#8B2520]">
                      반려 사유: {simResult.disqualificationReason}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 4. 모달 하단 고정 닫기 풋터 */}
        <div className="bg-[#FAF9F6] p-4 px-6 border-t border-[#E3DFD5] flex items-center justify-between shrink-0">
          <span className="text-[11px] text-[#727782]">
            배웅 파트너십 문의: partner@baeung.kr · 1588-0000
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#FAF9F6] hover:bg-[#F2EEE6] text-[#151719] border border-[#E3DFD5] rounded-md text-xs font-bold transition-colors cursor-pointer"
          >
            창 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
