import { describe, it, expect } from 'vitest';
import {
  FuneralHallService,
  REGIONAL_STATISTICS,
  FUNERAL_HALLS_DATASET
} from '../src/funeral-halls/index.js';

describe('Andrej Karpathy 3원칙 검증: 전국 장례식장 데이터 무결성 테스트', () => {
  it('[카파시 1원칙 & 3원칙] 전국 17개 시·도 등록 장례식장 실데이터 총합이 1,080개소(원문 각주 8 전수조사)여야 한다', () => {
    const total = FuneralHallService.getTotalRegisteredCount();
    expect(total).toBe(1080);
    expect(REGIONAL_STATISTICS).toHaveLength(17);

    // 수도권 1위 경기도 183개소 검증
    const gyeonggi = REGIONAL_STATISTICS.find((s) => s.region === '경기도');
    expect(gyeonggi?.registeredCount).toBe(183);

    // 서울 61개소, 전남 124개소 검증
    const seoul = REGIONAL_STATISTICS.find((s) => s.region === '서울특별시');
    expect(seoul?.registeredCount).toBe(61);
    const jeonnam = REGIONAL_STATISTICS.find((s) => s.region === '전라남도');
    expect(jeonnam?.registeredCount).toBe(124);
  });

  describe('단일 샘플 과적합 검증 (Overfitting concrete single batches)', () => {
    it('서울아산병원장례식장의 제원(18실/28구/연락처)이 원문과 100% 일치해야 한다', () => {
      const asan = FuneralHallService.getHallById('fh-seoul-asan');
      expect(asan).toBeDefined();
      expect(asan?.name).toBe('서울아산병원장례식장');
      expect(asan?.roomCount).toBe(18);
      expect(asan?.capacityCount).toBe(28);
      expect(asan?.phone).toBe('02-3010-2000');
      expect(asan?.category).toBe('TERTIARY_HOSPITAL');
      expect(asan?.address).toContain('풍납동');
    });

    it('부산 시민장례식장(18실/34구/500대 주차)이 원문과 100% 일치해야 한다', () => {
      const simin = FuneralHallService.getHallById('fh-busan-simin');
      expect(simin).toBeDefined();
      expect(simin?.name).toBe('(주)시민장례식장');
      expect(simin?.roomCount).toBe(18);
      expect(simin?.capacityCount).toBe(34); // 전국 최대급 안치실
      expect(simin?.phone).toBe('051-636-4444');
      expect(simin?.category).toBe('SPECIALIZED_INDEPENDENT');
      expect(simin?.parking).toContain('500대');
      expect(simin?.isBaeungPartner).toBe(true);
    });

    it('성남시의료원장례식장(7실/12구/공설)이 원문과 100% 일치해야 한다', () => {
      const seongnam = FuneralHallService.getHallById('fh-gyeonggi-seongnam-medical');
      expect(seongnam).toBeDefined();
      expect(seongnam?.name).toBe('성남시의료원장례식장');
      expect(seongnam?.roomCount).toBe(7);
      expect(seongnam?.capacityCount).toBe(12);
      expect(seongnam?.category).toBe('PUBLIC_MUNICIPAL');
      expect(seongnam?.phone).toBe('031-738-7000');
    });
  });

  describe('장례식장 검색 엔진 및 필터링 검증', () => {
    it('키워드 "부산" 검색 시 부산 소재 장례식장만 반환되어야 한다', () => {
      const results = FuneralHallService.searchHalls({ keyword: '부산' });
      expect(results.length).toBeGreaterThan(0);
      results.forEach((h) => {
        const matches = h.name.includes('부산') || h.address.includes('부산') || h.region.includes('부산');
        expect(matches).toBe(true);
      });
    });

    it('상급종합병원(TERTIARY_HOSPITAL) 필터 시 해당 카테고리만 반환되어야 한다', () => {
      const results = FuneralHallService.searchHalls({ category: 'TERTIARY_HOSPITAL' });
      expect(results.length).toBeGreaterThan(0);
      results.forEach((h) => {
        expect(h.category).toBe('TERTIARY_HOSPITAL');
      });
    });

    it('배웅 제휴 식장(onlyPartner: true) 필터 시 할인 혜택이 있는 곳만 반환되어야 한다', () => {
      const partners = FuneralHallService.searchHalls({ onlyPartner: true });
      expect(partners.length).toBeGreaterThan(0);
      partners.forEach((h) => {
        expect(h.isBaeungPartner).toBe(true);
        expect(h.discountRate).toBeGreaterThan(0);
      });
    });

    it('최소 안치능력(minCapacity: 20구) 필터 시 대형 안치시설만 반환되어야 한다', () => {
      const largeHalls = FuneralHallService.searchHalls({ minCapacity: 20 });
      expect(largeHalls.length).toBeGreaterThan(0);
      largeHalls.forEach((h) => {
        expect(h.capacityCount).toBeGreaterThanOrEqual(20);
      });
    });
  });

  describe('배웅 제휴 빈소 임대료 감면 연산기 검증', () => {
    it('성남시의료원 2일(3일장) 임대 시 25% 할인이 정확히 산출되어야 한다', () => {
      // 1일 650,000원 -> 2일 = 1,300,000원 -> 25% 할인 = 325,000원 감면 -> 실부담 975,000원
      const discount = FuneralHallService.calculateBaeungDiscount('fh-gyeonggi-seongnam-medical', 2);
      expect(discount.standardTotalRent).toBe(1_300_000);
      expect(discount.discountAmount).toBe(325_000);
      expect(discount.discountedTotalRent).toBe(975_000);
      expect(discount.discountRatePercentage).toBe(25);
    });

    it('존재하지 않는 식장 ID 입력 시 예외를 발생시켜야 한다', () => {
      expect(() => {
        FuneralHallService.calculateBaeungDiscount('invalid-id', 2);
      }).toThrow();
    });
  });

  describe('사업계획서 1단계 옵션 B: 무빈소·가족장 큐레이션 및 견적 참조번호(REF) 검증', () => {
    it('무빈소(direct_cremation) 필터 시 직송·안치 가능 식장만 필터링되어야 한다', () => {
      const results = FuneralHallService.searchHalls({ funeralType: 'direct_cremation' });
      expect(results.length).toBeGreaterThan(0);
      results.forEach((h) => {
        expect(h.allowsDirectCremation).not.toBe(false);
      });
    });

    it('소규모 가족장(small_family) 필터 시 전용 빈소 보유 식장만 필터링되어야 한다', () => {
      const results = FuneralHallService.searchHalls({ funeralType: 'small_family' });
      expect(results.length).toBeGreaterThan(0);
      results.forEach((h) => {
        expect(h.hasSmallFamilyRoom).not.toBe(false);
      });
    });

    it('견적 참조번호(REF) 발급 시 고유 번호(REF-2026-KR-XXXX)와 공정위 준수 문구가 포함되어야 한다', () => {
      const quote = FuneralHallService.generateQuoteReference({
        hallId: 'fh-seoul-asan',
        funeralType: 'direct_cremation',
        applicantName: '김정우',
        applicantPhone: '010-3849-2910'
      });

      expect(quote.referenceCode).toMatch(/^REF-2026-KR-\d{4}$/);
      expect(quote.hallName).toBe('서울아산병원장례식장');
      expect(quote.funeralType).toBe('direct_cremation');
      expect(quote.roomDailyRent).toBe(0); // 무빈소이므로 빈소 임대료 0원
      expect(quote.stayDays).toBe(0);
      expect(quote.coldStorageDailyFee).toBe(150_000);
      expect(quote.encoffinmentRoomFee).toBe(150_000);
      // 안치실 2일(30만) + 입관실(15만) = 45만 원
      expect(quote.facilitySubtotal).toBe(450_000);
      expect(quote.finalFacilityCost).toBe(450_000);
      expect(quote.legalComplianceNote).toContain('공정거래위원회');
      expect(quote.counselingNotice).toContain(quote.referenceCode);
    });

    it('제휴 식장에서 소규모 가족장 견적 발급 시 배웅 감면이 올바르게 차감되어야 한다', () => {
      // 부산 시민장례식장 (30% 제휴 감면 식장)
      const quote = FuneralHallService.generateQuoteReference({
        hallId: 'fh-busan-simin',
        funeralType: 'small_family',
        stayDays: 2
      });

      expect(quote.hallName).toBe('(주)시민장례식장');
      expect(quote.roomDailyRent).toBeGreaterThan(0);
      expect(quote.baeungDiscountAmount).toBeGreaterThan(0);
      expect(quote.finalFacilityCost).toBe(quote.facilitySubtotal - quote.baeungDiscountAmount);
    });
  });

  describe('사업계획서 1단계 시범 권역(수도권 동남부: 강남4구·성남) 38개소 실데이터 정합성 검증', () => {
    it('시범 권역 장례식장이 정확히 38개소 등록되어 있어야 한다', () => {
      const pilotHalls = FuneralHallService.getPilotRegionHalls();
      expect(pilotHalls).toHaveLength(38);
    });

    it('시범 권역 내 모든 식장은 유효한 행정구역, 도로명 주소, 전화번호 및 e하늘 공시 기준일을 포함해야 한다', () => {
      const pilotHalls = FuneralHallService.getPilotRegionHalls();
      const validDistricts = ['강남구', '서초구', '송파구', '강동구', '성남시', '인접수도권'];

      pilotHalls.forEach((h) => {
        expect(h.isPilotRegion).toBe(true);
        expect(validDistricts).toContain(h.pilotDistrict);
        expect(h.address).toMatch(/^(서울|경기)/);
        expect(h.phone).toMatch(/^(02|031)-\d{3,4}-\d{4}$/);
        expect(h.roomCount).toBeGreaterThan(0);
        expect(h.capacityCount).toBeGreaterThan(0);
        expect(h.pricingBaseDate).toBeDefined();
        expect(h.crematoriumTravelMinutes).toBeGreaterThan(0);
      });
    });

    it('시범 권역 요약 분석(getPilotRegionSummary) 지표가 사업계획서 1단계 목표 기준을 충족해야 한다', () => {
      const summary = FuneralHallService.getPilotRegionSummary();

      expect(summary.totalHalls).toBe(38);
      // 참여의향서(LOI) 20% 유치 목표 = 8개소 (38 * 0.20 = 7.6 -> 올림 8)
      expect(summary.targetLoiCount).toBe(8);
      // 무빈소 가능 비율 90% 이상 (사업계획서 전국 92% 가설 검증)
      expect(summary.directCremationRate).toBeGreaterThanOrEqual(90);
      // 상급종합/요양병원 부설, 독립 전문, 공설 식장이 모두 분포하여 대조군 실험이 가능해야 함
      expect(summary.hospitalAffiliatedCount).toBeGreaterThan(0);
      expect(summary.independentSpecializedCount).toBeGreaterThan(0);
      expect(summary.publicMunicipalCount).toBeGreaterThan(0);
      // 서울추모공원/성남영생원 평균 이동 시간 30분 이내
      expect(summary.averageCrematoriumMinutes).toBeLessThanOrEqual(30);
    });

    it('시범 권역 전용 검색 필터(onlyPilotRegion, pilotDistrict)가 정확하게 작동해야 한다', () => {
      const onlyPilot = FuneralHallService.searchHalls({ onlyPilotRegion: true });
      expect(onlyPilot).toHaveLength(38);

      const gangnamHalls = FuneralHallService.searchHalls({ onlyPilotRegion: true, pilotDistrict: '강남구' });
      expect(gangnamHalls).toHaveLength(4);
      gangnamHalls.forEach((h) => {
        expect(h.pilotDistrict).toBe('강남구');
      });

      const seongnamHalls = FuneralHallService.searchHalls({ onlyPilotRegion: true, pilotDistrict: '성남시' });
      expect(seongnamHalls).toHaveLength(13);
      seongnamHalls.forEach((h) => {
        expect(h.pilotDistrict).toBe('성남시');
      });
    });
  });
});
