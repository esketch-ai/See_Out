/**
 * 배웅(BAEUNG) 부가 전문 상담 서비스 아키텍처 및 데이터 모델
 * 1. 생전 심리상담 & 유가족 사별 애도 심리상담 (Grief & End-of-Life Care)
 * 2. 상속·유산·유류분·채무정리 전문 변호사 법률 상담 (Inheritance & Estate Law)
 *
 * 법적·윤리적 준수 기준:
 * - 「변호사법」 제34조(동업 및 사건소개·알선 수수료 수취 전면 금지) 100% 준수: 플랫폼 중개 수수료 0원 (Zero Referral Fee)
 * - 보건복지부 및 한국심리학회/한국상담심리학회 공인 1급 전문가 자격 검증 (민간 무자격 상담 배제)
 * - 「민법」 제1019조 상속포기·한정승인 3개월 법정 골든타임 알림 체계
 */

export type CareVertical = 'PSYCHOLOGY_CARE' | 'LEGAL_INHERITANCE';

export type CareCategory =
  // 1. 심리 상담 버티컬
  | 'PRE_MORTEM_LIFE_CARE'    // 생전 마음돌봄 / 죽음불안 완화 / 삶의 회고(Life Review)
  | 'BEREAVEMENT_GRIEF'       // 유가족 사별 애도 / 복합비탄(Complicated Grief) 치유
  // 2. 법률·상속 버티컬
  | 'ESTATE_DEBT_DEFENSE'     // 빚 대물림 방지: 상속포기 / 한정승인 (3개월 골든타임)
  | 'INHERITANCE_DISPUTE'     // 상속재산분할 심판 / 기여분 / 유류분 반환 청구
  | 'GUARDIANSHIP_WILL'       // 성년후견 / 유언공증 / 디지털 유산 사후 승계
  | 'INHERITANCE_TAX_LEGAL';  // 상속세·취득세 절세 및 세무변호

export interface ConsultationPricingItem {
  name: string;          // 상담 상품명 (예: "30분 전화/대면 쟁점 진단", "50분 1회기 심층 애도상담")
  price: number;         // 정찰 가격 (원)
  duration: string;      // 소요 시간 (예: "30분", "50분", "사건 종결 시까지")
  description: string;   // 상담 범위 및 세부 안내
}

export interface ProfessionalProfile {
  id: string;                       // 고유 식별자 (예: "care-psy-01", "law-inh-01")
  vertical: CareVertical;           // 버티컬 분류 (심리케어 vs 법률상속)
  category: CareCategory;           // 세부 전문 분야
  categoryName: string;             // 한글 표시명
  name: string;                     // 전문가 성명
  title: string;                    // 직함 (예: "수석 임상심리전문가", "대한변협 등록 상속전문변호사")
  organization: string;             // 소속 기관/법무법인명
  licenseInfo: string;              // 국가공인/대한변협 자격 번호
  experienceYears: number;          // 전문 경력 연수 (예: 25년)
  badge: string;                    // 대표 인증 뱃지 (예: "보건복지부 1급", "대한변협 상속전문")
  directPhone: string;              // 직통 번호
  virtualPhone: string;             // 0507 안심가상번호 (개인정보 보호)
  address: string;                  // 사무소/센터 소재지
  specialties: string[];            // 세부 전문 취급 분야
  consultationFees: ConsultationPricingItem[]; // 정찰제 상담 수가
  introduction: string;             // 전문가 소개말
  
  // 컴플라이언스 필수 항목
  attorneyLawAct34Compliant: boolean; // 변호사법 제34조 준수 (알선 수수료 0원)
  platformReferralFee: number;         // 플랫폼 중개 수수료 = 반드시 0원
  licenseVerified: boolean;           // 자격증 원본 대조 확인 완료 여부
}

export interface InheritanceDeadlines {
  dateOfDeath: string;                         // 고인 사망일자 (YYYY-MM-DD)
  limitedAcceptanceDeadline: string;           // 상속포기/한정승인 만료일 (사망일 + 3개월)
  daysRemainingAcceptance: number;             // 상속포기 잔여 일수
  isAcceptanceExpired: boolean;                // 만료 여부
  warningLevel: 'SAFE' | 'WARNING' | 'CRITICAL' | 'EXPIRED'; // 주의 등급 (30일 이내 CRITICAL)
  
  estateTaxDeadline: string;                   // 상속세 신고기한 (사망월 말일 + 6개월)
  daysRemainingEstateTax: number;              // 상속세 잔여 일수
}

export interface ConsultationBookingRequest {
  clientName: string;
  clientPhone: string;
  professionalId: string;
  targetCategory: CareCategory;
  preferredDate?: string;
  memo: string;
  agreedToZeroCommission: boolean;
  privacyAgreed: boolean;
}

export interface ConsultationBookingResult {
  bookingId: string;
  status: 'CONFIRMED' | 'PENDING';
  professionalName: string;
  organization: string;
  virtualPhone: string;
  notice: string;
  platformFeeCharged: number; // 0원
}
