import { describe, it, expect } from 'vitest';
import {
  StatutoryRefundCalculator,
  HiddenCostEstimator,
  QuoteDiagnosticsEngine,
  BENCHMARK_CERT_B_PREMIUM450,
  BENCHMARK_CERT_P_EVERGREEN590,
  BENCHMARK_CERT_H_SAFE480_MATURE,
  CertificateExtractionSchema,
  DualStandbyService,
  SAMPLE_DUAL_STANDBY
} from '../src/quote-diagnostics/index.js';

describe('StatutoryRefundCalculator (공정위 고시 기준 해약환급금 엔진)', () => {
  it('1~3회차 극초기 해약 시 모집수수료 공제로 환급금 0원이어야 한다', () => {
    const earlyCert: CertificateExtractionSchema = {
      ...BENCHMARK_CERT_B_PREMIUM450,
      paidInstallments: 2,
      paidTotalAmount: 60_000
    };

    const result = StatutoryRefundCalculator.calculateRefund(earlyCert);
    expect(result.refundAmount).toBe(0);
    expect(result.refundRatePercentage).toBe(0);
    expect(result.lossAmount).toBe(60_000);
  });

  it('중도 납입 42회차(진행률 28%)의 경우 공정위 체증 환급률 곡선이 올바르게 계산되어야 한다', () => {
    const result = StatutoryRefundCalculator.calculateRefund(BENCHMARK_CERT_B_PREMIUM450);
    
    // 진행률 = 42 / 150 = 0.28 (20% ~ 50% 구간)
    // rate = 0.50 + 0.25 * ((0.28 - 0.20) / 0.30) = 0.50 + 0.25 * (0.08 / 0.30) = 0.50 + 0.0666... ≈ 56.7%
    expect(result.refundRatePercentage).toBeGreaterThanOrEqual(56);
    expect(result.refundRatePercentage).toBeLessThanOrEqual(58);
    expect(result.refundAmount).toBeGreaterThan(0);
    expect(result.refundAmount + result.lossAmount).toBe(BENCHMARK_CERT_B_PREMIUM450.paidTotalAmount);
  });

  it('만기 도달(100% 완납) 시 일반 상품은 85% 법정 환급률을 적용한다', () => {
    const matureNormalCert: CertificateExtractionSchema = {
      ...BENCHMARK_CERT_B_PREMIUM450,
      paidInstallments: 150,
      paidTotalAmount: 4_500_000,
      hasMaturityRefund100: false
    };

    const result = StatutoryRefundCalculator.calculateRefund(matureNormalCert);
    expect(result.refundRatePercentage).toBe(85.0);
    expect(result.refundAmount).toBe(Math.floor(4_500_000 * 0.85));
    expect(result.lossAmount).toBe(Math.floor(4_500_000 * 0.15));
  });

  it('만기 100% 환급 특약 상품의 경우 100% 전액 환급(손실 0원)되어야 한다', () => {
    const result = StatutoryRefundCalculator.calculateRefund(BENCHMARK_CERT_H_SAFE480_MATURE);
    expect(result.refundRatePercentage).toBe(100.0);
    expect(result.refundAmount).toBe(4_800_000);
    expect(result.lossAmount).toBe(0);
  });
});

describe('HiddenCostEstimator (현장 숨은 추가금 추정기)', () => {
  it('평균(average) 강도 시 통계 합계 2,850,000원이 산출되어야 한다', () => {
    const hidden = HiddenCostEstimator.estimateBySeverity('average');
    expect(hidden.shroudUpgrade).toBe(1_500_000);
    expect(hidden.flowerUpgrade).toBe(800_000);
    expect(hidden.distanceOvercharge).toBe(350_000);
    expect(hidden.tipGratuity).toBe(200_000);
    expect(hidden.totalHiddenCost).toBe(2_850_000);
  });

  it('보수적(conservative) 강도 시 1,800,000원이 산출되어야 한다', () => {
    const hidden = HiddenCostEstimator.estimateBySeverity('conservative');
    expect(hidden.totalHiddenCost).toBe(1_800_000);
  });

  it('커스텀 지정 항목이 올바르게 합산되어야 한다', () => {
    const custom = HiddenCostEstimator.estimateCustom({
      shroudUpgrade: 2_000_000,
      flowerUpgrade: 1_000_000
    });
    // shroud 200만 + flower 100만 + distance 기본 35만 + tip 기본 20만 = 355만
    expect(custom.shroudUpgrade).toBe(2_000_000);
    expect(custom.flowerUpgrade).toBe(1_000_000);
    expect(custom.totalHiddenCost).toBe(3_550_000);
  });
});

