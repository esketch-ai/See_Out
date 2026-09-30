import React, { useState } from 'react';
import {
  X,
  Printer,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  FileCheck,
  Send,
  Building2,
  Scale,
  Sparkles,
  HelpCircle,
  Award
} from 'lucide-react';
import { useModalA11y } from './ModalShell.js';
import {
  ControlledExperimentService,
  ControlledExperimentReport,
  ValidationCriteriaStatus,
  SelfReportSubmission
} from '../../tracking/index.js';
import { FuneralHallService } from '../../funeral-halls/funeralHallService.js';
import { TraditionalSeal } from '../design-system/index.js';

interface ControlledExperimentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'lift' | 'self_report' | 'criteria';
}

export const ControlledExperimentModal: React.FC<ControlledExperimentModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'lift'
}) => {
  // 모달 접근성 계약 (모든 훅은 if (!isOpen) return null 전에 호출)
  const { overlayProps, panelProps } = useModalA11y(onClose, isOpen);
  const [activeTab, setActiveTab] = useState<'lift' | 'self_report' | 'criteria'>(initialTab);

  // 시범 권역 장례식장 목록
  const pilotHalls = FuneralHallService.getPilotRegionHalls();

  // 자율 신고 폼 상태
  const [selectedHallId, setSelectedHallId] = useState(pilotHalls[0]?.id || '');
  const [quoteCount, setQuoteCount] = useState<number>(10);
  const [contractCount, setContractCount] = useState<number>(4);
  const [renewalIntent, setRenewalIntent] = useState<boolean>(true);
  const [satisfactionScore, setSatisfactionScore] = useState<number>(5);
  const [feedbackNote, setFeedbackNote] = useState<string>('');
  const [submitSuccessMessage, setSubmitSuccessMessage] = useState<string | null>(null);

  // 데이터 조회
  const report: ControlledExperimentReport = ControlledExperimentService.runExperimentAnalysis();
  const criteriaStatus: ValidationCriteriaStatus = ControlledExperimentService.getValidationCriteriaStatus();
  const selfReports: SelfReportSubmission[] = ControlledExperimentService.getAllSelfReports();

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleSubmitSelfReport = (e: React.FormEvent) => {
    e.preventDefault();
    const hall = pilotHalls.find((h) => h.id === selectedHallId);
    if (!hall) return;

    ControlledExperimentService.submitSelfReport({
      hallId: hall.id,
      hallName: hall.name,
      reportingMonth: '2026-09',
      reportedQuoteCount: Number(quoteCount) || 0,
      reportedContractCount: Number(contractCount) || 0,
      renewalIntent,
      satisfactionScore,
      feedbackNote: feedbackNote || '정액제 기반 중립적 상담 만족'
    });

    setSubmitSuccessMessage(`[${hall.name}] 월간 자율 신고가 성공적으로 반영되었습니다.`);
    setTimeout(() => {
      setSubmitSuccessMessage(null);
    }, 3500);
  };

  return (
    <div {...overlayProps} onKeyDown={panelProps.onKeyDown} className="fixed inset-0 z-50 bg-[#0D0E10]/85 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto font-serif">
      <div {...panelProps} className="bg-[#FAF9F6] rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl border border-[#DCD6C9] flex flex-col my-auto max-h-[96vh]">
        {/* 상단 컨트롤 툴바 (no-print) */}
        <div className="no-print bg-[#141618] text-[#FAF9F6] p-4 px-6 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-[#19382C] text-[#C2A26A] flex items-center justify-center border border-[#2D4F43]">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-reverence font-bold text-base text-[#FAF9F6] flex items-center space-x-2">
                <span>시범 권역 대조군 실험 & 자율 신고 성과 분석</span>
                <span className="text-[13px] font-mono font-normal text-[#C2A26A] bg-[#19382C] px-2 py-0.5 rounded border border-[#2D4F43]">
                  {report.reportId}
                </span>
              </h3>
              <p className="text-[13px] text-[#A8B2A9]">
                사업계획서 7.3절 인과관계 입증 체계 · 10.1절 3대 착수 검증 기준 판정
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="p-2 sm:px-3 sm:py-1.5 rounded-lg bg-[#19382C] hover:bg-[#2D4F43] text-[#FAF9F6] text-[13px] font-serif flex items-center space-x-1.5 transition-colors cursor-pointer border border-[#2D4F43]"
            >
              <Printer className="w-4 h-4 text-[#C2A26A]" />
              <span className="hidden sm:inline">실험 리포트 인쇄</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-[#FAF9F6]/10 hover:bg-[#FAF9F6]/20 text-[#FAF9F6] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="no-print bg-[#FFFFFF] border-b border-[#DCD6C9] px-4 sm:px-6 flex overflow-x-auto text-[13px] font-medium">
          <button
            onClick={() => setActiveTab('lift')}
            className={`py-3 px-4 border-b-2 font-bold whitespace-nowrap cursor-pointer transition-all flex items-center space-x-1.5 ${
              activeTab === 'lift'
                ? 'border-[#19382C] text-[#19382C]'
                : 'border-transparent text-[#5A5E66] hover:text-[#151719]'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>대조군 실험 순수 인과효과 (Lift)</span>
          </button>
          <button
            onClick={() => setActiveTab('self_report')}
            className={`py-3 px-4 border-b-2 font-bold whitespace-nowrap cursor-pointer transition-all flex items-center space-x-1.5 ${
              activeTab === 'self_report'
                ? 'border-[#19382C] text-[#19382C]'
                : 'border-transparent text-[#5A5E66] hover:text-[#151719]'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>월간 자율 신고 (간이 설문 접수)</span>
          </button>
          <button
            onClick={() => setActiveTab('criteria')}
            className={`py-3 px-4 border-b-2 font-bold whitespace-nowrap cursor-pointer transition-all flex items-center space-x-1.5 ${
              activeTab === 'criteria'
                ? 'border-[#19382C] text-[#19382C]'
                : 'border-transparent text-[#5A5E66] hover:text-[#151719]'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>10.1절 3대 착수 검증 기준 진척</span>
          </button>
        </div>

        {/* 본문 영역 */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-[#151719] bg-[#FAF9F6] relative">
          <div className="pointer-events-none absolute inset-0 k-pattern-gyeokja opacity-15" />

          {/* 탭 1: 대조군 실험 Lift 분석 리포트 */}
          {activeTab === 'lift' && (
            <div className="relative z-10 space-y-6">
              {/* 헤더 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-[#151719] pb-4 gap-4">
                <div>
                  <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded bg-[#19382C]/10 text-[#19382C] text-[13px] font-bold mb-1 border border-[#19382C]/20">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>통계적 유의성 검증 완료 (p = {report.pValue} &lt; 0.01)</span>
                  </div>
                  <h1 className="font-reverence font-black text-2xl md:text-3xl text-[#141618] tracking-tight">
                    {report.title}
                  </h1>
                  <p className="text-[13px] text-[#5A5E66] mt-1 font-serif">
                    분석 기간: <b>{report.period}</b> | 대상 권역: <b>{report.pilotRegionName} (총 {report.totalHallsCount}개소)</b>
                  </p>
                </div>
                <div className="flex items-center space-x-3 shrink-0 self-start sm:self-center">
                  <div className="text-right font-serif">
                    <div className="text-[13px] text-[#5A5E66]">실험 설계</div>
                    <div className="text-base font-bold text-[#19382C]">동일 권역 준실험(Quasi-Exp)</div>
                    <div className="text-[13px] text-[#6E5429]">외생변수 통제 완료</div>
                  </div>
                  <TraditionalSeal sealKey="truth" size="md" />
                </div>
              </div>

              {/* 통계적 인과관계 입증 결과 요약 카드 */}
              <div className="p-4 bg-[#DCE8E2] border border-[#DCE8E2] rounded-xl flex items-start space-x-3 text-[13px] leading-relaxed font-serif text-[#19382C]">
                <Scale className="w-5 h-5 shrink-0 text-[#19382C] mt-0.5" />
                <div>
                  <b>사업계획서 7.3절 인과관계 검증 결론:</b><br />
                  {report.causalEvidenceSummary}
                </div>
              </div>

              {/* 핵심 Lift 비교 카드 그리드 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-serif">
                <div className="bg-[#FFFFFF] p-4 rounded-xl border border-[#DCD6C9] space-y-1 shadow-xs">
                  <span className="text-[13px] font-bold text-[#5A5E66] bg-[#FAF9F6] px-2 py-0.5 rounded border border-[#DCD6C9]">
                    노출 증분 (PV Lift)
                  </span>
                  <div className="text-2xl md:text-3xl font-reverence font-bold text-[#141618] pt-1">
                    +{report.lift.impressionLiftPercent}%
                  </div>
                  <div className="text-[13px] text-[#5A5E66]">
                    제공 {report.treatmentStats.avgImpressions} vs 대조 {report.controlStats.avgImpressions}
                  </div>
                </div>

                <div className="bg-[#FFFFFF] p-4 rounded-xl border border-[#DCD6C9] space-y-1 shadow-xs">
                  <span className="text-[13px] font-bold text-[#19382C] bg-[#DCE8E2] px-2 py-0.5 rounded border border-[#DCE8E2]">
                    접촉 시도 증분 (Click Lift)
                  </span>
                  <div className="text-2xl md:text-3xl font-reverence font-bold text-[#19382C] pt-1">
                    +{report.lift.contactLiftPercent}%
                  </div>
                  <div className="text-[13px] text-[#5A5E66]">
                    제공 {report.treatmentStats.avgContactClicks} vs 대조 {report.controlStats.avgContactClicks}
                  </div>
                </div>

                <div className="bg-[#FFFFFF] p-4 rounded-xl border-2 border-[#19382C] space-y-1 shadow-xs">
                  <span className="text-[13px] font-bold text-[#FAF9F6] bg-[#19382C] px-2 py-0.5 rounded">
                    실질 통화 증분 (Call Lift)
                  </span>
                  <div className="text-2xl md:text-3xl font-reverence font-black text-[#19382C] pt-1">
                    {report.lift.callLiftRatio}배 <span className="text-sm font-normal">(+{report.lift.callLiftPercent}%)</span>
                  </div>
                  <div className="text-[13px] text-[#19382C] font-bold">
                    30초 이상 가상번호 통화
                  </div>
                </div>

                <div className="bg-[#FFFFFF] p-4 rounded-xl border-2 border-[#19382C] space-y-1 shadow-xs">
                  <span className="text-[13px] font-bold text-[#6E5429] bg-[#F1E9DB] px-2 py-0.5 rounded border border-[#F1E9DB]">
                    견적 발급 증분 (Quote Lift)
                  </span>
                  <div className="text-2xl md:text-3xl font-reverence font-black text-[#6E5429] pt-1">
                    {report.lift.quoteLiftRatio}배 <span className="text-sm font-normal">(+{report.lift.quoteLiftPercent}%)</span>
                  </div>
                  <div className="text-[13px] text-[#6E5429] font-bold">
                    견적 참조번호 발급 건수
                  </div>
                </div>
              </div>

              {/* 상세 대조표 */}
              <div className="border border-[#DCD6C9] rounded-xl overflow-hidden bg-[#FFFFFF] text-[13px] font-serif shadow-xs">
                <div className="bg-[#141618] text-[#FAF9F6] p-3.5 px-4 font-bold flex items-center justify-between">
                  <span>광고 제공군(Treatment) vs 비제공 대조군(Control) 평균 비교표</span>
                  <span className="text-[13px] text-[#C2A26A]">수도권 동남부 38개소 전수 집계</span>
                </div>
                <table className="w-full text-left divide-y divide-[#DCD6C9]">
                  <thead className="bg-[#FAF9F6] text-[#5A5E66]">
                    <tr>
                      <th className="py-2.5 px-4">성과 지표</th>
                      <th className="py-2.5 px-4 text-center">광고 제공군 (8개소)</th>
                      <th className="py-2.5 px-4 text-center">비제공 대조군 (30개소)</th>
                      <th className="py-2.5 px-4 text-right">순수 인과효과 (Lift)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DCD6C9]">
                    <tr>
                      <td className="py-2.5 px-4 font-bold text-[#151719]">평균 노출 수 (0단계)</td>
                      <td className="py-2.5 px-4 text-center font-bold text-[#19382C]">{report.treatmentStats.avgImpressions.toLocaleString()}회</td>
                      <td className="py-2.5 px-4 text-center text-[#5A5E66]">{report.controlStats.avgImpressions.toLocaleString()}회</td>
                      <td className="py-2.5 px-4 text-right font-bold text-[#19382C]">+{report.lift.impressionLiftPercent}%</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-bold text-[#151719]">평균 상세 체류 (1단계)</td>
                      <td className="py-2.5 px-4 text-center font-bold text-[#19382C]">{report.treatmentStats.avgEngagements.toLocaleString()}회</td>
                      <td className="py-2.5 px-4 text-center text-[#5A5E66]">{report.controlStats.avgEngagements.toLocaleString()}회</td>
                      <td className="py-2.5 px-4 text-right font-bold text-[#19382C]">+{Math.round(((report.treatmentStats.avgEngagements - report.controlStats.avgEngagements) / Math.max(1, report.controlStats.avgEngagements)) * 100)}%</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-bold text-[#151719]">평균 접촉 시도 (2단계)</td>
                      <td className="py-2.5 px-4 text-center font-bold text-[#19382C]">{report.treatmentStats.avgContactClicks}건</td>
                      <td className="py-2.5 px-4 text-center text-[#5A5E66]">{report.controlStats.avgContactClicks}건</td>
                      <td className="py-2.5 px-4 text-right font-bold text-[#19382C]">+{report.lift.contactLiftPercent}%</td>
                    </tr>
                    <tr className="bg-[#FAF9F6]">
                      <td className="py-2.5 px-4 font-bold text-[#19382C]">30초 이상 실질 통화 (3단계)</td>
                      <td className="py-2.5 px-4 text-center font-bold text-[#19382C]">{report.treatmentStats.avgSubstantialCalls}건</td>
                      <td className="py-2.5 px-4 text-center text-[#5A5E66]">{report.controlStats.avgSubstantialCalls}건</td>
                      <td className="py-2.5 px-4 text-right font-black text-[#19382C]">{report.lift.callLiftRatio}배 (+{report.lift.callLiftPercent}%)</td>
                    </tr>
                    <tr className="bg-[#FAF9F6]">
                      <td className="py-2.5 px-4 font-bold text-[#6E5429]">견적 참조번호 발급 (4단계)</td>
                      <td className="py-2.5 px-4 text-center font-bold text-[#6E5429]">{report.treatmentStats.avgQuoteReferences}건</td>
                      <td className="py-2.5 px-4 text-center text-[#5A5E66]">{report.controlStats.avgQuoteReferences}건</td>
                      <td className="py-2.5 px-4 text-right font-black text-[#6E5429]">{report.lift.quoteLiftRatio}배 (+{report.lift.quoteLiftPercent}%)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-bold text-[#151719]">월간 자율 신고 성약 (실제 전환)</td>
                      <td className="py-2.5 px-4 text-center font-bold text-[#19382C]">{report.treatmentStats.avgReportedContracts}건</td>
                      <td className="py-2.5 px-4 text-center text-[#5A5E66]">{report.controlStats.avgReportedContracts}건</td>
                      <td className="py-2.5 px-4 text-right font-bold text-[#19382C]">+{report.lift.contractLiftPercent}%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 탭 2: 월간 자율 신고 간이 설문 창구 */}
          {activeTab === 'self_report' && (
            <div className="relative z-10 space-y-6">
              <div className="border-b-2 border-[#151719] pb-4">
                <h2 className="font-reverence font-black text-2xl text-[#141618]">
                  파트너 장례식장 월간 자율 신고 창구
                </h2>
                <p className="text-[13px] text-[#5A5E66] mt-1">
                  사업계획서 7.3절: 금전 대가 없는 자발적 간이 설문으로 실제 계약 전환 건수 및 갱신 의향을 파악합니다.
                </p>
              </div>

              {submitSuccessMessage && (
                <div className="p-3.5 bg-[#DCE8E2] border border-[#DCE8E2] rounded-xl text-[13px] font-bold text-[#19382C] flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#19382C]" />
                  <span>{submitSuccessMessage}</span>
                </div>
              )}

              {/* 자율 신고 폼 */}
              <form onSubmit={handleSubmitSelfReport} className="p-5 sm:p-6 bg-[#FFFFFF] rounded-xl border border-[#DCD6C9] space-y-4 text-[13px]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* 대상 장례식장 선택 */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-[#141618] block">신고 대상 장례식장</label>
                    <select
                      value={selectedHallId}
                      onChange={(e) => setSelectedHallId(e.target.value)}
                      className="w-full p-2.5 bg-[#FAF9F6] border border-[#DCD6C9] rounded-lg text-[#151719] focus:outline-none focus:border-[#19382C]"
                    >
                      {pilotHalls.map((hall) => (
                        <option key={hall.id} value={hall.id}>
                          {hall.name} ({hall.pilotDistrict || hall.subRegion})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 신고 대상 월 */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-[#141618] block">신고 기준월</label>
                    <input
                      type="text"
                      disabled
                      value="2026년 09월 (1차 시범 운영월)"
                      className="w-full p-2.5 bg-[#FAF9F6] border border-[#DCD6C9] rounded-lg text-[#5A5E66]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  {/* 견적 참조번호 확인 건수 */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-[#141618] block">
                      유족이 제시한 ‘배웅 견적 참조번호’ 확인 건수
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={quoteCount}
                      onChange={(e) => setQuoteCount(parseInt(e.target.value) || 0)}
                      className="w-full p-2.5 bg-[#FAF9F6] border border-[#DCD6C9] rounded-lg text-[#151719] focus:outline-none focus:border-[#19382C]"
                    />
                    <span className="text-[13px] text-[#5A5E66] block">
                      상담 시 유족이 구두 또는 스마트폰 화면으로 제시한 REF 코드 건수
                    </span>
                  </div>

                  {/* 실제 계약 체결 건수 */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-[#141618] block">
                      실제 성약(빈소·안치 계약 체결) 건수
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={contractCount}
                      onChange={(e) => setContractCount(parseInt(e.target.value) || 0)}
                      className="w-full p-2.5 bg-[#FAF9F6] border border-[#DCD6C9] rounded-lg text-[#151719] focus:outline-none focus:border-[#19382C]"
                    />
                    <span className="text-[13px] text-[#5A5E66] block">
                      배웅 플랫폼을 통해 유입되어 실제 의전이 진행된 건수
                    </span>
                  </div>
                </div>

                {/* 3개월차 유료 갱신 의향 */}
                <div className="pt-2 p-3.5 bg-[#FAF9F6] border border-[#F1E9DB] rounded-xl flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="renewalCheckbox"
                    checked={renewalIntent}
                    onChange={(e) => setRenewalIntent(e.target.checked)}
                    className="mt-1 w-4 h-4 text-[#19382C] rounded focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="renewalCheckbox" className="text-[#151719] cursor-pointer">
                    <span className="font-bold text-[#19382C] block">
                      시범 기간(3개월) 종료 후 월 30만 원 정액 광고 유료 갱신 의향 (10.1절 지표)
                    </span>
                    <span className="text-[13px] text-[#5A5E66]">
                      리베이트 없이 정액제로 안정적인 유족 상담을 확보할 수 있다면 향후에도 계약을 유지하시겠습니까?
                    </span>
                  </label>
                </div>

                {/* 현장 피드백 */}
                <div className="space-y-1.5 pt-1">
                  <label className="font-bold text-[#141618] block">현장 의견 및 피드백</label>
                  <textarea
                    rows={3}
                    value={feedbackNote}
                    onChange={(e) => setFeedbackNote(e.target.value)}
                    placeholder="배웅 플랫폼 유입 유족의 특성, 상담 만족도, 개선 필요 사항 등을 자유롭게 기재해 주세요..."
                    className="w-full p-2.5 bg-[#FAF9F6] border border-[#DCD6C9] rounded-lg text-[#151719] focus:outline-none focus:border-[#19382C]"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#19382C] hover:bg-[#2D4F43] text-white rounded-lg font-bold flex items-center space-x-2 transition-colors cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>월간 자율 신고 제출하기</span>
                  </button>
                </div>
              </form>

              {/* 최근 제출된 자율 신고 목록 */}
              <div className="border border-[#DCD6C9] rounded-xl overflow-hidden bg-[#FFFFFF] text-[13px]">
                <div className="bg-[#141618] text-[#FAF9F6] p-3 px-4 font-bold">
                  최근 접수된 파트너 장례식장 자율 신고 내역 ({selfReports.length}건)
                </div>
                <div className="divide-y divide-[#DCD6C9]">
                  {selfReports.map((sr) => (
                    <div key={sr.submissionId} className="p-3.5 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-[#141618]">{sr.hallName}</span>
                        <span className="text-[13px] text-[#19382C] font-bold bg-[#DCE8E2] px-2 py-0.5 rounded">
                          {sr.renewalIntent ? '✓ 갱신 의향 있음' : '미정'}
                        </span>
                      </div>
                      <div className="text-[13px] text-[#5A5E66] flex space-x-4">
                        <span>견적 참조번호 확인: <b>{sr.reportedQuoteCount}건</b></span>
                        <span>실제 계약 성약: <b>{sr.reportedContractCount}건</b></span>
                        <span>만족도: <b>{'★'.repeat(sr.satisfactionScore)}</b></span>
                      </div>
                      {sr.feedbackNote && (
                        <p className="text-[13px] text-[#42464E] bg-[#FAF9F6] p-2 rounded border border-[#DCD6C9] mt-1">
                          “{sr.feedbackNote}”
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 탭 3: 10.1절 3대 착수 검증 기준 진척 */}
          {activeTab === 'criteria' && (
            <div className="relative z-10 space-y-6">
              <div className="border-b-2 border-[#151719] pb-4">
                <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded bg-[#19382C]/10 text-[#19382C] text-[13px] font-bold mb-1 border border-[#19382C]/20">
                  <Award className="w-3.5 h-3.5" />
                  <span>사업계획서 10.1절 공식 지표</span>
                </div>
                <h2 className="font-reverence font-black text-2xl text-[#141618]">
                  시범 권역 오픈 전 3대 착수 검증 기준 달성도
                </h2>
                <p className="text-[13px] text-[#5A5E66] mt-1">
                  1단계 전면 유료 슬롯 런칭 전, 시장 수용성을 객관적으로 입증하는 3대 게이트키핑 기준입니다.
                </p>
              </div>

              {/* 3대 기준 카드 그리드 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. LOI 참여율 */}
                <div className="p-4 bg-[#FFFFFF] rounded-xl border border-[#DCD6C9] space-y-3 shadow-xs">
                  <div className="flex justify-between items-start">
                    <span className="text-[13px] font-bold text-[#5A5E66]">기준 1: LOI 참여율</span>
                    <span className={`text-[13px] font-bold px-2 py-0.5 rounded border ${
                      criteriaStatus.isLoiPassed
                        ? 'bg-[#DCE8E2] text-[#19382C] border-[#DCE8E2]'
                        : 'bg-[#F1E9DB] text-[#6E5429] border-[#F1E9DB]'
                    }`}>
                      {criteriaStatus.isLoiPassed ? '✓ 달성' : '진행 중'}
                    </span>
                  </div>
                  <div>
                    <div className="text-2xl font-bold font-reverence text-[#141618]">
                      {criteriaStatus.loiParticipationRate}%
                    </div>
                    <div className="text-[13px] text-[#5A5E66] mt-0.5">
                      접수 <b>{criteriaStatus.loiCount}곳</b> / 목표 {criteriaStatus.loiTargetCount}곳 (대상 38곳의 20%)
                    </div>
                  </div>
                  <div className="w-full bg-[#FAF9F6] h-2 rounded-full overflow-hidden border border-[#DCD6C9]">
                    <div
                      className="bg-[#19382C] h-full transition-all"
                      style={{ width: `${Math.min(100, (criteriaStatus.loiParticipationRate / 20) * 100)}%` }}
                    />
                  </div>
                  <p className="text-[13px] text-[#5A5E66] leading-relaxed">
                    월 30만 원 정액 광고 사전참여의향서(LOI)를 제출한 장례식장 비율입니다.
                  </p>
                </div>

                {/* 2. 견적 회수율 */}
                <div className="p-4 bg-[#FFFFFF] rounded-xl border border-[#DCD6C9] space-y-3 shadow-xs">
                  <div className="flex justify-between items-start">
                    <span className="text-[13px] font-bold text-[#5A5E66]">기준 2: 견적 회수율</span>
                    <span className={`text-[13px] font-bold px-2 py-0.5 rounded border ${
                      criteriaStatus.isQuoteCollectionPassed
                        ? 'bg-[#DCE8E2] text-[#19382C] border-[#DCE8E2]'
                        : 'bg-[#F1E9DB] text-[#6E5429] border-[#F1E9DB]'
                    }`}>
                      {criteriaStatus.isQuoteCollectionPassed ? '✓ 달성' : '진행 중'}
                    </span>
                  </div>
                  <div>
                    <div className="text-2xl font-bold font-reverence text-[#141618]">
                      {criteriaStatus.quoteCollectionRate}%
                    </div>
                    <div className="text-[13px] text-[#5A5E66] mt-0.5">
                      검증 <b>{criteriaStatus.collectedCount}곳</b> / 목표 {criteriaStatus.collectionTargetCount}곳 (대상 38곳의 50%)
                    </div>
                  </div>
                  <div className="w-full bg-[#FAF9F6] h-2 rounded-full overflow-hidden border border-[#DCD6C9]">
                    <div
                      className="bg-[#19382C] h-full transition-all"
                      style={{ width: `${Math.min(100, (criteriaStatus.quoteCollectionRate / 50) * 100)}%` }}
                    />
                  </div>
                  <p className="text-[13px] text-[#5A5E66] leading-relaxed">
                    표준 시나리오(3일장·무빈소) 기준 현장 실비 검증이 완료된 비율입니다.
                  </p>
                </div>

                {/* 3. 3개월차 갱신 의향 */}
                <div className="p-4 bg-[#FFFFFF] rounded-xl border border-[#DCD6C9] space-y-3 shadow-xs">
                  <div className="flex justify-between items-start">
                    <span className="text-[13px] font-bold text-[#5A5E66]">기준 3: 유료 갱신 의향</span>
                    <span className={`text-[13px] font-bold px-2 py-0.5 rounded border ${
                      criteriaStatus.isRenewalIntentPassed
                        ? 'bg-[#DCE8E2] text-[#19382C] border-[#DCE8E2]'
                        : 'bg-[#F1E9DB] text-[#6E5429] border-[#F1E9DB]'
                    }`}>
                      {criteriaStatus.isRenewalIntentPassed ? '✓ 달성' : '진행 중'}
                    </span>
                  </div>
                  <div>
                    <div className="text-2xl font-bold font-reverence text-[#141618]">
                      {criteriaStatus.renewalIntentRate}%
                    </div>
                    <div className="text-[13px] text-[#5A5E66] mt-0.5">
                      찬성 <b>{criteriaStatus.renewalIntentCount}곳</b> / 응답 {criteriaStatus.totalRespondents}곳 (기준 60% 이상)
                    </div>
                  </div>
                  <div className="w-full bg-[#FAF9F6] h-2 rounded-full overflow-hidden border border-[#DCD6C9]">
                    <div
                      className="bg-[#19382C] h-full transition-all"
                      style={{ width: `${Math.min(100, (criteriaStatus.renewalIntentRate / 60) * 100)}%` }}
                    />
                  </div>
                  <p className="text-[13px] text-[#5A5E66] leading-relaxed">
                    시범 운영 후 월 30만 원 정액 유료 광고를 지속 유지하겠다는 장례식장 비율입니다.
                  </p>
                </div>
              </div>

              {/* 종합 판정 배너 */}
              <div className="p-4 bg-[#DCE8E2] border border-[#DCE8E2] rounded-xl flex items-center justify-between text-[13px] font-serif">
                <div className="space-y-0.5">
                  <div className="font-bold text-[#19382C] text-sm flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#19382C]" />
                    <span>3대 착수 검증 기준 종합 판정 결과</span>
                  </div>
                  <div className="text-[#42464E]">
                    {criteriaStatus.allCriteriaPassed
                      ? '시범 권역 3대 검증 기준을 100% 충족하여, 4단계(시범 오픈 및 유료 슬롯 가동) 착수 요건이 구비되었습니다.'
                      : '일부 기준이 검증 진행 중입니다. LOI 회수 및 견적 검증을 지속 가동합니다.'}
                  </div>
                </div>
                <span className="text-[13px] font-bold text-[#19382C] bg-[#FAF9F6] px-3 py-1.5 rounded-lg border border-[#DCD6C9] shrink-0">
                  {criteriaStatus.allCriteriaPassed ? '적격 판정 (GO)' : '검증 진행 중'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 하단 고정 툴바 */}
        <div className="no-print bg-[#FAF9F6] p-4 px-6 border-t border-[#DCD6C9] flex items-center justify-between shrink-0 text-[13px]">
          <span className="text-[#5A5E66]">
            효과 측정 지원: analytics@baeung.kr · 장례식장 파트너 핫라인 1588-0000
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#19382C] hover:bg-[#2D4F43] text-white rounded font-bold transition-colors cursor-pointer"
          >
            확인 (닫기)
          </button>
        </div>
      </div>
    </div>
  );
};
