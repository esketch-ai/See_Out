import {
  FunnelStageType,
  FunnelEventLog,
  PartnerPerformanceReport
} from './types.js';
import { VirtualCallBridgeService } from './virtualCallService.js';

/**
 * 4단계 효과 측정 퍼널 및 데이터-과금 분리 엔진
 * 사업계획서 7장 전체 구현:
 * - 0.노출 ➔ 1.관심 ➔ 2.접촉(클릭투콜) ➔ 3.실질상담 ➔ 4.전환(견적참조번호)
 * - 데이터-과금 분리 원칙: 트래킹 지표가 아무리 높아도 월 광고비는 30만 원 정액 유지 (알선 수수료 0원)
 */
export class FunnelMeasurementEngine {
  private static events: FunnelEventLog[] = [];

  // 기본 시뮬레이션 지표 (전국 장례식장별 초기 기준치)
  private static baselineMetrics: Map<string, { impressions: number; engagements: number; contacts: number; quotes: number }> =
    new Map([
      ['fh-seoul-asan', { impressions: 1420, engagements: 380, contacts: 58, quotes: 24 }],
      ['fh-seoul-samsung', { impressions: 1250, engagements: 310, contacts: 45, quotes: 18 }],
      ['fh-seoul-severance', { impressions: 1100, engagements: 290, contacts: 42, quotes: 16 }],
      ['fh-seoul-stmary', { impressions: 980, engagements: 240, contacts: 36, quotes: 14 }],
      ['fh-busan-simin', { impressions: 1680, engagements: 490, contacts: 72, quotes: 31 }],
      ['fh-gyeonggi-seongnam-medical', { impressions: 840, engagements: 210, contacts: 28, quotes: 12 }]
    ]);

  /**
   * 퍼널 이벤트 기록
   */
  public static trackEvent(
    hallId: string,
    stage: FunnelStageType,
    metadata?: FunnelEventLog['metadata']
  ): FunnelEventLog {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const event: FunnelEventLog = {
      eventId: `EVT-${Date.now()}-${randomSuffix}`,
      hallId,
      stage,
      timestamp: new Date().toISOString(),
      metadata
    };
    this.events.push(event);
    return event;
  }

  /**
   * 장례식장 파트너 월간 성과 리포트 생성 (4단계 퍼널 집계 및 전환율 연산)
   */
  public static generatePartnerReport(
    hallId: string,
    hallName: string,
    period: string = '2026년 09월 01일 ~ 09월 27일'
  ): PartnerPerformanceReport {
    const base = this.baselineMetrics.get(hallId) || {
      impressions: 450,
      engagements: 120,
      contacts: 18,
      quotes: 6
    };

    // 실시간 누적된 이벤트 합산
    const hallEvents = this.events.filter((e) => e.hallId === hallId);
    const dynamicImpressions = hallEvents.filter((e) => e.stage === 'STAGE_0_IMPRESSION').length;
    const dynamicEngagements = hallEvents.filter((e) => e.stage === 'STAGE_1_ENGAGEMENT').length;
    const dynamicContacts = hallEvents.filter((e) => e.stage === 'STAGE_2_CONTACT_ATTEMPT').length;
    const dynamicQuotes = hallEvents.filter((e) => e.stage === 'STAGE_4_CONVERSION_APPROX').length;

    const impressions = base.impressions + dynamicImpressions;
    const engagements = base.engagements + dynamicEngagements;
    const contactAttempts = base.contacts + dynamicContacts;
    const substantialCalls = VirtualCallBridgeService.getSubstantialCallCount(hallId) || Math.round(contactAttempts * 0.42);
    const quoteReferencesIssued = base.quotes + dynamicQuotes;

    // 단계별 전환율 연산 (소수점 1자리)
    const engagementRate = Math.round((engagements / Math.max(1, impressions)) * 1000) / 10;
    const contactRate = Math.round((contactAttempts / Math.max(1, engagements)) * 1000) / 10;
    const callConnectRate = Math.round((substantialCalls / Math.max(1, contactAttempts)) * 1000) / 10;
    const quoteConversionRate = Math.round((quoteReferencesIssued / Math.max(1, engagements)) * 1000) / 10;

    const reportId = `REP-2026-09-${hallId.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 10)}`;

    return {
      reportId,
      hallId,
      hallName,
      reportingPeriod: period,
      impressions,
      engagements,
      contactAttempts,
      substantialCalls,
      quoteReferencesIssued,
      rates: {
        engagementRate,
        contactRate,
        callConnectRate,
        quoteConversionRate
      },
      // 사업계획서 3.4절 & 7.4절 핵심 원칙: 정액제 및 데이터-과금 분리 공식 보증
      billing: {
        pricingModel: 'FIXED_FLAT_RATE',
        monthlyFee: 300_000,
        commissionAmount: 0,
        dataBillingSeparationCertified: true,
        complianceStatement:
          '「독점규제 및 공정거래에 관한 법률」 및 공정위 2026.3 리베이트 제재 지침에 의거, 배웅 플랫폼의 모든 효과 측정 지표는 장례식장의 광고 효과 입증용 리포트로만 사용되며 성과 수수료(건당 알선료)로 과금되지 않습니다.'
      }
    };
  }

  /**
   * 데이터-과금 분리 원칙 검증기 (Data-Billing Separation Guarantee)
   * 트래픽이나 통화 상담이 100배 증가해도 월 정액 30만 원과 알선 수수료 0원이 유지됨을 보증
   */
  public static verifyDataBillingSeparation(report: PartnerPerformanceReport): boolean {
    const isFlatRate = report.billing.pricingModel === 'FIXED_FLAT_RATE';
    const isFeeFixed = report.billing.monthlyFee === 300_000;
    const isCommissionZero = report.billing.commissionAmount === 0;
    const isCertified = report.billing.dataBillingSeparationCertified === true;

    return isFlatRate && isFeeFixed && isCommissionZero && isCertified;
  }
}
