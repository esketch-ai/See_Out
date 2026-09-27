import React, { useState } from 'react';
import {
  X,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Award,
  Sparkles,
  Phone,
  FileText,
  Download,
  AlertTriangle,
  ArrowRight,
  Clock,
  Layers,
  ChevronRight
} from 'lucide-react';
import { DualStandbyRegistration } from '../../quote-diagnostics/types.js';
import { TraditionalSeal } from '../design-system/index.js';
import { ModalShell, ModalToolbar } from './ModalShell.js';

interface DualStandbyModalProps {
  initialData: Partial<DualStandbyRegistration>;
  onClose: () => void;
  onOpenCancellationClaim?: () => void;
  onOpenVoucherModal?: () => void;
}

export const DualStandbyModal: React.FC<DualStandbyModalProps> = ({
  initialData,
  onClose,
  onOpenCancellationClaim,
  onOpenVoucherModal
}) => {
  // 등록 완료 상태 여부 (기본값: true - 진단 결과로부터 즉시 발급)
  const [isIssued, setIsIssued] = useState<boolean>(true);
  const [registrantName, setRegistrantName] = useState<string>(initialData.registrantName || '김정우');
  const [registrantPhone, setRegistrantPhone] = useState<string>(initialData.registrantPhone || '010-3849-2910');
  const [beneficiaryName, setBeneficiaryName] = useState<string>(initialData.beneficiaryName || '故 김철수 님');
  const [relationship, setRelationship] = useState<string>(initialData.relationship || '부친(父)');

  const regId = initialData.registrationId || 'DS-2026-KR-8831';
  const existingCompany = initialData.existingCompany || 'B상조 (보람상조)';
  const existingProduct = initialData.existingProduct || '보람 프리미엄 450';
  const paidTotalAmount = initialData.paidTotalAmount || 1_260_000;
  const estimatedRefund = initialData.estimatedRefund || 453_600;
  const lossProtectionCredit = initialData.lossProtectionCredit || 500_000;
  const directorName = initialData.assignedDirectorName || '조성우 수석 장례지도사 (국가공인 1급 34년 경력)';
  const directorPhone = initialData.assignedDirectorPhone || '010-8820-1588';

  const handlePrint = () => {
    window.print();
  };

  return (
    <ModalShell
        onClose={onClose}
        maxWidth="max-w-4xl"
        maxHeight="max-h-[96vh]"
        surface="paper"
        overlayScroll
        serif
        titleId="dual-title"
        descriptionId="dual-desc"
    >
        {/* 상단 컨트롤 툴바 (화면 전용, 인쇄 시 no-print로 자동 숨김) */}
                <ModalToolbar
          titleId="dual-title"
          descriptionId="dual-desc"
          onClose={onClose}
          closeLabel="등록증 닫기"
          icon={
            <div className="w-8 h-8 rounded-full bg-[#19382C] text-[#C2A26A] flex items-center justify-center border border-[#2D4F43] shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
          }
          title={
            <>
              배웅 듀얼 스탠바이 (Dual-Standby) 안심 사전 등록증{' '}
              <span className="text-[13px] bg-[#9E7D47]/20 text-[#C2A26A] px-2 py-0.5 rounded border border-[#9E7D47]/40 align-middle">
                비용 0원 • 평생 유효
              </span>
            </>
          }
          subtitle={
            <span id="dual-desc">기존 상조를 해약하지 않고 안전하게 병행 등록하여 최종 임종 시 가장 유리한 쪽을 유족이 선택합니다.</span>
          }
        >
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 bg-[#19382C] hover:bg-[#2D4F43] text-white rounded-md font-serif font-bold text-xs flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer border border-[#2D4F43]"
          >
            <Printer className="w-4 h-4 text-[#C2A26A]" />
            <span>A4 증서 인쇄 / PDF 저장</span>
          </button>
        </ModalToolbar>

        {/* 인쇄 본문 영역 */}
        <div className="overflow-y-auto p-4 sm:p-8 space-y-6 bg-[#FAF9F6]">
          {/* ───────────────────────────────────────────────────────────── */}
          {/* 정식 이중안심 사전 등록 증서 (Museum-grade Korean Heritage Design) */}
          {/* ───────────────────────────────────────────────────────────── */}
          <div className="print-booklet-page k-corner-bracket k-changho-texture bg-[#FFFFFF] border-2 border-[#C2A26A]/50 rounded-[24px] p-6 sm:p-12 space-y-6 shadow-sm relative overflow-hidden">
            {/* 귀갑문 전통 패턴 워터마크 */}
            <div className="pointer-events-none absolute inset-0 k-pattern-unmun opacity-15" />

            {/* 증서 상단 낙관 및 문서 번호 */}
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DCD6C9] pb-4">
              <div className="flex items-center space-x-3">
                <TraditionalSeal sealKey="peace" size="sm" />
                <div>
                  <span className="text-[13px] uppercase tracking-widest text-[#6E5429] font-bold block">
                    Bae-ung Dual-Standby Certified Protocol
                  </span>
                  <span className="text-xs text-[#5A5E66] font-mono">
                    등록 인증 번호: <strong className="text-[#19382C]">{regId}</strong>
                  </span>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded text-[13px] font-bold bg-[#DCE8E2] text-[#19382C] border border-[#DCE8E2]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#19382C]" />
                  <span>사전 무약정 승인 완료 (보증 유효)</span>
                </span>
                <p className="text-[13px] text-[#5A5E66] mt-0.5">등록일: 2026년 09월 27일 • 선금 0원 / 위약금 0원</p>
              </div>
            </div>

            {/* 증서 타이틀 */}
            <div className="relative z-10 text-center space-y-2 py-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-reverence font-black text-[#151719] tracking-tight">
                배웅 이중안심(二重安心) 사전 등록증
              </h1>
              <p className="text-xs sm:text-sm text-[#6E5429] font-serif max-w-xl mx-auto leading-relaxed">
                본 증서는 기존 선불식 상조에 가입 중인 유족이 부당한 위약금 손실을 입지 않고,
                임종 시점에 가장 정직하고 투명한 의전을 선택할 수 있도록 배웅 의전위원회가 영구 보증하는 공식 등록 문서입니다.
              </p>
            </div>

            {/* 계약자 및 피공제자 정보 명세 */}
            <div className="relative z-10 bg-[#FAF9F6] border border-[#DCD6C9] rounded-xl p-4 sm:p-5 space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[#5A5E66]">사전 등록 신청자 (상주):</span>
                  <p className="font-bold text-[#151719] text-sm">
                    {registrantName} (연락처: {registrantPhone})
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[#5A5E66]">피공제 대상자 (고인/부모님):</span>
                  <p className="font-bold text-[#151719] text-sm">
                    {beneficiaryName} ({relationship})
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-[#DCD6C9] grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-0.5">
                  <span className="text-[#5A5E66]">기존 보유 상조사:</span>
                  <p className="font-bold text-[#151719]">{existingCompany}</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[#5A5E66]">현재 납입 누계액:</span>
                  <p className="font-bold text-[#151719]">{paidTotalAmount.toLocaleString()}원</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[#5A5E66]">예상 법정 해약환급금:</span>
                  <p className="font-bold text-[#19382C]">{estimatedRefund.toLocaleString()}원 (통장 수령권)</p>
                </div>
              </div>
            </div>

            {/* ───────────────────────────────────────────────────────────── */}
            {/* 4대 법적 안심 보장 특약 조항 */}
            {/* ───────────────────────────────────────────────────────────── */}
            <div className="relative z-10 space-y-3">
              <h3 className="text-sm font-serif font-bold text-[#151719] flex items-center space-x-1.5">
                <Award className="w-4 h-4 text-[#6E5429]" />
                <span>배웅 듀얼 스탠바이 4대 핵심 보장 헌장 (Four Guaranteed Rights)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* 1. 선택권 보장 */}
                <div className="p-3.5 bg-[#FFFFFF] border border-[#DCD6C9] rounded-lg space-y-1">
                  <div className="flex items-center space-x-1 font-bold text-[#19382C]">
                    <span className="text-sm font-reverence">①</span>
                    <span>기존 상조 유지 & 임종 시 1초 최종 선택권</span>
                  </div>
                  <p className="text-[#5A5E66] leading-relaxed">
                    임종 발생 시 기존 상조와 배웅 후불 견적을 즉각 재비교한 후, 유족에게 가장 유리한 방식을 100% 자율 선택할 수 있습니다.
                  </p>
                </div>

                {/* 2. 해약 손실 50만 크레딧 보전 */}
                <div className="p-3.5 bg-[#FFFFFF] border border-[#C2A26A]/60 rounded-lg space-y-1 bg-[#FAF9F6]">
                  <div className="flex items-center space-x-1 font-bold text-[#6E5429]">
                    <span className="text-sm font-reverence">②</span>
                    <span>해약 손실 {lossProtectionCredit.toLocaleString()}원 지원금 즉시 보전</span>
                  </div>
                  <p className="text-[#5A5E66] leading-relaxed">
                    기존 상조 해약에 따른 손실액을 배웅 궁중 생화 꽃침대, 고급 리무진 업그레이드 바우처로 최대 {lossProtectionCredit.toLocaleString()}원까지 차감 보전합니다.
                  </p>
                </div>

                {/* 3. 24시 전담 지도사 직통 */}
                <div className="p-3.5 bg-[#FFFFFF] border border-[#DCD6C9] rounded-lg space-y-1">
                  <div className="flex items-center space-x-1 font-bold text-[#19382C]">
                    <span className="text-sm font-reverence">③</span>
                    <span>사전 등록비·연회비 0원 평생 보증</span>
                  </div>
                  <p className="text-[#5A5E66] leading-relaxed">
                    임종 즉시 전담 장례지도사({directorName})가 지정되어 2시간 이내에 전국 어디든 신속히 출동합니다.
                  </p>
                </div>

                {/* 4. 장례식장 임대료 최대 30% 감면 */}
                <div className="p-3.5 bg-[#FFFFFF] border border-[#DCD6C9] rounded-lg space-y-1">
                  <div className="flex items-center space-x-1 font-bold text-[#19382C]">
                    <span className="text-sm font-reverence">④</span>
                    <span>전국 1,080개 협력 장례식장 빈소 감면</span>
                  </div>
                  <p className="text-[#5A5E66] leading-relaxed">
                    배웅 사전 등록 회원 자격으로 전국 협력 장례식장의 분향실 및 안치실 사용료를 최대 30% 현장 직할인 받으실 수 있습니다.
                  </p>
                </div>
              </div>
            </div>

            {/* 24시 긴급 출동 직통 배정 지도사 안내 */}
            <div className="relative z-10 bg-[#141618] text-[#FAF9F6] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-[#3D382E]">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#19382C] text-[#C2A26A] flex items-center justify-center border border-[#2D4F43] shrink-0">
                  <Phone className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <span className="text-[13px] text-[#C2A26A] font-bold block">
                    배웅 24시 전담 배정 장례지도사 직통 핫라인
                  </span>
                  <p className="text-sm font-bold text-[#FAF9F6]">
                    {directorName} • {directorPhone}
                  </p>
                </div>
              </div>
              <a
                href={`tel:${directorPhone}`}
                className="no-print px-4 py-2 bg-[#19382C] hover:bg-[#2D4F43] text-white text-xs font-bold rounded-md flex items-center justify-center space-x-1.5 transition-colors cursor-pointer border border-[#2D4F43]"
              >
                <Phone className="w-3.5 h-3.5 text-[#C2A26A]" />
                <span>지도사 직통 연결</span>
              </a>
            </div>

            {/* 증서 하단 공인 직인 및 발행 정보 */}
            <div className="relative z-10 pt-4 border-t border-[#DCD6C9] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#5A5E66]">
              <div>
                <p className="font-bold text-[#151719]">사단법인 한국디지털추모협회 • 배웅(Bae-ung) 상설의전위원회</p>
                <p className="text-[13px] text-[#5A5E66]">
                  공정거래위원회 선불식 할부계약 소비자보호 가이드라인 준수 등록 문서
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <TraditionalSeal sealKey="truth" size="sm" />
                <TraditionalSeal sealKey="mourningCondolence" size="sm" />
              </div>
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────────── */}
          {/* 하단 연계 액션 버튼 바 (화면 전용 no-print) */}
          {/* ───────────────────────────────────────────────────────────── */}
          <div className="no-print pt-2 flex flex-col sm:flex-row gap-3">
            {onOpenVoucherModal && (
              <button
                onClick={onOpenVoucherModal}
                className="flex-1 py-3 px-4 bg-[#FAF9F6] hover:bg-[#FAF9F6] text-[#6E5429] border-2 border-[#C2A26A]/50 rounded-xl font-bold text-xs md:text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-[#6E5429]" />
                <span>50만 원 손실 보전 크레딧 바우처 확인하기</span>
              </button>
            )}

            {onOpenCancellationClaim && (
              <button
                onClick={onOpenCancellationClaim}
                className="flex-1 py-3 px-4 bg-[#19382C] hover:bg-[#2D4F43] text-[#FAF9F6] border border-[#2D4F43] rounded-xl font-bold text-xs md:text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-xs"
              >
                <FileText className="w-4 h-4 text-[#C2A26A]" />
                <span>공정위 법정 해약환급금 내용증명 신청서 작성</span>
              </button>
            )}
          </div>
        </div>
    </ModalShell>
  );
};
