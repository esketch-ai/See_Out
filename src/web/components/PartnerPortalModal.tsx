import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Building2,
  PhoneCall,
  CheckCircle2,
  FileCheck,
  Search,
  Printer,
  ShieldCheck,
  Scale,
  Sparkles,
  ArrowRight,
  Receipt,
  FileText,
  UserCheck,
  Film
} from 'lucide-react';
import { ModalShell, ModalToolbar } from './ModalShell.js';
import { FuneralHallService } from '../../funeral-halls/funeralHallService.js';
import { FuneralHallEntity } from '../../funeral-halls/types.js';
import { FunnelMeasurementEngine } from '../../tracking/funnelMeasurementEngine.js';
import { PartnerPerformanceReport } from '../../tracking/types.js';
import { B2BPartnerAdmissionModal } from './B2BPartnerAdmissionModal.js';
import { PilotProposalLoiModal } from './PilotProposalLoiModal.js';
import { ControlledExperimentModal } from './ControlledExperimentModal.js';
import { ShortformShowcaseModal } from './ShortformShowcaseModal.js';

interface PartnerPortalModalProps {
  initialHallId?: string;
  onClose: () => void;
}

type PortalTab = 'KPI' | 'REF_VERIFIER' | 'TAX_INVOICE';

interface VerifiedRefResult {
  code: string;
  deceasedFamilyName: string;
  packageName: string;
  selectedFuneralHall: string;
  discountRateApplied: number;
  rebateFeeAmount: number;
  assignedDirectorName: string;
  issuedDate: string;
  status: 'ACTIVE_HONORED' | 'EXPIRED';
}

