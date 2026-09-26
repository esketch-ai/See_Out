import { HiddenCostBreakdown, HiddenCostSeverity } from './types.js';

/**
 * 통계 실태조사 기반 현장 숨은 추가금(Hidden Add-on Costs) 추정 엔진
 * Specification: ALGO-2026-003 Section 4
 */
export class HiddenCostEstimator {
  /**
   * 통계 표준 단가 테이블 (단위: 원)
   */
  public static readonly STATISTICAL_TABLE = {
    shroudUpgrade: {
      conservative: 1_000_000,
      average: 1_500_000,
      aggressive: 2_500_000,
      label: '수의·관 재질 변경(업셀링) 유도'
    },
    flowerUpgrade: {
      conservative: 500_000,
      average: 800_000,
      aggressive: 1_500_000,
      label: '제단 꽃장식 단계별 추가 비용'
    },
    distanceOvercharge: {
      conservative: 200_000,
      average: 350_000,
      aggressive: 600_000,
      label: '리무진/운구차량 초과 거리 요금'
    },
    tipGratuity: {
      conservative: 100_000,
      average: 200_000,
      aggressive: 400_000,
      label: '지도사·도우미 수고비(촌지) 관행'
    }
  } as const;

  /**
   * 강도별 현장 추가금 종합 추정
   */
  public static estimateBySeverity(severity: HiddenCostSeverity = 'average'): HiddenCostBreakdown {
    const t = this.STATISTICAL_TABLE;
    const shroudUpgrade = t.shroudUpgrade[severity];
    const flowerUpgrade = t.flowerUpgrade[severity];
    const distanceOvercharge = t.distanceOvercharge[severity];
    const tipGratuity = t.tipGratuity[severity];

    const totalHiddenCost = shroudUpgrade + flowerUpgrade + distanceOvercharge + tipGratuity;

    return {
      shroudUpgrade,
      flowerUpgrade,
      distanceOvercharge,
      tipGratuity,
      totalHiddenCost
    };
  }

  /**
   * 유저 지정 커스텀 추가금 산출
   */
  public static estimateCustom(custom: Partial<HiddenCostBreakdown>): HiddenCostBreakdown {
    const base = this.estimateBySeverity('average');
    const result: HiddenCostBreakdown = {
      shroudUpgrade: custom.shroudUpgrade ?? base.shroudUpgrade,
      flowerUpgrade: custom.flowerUpgrade ?? base.flowerUpgrade,
      distanceOvercharge: custom.distanceOvercharge ?? base.distanceOvercharge,
      tipGratuity: custom.tipGratuity ?? base.tipGratuity,
      totalHiddenCost: 0
    };
    result.totalHiddenCost =
      result.shroudUpgrade +
      result.flowerUpgrade +
      result.distanceOvercharge +
      result.tipGratuity;

    return result;
  }
}
