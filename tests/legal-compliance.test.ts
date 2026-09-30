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

  it('공공데이터 이용 및 옵트아웃 운영 규정에 공공누리 제1유형 및 e하늘 공시일 명시 원칙이 규정되어 있어야 한다', () => {
    const optOutDoc = LegalService.getDocumentByType('OPT_OUT_REGULATION');
    expect(optOutDoc).toBeDefined();

    const searchResult = LegalService.searchLegalContent('공공누리');
    expect(searchResult.length).toBeGreaterThan(0);
    expect(searchResult.some(r => r.snippet.includes('제1유형') && r.snippet.includes('출처표시'))).toBe(true);

    const snapshotResult = LegalService.searchLegalContent('snapshotDate');
    expect(snapshotResult.length).toBeGreaterThan(0);
  });

  it('개인정보 처리방침에 통비법 시행령 제41조의2(6개월 보관) 및 데이터-과금 분리 원칙이 명시되어 있어야 한다', () => {
    const privacy = LegalService.getDocumentByType('PRIVACY_POLICY');
    expect(privacy).toBeDefined();

    const decreeResult = LegalService.searchLegalContent('제41조의2');
    expect(decreeResult.length).toBeGreaterThan(0);
    expect(decreeResult.some(r => r.snippet.includes('6개월간 보관'))).toBe(true);

    const separationResult = LegalService.searchLegalContent('데이터-과금 분리');
    expect(separationResult.length).toBeGreaterThan(0);
  });

  it('서비스 이용약관에 비제휴 중립 디렉터리 성격 및 계약 주체와 면책 원칙이 명시되어 있어야 한다', () => {
    const terms = LegalService.getDocumentByType('TERMS_OF_SERVICE');
    expect(terms).toBeDefined();

    const searchResult = LegalService.searchLegalContent('비제휴 중립 디렉터리');
    expect(searchResult.length).toBeGreaterThan(0);
    expect(searchResult.some(r => r.snippet.includes('공공누리 제1유형'))).toBe(true);
  });

  it('7대 법률 준수 매트릭스가 모두 VERIFIED_COMPLIANT 상태여야 한다', () => {
    const matrix = LegalService.getStatutoryComplianceSummary();
    expect(matrix.length).toBe(7);
    for (const item of matrix) {
      expect(item.status).toBe('VERIFIED_COMPLIANT');
    }
    const lawNames = matrix.map(m => m.lawName);
    expect(lawNames).toContain('공공데이터법 및 저작권법');
    expect(lawNames).toContain('전기통신사업법 및 통비법 시행령');
  });
});
