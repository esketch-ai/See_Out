/**
 * 전국 장례식장 데이터 모델 및 통계 타입 정의
 * 원천 출처: 구글 독스 전국 장례식장 현황 및 보건복지부 e하늘 장사정보시스템
 * 문서 번호: ARCH-2026-HALLS-001
 * 원칙 준수: Andrej Karpathy 4대 원칙 (1. Understand & Inspect Data Thoroughly)
 */

/**
 * 4대 장례식장 운영 주체 분류
 */
export type FuneralHallCategory =
  | 'TERTIARY_HOSPITAL'       // 대학·상급종합병원 부설 (높은 비용, 높은 선호도, 빈소 7~18실, 안치 12~28구)
  | 'SPECIALIZED_INDEPENDENT' // 독립 전문 장례식장 (대형 주차타워, 직영 식음서비스, 빈소 4~18실, 안치 4~34구)
  | 'CARE_HOSPITAL'           // 요양병원 부설 (원내 입원환자 연계, 빈소 3~6실, 안치 4~10구)
  | 'PUBLIC_MUNICIPAL';       // 공설 및 지방의료원 (조례 기반 저렴한 사용료, 취약계층 공공안전망)

/**
 * 17개 시·도 행정구역 명칭
 */
export type RegionCode =
  | '서울특별시'
  | '부산광역시'
  | '대구광역시'
  | '인천광역시'
  | '광주광역시'
  | '대전광역시'
  | '울산광역시'
  | '세종특별자치시'
  | '경기도'
  | '강원특별자치도'
  | '충청북도'
  | '충청남도'
  | '전북특별자치도'
  | '전라남도'
  | '경상북도'
  | '경상남도'
  | '제주특별자치도';

/**
 * 장례식장 개별 상세 엔티티
 */
export interface FuneralHallEntity {
  id: string;                        // 고유 식별자 (예: "fh-seoul-asan")
  name: string;                      // 시설 명칭 (예: "서울아산병원장례식장")
  region: RegionCode;                // 광역 시·도
  subRegion: string;                 // 기초 시·군·구 (예: "송파구", "부산진구")
  address: string;                   // 관할 구역 및 도로명 상세 주소
  phone: string;                     // 대표 연락처
  roomCount: number;                 // 분향실(빈소) 수
  capacityCount: number;             // 안치실 수용 구 수
  category: FuneralHallCategory;     // 운영 주체 분류
  parking: string;                   // 주차 시설 정보 (주차 대수, 주차타워 등)
  conveniences: string[];            // 주요 편의시설 목록
  isBaeungPartner: boolean;          // 배웅 제휴 할인 식장 여부
  discountRate: number;              // 배웅 이용 시 빈소 임대료 감면율 (0.00 ~ 0.50)
  dailyRentEstimate: number;         // 1일 빈소 임대료 추정 단가 (원, 평형별 가중 평균)
  // [신규 고도화 필드 - 지도 및 정밀 제원]
  latitude?: number;                 // 위도
  longitude?: number;                // 경도
  nearestSubway?: string;            // 인근 지하철역 및 도보 접근성
  nearestCrematorium?: string;       // 가장 가까운 연계 화장장(승화원)
  crematoriumDistanceKm?: number;    // 화장장까지의 도로 이동 거리 (km)
  crematoriumTravelMinutes?: number; // 화장장까지의 평균 운구 소요 시간 (분)
  roomTypes?: {
    name: string;                    // 예: "소형 35평형", "특실 80평형", "VIP 120평형"
    pyeong: number;
    dailyPrice: number;
    recommendedGuests: string;
  }[];
  // [사업계획서 1단계 - 무빈소·가족장 큐레이션 및 공시 기준일 필드]
  allowsDirectCremation?: boolean;   // 무빈소 직송·안치 가능 여부 (전국 948개소/약 92%)
  directCremationFee?: number;      // 1일 안치실+입관실 기본 실비 (평균 30만~55만원)
  hasSmallFamilyRoom?: boolean;     // 10~35평형 소규모 가족장 전용 빈소 보유 여부
  pricingBaseDate?: string;         // 가격 공시 기준일 (예: "2023.06 보건복지부 e하늘 공시")
  isPriceVerified?: boolean;        // 현장 최신 가격 검증 여부
  // [사업계획서 1단계 시범 지역 지정]
  isPilotRegion?: boolean;          // 1단계 시범 권역(수도권 동남부: 강남4구·성남) 소속 여부
  pilotDistrict?: string;           // 시범 권역 내 자치구/시 (강남구/서초구/송파구/강동구/성남시)
}

