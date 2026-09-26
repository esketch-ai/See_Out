import { describe, it, expect } from 'vitest';
import { VisionOcrParser } from '../src/quote-diagnostics/index.js';

describe('VisionOcrParser (상조 계약 증서 비전 텍스트 파싱 엔진)', () => {
  it('보람상조 프리미엄 450 실물 증서 샘플을 100% 정확하게 인식해야 한다', () => {
    const rawText = VisionOcrParser.PRESET_SAMPLES.boram450.sampleText;
    const result = VisionOcrParser.parseRawText(rawText);

    expect(result.isSuccess).toBe(true);
    expect(result.certificate.competitorName).toContain('보람');
    expect(result.certificate.totalContractAmount).toBe(4_500_000);
    expect(result.certificate.totalInstallments).toBe(150);
    expect(result.certificate.paidInstallments).toBe(42);
    expect(result.certificate.monthlyPayment).toBe(30_000);
    expect(result.certificate.paidTotalAmount).toBe(1_260_000);
    expect(result.certificate.hasMaturityRefund100).toBe(false);
  });

  it('프리드라이프 늘푸른 590 실물 증서 샘플을 100% 정확하게 인식해야 한다', () => {
    const rawText = VisionOcrParser.PRESET_SAMPLES.preed590.sampleText;
    const result = VisionOcrParser.parseRawText(rawText);

    expect(result.isSuccess).toBe(true);
    expect(result.certificate.competitorName).toContain('프리드');
    expect(result.certificate.totalContractAmount).toBe(5_900_000);
    expect(result.certificate.totalInstallments).toBe(120);
    expect(result.certificate.paidInstallments).toBe(80);
    expect(result.certificate.paidTotalAmount).toBe(result.certificate.monthlyPayment * 80);
  });

  it('현대라이프 만기 100% 환급 특약 증서를 올바르게 식별해야 한다', () => {
    const rawText = VisionOcrParser.PRESET_SAMPLES.hyundai480.sampleText;
    const result = VisionOcrParser.parseRawText(rawText);

    expect(result.isSuccess).toBe(true);
    expect(result.certificate.hasMaturityRefund100).toBe(true);
    expect(result.certificate.totalContractAmount).toBe(4_800_000);
    expect(result.certificate.paidInstallments).toBe(100);
  });

  it('줄바꿈이나 노이즈가 있는 비정형 사용자 입력에서도 핵심 수치를 강건하게 추출해야 한다', () => {
    const noisyText = '장롱에서 찾은 보람상조 영수증인데 계약금액: 450만원이고 42/150회 납입완료되어 있습니다.';
    const result = VisionOcrParser.parseRawText(noisyText);

    expect(result.isSuccess).toBe(true);
    expect(result.certificate.competitorName).toContain('보람');
    expect(result.certificate.totalContractAmount).toBe(4_500_000);
    expect(result.certificate.paidInstallments).toBe(42);
    expect(result.certificate.totalInstallments).toBe(150);
  });
});
