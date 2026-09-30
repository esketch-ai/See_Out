/**
 * 배웅(BAEUNG) 1단계 사업계획서 3.1절 & 4.2절 & 7장
 * 장례식장 B2B 정액제(월 30만원) 광고 제휴 및 공식 입점 신청 모델
 */

export interface B2BAdmissionRequest {
  hallName: string;                  // 장례식장 공식 상호
  region: string;                    // 관할 광역시도
  address: string;                   // 상세 도로명 주소
  businessNumber: string;            // 사업자등록번호 (10자리)
  permitNumber: string;              // 「장사 등에 관한 법률」 제29조 장례식장영업신고증 번호
  directorName: string;              // 대표자 또는 장례지도사 원장 성함
  contactPhone: string;              // 담당자 직통 연락처
  contactEmail: string;              // 전자세금계산서 수신 이메일
  offeredDiscountRate: number;       // 유족에게 제공할 빈소 임대료 감면율 (10%, 20%, 30%)
  flatRateAgreed: boolean;           // 월 300,000원 100% 정액 광고료 동의 (알선 수수료 0원)
  antiRebatePledge: boolean;         // 2026.03 공정위 리베이트 철폐 지침 준수 및 촌지 금지 서약
}

export interface B2BAdmissionApplication {
  applicationId: string;             // 예: "B2B-2026-HALL-8821"
  hallName: string;
  region: string;
  address: string;
  businessNumber: string;
  permitNumber: string;
  directorName: string;
  contactPhone: string;
  contactEmail: string;
  offeredDiscountRate: number;
  monthlyAdFee: number;              // 300,000원 고정
  commissionRate: number;            // 0원 (수수료 수취 금지)
  appliedAt: string;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED';
  expectedMonthlyRevenueEstimate: number; // 월 1건 유치 시 예상 매출액
  expectedRoiPercentage: number;     // 예상 광고 대비 ROI (%)
}

/**
 * 시범 권역 B2B 광고 참여 패키지 분류
 */
export type PilotAdPackageType =
  | 'PRIORITY_SLOT_STANDARD'       // 월 30만원: 지역 검색 상단 우선 노출 + 가상번호 트래킹 + 감면 뱃지
  | 'SHORTFORM_CONTENT_BUNDLE';     // 월 50만원: 우선 노출 + 장례 준비 안내 숏폼 콘텐츠 월 2편 제작 대행

/**
 * 사업계획서 10.1절 시범 권역 참여의향서(LOI, Letter of Intent) 제출 요청 모델
 */
export interface PilotLoiSubmission {
  hallId?: string;                   // 시범 권역 식장 ID (예: "fh-seoul-asan")
  hallName: string;                  // 시설 공식 명칭
  region: string;                    // 광역시도 (예: "서울특별시", "경기도")
  pilotDistrict: string;             // 시범 자치구 (예: "강남구", "성남시")
  directorName: string;              // 대표자 또는 총괄 사무장 성함
  contactPhone: string;              // 담당자 직통 연락처
  contactEmail: string;              // 전자세금계산서 수신 이메일
  businessNumber: string;            // 사업자등록번호
  adPackage: PilotAdPackageType;     // 선택 광고 상품
  offeredDiscountRate: number;       // 배웅 유족 제공 빈소 감면율 (10~30%)
  flatRateAgreed: boolean;           // 정액제 계약 동의 (건당 알선료 배제)
  antiRebatePledge: boolean;         // 공정위 리베이트 철폐 및 촌지 근절 확약
  trialPeriodMonths: number;         // 시범 참여 보증 기간 (기본 3개월)
  signatureName: string;             // 전자 서명인 성함
}

/**
 * 발급 완료된 공식 참여의향서(LOI) 증서 모델
 */
export interface PilotLoiDocument {
  loiNumber: string;                 // 고유 관리 번호 (예: "LOI-2026-PILOT-8821")
  hallId?: string;
  hallName: string;
  pilotDistrict: string;
  directorName: string;
  contactPhone: string;
  contactEmail: string;
  businessNumber: string;
  adPackage: PilotAdPackageType;
  adPackageName: string;             // 한글 표시명
  monthlyAdFee: number;              // 월 정액 광고료 (30만 또는 50만 원)
  offeredDiscountRate: number;
  trialPeriodMonths: number;
  issuedAt: string;
  trialValidUntil: string;
  status: 'SUBMITTED' | 'CONFIRMED';
  expectedMonthlyRevenue: number;    // 월 1건 성약 시 예상 시설 매출
  expectedRoiPercentage: number;     // 예상 ROI (%)
  legalNotice: string;               // 공정거래위원회 리베이트 금지 고시 준수 명시
  proposalSummary: string;           // 핵심 혜택 요약 문구
}

/**
 * 시범 권역 LOI 유치 달성도 현황 모델 (사업계획서 10.1절 20% 달성 판정용)
 */
export interface PilotLoiStatusSummary {
  totalTargetHalls: number;          // 38개소
  targetLoiCount: number;            // 8개소 (20% 목표)
  currentLoiCount: number;           // 현재 접수된 LOI 수
  achievementRatePercentage: number; // 달성률 (%)
  isTargetAchieved: boolean;         // 20% 이상 달성 여부
  hallsByDistrict: Record<string, number>; // 자치구별 접수 건수
}
