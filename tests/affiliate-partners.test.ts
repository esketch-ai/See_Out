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
      expect(result.disqualificationReason).toContain('인허가 번호가 너무 짧거나 누락');
    });

    it('장사법 및 폐기물관리법 정규 서식 파싱 및 연도/시군구 추출이 정상 동작해야 한다', () => {
      // 1. 봉안당 (장사법 제15조)
      const columDetail = AffiliateService.validateLicenseDetailed(
        'COLUMBARIUM',
        '제2012-성남분당-사설봉안-04호'
      );
      expect(columDetail.isValid).toBe(true);
      expect(columDetail.isFormatValid).toBe(true);
      expect(columDetail.parsedYear).toBe(2012);
      expect(columDetail.parsedDistrict).toBe('성남분당');

      // 2. 수목장림 (장사법 제16조)
      const woodDetail = AffiliateService.validateLicenseDetailed(
        'WOODLAND_BURIAL',
        '제2019-용인처인-자연장지-05호'
      );
      expect(woodDetail.isValid).toBe(true);
      expect(woodDetail.isFormatValid).toBe(true);
      expect(woodDetail.parsedYear).toBe(2019);
      expect(woodDetail.parsedDistrict).toBe('용인처인');

      // 3. 유품정리 (폐기물관리법 제25조)
      const clearDetail = AffiliateService.validateLicenseDetailed(
        'ESTATE_CLEARING',
        '제2021-서울마포-폐기물수집운반-51호'
      );
      expect(clearDetail.isValid).toBe(true);
      expect(clearDetail.isFormatValid).toBe(true);
      expect(clearDetail.parsedYear).toBe(2021);
      expect(clearDetail.parsedDistrict).toBe('서울마포');
    });
  });

  describe('시범 권역(강남4구·성남) 30분 안심 매칭 (getNearestAffiliatesForDistrict)', () => {
    it('성남시 분당구 기준 최적의 3대 부가 제휴사가 올바르게 매칭되어야 한다', () => {
      const match = AffiliateService.getNearestAffiliatesForDistrict('성남시 분당구');
      expect(match.districtName).toBe('성남시 분당구');

      // 봉안당: 분당 메모리얼파크가 가장 가까움 (12분)
      expect(match.matchedColumbarium).toBeDefined();
      expect(match.matchedColumbarium?.partner.name).toContain('분당 메모리얼파크');
      expect(match.matchedColumbarium?.estimate.travelTimeMinutes).toBeLessThanOrEqual(15);

      // 유품정리: 스위퍼스 혹은 배웅 케어단 매칭
      expect(match.matchedEstateClearing).toBeDefined();
      expect(match.matchedEstateClearing?.estimate.travelTimeMinutes).toBeLessThanOrEqual(35);
    });

    it('강남구 기준 30~40분 내 도달 가능한 부가시설 매칭이 제공되어야 한다', () => {
      const match = AffiliateService.getNearestAffiliatesForDistrict('강남구');
      expect(match.districtName).toBe('강남구');

      expect(match.matchedColumbarium).toBeDefined();
      expect(match.matchedColumbarium?.estimate.travelTimeMinutes).toBeLessThanOrEqual(40);

      expect(match.matchedWoodlandBurial).toBeDefined();
      expect(match.matchedEstateClearing).toBeDefined();
    });
  });

  describe('정찰 패키지 비용 계산 (calculateAffiliatePackageCost)', () => {
    it('선택한 제휴 품목들의 가격 합산이 투명하게 산출되어야 한다', () => {
      const all = AffiliateService.getAllPartners();
      const firstColum = all.find((p) => p.category === 'COLUMBARIUM')!;
      const firstClearing = all.find((p) => p.category === 'ESTATE_CLEARING')!;

      const result = AffiliateService.calculateAffiliatePackageCost([
        { partnerId: firstColum.id, itemIndex: 0 },
        { partnerId: firstClearing.id, itemIndex: 0 }
      ]);

      const expected = firstColum.pricingInfo[0].price + firstClearing.pricingInfo[0].price;
      expect(result.totalCost).toBe(expected);
      expect(result.itemsDetail.length).toBe(2);
      expect(result.itemsDetail[0].partnerName).toBe(firstColum.name);
    });
  });
});
