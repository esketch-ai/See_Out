/**
 * 상조 견적 진단 및 해약환급금 계산 엔진 타입 정의
 * Specification: ALGO-2026-003
 */

/**
 * 상조 계약 증서 Vision OCR 추출 스키마
 */
export interface CertificateExtractionSchema {
  certificateId: string;
  recognizedAt: string;
  competitorName: string;            // 예: "B상조", "P상조", "H상조"
  productName: string;               // 예: "프리미엄 450", "늘푸른 590"
  contractDate: string;              // "YYYY-MM-DD"
  totalContractAmount: number;       // 총 계약금 (원, 예: 4,500,000)
  monthlyPayment: number;            // 월 납입금 (원, 예: 30,000)
  totalInstallments: number;         // 총 약정 납입 회차 (예: 150)
  paidInstallments: number;          // 현재 실 납입 회차 (예: 42)
  paidTotalAmount: number;           // 실 납입 누계액 (원, 예: 1,260,000)
  remainingAmount: number;           // 잔여 납입 예정액 (원, 예: 3,240,000)
  hasMaturityRefund100: boolean;     // 만기 시 100% 환급 특약 여부
  confidenceScore: number;           // OCR 신뢰도 (0.00 ~ 1.00)
}

/**
 * 공정거래위원회 고시 기준 법정 해약환급금 산정 결과
 */
export interface RefundCalculationResult {
  paidTotalAmount: number;           // 실 납입 누계액
  refundAmount: number;              // 법정 해약환급금 수령액
  refundRatePercentage: number;      // 실질 환급률 (%)
  lossAmount: number;                // 해약 시 손실액 (paidTotalAmount - refundAmount)
  progressRatioPercentage: number;   // 납입 진행률 (%)
  legalBasis: string;                // 적용 법률 및 고시 근거
}

/**
 * 현장 추가금 추정 강도
 */
export type HiddenCostSeverity = 'conservative' | 'average' | 'aggressive';

/**
 * 현장 숨은 추가금 항목별 상세
 */
export interface HiddenCostBreakdown {
  shroudUpgrade: number;             // 수의·관 업셀링
  flowerUpgrade: number;             // 제단 꽃장식 확대
  distanceOvercharge: number;        // 차량 이동거리 초과 운임
  tipGratuity: number;               // 지도사/도우미 수고비(촌지)
  totalHiddenCost: number;           // 현장 숨은 추가금 합계
}

/**
 * 배웅 실비 후불제 패키지 종류
 */
export type BaeungPackageType = 'simple_non_hall' | 'economic_3day' | 'standard_3day';

/**
 * 배웅 패키지 정보
 */
export interface BaeungPackageInfo {
  type: BaeungPackageType;
  name: string;
  price: number;                     // 정찰 가격
  description: string;
}

/**
 * 1:1 맞춤 영수증 라인 아이템
 */
export interface ReceiptLineItem {
  name: string;
  amount: number;
  isWarning?: boolean;               // 추가금 경고 강조 표시
  isDeduction?: boolean;             // 차감 항목 표시 (-)
  isHighlighted?: boolean;           // 0원 보증 등 혜택 강조
  description?: string;
}

/**
 * 1:1 영수증 사이드
 */
export interface ReceiptSide {
  title: string;
  subtitle: string;
  lineItems: ReceiptLineItem[];
  totalAmount: number;
}

/**
 * 1:1 맞춤 영수증 좌우 대조 리포트 (최종 결과)
 */
export interface DiagnosticComparisonReport {
  diagnosticId: string;
  clientName?: string;
  analyzedAt: string;
  certificate: CertificateExtractionSchema;
  statutoryRefund: RefundCalculationResult;
  hiddenCost: HiddenCostBreakdown;
  selectedBaeungPackage: BaeungPackageInfo;
  transitionCredit: number;          // 배웅 해약손실 보전 크레딧
  
  // 좌우 대조 영수증 모델
  leftCompetitorReceipt: ReceiptSide;
  rightBaeungReceipt: ReceiptSide;

  // 최종 손익 요약
  summary: {
    competitorTotalCost: number;     // 기존 상조 유지 시 총 예상 지출
    baeungTotalActualCost: number;   // 배웅 전환 시 실제 총부담액
    netSavingsAmount: number;        // 최종 순 절감액
    savingsRatePercentage: number;   // 절감율 (%)
    callToActionBadge: string;       // 헤드라인 배너 문구
  };
}
