import {
  PilotLoiSubmission,
  PilotLoiDocument,
  PilotLoiStatusSummary,
  PilotAdPackageType
} from './types.js';

/**
 * 사업계획서 10.1절 및 3.1/4.2절
 * 시범 권역 B2B 장례식장 참여의향서(LOI) 및 1-Page 사업제안서 서비스 엔진
 */
export class PilotLoiService {
  private static lois: Map<string, PilotLoiDocument> = new Map();

  // 초기 시범 권역 참여의향서 시드 데이터 (서울 1곳, 성남 1곳)
  static {
    const seed1: PilotLoiDocument = {
      loiNumber: 'LOI-2026-PILOT-1001',
      hallId: 'fh-gyeonggi-seongnam-medical',
      hallName: '성남시의료원장례식장',
      pilotDistrict: '성남시',
      directorName: '이진석 장례지원팀장',
      contactPhone: '031-738-7000',
      contactEmail: 'funeral@scmc.kr',
      businessNumber: '129-83-01928',
      adPackage: 'PRIORITY_SLOT_STANDARD',
      adPackageName: '시범 권역 지역 우선 노출 정액제',
      monthlyAdFee: 300_000,
      offeredDiscountRate: 25,
      trialPeriodMonths: 3,
      issuedAt: '2026-09-28',
      trialValidUntil: '2026-12-28',
      status: 'CONFIRMED',
      expectedMonthlyRevenue: 2_250_000,
      expectedRoiPercentage: 750,
      legalNotice: '공정거래위원회 2026.3 리베이트 철폐 지침 준수 · 알선 수수료 0원 정찰 광고',
      proposalSummary: '공설의료원 투명 장례 브랜딩 및 성남·분당 권역 유족 직접 유입 확보'
    };

    const seed2: PilotLoiDocument = {
      loiNumber: 'LOI-2026-PILOT-1002',
      hallId: 'fh-seoul-songpa-police',
      hallName: '국립경찰병원장례식장',
      pilotDistrict: '송파구',
      directorName: '최정훈 운영과장',
      contactPhone: '02-431-4400',
      contactEmail: 'funeral@nph.go.kr',
      businessNumber: '215-83-00451',
      adPackage: 'PRIORITY_SLOT_STANDARD',
      adPackageName: '시범 권역 지역 우선 노출 정액제',
      monthlyAdFee: 300_000,
      offeredDiscountRate: 25,
      trialPeriodMonths: 3,
      issuedAt: '2026-09-29',
      trialValidUntil: '2026-12-29',
      status: 'CONFIRMED',
      expectedMonthlyRevenue: 2_250_000,
      expectedRoiPercentage: 750,
      legalNotice: '공정거래위원회 2026.3 리베이트 철폐 지침 준수 · 알선 수수료 0원 정찰 광고',
      proposalSummary: '송파·강남권 유족 대상 국립 공공의료원 인지도 제고 및 무빈소 유치'
    };

    this.lois.set(seed1.loiNumber, seed1);
    this.lois.set(seed2.loiNumber, seed2);
  }

