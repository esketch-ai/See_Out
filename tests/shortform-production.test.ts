import { describe, it, expect } from 'vitest';
import { ShortformService } from '../src/shortform/index.js';

describe('사업계획서 3.2절 및 7.2절: 숏폼(Short-form) 제작·배포 대행 및 플랫폼 지표 체계 검증', () => {
  it('4대 테마(가족장 가이드, 시설 랜선투어, 조문 예절, 무빈소 체크) 숏폼 포트폴리오가 정상 등록되어 있어야 한다', () => {
    const portfolio = ShortformService.getPortfolio();
    expect(portfolio.length).toBeGreaterThanOrEqual(4);

    const themes = portfolio.map((c) => c.theme);
    expect(themes).toContain('FAMILY_FUNERAL_GUIDE');
    expect(themes).toContain('HALL_VIRTUAL_TOUR');
    expect(themes).toContain('ETIQUETTE_DRESS_CODE');
    expect(themes).toContain('DIRECT_CREMATION_CHECK');

    for (const item of portfolio) {
      expect(item.id).toBeDefined();
      expect(item.title.length).toBeGreaterThan(5);
      expect(item.durationSeconds).toBeGreaterThanOrEqual(30);
      expect(item.durationSeconds).toBeLessThanOrEqual(60);
      expect(item.metrics.views).toBeGreaterThan(10000);
      expect(item.metrics.engagementRate).toBeGreaterThan(0);
      expect(item.platforms.length).toBeGreaterThan(0);
    }
  });

  it('표시광고법 준수: 모든 숏폼 콘텐츠에 단정적 성과 보장 표현이 없어야 하고 고지문이 완비되어야 한다', () => {
    const portfolio = ShortformService.getPortfolio();

    for (const item of portfolio) {
      expect(item.complianceDisclaimer).toBeDefined();
      expect(item.complianceDisclaimer).not.toContain('100% 보장');
      expect(item.complianceDisclaimer).not.toContain('조회수 보장');

      const checkTitle = ShortformService.validateComplianceCopy(item.title);
      expect(checkTitle.isValid).toBe(true);

      const checkScript = ShortformService.validateComplianceCopy(item.scriptSummary);
      expect(checkScript.isValid).toBe(true);
    }
  });

  it('표시광고법 금칙어 검증기(validateComplianceCopy)가 과장 광고 표현을 정확히 탐지해야 한다', () => {
    const validCopy = '과거 집행 사례 기준 평균 3.5만 회 조회수를 기록한 시설 안내 숏폼';
    expect(ShortformService.validateComplianceCopy(validCopy).isValid).toBe(true);

    const invalidCopy1 = '유튜브 알고리즘으로 조회수 10만 회 100% 보장해 드립니다';
    const check1 = ShortformService.validateComplianceCopy(invalidCopy1);
    expect(check1.isValid).toBe(false);
    expect(check1.prohibitedWord).toBe('100% 보장');

    const invalidCopy2 = '신청 즉시 무조건 성약 보장 패키지';
    const check2 = ShortformService.validateComplianceCopy(invalidCopy2);
    expect(check2.isValid).toBe(false);
    expect(check2.prohibitedWord).toBe('무조건 성약');
  });

  it('장례식장 파트너의 숏폼 제작 대행 신청이 정상 접수되어야 한다', () => {
    const req = ShortformService.submitProductionRequest({
      hallId: 'fh-seoul-asan',
      hallName: '서울아산병원장례식장',
      applicantRole: '총무팀장',
      applicantPhone: '010-3344-5566',
      selectedThemes: ['HALL_VIRTUAL_TOUR', 'FAMILY_FUNERAL_GUIDE'],
      targetPlatforms: ['YOUTUBE_SHORTS', 'INSTAGRAM_REELS'],
      filmingPreference: 'VISIT_FILMING',
      preferredDate: '2026-10-15'
    });

    expect(req.requestId).toMatch(/^SFR-2026-\d{3}$/);
    expect(req.status).toBe('SUBMITTED');
    expect(req.hallName).toBe('서울아산병원장례식장');
    expect(req.selectedThemes).toContain('HALL_VIRTUAL_TOUR');

    const allRequests = ShortformService.getAllRequests();
    expect(allRequests.some((r) => r.requestId === req.requestId)).toBe(true);
  });

  it('플랫폼 누적 성과 요약(getAggregateOverview)이 정확한 통계를 반환해야 한다', () => {
    const overview = ShortformService.getAggregateOverview();

    expect(overview.totalProducedCount).toBeGreaterThanOrEqual(4);
    expect(overview.avgViewsPerVideo).toBeGreaterThan(20000);
    expect(overview.avgEngagementRate).toBeGreaterThan(4.0);
    expect(overview.totalProfileClicks).toBeGreaterThan(1000);
    expect(overview.topPerformingPlatform).toContain('유튜브');
  });
});
