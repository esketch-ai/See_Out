import {
  AffiliateCategory,
  AffiliatePartnerEntity,
  AffiliateVerificationResult,
  AffiliateDistrictMatch,
  TravelEstimate
} from './types.js';
import { AFFILIATE_PARTNERS_DATASET } from './affiliateDataset.js';

/**
 * 부가 제휴사(봉안당·수목장·유품정리) 입점 심사 및 디렉터리 서비스
 * 사업계획서 3.3절 & 4.4절 준수
 * - 3대 부가 업종 인허가 정밀 서식 검증 (장사법 제15조/16조, 폐기물관리법 제25조)
 * - 수도권 동남부 시범 권역(강남4구·성남) 30분대 안심 매칭 지원
 * - 100% 정액제 및 리베이트 0원 고정
 */
export class AffiliateService {
  private static partners: AffiliatePartnerEntity[] = [...AFFILIATE_PARTNERS_DATASET];

  // 표시광고법 위반 금지 금칙어 목록 (사업계획서 4.4절 공통 심사 기준)
  private static readonly PROHIBITED_WORDS = [
    '최저가',
    '마감임박',
    '100% 보장',
    '전국 1위',
    '단독 특가',
    '파격 할인',
    '업계 유일'
  ];

  // 시범 권역 6대 자치구 목록
  public static readonly PILOT_DISTRICTS = [
    '강남구',
    '서초구',
    '송파구',
    '강동구',
    '성남시 분당구',
    '성남시 수정·중원구'
  ] as const;

  /**
   * 전체 제휴사 조회
   */
  public static getAllPartners(): AffiliatePartnerEntity[] {
    return this.partners;
  }

  /**
   * 업종 카테고리별 제휴사 조회
   */
  public static getPartnersByCategory(category: AffiliateCategory): AffiliatePartnerEntity[] {
    return this.partners.filter((p) => p.category === category);
  }

  /**
   * 고유 ID로 제휴사 상세 조회
   */
  public static getPartnerById(id: string): AffiliatePartnerEntity | undefined {
    return this.partners.find((p) => p.id === id);
  }

  /**
   * 시범 권역 지원 목록 조회
   */
  public static getPilotDistricts(): string[] {
    return [...this.PILOT_DISTRICTS];
  }

  /**
   * 정밀 인허가 번호 서식 검증기
   * - 봉안시설: 제[연도]-[시군구]-사설봉안-[번호]호 (장사법 제15조)
   * - 수목장림: 제[연도]-[시군구]-자연장지-[번호]호 (장사법 제16조)
   * - 유품정리: 제[연도]-[시군구]-폐기물수집운반-[번호]호 (폐기물관리법 제25조)
   */
  public static validateLicenseDetailed(
    category: AffiliateCategory,
    licenseNumber: string
  ): {
    isValid: boolean;
    isFormatValid: boolean;
    parsedYear?: number;
    parsedDistrict?: string;
    reason?: string;
  } {
    const trimmed = licenseNumber.trim();
    if (trimmed.length < 8) {
      return {
        isValid: false,
        isFormatValid: false,
        reason: '인허가 번호가 너무 짧거나 누락되었습니다 (최소 8자 이상).'
      };
    }

    let regex: RegExp;
    let requiredKeyword: string;
    let statutoryLaw: string;

    switch (category) {
      case 'COLUMBARIUM':
        regex = /^제?\s*(\d{4})-([가-힣A-Za-z0-9]+)-(사설봉안|봉안시설|공설봉안)-(\d+)호?$/;
        requiredKeyword = '봉안';
        statutoryLaw = '장사법 제15조';
        break;
      case 'WOODLAND_BURIAL':
        regex = /^제?\s*(\d{4})-([가-힣A-Za-z0-9]+)-(자연장지|사설자연장|수목장림)-(\d+)호?$/;
        requiredKeyword = '자연장';
        statutoryLaw = '장사법 제16조';
        break;
      case 'ESTATE_CLEARING':
        regex = /^제?\s*(\d{4})-([가-힣A-Za-z0-9]+)-(폐기물수집운반|생활폐기물|특수방역)-(\d+)호?$/;
        requiredKeyword = '폐기물';
        statutoryLaw = '폐기물관리법 제25조';
        break;
    }

    const keywordMatched = trimmed.includes(requiredKeyword);
    const match = trimmed.match(regex);

    if (match) {
      const year = parseInt(match[1], 10);
      const district = match[2];
      return {
        isValid: true,
        isFormatValid: true,
        parsedYear: year,
        parsedDistrict: district
      };
    }

    // 정규식 정밀 서식은 미완전하나 필수 키워드를 갖춘 경우(일반 검증 통과, 서식 경고)
    return {
      isValid: keywordMatched,
      isFormatValid: false,
      reason: keywordMatched
        ? `정규 서식(예: 제2024-시군구-${requiredKeyword}-XX호)과 일부 상이하나 ${statutoryLaw} 필수 키워드가 확인되었습니다.`
        : `${statutoryLaw}에 부합하는 정규 인허가 번호가 아닙니다.`
    };
  }

