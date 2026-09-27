import {
  StandbyRegistrationRequest,
  StandbyRegistration,
  LossProtectionVoucher
} from './types.js';

/**
 * 듀얼 스탠바이 (Dual-Standby) 및 손실 보전 바우처 관리 엔진
 * - 사업계획서 3.2절: 가입비 0원, 무약정 등록, 실제 임종 시 양자택일 보장
 * - 기존 상조 해약 전환 방법안: 손실액 일부를 의전 바우처(30만~50만원)로 보전
 */
export class DualStandbyEngine {
  private static registrations: Map<string, StandbyRegistration> = new Map();
  private static vouchers: Map<string, LossProtectionVoucher> = new Map();

  // 초기 시드 데이터 (故 김철수 선생 가계 기준)
  static {
    const seedVoucher: LossProtectionVoucher = {
      voucherCode: 'BAEUNG-STANDBY-2026-8831',
      voucherAmount: 300_000,
      issuedTo: '김정우 (장남)',
      issuedAt: '2026-09-27',
      validUntil: '영구 유효 (평생 보장)',
      isRedeemed: false,
      applicableBenefits: [
        '제단 생화 꽃장식 1단 특대형 업그레이드 지원 (30만원 상당)',
        '최고급 링컨/캐딜락 리무진 관외 50km 무료 연장',
        '원목 유골함 무료 각인 서비스'
      ]
    };

    const seedReg: StandbyRegistration = {
      registrationId: 'DS-2026-KR-8831',
      registrantName: '김정우',
      registrantPhone: '010-3849-2910',
      beneficiaryName: '故 김철수 님',
      relationship: '부친(父)',
      existingCompany: 'B상조 (보람상조)',
      existingProduct: '보람 프리미엄 450',
      paidTotalAmount: 1_260_000,
      voucher: seedVoucher,
      assignedDirectorName: '조성우 수석 장례지도사 (국가공인 1급 34년 경력)',
      assignedDirectorPhone: '010-8820-1588',
      registeredAt: '2026-09-27',
      status: 'ACTIVE'
    };

    this.registrations.set(seedReg.registrationId, seedReg);
    this.registrations.set(seedReg.registrantPhone, seedReg);
    this.vouchers.set(seedVoucher.voucherCode, seedVoucher);
  }

  /**
   * 듀얼 스탠바이 1초 무약정 사전 등록
   */
  public static register(req: StandbyRegistrationRequest): StandbyRegistration {
    if (!req.termsAgreed) {
      throw new Error('사전 무약정 약관 및 개인정보 처리에 동의해야 합니다.');
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const regId = `DS-2026-KR-${randomSuffix}`;
    const voucherCode = `BAEUNG-STANDBY-2026-${randomSuffix}`;

    // 바우처 보전 금액 산출 (납입액이 있으면 납입액의 25%, 없으면 표준 30만원, 최대 50만원)
    const paid = req.paidTotalAmount || 1_200_000;
    const calculated = Math.floor((paid * 0.25) / 10_000) * 10_000;
    const voucherAmount = Math.min(500_000, Math.max(300_000, calculated));

    const voucher: LossProtectionVoucher = {
      voucherCode,
      voucherAmount,
      issuedTo: req.registrantName.trim() || '신청 고객',
      issuedAt: new Date().toISOString().slice(0, 10),
      validUntil: '영구 유효 (평생 보장)',
      isRedeemed: false,
      applicableBenefits: [
        '제단 생화 꽃장식 1단 특대형 업그레이드 지원 (30만원 상당)',
        '최고급 링컨/캐딜락 리무진 관외 50km 무료 연장',
        '유족 전용 한지 전통 고급 납골함 지원'
      ]
    };

    const registration: StandbyRegistration = {
      registrationId: regId,
      registrantName: req.registrantName.trim(),
      registrantPhone: req.registrantPhone.trim(),
      beneficiaryName: req.beneficiaryName.trim(),
      relationship: req.relationship || '가족',
      existingCompany: req.existingCompany.trim(),
      existingProduct: req.existingProduct?.trim() || '상조 기본 상품',
      paidTotalAmount: paid,
      voucher,
      assignedDirectorName: '조성우 수석 장례지도사 (국가공인 1급 34년 경력)',
      assignedDirectorPhone: '010-8820-1588',
      registeredAt: new Date().toISOString().slice(0, 10),
      status: 'ACTIVE'
    };

    this.registrations.set(regId, registration);
    if (req.registrantPhone) {
      this.registrations.set(req.registrantPhone.replace(/[^0-9]/g, ''), registration);
    }
    this.vouchers.set(voucherCode, voucher);

    return registration;
  }

  /**
   * 등록 번호 또는 연락처로 듀얼 스탠바이 조회
   */
  public static getRegistration(query: string): StandbyRegistration | undefined {
    const clean = query.replace(/[^0-9a-zA-Z-]/g, '');
    return this.registrations.get(clean) || this.registrations.get(query);
  }

  /**
   * 바우처 유효성 검증
   */
  public static validateVoucher(code: string): { valid: boolean; voucher?: LossProtectionVoucher; message: string } {
    const voucher = this.vouchers.get(code.trim());
    if (!voucher) {
      return { valid: false, message: '등록되지 않은 바우처 코드입니다.' };
    }
    if (voucher.isRedeemed) {
      return { valid: false, voucher, message: '이미 사용 완료된 바우처입니다.' };
    }
    return { valid: true, voucher, message: '유효한 해약 손실 보전 바우처입니다.' };
  }

  /**
   * 의전 패키지에 바우처 적용 시 최종 실부담액 계산
   */
  public static applyVoucherToPackage(packagePrice: number, voucherCode: string): {
    originalPrice: number;
    voucherDeduction: number;
    finalPrice: number;
    voucherApplied: boolean;
  } {
    const check = this.validateVoucher(voucherCode);
    if (!check.valid || !check.voucher) {
      return {
        originalPrice: packagePrice,
        voucherDeduction: 0,
        finalPrice: packagePrice,
        voucherApplied: false
      };
    }

    const deduction = check.voucher.voucherAmount;
    const finalPrice = Math.max(0, packagePrice - deduction);

    return {
      originalPrice: packagePrice,
      voucherDeduction: deduction,
      finalPrice,
      voucherApplied: true
    };
  }

  /**
   * 전체 등록 건수
   */
  public static getRegistrationCount(): number {
    // 맵 내 중복 키(phone과 id) 제거 카운트
    const uniqueIds = new Set(Array.from(this.registrations.values()).map(r => r.registrationId));
    return uniqueIds.size;
  }
}
