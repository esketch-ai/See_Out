/**
 * 배웅(BAEUNG) 1단계 사업계획서 3.1절, 4.3절 및 6장(리스크 12번)
 * 옵트아웃(정보 정정·게재 중단) 및 비제휴 법적 고지 컴플라이언스 모델
 */

export type OptOutRequestType = 'CORRECTION' | 'TAKEDOWN';
export type RequesterRole = 'DIRECTOR' | 'OWNER' | 'ADMIN' | 'OTHER';
export type OptOutStatus = 'RECEIVED' | 'VERIFYING' | 'RESOLVED_HIDDEN' | 'RESOLVED_CORRECTED';

export interface OptOutRequest {
  requestId: string;           // 접수 고유 번호 (예: "OPT-2026-KR-8492")
  hallId: string;              // 대상 장례식장 고유 ID
  hallName: string;            // 대상 장례식장 명칭
  requestType: OptOutRequestType; // 정정 vs 게재 중단
  requesterRole: RequesterRole;   // 신청인 권한 (장례지도사, 대표, 관리자 등)
  requesterName: string;       // 신청인 성명
  requesterPhone: string;      // 신청인 연락처
  requesterEmail: string;      // 신청인 이메일
  details: string;             // 정정 요청 내용 또는 게재 중단 사유
  status: OptOutStatus;        // 처리 상태
  submittedAt: string;         // 접수 일시
  resolvedAt?: string;         // 처리 완료 일시
}

export interface NonAffiliationDisclaimer {
  title: string;
  statement: string;
  publicDataSource: string;
  publicDataDate: string;
  optOutNotice: string;
  inquiryContact: string;
}
