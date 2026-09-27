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
