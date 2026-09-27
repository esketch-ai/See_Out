import { describe, it, expect } from 'vitest';
import { B2BAdmissionService } from '../src/b2b/index.js';

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