describe('QuoteDiagnosticsEngine (1:1 영수증 손익 진단 종합 엔진)', () => {
  it('배웅 전환 크레딧은 해약 손실액의 30%를 지급하되, 최대 50만 원 한도를 준수해야 한다', () => {
    const report = QuoteDiagnosticsEngine.diagnose({
      certificate: BENCHMARK_CERT_B_PREMIUM450
    });

    const expectedCredit = Math.min(
      Math.floor(report.statutoryRefund.lossAmount * 0.30),
      500_000
    );
    expect(report.transitionCredit).toBe(expectedCredit);
    expect(report.transitionCredit).toBeLessThanOrEqual(500_000);
  });

  it('B상조 프리미엄 450 진단 시 순 절감액(Net Savings)이 500만 원 이상 산출되어야 한다', () => {
    const report = QuoteDiagnosticsEngine.diagnose({
      certificate: BENCHMARK_CERT_B_PREMIUM450,
      clientName: '홍길동',
      packageType: 'economic_3day'
    });

    // 기존 상조 총비용 = 약정 450만 + 평균추가금 285만 = 735만 원
    expect(report.summary.competitorTotalCost).toBe(7_350_000);

    // 배웅 실속 3일장 = 250만 - 환급금(약 71.4만) - 크레딧(약 16.3만) ≈ 약 162만 원
    expect(report.summary.baeungTotalActualCost).toBeLessThan(2_500_000);

    // 순 절감액 = 735만 - 162만 ≈ 570만 원 이상 절감
    expect(report.summary.netSavingsAmount).toBeGreaterThan(5_000_000);
    expect(report.summary.savingsRatePercentage).toBeGreaterThan(70);
  });

  it('좌우 영수증 라인 아이템과 총액이 오차 없이 일치해야 한다', () => {
    const report = QuoteDiagnosticsEngine.diagnose({
      certificate: BENCHMARK_CERT_P_EVERGREEN590,
      packageType: 'standard_3day'
    });

    // 좌측 총액 검증
    const leftSum = report.leftCompetitorReceipt.lineItems.reduce((acc, i) => acc + i.amount, 0);
    expect(leftSum).toBe(report.leftCompetitorReceipt.totalAmount);

    // 우측 총액 검증
    const rightSum = report.rightBaeungReceipt.lineItems.reduce((acc, i) => acc + i.amount, 0);
    expect(rightSum).toBe(report.rightBaeungReceipt.totalAmount);
  });
});

describe('DualStandbyService (듀얼 스탠바이 및 공정위 내용증명 서비스)', () => {
  it('듀얼 스탠바이 사전 등록증 생성 시 고유 번호(DS-2026-KR-XXXX)와 50만 원 한도 손실보전 크레딧이 산정되어야 한다', () => {
    const reg = DualStandbyService.createRegistration({
      registrantName: '김정우 (장남)',
      registrantPhone: '010-3849-2910',
      beneficiaryName: '故 김철수 님',
      relationship: '부친(父)',
      existingCompany: '보람상조',
      existingProduct: '보람 프리미엄 450',
      paidTotalAmount: 1_260_000,
      estimatedRefund: 453_600,
      lossAmount: 806_400
    });

    expect(reg.registrationId).toMatch(/^DS-2026-KR-\d{4}$/);
    expect(reg.status).toBe('active');
    expect(reg.lossProtectionCredit).toBeLessThanOrEqual(500_000);
    expect(reg.lossProtectionCredit).toBeGreaterThanOrEqual(200_000);
    expect(reg.assignedDirectorName).toContain('조성우');
    expect(reg.assignedDirectorPhone).toBe('010-8820-1588');
  });

  it('손실액이 매우 큰 경우에도 최대 보전 크레딧 한도인 50만 원을 초과하지 않아야 한다', () => {
    const reg = DualStandbyService.createRegistration({
      registrantName: '이영희',
      registrantPhone: '010-1234-5678',
      beneficiaryName: '故 박순자 님',
      existingCompany: '프리드라이프',
      existingProduct: '프리드 590',
      paidTotalAmount: 4_000_000,
      estimatedRefund: 2_000_000,
      lossAmount: 2_000_000 // 40% = 80만 원이지만 50만 원 한도 적용
    });

    expect(reg.lossProtectionCredit).toBe(500_000);
  });

  it('공정위 기준 법정 해약환급금 내용증명 신청서가 주요 상조사 법인 대표와 주소를 올바르게 매칭해야 한다', () => {
    // 1) 보람상조
    const claimBoram = DualStandbyService.createCancellationClaim({
      cert: BENCHMARK_CERT_B_PREMIUM450,
      refund: StatutoryRefundCalculator.calculateRefund(BENCHMARK_CERT_B_PREMIUM450),
      claimantName: '김정우',
      claimantPhone: '010-3849-2910'
    });

    expect(claimBoram.competitorCeo).toBe('오준오');
    expect(claimBoram.competitorAddress).toContain('마포대로 130');
    expect(claimBoram.claimId).toMatch(/^REQ-2026-\d{6}$/);
    expect(claimBoram.legalBasis).toContain('할부거래에 관한 법률');
    expect(claimBoram.statutoryRefundAmount).toBeGreaterThan(0);

    // 2) 프리드라이프
    const claimPreed = DualStandbyService.createCancellationClaim({
      cert: BENCHMARK_CERT_P_EVERGREEN590,
      refund: StatutoryRefundCalculator.calculateRefund(BENCHMARK_CERT_P_EVERGREEN590)
    });
    expect(claimPreed.competitorCeo).toBe('김만기');
    expect(claimPreed.competitorAddress).toContain('통일로 92');

    // 3) 현대라이프
    const claimHyundai = DualStandbyService.createCancellationClaim({
      cert: BENCHMARK_CERT_H_SAFE480_MATURE,
      refund: StatutoryRefundCalculator.calculateRefund(BENCHMARK_CERT_H_SAFE480_MATURE)
    });
    expect(claimHyundai.competitorCeo).toBe('정승환');
    expect(claimHyundai.competitorAddress).toContain('테헤란로 418');
  });

  it('기본 샘플 SAMPLE_DUAL_STANDBY가 유효한 구조를 갖추어야 한다', () => {
    expect(SAMPLE_DUAL_STANDBY.registrationId).toBe('DS-2026-KR-8831');
    expect(SAMPLE_DUAL_STANDBY.lossProtectionCredit).toBe(500_000);
    expect(SAMPLE_DUAL_STANDBY.status).toBe('active');
  });
});
