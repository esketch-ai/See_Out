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
    <div className="fixed inset-0 z-50 bg-[#0D0E10]/85 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto font-serif">
      <div className="bg-[#FAF9F6] rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-[#E3DFD5] flex flex-col my-auto max-h-[96vh]">
        {/* 상단 컨트롤 툴바 (인쇄 시 숨김 no-print) */}
        <div className="no-print bg-[#121417] text-[#FAF9F6] p-4 px-6 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-[#9E7D47]/20 text-[#E8C88B] flex items-center justify-center border border-[#9E7D47]/40">
              <Gift className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#FAF9F6] flex items-center space-x-2">
                <span>배웅 해약 손실 보전 의전 크레딧 바우처</span>
                <span className="text-[10px] bg-[#9E7D47] text-white px-2 py-0.5 rounded font-bold">
                  {creditAmount.toLocaleString()}원 상당
                </span>
              </h3>
              <p className="text-xs text-[#A69E8F] font-serif">
                기존 상조 해약 손실을 배웅 실물 의전 업그레이드로 100% 보전해 드립니다.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-[#19382C] hover:bg-[#224A3B] text-white rounded-md font-serif font-bold text-xs flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer border border-[#2D5A46]"
            >
              <Printer className="w-4 h-4 text-[#C2A26A]" />
              <span>A4 바우처 인쇄 / 저장</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/10 rounded-full text-[#D4CEC2] hover:text-white transition-colors cursor-pointer"
              title="닫기 (ESC)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 본문 컨테이너 */}
        <div className="overflow-y-auto p-4 sm:p-8 space-y-6 bg-[#FAF9F6]">
          {/* ───────────────────────────────────────────────────────────── */}
          {/* 황금빛 품격 바우처 카드 (A4 인쇄 가능) */}
          {/* ───────────────────────────────────────────────────────────── */}
          <div className="print-booklet-page bg-gradient-to-br from-[#1A3A2F] via-[#132B22] to-[#0E1E18] text-[#FAF9F6] rounded-2xl p-6 sm:p-10 space-y-6 shadow-xl border-2 border-[#C2A26A]/70 relative overflow-hidden">
            {/* 귀갑문 전통 배경 */}
            <div className="pointer-events-none absolute inset-0 k-pattern-geummun opacity-25" />

            {/* 바우처 상단 헤더 */}
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/15 pb-4">
              <div className="flex items-center space-x-2.5">
                <TraditionalSeal sealKey="mourningCondolence" size="sm" />
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#C2A26A] font-bold block">
                    Bae-ung Loss Protection Guarantee
                  </span>
                  <span className="text-xs text-[#D4CEC2] font-mono">
                    쿠폰 코드: <strong className="text-[#E8C88B]">VOUCHER-500K-DS2026</strong>
                  </span>
                </div>
              </div>
              <span className="text-xs text-[#C2A26A] font-bold bg-[#0A1611] px-3 py-1 rounded-md border border-[#2A5442] w-fit">
                평생 유효 • 정산 시 100% 현장 차감
              </span>
            </div>

            {/* 바우처 메인 액면가 */}
            <div className="relative z-10 text-center space-y-2 py-4">
              <span className="text-xs sm:text-sm text-[#D4CEC2] tracking-wider block">
                [ {existingCompany} ] 해약 손실 보전 보증권
              </span>
              <div className="text-3xl sm:text-5xl font-reverence font-black text-[#E8C88B] tracking-tight">
                {creditAmount.toLocaleString()} <span className="text-xl sm:text-2xl text-[#FAF9F6] font-normal">KRW</span>
              </div>
              <p className="text-xs sm:text-sm text-[#D4CEC2] font-serif max-w-lg mx-auto leading-relaxed pt-1">
                기존 상조 중도 해약으로 인한 위약금 손실을 유족의 고통으로 남겨두지 않습니다.
                배웅 후불 정산 시 아래 3대 실물 의전 업그레이드로 즉시 전액 차감 보전됩니다.
              </p>
            </div>

            {/* 3대 실물 보전 혜택 상세 카드 그리드 */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {/* 혜택 1: 궁중 생화 꽃염습 */}
              <div className="bg-[#0E1E18]/80 backdrop-blur-xs p-4 rounded-xl border border-[#2A5442] space-y-2 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-full bg-[#19382C] text-[#C2A26A] flex items-center justify-center border border-[#2D5A46] mb-2">
                    <Flower2 className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] text-[#C2A26A] font-bold block">혜택 ① (30만 원 상당)</span>
                  <h4 className="font-bold text-sm text-[#FAF9F6] mt-0.5">궁중 생화 꽃염습(꽃침대)</h4>
                  <p className="text-[11px] text-[#A69E8F] mt-1 leading-relaxed">
                    관 내부를 계절 생화 1,000송이로 정성껏 채워 고인의 마지막 가시는 길을 꽃밭으로 모십니다.
                  </p>
                </div>
                <span className="text-[10px] text-[#2DD4BF] font-mono mt-2 block font-bold">
                  ✓ 300,000원 전액 무상 차감
                </span>
              </div>

              {/* 혜택 2: 리무진 거리 연장 */}
              <div className="bg-[#0E1E18]/80 backdrop-blur-xs p-4 rounded-xl border border-[#2A5442] space-y-2 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-full bg-[#19382C] text-[#C2A26A] flex items-center justify-center border border-[#2D5A46] mb-2">
                    <Car className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] text-[#C2A26A] font-bold block">혜택 ② (15만 원 상당)</span>
                  <h4 className="font-bold text-sm text-[#FAF9F6] mt-0.5">최고급 리무진 거리 100km 연장</h4>
                  <p className="text-[11px] text-[#A69E8F] mt-1 leading-relaxed">
                    수도권 및 장거리 장지 이동 시 유류비와 톨비가 포함된 이동 거리를 100km 무료 연장합니다.
                  </p>
                </div>
                <span className="text-[10px] text-[#2DD4BF] font-mono mt-2 block font-bold">
                  ✓ 150,000원 전액 무상 차감
                </span>
              </div>

              {/* 혜택 3: 유골함 영구 레이저 명패 */}
              <div className="bg-[#0E1E18]/80 backdrop-blur-xs p-4 rounded-xl border border-[#2A5442] space-y-2 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-full bg-[#19382C] text-[#C2A26A] flex items-center justify-center border border-[#2D5A46] mb-2">
                    <Award className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] text-[#C2A26A] font-bold block">혜택 ③ (5만 원 상당)</span>
                  <h4 className="font-bold text-sm text-[#FAF9F6] mt-0.5">유골함 영구 실버 레이저 각인</h4>
                  <p className="text-[11px] text-[#A69E8F] mt-1 leading-relaxed">
                    고인의 함자, 생몰년, 본관, 가족 헌정 문구를 유골함 표면에 정밀 레이저로 영구 각인합니다.
                  </p>
                </div>
                <span className="text-[10px] text-[#2DD4BF] font-mono mt-2 block font-bold">
                  ✓ 50,000원 전액 무상 차감
                </span>
              </div>
            </div>

            {/* 바우처 사용 안내 규칙 */}
            <div className="relative z-10 bg-[#0A1611]/80 p-4 rounded-xl border border-[#2A5442] text-xs text-[#D4CEC2] space-y-1.5">
              <span className="font-bold text-[#E8C88B] block">바우처 이용 및 정산 방법:</span>
              <p className="leading-relaxed">
                • 실제 임종 발생 시 배웅 1급 장례지도사에게 기존 상조 해약 증빙(해약 통지서, 문자, 또는 입금 내역)을 제시해 주시면 최종 정산서에서 위 3대 혜택 금액(총 50만 원)이 즉시 차감 반영됩니다.
              </p>
              <p className="text-[11px] text-[#A69E8F]">
                • 본 바우처는 배웅 이중안심(二重安心) 사전 등록 고객 전용 혜택이며, 타인 양도가 가능합니다.
              </p>
            </div>

            {/* 하단 직인 */}
            <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-[#A69E8F]">
              <span>발행처: 배웅(Bae-ung) 상설의전총괄본부</span>
              <div className="flex items-center space-x-1.5">
                <span className="text-[#E8C88B] font-bold">배웅 의전위원장 공인</span>
                <TraditionalSeal sealKey="truth" size="sm" />
              </div>
            </div>
          </div>

          {/* 하단 이중안심 등록증 보기 바로가기 */}
          {onOpenDualStandby && (
            <div className="no-print pt-2 flex justify-end">
              <button
                onClick={onOpenDualStandby}
                className="py-2.5 px-4 bg-[#19382C] hover:bg-[#224A3B] text-[#FAF9F6] border border-[#2D5A46] rounded-lg font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <span>이중안심 사전등록증 보기</span>
                <ArrowRight className="w-4 h-4 text-[#C2A26A]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
