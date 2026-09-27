import React, { useState } from 'react';
import {
  X,
  Printer,
  ShieldCheck,
  TrendingUp,
  PhoneCall,
  FileCheck,
  Building2,
  Calendar,
  CheckCircle2,
  Sparkles,
  Scale
} from 'lucide-react';
import { PartnerPerformanceReport } from '../../tracking/types.js';
import { FunnelMeasurementEngine } from '../../tracking/funnelMeasurementEngine.js';
import { FuneralHallEntity } from '../../funeral-halls/types.js';
import { TraditionalSeal } from '../design-system/index.js';
import { B2BPartnerAdmissionModal } from './B2BPartnerAdmissionModal.js';
import { useModalA11y } from './ModalShell.js';

interface PartnerPerformanceReportModalProps {
  hall: FuneralHallEntity;
  onClose: () => void;
}

export const PartnerPerformanceReportModal: React.FC<PartnerPerformanceReportModalProps> = ({
  hall,
  onClose
}) => {
  // 공용 셸과 동일한 모달 접근성 계약 (포커스 트랩 · ESC · aria-modal)
  const { overlayProps, panelProps } = useModalA11y(onClose);
  const [isB2BModalOpen, setIsB2BModalOpen] = useState(false);
  const report: PartnerPerformanceReport = FunnelMeasurementEngine.generatePartnerReport(
    hall.id,
    hall.name
  );

  const handlePrint = () => {
    window.print();
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
                <span>장례식장 광고 파트너 4단계 성과 리포트</span>
                <span className="text-[13px] font-mono font-normal text-[#C2A26A] bg-[#19382C] px-2 py-0.5 rounded border border-[#2D4F43]">
                  {report.reportId}
                </span>
              </h3>
              <p className="text-[13px] text-[#A8B2A9]">
                사업계획서 7장 효과 측정 체계 · 데이터-과금 분리 원칙 100% 준수
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="p-2 sm:px-3 sm:py-1.5 rounded-lg bg-[#19382C] hover:bg-[#2D4F43] text-[#FAF9F6] text-[13px] font-serif flex items-center space-x-1.5 transition-colors cursor-pointer border border-[#2D4F43]"
            >
              <Printer className="w-4 h-4 text-[#C2A26A]" />
              <span className="hidden sm:inline">A4 성과 리포트 인쇄</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-[#FAF9F6]/10 hover:bg-[#FAF9F6]/20 text-[#FAF9F6] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 리포트 본문 (인쇄 친화적) */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-[#151719] bg-[#FAF9F6] relative">
          <div className="pointer-events-none absolute inset-0 k-pattern-gyeokja opacity-15" />

          <div className="relative z-10 space-y-6">
            {/* 1. 상단 공문서 헤더 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-[#151719] pb-4 gap-4">
              <div>
                <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded bg-[#19382C]/10 text-[#19382C] text-[13px] font-bold mb-1 border border-[#19382C]/20">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>공정거래위원회 리베이트 금지 지침 준수 증명</span>
                </div>
                <h1 className="font-reverence font-black text-2xl md:text-3xl text-[#141618] tracking-tight">
                  {hall.name} 월간 광고 효과 분석 리포트
                </h1>
                <p className="text-[13px] text-[#5A5E66] mt-1 font-serif">
                  보고 기간: <b>{report.reportingPeriod}</b> | 배웅 1단계 정액제 광고 성과 투명 공개
                </p>
              </div>

              <div className="flex items-center space-x-3 shrink-0 self-start sm:self-center">
                <div className="text-right font-serif">
                  <div className="text-[13px] text-[#5A5E66]">과금 방식</div>
                  <div className="text-lg md:text-xl font-reverence font-bold text-[#19382C]">
                    월 300,000원 (정액제)
                  </div>
                  <div className="text-[13px] text-[#6E5429]">성과 알선 수수료 0원</div>
                </div>
                <TraditionalSeal sealKey="truth" size="md" />
              </div>
            </div>

            {/* 2. 데이터-과금 분리 인증 배너 (사업계획서 7.4절) */}
            <div className="p-4 bg-[#DCE8E2] border border-[#DCE8E2] rounded-xl flex items-start space-x-3 text-[13px] leading-relaxed font-serif text-[#19382C]">
              <Scale className="w-5 h-5 shrink-0 text-[#19382C] mt-0.5" />
              <div>
                <b>[공식 인증] 데이터-과금 분리 원칙 (Data-Billing Separation Guarantee):</b><br />
                본 리포트의 모든 측정 지표(노출, 클릭, 통화, 견적서 발급)는 장례식장의 마케팅 효과를 객관적으로 증명하는 용도로만 제공됩니다.
                배웅은 공정거래위원회의 2026.3 리베이트 제재 지침에 따라 <b>트래픽이나 계약 성약 건수에 연동된 수수료를 1원도 청구하지 않습니다.</b>
              </div>
            </div>

            {/* 3. 4단계 측정 퍼널 시각화 카드 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-serif">
              {/* 0단계: 노출 */}
              <div className="bg-[#FFFFFF] p-4 rounded-xl border border-[#DCD6C9] space-y-1 shadow-xs">
                <span className="text-[13px] font-bold text-[#5A5E66] bg-[#FAF9F6] px-2 py-0.5 rounded border border-[#DCD6C9]">
                  0단계: 노출 (PV)
                </span>
                <div className="text-2xl md:text-3xl font-reverence font-bold text-[#141618] pt-1">
                  {report.impressions.toLocaleString()}
                </div>
                <div className="text-[13px] text-[#5A5E66]">검색 및 슬롯 노출 횟수</div>
              </div>

              {/* 1단계: 관심 */}
              <div className="bg-[#FFFFFF] p-4 rounded-xl border border-[#DCD6C9] space-y-1 shadow-xs">
                <span className="text-[13px] font-bold text-[#19382C] bg-[#DCE8E2] px-2 py-0.5 rounded border border-[#DCE8E2]">
                  1단계: 관심 (체류)
                </span>
                <div className="text-2xl md:text-3xl font-reverence font-bold text-[#19382C] pt-1">
                  {report.engagements.toLocaleString()}
                </div>
                <div className="text-[13px] text-[#5A5E66]">
                  전환율: <b>{report.rates.engagementRate}%</b>
                </div>
              </div>

              {/* 2·3단계: 접촉 및 실질 상담 */}
              <div className="bg-[#FFFFFF] p-4 rounded-xl border border-[#DCD6C9] space-y-1 shadow-xs">
                <span className="text-[13px] font-bold text-[#6E5429] bg-[#F1E9DB] px-2 py-0.5 rounded border border-[#F1E9DB]">
                  2·3단계: 실질 상담 통화
                </span>
                <div className="text-2xl md:text-3xl font-reverence font-bold text-[#6E5429] pt-1">
                  {report.substantialCalls.toLocaleString()}건
                </div>
                <div className="text-[13px] text-[#5A5E66]">
                  30초 이상 가상번호 통화
                </div>
              </div>

              {/* 4단계: 견적 전환 */}
              <div className="bg-[#FFFFFF] p-4 rounded-xl border-2 border-[#19382C] space-y-1 shadow-xs">
                <span className="text-[13px] font-bold text-[#FAF9F6] bg-[#19382C] px-2 py-0.5 rounded">
                  4단계: 견적 참조번호 발급
                </span>
                <div className="text-2xl md:text-3xl font-reverence font-black text-[#19382C] pt-1">
                  {report.quoteReferencesIssued.toLocaleString()}건
                </div>
                <div className="text-[13px] text-[#19382C] font-bold">
                  전환율: <b>{report.rates.quoteConversionRate}%</b>
                </div>
              </div>
            </div>

            {/* 4. 세부 통계 분석 테이블 */}
            <div className="border border-[#DCD6C9] rounded-xl overflow-hidden bg-[#FFFFFF] text-[13px] font-serif shadow-xs">
              <div className="bg-[#141618] text-[#FAF9F6] p-3.5 px-4 font-bold flex items-center justify-between">
                <span>단계별 효과 측정 상세 명세 및 측정 방법 (사업계획서 7.1절 표준)</span>
                <span className="text-[13px] text-[#C2A26A]">데이터 신뢰도: 높음</span>
              </div>
              <table className="w-full text-left divide-y divide-[#DCD6C9]">
                <thead className="bg-[#FAF9F6] text-[#5A5E66]">
                  <tr>
                    <th className="py-2.5 px-4">퍼널 단계</th>
                    <th className="py-2.5 px-4">지표명</th>
                    <th className="py-2.5 px-4">측정 데이터 출처</th>
                    <th className="py-2.5 px-4 text-right">집계 실적</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCD6C9]">
                  <tr>
                    <td className="py-2.5 px-4 font-bold text-[#151719]">0단계: 노출</td>
                    <td className="py-2.5 px-4">페이지뷰 및 검색 슬롯 노출</td>
                    <td className="py-2.5 px-4 text-[#5A5E66]">서버 로깅 시스템</td>
                    <td className="py-2.5 px-4 text-right font-bold">{report.impressions.toLocaleString()}회</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-bold text-[#151719]">1단계: 관심</td>
                    <td className="py-2.5 px-4">상세페이지 15초 이상 체류 및 제원 조회</td>
                    <td className="py-2.5 px-4 text-[#5A5E66]">웹 애널리틱스 이벤트</td>
                    <td className="py-2.5 px-4 text-right font-bold">{report.engagements.toLocaleString()}회</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-bold text-[#151719]">2단계: 접촉 시도</td>
                    <td className="py-2.5 px-4">클릭투콜 버튼 및 지도 길찾기 클릭</td>
                    <td className="py-2.5 px-4 text-[#5A5E66]">클릭 이벤트 트래커</td>
                    <td className="py-2.5 px-4 text-right font-bold">{report.contactAttempts.toLocaleString()}건</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-bold text-[#6E5429]">3단계: 실질 상담</td>
                    <td className="py-2.5 px-4">가상번호(0507) 기반 30초 이상 통화</td>
                    <td className="py-2.5 px-4 text-[#5A5E66]">통화 중계 메타데이터 (녹음 미실시)</td>
                    <td className="py-2.5 px-4 text-right font-bold text-[#6E5429]">{report.substantialCalls.toLocaleString()}건</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-bold text-[#19382C]">4단계: 전환 근사</td>
                    <td className="py-2.5 px-4">견적 참조번호(REF-2026-KR-XXXX) 발급</td>
                    <td className="py-2.5 px-4 text-[#5A5E66]">견적 엔진 고유 식별 로그</td>
                    <td className="py-2.5 px-4 text-right font-black text-[#19382C] text-sm">
                      {report.quoteReferencesIssued.toLocaleString()}건
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 5. 정액 정산서 및 서약 */}
            <div className="p-4 bg-[#FFFFFF] rounded-xl border border-[#DCD6C9] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-[13px] font-serif">
              <div>
                <div className="font-bold text-[#151719] text-sm">월간 광고 정산 내역: 정액 300,000원 (부가세 별도)</div>
                <div className="text-[13px] text-[#5A5E66] mt-0.5">
                  알선 수수료: <b>0원</b> | 문의 건수 증가에 따른 추가 비용: <b>0원</b>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsB2BModalOpen(true)}
                  className="px-3 py-1 bg-[#19382C] hover:bg-[#2D4F43] text-white rounded text-[13px] font-bold transition-colors cursor-pointer"
                >
                  제휴 협약 신청 / 변경
                </button>
                <span className="text-[13px] font-bold text-[#19382C] bg-[#DCE8E2] px-2.5 py-1 rounded border border-[#DCE8E2]">
                  ✓ 정액제 계약 유지 중
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isB2BModalOpen && (
        <B2BPartnerAdmissionModal
          initialHall={hall}
          onClose={() => setIsB2BModalOpen(false)}
        />
      )}
    </div>
  );
};
