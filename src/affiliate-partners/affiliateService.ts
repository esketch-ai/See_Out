import {
  AffiliateCategory,
  AffiliatePartnerEntity,
  AffiliateVerificationResult
} from './types.js';
import { AFFILIATE_PARTNERS_DATASET } from './affiliateDataset.js';

/**
 * 부가 제휴사(봉안당·수목장·유품정리) 입점 심사 및 디렉터리 서비스
 * 사업계획서 3.3절 & 4.4절 준수
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
    // 1. 인허가 서류 유효성 검증
    const licenseValid =
      params.licenseNumber.trim().length >= 8 &&
      (params.category === 'COLUMBARIUM'
        ? params.licenseNumber.includes('봉안') || params.licenseNumber.includes('사설')
        : params.category === 'WOODLAND_BURIAL'
        ? params.licenseNumber.includes('자연장') || params.licenseNumber.includes('허가')
        : params.licenseNumber.includes('폐기물') || params.licenseNumber.includes('수집운반'));

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
        prohibitedWordsPassed,
        pricingDisclosed
      },
      disqualificationReason
    };
  }
}