/**
 * 사업계획서 1단계 시범 권역(수도권 동남부) 요약 통계 모델
 */
export interface PilotRegionSummary {
  regionName: string;                  // 시범 권역 명칭 (예: "수도권 동남부 1차 시범 권역 (강남4구·성남)")
  totalHalls: number;                  // 권역 내 대상 장례식장 총 수 (38개소)
  hospitalAffiliatedCount: number;     // 대학·종합병원 및 요양병원 부설 수
  independentSpecializedCount: number; // 전문 독립 장례식장 수
  publicMunicipalCount: number;        // 공설 및 지방의료원 수
  directCremationAvailableCount: number;// 무빈소 직송 가능 시설 수
  directCremationRate: number;         // 무빈소 가능 비율 (%)
  averageDailyRent: number;            // 1일 빈소 평균 임대료 (원)
  minDailyRent: number;                // 최저 빈소 임대료 (원)
  maxDailyRent: number;                // 최고 빈소 임대료 (원)
  averageCrematoriumMinutes: number;   // 서울추모공원/영생원 평균 이동 시간 (분)
  targetLoiCount: number;              // 시범 참여의향서(LOI) 20% 유치 목표 수
}

/**
 * 장례 형태 구분 (무빈소 직송 vs 소규모 가족장 vs 일반 3일장)
 */
export type FuneralTypePreference = 'all' | 'direct_cremation' | 'small_family' | 'standard_3day';

/**
 * 사업계획서 7.3절 기준 견적 참조번호(REF) 및 공식 견적서 모델
 */
export interface FuneralHallQuoteReference {
  referenceCode: string;          // 고유 식별 참조번호 (예: "REF-2026-KR-7729")
  hallId: string;                 // 장례식장 ID
  hallName: string;               // 장례식장 명칭
  hallPhone: string;              // 장례식장 직통 연락처
  hallAddress: string;            // 장례식장 도로명 주소
  funeralType: FuneralTypePreference; // 선택한 장례 형태
  funeralTypeName: string;        // 표시 명칭 (예: "무빈소 직송·안치식", "소규모 가족장")
  roomDailyRent: number;          // 1일 빈소 임대료
  stayDays: number;               // 빈소 임대 일수 (0일 또는 2일)
  coldStorageDailyFee: number;    // 1일 안치실 사용료
  encoffinmentRoomFee: number;    // 입관실 1회 사용료
  facilitySubtotal: number;       // 장례식장 시설 사용료 정가 합계
  baeungDiscountAmount: number;   // 배웅 사전 등록 감면 할인액
  finalFacilityCost: number;      // 최종 시설 부담액 (정가 - 감면액)
  applicantName: string;          // 신청인 성함
  applicantPhone: string;         // 신청인 연락처
  issuedAt: string;               // 발급 일시 (예: "2026년 09월 27일 19:42")
  validUntil: string;             // 견적 보증 유효기간 (발급일로부터 30일)
  legalComplianceNote: string;    // 공정거래위원회 리베이트 금지 고시 준수 명시
  counselingNotice: string;       // 장례식장 상담 시 안내 멘트
}

/**
 * 광역시도별 인프라 통계 모델
 */
export interface RegionalStat {
  region: RegionCode;
  registeredCount: number;           // 지자체 인허가 등록 시설 수
  keyClusterNotes: string;           // 주요 집중 지자체 및 공급 특성
}

/**
 * 장례식장 검색 필터 옵션
 */
export interface FuneralHallSearchFilter {
  keyword?: string;                  // 시설명 또는 주소 키워드
  region?: RegionCode;               // 광역시도
  category?: FuneralHallCategory;    // 운영 주체
  onlyPartner?: boolean;             // 배웅 제휴 할인 식장만 조회
  onlyPilotRegion?: boolean;         // 1단계 시범 권역(강남4구·성남) 식장만 조회
  pilotDistrict?: string;            // 시범 권역 특정 자치구 필터
  minRooms?: number;                 // 최소 빈소 수
  minCapacity?: number;              // 최소 안치실 수용량
  funeralType?: FuneralTypePreference; // 무빈소 / 소규모 가족장 / 일반 3일장 필터
  allowsDirectCremation?: boolean;   // 무빈소 가능 식장만 조회
  hasSmallFamilyRoom?: boolean;      // 소규모 가족장 빈소 보유 식장만 조회
}