  /**
   * 1-Page B2B 공식 사업제안서 핵심 정보 반환
   */
  public static getProposalDocument(): {
    title: string;
    subtitle: string;
    marketContext: string[];
    coreBenefits: {
      title: string;
      description: string;
      highlight: string;
    }[];
    pricingPlans: {
      type: PilotAdPackageType;
      name: string;
      monthlyPrice: number;
      features: string[];
      isRecommended: boolean;
    }[];
    legalGuarantee: string;
    pilotConditions: string[];
  } {
    return {
      title: '배웅(BAEUNG) 장례식장 상생 협약 제안서',
      subtitle: '무빈소·가족장 시대, 리베이트 제재 없는 100% 합법 월 30만원 정액 광고 파트너십',
      marketContext: [
        '통계청·복지부 기준 무빈소·가족장 선호도 71.8% 급증 (온라인 정보 탐색 대세화)',
        '2026년 3월 공정거래위원회 상조사·장의사 리베이트 지급 부당 고객유인행위 엄중 제재',
        '알선 수수료(건당 알선료) 모델 전면 배제 및 투명한 월 정액 광고 디렉터리 구축'
      ],
      coreBenefits: [
        {
          title: '지역 검색 상단 우선 노출',
          description: '시범 권역(강남4구·성남) 유족 검색 및 지도 탐색 시 최상단 우선 노출 및 배웅 감면 인증 뱃지 부여',
          highlight: '월 평균 10만 명 이상 잠재 유족 노출'
        },
        {
          title: '월 1건만 유치되어도 800% ROI',
          description: '월 30만 원 고정 광고료 대비, 빈소 1건 유치 시 시설 매출 약 240만~300만 원 발생',
          highlight: '월 순익 분기 초과 달성 구조'
        },
        {
          title: '가상번호(050) 투명 트래킹',
          description: '배웅을 통해 연결된 유족 통화 건수, 문의 내역, 전환 통계를 파트너 포털에서 실시간 확인',
          highlight: '성과 데이터 100% 투명 공개'
        },
        {
          title: '장례 준비 숏폼 콘텐츠 연계',
          description: '시설 투어 및 정갈한 분향실 전경을 담은 고품질 숏폼 콘텐츠를 배웅 전문 제작팀이 무상 지원',
          highlight: '모바일 유튜브·인스타그램 동시 송출'
        }
      ],
      pricingPlans: [
        {
          type: 'PRIORITY_SLOT_STANDARD',
          name: '시범 권역 표준 우선 노출 정액제',
          monthlyPrice: 300_000,
          features: [
            '권역별 상단 우선 노출 슬롯 1구좌',
            '배웅 사전 감면 제휴 식장 인증 뱃지',
            '050 안심 가상번호 및 실시간 통화 대시보드',
            'B2B 파트너 전용 웹 포털 무료 계정',
            '현장 추가금 없는 정찰 견적서(REF) 연동'
          ],
          isRecommended: true
        },
        {
          type: 'SHORTFORM_CONTENT_BUNDLE',
          name: '지역 노출 + 숏폼 제작 결합 번들',
          monthlyPrice: 500_000,
          features: [
            '표준 우선 노출 슬롯 모든 혜택 포함',
            '장례식장 시설 안내 숏폼 콘텐츠 월 2편 제작',
            '배웅 공식 유튜브 쇼츠 및 인스타 릴스 배포',
            '타겟 지역 3050 유족 대상 디지털 타겟팅 광고 지원'
          ],
          isRecommended: false
        }
      ],
      legalGuarantee:
        '본 파트너십은 「독점규제 및 공정거래에 관한 법률」 및 공정위 2026.3 리베이트 제재 기준을 100% 준수하며, 건당 알선료나 뒷돈 관행이 일체 없는 순수 정액 광고 홍보 계약입니다.',
      pilotConditions: [
        '시범 권역(강남4구·성남) 38개소 중 8개소(20%) 한정 선착순 접수',
        '최초 3개월 시범 운영 후 지속 여부 자유 결정 (위약금 0원)',
        '유족에게 빈소 임대료 10~30% 정찰 감면 혜택 제공 조건'
      ]
    };
  }

