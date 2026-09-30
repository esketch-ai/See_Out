/**
 * 배웅(BAEUNG) 1단계 사업계획서 3.3절 & 4.4절
 * 3대 부가 제휴사(봉안당·수목장·유품정리) 입점 심사 및 제휴 데이터 모델
 *
 * 법령 준수 기준:
 * 1. 봉안시설: 「장사 등에 관한 법률」 제15조 및 시행령 별표3 신고 필증
 * 2. 수목장림: 「장사법」 제16조 및 「산림자원법」 자연장지 인허가 증빙
 * 3. 유품정리: 「폐기물관리법」 사업장생활계/생활폐기물 수집·운반 허가 증빙
 * 4. 공통: 표시광고법 위반 금지 ("최저가", "100% 보장", "마감임박" 등 배제)
 */

export type AffiliateCategory = 'COLUMBARIUM' | 'WOODLAND_BURIAL' | 'ESTATE_CLEARING';

export interface AffiliatePricingItem {
  name: string;        // 품목명 (예: "개인 안치단 1위", "가족목 4위", "원룸 특수 소독")
  price: number;       // 정찰 가격 (원)
  unit: string;        // 단위 (예: "영구 안치", "1회 작업", "연간 관리비")
  description: string; // 설명
}

export interface TravelEstimate {
  distanceKm: number;          // 거리 (km)
  travelTimeMinutes: number;   // 차량 예상 이동시간 (분)
}

export interface AffiliatePartnerEntity {
  id: string;                         // 고유 식별자 (예: "aff-colum-bundang")
  category: AffiliateCategory;        // 부가 업종 분류
  categoryName: string;               // 업종 표시명 (봉안당 / 수목장림 / 유품정리)
  name: string;                       // 상호명
  region: string;                     // 광역시도
  district: string;                   // 시군구 (예: "성남시 분당구", "용인시 처인구", "광주시")
  address: string;                    // 도로명 주소
  phone: string;                      // 대표 연락처
  licenseNumber: string;              // 지자체 인허가/신고 번호 (필수 증빙)
  licenseType: string;                // 적용 법률 및 허가 유형 명칭
  statutoryClause: string;            // 근거 법률 조항 (예: "장사법 제15조", "폐기물관리법 제25조")
  isVerified: boolean;                // 인허가 서류 검증 완료 여부
  verifiedDate: string;               // 자격 심사 완료 일자
  latitude: number;                   // 위도
  longitude: number;                  // 경도
  /** 시범 권역(강남4구·성남) 주요 거점 기준 이동 거리/시간 (분당, 강남, 송파, 서초 등) */
  targetDistrictEstimates?: Record<string, TravelEstimate>;
  pricingInfo: AffiliatePricingItem[];// 정찰 가격 정보
  prohibitedKeywordCheckPassed: boolean; // 과장 광고 금지 심사 통과 여부
  adPricingModel: 'FIXED_FLAT_RATE';  // 100% 정액제 고정 (알선 리베이트 0원)
  monthlyAdFee: number;               // 월 광고비 (정액 20만~30만원)
  features: string[];                 // 주요 특장점
}

export interface AffiliateVerificationResult {
  partnerId: string;
  passed: boolean;
  checks: {
    licenseValid: boolean;
    licenseFormatValid: boolean;
    prohibitedWordsPassed: boolean;
    pricingDisclosed: boolean;
  };
  parsedDetails?: {
    licenseYear?: number;
    issuingDistrict?: string;
  };
  disqualificationReason?: string;
}

export interface AffiliateDistrictMatch {
  districtName: string; // 자치구명 (예: "성남시 분당구", "강남구", "송파구")
  matchedColumbarium?: {
    partner: AffiliatePartnerEntity;
    estimate: TravelEstimate;
  };
  matchedWoodlandBurial?: {
    partner: AffiliatePartnerEntity;
    estimate: TravelEstimate;
  };
  matchedEstateClearing?: {
    partner: AffiliatePartnerEntity;
    estimate: TravelEstimate;
  };
}
