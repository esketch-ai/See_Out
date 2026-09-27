import { B2BAdmissionRequest, B2BAdmissionApplication } from './types.js';

/**
 * 장례식장 B2B 정액제 광고 제휴 입점 심사 및 계약 신청 서비스
 * 사업계획서 3.1절(장례식장 중심 모델) & 4.2절(B2B 광고 계약)
 */
export class B2BAdmissionService {
  private static applications: Map<string, B2BAdmissionApplication> = new Map();

  // 초기 시드 신청서 (서울아산병원장례식장 협약 시뮬레이션)
  static {
    const seed: B2BAdmissionApplication = {
      applicationId: 'B2B-2026-HALL-1001',
      hallName: '서울아산병원장례식장',
      region: '서울특별시',
      address: '서울 송파구 올림픽로43길 88',
      businessNumber: '215-82-00100',
      permitNumber: '제2010-서울송파-장례식장-01호',
      directorName: '박원석 총괄팀장',
      contactPhone: '02-3010-2000',
      contactEmail: 'funeral@amc.seoul.kr',
      offeredDiscountRate: 20,
      monthlyAdFee: 300_000,
      commissionRate: 0,
      appliedAt: '2026-09-20',
      status: 'APPROVED',
      expectedMonthlyRevenueEstimate: 2_400_000,
      expectedRoiPercentage: 800
    };
    this.applications.set(seed.applicationId, seed);
  }

  /**
   * 신규 장례식장 B2B 제휴 입점 신청서 접수
   */
  public static submitApplication(req: B2BAdmissionRequest): B2BAdmissionApplication {
    if (!req.flatRateAgreed) {
      throw new Error('월 300,000원 100% 정액 광고료 계약 조건에 동의해야 합니다.');
    }
    if (!req.antiRebatePledge) {
      throw new Error('공정거래위원회 리베이트 금지 및 촌지 근절 서약에 동의해야 합니다.');
    }
    if (!req.businessNumber || req.businessNumber.replace(/[^0-9]/g, '').length < 10) {
      throw new Error('유효한 10자리 사업자등록번호를 입력해야 합니다.');
    }
    if (!req.permitNumber || req.permitNumber.trim().length < 5) {
      throw new Error('지자체 장사법 제29조 장례식장 영업신고증 번호를 입력해야 합니다.');
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const applicationId = `B2B-2026-HALL-${randomSuffix}`;

    // 빈소 1건 유치 시 예상 매출 및 ROI 연산 (평균 300만원 기준 감면율 적용)
    const baseRoomRevenue = 3_000_000;
    const discount = req.offeredDiscountRate || 10;
    const expectedRevenue = Math.round(baseRoomRevenue * (1 - discount / 100));
    const roiPercentage = Math.round((expectedRevenue / 300_000) * 100);

    const application: B2BAdmissionApplication = {
      applicationId,
      hallName: req.hallName.trim(),
      region: req.region.trim(),
      address: req.address.trim(),
      businessNumber: req.businessNumber.trim(),
      permitNumber: req.permitNumber.trim(),
      directorName: req.directorName.trim(),
      contactPhone: req.contactPhone.trim(),
      contactEmail: req.contactEmail.trim(),
      offeredDiscountRate: discount,
      monthlyAdFee: 300_000,
      commissionRate: 0,
      appliedAt: new Date().toISOString().slice(0, 10),
      status: 'SUBMITTED',
      expectedMonthlyRevenueEstimate: expectedRevenue,
      expectedRoiPercentage: roiPercentage
    };

    this.applications.set(applicationId, application);
    return application;
  }

  /**
   * 고유 신청 ID로 제휴 신청서 조회
   */
  public static getApplication(id: string): B2BAdmissionApplication | undefined {
    return this.applications.get(id.trim());
  }

  /**
   * 전체 제휴 신청 목록
   */
  public static getAllApplications(): B2BAdmissionApplication[] {
    return Array.from(this.applications.values());
  }
}
