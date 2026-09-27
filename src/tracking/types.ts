/**
 * 배웅(BAEUNG) 1단계 사업계획서 7장(효과 측정 체계) 및 3.4절(정액제 수익 원칙) 데이터 모델
 * 핵심 원칙:
 * 1. 4단계 측정 퍼널 (노출 ➔ 관심 ➔ 접촉 ➔ 실질상담 ➔ 전환근사)
 * 2. 통신비밀보호법 준수 (통화 메타데이터만 수집, 녹음 미실시)
 * 3. 데이터-과금 분리 원칙 (측정 데이터와 광고비 산정 로직의 완전한 독립)
 */

/**
 * 4단계 효과 측정 퍼널 단계
 */
export type FunnelStageType =
  | 'STAGE_0_IMPRESSION'         // 0단계: 페이지뷰, 슬롯 노출 횟수
  | 'STAGE_1_ENGAGEMENT'         // 1단계: 상세페이지 체류(15초 이상), 사진·제원 조회
  | 'STAGE_2_CONTACT_ATTEMPT'    // 2단계: 전화 클릭(클릭투콜), 지도 클릭, 견적 조회
  | 'STAGE_3_SUBSTANTIAL_CALL'   // 3단계: 가상번호 실질 통화(30초 이상 상담 지속)
  | 'STAGE_4_CONVERSION_APPROX'; // 4단계: 견적 참조번호(REF) 발급 및 계약 근사

/**
 * 통신비밀보호법을 준수하는 가상번호 통화 메타데이터 (녹음 미실시)
 */
export interface VirtualCallMetadata {
  callId: string;                // 통화 고유 ID (예: "CALL-2026-KR-8492")
  hallId: string;                // 대상 장례식장 ID
  hallName: string;              // 대상 장례식장 명칭
  virtualNumber: string;         // 0507 가상 중계 번호 (예: "0507-1420-3910")
  destinationNumber: string;     // 실제 장례식장 직통 착신 번호 (예: "02-3010-2000")
  startedAt: string;             // 통화 개시 일시
  durationSeconds: number;       // 통화 지속 시간 (초)
  callStatus: 'CONNECTED' | 'MISSED' | 'BUSY' | 'REJECTED'; // 통화 연결 상태
  isSubstantialCall: boolean;    // 실질 상담 여부 (durationSeconds >= 30초)
  recordingDisabled: true;       // 통신비밀보호법 준수 녹음 미실시 플래그 (true 고정)
}

/**
 * 퍼널 트래킹 이벤트 로그
 */
export interface FunnelEventLog {
  eventId: string;
  hallId: string;
  stage: FunnelStageType;
  timestamp: string;
  metadata?: {
    referenceCode?: string;      // 4단계 견적 참조번호
    callDurationSeconds?: number;// 3단계 통화 시간
    userStaySeconds?: number;    // 1단계 체류 시간
    sourceChannel?: 'web' | 'mobile_web' | 'shortform'; // 유입 채널
  };
}

/**
 * 사업계획서 7장 기준 장례식장 파트너 월간 성과 리포트
 */
export interface PartnerPerformanceReport {
  reportId: string;              // 리포트 고유 식별자 (예: "REP-2026-09-FHASAN")
  hallId: string;                // 장례식장 ID
  hallName: string;              // 장례식장 명칭
  reportingPeriod: string;       // 리포트 대상 기간 (예: "2026년 09월 01일 ~ 09월 27일")
  
  // 4단계 퍼널 집계 지표
  impressions: number;           // 0단계: 목록 및 슬롯 노출 횟수
  engagements: number;           // 1단계: 상세 체류 및 제원 탐색 건수
  contactAttempts: number;       // 2단계: 전화 버튼 및 가상번호 클릭 시도 건수
  substantialCalls: number;      // 3단계: 30초 이상 실질 전화 상담 통화 건수
  quoteReferencesIssued: number; // 4단계: 견적 참조번호(REF) 발급 및 계약 전환 근사 건수

  // 단계별 전환율 (퍼센트)
  rates: {
    engagementRate: number;      // 노출 대비 관심율 (%)
    contactRate: number;         // 관심 대비 접촉 시도율 (%)
    callConnectRate: number;     // 접촉 시도 대비 30초 이상 실질 상담률 (%)
    quoteConversionRate: number; // 관심 대비 견적 참조번호 발급률 (%)
  };

  // 사업계획서 3.4절 & 7.4절 핵심 규약: 데이터-과금 분리 인증
  billing: {
    pricingModel: 'FIXED_FLAT_RATE'; // 100% 정액제 고정 (성과 연동 수수료 0원)
    monthlyFee: number;              // 월 300,000원
    commissionAmount: 0;             // 알선 수수료 0원 (공정위 제재 방어)
    dataBillingSeparationCertified: true; // 데이터-과금 분리 원칙 공식 인증
    complianceStatement: string;     // 공정위 및 장사법 준수 서약문
  };
}
