import { describe, it, expect } from 'vitest';
import {
  ProfessionalCareService,
  VERIFIED_PROFESSIONALS,
  CareVertical,
  ProfessionalProfile
} from '../src/professional-care/index.js';

describe('ProfessionalCareService - 생전·유족 심리상담 & 상속 전문 변호사 자문 서비스 검증', () => {
  describe('1. 데이터 무결성 및 컴플라이언스 기본 검증', () => {
    it('모든 전문가 프로필은 변호사법 제34조에 따라 플랫폼 중개 수수료가 반드시 0원이어야 한다', () => {
      const allProfessionals = ProfessionalCareService.getAllProfessionals();
      expect(allProfessionals.length).toBeGreaterThanOrEqual(6);

      allProfessionals.forEach((p) => {
        expect(p.platformReferralFee).toBe(0);
        expect(p.attorneyLawAct34Compliant).toBe(true);
        expect(p.licenseVerified).toBe(true);
        expect(p.consultationFees.length).toBeGreaterThanOrEqual(1);
        p.consultationFees.forEach((fee) => {
          expect(fee.price).toBeGreaterThan(0);
          expect(fee.duration).toBeDefined();
        });
      });
    });

    it('심리상담과 법률상속 버티컬로 정확히 분리 조회되어야 한다', () => {
      const psyPros = ProfessionalCareService.getProfessionalsByVertical('PSYCHOLOGY_CARE');
      const lawPros = ProfessionalCareService.getProfessionalsByVertical('LEGAL_INHERITANCE');

      expect(psyPros.length).toBeGreaterThanOrEqual(3);
      expect(lawPros.length).toBeGreaterThanOrEqual(3);

      psyPros.forEach((p) => expect(p.vertical).toBe('PSYCHOLOGY_CARE'));
      lawPros.forEach((p) => expect(p.vertical).toBe('LEGAL_INHERITANCE'));
    });

    it('세부 전문 카테고리별로 올바르게 필터링되어야 한다', () => {
      const debtDefensePros = ProfessionalCareService.getProfessionalsByCategory('ESTATE_DEBT_DEFENSE');
      expect(debtDefensePros.length).toBeGreaterThanOrEqual(1);
      expect(debtDefensePros[0].name).toContain('윤태호');

      const griefPros = ProfessionalCareService.getProfessionalsByCategory('BEREAVEMENT_GRIEF');
      expect(griefPros.length).toBeGreaterThanOrEqual(1);
      expect(griefPros.some((p) => p.name.includes('박은주'))).toBe(true);
    });
  });

  describe('2. 변호사법 제34조 규제 위반 방지 검증 (Zero Commission Guard)', () => {
    it('적격 전문가에 대해 변호사법 제34조 검증이 통과되어야 한다', () => {
      const lawyer = ProfessionalCareService.getProfessionalById('law-inh-01');
      expect(lawyer).toBeDefined();
      const compliance = ProfessionalCareService.verifyAttorneyLawAct34Compliance(lawyer!);
      expect(compliance.isCompliant).toBe(true);
    });

    it('플랫폼이 중개수수료를 1원이라도 수취할 경우 즉시 컴플라이언스 위반으로 차단되어야 한다', () => {
      const illegalLawyer: ProfessionalProfile = {
        ...VERIFIED_PROFESSIONALS[3],
        platformReferralFee: 30000 // 위법적인 알선 소개료 책정
      };

      const compliance = ProfessionalCareService.verifyAttorneyLawAct34Compliance(illegalLawyer);
      expect(compliance.isCompliant).toBe(false);
      expect(compliance.reason).toContain('변호사법 제34조 위반');
    });

    it('면허 미검증 전문가의 경우 컴플라이언스 심사에서 탈락되어야 한다', () => {
      const unverified: ProfessionalProfile = {
        ...VERIFIED_PROFESSIONALS[0],
        licenseVerified: false
      };

      const compliance = ProfessionalCareService.verifyAttorneyLawAct34Compliance(unverified);
      expect(compliance.isCompliant).toBe(false);
      expect(compliance.reason).toContain('자격 검증이 완료되지 않은');
    });
  });

  describe('3. 상속포기/한정승인 3개월 골든타임 & 상속세 6개월 법정 기한 자동 계산기', () => {
    it('사망일자로부터 정확히 3개월 상속포기 기한과 6개월 상속세 기한을 산출해야 한다', () => {
      // 2026-09-01 사망, 2026-09-10 기준
      const result = ProfessionalCareService.calculateInheritanceDeadlines('2026-09-01', '2026-09-10');

      expect(result.dateOfDeath).toBe('2026-09-01');
      expect(result.limitedAcceptanceDeadline).toBe('2026-12-01'); // 3개월 후
      expect(result.isAcceptanceExpired).toBe(false);
      expect(result.daysRemainingAcceptance).toBeGreaterThan(70);
      expect(result.warningLevel).toBe('SAFE');

      // 상속세: 9월 말일(9월 30일) + 6개월 = 2027년 3월 31일
      expect(result.estateTaxDeadline).toBe('2027-03-31');
    });

    it('골든타임이 30일 이내로 남은 경우 CRITICAL 경고 레벨을 반환해야 한다', () => {
      // 2026-06-15 사망, 2026-09-01 기준 (만료일: 2026-09-15, 잔여 약 14일)
      const result = ProfessionalCareService.calculateInheritanceDeadlines('2026-06-15', '2026-09-01');

      expect(result.daysRemainingAcceptance).toBeLessThanOrEqual(30);
      expect(result.daysRemainingAcceptance).toBeGreaterThan(0);
      expect(result.warningLevel).toBe('CRITICAL');
      expect(result.isAcceptanceExpired).toBe(false);
    });

    it('3개월이 경과한 경우 EXPIRED 상태를 반환해야 한다', () => {
      // 2026-01-01 사망, 2026-05-01 기준
      const result = ProfessionalCareService.calculateInheritanceDeadlines('2026-01-01', '2026-05-01');

      expect(result.isAcceptanceExpired).toBe(true);
      expect(result.warningLevel).toBe('EXPIRED');
    });

    it('유효하지 않은 사망일자 입력 시 에러를 던져야 한다', () => {
      expect(() => {
        ProfessionalCareService.calculateInheritanceDeadlines('invalid-date');
      }).toThrow('유효하지 않은 사망일자 형식');
    });
  });

  describe('4. 1:1 안심 상담 예약 및 0원 수수료 예약 생성 엔진', () => {
    it('변호사법 제34조 무수수료 미동의 시 예약이 거부되어야 한다', () => {
      expect(() => {
        ProfessionalCareService.bookConsultation({
          clientName: '홍길동',
          clientPhone: '010-1234-5678',
          professionalId: 'law-inh-01',
          targetCategory: 'ESTATE_DEBT_DEFENSE',
          memo: '선친 채무 8천만원 조회됨',
          agreedToZeroCommission: false, // 미동의
          privacyAgreed: true
        });
      }).toThrow('변호사법 제34조 준수를 위한 중개수수료 0원');
    });

    it('개인정보 수집 미동의 시 예약이 거부되어야 한다', () => {
      expect(() => {
        ProfessionalCareService.bookConsultation({
          clientName: '홍길동',
          clientPhone: '010-1234-5678',
          professionalId: 'care-psy-01',
          targetCategory: 'BEREAVEMENT_GRIEF',
          memo: '어머니 사별 후 극심한 우울감',
          agreedToZeroCommission: true,
          privacyAgreed: false // 미동의
        });
      }).toThrow('개인정보 수집 및 제3자 제공 동의가 필요합니다');
    });

    it('정상 예약 시 플랫폼 수수료 0원 고정 및 안심 가상번호가 발급되어야 한다', () => {
      const booking = ProfessionalCareService.bookConsultation({
        clientName: '이서진',
        clientPhone: '010-9876-5432',
        professionalId: 'law-inh-01',
        targetCategory: 'ESTATE_DEBT_DEFENSE',
        preferredDate: '2026-10-05',
        memo: '안심상속 조회서류 준비 완료, 30분 전화상담 희망',
        agreedToZeroCommission: true,
        privacyAgreed: true
      });

      expect(booking.bookingId).toMatch(/^CARE-BK-\d{8}-\d{4}$/);
      expect(booking.status).toBe('CONFIRMED');
      expect(booking.professionalName).toContain('윤태호');
      expect(booking.platformFeeCharged).toBe(0); // 0원 보장
      expect(booking.virtualPhone).toBe('0507-1854-9301');
      expect(booking.notice).toContain('어떠한 수수료도 수취하지 않습니다');
    });

    it('심리상담 예약 시 심리센터 직통 안내문구가 교부되어야 한다', () => {
      const booking = ProfessionalCareService.bookConsultation({
        clientName: '김민주',
        clientPhone: '010-5555-4444',
        professionalId: 'care-psy-01',
        targetCategory: 'BEREAVEMENT_GRIEF',
        memo: '사별 애도 1회기 대면상담 예약',
        agreedToZeroCommission: true,
        privacyAgreed: true
      });

      expect(booking.status).toBe('CONFIRMED');
      expect(booking.professionalName).toContain('박은주');
      expect(booking.platformFeeCharged).toBe(0);
      expect(booking.notice).toContain('공인 심리상담 센터로 직통 전달');
    });
  });
});
