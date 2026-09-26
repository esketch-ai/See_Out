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
  minRooms?: number;                 // 최소 빈소 수
  minCapacity?: number;              // 최소 안치실 수용량
}
