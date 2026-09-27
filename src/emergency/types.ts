import { RegionCode } from '../funeral-halls/types.js';

export type DeceasedLocationType = 'hospital' | 'home' | 'care';

/**
 * 지역 전담 장례지도사 정보
 */
export interface FuneralDirectorEntity {
  id: string;                         // 고유 식별자
  name: string;                       // 지도사 성함
  licenseNo: string;                  // 국가공인 1급 자격번호 (예: "제11-0421호")
  experienceYears: number;            // 경력 연수
  primaryRegion: RegionCode;          // 관할 광역시도
  subRegion: string;                  // 거점 시군구
  baseCenterName: string;             // 소속 출동 의전센터 명칭
  directPhone: string;                // 직통 번호
  virtualPhone: string;               // 0507 안심 가상번호
  dedicatedVehicle: string;           // 전담 특수 운구차량 정보 (차종/차량번호)
  ratingAvg: number;                  // 평점 평균
  completedCases: number;             // 누적 의전 건수
  currentStatus: 'AVAILABLE' | 'EN_ROUTE' | 'ON_DUTY';
}

/**
 * 긴급 출동 요청 매칭 파라미터
 */
export interface DispatchMatchRequest {
  deceasedLocationType: DeceasedLocationType;
  locationDetail: string;             // 입력된 병원/자택 상세 위치
  funeralHallChoice: 'recommended' | 'designated';
  hallName?: string;                  // 희망 장례식장 명칭
}

/**
 * 동적 긴급 출동 배정 결과
 */
export interface DispatchMatchResult {
  dispatchId: string;                 // 출동 고유번호 (예: "DSP-2026-KR-7741")
  detectedRegion: RegionCode;         // 분석 판정된 권역
  detectedLocationSummary: string;    // 위치 요약 설명
  assignedDirector: FuneralDirectorEntity; // 최단거리 배정 지도사
  estimatedArrivalMinutes: number;    // 동적 ETA 소요시간 (분)
  estimatedArrivalTimeFormatted: string; // 예: "약 28분 이내 도착 (06:45 도착 예정)"
  distanceKm: number;                 // 거점 대기소 ➔ 현장 간 거리 (km)
  trafficStatus: 'SMOOTH' | 'MODERATE' | 'CONGESTED'; // 실시간 교통 상황
  vehicleDispatchInfo: string;        // 배차 차량 정보
  recommendedFuneralHall?: {
    name: string;
    address: string;
    phone: string;
    discountRatePercentage: number;
    travelMinutesFromLocation: number;
  };
}
