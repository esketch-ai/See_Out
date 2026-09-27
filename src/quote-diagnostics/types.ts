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
export type BaeungPackageType = 'simple_non_hall' | 'family_2day' | 'economic_3day' | 'standard_3day';

/**
 * 패키지 세부 원가 및 제원 항목
 */
export interface PackageSpecification {
  category: string;             // '전문 인력', '입관 및 고인용품', '유족 상복 지원', '차량 및 운구', '사후 행정 및 추모'
  title: string;                // 품목명
  detail: string;               // 세부 규격 및 수량
  origin?: string;              // 원산지 및 인증
  refundNotice?: string;        // 미사용 시 환급 기준
}

/**
 * 배웅 패키지 정보
 */
export interface BaeungPackageInfo {
  type: BaeungPackageType;
  name: string;
  price: number;                     // 정찰 가격
  description: string;
  badge?: string;                    // 대표 뱃지 (예: '무빈소·직장', '핵가족 추천', '가장 대중적', '명품 의전')
  targetGuests?: string;             // 권장 조문객 규모
  stayDays?: number;                 // 빈소 일수 (0, 2, 3)
  staffSummary?: string;             // 인력 요약
  vehicleSummary?: string;           // 차량 요약
  specs?: PackageSpecification[];    // 5대 영역별 상세 제원
  includedHighlights?: string[];     // 핵심 포함 품목
  excludedNotice?: string[];         // 별도 장례식장 직결제 품목 안내
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

/**
 * 듀얼 스탠바이 (Dual-Standby, 무약정 사전 예치 등록) 모델
 */
export interface DualStandbyRegistration {
  registrationId: string;            // 예: "DS-2026-KR-7729"
  registrantName: string;            // 신청자/상주 성함
  registrantPhone: string;           // 비상 연락처
  beneficiaryName: string;           // 피공제자(고인 또는 부모님) 성함
  relationship: string;              // 관계 (부친, 모친, 본인 등)
  existingCompany: string;           // 가입 중인 기존 상조사명
  existingProduct: string;           // 가입 상품명
  paidTotalAmount: number;           // 현재 납입 총액
  estimatedRefund: number;           // 예상 법정 해약환급금
  lossProtectionCredit: number;      // 배웅 해약 손실 보전 크레딧 (최대 50만 원 상당)
  assignedDirectorName: string;      // 24시 전담 배정 장례지도사
  assignedDirectorPhone: string;     // 직통 번호
  registeredAt: string;              // 사전 등록 일시
  status: 'active' | 'exercised' | 'converted';
}

/**
 * 공정위 기준 선불식 할부계약 해제 및 법정 해약환급금 지급 청구서 (내용증명) 모델
 */
export interface CancellationClaimData {
  claimId: string;
  claimantName: string;              // 계약자 성함
  claimantPhone: string;             // 연락처
  claimantAddress: string;           // 주소
  competitorName: string;            // 상조사명
  competitorCeo: string;             // 대표이사
  competitorAddress: string;         // 상조사 본사 주소
  contractNumber: string;            // 증서 번호
  productName: string;               // 가입 상품명
  contractDate: string;              // 계약 체결일
  totalContractAmount: number;       // 총 계약금
  paidInstallments: number;          // 실 납입 회차
  totalInstallments: number;         // 약정 납입 회차
  paidTotalAmount: number;           // 실 납입 총액
  statutoryRefundAmount: number;     // 법정 환급 청구 금액
  refundAccountBank: string;         // 환급 수령 은행
  refundAccountNumber: string;        // 계좌번호
  refundAccountHolder: string;       // 예금주
  legalBasis: string;                // 적용 법률 (할부거래법 제34조 및 공정위 고시 제2020-1호)
  claimDate: string;                 // 청구 일자
}