  /**
   * 사업계획서 4.4절 기준 신규 부가 제휴사 입점 자격 심사기
   */
  public static verifyPartnerAdmission(params: {
    partnerId: string;
    category: AffiliateCategory;
    name: string;
    licenseNumber: string;
    adText: string;
    hasTransparentPricing: boolean;
  }): AffiliateVerificationResult {
    // 1. 인허가 서류 유효성 및 서식 정밀 검증
    const detailed = this.validateLicenseDetailed(params.category, params.licenseNumber);
    const licenseValid = detailed.isValid;
    const licenseFormatValid = detailed.isFormatValid;

    // 2. 표시광고법 위반 금칙어 필터링
    const foundProhibited = this.PROHIBITED_WORDS.find((w) =>
      params.adText.includes(w) || params.name.includes(w)
    );
    const prohibitedWordsPassed = !foundProhibited;

    // 3. 투명한 가격 공개 여부
    const pricingDisclosed = params.hasTransparentPricing;

    const passed = licenseValid && prohibitedWordsPassed && pricingDisclosed;

    let disqualificationReason: string | undefined;
    if (!licenseValid) {
      disqualificationReason =
        detailed.reason ||
        '법정 인허가 서류(장사법 제15조/16조 또는 폐기물관리법 제25조 필증)가 유효하지 않습니다.';
    } else if (!prohibitedWordsPassed) {
      disqualificationReason = `표시광고법 위반 금칙어("${foundProhibited}")가 포함되어 있어 입점이 반려되었습니다.`;
    } else if (!pricingDisclosed) {
      disqualificationReason =
        '원가 정찰제 준수를 위한 투명한 품목별 가격표 제출이 미비합니다.';
    }

    return {
      partnerId: params.partnerId,
      passed,
      checks: {
        licenseValid,
        licenseFormatValid,
        prohibitedWordsPassed,
        pricingDisclosed
      },
      parsedDetails: detailed.parsedYear
        ? {
            licenseYear: detailed.parsedYear,
            issuingDistrict: detailed.parsedDistrict
          }
        : undefined,
      disqualificationReason
    };
  }

  /**
   * 시범 권역(강남4구·성남) 자치구 기준 30분 안심 매칭 파트너 조회
   * 봉안시설 · 수목장림 · 유품정리 각 업종별 최단거리/최단시간 파트너 추천
   */
  public static getNearestAffiliatesForDistrict(districtName: string): AffiliateDistrictMatch {
    const defaultEstimate: TravelEstimate = { distanceKm: 25.0, travelTimeMinutes: 35 };

    const getBestForCategory = (cat: AffiliateCategory) => {
      const candidates = this.partners.filter((p) => p.category === cat);
      if (candidates.length === 0) return undefined;

      let bestPartner = candidates[0];
      let bestEstimate = bestPartner.targetDistrictEstimates?.[districtName] || defaultEstimate;

      for (let i = 1; i < candidates.length; i++) {
        const candidate = candidates[i];
        const est = candidate.targetDistrictEstimates?.[districtName];
        if (est && est.travelTimeMinutes < bestEstimate.travelTimeMinutes) {
          bestPartner = candidate;
          bestEstimate = est;
        }
      }

      return {
        partner: bestPartner,
        estimate: bestEstimate
      };
    };

    return {
      districtName,
      matchedColumbarium: getBestForCategory('COLUMBARIUM'),
      matchedWoodlandBurial: getBestForCategory('WOODLAND_BURIAL'),
      matchedEstateClearing: getBestForCategory('ESTATE_CLEARING')
    };
  }

  /**
   * 제휴사 선택 품목 총비용 정찰 계산기
   */
  public static calculateAffiliatePackageCost(
    selections: Array<{ partnerId: string; itemIndex: number }>
  ): {
    totalCost: number;
    itemsDetail: Array<{ partnerName: string; itemName: string; price: number; unit: string }>;
  } {
    let totalCost = 0;
    const itemsDetail: Array<{
      partnerName: string;
      itemName: string;
      price: number;
      unit: string;
    }> = [];

    selections.forEach(({ partnerId, itemIndex }) => {
      const partner = this.getPartnerById(partnerId);
      if (partner && partner.pricingInfo[itemIndex]) {
        const item = partner.pricingInfo[itemIndex];
        totalCost += item.price;
        itemsDetail.push({
          partnerName: partner.name,
          itemName: item.name,
          price: item.price,
          unit: item.unit
        });
      }
    });

    return {
      totalCost,
      itemsDetail
    };
  }
}
