import { CertificateExtractionSchema, RefundCalculationResult } from './types.js';

/**
 * 공정거래위원회 고시 제2020-1호 「선불식 할부계약의 해약환급금 산정기준」 준수 계산 엔진
 * Specification: ALGO-2026-003 Section 3
 */
export class StatutoryRefundCalculator {
  /**
   * 상조 증서 데이터를 기반으로 법정 해약환급금 및 손실액 산출
   */
  public static calculateRefund(cert: CertificateExtractionSchema): RefundCalculationResult {
    const { paidInstallments, totalInstallments, paidTotalAmount } = cert;
    
    // 유효성 검사 및 정규화
    const safeTotalInstallments = Math.max(1, totalInstallments);
    const safePaidInstallments = Math.min(paidInstallments, safeTotalInstallments);
    const progress = safePaidInstallments / safeTotalInstallments;
    const progressPercentage = Math.round(progress * 1000) / 10;

    // 1. 극초기 (1~3회차): 모집수수료 및 관리비 전액 공제 구간 (법정 환급금 0원)
    if (safePaidInstallments <= 3) {
      return {
        paidTotalAmount,
        refundAmount: 0,
        refundRatePercentage: 0,
        lossAmount: paidTotalAmount,
        progressRatioPercentage: progressPercentage,
        legalBasis: '공정거래위원회 고시 제2020-1호 (1~3회차 모집수수료 공제 구간)'
      };
    }

    // 2. 만기 도달 시 (약정 회차 100% 완납)
    if (safePaidInstallments >= safeTotalInstallments) {
      const maturityRate = cert.hasMaturityRefund100 ? 1.00 : 0.85;
      const refundAmount = Math.floor(paidTotalAmount * maturityRate);
      const lossAmount = paidTotalAmount - refundAmount;
      return {
        paidTotalAmount,
        refundAmount,
        refundRatePercentage: Math.round(maturityRate * 1000) / 10,
        lossAmount,
        progressRatioPercentage: 100.0,
        legalBasis: cert.hasMaturityRefund100
          ? '만기 시 100% 환급 특별약관 적용'
          : '공정거래위원회 고시 제2020-1호 (만기 시 법정 기준 환급률 85%)'
      };
    }

    // 3. 중도 해약 시 공정위 표준 체증 환급률 곡선
    // 진행률에 따른 체증 곡선 적용
    let statutoryRate = 0;
    if (progress < 0.20) {
      // 진행률 0% ~ 20% 구간: 0% -> 50% 선형 증가
      statutoryRate = 0.50 * (progress / 0.20);
    } else if (progress < 0.50) {
      // 진행률 20% ~ 50% 구간: 50% -> 75% 체증
      statutoryRate = 0.50 + 0.25 * ((progress - 0.20) / 0.30);
    } else {
      // 진행률 50% ~ 100% 구간: 75% -> 85% 체증
      statutoryRate = 0.75 + 0.10 * ((progress - 0.50) / 0.50);
    }

    const refundAmount = Math.floor(paidTotalAmount * statutoryRate);
    const lossAmount = paidTotalAmount - refundAmount;
    const refundRatePercentage = Math.round(statutoryRate * 1000) / 10;

    return {
      paidTotalAmount,
      refundAmount,
      refundRatePercentage,
      lossAmount,
      progressRatioPercentage: progressPercentage,
      legalBasis: `공정거래위원회 고시 제2020-1호 (진행률 ${progressPercentage}% 기준 체증 곡선)`
    };
  }
}
