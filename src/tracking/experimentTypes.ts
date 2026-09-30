/**
 * 배웅(BAEUNG) 1단계 사업계획서 7.3절(전환 근사 및 대조군 실험) 및 10.1절(착수 전 검증 기준)
 * 대조군 실험(Controlled Experiment) 및 월간 자율 신고 데이터 모델
 */

export type ExperimentGroup = 'TREATMENT' | 'CONTROL';

export interface ExperimentHallMetrics {
  hallId: string;
  hallName: string;
  district: string;
  group: ExperimentGroup;
  impressions: number;            // 0단계 노출 수
  engagements: number;            // 1단계 체류·상세 조회 수
  contactClicks: number;          // 2단계 클릭투콜/전화 시도 수
  substantialCalls: number;       // 3단계 30초 이상 실질 통화 수
  quoteReferences: number;        // 4단계 견적 참조번호 발급 수
  selfReportedContracts: number;  // 월간 자율 신고 실제 계약 전환 수
  conversionRate: number;         // 견적 대비 성약률 (%)
}

export interface GroupAggregateStats {
  hallCount: number;
  avgImpressions: number;
  avgEngagements: number;
  avgContactClicks: number;
  avgSubstantialCalls: number;
  avgQuoteReferences: number;
  avgReportedContracts: number;
  avgConversionRate: number;
}

export interface ExperimentLiftMetrics {
  impressionLiftPercent: number;    // 노출 증분 (%)
  contactLiftPercent: number;       // 접촉 시도 증분 (%)
  callLiftPercent: number;          // 실질 통화 증분 (%)
  quoteLiftPercent: number;         // 견적 참조번호 증분 (%)
  contractLiftPercent: number;      // 계약 성약 증분 (%)
  callLiftRatio: number;            // 통화 배수 (예: 2.8배)
  quoteLiftRatio: number;           // 견적 배수 (예: 3.2배)
}

export interface ControlledExperimentReport {
  reportId: string;
  title: string;
  period: string;
  pilotRegionName: string;          // 예: "수도권 동남부 (강남4구·성남)"
  totalHallsCount: number;          // 총 38개소
  treatmentStats: GroupAggregateStats; // 광고 제공군 (B2B 파트너/LOI 체결)
  controlStats: GroupAggregateStats;   // 비제공 대조군 (공공데이터 기본 리스팅)
  lift: ExperimentLiftMetrics;         // 순수 인과효과 (Lift)
  pValue: number;                      // 통계적 유의확률 (p < 0.05)
  isStatisticallySignificant: boolean;// 통계적 유의성 검증 여부
  causalEvidenceSummary: string;       // 인과관계 입증 결과 요약
}

export interface SelfReportSubmission {
  submissionId: string;
  hallId: string;
  hallName: string;
  reportingMonth: string;              // 예: "2026-09"
  reportedQuoteCount: number;          // 유족이 제시한 견적 참조번호 확인 건수
  reportedContractCount: number;       // 실제 성약 건수
  renewalIntent: boolean;              // 3개월차 유료 갱신 의향
  satisfactionScore: number;           // 1~5점 만족도
  feedbackNote: string;                // 현장 피드백
  submittedAt: string;
}

export interface ValidationCriteriaStatus {
  // 1. 시범 지역 광고 참여의향서(LOI): 대상의 20% 이상 (38개소 중 8개소)
  loiParticipationRate: number;
  loiCount: number;
  loiTargetCount: number;
  isLoiPassed: boolean;

  // 2. 견적 회수율: 대상의 50% 이상 (38개소 중 19개소)
  quoteCollectionRate: number;
  collectedCount: number;
  collectionTargetCount: number;
  isQuoteCollectionPassed: boolean;

  // 3. 시범 3개월차 유료 갱신 의향: 60% 이상
  renewalIntentRate: number;
  renewalIntentCount: number;
  totalRespondents: number;
  isRenewalIntentPassed: boolean;

  // 종합 판정
  allCriteriaPassed: boolean;
}
