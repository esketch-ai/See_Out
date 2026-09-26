import {
  CertificateExtractionSchema,
  DiagnosticComparisonReport,
  HiddenCostSeverity,
  HiddenCostBreakdown,
  BaeungPackageType,
  BaeungPackageInfo,
  ReceiptSide
} from './types.js';
import { StatutoryRefundCalculator } from './refundCalculator.js';
import { HiddenCostEstimator } from './hiddenCostEstimator.js';

/**
 * 배웅 정찰제 표준 실비 패키지 목록
 */
export const BAEUNG_PACKAGES: Record<BaeungPackageType, BaeungPackageInfo> = {
  simple_non_hall: {
    type: 'simple_non_hall',
    name: '배웅 직장(무빈소) 실비 패키지',
    price: 1_200_000,
    description: '빈소 없이 염습/입관 및 화장장 직행 실속 서비스'
  },
  economic_3day: {
    type: 'economic_3day',
    name: '배웅 실속 3일장 정찰 패키지',
    price: 2_500_000,
    description: '전담 장례지도사 1명, 의전도우미 2명, 입관/수의 정찰제 포함'
  },
  standard_3day: {
    type: 'standard_3day',
    name: '배웅 표준 3일장 품격 패키지',
    price: 3_500_000,
    description: '전담 지도사 1명, 의전도우미 4명, 고급 리무진/운구차, 특등 수의'
  }
};

/**
 * 상조 견적 진단 및 영수증 대조 종합 엔진
 * Specification: ALGO-2026-003 Section 5 & 6
 */
