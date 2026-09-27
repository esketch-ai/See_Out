import { describe, it, expect } from 'vitest';
import {
  VirtualCallBridgeService,
  FunnelMeasurementEngine
} from '../src/tracking/index.js';

describe('사업계획서 1단계 7장: 가상번호(클릭투콜) 통화 중계 및 4단계 효과 측정 퍼널 엔진 검증', () => {
  describe('VirtualCallBridgeService (0507 가상번호 중계 및 통화 메타데이터)', () => {
    it('장례식장 ID에 대응하는 0507 가상번호를 정상 반환해야 한다', () => {
      const vNum = VirtualCallBridgeService.getVirtualNumber('fh-seoul-asan', '02-3010-2000');
      expect(vNum).toMatch(/^0507-1420-\d{4}$/);
      expect(vNum).toBe('0507-1420-2000');
    });

    it('통화 시간이 30초 이상인 경우 실질 상담(isSubstantialCall: true)으로 판정해야 한다', () => {
      const call = VirtualCallBridgeService.logCallEvent({
        hallId: 'fh-seoul-asan',
        hallName: '서울아산병원장례식장',
        destinationNumber: '02-3010-2000',
        durationSeconds: 120
      });

      expect(call.callId).toMatch(/^CALL-2026-\d{4}$/);
      expect(call.durationSeconds).toBe(120);
      expect(call.isSubstantialCall).toBe(true);
      expect(call.callStatus).toBe('CONNECTED');
    });

    it('통화 시간이 30초 미만인 단순 문의는 실질 상담에서 제외(false)해야 한다', () => {
      const call = VirtualCallBridgeService.logCallEvent({
        hallId: 'fh-seoul-asan',
        hallName: '서울아산병원장례식장',
        destinationNumber: '02-3010-2000',
        durationSeconds: 15
      });

      expect(call.isSubstantialCall).toBe(false);
    });

    it('통신비밀보호법 및 공정거래 준수를 위해 녹음 미실시(recordingDisabled: true)가 보장되어야 한다', () => {
      const call = VirtualCallBridgeService.logCallEvent({
        hallId: 'fh-busan-simin',
        hallName: '(주)시민장례식장',
        destinationNumber: '051-636-4444',
        durationSeconds: 65
      });

      expect(call.recordingDisabled).toBe(true);
    });
  });

  describe('FunnelMeasurementEngine (4단계 퍼널 및 데이터-과금 분리 검증)', () => {
    it('퍼널 이벤트 추적 및 파트너 성과 리포트가 정상 생성되어야 한다', () => {
      // 0단계~4단계 이벤트 발생
      FunnelMeasurementEngine.trackEvent('fh-seoul-asan', 'STAGE_0_IMPRESSION');
      FunnelMeasurementEngine.trackEvent('fh-seoul-asan', 'STAGE_1_ENGAGEMENT', { userStaySeconds: 25 });
      FunnelMeasurementEngine.trackEvent('fh-seoul-asan', 'STAGE_2_CONTACT_ATTEMPT');
      FunnelMeasurementEngine.trackEvent('fh-seoul-asan', 'STAGE_4_CONVERSION_APPROX', { referenceCode: 'REF-2026-KR-7729' });

      const report = FunnelMeasurementEngine.generatePartnerReport(
        'fh-seoul-asan',
        '서울아산병원장례식장'
      );

      expect(report.reportId).toContain('FHSEOUL');
      expect(report.impressions).toBeGreaterThan(1000);
      expect(report.engagements).toBeGreaterThan(300);
      expect(report.contactAttempts).toBeGreaterThan(50);
      expect(report.quoteReferencesIssued).toBeGreaterThan(20);
      expect(report.rates.engagementRate).toBeGreaterThan(0);
      expect(report.rates.contactRate).toBeGreaterThan(0);
    });

    it('사업계획서 7.4절 데이터-과금 분리 원칙: 트래픽과 무관하게 정액 30만 원과 알선 수수료 0원이 유지되어야 한다', () => {
      const report = FunnelMeasurementEngine.generatePartnerReport(
        'fh-busan-simin',
        '(주)시민장례식장'
      );

      const isSeparated = FunnelMeasurementEngine.verifyDataBillingSeparation(report);
      expect(isSeparated).toBe(true);
      expect(report.billing.pricingModel).toBe('FIXED_FLAT_RATE');
      expect(report.billing.monthlyFee).toBe(300_000);
      expect(report.billing.commissionAmount).toBe(0);
      expect(report.billing.dataBillingSeparationCertified).toBe(true);
      expect(report.billing.complianceStatement).toContain('공정위 2026.3 리베이트 제재 지침');
    });
  });
});
