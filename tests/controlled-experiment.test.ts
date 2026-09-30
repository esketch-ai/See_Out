import { describe, it, expect } from 'vitest';
import { ControlledExperimentService } from '../src/tracking/controlledExperimentService.js';
import { FuneralHallService } from '../src/funeral-halls/funeralHallService.js';
import { PilotLoiService } from '../src/b2b/pilotLoiService.js';

describe('사업계획서 7.3절 및 10.1절: 대조군 실험(Controlled Experiment) 및 월간 자율 신고 검증', () => {
  it('시범 권역 38개소 전체가 Treatment군 또는 Control군으로 정상 배정되어야 한다', () => {
    const metrics = ControlledExperimentService.getExperimentHallsMetrics();
    expect(metrics.length).toBe(38);

    const treatmentHalls = metrics.filter((m) => m.group === 'TREATMENT');
    const controlHalls = metrics.filter((m) => m.group === 'CONTROL');

    expect(treatmentHalls.length).toBeGreaterThanOrEqual(5);
    expect(controlHalls.length).toBeGreaterThan(0);
    expect(treatmentHalls.length + controlHalls.length).toBe(38);

    for (const m of metrics) {
      expect(m.impressions).toBeGreaterThan(0);
      expect(m.engagements).toBeGreaterThan(0);
      expect(m.district).toBeDefined();
    }
  });

  it('대조군 실험 분석 리포트에서 광고 제공군이 대조군 대비 순수 Lift(인과효과)를 입증해야 한다', () => {
    const report = ControlledExperimentService.runExperimentAnalysis();

    expect(report.reportId).toMatch(/^EXP-2026-\d{4}-\d{2}-SOUTHEAST$/);
    expect(report.totalHallsCount).toBe(38);
    expect(report.treatmentStats.hallCount).toBeGreaterThanOrEqual(5);
    expect(report.controlStats.hallCount).toBeGreaterThan(0);

    // 실질 통화 및 견적 참조번호 발급 Lift가 2.0배(100%) 이상이어야 함
    expect(report.lift.callLiftRatio).toBeGreaterThanOrEqual(2.0);
    expect(report.lift.quoteLiftRatio).toBeGreaterThanOrEqual(2.0);
    expect(report.lift.callLiftPercent).toBeGreaterThan(100);
    expect(report.lift.quoteLiftPercent).toBeGreaterThan(100);

    // 통계적 유의성 (p < 0.05) 검증
    expect(report.pValue).toBeLessThan(0.05);
    expect(report.isStatisticallySignificant).toBe(true);
    expect(report.causalEvidenceSummary).toContain('인과효과');
  });

  it('장례식장 월간 자율 신고(간이 설문)가 정상 접수 및 반영되어야 한다', () => {
    const submission = ControlledExperimentService.submitSelfReport({
      hallId: 'fh-seoul-gangdong-sacred',
      hallName: '강동성심병원장례식장',
      reportingMonth: '2026-09',
      reportedQuoteCount: 15,
      reportedContractCount: 6,
      renewalIntent: true,
      satisfactionScore: 5,
      feedbackNote: '배웅 정찰제 견적으로 유족들의 가격 만족도가 매우 높았습니다.'
    });

    expect(submission.submissionId).toMatch(/^SR-202609-\d{3}$/);
    expect(submission.reportedQuoteCount).toBe(15);
    expect(submission.reportedContractCount).toBe(6);
    expect(submission.renewalIntent).toBe(true);
    expect(submission.satisfactionScore).toBe(5);

    const hallReports = ControlledExperimentService.getReportsForHall('fh-seoul-gangdong-sacred');
    expect(hallReports.length).toBeGreaterThan(0);
    expect(hallReports[0].reportedContractCount).toBe(6);
  });

  it('사업계획서 10.1절 3대 착수 검증 기준을 정상 판정해야 한다', () => {
    // 초기 2곳 접수 상태: 목표 8곳 중 2곳 접수 (5.3%, 진행 중)
    const initialStatus = ControlledExperimentService.getValidationCriteriaStatus();

    expect(initialStatus.loiTargetCount).toBe(8);
    expect(initialStatus.loiCount).toBe(2);
    expect(initialStatus.isLoiPassed).toBe(false); // 20% 미달로 진행 중
    expect(initialStatus.collectionTargetCount).toBe(19);
    expect(initialStatus.isQuoteCollectionPassed).toBe(true); // 38곳 중 38곳 견적 검증 완료
    expect(initialStatus.isRenewalIntentPassed).toBe(true); // 응답 5곳 중 5곳 찬성 (100%)
    expect(initialStatus.allCriteriaPassed).toBe(false); // LOI 8곳 미달로 전체 완료 아님

    // 시범 영업 가동: 추가 6곳 LOI 접수 시뮬레이션 (총 8곳 = 21.1% 달성)
    const seedHalls = [
      { id: 'fh-seoul-gangnam-severance', name: '강남세브란스병원장례식장', district: '강남구' },
      { id: 'fh-seoul-seocho-seoul-stmary', name: '가톨릭대학교서울성모병원장례식장', district: '서초구' },
      { id: 'fh-seoul-asan', name: '서울아산병원장례식장', district: '송파구' },
      { id: 'fh-seoul-gangdong-sacred', name: '강동성심병원장례식장', district: '강동구' },
      { id: 'fh-gyeonggi-seongnam-bundang-jeju', name: '분당제생병원장례식장', district: '성남시' },
      { id: 'fh-gyeonggi-seongnam-bundang-snuh', name: '분당서울대학교병원장례식장', district: '성남시' }
    ];

    for (const h of seedHalls) {
      PilotLoiService.submitLoi({
        hallId: h.id,
        hallName: h.name,
        pilotDistrict: h.district,
        directorName: '김상무 관리이사',
        contactPhone: '02-1588-0000',
        contactEmail: 'partner@funeral.org',
        businessNumber: '111-22-33333',
        adPackage: 'PRIORITY_SLOT_STANDARD',
        offeredDiscountRate: 20,
        flatRateAgreed: true,
        antiRebatePledge: true,
        signatureName: '김상무'
      });
    }

    // 8곳 접수 후 기준 충족 판정
    const fullStatus = ControlledExperimentService.getValidationCriteriaStatus();
    expect(fullStatus.loiCount).toBeGreaterThanOrEqual(8);
    expect(fullStatus.loiParticipationRate).toBeGreaterThanOrEqual(20.0);
    expect(fullStatus.isLoiPassed).toBe(true);
    expect(fullStatus.allCriteriaPassed).toBe(true);
  });
});
