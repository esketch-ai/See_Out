import { describe, it, expect } from 'vitest';
import { EgreenPostService } from '../src/legal/egreenPostService.js';
import { BiographyGenerator } from '../src/life-archive/biographyGenerator.js';
import { FunnelMeasurementEngine } from '../src/tracking/funnelMeasurementEngine.js';
import { EmergencyDispatchEngine } from '../src/emergency/index.js';
import { FuneralHallService } from '../src/funeral-halls/funeralHallService.js';
import { CancellationClaimData } from '../src/quote-diagnostics/types.js';

describe('배웅(BAEUNG) 차세대 5대 고도화 시스템 종합 실증 검증', () => {
  describe('1. 우체국 e-그린우편 원클릭 실물 내용증명 발송 엔진', () => {
    const mockClaim: CancellationClaimData = {
      claimId: 'CLM-2026-TEST-001',
      competitorId: 'comp-boram',
      competitorName: '보람상조개발(주)',
      competitorCeo: '오준오',
      competitorAddress: '서울특별시 마포구 마포대로 130',
      contractNumber: 'BR-982142',
      productName: '보람 프리미엄 490',
      contractDate: '2019년 05월 12일',
      totalContractAmount: 4900000,
      totalInstallments: 120,
      paidInstallments: 60,
      paidTotalAmount: 2450000,
      statutoryRefundAmount: 2082500,
      claimantName: '김성수',
      claimantPhone: '010-3849-2910',
      claimantAddress: '서울특별시 송파구 올림픽로 300',
      refundAccountBank: '신한은행',
      refundAccountNumber: '110-384-291028',
      refundAccountHolder: '김성수'
    };

    it('내용증명 청구서를 우체국 접수 시 13자리 바코드 및 고유 접수번호를 부여해야 한다', () => {
      const record = EgreenPostService.submitProofOfContent(mockClaim);

      expect(record.dispatchId).toMatch(/^EG-2026-\d{4}-\d{4}$/);
      expect(record.postalBarcode).toMatch(/^13\d{11}$/);
      expect(record.claimId).toBe(mockClaim.claimId);
      expect(record.status).toBe('ACCEPTED');
      expect(record.recipientName).toContain('보람상조개발');
      expect(record.officialPostOfficeSeal).toContain('우정사업본부');
    });

    it('접수번호로 발송 상태를 실시간 조회할 수 있어야 한다', () => {
      const record = EgreenPostService.submitProofOfContent(mockClaim);
      const retrieved = EgreenPostService.getDispatchStatus(record.dispatchId);

      expect(retrieved).toBeDefined();
      expect(retrieved?.dispatchId).toBe(record.dispatchId);
    });

    it('배송 진행 단계를 4단계(접수 ➔ 인쇄봉입 ➔ 등기출발 ➔ 배달완료)로 전이할 수 있어야 한다', () => {
      const record = EgreenPostService.submitProofOfContent(mockClaim);
      expect(record.status).toBe('ACCEPTED');

      const s1 = EgreenPostService.advanceStatus(record.dispatchId);
      expect(s1?.status).toBe('PRINTED_ENCLOSED');

      const s2 = EgreenPostService.advanceStatus(record.dispatchId);
      expect(s2?.status).toBe('POSTAL_DISPATCHED');

      const s3 = EgreenPostService.advanceStatus(record.dispatchId);
      expect(s3?.status).toBe('DELIVERED');
      expect(s3?.statusText).toContain('배달 완료');
    });
  });

  describe('2. AI 구술 생애 평전 자동 편찬기 (BiographyGenerator)', () => {
    it('구술 인터뷰 답변을 바탕으로 5대 챕터의 품격 있는 생애 평전을 자동 생성해야 한다', () => {
      const doc = BiographyGenerator.generateDocument({
        deceasedName: '故 김철수 님',
        birthYear: 1938,
        hometown: '경남 통영',
        careerFocus: '선박 건조 엔지니어',
        familyMembers: ['장남 김정우', '차녀 김수연', '손자 김민준'],
        motto: '“성실함에는 거짓이 없다.”',
        interviewAnswers: [
          { questionId: 'q1', spokenAnswer: '고향 바다의 푸른 물결이 눈에 선합니다.' },
          { questionId: 'q2', spokenAnswer: '조선소에서 첫 배를 띄우던 날 감격했습니다.' },
          { questionId: 'q3', spokenAnswer: '자식들이 건강하게 자라주어 고마웠습니다.' },
          { questionId: 'q4', spokenAnswer: '정직하고 형제간에 우애하며 살아라.' }
        ]
      });

      expect(doc.deceasedName).toBe('故 김철수 님');
      expect(doc.birthYear).toBe(1938);
      expect(doc.chapters).toHaveLength(5);
      expect(doc.chapters[0].title).toContain('제1장: 태동과 고향');
      expect(doc.chapters[1].title).toContain('제2장: 청춘과 도약');
      expect(doc.chapters[2].title).toContain('제3장: 사랑과 보금자리');
      expect(doc.chapters[3].title).toContain('제4장: 결실과 황혼');
      expect(doc.chapters[4].title).toContain('제5장: 마지막 당부');

      // 구술 인터뷰 답변 반영 검증
      expect(doc.chapters[0].storyContent).toContain('고향 바다의 푸른 물결');
      expect(doc.chapters[1].storyContent).toContain('조선소에서 첫 배');
      expect(doc.chapters[4].storyContent).toContain('정직하고 형제간에 우애');

      // 유가족 헌정사 및 오디오 편지 검증
      expect(doc.familyDedication).toContain('장남 김정우, 차녀 김수연, 손자 김민준');
      expect(doc.audioTribute.transcript).toBeDefined();
    });
  });

  describe('3. B2B 장례식장 파트너 비즈니스 포털 & 데이터-과금 분리', () => {
    it('제휴 장례식장 4단계 퍼널(노출 ➔ 열람 ➔ 050콜 ➔ REF) 성과를 생성해야 한다', () => {
      const report = FunnelMeasurementEngine.generatePartnerReport('fh-seoul-asan', '서울아산병원 장례식장');

      expect(report.hallId).toBe('fh-seoul-asan');
      expect(report.hallName).toBe('서울아산병원 장례식장');
      expect(report.impressions).toBeGreaterThan(0);
      expect(report.engagements).toBeGreaterThan(0);
      expect(report.substantialCalls).toBeGreaterThan(0);
      expect(report.quoteReferencesIssued).toBeGreaterThan(0);
      expect(report.billing.monthlyFee).toBe(300000);
      expect(report.billing.commissionAmount).toBe(0);
    });

    it('전국 장례식장 데이터가 정상 로드되어야 한다', () => {
      const halls = FuneralHallService.getAllHalls();
      expect(halls.length).toBeGreaterThanOrEqual(18);
      expect(halls.some((h) => h.name.includes('서울아산병원'))).toBe(true);
      expect(halls.some((h) => h.region.includes('부산'))).toBe(true);
    });
  });

  describe('4. 실시간 GPS 운구 관제 & 디지털 지출 검수표', () => {
    it('임종 지역 및 식장에 따라 전담 지도사와 차량, 동적 ETA가 정확히 매칭되어야 한다', () => {
      const match = EmergencyDispatchEngine.matchDispatch({
        deceasedLocationType: 'hospital',
        locationDetail: '서울 송파구 풍납동',
        funeralHallChoice: 'recommended',
        hallName: '서울아산병원장례식장'
      });

      expect(match.dispatchId).toMatch(/^DSP-2026-/);
      expect(match.assignedDirector).toBeDefined();
      expect(match.assignedDirector.licenseNo).toBeDefined();
      expect(match.vehicleDispatchInfo).toContain('특장 리무진');
      expect(match.distanceKm).toBeGreaterThan(0);
      expect(match.estimatedArrivalTimeFormatted).toBeDefined();
    });
  });
});