export const PartnerPortalModal: React.FC<PartnerPortalModalProps> = ({
  initialHallId,
  onClose
}) => {
  const allHalls: FuneralHallEntity[] = useMemo(() => {
    return FuneralHallService.getAllHalls();
  }, []);

  const [selectedHallId, setSelectedHallId] = useState<string>(
    initialHallId || allHalls[0]?.id || 'fh-seoul-asan'
  );
  const [activeTab, setActiveTab] = useState<PortalTab>('KPI');
  const [refQuery, setRefQuery] = useState('REF-2026-KR-8812');
  const [verifiedResult, setVerifiedResult] = useState<VerifiedRefResult | null>({
    code: 'REF-2026-KR-8812',
    deceasedFamilyName: '김*수 상주 (유족)',
    packageName: '무빈소 120만 원 정찰제 패키지',
    selectedFuneralHall: '서울아산병원 장례식장',
    discountRateApplied: 30,
    rebateFeeAmount: 0,
    assignedDirectorName: '김진우 수석 장례지도사 (자격 제11-0421호)',
    issuedDate: '2026-09-28',
    status: 'ACTIVE_HONORED'
  });
  const [isAdmissionOpen, setIsAdmissionOpen] = useState(false);
  const [isPilotLoiOpen, setIsPilotLoiOpen] = useState(false);
  const [isExperimentModalOpen, setIsExperimentModalOpen] = useState(false);
  const [isShortformModalOpen, setIsShortformModalOpen] = useState(false);

  const selectedHall = useMemo(() => {
    return allHalls.find((h) => h.id === selectedHallId) || allHalls[0];
  }, [allHalls, selectedHallId]);

  const report: PartnerPerformanceReport = useMemo(() => {
    if (!selectedHall) {
      return FunnelMeasurementEngine.generatePartnerReport('fh-seoul-asan', '서울아산병원 장례식장');
    }
    return FunnelMeasurementEngine.generatePartnerReport(selectedHall.id, selectedHall.name);
  }, [selectedHall]);

  const handleVerifyRef = (codeToTest?: string) => {
    const targetCode = (codeToTest || refQuery).trim().toUpperCase();
    if (!targetCode) return;

    if (targetCode.includes('4192')) {
      setVerifiedResult({
        code: targetCode,
        deceasedFamilyName: '박*현 상주 (유족)',
        packageName: '가족장 180만 원 정찰제 패키지',
        selectedFuneralHall: selectedHall?.name || '삼성서울병원 장례식장',
        discountRateApplied: 30,
        rebateFeeAmount: 0,
        assignedDirectorName: '이성민 선임 장례지도사 (자격 제14-0892호)',
        issuedDate: '2026-09-28',
        status: 'ACTIVE_HONORED'
      });
    } else if (targetCode.includes('7731')) {
      setVerifiedResult({
        code: targetCode,
        deceasedFamilyName: '최*영 상주 (유족)',
        packageName: '일반장 390만 원 정찰제 패키지',
        selectedFuneralHall: selectedHall?.name || '신촌세브란스병원 장례식장',
        discountRateApplied: 30,
        rebateFeeAmount: 0,
        assignedDirectorName: '강태원 팀장 (자격 제16-0129호)',
        issuedDate: '2026-09-27',
        status: 'ACTIVE_HONORED'
      });
    } else {
      setVerifiedResult({
        code: targetCode,
        deceasedFamilyName: '김*수 상주 (유족)',
        packageName: '무빈소 120만 원 정찰제 패키지',
        selectedFuneralHall: selectedHall?.name || '서울아산병원 장례식장',
        discountRateApplied: 30,
        rebateFeeAmount: 0,
        assignedDirectorName: '김진우 수석 장례지도사 (자격 제11-0421호)',
        issuedDate: '2026-09-28',
        status: 'ACTIVE_HONORED'
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <ModalShell
      onClose={onClose}
      maxWidth="max-w-4xl"
      surface="paper"
      serif
      titleId="partner-portal-title"
      descriptionId="partner-portal-desc"
    >
      <ModalToolbar
        titleId="partner-portal-title"
        descriptionId="partner-portal-desc"
        onClose={onClose}
        closeLabel="포털 닫기"
        icon={
          <div className="w-8 h-8 rounded-full bg-[#19382C] text-[#C2A26A] flex items-center justify-center border border-[#2D4F43] shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
        }
        title={<span className="text-lg font-reverence font-bold text-[#FAF9F6]">B2B 장례식장 파트너 비즈니스 포털</span>}
        subtitle="리베이트 0원 약정 & 월 30만 원 정액제 실시간 퍼널 성과 및 견적 검증 시스템"
      >
        <div className="flex items-center space-x-2 flex-wrap">
          <button
            type="button"
            onClick={() => setIsExperimentModalOpen(true)}
            className="px-3.5 py-2 bg-[#19382C] hover:bg-[#2D4F43] text-[#FAF9F6] rounded-md font-serif font-bold text-[13px] flex items-center space-x-1.5 transition-colors cursor-pointer border border-[#2D4F43]"
          >
            <TrendingUp className="w-4 h-4 text-[#C2A26A]" />
            <span>대조군 실험 & 자율 신고</span>
          </button>
          <button
            type="button"
            onClick={() => setIsShortformModalOpen(true)}
            className="px-3.5 py-2 bg-[#19382C] hover:bg-[#2D4F43] text-[#FAF9F6] rounded-md font-serif font-bold text-[13px] flex items-center space-x-1.5 transition-colors cursor-pointer border border-[#2D4F43]"
          >
            <Film className="w-4 h-4 text-[#C2A26A]" />
            <span>숏폼 쇼케이스</span>
          </button>
          <button
            type="button"
            onClick={() => setIsPilotLoiOpen(true)}
            className="px-3.5 py-2 bg-[#19382C] hover:bg-[#2D4F43] text-[#FAF9F6] rounded-md font-serif font-bold text-[13px] flex items-center space-x-1.5 transition-colors cursor-pointer border border-[#2D4F43]"
          >
            <FileText className="w-4 h-4 text-[#C2A26A]" />
            <span>시범 제안서 & LOI</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-[#FAF9F6] rounded-md font-serif font-bold text-[13px] flex items-center space-x-1.5 transition-colors cursor-pointer border border-white/20"
          >
            <Printer className="w-4 h-4 text-[#C2A26A]" />
            <span>성과표 인쇄 / PDF</span>
          </button>
        </div>
      </ModalToolbar>

      <div className="p-4 sm:p-8 space-y-6 bg-[#FAF9F6] overflow-y-auto max-h-[85vh]">
        {/* 장례식장 선택 & 탭 전환 네비게이션 */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#DCD6C9] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <Building2 className="w-6 h-6 text-[#19382C] shrink-0" />
            <div>
              <span className="text-[13px] font-bold text-[#5A5E66] block">
                제휴 장례식장 파트너 지점 선택
              </span>
              <select
                value={selectedHallId}
                onChange={(e) => setSelectedHallId(e.target.value)}
                className="mt-1 font-reverence font-bold text-base text-[#151719] bg-[#FAF9F6] border border-[#DCD6C9] rounded-lg px-3 py-1.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#19382C]"
              >
                {allHalls.map((hall) => (
                  <option key={hall.id} value={hall.id}>
                    {hall.name} ({hall.region})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 3대 탭 버튼 */}
          <div className="flex rounded-xl bg-[#FAF9F6] p-1 border border-[#DCD6C9] shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('KPI')}
              className={`px-3 py-2 rounded-lg font-reverence font-bold text-[13px] transition-all cursor-pointer ${
                activeTab === 'KPI'
                  ? 'bg-[#19382C] text-white shadow-xs'
                  : 'text-[#5A5E66] hover:text-[#151719]'
              }`}
            >
              4단계 퍼널 분석
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('REF_VERIFIER')}
              className={`px-3 py-2 rounded-lg font-reverence font-bold text-[13px] transition-all cursor-pointer ${
                activeTab === 'REF_VERIFIER'
                  ? 'bg-[#19382C] text-white shadow-xs'
                  : 'text-[#5A5E66] hover:text-[#151719]'
              }`}
            >
              견적 참조번호 검증
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('TAX_INVOICE')}
              className={`px-3 py-2 rounded-lg font-reverence font-bold text-[13px] transition-all cursor-pointer ${
                activeTab === 'TAX_INVOICE'
                  ? 'bg-[#19382C] text-white shadow-xs'
                  : 'text-[#5A5E66] hover:text-[#151719]'
              }`}
            >
              정액제 세금계산서
            </button>
          </div>
        </div>

        {/* 탭 1: 4단계 퍼널 분석 */}
        {activeTab === 'KPI' && (
          <div className="space-y-6">
            {/* 4단계 퍼널 카드 그리드 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#DCD6C9] shadow-xs space-y-2">
                <span className="text-[13px] font-bold text-[#5A5E66] block">1단계. 배웅 검색 노출</span>
                <p className="text-2xl sm:text-3xl font-reverence font-black text-[#151719]">
                  {report.impressions.toLocaleString()}
                  <span className="text-sm font-normal text-[#5A5E66] ml-1">회</span>
                </p>
                <p className="text-[13px] text-[#5A5E66]">권역 임종 상담 노출</p>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#DCD6C9] shadow-xs space-y-2">
                <span className="text-[13px] font-bold text-[#5A5E66] block">2단계. 식장 상세 열람</span>
                <p className="text-2xl sm:text-3xl font-reverence font-black text-[#151719]">
                  {report.engagements.toLocaleString()}
                  <span className="text-sm font-normal text-[#5A5E66] ml-1">회</span>
                </p>
                <p className="text-[13px] text-[#19382C] font-bold">
                  열람률 {report.rates.engagementRate.toFixed(1)}%
                </p>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#DCD6C9] shadow-xs space-y-2">
                <span className="text-[13px] font-bold text-[#5A5E66] block">3단계. 안심 050 콜 연결</span>
                <p className="text-2xl sm:text-3xl font-reverence font-black text-[#19382C]">
                  {report.substantialCalls.toLocaleString()}
                  <span className="text-sm font-normal text-[#5A5E66] ml-1">건</span>
                </p>
                <p className="text-[13px] text-[#6E5429] font-bold">
                  통화 전환율 {report.rates.callConnectRate.toFixed(1)}%
                </p>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-[#19382C] shadow-xs space-y-2">
                <span className="text-[13px] font-bold text-[#19382C] block">4단계. REF 견적 제시 유족</span>
                <p className="text-2xl sm:text-3xl font-reverence font-black text-[#8B2520]">
                  {report.quoteReferencesIssued.toLocaleString()}
                  <span className="text-sm font-normal text-[#5A5E66] ml-1">건</span>
                </p>
                <p className="text-[13px] text-[#8B2520] font-bold">
                  현장 방문 확정 (100%)
                </p>
              </div>
            </div>

            {/* 데이터-과금 분리 원칙 보증 배너 */}
            <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#DCD6C9] space-y-3">
              <div className="flex items-center space-x-2 text-[#19382C]">
                <ShieldCheck className="w-5 h-5 text-[#19382C]" />
                <h4 className="font-reverence font-bold text-base text-[#151719]">
                  배웅 플랫폼의 '데이터-과금 분리 (알선 수수료 0원)' 공정 약정
                </h4>
              </div>
              <p className="text-[13px] sm:text-sm text-[#42464E] leading-relaxed">
                배웅은 유족 송객 건수나 빈소 결제 금액에 비례하여 10~30%(건당 50~150만 원)의 불법 리베이트를 요구하지 않습니다.
                장례식장 파트너에게는 <strong>월 30만 원 정액 서비스 이용료</strong>만을 청구하며, 절감된 수수료는 유족의 빈소 30% 감면 혜택으로 전액 환원됩니다.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2 text-[13px]">
                <span className="bg-[#FAF9F6] text-[#19382C] px-3 py-1.5 rounded-lg border border-[#DCD6C9] font-bold">
                  ✓ 유족 송객 리베이트: 0원 (법률 위반 근절)
                </span>
                <span className="bg-[#FAF9F6] text-[#6E5429] px-3 py-1.5 rounded-lg border border-[#DCD6C9] font-bold">
                  ✓ 월정액 이용료: 300,000원 (VAT 별도)
                </span>
                <span className="bg-[#FAF9F6] text-[#151719] px-3 py-1.5 rounded-lg border border-[#DCD6C9] font-bold">
                  ✓ 빈소 사용료 30% 감면 보증
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 탭 2: 견적 참조번호(REF) 즉시 검증기 */}
        {activeTab === 'REF_VERIFIER' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-[#DCD6C9] shadow-xs space-y-4">
              <div className="space-y-1">
                <h3 className="font-reverence font-bold text-base text-[#151719] flex items-center space-x-2">
                  <FileCheck className="w-5 h-5 text-[#19382C]" />
                  <span>배웅 유족 견적 참조번호(REF) 현장 즉시 검증</span>
                </h3>
                <p className="text-[13px] text-[#5A5E66]">
                  현장 방문 유족이 제시한 'REF-2026-KR-XXXX' 참조번호를 입력하시면 배웅 정찰 패키지 및 30% 감면 내역을 즉시 조회합니다.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={refQuery}
                    onChange={(e) => setRefQuery(e.target.value)}
                    placeholder="예: REF-2026-KR-8812"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FAF9F6] border border-[#DCD6C9] rounded-xl font-mono text-[14px] font-bold text-[#151719] focus:outline-none focus:ring-2 focus:ring-[#19382C]"
                  />
                  <Search className="w-5 h-5 text-[#5A5E66] absolute left-3 top-3" />
                </div>
                <button
                  type="button"
                  onClick={() => handleVerifyRef()}
                  className="px-6 py-2.5 bg-[#19382C] hover:bg-[#2D4F43] text-white rounded-xl font-reverence font-bold text-[13px] shrink-0 transition-colors shadow-xs cursor-pointer border border-[#2D4F43]"
                >
                  참조번호 검증
                </button>
              </div>

              {/* 빠른 테스트 칩 */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[13px] text-[#5A5E66] font-bold">빠른 테스트 번호:</span>
                {['REF-2026-KR-8812', 'REF-2026-KR-4192', 'REF-2026-KR-7731'].map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => {
                      setRefQuery(code);
                      handleVerifyRef(code);
                    }}
                    className="px-2.5 py-1 bg-[#FAF9F6] hover:bg-[#F1EDE3] border border-[#DCD6C9] rounded-md font-mono text-[13px] font-bold text-[#19382C] cursor-pointer"
                  >
                    {code}
                  </button>
                ))}
              </div>
            </div>

            {/* 검증 결과 상세 카드 */}
            {verifiedResult && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-[#19382C] shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#DCD6C9] pb-4 gap-2">
                  <div className="space-y-0.5">
                    <span className="text-[13px] font-bold text-[#6E5429]">
                      발행일: {verifiedResult.issuedDate} · 배웅 정찰 의전 시스템
                    </span>
                    <h4 className="font-reverence font-black text-xl text-[#19382C]">
                      {verifiedResult.code} (검증 완료 정상 유효)
                    </h4>
                  </div>
                  <span className="text-[13px] font-bold bg-[#19382C] text-[#DCE8E2] px-3 py-1 rounded-full border border-[#2D4F43] self-start sm:self-auto">
                    30% 감면 및 리베이트 0원 승인필
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px]">
                  <div className="p-3.5 bg-[#FAF9F6] rounded-xl border border-[#DCD6C9] space-y-1">
                    <span className="text-[#5A5E66] block font-bold">방문 유족 (계약 상주):</span>
                    <span className="text-base font-bold text-[#151719] block">{verifiedResult.deceasedFamilyName}</span>
                    <span className="text-[#5A5E66] block">선택 식장: {verifiedResult.selectedFuneralHall}</span>
                  </div>
                  <div className="p-3.5 bg-[#FAF9F6] rounded-xl border border-[#DCD6C9] space-y-1">
                    <span className="text-[#5A5E66] block font-bold">선택 정찰 패키지:</span>
                    <span className="text-base font-bold text-[#19382C] block">{verifiedResult.packageName}</span>
                    <span className="text-[#5A5E66] block">빈소 사용료 {verifiedResult.discountRateApplied}% 즉시 감면 적용</span>
                  </div>
                </div>

                <div className="p-4 bg-[#FAF9F6] rounded-xl border border-[#DCD6C9] flex items-center justify-between text-[13px]">
                  <div className="flex items-center space-x-2">
                    <UserCheck className="w-5 h-5 text-[#19382C]" />
                    <span className="font-bold text-[#151719]">
                      배정 지도사: {verifiedResult.assignedDirectorName}
                    </span>
                  </div>
                  <span className="font-bold text-[#8B2520]">
                    알선 수수료 청구: 0원 (전액 면제)
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 탭 3: 정액제 세금계산서 */}
        {activeTab === 'TAX_INVOICE' && (
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-10 rounded-2xl border border-[#DCD6C9] shadow-sm space-y-6">
              <div className="border-b-2 border-[#151719] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[13px] text-[#6E5429] font-bold tracking-widest block uppercase">
                    Monthly Flat-Rate Tax Invoice
                  </span>
                  <h3 className="text-xl sm:text-2xl font-reverence font-bold text-[#151719]">
                    전자세금계산서 (공급받는자 보관용)
                  </h3>
                </div>
                <div className="text-right text-[13px] font-mono text-[#5A5E66]">
                  <p>승인번호: 20260928-BAEUNG-0912-8812</p>
                  <p>발행일자: 2026년 09월 28일</p>
                </div>
              </div>

              {/* 공급자 & 공급받는자 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px]">
                <div className="p-4 bg-[#FAF9F6] rounded-xl border border-[#DCD6C9] space-y-1.5">
                  <span className="font-bold text-[#19382C] block border-b border-[#DCD6C9] pb-1">
                    공급자 (배웅 플랫폼)
                  </span>
                  <p><strong>상호:</strong> 주식회사 배웅 (SeeOut)</p>
                  <p><strong>사업자번호:</strong> 120-88-12345</p>
                  <p><strong>대표자:</strong> 강민석</p>
                  <p><strong>사업장 주소:</strong> 서울특별시 송파구 올림픽로 300 롯데월드타워</p>
                </div>
                <div className="p-4 bg-[#FAF9F6] rounded-xl border border-[#DCD6C9] space-y-1.5">
                  <span className="font-bold text-[#151719] block border-b border-[#DCD6C9] pb-1">
                    공급받는자 (제휴 장례식장 파트너)
                  </span>
                  <p><strong>상호:</strong> {selectedHall?.name || '서울아산병원 장례식장'}</p>
                  <p><strong>관할 권역:</strong> {selectedHall?.region || '서울특별시'}</p>
                  <p><strong>주소:</strong> {selectedHall?.address || '서울특별시 송파구 올림픽로43길 88'}</p>
                  <p><strong>정산 상태:</strong> 정상 입금 완료 (월정액)</p>
                </div>
              </div>

              {/* 정산 품목 테이블 */}
              <div className="border border-[#DCD6C9] rounded-xl overflow-hidden text-[13px]">
                <table className="w-full text-left divide-y divide-[#DCD6C9]">
                  <thead className="bg-[#FAF9F6] font-bold text-[#151719]">
                    <tr>
                      <th className="p-3">품목명</th>
                      <th className="p-3 text-center">수량</th>
                      <th className="p-3 text-right">공급가액</th>
                      <th className="p-3 text-right">세액 (10%)</th>
                      <th className="p-3 text-right">합계금액</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-[#DCD6C9]">
                    <tr>
                      <td className="p-3 font-bold text-[#151719]">
                        2026년 09월분 배웅 B2B 식장 정보제공 및 안심050 가상번호 중계 서비스
                      </td>
                      <td className="p-3 text-center">1 (월정액)</td>
                      <td className="p-3 text-right font-mono">300,000원</td>
                      <td className="p-3 text-right font-mono">30,000원</td>
                      <td className="p-3 text-right font-mono font-bold text-[#19382C]">330,000원</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 영수 날인 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-[#DCD6C9] gap-4">
                <div className="text-[13px] text-[#5A5E66] space-y-1">
                  <p>• 본 계산서는 부가가치세법 제32조에 의거하여 전자 발급되었습니다.</p>
                  <p>• 유족 알선 수수료 0원 공정 계약에 따라 건별 성공 보수가 일체 청구되지 않습니다.</p>
                </div>
                <div className="flex items-center space-x-2 self-end">
                  <span className="text-base font-reverence font-bold text-[#151719]">
                    주식회사 배웅 대표이사 강민석
                  </span>
                  <span className="k-seal-red px-2 py-0.5 text-[13px]">印</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 신규 식장 입점 안내 푸터 */}
        <div className="p-4 bg-white rounded-xl border border-[#DCD6C9] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-[13px]">
            <p className="font-bold text-[#151719]">
              아직 배웅에 등록되지 않은 장례식장이신가요?
            </p>
            <p className="text-[#5A5E66]">
              공정 거래 심사를 거쳐 전국 1,060개 장례식장 파트너망에 무료 입점 신청을 진행하실 수 있습니다.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAdmissionOpen(true)}
            className="px-4 py-2 bg-[#19382C] hover:bg-[#2D4F43] text-white rounded-lg font-reverence font-bold text-[13px] shrink-0 transition-colors cursor-pointer border border-[#2D4F43]"
          >
            장례식장 입점 신청서 작성
          </button>
        </div>
      </div>

      {isAdmissionOpen && (
        <B2BPartnerAdmissionModal
          initialHall={selectedHall}
          onClose={() => setIsAdmissionOpen(false)}
        />
      )}

      {isPilotLoiOpen && (
        <PilotProposalLoiModal
          initialHall={selectedHall}
          onClose={() => setIsPilotLoiOpen(false)}
        />
      )}

      {isExperimentModalOpen && (
        <ControlledExperimentModal
          isOpen={isExperimentModalOpen}
          onClose={() => setIsExperimentModalOpen(false)}
        />
      )}

      {isShortformModalOpen && (
        <ShortformShowcaseModal
          isOpen={isShortformModalOpen}
          onClose={() => setIsShortformModalOpen(false)}
          initialHallId={selectedHall.id}
        />
      )}
    </ModalShell>
  );
};
