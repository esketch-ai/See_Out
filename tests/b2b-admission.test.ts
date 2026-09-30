import { describe, it, expect } from 'vitest';
import { B2BAdmissionService, PilotLoiService } from '../src/b2b/index.js';

describe('B2BAdmissionService (장례식장 B2B 정액제 입점 제휴 신청)', () => {
  it('기본 시드 신청서 조회가 정상 작동해야 한다', () => {
    const app = B2BAdmissionService.getApplication('B2B-2026-HALL-1001');
    expect(app).toBeDefined();
    expect(app?.hallName).toBe('서울아산병원장례식장');
    expect(app?.monthlyAdFee).toBe(300_000);
    expect(app?.commissionRate).toBe(0);
  });

  it('필수 서약(정액제 광고 동의 및 리베이트 금지) 미동의 시 신청이 거부되어야 한다', () => {
    expect(() =>
      B2BAdmissionService.submitApplication({
        hallName: '테스트 장례식장',
        region: '경기도',
        address: '경기도 성남시 분당구',
        businessNumber: '123-45-67890',
        permitNumber: '제2021-01호',
        directorName: '홍길동',
        contactPhone: '031-123-4567',
        contactEmail: 'test@hall.kr',
        offeredDiscountRate: 20,
        flatRateAgreed: false,
        antiRebatePledge: true
      })
    ).toThrow('정액 광고료');
  });

  it('올바른 신청서 제출 시 고유 신청번호와 ROI 계산이 정상 산출되어야 한다', () => {
    const app = B2BAdmissionService.submitApplication({
      hallName: '분당제생병원장례식장',
      region: '경기도',
      address: '경기도 성남시 분당구 서현로180번길 20',
      businessNumber: '129-82-01992',
      permitNumber: '제1998-성남분당-장례식장-03호',
      directorName: '이진우 장례지도사',
      contactPhone: '031-779-0911',
      contactEmail: 'director@dmc.or.kr',
      offeredDiscountRate: 20, // 20% 감면
      flatRateAgreed: true,
      antiRebatePledge: true
    });

    expect(app.applicationId).toMatch(/^B2B-2026-HALL-\d{4}$/);
    expect(app.monthlyAdFee).toBe(300_000);
    expect(app.commissionRate).toBe(0);
    expect(app.expectedMonthlyRevenueEstimate).toBe(2_400_000); // 300만 * 0.8
    expect(app.expectedRoiPercentage).toBe(800); // 240만 / 30만 = 800%
    expect(app.status).toBe('SUBMITTED');
  });
});

describe('PilotLoiService (사업계획서 10.1절 시범 권역 B2B 1-Page 제안서 및 LOI 엔진)', () => {
  it('1-Page B2B 사업제안서 정보가 사업계획서 3.1절 정액제 원칙에 맞게 반환되어야 한다', () => {
    const proposal = PilotLoiService.getProposalDocument();
    expect(proposal.title).toContain('배웅');
    expect(proposal.coreBenefits.length).toBeGreaterThanOrEqual(4);
    expect(proposal.pricingPlans).toHaveLength(2);

    const standardPlan = proposal.pricingPlans.find((p) => p.type === 'PRIORITY_SLOT_STANDARD');
    expect(standardPlan?.monthlyPrice).toBe(300_000);
    expect(standardPlan?.isRecommended).toBe(true);

    const bundlePlan = proposal.pricingPlans.find((p) => p.type === 'SHORTFORM_CONTENT_BUNDLE');
    expect(bundlePlan?.monthlyPrice).toBe(500_000);

    expect(proposal.legalGuarantee).toContain('공정거래');
  });

  it('필수 서약(정액제 및 리베이트 근절) 미동의 시 LOI 접수가 거부되어야 한다', () => {
    expect(() =>
      PilotLoiService.submitLoi({
        hallName: '미즈메디병원장례식장',
        region: '서울특별시',
        pilotDistrict: '강남구',
        directorName: '김상우',
        contactPhone: '02-588-4444',
        contactEmail: 'mizmedi@hall.kr',
        businessNumber: '211-82-01990',
        adPackage: 'PRIORITY_SLOT_STANDARD',
        offeredDiscountRate: 20,
        flatRateAgreed: false, // 미동의
        antiRebatePledge: true,
        trialPeriodMonths: 3,
        signatureName: '김상우'
      })
    ).toThrow('정액제');
  });

  it('시범 권역 장례식장 LOI 정상 제출 시 고유번호 채번 및 3개월 보증 증서가 발급되어야 한다', () => {
    const loi = PilotLoiService.submitLoi({
      hallId: 'fh-seoul-gangnam-mizmedi',
      hallName: '미즈메디병원장례식장',
      region: '서울특별시',
      pilotDistrict: '강남구',
      directorName: '김상우 대표원장',
      contactPhone: '02-588-4444',
      contactEmail: 'mizmedi@hall.kr',
      businessNumber: '211-82-01990',
      adPackage: 'PRIORITY_SLOT_STANDARD',
      offeredDiscountRate: 20,
      flatRateAgreed: true,
      antiRebatePledge: true,
      trialPeriodMonths: 3,
      signatureName: '김상우'
    });

    expect(loi.loiNumber).toMatch(/^LOI-2026-PILOT-\d{4}$/);
    expect(loi.monthlyAdFee).toBe(300_000);
    expect(loi.expectedMonthlyRevenue).toBe(2_400_000); // 300만 * 0.8
    expect(loi.expectedRoiPercentage).toBe(800);
    expect(loi.status).toBe('CONFIRMED');
    expect(loi.trialPeriodMonths).toBe(3);
    expect(loi.legalNotice).toContain('알선 수수료 0원');
  });

  it('시범 권역 LOI 유치 달성도 현황이 목표 8개소(20%) 기준으로 정확히 계산되어야 한다', () => {
    const summary = PilotLoiService.getPilotLoiStatusSummary();
    expect(summary.totalTargetHalls).toBe(38);
    expect(summary.targetLoiCount).toBe(8);
    expect(summary.currentLoiCount).toBeGreaterThanOrEqual(2);
    expect(summary.achievementRatePercentage).toBe(
      Math.round((summary.currentLoiCount / 8) * 100)
    );
    expect(summary.hallsByDistrict).toBeDefined();
  });
});
