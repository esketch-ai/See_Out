import { describe, it, expect } from 'vitest';
import { QuoteDiagnosticsEngine, BENCHMARK_CERT_B_PREMIUM450 } from '../src/quote-diagnostics/index.js';
import { DualStandbyEngine } from '../src/dual-standby/index.js';
import { FuneralHallService } from '../src/funeral-halls/index.js';
import { VirtualCallService, FunnelMeasurementEngine } from '../src/tracking/index.js';
import { createObituaryFromSetting, DEFAULT_FUNERAL_SETTING, FuneralSetting } from '../src/life-archive/index.js';
import { OptOutService } from '../src/compliance/index.js';
import { AffiliateService } from '../src/affiliate-partners/index.js';
import { B2BAdmissionService } from '../src/b2b/index.js';

describe('🏛️ Full Platform End-to-End Service Audit (전체 서비스 통합 라이프사이클 종합 검증)', () => {
  // 1. 견적 진단 및 영수증 대조
  it('1. 견적 진단: 상조 증서 기반 법정 해약환급금 및 1:1 대조 영수증이 오차 없이 산출되어야 한다', () => {
    const report = QuoteDiagnosticsEngine.diagnose({
      certificate: BENCHMARK_CERT_B_PREMIUM450,
      clientName: '이수민 고객님',
      packageType: 'economic_3day',
      hiddenCostSeverity: 'average'
    });

    expect(report.diagnosticId).toBeDefined();
    expect(report.statutoryRefund.paidTotalAmount).toBe(1_260_000);
    expect(report.statutoryRefund.refundAmount).toBe(714_000);
    expect(report.transitionCredit).toBeGreaterThan(0);
    expect(report.summary.netSavingsAmount).toBeGreaterThan(5_000_000);
    expect(report.summary.callToActionBadge).toContain('절감');
  });

  // 2. 듀얼 스탠바이 및 손실 보전 바우처
  it('2. 듀얼 스탠바이: 기존 상조 유지 상태로 무약정 등록 시 30만원 상당 바우처가 발급되고 패키지에 차감 적용되어야 한다', () => {
    const reg = DualStandbyEngine.register({
      registrantName: '이수민',
      registrantPhone: '010-5555-8888',
      beneficiaryName: '이부친',
      relationship: '부친',
      existingCompany: '보람상조',
      existingProduct: '보람 프리미엄 450',
      paidTotalAmount: 1_260_000,
      termsAgreed: true
    });

    expect(reg.status).toBe('ACTIVE');
    expect(reg.voucher.voucherAmount).toBeGreaterThanOrEqual(300_000);

    const deductionResult = DualStandbyEngine.applyVoucherToPackage(2_500_000, reg.voucher.voucherCode);
    expect(deductionResult.voucherApplied).toBe(true);
    expect(deductionResult.finalPrice).toBe(2_500_000 - reg.voucher.voucherAmount);
  });

  // 3. 장례식장 검색 및 2일장/3일장 감면 계산
  it('3. 장례식장: 전국 1,080개 등록 장례식장 검색 및 빈소 임대료 감면이 정확히 계산되어야 한다', () => {
    const searchResults = FuneralHallService.searchHalls({ keyword: '아산' });
    expect(searchResults.length).toBeGreaterThan(0);
    const hall = searchResults[0];

    const discount2Day = FuneralHallService.calculateBaeungDiscount(hall.id, 2);
    const discount3Day = FuneralHallService.calculateBaeungDiscount(hall.id, 3);

    expect(discount2Day.stayDays).toBe(2);
    expect(discount3Day.stayDays).toBe(3);
    expect(discount3Day.standardTotalRent).toBeGreaterThan(discount2Day.standardTotalRent);
  });

  // 4. 모바일 부고장과 장례식장 시설 제원 실시간 오토필
  it('4. 모바일 부고장 오토필: 장례식장 선택 시 주소, 0507 가상번호, 대중교통, 승화원 화장장이 부고장에 자동 주입되어야 한다', () => {
    const hall = FuneralHallService.getHallById('fh-seoul-asan')!;
    expect(hall).toBeDefined();

    const virtPhone = VirtualCallService.getVirtualNumberForHall(hall.id);
    const setting: FuneralSetting = {
      ...DEFAULT_FUNERAL_SETTING,
      funeralHallId: hall.id,
      funeralHallName: hall.name,
      address: hall.address,
      phone: hall.phone,
      virtualPhone: virtPhone,
      nearestSubway: hall.nearestSubway,
      discountRate: Math.round(hall.discountRate * 100),
      crematoriumName: '서울시립승화원 (벽제 화장장)'
    };

    const obit = createObituaryFromSetting(setting);
    expect(obit.funeralHallLinkedName).toContain(hall.name);
    expect(setting.virtualPhone).toBe('0507-1420-2000');
    expect(setting.address).toContain('풍납동');
  });

  // 5. 가상번호 통화 계측 및 4단계 퍼널 성과 리포트 (통신비밀보호법 준수)
  it('5. 0507 통화 계측 & 퍼널: 녹음 없이 메타데이터만 수집하고 데이터-과금 분리 인증을 통과해야 한다', () => {
    const call = VirtualCallService.logCallEvent({
      hallId: 'fh-seoul-asan',
      hallName: '서울아산병원장례식장',
      destinationNumber: '02-3010-2000',
      durationSeconds: 45 // 30초 이상 실질 통화
    });

    expect(call.recordingDisabled).toBe(true);
    expect(call.isSubstantialCall).toBe(true);

    const report = FunnelMeasurementEngine.generatePartnerReport('fh-seoul-asan', '서울아산병원장례식장');
    expect(report.billing.monthlyFee).toBe(300_000);
    expect(report.billing.commissionAmount).toBe(0);

    const separationCheck = FunnelMeasurementEngine.verifyDataBillingSeparation(report);
    expect(separationCheck).toBe(true);
  });

  // 6. 옵트아웃 및 공공데이터 비제휴 고지
  it('6. 옵트아웃 컴플라이언스: 게재 중단(TAKEDOWN) 신청 접수 시 즉시 검색 결과에서 비노출 처리되어야 한다', () => {
    const targetHallId = 'fh-seoul-bohun';
    const initialHalls = FuneralHallService.searchHalls({});
    expect(initialHalls.some(h => h.id === targetHallId)).toBe(true);

    const result = OptOutService.submitRequest({
      hallId: targetHallId,
      hallName: '중앙보훈병원장례식장',
      requestType: 'TAKEDOWN',
      requesterRole: 'DIRECTOR',
      requesterName: '최관리자',
      requesterPhone: '010-1111-2222',
      details: '배웅 서비스 게재 중단 요청'
    });

    expect(result.requestId).toMatch(/^OPT-2026-KR-\d{4}$/);
    expect(OptOutService.isHallHidden(targetHallId)).toBe(true);
  });

  // 7. 3대 부가 제휴사 입점 심사 및 원가 정찰제
  it('7. 부가 제휴사: 장사법·폐기물관리법 인허가를 검증하고 표시광고법 위반 문구를 자동 차단해야 한다', () => {
    const columbariumPartners = AffiliateService.getPartnersByCategory('COLUMBARIUM');
    expect(columbariumPartners.length).toBeGreaterThan(0);
    expect(columbariumPartners[0].adPricingModel).toBe('FIXED_FLAT_RATE');

    // 과장 광고 차단 심사 검증
    const failedCheck = AffiliateService.verifyPartnerAdmission({
      partnerId: 'test-ad-fail',
      category: 'COLUMBARIUM',
      name: '로열층 최저가 봉안당',
      licenseNumber: '제2024-경기-사설봉안-99호',
      adText: '마감임박 최저가 100% 보장 특가',
      hasTransparentPricing: true
    });
    expect(failedCheck.passed).toBe(false);
    expect(failedCheck.checks.prohibitedWordsPassed).toBe(false);

    // 정상 적격 심사 검증
    const passCheck = AffiliateService.verifyPartnerAdmission({
      partnerId: 'test-ad-pass',
      category: 'ESTATE_CLEARING',
      name: '바른 유품정리 케어',
      licenseNumber: '제2024-서울-폐기물수집운반-12호',
      adText: '적법 허가 차량 정찰제 수거 및 경건한 유품 정리',
      hasTransparentPricing: true
    });
    expect(passCheck.passed).toBe(true);
  });

  // 8. 장례식장 B2B 정액제 입점 신청
  it('8. 장례식장 B2B 입점: 월 30만원 정액 광고 협약 및 리베이트 금지 서약 시 신청 번호와 ROI가 산출되어야 한다', () => {
    const app = B2BAdmissionService.submitApplication({
      hallName: '강남세브란스병원장례식장',
      region: '서울특별시',
      address: '서울 강남구 언주로 211',
      businessNumber: '213-82-00991',
      permitNumber: '제2011-서울강남-장례식장-02호',
      directorName: '김상우 원장',
      contactPhone: '02-2019-4000',
      contactEmail: 'director@yuhs.ac',
      offeredDiscountRate: 20,
      flatRateAgreed: true,
      antiRebatePledge: true
    });

    expect(app.applicationId).toMatch(/^B2B-2026-HALL-\d{4}$/);
    expect(app.monthlyAdFee).toBe(300_000);
    expect(app.commissionRate).toBe(0);
    expect(app.expectedRoiPercentage).toBeGreaterThanOrEqual(800);
  });
});