export class QuoteDiagnosticsEngine {
  /**
   * 상조 증서 및 옵션을 입력받아 최종 1:1 맞춤 영수증 진단 리포트를 생성
   */
  public static diagnose(params: {
    certificate: CertificateExtractionSchema;
    clientName?: string;
    packageType?: BaeungPackageType;
    hiddenCostSeverity?: HiddenCostSeverity;
    customHiddenCost?: Partial<HiddenCostBreakdown>;
  }): DiagnosticComparisonReport {
    const {
      certificate,
      clientName = '고객',
      packageType = 'economic_3day',
      hiddenCostSeverity = 'average',
      customHiddenCost
    } = params;

    // 1. 법정 해약환급금 계산
    const statutoryRefund = StatutoryRefundCalculator.calculateRefund(certificate);

    // 2. 현장 숨은 추가금 추정
    const hiddenCost = customHiddenCost
      ? HiddenCostEstimator.estimateCustom(customHiddenCost)
      : HiddenCostEstimator.estimateBySeverity(hiddenCostSeverity);

    // 3. 배웅 패키지 및 전환 크레딧 산출
    const selectedPackage = BAEUNG_PACKAGES[packageType];
    // 전환 크레딧: 손실액의 30% (최대 50만 원 한도)
    const transitionCredit = Math.min(
      Math.floor(statutoryRefund.lossAmount * 0.30),
      500_000
    );

    // 4. 총 지출액 및 순 절감액 산출
    // [A] 기존 상조 유지 시 총 예상 지출
    const competitorTotalCost = certificate.totalContractAmount + hiddenCost.totalHiddenCost;

    // [B] 배웅 전환 시 실제 지출액
    // 배웅 패키지 가격 - 해약환급금 수령액 - 전환 크레딧
    const baeungTotalActualCost = Math.max(
      0,
      selectedPackage.price - statutoryRefund.refundAmount - transitionCredit
    );

    // [C] 최종 순 절감액 및 절감률
    const netSavingsAmount = competitorTotalCost - baeungTotalActualCost;
    const savingsRatePercentage =
      competitorTotalCost > 0
        ? Math.round((netSavingsAmount / competitorTotalCost) * 1000) / 10
        : 0;

    // 5. 좌우 영수증 모델 생성
    const leftCompetitorReceipt: ReceiptSide = {
      title: `기존 ${certificate.competitorName} 유지 시 예상 총지출`,
      subtitle: `${certificate.productName} (약정 ${certificate.totalInstallments}회차 / 월 ${certificate.monthlyPayment.toLocaleString()}원)`,
      lineItems: [
        {
          name: '기존 상조 약정 총액',
          amount: certificate.totalContractAmount,
          description: `총 ${certificate.totalInstallments}회 약정 납입금`
        },
        {
          name: '현장 수의·관 업셀링 예상',
          amount: hiddenCost.shroudUpgrade,
          isWarning: true,
          description: '원산지 미표기 및 등급 변경 강요 관행'
        },
        {
          name: '제단 꽃장식 추가금 예상',
          amount: hiddenCost.flowerUpgrade,
          isWarning: true,
          description: '기본형 대비 규격 확대 유도'
        },
        {
          name: '운구차량 초과 운임 예상',
          amount: hiddenCost.distanceOvercharge,
          isWarning: true,
          description: '기본 거리(대부분 20~50km) 초과 요금'
        },
        {
          name: '지도사/도우미 수고비(촌지)',
          amount: hiddenCost.tipGratuity,
          isWarning: true,
          description: '현장 관행적 촌지 요구'
        }
      ],
      totalAmount: competitorTotalCost
    };

    const rightBaeungReceipt: ReceiptSide = {
      title: '배웅 후불제 전환 시 실제 부담액',
      subtitle: `${selectedPackage.name} (선금 0원 / 후불 정산)`,
      lineItems: [
        {
          name: selectedPackage.name,
          amount: selectedPackage.price,
          description: selectedPackage.description
        },
        {
          name: '기존 상조 법정 해약환급금 (수령 차감)',
          amount: -statutoryRefund.refundAmount,
          isDeduction: true,
          description: `${certificate.paidInstallments}회차 납입 (${statutoryRefund.refundRatePercentage}% 환급 적용)`
        },
        {
          name: '배웅 해약손실 보전 크레딧 (차감)',
          amount: -transitionCredit,
          isDeduction: true,
          description: '해약 손실액의 30% 바우처/크레딧 지원'
        },
        {
          name: '현장 추가금 및 촌지 관행',
          amount: 0,
          isHighlighted: true,
          description: '100% 원가 정찰제 / 추가금 및 촌지 전면 금지'
        }
      ],
      totalAmount: baeungTotalActualCost
    };

    const diagnosticId = `diag-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

    return {
      diagnosticId,
      clientName,
      analyzedAt: new Date().toISOString(),
      certificate,
      statutoryRefund,
      hiddenCost,
      selectedBaeungPackage: selectedPackage,
      transitionCredit,
      leftCompetitorReceipt,
      rightBaeungReceipt,
      summary: {
        competitorTotalCost,
        baeungTotalActualCost,
        netSavingsAmount,
        savingsRatePercentage,
        callToActionBadge: `배웅 전환 시 총 ${netSavingsAmount.toLocaleString()}원 (${savingsRatePercentage}%) 절감됩니다!`
      }
    };
  }

  /**
   * 터미널(CLI) 가독성을 위한 아스키 아트 영수증 포맷터
   */
  public static formatReportToCli(report: DiagnosticComparisonReport): string {
    const divider = '━'.repeat(74);
    const thinDivider = '─'.repeat(74);
    const { leftCompetitorReceipt: left, rightBaeungReceipt: right, summary, certificate } = report;

    let out = '\n';
    out += `\x1b[1;36m${divider}\x1b[0m\n`;
    out += `  🕊️  \x1b[1;37m배웅 (Bae-ung) 상조 견적 진단기 — 1:1 맞춤 영수증 대조 리포트\x1b[0m\n`;
    out += `  진단 ID: ${report.diagnosticId} | 대상자: ${report.clientName} | 분석일시: ${report.analyzedAt.substring(0, 10)}\n`;
    out += `\x1b[1;36m${divider}\x1b[0m\n\n`;

    out += `  📋 \x1b[1m[인식된 상조 증서 요약]\x1b[0m\n`;
    out += `  • 가입 상조사: ${certificate.competitorName} (${certificate.productName})\n`;
    out += `  • 계약 총액: ${certificate.totalContractAmount.toLocaleString()}원 (${certificate.totalInstallments}회 약정)\n`;
    out += `  • 납입 현황: ${certificate.paidInstallments}회 납입 완료 (${certificate.paidTotalAmount.toLocaleString()}원 / ${report.statutoryRefund.progressRatioPercentage}%)\n`;
    out += `  • 법정 해약환급금: \x1b[32m${report.statutoryRefund.refundAmount.toLocaleString()}원\x1b[0m (환급률: ${report.statutoryRefund.refundRatePercentage}%, 손실액: ${report.statutoryRefund.lossAmount.toLocaleString()}원)\n`;
    out += `  • 배웅 보전 크레딧: \x1b[35m${report.transitionCredit.toLocaleString()}원 지원\x1b[0m\n\n`;

    out += `  ${thinDivider}\n`;
    out += `  ${'【기존 상조 유지 시 예상 영수증】'.padEnd(34)} | ${'【배웅 전환 시 실제 영수증】'}\n`;
    out += `  ${thinDivider}\n`;

    const maxItems = Math.max(left.lineItems.length, right.lineItems.length);
    for (let i = 0; i < maxItems; i++) {
      const l = left.lineItems[i];
      const r = right.lineItems[i];

      const leftText = l ? `• ${l.name}: ${l.amount.toLocaleString()}원` : '';
      const rightText = r ? `• ${r.name}: ${r.amount > 0 ? '+' : ''}${r.amount.toLocaleString()}원` : '';

      out += `  ${leftText.padEnd(35)} | ${rightText}\n`;
    }

    out += `  ${thinDivider}\n`;
    out += `  \x1b[31m[기존 예상 총지출] ${left.totalAmount.toLocaleString()}원\x1b[0m`.padEnd(46);
    out += ` | \x1b[32m[배웅 실제 총부담] ${right.totalAmount.toLocaleString()}원\x1b[0m\n`;
    out += `  ${thinDivider}\n\n`;

    out += `\x1b[1;42;30m   🎉  ${summary.callToActionBadge}   \x1b[0m\n\n`;
    out += `  💰 순 절감액: \x1b[1;32m${summary.netSavingsAmount.toLocaleString()}원\x1b[0m (총 지출의 \x1b[1;33m${summary.savingsRatePercentage}%\x1b[0m 세이브)\n`;
    out += `  🛡️ 안전 보증: 선금 0원 / 100% 후불 정산 / 현장 추가금 0원 보증제 적용\n`;
    out += `\x1b[1;36m${divider}\x1b[0m\n`;

    return out;
  }
}
