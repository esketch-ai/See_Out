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
});
