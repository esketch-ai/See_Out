import React from 'react';
import {
  X,
  Printer,
  Sparkles,
  Gift,
  CheckCircle2,
  Flower2,
  Car,
  Award,
  Layers,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { TraditionalSeal } from '../design-system/index.js';
import { ModalShell, ModalToolbar } from './ModalShell.js';

interface LossCreditVoucherModalProps {
  creditAmount?: number;
  existingCompany?: string;
  onClose: () => void;
  onOpenDualStandby?: () => void;
}

export const LossCreditVoucherModal: React.FC<LossCreditVoucherModalProps> = ({
  creditAmount = 500_000,
  existingCompany = 'B상조 (보람상조)',
  onClose,
  onOpenDualStandby
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <ModalShell
        onClose={onClose}
        maxWidth="max-w-3xl"
        maxHeight="max-h-[96vh]"
        surface="paper"
        overlayScroll
        serif
        titleId="voucher-title"
        descriptionId="voucher-desc"
    >
        {/* 상단 컨트롤 툴바 (인쇄 시 숨김 no-print) */}
                <ModalToolbar
          titleId="voucher-title"
          descriptionId="voucher-desc"
          onClose={onClose}
          closeLabel="바우처 닫기"
          icon={
            <div className="w-8 h-8 rounded-full bg-[#9E7D47]/20 text-[#C2A26A] flex items-center justify-center border border-[#9E7D47]/40 shrink-0">
              <Gift className="w-4 h-4" />
            </div>
          }
          title={
            <>
              배웅 해약 손실 보전 의전 크레딧 바우처{' '}
              <span className="text-[13px] bg-[#9E7D47] text-[#151719] px-2 py-0.5 rounded font-bold align-middle">
                {creditAmount.toLocaleString()}원 상당
              </span>
            </>
          }
          subtitle={
            <span id="voucher-desc">기존 상조 해약 손실을 배웅 실물 의전 업그레이드로 100% 보전해 드립니다.</span>
          }
        >
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 bg-[#19382C] hover:bg-[#2D4F43] text-white rounded-md font-serif font-bold text-[13px] flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer border border-[#2D4F43]"
          >
            <Printer className="w-4 h-4 text-[#C2A26A]" />
            <span>A4 바우처 인쇄 / 저장</span>
          </button>
        </ModalToolbar>

        {/* 본문 컨테이너 */}
        <div className="overflow-y-auto p-4 sm:p-8 space-y-6 bg-[#FAF9F6]">
          {/* ───────────────────────────────────────────────────────────── */}
          {/* 황금빛 품격 바우처 카드 (A4 인쇄 가능) */}
          {/* ───────────────────────────────────────────────────────────── */}
          <div className="print-booklet-page k-corner-bracket-dark bg-gradient-to-br from-[#19382C] via-[#19382C] to-[#0A1511] text-[#FAF9F6] rounded-[24px] p-6 sm:p-10 space-y-6 shadow-xl border-2 border-[#C2A26A]/70 relative overflow-hidden">
            {/* 비취면(#19382C) 보조문자다. ink.mutedOnDark(#A8B2A9) 는 묵흑면용이라
                여기서 4.07:1 로 AA 미달 — pine.muted(#A8B2A9, 6.88:1) 를 쓴다. */}
            {/* 귀갑문 전통 배경 */}
            <div className="pointer-events-none absolute inset-0 k-pattern-geummun opacity-25" />

            {/* 바우처 상단 헤더 */}
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/15 pb-4">
              <div className="flex items-center space-x-2.5">
                <TraditionalSeal sealKey="mourningCondolence" size="sm" />
                <div>
                  <span className="text-[13px] uppercase tracking-widest text-[#C2A26A] font-bold block">
                    Bae-ung Loss Protection Guarantee
                  </span>
                  <span className="text-[13px] text-[#A8B2A9] font-mono">
                    쿠폰 코드: <strong className="text-[#C2A26A]">VOUCHER-500K-DS2026</strong>
                  </span>
                </div>
              </div>
              <span className="text-[13px] text-[#C2A26A] font-bold bg-[#0A1511] px-3 py-1 rounded-md border border-[#2D4F43] w-fit">
                평생 유효 • 정산 시 100% 현장 차감
              </span>
            </div>

            {/* 바우처 메인 액면가 */}
            <div className="relative z-10 text-center space-y-2 py-4">
              <span className="text-[13px] sm:text-sm text-[#A8B2A9] tracking-wider block">
                [ {existingCompany} ] 해약 손실 보전 보증권
              </span>
              <div className="text-3xl sm:text-5xl font-reverence font-black text-[#C2A26A] tracking-tight">
                {creditAmount.toLocaleString()} <span className="text-xl sm:text-2xl text-[#FAF9F6] font-normal">KRW</span>
              </div>
              <p className="text-[13px] sm:text-sm text-[#A8B2A9] font-serif max-w-lg mx-auto leading-relaxed pt-1">
                기존 상조 중도 해약으로 인한 위약금 손실을 유족의 고통으로 남겨두지 않습니다.
                배웅 후불 정산 시 아래 3대 실물 의전 업그레이드로 즉시 전액 차감 보전됩니다.
              </p>
            </div>

            {/* 3대 실물 보전 혜택 상세 카드 그리드 */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-[13px]">
              {/* 혜택 1: 궁중 생화 꽃염습 */}
              <div className="bg-[#0A1511]/80 backdrop-blur-xs p-4 rounded-xl border border-[#2D4F43] space-y-2 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-full bg-[#19382C] text-[#C2A26A] flex items-center justify-center border border-[#2D4F43] mb-2">
                    <Flower2 className="w-4 h-4" />
                  </div>
                  <span className="text-[13px] text-[#C2A26A] font-bold block">혜택 ① (30만 원 상당)</span>
                  <h4 className="font-bold text-sm text-[#FAF9F6] mt-0.5">궁중 생화 꽃염습(꽃침대)</h4>
                  <p className="text-[13px] text-[#A8B2A9] mt-1 leading-relaxed">
                    관 내부를 계절 생화 1,000송이로 정성껏 채워 고인의 마지막 가시는 길을 꽃밭으로 모십니다.
                  </p>
                </div>
                <span className="text-[13px] text-[#C2A26A] font-mono mt-2 block font-bold">
                  ✓ 300,000원 전액 무상 차감
                </span>
              </div>

              {/* 혜택 2: 리무진 거리 연장 */}
              <div className="bg-[#0A1511]/80 backdrop-blur-xs p-4 rounded-xl border border-[#2D4F43] space-y-2 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-full bg-[#19382C] text-[#C2A26A] flex items-center justify-center border border-[#2D4F43] mb-2">
                    <Car className="w-4 h-4" />
                  </div>
                  <span className="text-[13px] text-[#C2A26A] font-bold block">혜택 ② (15만 원 상당)</span>
                  <h4 className="font-bold text-sm text-[#FAF9F6] mt-0.5">최고급 리무진 거리 100km 연장</h4>
                  <p className="text-[13px] text-[#A8B2A9] mt-1 leading-relaxed">
                    수도권 및 장거리 장지 이동 시 유류비와 톨비가 포함된 이동 거리를 100km 무료 연장합니다.
                  </p>
                </div>
                <span className="text-[13px] text-[#C2A26A] font-mono mt-2 block font-bold">
                  ✓ 150,000원 전액 무상 차감
                </span>
              </div>

              {/* 혜택 3: 유골함 영구 레이저 명패 */}
              <div className="bg-[#0A1511]/80 backdrop-blur-xs p-4 rounded-xl border border-[#2D4F43] space-y-2 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-full bg-[#19382C] text-[#C2A26A] flex items-center justify-center border border-[#2D4F43] mb-2">
                    <Award className="w-4 h-4" />
                  </div>
                  <span className="text-[13px] text-[#C2A26A] font-bold block">혜택 ③ (5만 원 상당)</span>
                  <h4 className="font-bold text-sm text-[#FAF9F6] mt-0.5">유골함 영구 실버 레이저 각인</h4>
                  <p className="text-[13px] text-[#A8B2A9] mt-1 leading-relaxed">
                    고인의 함자, 생몰년, 본관, 가족 헌정 문구를 유골함 표면에 정밀 레이저로 영구 각인합니다.
                  </p>
                </div>
                <span className="text-[13px] text-[#C2A26A] font-mono mt-2 block font-bold">
                  ✓ 50,000원 전액 무상 차감
                </span>
              </div>
            </div>

            {/* 바우처 사용 안내 규칙 */}
            <div className="relative z-10 bg-[#0A1511]/80 p-4 rounded-xl border border-[#2D4F43] text-[13px] text-[#A8B2A9] space-y-1.5">
              <span className="font-bold text-[#C2A26A] block">바우처 이용 및 정산 방법:</span>
              <p className="leading-relaxed">
                • 실제 임종 발생 시 배웅 1급 장례지도사에게 기존 상조 해약 증빙(해약 통지서, 문자, 또는 입금 내역)을 제시해 주시면 최종 정산서에서 위 3대 혜택 금액(총 50만 원)이 즉시 차감 반영됩니다.
              </p>
              <p className="text-[13px] text-[#A8B2A9]">
                • 본 바우처는 배웅 듀얼 스탠바이 사전 등록 회원 전용 혜택이며, 타인 양도가 가능합니다.
              </p>
            </div>

            {/* 하단 직인 */}
            <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between text-[13px] text-[#A8B2A9]">
              <span>발행처: 배웅(Bae-ung) 상설의전총괄본부</span>
              <div className="flex items-center space-x-1.5">
                <span className="text-[#C2A26A] font-bold">배웅 의전위원장 공인</span>
                <TraditionalSeal sealKey="truth" size="sm" />
              </div>
            </div>
          </div>

          {/* 하단 이중안심 등록증 보기 바로가기 */}
          {onOpenDualStandby && (
            <div className="no-print pt-2 flex justify-end">
              <button
                onClick={onOpenDualStandby}
                className="py-2.5 px-4 bg-[#19382C] hover:bg-[#2D4F43] text-[#FAF9F6] border border-[#2D4F43] rounded-lg font-bold text-[13px] flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <span>이중안심 사전등록증 보기</span>
                <ArrowRight className="w-4 h-4 text-[#C2A26A]" />
              </button>
            </div>
          )}
        </div>
    </ModalShell>
  );
};
