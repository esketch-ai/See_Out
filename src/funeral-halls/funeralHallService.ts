import {
  FuneralHallEntity,
  FuneralHallSearchFilter,
  RegionalStat,
  RegionCode
} from './types.js';
import {
  FUNERAL_HALLS_DATASET,
  REGIONAL_STATISTICS
} from './funeralHallsDataset.js';

/**
 * 전국 장례식장 인프라 및 검색 서비스
 * 카파시 2원칙: Simple, Deterministic End-to-End Baseline
 */
export class FuneralHallService {
  private static halls: FuneralHallEntity[] = [...FUNERAL_HALLS_DATASET];
  private static stats: RegionalStat[] = [...REGIONAL_STATISTICS];

  /**
   * 전체 장례식장 데이터 조회
   */
  public static getAllHalls(): FuneralHallEntity[] {
    return this.halls;
  }

  /**
   * 고유 ID로 장례식장 조회
   */
  public static getHallById(id: string): FuneralHallEntity | undefined {
    return this.halls.find((h) => h.id === id);
  }

  /**
   * 17개 시·도별 등록 통계 반환 (총 1,060개소)
   */
  public static getRegionalStats(): RegionalStat[] {
    return this.stats;
  }

  /**
   * 전국 총 등록 시설 수 (검증 기준: 1,060개소)
   */
  public static getTotalRegisteredCount(): number {
    return this.stats.reduce((acc, s) => acc + s.registeredCount, 0);
  }

  /**
   * 다차원 필터링 검색
   */
  public static searchHalls(filter: FuneralHallSearchFilter = {}): FuneralHallEntity[] {
    let result = this.halls;

    // 1. 키워드 검색 (시설명, 주소, subRegion)
    if (filter.keyword && filter.keyword.trim().length > 0) {
      const q = filter.keyword.trim().toLowerCase();
      result = result.filter(
        (h) =>
          h.name.toLowerCase().includes(q) ||
          h.address.toLowerCase().includes(q) ||
          h.subRegion.toLowerCase().includes(q)
      );
    }

    // 2. 광역시도 필터
    if (filter.region) {
      result = result.filter((h) => h.region === filter.region);
    }

    // 3. 운영 주체 카테고리 필터
    if (filter.category) {
      result = result.filter((h) => h.category === filter.category);
    }

    // 4. 배웅 제휴 할인 식장만 보기
    if (filter.onlyPartner) {
      result = result.filter((h) => h.isBaeungPartner && h.discountRate > 0);
    }

    // 5. 최소 빈소 수 필터
    if (filter.minRooms && filter.minRooms > 0) {
      result = result.filter((h) => h.roomCount >= filter.minRooms!);
    }

    // 6. 최소 안치실 수용량 필터
    if (filter.minCapacity && filter.minCapacity > 0) {
      result = result.filter((h) => h.capacityCount >= filter.minCapacity!);
    }

    return result;
  }

  /**
   * 배웅 제휴 할인 혜택 계산기 (3일장 기준 빈소 임대료 감면)
   */
  public static calculateBaeungDiscount(
    hallId: string,
    days: number = 2 // 3일장 기준 통상 빈소 2일(48시간) 임대
  ): {
    standardTotalRent: number;
    discountAmount: number;
    discountedTotalRent: number;
    discountRatePercentage: number;
  } {
    const hall = this.getHallById(hallId);
    if (!hall) {
      throw new Error(`Funeral hall not found for ID: ${hallId}`);
    }

    const standardTotalRent = hall.dailyRentEstimate * days;
    const discountAmount = Math.floor(standardTotalRent * hall.discountRate);
    const discountedTotalRent = standardTotalRent - discountAmount;
    const discountRatePercentage = Math.round(hall.discountRate * 100);

    return {
      standardTotalRent,
      discountAmount,
      discountedTotalRent,
      discountRatePercentage
    };
  }

  /**
   * 플랫폼 집계 통계 지표 산출
   */
  public static getSummaryMetrics(): {
    totalHallsInSample: number;
    partnerHallsCount: number;
    averageRoomCount: number;
    totalCapacitySum: number;
  } {
    const total = this.halls.length;
    const partners = this.halls.filter((h) => h.isBaeungPartner).length;
    const totalRooms = this.halls.reduce((acc, h) => acc + h.roomCount, 0);
    const totalCapacity = this.halls.reduce((acc, h) => acc + h.capacityCount, 0);

    return {
      totalHallsInSample: total,
      partnerHallsCount: partners,
      averageRoomCount: total > 0 ? Math.round((totalRooms / total) * 10) / 10 : 0,
      totalCapacitySum: totalCapacity
    };
  }
}
