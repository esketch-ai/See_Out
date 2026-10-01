import React, { useState, useMemo } from 'react';
import {
  FileText,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Scale,
  TrendingUp,
  Printer,
  ChevronRight,
  Sparkles,
  Phone,
  Mail,
  Award,
  Video,
  Layers,
  ArrowRight,
  Film
} from 'lucide-react';
import { FuneralHallEntity } from '../../funeral-halls/types.js';
import { FuneralHallService } from '../../funeral-halls/funeralHallService.js';
import {
  PilotLoiService,
  PilotLoiSubmission,
  PilotLoiDocument,
  PilotAdPackageType
} from '../../b2b/index.js';
import { ModalShell, ModalToolbar } from './ModalShell.js';
import { ShortformShowcaseModal } from './ShortformShowcaseModal.js';

export interface PilotProposalLoiModalProps {
  initialHall?: FuneralHallEntity;
  onClose: () => void;
}

export const PilotProposalLoiModal: React.FC<PilotProposalLoiModalProps> = ({
  initialHall,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'proposal' | 'form' | 'status'>('proposal');

  // 시범 권역 38개소 목록
  const pilotHalls = useMemo(() => FuneralHallService.getPilotRegionHalls(), []);
  const proposalData = useMemo(() => PilotLoiService.getProposalDocument(), []);
  const statusSummary = useMemo(() => PilotLoiService.getPilotLoiStatusSummary(), [activeTab]);

  // LOI 신청 폼 상태
  const [selectedHallId, setSelectedHallId] = useState<string>(initialHall?.id || (pilotHalls[0]?.id || ''));
  const currentSelectedHall = useMemo(
    () => pilotHalls.find((h) => h.id === selectedHallId) || initialHall,
    [selectedHallId, pilotHalls, initialHall]
  );

  const [hallName, setHallName] = useState(currentSelectedHall?.name || '');
  const [pilotDistrict, setPilotDistrict] = useState(currentSelectedHall?.pilotDistrict || '성남시');
  const [directorName, setDirectorName] = useState('');
  const [contactPhone, setContactPhone] = useState(currentSelectedHall?.phone || '');
  const [contactEmail, setContactEmail] = useState('');
  const [businessNumber, setBusinessNumber] = useState('');
  const [adPackage, setAdPackage] = useState<PilotAdPackageType>('PRIORITY_SLOT_STANDARD');
  const [offeredDiscountRate, setOfferedDiscountRate] = useState<number>(20);
  const [flatRateAgreed, setFlatRateAgreed] = useState(true);
  const [antiRebatePledge, setAntiRebatePledge] = useState(true);
  const [signatureName, setSignatureName] = useState('');

  const [submittedLoi, setSubmittedLoi] = useState<PilotLoiDocument | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isShortformModalOpen, setIsShortformModalOpen] = useState(false);

  // 식장 드롭다운 변경 시 자동 채움
  const handleSelectHallChange = (id: string) => {
    setSelectedHallId(id);
    const hall = pilotHalls.find((h) => h.id === id);
    if (hall) {
      setHallName(hall.name);
      setPilotDistrict(hall.pilotDistrict || '수도권');
      setContactPhone(hall.phone);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      const submission: PilotLoiSubmission = {
        hallId: selectedHallId || undefined,
        hallName,
        region: currentSelectedHall?.region || '서울특별시',
        pilotDistrict,
        directorName,
        contactPhone,
        contactEmail,
        businessNumber,
        adPackage,
        offeredDiscountRate,
        flatRateAgreed,
        antiRebatePledge,
        trialPeriodMonths: 3,
        signatureName
      };

      const doc = PilotLoiService.submitLoi(submission);
      setSubmittedLoi(doc);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('참여의향서 접수 중 오류가 발생했습니다.');
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <ModalShell
      onClose={onClose}
      maxWidth="max-w-4xl"
      maxHeight="max-h-[92vh]"
      surface="paper"
      overlayScroll
      titleId="pilot-proposal-title"
      descriptionId="pilot-proposal-desc"
    >
      <ModalToolbar
        titleId="pilot-proposal-title"
        descriptionId="pilot-proposal-desc"
        onClose={onClose}
        closeLabel="제안서 닫기"
        icon={
          <div className="w-8 h-8 rounded-full bg-[#19382C] text-[#C2A26A] flex items-center justify-center border border-[#2D4F43] shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
        }
        title={
          <div className="flex items-center space-x-2 flex-wrap">
            <span>배웅 1단계 시범 권역 B2B 상생 제안서 및 LOI</span>
            <span className="text-[0.8125rem] bg-[#19382C] text-[#FAF9F6] px-2 py-0.5 rounded border border-[#2D4F43]">
              강남4구·성남 시범
            </span>
          </div>
        }
        subtitle={
          <span id="pilot-proposal-desc">
            월 30만원 100% 정액 광고 파트너십 · 건당 알선료 배제 · 공정위 리베이트 제재 안전 지침 준수
          </span>
        }
      >
        {submittedLoi && (
          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-1.5 bg-[#19382C] hover:bg-[#2D4F43] text-white rounded-md font-serif font-bold text-[0.8125rem] flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer border border-[#2D4F43]"
          >
            <Printer className="w-3.5 h-3.5 text-[#C2A26A]" />
            <span>LOI 증서 인쇄</span>
          </button>
        )}
      </ModalToolbar>

      {/* 내부 3단 탭 내비게이션 */}
      <div className="bg-[#FAF9F6] border-b border-[#DCD6C9] px-6 pt-3 flex gap-2 overflow-x-auto text-[0.8125rem] font-serif shrink-0">
        <button
          type="button"
          onClick={() => setActiveTab('proposal')}
          className={`pb-2.5 px-3 border-b-2 font-bold cursor-pointer transition-all ${
            activeTab === 'proposal'
              ? 'border-[#19382C] text-[#19382C]'
              : 'border-transparent text-[#5A5E66] hover:text-[#151719]'
          }`}
        >
          📄 1-Page 핵심 사업제안서
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('form')}
          className={`pb-2.5 px-3 border-b-2 font-bold cursor-pointer transition-all ${
            activeTab === 'form'
              ? 'border-[#19382C] text-[#19382C]'
              : 'border-transparent text-[#5A5E66] hover:text-[#151719]'
          }`}
        >
          ✍️ 참여의향서(LOI) 작성 및 증서 발급
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('status')}
          className={`pb-2.5 px-3 border-b-2 font-bold cursor-pointer transition-all flex items-center space-x-1.5 ${
            activeTab === 'status'
              ? 'border-[#19382C] text-[#19382C]'
              : 'border-transparent text-[#5A5E66] hover:text-[#151719]'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 text-[#6E5429]" />
          <span>시범 권역 LOI 유치 현황 ({statusSummary.currentLoiCount}/{statusSummary.targetLoiCount}곳)</span>
        </button>
      </div>

      <div className="p-6 overflow-y-auto space-y-6">
        {/* ─── [탭 1: 1-Page 핵심 사업제안서] ─── */}
        {activeTab === 'proposal' && (
          <div className="space-y-6 font-serif">
            {/* 상단 헤더 요약 */}
            <div className="bg-[#FFFFFF] p-6 rounded-xl border border-[#DCD6C9] shadow-xs space-y-4">
              <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded bg-[#DCE8E2] text-[#19382C] text-[0.8125rem] font-bold border border-[#DCE8E2]">
                <Scale className="w-3.5 h-3.5 text-[#6E5429]" />
                <span>2026.03 공정거래위원회 리베이트 제재 회피 정액 광고 모델</span>
              </div>
              <h3 className="text-xl md:text-2xl font-reverence font-black text-[#151719]">
                {proposalData.title}
              </h3>
              <p className="text-[#5A5E66] text-sm leading-relaxed">
                {proposalData.subtitle}
              </p>

              <div className="bg-[#FAF9F6] p-4 rounded-lg border border-[#DCD6C9] space-y-2">
                <span className="text-[0.8125rem] font-bold text-[#151719] block">시장 환경 및 사업 전환 배경:</span>
                <ul className="text-[0.8125rem] text-[#5A5E66] space-y-1 list-disc list-inside">
                  {proposalData.marketContext.map((c, idx) => (
                    <li key={idx} className="min-w-0 break-words">{c}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 4대 핵심 참여 혜택 카드 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {proposalData.coreBenefits.map((b, idx) => (
                <div key={idx} className="bg-[#FFFFFF] p-5 rounded-lg border border-[#DCD6C9] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#19382C] text-base">{b.title}</span>
                    <span className="text-[0.8125rem] font-bold bg-[#DCE8E2] text-[#19382C] px-2 py-0.5 rounded">
                      {b.highlight}
                    </span>
                  </div>
                  <p className="text-[1.125rem] text-[#5A5E66] leading-relaxed min-w-0 break-words">
                    {b.description}
                  </p>
                </div>
              ))}
            </div>

            {/* 2대 요금 플랜 비교표 */}
            <div className="bg-[#FFFFFF] p-6 rounded-xl border border-[#DCD6C9] shadow-xs space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h4 className="font-reverence font-bold text-lg text-[#151719]">
                  시범 권역 2대 정액 광고 상품
                </h4>
                <span className="text-[0.8125rem] text-[#6E5429]">
                  ※ 건당 알선료 0원 · 오직 월 정액제(VAT 별도)로만 과금됩니다
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {proposalData.pricingPlans.map((p) => (
                  <div
                    key={p.type}
                    className={`p-5 rounded-lg border-2 space-y-3 ${
                      p.isRecommended
                        ? 'border-[#19382C] bg-[#FAF9F6]'
                        : 'border-[#DCD6C9] bg-[#FFFFFF]'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        {p.isRecommended && (
                          <span className="text-[0.8125rem] font-bold bg-[#19382C] text-[#FAF9F6] px-2 py-0.5 rounded mb-1 inline-block">
                            시범 권역 권장
                          </span>
                        )}
                        <h5 className="font-bold text-base text-[#151719]">{p.name}</h5>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-black text-[#19382C]">
                          월 {p.monthlyPrice.toLocaleString()}원
                        </span>
                      </div>
                    </div>

                    <ul className="text-[0.8125rem] text-[#5A5E66] space-y-1.5 pt-2 border-t border-[#DCD6C9]">
                      {p.features.map((f, i) => (
                        <li key={i} className="flex items-start space-x-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#19382C] shrink-0 mt-0.5" />
                          <span className="min-w-0 break-words">{f}</span>
                        </li>
                      ))}
                    </ul>

                    {p.type === 'SHORTFORM_CONTENT_BUNDLE' && (
                      <button
                        type="button"
                        onClick={() => setIsShortformModalOpen(true)}
                        className="w-full mt-2 py-1.5 px-3 bg-[#FAF9F6] hover:bg-[#F1E9DB] text-[#19382C] border border-[#DCD6C9] rounded text-[0.8125rem] font-bold flex items-center justify-center space-x-1.5 cursor-pointer transition-colors"
                      >
                        <Film className="w-3.5 h-3.5 text-[#9E7D47]" />
                        <span>숏폼 제작 포트폴리오 4대 테마 샘플 보기</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 시범 권역 보증 및 CTA 배너 */}
            <div className="bg-[#FAF9F6] p-5 rounded-xl border border-[#2D4F43] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <span className="font-bold text-[#19382C] text-base block">
                  3개월 시범 참여 확약 (권역 38개소 중 8개소 한정)
                </span>
                <span className="text-[0.8125rem] text-[#5A5E66] block">
                  최초 3개월 운영 후 연장 여부를 자유롭게 결정하실 수 있습니다. (중도 해지 위약금 0원)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('form')}
                className="px-5 py-2.5 bg-[#19382C] hover:bg-[#2D4F43] text-white rounded-md font-bold text-[0.8125rem] flex items-center space-x-1.5 shrink-0 transition-all shadow-xs cursor-pointer"
              >
                <span>참여의향서(LOI) 작성하기</span>
                <ArrowRight className="w-4 h-4 text-[#C2A26A]" />
              </button>
            </div>
          </div>
        )}

        {/* ─── [탭 2: 참여의향서(LOI) 작성 및 증서 발급] ─── */}
        {activeTab === 'form' && (
          <div className="space-y-6 font-serif">
            {submittedLoi ? (
              // 제출 완료 증서 뷰
              <div className="bg-[#FFFFFF] p-8 rounded-xl border-2 border-[#19382C] shadow-md space-y-6">
                <div className="text-center space-y-2 pb-6 border-b border-[#DCD6C9]">
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded bg-[#DCE8E2] text-[#19382C] text-[0.8125rem] font-bold">
                    <CheckCircle2 className="w-4 h-4 text-[#19382C]" />
                    <span>시범 권역 참여의향서(LOI) 접수 완료</span>
                  </div>
                  <h3 className="text-2xl font-reverence font-black text-[#151719] mt-2">
                    배웅(BAEUNG) B2B 시범 제휴 참여의향서
                  </h3>
                  <p className="text-[0.8125rem] text-[#6E5429]">
                    문서번호: <span className="font-mono font-bold text-[#151719]">{submittedLoi.loiNumber}</span>
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[0.8125rem] bg-[#FAF9F6] p-4 rounded-lg border border-[#DCD6C9]">
                  <div>
                    <span className="text-[#5A5E66] block">장례식장 상호:</span>
                    <span className="font-bold text-[#151719] text-base">{submittedLoi.hallName}</span>
                  </div>
                  <div>
                    <span className="text-[#5A5E66] block">시범 자치구:</span>
                    <span className="font-bold text-[#19382C] text-base">{submittedLoi.pilotDistrict}</span>
                  </div>
                  <div>
                    <span className="text-[#5A5E66] block">대표자/담당자 성함:</span>
                    <span className="font-bold text-[#151719]">{submittedLoi.directorName}</span>
                  </div>
                  <div>
                    <span className="text-[#5A5E66] block">직통 연락처:</span>
                    <span className="font-bold text-[#151719]">{submittedLoi.contactPhone}</span>
                  </div>
                  <div>
                    <span className="text-[#5A5E66] block">선택 광고 상품:</span>
                    <span className="font-bold text-[#19382C]">{submittedLoi.adPackageName}</span>
                  </div>
                  <div>
                    <span className="text-[#5A5E66] block">월 정액 광고료:</span>
                    <span className="font-bold text-[#151719]">월 {submittedLoi.monthlyAdFee.toLocaleString()}원 (정액제)</span>
                  </div>
                  <div>
                    <span className="text-[#5A5E66] block">유족 제공 빈소 감면율:</span>
                    <span className="font-bold text-[#19382C]">{submittedLoi.offeredDiscountRate}% 정찰 감면</span>
                  </div>
                  <div>
                    <span className="text-[#5A5E66] block">시범 보증 유효기간:</span>
                    <span className="font-bold text-[#151719]">{submittedLoi.issuedAt} ~ {submittedLoi.trialValidUntil} (3개월)</span>
                  </div>
                </div>

                <div className="bg-[#FFFFFF] p-4 rounded-lg border border-[#DCD6C9] space-y-2">
                  <div className="flex items-center justify-between text-[0.8125rem]">
                    <span className="text-[#5A5E66]">월 1건 유치 시 예상 매출:</span>
                    <span className="font-bold text-[#151719]">{submittedLoi.expectedMonthlyRevenue.toLocaleString()}원</span>
                  </div>
                  <div className="flex items-center justify-between text-[0.8125rem]">
                    <span className="text-[#5A5E66]">예상 광고 대비 ROI:</span>
                    <span className="font-bold text-[#19382C] text-base">{submittedLoi.expectedRoiPercentage}%</span>
                  </div>
                  <p className="text-[0.8125rem] text-[#6E5429] pt-2 border-t border-[#DCD6C9]">
                    ※ {submittedLoi.legalNotice}
                  </p>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-[#DCD6C9]">
                  <button
                    type="button"
                    onClick={() => setSubmittedLoi(null)}
                    className="px-4 py-2 border border-[#DCD6C9] bg-[#FFFFFF] hover:bg-[#FAF9F6] text-[#5A5E66] rounded-md text-[0.8125rem] font-bold cursor-pointer"
                  >
                    새로운 의향서 작성
                  </button>
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="px-5 py-2 bg-[#19382C] hover:bg-[#2D4F43] text-white rounded-md text-[0.8125rem] font-bold flex items-center space-x-1.5 cursor-pointer shadow-xs"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#C2A26A]" />
                    <span>공식 의향서 출력 / PDF 저장</span>
                  </button>
                </div>
              </div>
            ) : (
              // 의향서 작성 폼
              <form onSubmit={handleSubmit} className="bg-[#FFFFFF] p-6 rounded-xl border border-[#DCD6C9] shadow-xs space-y-6">
                <div>
                  <h4 className="font-reverence font-bold text-lg text-[#151719]">
                    시범 권역 참여의향서(LOI) 작성
                  </h4>
                  <p className="text-[1.125rem] text-[#5A5E66] mt-0.5">
                    시범 권역 38개소 중 식장을 선택하시면 기초 정보가 자동으로 완성됩니다.
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-3 bg-[#FAF0EF] text-[#8B2520] rounded border border-[#FAF0EF] text-[0.8125rem] flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-[#8B2520]" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 시범 권역 식장 선택 */}
                  <div>
                    <label className="block text-[0.8125rem] font-bold text-[#151719] mb-1">
                      시범 권역 대상 식장 선택
                    </label>
                    <select
                      value={selectedHallId}
                      onChange={(e) => handleSelectHallChange(e.target.value)}
                      className="w-full bg-[#FAF9F6] border border-[#DCD6C9] rounded-md px-3 py-2 text-sm text-[#151719] focus:outline-none focus:border-[#9E7D47]"
                    >
                      {pilotHalls.map((h) => (
                        <option key={h.id} value={h.id}>
                          [{h.pilotDistrict || '수도권'}] {h.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[0.8125rem] font-bold text-[#151719] mb-1">
                      장례식장 공식 상호
                    </label>
                    <input
                      type="text"
                      value={hallName}
                      onChange={(e) => setHallName(e.target.value)}
                      required
                      className="w-full bg-[#FAF9F6] border border-[#DCD6C9] rounded-md px-3 py-2 text-sm text-[#151719] focus:outline-none focus:border-[#9E7D47]"
                    />
                  </div>

                  <div>
                    <label className="block text-[0.8125rem] font-bold text-[#151719] mb-1">
                      대표자 또는 총괄 원장 성함
                    </label>
                    <input
                      type="text"
                      value={directorName}
                      onChange={(e) => setDirectorName(e.target.value)}
                      placeholder="예: 김상우 원장"
                      required
                      className="w-full bg-[#FAF9F6] border border-[#DCD6C9] rounded-md px-3 py-2 text-sm text-[#151719] focus:outline-none focus:border-[#9E7D47]"
                    />
                  </div>

                  <div>
                    <label className="block text-[0.8125rem] font-bold text-[#151719] mb-1">
                      직통 연락처 (휴대전화 또는 사무실)
                    </label>
                    <input
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="010-0000-0000 또는 02-000-0000"
                      required
                      className="w-full bg-[#FAF9F6] border border-[#DCD6C9] rounded-md px-3 py-2 text-sm text-[#151719] focus:outline-none focus:border-[#9E7D47]"
                    />
                  </div>

                  <div>
                    <label className="block text-[0.8125rem] font-bold text-[#151719] mb-1">
                      전자세금계산서 수신 이메일
                    </label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="tax@funeralhall.kr"
                      required
                      className="w-full bg-[#FAF9F6] border border-[#DCD6C9] rounded-md px-3 py-2 text-sm text-[#151719] focus:outline-none focus:border-[#9E7D47]"
                    />
                  </div>

                  <div>
                    <label className="block text-[0.8125rem] font-bold text-[#151719] mb-1">
                      사업자등록번호 (10자리)
                    </label>
                    <input
                      type="text"
                      value={businessNumber}
                      onChange={(e) => setBusinessNumber(e.target.value)}
                      placeholder="000-00-00000"
                      required
                      className="w-full bg-[#FAF9F6] border border-[#DCD6C9] rounded-md px-3 py-2 text-sm text-[#151719] focus:outline-none focus:border-[#9E7D47]"
                    />
                  </div>
                </div>

                {/* 상품 선택 및 유족 감면율 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#DCD6C9]">
                  <div>
                    <label className="block text-[0.8125rem] font-bold text-[#151719] mb-1">
                      참여 희망 광고 패키지
                    </label>
                    <select
                      value={adPackage}
                      onChange={(e) => setAdPackage(e.target.value as PilotAdPackageType)}
                      className="w-full bg-[#FAF9F6] border border-[#DCD6C9] rounded-md px-3 py-2 text-sm text-[#151719] focus:outline-none focus:border-[#9E7D47]"
                    >
                      <option value="PRIORITY_SLOT_STANDARD">
                        표준 우선 노출 정액제 (월 300,000원) - 권장
                      </option>
                      <option value="SHORTFORM_CONTENT_BUNDLE">
                        지역 노출 + 숏폼 제작 번들 (월 500,000원)
                      </option>
                    </select>
                    {adPackage === 'SHORTFORM_CONTENT_BUNDLE' && (
                      <button
                        type="button"
                        onClick={() => setIsShortformModalOpen(true)}
                        className="mt-2 py-1 px-2.5 bg-[#FAF9F6] hover:bg-[#F1E9DB] text-[#19382C] border border-[#DCD6C9] rounded text-[0.8125rem] font-bold flex items-center space-x-1 cursor-pointer transition-colors"
                      >
                        <Film className="w-3.5 h-3.5 text-[#9E7D47]" />
                        <span>숏폼 제작 포트폴리오 4대 테마 미리보기</span>
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block text-[0.8125rem] font-bold text-[#151719] mb-1">
                      배웅 유족 제공 빈소 임대료 감면율
                    </label>
                    <select
                      value={offeredDiscountRate}
                      onChange={(e) => setOfferedDiscountRate(Number(e.target.value))}
                      className="w-full bg-[#FAF9F6] border border-[#DCD6C9] rounded-md px-3 py-2 text-sm text-[#151719] focus:outline-none focus:border-[#9E7D47]"
                    >
                      <option value={10}>10% 정찰 감면</option>
                      <option value={20}>20% 정찰 감면 (표준)</option>
                      <option value={25}>25% 정찰 감면</option>
                      <option value={30}>30% 정찰 감면 (우대)</option>
                    </select>
                  </div>
                </div>

                {/* 필수 확약 체크박스 */}
                <div className="bg-[#FAF9F6] p-4 rounded-lg border border-[#DCD6C9] space-y-3 text-[0.8125rem]">
                  <label className="flex items-start space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={flatRateAgreed}
                      onChange={(e) => setFlatRateAgreed(e.target.checked)}
                      className="mt-1"
                      required
                    />
                    <span className="text-[#151719]">
                      <strong className="text-[#19382C]">[필수]</strong> 건당 알선료가 배제된 월 정액제 광고 계약 조건에 동의하며, 3개월 시범 운영 후 지속 여부를 자율 결정함을 확인합니다.
                    </span>
                  </label>

                  <label className="flex items-start space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={antiRebatePledge}
                      onChange={(e) => setAntiRebatePledge(e.target.checked)}
                      className="mt-1"
                      required
                    />
                    <span className="text-[#151719]">
                      <strong className="text-[#19382C]">[필수]</strong> 2026.03 공정거래위원회 리베이트 제재 지침을 준수하며, 장례지도사 촌지 및 부당 추가금을 일체 요구하지 않을 것을 서약합니다.
                    </span>
                  </label>
                </div>

                {/* 전자 서명란 */}
                <div className="pt-2 border-t border-[#DCD6C9]">
                  <label className="block text-[0.8125rem] font-bold text-[#151719] mb-1">
                    의향서 전자 서명 (대표자 성함 정자 기재)
                  </label>
                  <input
                    type="text"
                    value={signatureName}
                    onChange={(e) => setSignatureName(e.target.value)}
                    placeholder="예: 김상우 (서명)"
                    required
                    className="w-full sm:w-1/2 bg-[#FAF9F6] border border-[#DCD6C9] rounded-md px-3 py-2 text-sm text-[#151719] focus:outline-none focus:border-[#9E7D47]"
                  />
                </div>

                <div className="flex justify-end pt-4 border-t border-[#DCD6C9]">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 bg-[#19382C] hover:bg-[#2D4F43] text-white rounded-md font-bold text-[0.8125rem] flex items-center justify-center space-x-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    <span>참여의향서(LOI) 공식 제출 및 증서 발급</span>
                    <ChevronRight className="w-4 h-4 text-[#C2A26A]" />
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ─── [탭 3: 시범 권역 LOI 유치 현황 대시보드] ─── */}
        {activeTab === 'status' && (
          <div className="space-y-6 font-serif">
            {/* 상단 목표 달성도 카드 */}
            <div className="bg-[#FFFFFF] p-6 rounded-xl border border-[#DCD6C9] shadow-xs space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <span className="text-[0.8125rem] font-bold text-[#5A5E66] block">
                    사업계획서 10.1절 착수 전 검증 목표
                  </span>
                  <h4 className="font-reverence font-bold text-xl text-[#151719]">
                    시범 권역 38개소 중 20% (8곳) 참여의향서 확보
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-[#19382C]">
                    {statusSummary.currentLoiCount} / {statusSummary.targetLoiCount} 곳
                  </span>
                  <span className="text-[0.8125rem] font-bold text-[#6E5429] block">
                    달성률 {statusSummary.achievementRatePercentage}%
                  </span>
                </div>
              </div>

              {/* 프로그레스 바 */}
              <div className="w-full bg-[#FAF9F6] rounded-full h-3.5 border border-[#DCD6C9] overflow-hidden">
                <div
                  className="bg-[#19382C] h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, statusSummary.achievementRatePercentage)}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[0.8125rem] text-[#5A5E66]">
                <span>현재 접수: {statusSummary.currentLoiCount}곳</span>
                <span>목표 달성 기준: 8곳 (20%)</span>
              </div>
            </div>

            {/* 자치구별 접수 현황 및 현재 접수된 식장 목록 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 자치구별 접수 카운트 */}
              <div className="bg-[#FFFFFF] p-5 rounded-lg border border-[#DCD6C9] space-y-3">
                <h5 className="font-bold text-[#151719] text-base">자치구별 접수 현황</h5>
                <div className="space-y-2 text-[0.8125rem]">
                  {Object.entries(statusSummary.hallsByDistrict).map(([dist, count]) => (
                    <div key={dist} className="flex justify-between items-center py-1 border-b border-[#DCD6C9]">
                      <span className="text-[#5A5E66]">{dist}</span>
                      <span className="font-bold text-[#19382C]">{count}곳 참여</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 공식 접수 완료 목록 */}
              <div className="bg-[#FFFFFF] p-5 rounded-lg border border-[#DCD6C9] space-y-3">
                <h5 className="font-bold text-[#151719] text-base">공식 접수된 의향서 목록</h5>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {PilotLoiService.getAllLois().map((loi) => (
                    <div key={loi.loiNumber} className="p-3 bg-[#FAF9F6] rounded border border-[#DCD6C9] text-[0.8125rem] space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-[#151719]">{loi.hallName}</span>
                        <span className="text-[0.8125rem] font-bold text-[#19382C] bg-[#DCE8E2] px-1.5 py-0.5 rounded">
                          {loi.status}
                        </span>
                      </div>
                      <div className="text-[#5A5E66] flex justify-between">
                        <span>{loi.directorName} ({loi.pilotDistrict})</span>
                        <span className="font-mono text-[#6E5429]">{loi.loiNumber}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {isShortformModalOpen && (
        <ShortformShowcaseModal
          isOpen={isShortformModalOpen}
          onClose={() => setIsShortformModalOpen(false)}
          initialHallId={selectedHallId}
        />
      )}
    </ModalShell>
  );
};
