import { describe, it, expect } from 'vitest';
import { DualStandbyEngine } from '../src/dual-standby/index.js';

describe('DualStandbyEngine (듀얼 스탠바이 및 손실 보전 바우처)', () => {
  it('기본 시드 등록 및 바우처 조회가 정상 작동해야 한다', () => {
    const reg = DualStandbyEngine.getRegistration('DS-2026-KR-8831');
    expect(reg).toBeDefined();
    expect(reg?.registrantName).toBe('김정우');
    expect(reg?.voucher.voucherAmount).toBe(300_000);

    const check = DualStandbyEngine.validateVoucher('BAEUNG-STANDBY-2026-8831');
    expect(check.valid).toBe(true);
    expect(check.voucher?.voucherAmount).toBe(300_000);
  });

  it('사전 무약정 약관 미동의 시 등록이 거부되어야 한다', () => {
    expect(() =>
      DualStandbyEngine.register({
        registrantName: '이영희',
        registrantPhone: '010-1234-5678',
        beneficiaryName: '박순자',
        relationship: '모친',
        existingCompany: '프리드라이프',
        termsAgreed: false
      })
    ).toThrow('약관');
  });

  it('1초 무약정 등록 시 고유 번호와 30만원 이상 손실 보전 바우처가 자동 발급되어야 한다', () => {
    const reg = DualStandbyEngine.register({
      registrantName: '박준호',
      registrantPhone: '010-9876-5432',
      beneficiaryName: '박부친',
      relationship: '부친',
      existingCompany: '보람상조',
      existingProduct: '보람 390',
      paidTotalAmount: 2_000_000,
      termsAgreed: true
    });

    expect(reg.registrationId).toMatch(/^DS-2026-KR-\d{4}$/);
    expect(reg.voucher.voucherCode).toMatch(/^BAEUNG-STANDBY-2026-\d{4}$/);
    expect(reg.voucher.voucherAmount).toBeGreaterThanOrEqual(300_000);
    expect(reg.status).toBe('ACTIVE');

    // 바우처 검증
    const check = DualStandbyEngine.validateVoucher(reg.voucher.voucherCode);
    expect(check.valid).toBe(true);
  });

  it('의전 패키지에 바우처 적용 시 바우처 금액만큼 정상 차감되어야 한다', () => {
    const packagePrice = 2_500_000;
    const result = DualStandbyEngine.applyVoucherToPackage(packagePrice, 'BAEUNG-STANDBY-2026-8831');

    expect(result.voucherApplied).toBe(true);
    expect(result.voucherDeduction).toBe(300_000);
    expect(result.finalPrice).toBe(2_200_000);
  });

  it('존재하지 않는 바우처 코드는 차감되지 않아야 한다', () => {
    const result = DualStandbyEngine.applyVoucherToPackage(2_500_000, 'INVALID-CODE');
    expect(result.voucherApplied).toBe(false);
    expect(result.voucherDeduction).toBe(0);
    expect(result.finalPrice).toBe(2_500_000);
  });
});
