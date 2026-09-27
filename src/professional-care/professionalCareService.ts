import {
  CareVertical,
  CareCategory,
  ProfessionalProfile,
  InheritanceDeadlines,
  ConsultationBookingRequest,
  ConsultationBookingResult
} from './types.js';
import { VERIFIED_PROFESSIONALS } from './dataset.js';

export class ProfessionalCareService {
  private static professionals: ProfessionalProfile[] = VERIFIED_PROFESSIONALS;

  /**
   * 전체 전문가 목록 조회
   */
  public static getAllProfessionals(): ProfessionalProfile[] {
    return [...this.professionals];
  }

  /**
   * 버티컬별 전문가 필터링 (심리케어 vs 법률상속)
   */
  public static getProfessionalsByVertical(vertical: CareVertical): ProfessionalProfile[] {
    return this.professionals.filter((p) => p.vertical === vertical);
  }

  /**
   * 세부 카테고리별 전문가 필터링
   */
  public static getProfessionalsByCategory(category: CareCategory): ProfessionalProfile[] {
    return this.professionals.filter((p) => p.category === category);
  }

  /**
   * 특정 전문가 단건 조회
   */
  public static getProfessionalById(id: string): ProfessionalProfile | undefined {
    return this.professionals.find((p) => p.id === id);
  }

  /**
   * 「변호사법」 제34조(동업 및 사건소개·알선 수수료 수취 금지) 준수 여부 정밀 검증
   * - 플랫폼 중개 수수료가 0원이어야 하며, 공인 면허 대조가 완료되어야 함
   */
  public static verifyAttorneyLawAct34Compliance(profile: ProfessionalProfile): {
    isCompliant: boolean;
    reason?: string;
  } {
    if (profile.platformReferralFee !== 0) {
      return {
        isCompliant: false,
        reason: `변호사법 제34조 위반: 플랫폼 중개 수수료(${profile.platformReferralFee}원) 수취는 엄격히 금지됩니다.`
      };
    }

    if (!profile.attorneyLawAct34Compliant) {
      return {
        isCompliant: false,
        reason: '변호사법 제34조 무알선·무수수료 확약이 확인되지 않았습니다.'
      };
    }

    if (!profile.licenseVerified) {
      return {
        isCompliant: false,
        reason: '대한변호사협회 또는 국가공인 자격 검증이 완료되지 않은 전문가입니다.'
      };
    }

    return { isCompliant: true };
  }

  /**
   * 「민법」 제1019조 상속포기/한정승인 3개월 골든타임 & 상속세 6개월 법정 기한 자동 계산기
   * @param dateOfDeathStr 사망일자 (YYYY-MM-DD)
   * @param referenceDateStr 기준일자 (기본값: 오늘)
   */
  public static calculateInheritanceDeadlines(
    dateOfDeathStr: string,
    referenceDateStr?: string
  ): InheritanceDeadlines {
    const deathDate = new Date(dateOfDeathStr);
    if (isNaN(deathDate.getTime())) {
      throw new Error(`유효하지 않은 사망일자 형식입니다: ${dateOfDeathStr}`);
    }

    const refDate = referenceDateStr ? new Date(referenceDateStr) : new Date();

    // 1. 상속포기·한정승인 만료일: 사망일로부터 정확히 3개월
    const limitedDeadlineDate = new Date(deathDate);
    limitedDeadlineDate.setMonth(limitedDeadlineDate.getMonth() + 3);

    // 날짜 차이 계산 (밀리초 -> 일)
    const msPerDay = 1000 * 60 * 60 * 24;
    const daysRemainingAcceptance = Math.ceil(
      (limitedDeadlineDate.getTime() - refDate.getTime()) / msPerDay
    );

    const isAcceptanceExpired = daysRemainingAcceptance < 0;

    let warningLevel: InheritanceDeadlines['warningLevel'] = 'SAFE';
    if (isAcceptanceExpired) {
      warningLevel = 'EXPIRED';
    } else if (daysRemainingAcceptance <= 30) {
      warningLevel = 'CRITICAL';
    } else if (daysRemainingAcceptance <= 60) {
      warningLevel = 'WARNING';
    } else {
      warningLevel = 'SAFE';
    }

    // 2. 상속세 신고기한: 상속개시일이 속한 달의 말일부터 6개월
    // 예: 3월 15일 사망 -> 3월 말일(3월 31일) + 6개월 = 9월 30일
    const year = deathDate.getFullYear();
    const month = deathDate.getMonth(); // 0-indexed
    // 해당 달의 마지막 날
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
    const estateTaxDeadlineDate = new Date(year, month + 1 + 6, 0); // 말일 기준 6개월 후 말일

    const daysRemainingEstateTax = Math.ceil(
      (estateTaxDeadlineDate.getTime() - refDate.getTime()) / msPerDay
    );

    const formatDate = (d: Date) => {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    };

    return {
      dateOfDeath: formatDate(deathDate),
      limitedAcceptanceDeadline: formatDate(limitedDeadlineDate),
      daysRemainingAcceptance,
      isAcceptanceExpired,
      warningLevel,
      estateTaxDeadline: formatDate(estateTaxDeadlineDate),
      daysRemainingEstateTax
    };
  }

  /**
   * 1:1 안심 상담 예약 신청 접수
   * - 변호사법 제34조 준수: 플랫폼 중개 수수료 0원 고정
   */
  public static bookConsultation(booking: ConsultationBookingRequest): ConsultationBookingResult {
    if (!booking.agreedToZeroCommission) {
      throw new Error('변호사법 제34조 준수를 위한 중개수수료 0원 및 직접 수임 안내 동의가 필요합니다.');
    }

    if (!booking.privacyAgreed) {
      throw new Error('원활한 상담 연결을 위한 개인정보 수집 및 제3자 제공 동의가 필요합니다.');
    }

    const professional = this.getProfessionalById(booking.professionalId);
    if (!professional) {
      throw new Error(`해당 ID의 전문가를 찾을 수 없습니다: ${booking.professionalId}`);
    }

    const compliance = this.verifyAttorneyLawAct34Compliance(professional);
    if (!compliance.isCompliant) {
      throw new Error(`자격 심사 미비로 예약할 수 없습니다: ${compliance.reason}`);
    }

    const bookingId = `CARE-BK-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    const isLegal = professional.vertical === 'LEGAL_INHERITANCE';
    const notice = isLegal
      ? '본 예약은 배웅의 공공 정보 디렉터리 시스템을 통해 담당 변호사 사무실로 직통 전달되며, 배웅은 어떠한 수수료도 수취하지 않습니다. 상담료는 변호사 사무소에 직접 결제하십시오.'
      : '본 예약은 공인 심리상담 센터로 직통 전달되며, 상담 진행 일정 확정을 위해 담당 상담센터에서 고객님께 직접 안심번호로 연락드립니다.';

    return {
      bookingId,
      status: 'CONFIRMED',
      professionalName: professional.name,
      organization: professional.organization,
      virtualPhone: professional.virtualPhone,
      notice,
      platformFeeCharged: 0
    };
  }
}
