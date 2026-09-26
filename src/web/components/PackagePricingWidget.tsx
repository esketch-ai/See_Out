import React, { useState } from 'react';
import {
  ChevronDown,
  Info,
  ShieldCheck,
  Sparkles,
  Users,
  Car,
  Clock,
  Phone,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Sliders,
  DollarSign
} from 'lucide-react';
import { BAEUNG_PACKAGES, BaeungPackageType, BaeungPackageInfo } from '../../quote-diagnostics/index.js';
import { TraditionalSeal } from '../design-system/index.js';

export const PackagePricingWidget: React.FC = () => {
  const [selectedPackage, setSelectedPackage] = useState<BaeungPackageType>('economic_3day');
  const [openDetail, setOpenDetail] = useState<boolean>(true);

  // 맞춤 패키지 간편 진단기 상태
  const [estimatorGuests, setEstimatorGuests] = useState<'none' | 'small' | 'medium' | 'large'>('medium');
  const [estimatorDays, setEstimatorDays] = useState<'0' | '2' | '3'>('3');

  const packages = Object.values(BAEUNG_PACKAGES);
  const currentPkg = BAEUNG_PACKAGES[selectedPackage];

  // 간편 진단기 추천 로직
  const handleApplyRecommendation = (guests: 'none' | 'small' | 'medium' | 'large', days: '0' | '2' | '3') => {
    setEstimatorGuests(guests);
    setEstimatorDays(days);

    if (days === '0' || guests === 'none') {
      setSelectedPackage('simple_non_hall');
    } else if (days === '2' || guests === 'small') {
      setSelectedPackage('family_2day');
    } else if (guests === 'large') {
      setSelectedPackage('standard_3day');
    } else {
      setSelectedPackage('economic_3day');
    }
  };

  return (
    <div className="bg-[#FFFFFF] rounded-xl shadow-xs border border-[#E3DFD5] p-5 md:p-8 space-y-7">
      {/* 1. 상단 사진 비주얼 헤더 배너 */}
      <div className="relative rounded-lg overflow-hidden h-48 sm:h-56 border border-[#2D2A26] bg-[#121417]">
        <img
          src="/images/hero-memorial.jpg"
          alt="정직 원가 의전 용품 및 제단"
          className="w-full h-full object-cover object-center filter brightness-[0.38] contrast-105"
        />
        {/* 삼국·조선 길상 구름문 은은한 오버레이 */}
        <div className="absolute inset-0 pointer-events-none k-pattern-unmun-dark opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0E10] via-[#0D0E10]/50 to-transparent flex flex-col justify-end p-6 md:p-8 relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded bg-[#19382C]/90 text-[#FAF9F6] text-xs font-serif border border-[#2A5442]">
              <TraditionalSeal sealKey="sincerity" size="sm" />
              <span>선금 0원 · 100% 후불 정산제</span>
            </div>
            <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded bg-[#9E7D47]/20 text-[#E8C88B] text-xs font-serif border border-[#9E7D47]/40">
              <ShieldCheck className="w-3.5 h-3.5 text-[#E8C88B]" />
              <span>노잣돈·수고비 요구 시 200% 보상</span>
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-reverence font-black text-[#FAF9F6] tracking-tight">
            배웅 정직 원가 정찰제 의전 안내
          </h2>
          <p className="text-[#D4CEC2] text-xs sm:text-sm font-serif mt-1 max-w-2xl leading-relaxed">
            유족의 슬픔과 경황없음을 틈탄 어떠한 업셀링이나 강매도 없습니다. 의전의 품격을 지키며 4대 정찰 패키지의 모든 원가를 투명하게 공개합니다.
          </p>
        </div>
      </div>

      {/* 2. [신규 인터랙티브] 나에게 딱 맞는 패키지 3초 간편 진단기 */}
      <div className="bg-[#FAF8F5] border border-[#E3DFD5] rounded-xl p-5 md:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#ECE8E0] pb-3">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-[#9E7D47]" />
            <h3 className="font-serif font-bold text-sm md:text-base text-[#151719]">
              나에게 딱 맞는 정찰 패키지 간편 진단
            </h3>
          </div>
          <span className="text-xs text-[#727782] font-serif">
            예상 조문객 규모와 일정을 선택하시면 최적 패키지가 자동 추천됩니다
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-serif">
          {/* 조문객 규모 선택 */}
          <div>
            <span className="text-[#5C6166] font-bold block mb-2">① 예상 조문객 규모</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {[
                { id: 'none', label: '가족만 (무조문)' },
                { id: 'small', label: '친지 30~50인' },
                { id: 'medium', label: '일반 100~150인' },
                { id: 'large', label: '대형 250인 이상' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleApplyRecommendation(item.id as any, estimatorDays)}
                  className={`py-2 px-2 rounded border text-center transition-all cursor-pointer ${
                    estimatorGuests === item.id
                      ? 'bg-[#19382C] text-white border-[#19382C] font-bold shadow-2xs'
                      : 'bg-[#FFFFFF] text-[#42464E] border-[#E3DFD5] hover:border-[#9E7D47]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 장례 일정 선택 */}
          <div>
            <span className="text-[#5C6166] font-bold block mb-2">② 장례 일정 형식</span>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: '0', label: '무빈소 직장 (0일)' },
                { id: '2', label: '2일 가족장 (48시간)' },
                { id: '3', label: '3일 일반장 (72시간)' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleApplyRecommendation(estimatorGuests, item.id as any)}
                  className={`py-2 px-2 rounded border text-center transition-all cursor-pointer ${
                    estimatorDays === item.id
                      ? 'bg-[#19382C] text-white border-[#19382C] font-bold shadow-2xs'
                      : 'bg-[#FFFFFF] text-[#42464E] border-[#E3DFD5] hover:border-[#9E7D47]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 실시간 추천 결과 박스 */}
        <div className="bg-[#FFFFFF] rounded-lg border border-[#D9D3C7] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-serif">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded bg-[#F8F5EE] text-[#9E7D47] font-bold text-xs border border-[#E8DFCF]">
              추천 패키지
            </span>
            <span className="font-reverence font-bold text-[#151719] text-sm md:text-base">
              {currentPkg.name} ({currentPkg.price.toLocaleString()}원)
            </span>
          </div>
          <div className="text-xs text-[#19382C] font-bold flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-[#9E7D47]" />
            <span>기존 대형 상조(약 700~850만 원) 대비 약 400~550만 원 절감</span>
          </div>
        </div>
      </div>

      {/* 3. 4대 정찰 패키지 선택 탭 카드 그리드 */}
      <div>
        <div className="flex items-center justify-between text-xs font-serif font-bold text-[#727782] mb-3 px-1">
          <span>배웅 4대 정직 원가 정찰 패키지 라인업</span>
          <span className="text-[11px] text-[#9E7D47]">원하시는 패키지를 탭하시면 상세 명세를 확인하실 수 있습니다</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {packages.map((pkg) => {
            const isSelected = selectedPackage === pkg.type;
            return (
              <button
                key={pkg.type}
                onClick={() => setSelectedPackage(pkg.type)}
                className={`p-4 md:p-5 rounded-xl text-left border transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-2 border-[#19382C] bg-[#F7F5F0] shadow-sm ring-1 ring-[#19382C]/10'
                    : 'border-[#E3DFD5] hover:border-[#9E7D47]/70 bg-[#FAF9F6]'
                }`}
              >
                {/* 선택 활성화 인디케이터 배지 */}
                {isSelected && (
                  <div className="absolute -top-2.5 right-3 bg-[#19382C] text-[#FAF9F6] text-[10px] font-serif font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center space-x-0.5">
                    <CheckCircle2 className="w-3 h-3 text-[#C2A26A]" />
                    <span>선택됨</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[11px] font-serif font-bold text-[#876937] bg-[#F8F5EE] px-2 py-0.5 rounded border border-[#E8DFCF]">
                      {pkg.badge || '정찰 패키지'}
                    </span>
                    <span className="text-[10px] font-serif text-[#727782]">
                      {pkg.stayDays === 0 ? '무빈소' : `${pkg.stayDays}일장`}
                    </span>
                  </div>

                  <h4 className="font-reverence font-bold text-base md:text-lg text-[#151719] mt-2">
                    {pkg.name.replace('배웅 ', '')}
                  </h4>

                  <div className="text-2xl md:text-3xl font-reverence font-black text-[#19382C] mt-1.5">
                    {pkg.price.toLocaleString()}
                    <span className="text-sm font-normal text-[#5C6166] ml-0.5">원</span>
                  </div>

                  <p className="text-xs text-[#5C6166] mt-2 font-serif leading-relaxed line-clamp-2">
                    {pkg.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#ECE8E0] space-y-1.5 text-[11px] font-serif">
                  <div className="flex items-center space-x-1.5 text-[#42464E]">
                    <Users className="w-3.5 h-3.5 text-[#9E7D47] shrink-0" />
                    <span className="truncate">{pkg.targetGuests}</span>
                  </div>
                  {pkg.staffSummary && (
                    <div className="flex items-center space-x-1.5 text-[#5C6166]">
                      <Clock className="w-3.5 h-3.5 text-[#19382C] shrink-0" />
                      <span className="truncate">{pkg.staffSummary}</span>
                    </div>
                  )}
                  {pkg.vehicleSummary && (
                    <div className="flex items-center space-x-1.5 text-[#5C6166]">
                      <Car className="w-3.5 h-3.5 text-[#9E7D47] shrink-0" />
                      <span className="truncate">{pkg.vehicleSummary}</span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. [완벽 분리 공시 안내] 상조 의전비 vs 장례식장 시설비 헷갈림 방지 가이드 */}
      <div className="rounded-xl border border-[#D9D3C7] bg-[#FAF8F5] p-5 md:p-6 space-y-4">
        <div className="flex items-start space-x-2.5">
          <AlertCircle className="w-5 h-5 text-[#9E7D47] shrink-0 mt-0.5" />
          <div>
            <h3 className="font-serif font-bold text-sm md:text-base text-[#151719]">
              장례 비용 완벽 분리 공시: 무엇이 포함되고 무엇이 별도인가요?
            </h3>
            <p className="text-xs text-[#727782] font-serif mt-0.5 leading-relaxed">
              기존 상조회사의 "전부 다 해준다"는 과장 광고로 인해 나중에 장례식장 밥값/임대료로 수백만 원이 추가되어 겪는 유족들의 혼란과 불만을 사전에 100% 차단합니다.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-serif">
          {/* 4-A. 배웅 정찰 패키지 포함 내역 */}
          <div className="bg-[#FFFFFF] border-2 border-[#19382C]/30 rounded-lg p-4 space-y-2.5 shadow-2xs">
            <div className="flex items-center justify-between border-b border-[#E3DFD5] pb-2">
              <span className="font-bold text-xs md:text-sm text-[#19382C] flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#19382C]" />
                <span>배웅 패키지 100% 포함 항목 (상조 의전)</span>
              </span>
              <span className="text-[11px] font-bold bg-[#F0F5F2] text-[#19382C] px-2 py-0.5 rounded">
                선금 0원 후불제
              </span>
            </div>
            <ul className="text-xs text-[#42464E] space-y-1.5">
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#19382C]" />
                <span><b>국가공인 1급 장례지도사 24시간 전담</b> (입관·발인·화장 접수)</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#19382C]" />
                <span><b>전문 의전도우미</b> (표준 시급제 준수 / 촌지 일체 금지)</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#19382C]" />
                <span><b>오동나무 규격관 및 특등 수의</b> (원산지 100% 완전 공개)</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#19382C]" />
                <span><b>현대식 상복 양복/한복 세트</b> (미사용 시 1벌당 3만 원 환급)</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#19382C]" />
                <span><b>고급 리무진 및 45인승 대형 버스</b> 운구 이동 지원</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#19382C]" />
                <span><b>모바일 부고장·답례장 무제한 무료</b> 및 라이프 아카이브 연동</span>
              </li>
            </ul>
          </div>

          {/* 4-B. 장례식장 별도 직접 결제 실비 내역 */}
          <div className="bg-[#FFFFFF] border border-[#E3DFD5] rounded-lg p-4 space-y-2.5 shadow-2xs">
            <div className="flex items-center justify-between border-b border-[#E3DFD5] pb-2">
              <span className="font-bold text-xs md:text-sm text-[#876937] flex items-center space-x-1.5">
                <Info className="w-4 h-4 text-[#876937]" />
                <span>장례식장 별도 결제 실비 (식장 직납)</span>
              </span>
              <span className="text-[11px] font-bold bg-[#FAF6EE] text-[#876937] px-2 py-0.5 rounded border border-[#E8DFCF]">
                배웅 제휴 시 30% 감면
              </span>
            </div>
            <ul className="text-xs text-[#5C6166] space-y-1.5">
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#9E7D47]" />
                <span><b>빈소 임대료 및 안치료</b> (이용 일수 및 평형별로 식장에 결제)</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#9E7D47]" />
                <span><b>조문객 식음료비</b> (밥, 국, 안주, 주류 등 실제 드신 만큼 결제)</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#9E7D47]" />
                <span><b>제단 생화 꽃장식</b> (기본 꽃장식은 식장 또는 배웅 직거래망 선택 가능)</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#9E7D47]" />
                <span><b>승화원 화장 접수비</b> (시립 기준 관내 주민 약 10~16만 원 내외)</span>
              </li>
            </ul>
            <div className="mt-2 pt-2 border-t border-[#ECE8E0] text-[11px] text-[#19382C] font-bold">
              💡 배웅 제휴 장례식장 이용 시 빈소 임대료를 최대 30% 즉시 현장 감면받으실 수 있습니다.
            </div>
          </div>
        </div>
      </div>

      {/* 5. 선택된 패키지 원가 상세 명세 및 5대 영역 스펙 아코디언 */}
      <div className="border border-[#E3DFD5] rounded-xl overflow-hidden bg-[#FAF9F6]">
        <button
          onClick={() => setOpenDetail(!openDetail)}
          className="w-full bg-[#FAF9F6] p-4 md:px-5 flex items-center justify-between font-serif font-bold text-[#151719] text-sm md:text-base hover:bg-[#F2EEE6] transition-colors cursor-pointer border-b border-[#E3DFD5]"
        >
          <div className="flex items-center space-x-2">
            <Info className="w-4 h-4 text-[#9E7D47]" />
            <span>
              선택하신 [{currentPkg.name}] 5대 영역별 상세 원가 명세표
            </span>
          </div>
          <div className="flex items-center space-x-2 text-xs font-normal text-[#727782]">
            <span>{openDetail ? '명세 닫기' : '명세 펼치기'}</span>
            <ChevronDown className={`w-4 h-4 text-[#727782] transition-transform ${openDetail ? 'rotate-180' : ''}`} />
          </div>
        </button>

        {openDetail && (
          <div className="p-5 md:p-6 bg-[#FFFFFF] space-y-4 font-serif">
            {/* 5대 영역 상세 스펙 테이블 */}
            <div className="border border-[#E3DFD5] rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left divide-y divide-[#E3DFD5]">
                <thead className="bg-[#FAF9F6] text-[#727782] font-medium">
                  <tr>
                    <th className="py-2.5 px-3 w-28">의전 영역</th>
                    <th className="py-2.5 px-3 w-40">품목 및 인력 규격</th>
                    <th className="py-2.5 px-3">원가 투명 명세 및 약정 기준</th>
                    <th className="py-2.5 px-3 w-32 text-right">미사용 환급</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ECE8E0] bg-[#FFFFFF]">
                  {currentPkg.specs?.map((spec, idx) => (
                    <tr key={idx} className="hover:bg-[#FAF9F6]">
                      <td className="py-3 px-3 font-bold text-[#876937]">
                        {spec.category}
                      </td>
                      <td className="py-3 px-3 font-medium text-[#151719]">
                        {spec.title}
                        {spec.origin && (
                          <span className="block text-[10px] text-[#727782] font-normal mt-0.5">
                            [{spec.origin}]
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-[#5C6166] leading-relaxed">
                        {spec.detail}
                      </td>
                      <td className="py-3 px-3 text-right text-[11px] font-medium text-[#19382C]">
                        {spec.refundNotice || '정액 포함'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 미사용 품목 정직 환급제 안내 배너 */}
            <div className="bg-[#F0F5F2] border border-[#BFD4CA] rounded-lg p-3.5 flex items-center justify-between text-xs text-[#19382C]">
              <div className="flex items-center space-x-2">
                <RotateCcw className="w-4 h-4 text-[#19382C] shrink-0" />
                <span className="font-bold">
                  미사용 품목 정직 환급제: 장례 중 사용하지 않은 상복이나 이동 차량은 최종 결제 시 100% 정직하게 공제 환급됩니다.
                </span>
              </div>
              <span className="text-[11px] text-[#19382C] underline hidden sm:inline">약관 규정 준수</span>
            </div>
          </div>
        )}
      </div>

      {/* 6. 4대 제로(Zero) 안심 보증 헌장 */}
      <div className="bg-[#FAF9F6] border border-[#E3DFD5] rounded-xl p-5 md:p-6 space-y-4">
        <div className="flex items-center space-x-2 border-b border-[#ECE8E0] pb-3">
          <ShieldCheck className="w-5 h-5 text-[#9E7D47]" />
          <h3 className="font-serif font-bold text-sm md:text-base text-[#151719]">
            배웅 4대 제로(Zero) 안심 보증 헌장
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-serif">
          <div className="p-3.5 rounded-lg bg-[#FFFFFF] border border-[#E3DFD5] space-y-1">
            <div className="font-bold text-[#19382C] flex items-center space-x-1">
              <span className="text-sm">①</span>
              <span>선금 0원 / 후불 정산제</span>
            </div>
            <p className="text-[#5C6166] leading-relaxed">
              사전 가입비, 월 납입금 일체 0원. 발인 후 모든 의전이 정상 완료된 뒤 결제합니다.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#FFFFFF] border border-[#E3DFD5] space-y-1">
            <div className="font-bold text-[#8B2520] flex items-center space-x-1">
              <span className="text-sm">②</span>
              <span>촌지·수고비 요구 0원</span>
            </div>
            <p className="text-[#5C6166] leading-relaxed">
              지도사, 도우미의 촌지 요구는 법적으로 금지되며, 요구 시 200% 배상합니다.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#FFFFFF] border border-[#E3DFD5] space-y-1">
            <div className="font-bold text-[#876937] flex items-center space-x-1">
              <span className="text-sm">③</span>
              <span>현장 강매·업셀링 0원</span>
            </div>
            <p className="text-[#5C6166] leading-relaxed">
              사전 약정 외 불필요한 고가 수의/유골함 강매 발생 시 해당 품목을 전액 무료 제공합니다.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#FFFFFF] border border-[#E3DFD5] space-y-1">
            <div className="font-bold text-[#19382C] flex items-center space-x-1">
              <span className="text-sm">④</span>
              <span>미사용 품목 정직 환급</span>
            </div>
            <p className="text-[#5C6166] leading-relaxed">
              덜 입은 상복, 미사용 차량 등 실제 쓰지 않은 품목은 계약금에서 100% 공제 환급됩니다.
            </p>
          </div>
        </div>
      </div>

      {/* 7. 하단 24시 긴급 접수 및 상담 콜투액션 */}
      <div className="bg-[#121417] text-[#FAF9F6] rounded-xl p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded bg-[#19382C] text-[#FAF9F6] text-xs font-serif mb-1.5 border border-[#2A5442]">
            <span>전국 2시간 이내 현장 출동 네트워크</span>
          </div>
          <h4 className="text-lg md:text-xl font-reverence font-bold text-[#FAF9F6]">
            지금 장례가 발생하셨거나, 사전 대비 상담이 필요하신가요?
          </h4>
          <p className="text-xs text-[#D8CEBA] font-serif mt-0.5">
            24시간 1급 장례지도사가 대기 중입니다. 언제든 부담 없이 연락 주시면 가장 정직한 길을 안내해 드립니다.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 shrink-0">
          <a
            href="tel:1588-0000"
            className="py-3 px-5 bg-[#19382C] hover:bg-[#204738] text-[#FAF9F6] border border-[#2D5A46] rounded-md font-serif font-bold text-xs md:text-sm flex items-center justify-center space-x-2 transition-all shadow-xs"
          >
            <Phone className="w-4 h-4 text-[#C2A26A]" />
            <span>24시 긴급 출동 요청 (1588-0000)</span>
          </a>
        </div>
      </div>
    </div>
  );
};
