import React, { useState } from 'react';
import {
  X,
  Printer,
  Copy,
  Check,
  Building2,
  Phone,
  MapPin,
  Flame,
  ShieldCheck,
  Sparkles,
  Calendar,
  FileText,
  Clock,
  ArrowRight,
  Scale
} from 'lucide-react';
import {
  FuneralHallEntity,
  FuneralHallQuoteReference,
  FuneralTypePreference
} from '../../funeral-halls/types.js';
import { FuneralHallService } from '../../funeral-halls/funeralHallService.js';
import { TraditionalSeal } from '../design-system/index.js';

interface FuneralHallQuoteModalProps {
  hall: FuneralHallEntity;
  initialType?: FuneralTypePreference;
  onClose: () => void;
}

export const FuneralHallQuoteModal: React.FC<FuneralHallQuoteModalProps> = ({
  hall,
  initialType = 'direct_cremation',
  onClose
}) => {
  const [selectedType, setSelectedType] = useState<FuneralTypePreference>(
    initialType === 'all' ? 'direct_cremation' : initialType
  );
  const [applicantName, setApplicantName] = useState('김정우');
  const [applicantPhone, setApplicantPhone] = useState('010-3849-2910');
  const [copiedMemo, setCopiedMemo] = useState(false);

  // 선택된 장례 형태에 따른 정밀 견적서 생성
  const quote: FuneralHallQuoteReference = FuneralHallService.generateQuoteReference({
    hallId: hall.id,
    funeralType: selectedType,
    stayDays: selectedType === 'direct_cremation' ? 0 : 2,
    applicantName,
    applicantPhone
  });

  const handlePrint = () => {
    window.print();
  };

  const memoText = `[배웅 장례식장 공식 견적서 및 견적 참조번호]
■ 견적 참조번호: ${quote.referenceCode}
■ 이용 장례식장: ${quote.hallName}
■ 시설 소재지: ${quote.hallAddress}
■ 대표 전화: ${quote.hallPhone}
■ 신청인 성명: ${applicantName} (${applicantPhone})
■ 희망 장례 형태: ${quote.funeralTypeName}
■ 최종 시설 실비: ${quote.finalFacilityCost.toLocaleString()}원 (배웅 감면 -${quote.baeungDiscountAmount.toLocaleString()}원 반영)
※ 상담 안내: 공정거래위원회 리베이트 금지 고시 준수 · 부당 알선료 0원 정찰제
※ 본 참조번호(${quote.referenceCode})를 제시하시면 사전 등록 고객 정찰가로 접수됩니다.`;

  const handleCopyMemo = () => {
    navigator.clipboard?.writeText(memoText);
    setCopiedMemo(true);
    setTimeout(() => setCopiedMemo(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0D0E10]/85 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto font-serif">
      <div className="bg-[#FAF9F6] rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl border border-[#E3DFD5] flex flex-col my-auto max-h-[96vh]">
        {/* 상단 컨트롤 툴바 (인쇄 시 숨김: no-print) */}
        <div className="no-print bg-[#121417] text-[#FAF9F6] p-4 px-6 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-[#19382C] text-[#C2A26A] flex items-center justify-center border border-[#2D5A46]">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-reverence font-bold text-base text-[#FAF9F6] flex items-center space-x-2">
                <span>배웅 전국 장례식장 정찰 견적서</span>
                <span className="text-xs font-mono font-normal text-[#C2A26A] bg-[#19382C] px-2 py-0.5 rounded border border-[#2D5A46]">
                  {quote.referenceCode}
                </span>
              </h3>
              <p className="text-[11px] text-[#A8B2A9]">
                공정거래위원회 리베이트 제재 지침 준수 · 100% 정찰제 견적 참조번호 연동
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyMemo}
              className="p-2 sm:px-3 sm:py-1.5 rounded-lg bg-[#FAF9F6]/10 hover:bg-[#FAF9F6]/20 text-[#FAF9F6] text-xs font-serif flex items-center space-x-1.5 transition-colors cursor-pointer border border-white/10"
              title="상담 텍스트 복사"
            >
              {copiedMemo ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copiedMemo ? '복사 완료' : '견적 번호 복사'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="p-2 sm:px-3 sm:py-1.5 rounded-lg bg-[#19382C] hover:bg-[#204738] text-[#FAF9F6] text-xs font-serif flex items-center space-x-1.5 transition-colors cursor-pointer border border-[#2D5A46]"
              title="A4 인쇄"
            >
              <Printer className="w-4 h-4 text-[#C2A26A]" />
              <span className="hidden sm:inline">A4 견적서 인쇄</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-[#FAF9F6]/10 hover:bg-[#FAF9F6]/20 text-[#FAF9F6] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 메인 서식 본문 (A4 인쇄 대응 print-friendly) */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-[#151719] bg-[#FAF9F6] relative">
          {/* 한옥 살창 격자문 은은한 워터마크 배경 */}
          <div className="pointer-events-none absolute inset-0 k-pattern-gyeokja opacity-15" />

          <div className="relative z-10 space-y-6">
            {/* 1. 상단 공문서 헤더 및 발급 인장 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-[#151719] pb-4 gap-4">
              <div>
                <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded bg-[#19382C]/10 text-[#19382C] text-xs font-bold mb-1 border border-[#19382C]/20">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>공정거래위원회 리베이트 금지 고시 준수 확인서</span>
                </div>
                <h1 className="font-reverence font-black text-2xl md:text-3xl text-[#121417] tracking-tight">
                  장례식장 시설 정찰 견적 및 견적 참조서
                </h1>
                <p className="text-xs text-[#5C6166] mt-1 font-serif">
                  본 견적서는 배웅 플랫폼과 공휴 장사정보시스템에 공시된 가격을 기준으로 작성된 정직한 정찰 시설비 명세입니다.
                </p>
              </div>

              <div className="flex items-center space-x-3 shrink-0 self-start sm:self-center">
                <div className="text-right font-serif">
                  <div className="text-[11px] text-[#727782]">견적 식별 고유번호</div>
                  <div className="text-lg md:text-xl font-reverence font-bold text-[#19382C] tracking-wide">
                    {quote.referenceCode}
                  </div>
                  <div className="text-[10px] text-[#9E7D47]">유효기간: {quote.validUntil}</div>
                </div>
                <TraditionalSeal sealKey="truth" size="md" />
              </div>
            </div>

            {/* 2. 장례식장 현장 상담 시 필수 고지 배너 */}
            <div className="p-3.5 bg-[#F0F5F2] border border-[#BFD4CA] rounded-xl flex items-start space-x-3 text-xs leading-relaxed font-serif text-[#19382C]">
              <Scale className="w-5 h-5 shrink-0 text-[#19382C] mt-0.5" />
              <div>
                <b>장례식장 방문 또는 전화 상담 시 안내 요령:</b><br />
                장례식장에 <i>“배웅 견적 참조번호 <b>[{quote.referenceCode}]</b>를 확인하고 연락드렸습니다”</i>라고 말씀하시면,
                장례식장에서도 배웅 유가족임을 확인하고 부당 추가금이나 알선료 거품 없이 <b>공시 정찰가</b>로 상담을 진행합니다.
              </div>
            </div>

            {/* 3. 장례 형태 3대 선택 탭 (화면 전용, 인쇄 시 선택된 형태 고정) */}
            <div className="no-print space-y-2">
              <div className="text-xs font-bold text-[#121417]">희망하시는 장례 형태를 선택하세요:</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  {
                    type: 'direct_cremation' as FuneralTypePreference,
                    icon: '🕊️',
                    title: '무빈소 직송·가족 안치',
                    desc: '빈소 없이 안치실·입관식만 진행',
                    costText: '시설비 약 45만 원 선'
                  },
                  {
                    type: 'small_family' as FuneralTypePreference,
                    icon: '🏡',
                    title: '소규모 가족장 (30평형)',
                    desc: '가족 및 친지 50명 내외 조문',
                    costText: `시설비 약 ${Math.round(hall.dailyRentEstimate * 0.65 * 2 * (1 - hall.discountRate) + 450000).toLocaleString()}원`
                  },
                  {
                    type: 'standard_3day' as FuneralTypePreference,
                    icon: '🏛️',
                    title: '일반 3일장 (표준 55평형)',
                    desc: '조문객 150명 이상 정례 3일장',
                    costText: `시설비 약 ${Math.round(hall.dailyRentEstimate * 2 * (1 - hall.discountRate) + 450000).toLocaleString()}원`
                  }
                ].map((item) => (
                  <button
                    key={item.type}
                    onClick={() => setSelectedType(item.type)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedType === item.type
                        ? 'border-2 border-[#19382C] bg-[#FAF9F6] shadow-sm ring-1 ring-[#19382C]/10'
                        : 'border-[#E3DFD5] bg-[#FFFFFF] hover:bg-[#FAF9F6]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-base">{item.icon}</span>
                      <span className="text-[11px] font-bold text-[#19382C]">{item.costText}</span>
                    </div>
                    <div className="font-reverence font-bold text-sm text-[#121417]">{item.title}</div>
                    <div className="text-[11px] text-[#5C6166] mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. 대상 장례식장 및 유족 기본 인적 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-serif">
              {/* 장례식장 정보 */}
              <div className="p-4 bg-[#FFFFFF] rounded-xl border border-[#E3DFD5] space-y-2">
                <div className="font-bold text-[#121417] flex items-center justify-between border-b border-[#ECE8E0] pb-2">
                  <span className="flex items-center space-x-1.5">
                    <Building2 className="w-4 h-4 text-[#9E7D47]" />
                    <span>시설 기본 정보</span>
                  </span>
                  <span className="text-[11px] text-[#19382C] font-normal">
                    {hall.isBaeungPartner ? '★ 배웅 제휴 감면 시설' : '일반 공시 시설'}
                  </span>
                </div>
                <div className="space-y-1.5 pt-1 text-[#42464E]">
                  <div className="flex justify-between">
                    <span className="text-[#727782]">시설 명칭:</span>
                    <span className="font-bold text-[#151719]">{hall.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#727782]">대표 번호:</span>
                    <span className="font-bold text-[#19382C]">{hall.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#727782]">시설 주소:</span>
                    <span className="text-right truncate max-w-[200px]">{hall.address}</span>
                  </div>
                  {hall.nearestCrematorium && (
                    <div className="flex justify-between text-[#8B2520]">
                      <span>연계 승화원:</span>
                      <span>{hall.nearestCrematorium} (약 {hall.crematoriumTravelMinutes}분)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 신청 유족 정보 (실시간 수정 가능) */}
              <div className="p-4 bg-[#FFFFFF] rounded-xl border border-[#E3DFD5] space-y-2">
                <div className="font-bold text-[#121417] flex items-center justify-between border-b border-[#ECE8E0] pb-2">
                  <span className="flex items-center space-x-1.5">
                    <Clock className="w-4 h-4 text-[#19382C]" />
                    <span>신청 유족 정보</span>
                  </span>
                  <span className="text-[11px] text-[#727782]">직접 수정 가능</span>
                </div>
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[#727782]">신청인(상주):</span>
                    <input
                      type="text"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      className="px-2 py-1 border border-[#E3DFD5] rounded text-right font-medium text-xs w-36 bg-[#FAF9F6] focus:outline-none focus:border-[#19382C]"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#727782]">연락처:</span>
                    <input
                      type="text"
                      value={applicantPhone}
                      onChange={(e) => setApplicantPhone(e.target.value)}
                      className="px-2 py-1 border border-[#E3DFD5] rounded text-right font-medium text-xs w-36 bg-[#FAF9F6] focus:outline-none focus:border-[#19382C]"
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-[#727782] pt-1">
                    <span>발급 일시:</span>
                    <span>{quote.issuedAt}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. 공식 세부 시설 견적서 내역 테이블 */}
            <div className="border border-[#E3DFD5] rounded-xl overflow-hidden bg-[#FFFFFF] shadow-xs">
              <div className="bg-[#121417] text-[#FAF9F6] p-3.5 px-4 flex items-center justify-between font-serif text-xs">
                <span className="font-bold flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-[#C2A26A]" />
                  <span>[{quote.funeralTypeName}] 시설비 항목별 투명 명세</span>
                </span>
                <span className="text-[#BFD4CA]">가격 공시 기준일: {hall.pricingBaseDate || '2023.06 e하늘 공시'}</span>
              </div>

              <div className="p-4 md:p-5 space-y-3 font-serif text-xs md:text-sm">
                {/* 항목 1: 빈소 임대료 */}
                <div className="flex justify-between items-center py-1.5 border-b border-[#ECE8E0]">
                  <div>
                    <span className="font-medium text-[#151719]">분향실(빈소) 임대료</span>
                    <span className="text-[11px] text-[#727782] block">
                      {selectedType === 'direct_cremation'
                        ? '무빈소 진행으로 분향실 사용 안 함 (0일)'
                        : `1일 ${quote.roomDailyRent.toLocaleString()}원 × ${quote.stayDays}일간 사용`}
                    </span>
                  </div>
                  <span className="font-reverence font-bold text-[#151719]">
                    {(quote.roomDailyRent * quote.stayDays).toLocaleString()}원
                  </span>
                </div>

                {/* 항목 2: 안치실 사용료 */}
                <div className="flex justify-between items-center py-1.5 border-b border-[#ECE8E0]">
                  <div>
                    <span className="font-medium text-[#151719]">고인 전용 안치실(냉장) 보관료</span>
                    <span className="text-[11px] text-[#727782] block">
                      1일 150,000원 × {selectedType === 'direct_cremation' ? 2 : quote.stayDays}일간 안전 안치
                    </span>
                  </div>
                  <span className="font-reverence font-bold text-[#151719]">
                    {(quote.coldStorageDailyFee * (selectedType === 'direct_cremation' ? 2 : quote.stayDays)).toLocaleString()}원
                  </span>
                </div>

                {/* 항목 3: 입관실 사용료 */}
                <div className="flex justify-between items-center py-1.5 border-b border-[#ECE8E0]">
                  <div>
                    <span className="font-medium text-[#151719]">전통 습염 및 궁중 입관실 사용료</span>
                    <span className="text-[11px] text-[#727782] block">입관식 1회 사용 기준 (위생 소독 포함)</span>
                  </div>
                  <span className="font-reverence font-bold text-[#151719]">
                    {quote.encoffinmentRoomFee.toLocaleString()}원
                  </span>
                </div>

                {/* 항목 4: 배웅 제휴 감면액 */}
                {quote.baeungDiscountAmount > 0 && (
                  <div className="flex justify-between items-center py-1.5 border-b border-[#ECE8E0] text-[#8B2520]">
                    <div>
                      <span className="font-bold flex items-center space-x-1">
                        <Sparkles className="w-3.5 h-3.5 text-[#9E7D47]" />
                        <span>배웅 사전 등록 제휴 감면 혜택</span>
                      </span>
                      <span className="text-[11px] text-[#8B2520] block">
                        빈소 임대료 {Math.round(hall.discountRate * 100)}% 즉시 차감 감면
                      </span>
                    </div>
                    <span className="font-reverence font-bold text-[#8B2520]">
                      -{quote.baeungDiscountAmount.toLocaleString()}원
                    </span>
                  </div>
                )}

                {/* 합계 */}
                <div className="pt-3 flex justify-between items-center text-sm md:text-base font-bold">
                  <div>
                    <span className="text-[#121417]">장례식장 최종 예상 부담액</span>
                    <span className="text-[11px] text-[#727782] block font-normal">
                      식음료·매점비 및 의전 지도 비용 제외 (시설비 기준 확정 정찰가)
                    </span>
                  </div>
                  <span className="font-reverence font-black text-2xl md:text-3xl text-[#19382C]">
                    {quote.finalFacilityCost.toLocaleString()}원
                  </span>
                </div>
              </div>
            </div>

            {/* 6. 공정위 준수 서약 및 법적 고지문 */}
            <div className="p-4 bg-[#FAF9F6] border border-[#E3DFD5] rounded-xl text-center space-y-1.5 font-serif">
              <div className="text-xs font-bold text-[#19382C] flex items-center justify-center space-x-1.5">
                <Scale className="w-4 h-4 text-[#9E7D47]" />
                <span>공정거래위원회 리베이트 금지 및 표시광고법 100% 준수 보증</span>
              </div>
              <p className="text-[11px] text-[#5C6166] leading-relaxed max-w-2xl mx-auto">
                배웅은 「독점규제 및 공정거래에 관한 법률」 및 공정거래위원회의 상조·장례식장 리베이트 제재 지침을 준수하며,
                장례식장으로부터 어떠한 소개료나 리베이트도 받지 않습니다. 본 견적서는 투명한 공개 정보를 바탕으로 유족의 권익을 보호하기 위해 발급됩니다.
              </p>
            </div>

            {/* 7. 하단 액션 버튼 바 (no-print) */}
            <div className="no-print pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleCopyMemo}
                className="flex-1 py-3.5 px-4 bg-[#FAF9F6] hover:bg-[#F3EFE6] text-[#19382C] border-2 border-[#19382C] rounded-xl font-serif font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                {copiedMemo ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedMemo ? '복사 완료되었습니다' : '견적 번호 & 상담 메모 복사'}</span>
              </button>

              <button
                onClick={handlePrint}
                className="flex-1 py-3.5 px-4 bg-[#19382C] hover:bg-[#204738] active:scale-[0.99] text-[#FAF9F6] rounded-xl font-reverence font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-md transition-all cursor-pointer border border-[#2D5A46]"
              >
                <Printer className="w-4 h-4 text-[#C2A26A]" />
                <span>A4 공식 견적서 인쇄하기</span>
              </button>

              <a
                href={`tel:${hall.phone}`}
                className="py-3.5 px-5 bg-[#121417] hover:bg-[#1E2124] text-[#FAF9F6] rounded-xl font-serif font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all border border-white/10"
              >
                <Phone className="w-4 h-4 text-[#C2A26A]" />
                <span>장례식장 통화</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
