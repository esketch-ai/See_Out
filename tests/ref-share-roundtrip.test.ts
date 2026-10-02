import { describe, it, expect } from 'vitest';
import { encodeObituary, encodeShareLink, decodeShareLink } from '../src/web/life-archive/obituaryShare.js';
import type { FuneralSetting } from '../src/life-archive/types.js';

describe('견적 참조번호(REF) 공유 왕복', () => {
  const base = { deceasedName: '고인', relation: '모' } as unknown as FuneralSetting;

  it('REF 가 링크로 인코딩되고 그대로 돌아온다', () => {
    const ref = 'REF-2026-KR-8207';
    const enc = encodeObituary({ ...base, referenceCode: ref });
    expect(enc.x).toBe(ref);
    // 브라우저는 location.hash 로 넘긴다 — 전체 URL 이 아니라 해시만
    const link = encodeShareLink({ ...base, referenceCode: ref }, 'https://x.kr');
    const dec = decodeShareLink(link.slice(link.indexOf('#')));
    expect(dec?.x).toBe(ref);
  });

  it('REF 가 없으면 필드 자체가 생기지 않는다 (가짜 번호를 만들지 않는다)', () => {
    const enc = encodeObituary(base);
    expect(enc.x).toBeUndefined();
  });

  it('조문금 계좌는 여전히 링크에 담기지 않는다', () => {
    const enc = encodeObituary({ ...base, condolenceAccount: '우리 123-45' } as FuneralSetting);
    expect(JSON.stringify(enc)).not.toContain('123-45');
  });
});
