import { describe, it, expect } from 'vitest';
import {
  formatKoreanDate,
  formatKoreanDateTime,
  formatISODate,
  getRelativeKoreanDate,
  getCurrentMonthPeriod,
  getCurrentYearMonth
} from '../src/utils/dateUtils.js';
import { FuneralHallService } from '../src/funeral-halls/index.js';
import { DualStandbyService } from '../src/quote-diagnostics/dualStandbyService.js';
import { DualStandbyEngine } from '../src/dual-standby/index.js';
import { FunnelMeasurementEngine } from '../src/tracking/index.js';
import {
  BENCHMARK_CERT_B_PREMIUM450,
  BENCHMARK_CERT_P_EVERGREEN590,
  BENCHMARK_CERT_H_SAFE480_MATURE
} from '../src/quote-diagnostics/benchmarkData.js';
import { StatutoryRefundCalculator } from '../src/quote-diagnostics/refundCalculator.js';

describe('전사 하드코딩 제거 및 도메인 체계화 감사 테스트 (Systematization Audit)', () => {
  describe('1. dateUtils 일자 및 기간 동적 유틸리티 검증', () => {
    it('현재 날짜 기준 한국어 일자 포맷을 정확히 생성해야 한다', () => {
      const today = new Date();
      const formatted = formatKoreanDate(today);
      expect(formatted).toMatch(/^\d{4}년 \d{2}월 \d{2}일$/);
      expect(formatted).toContain(`${today.getFullYear()}년`);
    });

    it('한국어 일시 포맷이 시간과 분을 포함해야 한다', () => {
      const now = new Date();
      const formatted = formatKoreanDateTime(now);
      expect(formatted).toMatch(/^\d{4}년 \d{2}월 \d{2}일 \d{2}:\d{2}$/);
    });

    it('ISO 날짜 포맷이 YYYY-MM-DD 규격을 준수해야 한다', () => {
      const formatted = formatISODate();
      expect(formatted).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('상대 일자 계산(offsetDays)이 정확한 미래 일자를 산출해야 한다', () => {
      const base = new Date('2026-03-01T00:00:00Z');
      const future = getRelativeKoreanDate(30, base);
      expect(future).toBe('2026년 03월 31일');
    });

    it('당월 리포트 대상 기간 문자열이 01일 시작 규격을 충족해야 한다', () => {
      const period = getCurrentMonthPeriod();
      expect(period).toMatch(/^\d{4}년 \d{2}월 01일 ~ \d{2}월 \d{2}일$/);
    });

    it('당월 연-월 식별자가 YYYY-MM 규격을 충족해야 한다', () => {
      const ym = getCurrentYearMonth();
      expect(ym).toMatch(/^\d{4}-\d{2}$/);
    });
  });

  describe('2. FuneralHallService 정찰 견적서 동적화 검증', () => {
    it('견적서 발급 시 하드코딩 일자가 아닌 실시간 동적 일자 및 30일 보증기간이 부여되어야 한다', () => {
      const quote = FuneralHallService.generateQuoteReference({
        hallId: 'fh-seoul-asan',
        funeralType: 'direct_cremation',
        applicantName: '테스트 유가족',
        applicantPhone: '010-9999-8888'
      });

      const todayStr = formatKoreanDate();
      expect(quote.issuedAt).toBe(todayStr);
      expect(quote.validUntil).toContain('30일간 보증');
      expect(quote.applicantName).toBe('테스트 유가족');
      expect(quote.applicantPhone).toBe('010-9999-8888');
    });

    it('신청인 정보 미입력 시 하드코딩된 특정인이 아닌 범용 기본값이 설정되어야 한다', () => {
      const quote = FuneralHallService.generateQuoteReference({
        hallId: 'fh-busan-simin',
        funeralType: 'small_family'
      });

      expect(quote.applicantName).toBe('배웅 유가족');
      expect(quote.applicantPhone).toBe('');
    });
  });

  describe('3. DualStandbyService 지역 지도사 동적 매칭 및 고유 가입자 바인딩 검증', () => {
    it('부산 지역 상조 등록 시 부산 관할 전담 지도사가 자동 배정되어야 한다', () => {
      const reg = DualStandbyService.createRegistration({
        registrantName: '이수민',
        registrantPhone: '010-5219-4820',
        beneficiaryName: '故 박영희 님',
        existingCompany: '부산소재 P상조',
        region: '부산광역시',
        address: '부산광역시 해운대구 우동'
      });

      expect(reg.registrantName).toBe('이수민');
      expect(reg.assignedDirectorName).toContain('강태식');
      expect(reg.assignedDirectorName).toContain('수석 장례지도사');
      expect(reg.assignedDirectorPhone).toBe('010-6361-1588');
      expect(reg.region).toBe('부산광역시');
      expect(reg.registeredAt).toBe(formatKoreanDate());
    });

    it('경기 분당 지역 등록 시 분당 관할 지도사가 자동 배정되어야 한다', () => {
      const reg = DualStandbyService.createRegistration({
        registrantName: '최진호',
        registrantPhone: '010-9182-7731',
        beneficiaryName: '故 강순자 님',
        existingCompany: 'H상조 판교지점',
        address: '경기도 성남시 분당구 판교역로'
      });

      expect(reg.assignedDirectorName).toContain('최민석');
      expect(reg.assignedDirectorPhone).toBe('010-3392-1588');
    });

    it('증서(cert)의 가입자 정보가 내용증명 청구서(cancellation claim)에 동적으로 관통되어야 한다', () => {
      const cert = BENCHMARK_CERT_P_EVERGREEN590;
      const refund = StatutoryRefundCalculator.calculateRefund(cert);
      const claim = DualStandbyService.createCancellationClaim({
        cert,
        refund
      });

      expect(claim.claimantName).toBe('이수민');
      expect(claim.claimantPhone).toBe('010-5219-4820');
      expect(claim.claimantAddress).toBe('부산광역시 해운대구 센텀남대로 35');
      expect(claim.refundAccountBank).toBe('국민은행');
      expect(claim.refundAccountNumber).toBe('921-02-184920');
      expect(claim.refundAccountHolder).toBe('이수민');
      expect(claim.claimDate).toBe(formatKoreanDate());
    });
  });

  describe('4. DualStandbyEngine 1초 사전등록 동적 매칭 검증', () => {
    it('등록 요청 상조사 위치 기반으로 관할 지도사와 실시간 등록일자가 바인딩되어야 한다', () => {
      const reg = DualStandbyEngine.register({
        registrantName: '강태양',
        registrantPhone: '010-7777-1234',
        beneficiaryName: '강부친',
        existingCompany: '대전 본사 상조',
        termsAgreed: true
      });

      expect(reg.assignedDirectorName).toContain('윤지훈'); // 대전 관할 지도사
      expect(reg.registeredAt).toBe(formatISODate());
      expect(reg.voucher.issuedAt).toBe(formatISODate());
    });
  });

  describe('5. FunnelMeasurementEngine 동적 리포트 기간 및 식별자 검증', () => {
    it('기간 미지정 시 당월 기준 동적 리포트 기간 및 연-월 식별자가 생성되어야 한다', () => {
      const report = FunnelMeasurementEngine.generatePartnerReport('fh-seoul-asan', '서울아산병원장례식장');
      const expectedYm = getCurrentYearMonth();
      const expectedPeriod = getCurrentMonthPeriod();

      expect(report.reportId).toContain(`REP-${expectedYm}`);
      expect(report.reportingPeriod).toBe(expectedPeriod);
    });
  });
});
