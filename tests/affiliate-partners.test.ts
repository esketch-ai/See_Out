import { describe, it, expect } from 'vitest';
import { AffiliateService } from '../src/affiliate-partners/index.js';

describe('사업계획서 1단계 3.3절 & 4.4절: 3대 부가 제휴사(봉안당·수목장·유품정리) 입점 심사 및 디렉터리 검증', () => {
  it('공식 부가 제휴사 데이터셋이 3대 영역을 모두 포함하고 인허가 검증을 통과해야 한다', () => {
    const all = AffiliateService.getAllPartners();
    expect(all.length).toBeGreaterThanOrEqual(6);

    all.forEach((p) => {
      expect(p.isVerified).toBe(true);
      expect(p.licenseNumber).toBeDefined();
      expect(p.pricingInfo.length).toBeGreaterThan(0);
      expect(p.adPricingModel).toBe('FIXED_FLAT_RATE');
      expect(p.prohibitedKeywordCheckPassed).toBe(true);
    });
  });

  it('카테고리별 조회가 정확하게 분기되어야 한다', () => {
    const colums = AffiliateService.getPartnersByCategory('COLUMBARIUM');
    expect(colums.length).toBeGreaterThan(0);
    colums.forEach((c) => expect(c.category).toBe('COLUMBARIUM'));

    const woodlands = AffiliateService.getPartnersByCategory('WOODLAND_BURIAL');
    expect(woodlands.length).toBeGreaterThan(0);
    woodlands.forEach((w) => expect(w.category).toBe('WOODLAND_BURIAL'));

    const cleanings = AffiliateService.getPartnersByCategory('ESTATE_CLEARING');
    expect(cleanings.length).toBeGreaterThan(0);
    cleanings.forEach((cl) => expect(cl.category).toBe('ESTATE_CLEARING'));
  });

  describe('입점 자격 심사기 (verifyPartnerAdmission)', () => {
    it('적법한 인허가 번호와 정찰 가격표를 제출하고 과장 문구가 없으면 심사를 통과(passed: true)해야 한다', () => {
      const result = AffiliateService.verifyPartnerAdmission({
        partnerId: 'test-new-colum',
        category: 'COLUMBARIUM',
        name: '용인 아름다운 추모공원',
        licenseNumber: '제2022-용인-사설봉안-15호',
        adText: '용인 도심 15분 거리 정갈한 실내 봉안당 시설 안내',
        hasTransparentPricing: true
      });

      expect(result.passed).toBe(true);
      expect(result.checks.licenseValid).toBe(true);
      expect(result.checks.prohibitedWordsPassed).toBe(true);
      expect(result.checks.pricingDisclosed).toBe(true);
    });

    it('표시광고법 위반 금칙어("최저가", "마감임박")가 포함된 경우 즉시 입점을 반려해야 한다', () => {
      const result = AffiliateService.verifyPartnerAdmission({
        partnerId: 'test-bad-ad',
        category: 'WOODLAND_BURIAL',
        name: '전국 최저가 수목장림',
        licenseNumber: '제2021-양평-자연장지-09호',
        adText: '마감임박 잔여 3자리 파격 할인 제공',
        hasTransparentPricing: true
      });

      expect(result.passed).toBe(false);
      expect(result.checks.prohibitedWordsPassed).toBe(false);
      expect(result.disqualificationReason).toContain('표시광고법 위반 금칙어');
    });

    it('인허가 번호가 규정 요건에 미달하는 경우 반려해야 한다', () => {
      const result = AffiliateService.verifyPartnerAdmission({
        partnerId: 'test-no-license',
        category: 'ESTATE_CLEARING',
        name: 'OO 유품정리',
        licenseNumber: '1234', // 유효하지 않은 번호
        adText: '유품 정리 및 청소 작업',
        hasTransparentPricing: true
      });

      expect(result.passed).toBe(false);
      expect(result.checks.licenseValid).toBe(false);
      expect(result.disqualificationReason).toContain('법정 인허가 서류');
    });
  });
});
