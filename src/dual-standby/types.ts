/**
 * 배웅(BAEUNG) 듀얼 스탠바이 (Dual-Standby, 무약정 사전 예치 등록)
 * 및 해약 손실 보전 바우처 (전환 크레딧) 타입 정의
 * 
 * 출처: 배웅 1단계 사업계획서 3.2절 & 기존 상조 해약 전환 방법안
 */

export interface StandbyRegistrationRequest {
  registrantName: string;            // 신청자 성함
  registrantPhone: string;           // 비상 연락처
  beneficiaryName: string;           // 피공제자(부모님/고인) 성함
  relationship: string;              // 관계 (부친, 모친, 배우자, 본인 등)
  existingCompany: string;           // 가입 중인 기존 상조사명
  existingProduct?: string;          // 가입 상품명
  paidTotalAmount?: number;          // 현재까지 실납입액
  termsAgreed: boolean;              // 사전 무약정 약관 동의
}

export interface LossProtectionVoucher {
  voucherCode: string;               // 예: "BAEUNG-STANDBY-2026-8831"
  voucherAmount: number;             // 바우처 보전 금액 (기본 300,000원 ~ 최대 500,000원)
  issuedTo: string;                  // 수혜자 성함
  issuedAt: string;                  // 발급 일시
  validUntil: string;                // 유효기간 (평생 유효)
  isRedeemed: boolean;               // 사용 완료 여부
  applicableBenefits: string[];      // 적용 가능 혜택 목록
}

export interface StandbyRegistration {
  registrationId: string;            // 예: "DS-2026-KR-8831"
  registrantName: string;            // 신청자 성함
  registrantPhone: string;           // 비상 연락처
  beneficiaryName: string;           // 피공제자 성함
  relationship: string;              // 관계
  existingCompany: string;           // 가입 중인 기존 상조사
  existingProduct: string;           // 가입 상품
  paidTotalAmount: number;           // 실 납입 누계액
  voucher: LossProtectionVoucher;    // 자동 발급된 손실 보전 바우처
  assignedDirectorName: string;      // 24시 전담 배정 장례지도사
  assignedDirectorPhone: string;     // 지도사 핫라인
  registeredAt: string;              // 등록 일자
  status: 'ACTIVE' | 'USED' | 'CANCELLED';
}
