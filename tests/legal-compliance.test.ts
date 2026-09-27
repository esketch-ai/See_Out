import { describe, it, expect } from 'vitest';
import { LegalService } from '../src/legal/index.js';

describe('LegalService & Statutory Compliance (법률 약관 및 컴플라이언스 체계)', () => {
  it('5대 핵심 법률 약관 규정이 모두 등록되어 있어야 한다', () => {
    const docs = LegalService.getAllDocuments();
    expect(docs.length).toBe(5);

    const types = docs.map(d => d.type);
    expect(types).toContain('PRIVACY_POLICY');
    expect(types).toContain('TERMS_OF_SERVICE');
    expect(types).toContain('LOCATION_TERMS');
    expect(types).toContain('OPT_OUT_REGULATION');
    expect(types).toContain('DIGITAL_LEGACY_POLICY');
  });

  it('개인정보 처리방침에 통신비밀보호법 제3조 및 통화 녹음 미실시가 명시되어 있어야 한다', () => {
    const privacy = LegalService.getDocumentByType('PRIVACY_POLICY');
    expect(privacy).toBeDefined();
    expect(privacy?.legalCounselReview).toContain('30년');

    const searchResult = LegalService.searchLegalContent('통신비밀보호법');
    expect(searchResult.length).toBeGreaterThan(0);
    expect(searchResult.some(r => r.snippet.includes('음성 통화 내용을 녹음') && r.snippet.includes('하지 않으며'))).toBe(true);
  });

  it('서비스 이용약관에 공정위 2026.03 리베이트 철폐 및 알선 수수료 0원 원칙이 명시되어 있어야 한다', () => {
    const terms = LegalService.getDocumentByType('TERMS_OF_SERVICE');
    expect(terms).toBeDefined();

    const searchResult = LegalService.searchLegalContent('리베이트');
    expect(searchResult.length).toBeGreaterThan(0);
    expect(searchResult.some(r => r.snippet.includes('2026년 3월') || r.snippet.includes('알선 성공보수'))).toBe(true);
  });

  it('디지털 유산 사후 승계 규약에 민법 제1060조 유언과의 구별 및 법적 효력 한계가 명시되어 있어야 한다', () => {
    const legacy = LegalService.getDocumentByType('DIGITAL_LEGACY_POLICY');
    expect(legacy).toBeDefined();

    const searchResult = LegalService.searchLegalContent('민법');
    expect(searchResult.length).toBeGreaterThan(0);
    expect(searchResult.some(r => r.snippet.includes('제1060조'))).toBe(true);
  });

  it('5대 법률 준수 매트릭스가 모두 VERIFIED_COMPLIANT 상태여야 한다', () => {
    const matrix = LegalService.getStatutoryComplianceSummary();
    expect(matrix.length).toBe(5);
    for (const item of matrix) {
      expect(item.status).toBe('VERIFIED_COMPLIANT');
    }
  });
});