  /**
   * 시범 권역 참여의향서(LOI) 신규 접수 및 증서 발급
   */
  public static submitLoi(sub: PilotLoiSubmission): PilotLoiDocument {
    if (!sub.hallName || sub.hallName.trim().length === 0) {
      throw new Error('장례식장 명칭을 입력해야 합니다.');
    }
    if (!sub.directorName || sub.directorName.trim().length === 0) {
      throw new Error('대표자 또는 담당자 성함을 입력해야 합니다.');
    }
    if (!sub.contactPhone || sub.contactPhone.trim().length === 0) {
      throw new Error('연락 가능한 전화번호를 입력해야 합니다.');
    }
    if (!sub.businessNumber || sub.businessNumber.replace(/[^0-9]/g, '').length < 10) {
      throw new Error('올바른 사업자등록번호 10자리를 입력해야 합니다.');
    }
    if (!sub.flatRateAgreed) {
      throw new Error('정액제 광고 조건(건당 알선료 배제)에 동의해야 합니다.');
    }
    if (!sub.antiRebatePledge) {
      throw new Error('공정거래위원회 리베이트 철폐 및 촌지 근절 서약에 동의해야 합니다.');
    }
    if (!sub.signatureName || sub.signatureName.trim().length === 0) {
      throw new Error('참여의향서 전자 서명을 입력해야 합니다.');
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const loiNumber = `LOI-2026-PILOT-${randomSuffix}`;

    const monthlyAdFee = sub.adPackage === 'SHORTFORM_CONTENT_BUNDLE' ? 500_000 : 300_000;
    const adPackageName =
      sub.adPackage === 'SHORTFORM_CONTENT_BUNDLE'
        ? '지역 노출 + 숏폼 제작 결합 번들'
        : '시범 권역 지역 우선 노출 정액제';

    // 빈소 1건 유치 시 예상 매출액 및 ROI (기준 300만 원에 유족 감면율 반영)
    const baseRevenue = 3_000_000;
    const discountRate = sub.offeredDiscountRate || 20;
    const expectedRevenue = Math.round(baseRevenue * (1 - discountRate / 100));
    const roiPercentage = Math.round((expectedRevenue / monthlyAdFee) * 100);

    const now = new Date();
    const issuedAt = now.toISOString().slice(0, 10);
    const validDate = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
    const trialValidUntil = validDate.toISOString().slice(0, 10);

    const doc: PilotLoiDocument = {
      loiNumber,
      hallId: sub.hallId,
      hallName: sub.hallName.trim(),
      pilotDistrict: sub.pilotDistrict || '수도권',
      directorName: sub.directorName.trim(),
      contactPhone: sub.contactPhone.trim(),
      contactEmail: sub.contactEmail.trim(),
      businessNumber: sub.businessNumber.trim(),
      adPackage: sub.adPackage,
      adPackageName,
      monthlyAdFee,
      offeredDiscountRate: discountRate,
      trialPeriodMonths: sub.trialPeriodMonths || 3,
      issuedAt,
      trialValidUntil,
      status: 'CONFIRMED',
      expectedMonthlyRevenue: expectedRevenue,
      expectedRoiPercentage: roiPercentage,
      legalNotice: '「공정거래법」 및 공정위 2026.3 리베이트 제재 지침 준수 · 알선 수수료 0원 정찰 광고',
      proposalSummary: `${sub.hallName}의 투명한 정찰 장례 브랜딩 및 ${sub.pilotDistrict} 권역 유족 직결 유치`
    };

    this.lois.set(loiNumber, doc);
    return doc;
  }

  /**
   * 고유 번호로 LOI 조회
   */
  public static getLoiByNumber(loiNumber: string): PilotLoiDocument | undefined {
    return this.lois.get(loiNumber.trim());
  }

  /**
   * 전체 접수된 LOI 목록
   */
  public static getAllLois(): PilotLoiDocument[] {
    return Array.from(this.lois.values());
  }

  /**
   * 사업계획서 10.1절 기준 LOI 유치 달성도 현황 집계
   */
  public static getPilotLoiStatusSummary(): PilotLoiStatusSummary {
    const totalTarget = 38;
    const targetLoi = 8; // 20%
    const lois = this.getAllLois();
    const currentCount = lois.length;

    const districtCounts: Record<string, number> = {};
    for (const loi of lois) {
      const dist = loi.pilotDistrict || '기타';
      districtCounts[dist] = (districtCounts[dist] || 0) + 1;
    }

    const rate = Math.round((currentCount / targetLoi) * 100);

    return {
      totalTargetHalls: totalTarget,
      targetLoiCount: targetLoi,
      currentLoiCount: currentCount,
      achievementRatePercentage: rate,
      isTargetAchieved: currentCount >= targetLoi,
      hallsByDistrict: districtCounts
    };
  }
}
