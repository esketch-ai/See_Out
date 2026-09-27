import { describe, it, expect } from 'vitest';
import { BAEUNG_DESIGN_TOKENS, tokenColor, allTokenColors } from '../src/web/design-system/tokens.js';
import { contrastRatio, wcagGrade, WCAG_THRESHOLD } from '../src/web/design-system/contrast.js';

/**
 * AREA-DESIGN-2026-009 §6 대비 검증 매트릭스의 실행 검증.
 *
 * 이 테스트는 토큰 값을 하드코딩하지 않는다 — 토큰에서 읽어 실제 비율을
 * 산출한다. 토큰이 바뀌면 검증 결과가 함께 바뀌므로, 「문서는 통과하는데
 * 코드는 어긋난다」는 상태가 구조적으로 불가능하다.
 */

const T = BAEUNG_DESIGN_TOKENS;
const hanji = tokenColor('hanji.DEFAULT');
const porcelain = tokenColor('porcelain');
const dark = tokenColor('mourning.DEFAULT');

describe('AREA-DESIGN-2026-009 토큰 정본 무결성', () => {
  it('정본 문서 식별자와 승인 상태가 기록되어 있어야 한다', () => {
    expect(T.meta.docNumber).toBe('AREA-DESIGN-2026-009');
    expect(T.meta.status).toBe('Approved');
    expect(T.meta.approvedOn).toBe('2026-09-27');
  });

  it('단청 비취록 3단계가 H 157~159° 동일 축 위에서 배정되어야 한다 (재위상 기법)', () => {
    expect(T.colors.celadon.deep).toBe('#19382C');
    expect(T.colors.celadon.DEFAULT).toBe('#243F35');
    expect(T.colors.celadon.mid).toBe('#2D4F43');
    // 3개 값 모두 폐기되지 않고 단계로 배정되었음을 흰글자 대비로 확인
    for (const step of ['deep', 'DEFAULT', 'mid'] as const) {
      expect(contrastRatio(porcelain, tokenColor(`celadon.${step}`))).toBeGreaterThanOrEqual(7);
    }
  });

  it('인주홍은 밝은 면 전용이며 묵흑면 사용이 금지되어야 한다 (통치 N-4)', () => {
    expect(T.colors.cinnabar.DEFAULT).toBe('#8B2520');
    expect(contrastRatio(hanji, T.colors.cinnabar.DEFAULT)).toBeGreaterThanOrEqual(7);
    // 묵흑면에서 인주홍은 전무 — 그래서 밝은 변형이 별도로 존재한다
    expect(contrastRatio(dark, T.colors.cinnabar.DEFAULT)).toBeLessThan(WCAG_THRESHOLD.body);
    expect(contrastRatio(dark, T.colors.cinnabar.onDark)).toBeGreaterThanOrEqual(WCAG_THRESHOLD.body);
    expect(contrastRatio(dark, T.colors.cinnabar.onDarkStrong)).toBeGreaterThanOrEqual(7);
  });

  it('황동금은 장색(装饰)과 정보색(信息)이 분리되어야 한다 (통치 N-3)', () => {
    // brass.gold 는 장식·대제목 전용이라 본문 기준에 미달한다
    expect(contrastRatio(hanji, T.colors.brass.gold)).toBeLessThan(WCAG_THRESHOLD.body);
    // 본문 텍스트는 brass.text 를 써야 한다
    expect(contrastRatio(hanji, T.colors.brass.text)).toBeGreaterThanOrEqual(WCAG_THRESHOLD.body);
  });

  it('각주색이 WCAG AA 본문 기준을 충족해야 한다 (구 #727782·#6C757D 는 미달)', () => {
    expect(T.colors.ink.muted).toBe('#5A5E66');
    expect(contrastRatio(hanji, T.colors.ink.muted)).toBeGreaterThanOrEqual(WCAG_THRESHOLD.body);
  });

  it('금박선은 배경별로 별개 토큰이어야 한다 (백자면 2.42:1 로 불가시)', () => {
    expect(contrastRatio(porcelain, T.colors.brass.onDark)).toBeLessThan(WCAG_THRESHOLD.nonText);
    expect(contrastRatio(dark, T.colors.brass.onDark)).toBeGreaterThanOrEqual(7);
    expect(contrastRatio(porcelain, T.colors.brass.onLight)).toBeGreaterThanOrEqual(WCAG_THRESHOLD.nonText);
  });

  it('컨트롤 경계만 1.4.11 3:1 을 충족해야 한다 (§5.2)', () => {
    expect(contrastRatio(hanji, T.colors.control.border)).toBeGreaterThanOrEqual(WCAG_THRESHOLD.nonText);
    expect(contrastRatio(porcelain, T.colors.control.border)).toBeGreaterThanOrEqual(WCAG_THRESHOLD.nonText);
  });
});

describe('평시 모드 본문 대비 (AREA-DESIGN-2026-009 §6-1)', () => {
  const bodyPairs: Array<[string, string, 'body' | 'large']> = [
    ['주 본문', 'ink.DEFAULT', 'body'],
    ['보조 본문', 'ink.light', 'body'],
    ['각주', 'ink.muted', 'body'],
    ['브랜드 텍스트', 'celadon.DEFAULT', 'body'],
    ['황동 본문', 'brass.text', 'body'],
    ['인장·긴급', 'cinnabar.DEFAULT', 'body']
  ];

  it.each(bodyPairs)('%s 은(는) 한지면 임계치를 충족해야 한다', (_label, path, kind) => {
    const ratio = contrastRatio(hanji, tokenColor(path as never));
    expect(ratio).toBeGreaterThanOrEqual(WCAG_THRESHOLD[kind]);
  });
});

describe('역전 대비 — 흰 글자 on 어두운 면 (§6-2)', () => {
  it.each([
    ['주 버튼', 'celadon.DEFAULT'],
    ['인장 면', 'celadon.deep'],
    ['인장 면', 'cinnabar.DEFAULT'],
    ['다크 버튼', 'ink.DEFAULT']
  ] as Array<[string, string]>)('%s (%s) 은 AAA 여야 한다', (_label, path) => {
    expect(contrastRatio(porcelain, tokenColor(path as never))).toBeGreaterThanOrEqual(7);
  });
});

describe('묵흑 면 대비 — 비상 모드 (§6-3)', () => {
  it.each([
    ['본문', 'ink.onDark'],
    ['금박선', 'brass.onDark'],
    ['긴급 경고', 'cinnabar.onDark'],
    ['긴급 강조', 'cinnabar.onDarkStrong']
  ] as Array<[string, string]>)('%s (%s) 는 기준을 충족해야 한다', (_label, path) => {
    expect(contrastRatio(dark, tokenColor(path as never))).toBeGreaterThanOrEqual(WCAG_THRESHOLD.body);
  });
});

describe('타이포·인체공학 규격 (§4)', () => {
  it('본문 표준이 18px 이상이어야 한다 (구 17px 폐지)', () => {
    expect(T.typography.fontSizePx.body).toBeGreaterThanOrEqual(18);
    expect(T.typography.fontSizePx.bodyLarge).toBeGreaterThanOrEqual(20);
  });

  it('24px 산문이 금지되도록 단계가 분리되어야 한다 (§4-1 / N-8)', () => {
    const { fontSizePx } = T.typography;
    // 라벨 구간은 20px 이상, 산문 구간은 24px 미만
    expect(fontSizePx.body).toBeLessThan(24);
    expect(fontSizePx.bodyLarge).toBeLessThan(24);
    expect(fontSizePx.title).toBeGreaterThanOrEqual(24);
  });

  it('터치 타깃 주값이 64px 이상이어야 한다 (N-6)', () => {
    expect(T.ergonomics.minTouchTargetPx).toBeGreaterThanOrEqual(64);
    expect(T.ergonomics.denseTouchTargetPx).toBeGreaterThanOrEqual(56);
    expect(T.ergonomics.minTouchTargetAAPx).toBeGreaterThanOrEqual(44);
  });

  it('전역 돋보기가 125% 이어야 한다 (구 122% 폐기)', () => {
    expect(T.ergonomics.seniorZoomScale).toBe(1.25);
  });

  it('카드 라운드 24px 가 문서 면에만 존재해야 한다 (N-10)', () => {
    expect(T.radius.card).toBeLessThan(T.radius.document);
    expect(T.radius.document).toBe(24);
  });
});

describe('전각 낙관 6봉인 (§7)', () => {
  it('헌장 5대 + 謹弔 이 모두 등록되어야 한다', () => {
    const chars = Object.values(T.seals).map((s) => s.character);
    expect(chars).toEqual(['禮', '眞', '安', '誠', '永', '謹弔']);
  });

  it('각 인장에 의미와 색상 배분이 있어야 한다', () => {
    for (const [key, seal] of Object.entries(T.seals)) {
      expect(seal.hanja.length, key).toBeGreaterThan(0);
      expect(seal.meaning.length, key).toBeGreaterThan(0);
      expect(['red', 'gold', 'jade'], key).toContain(seal.colorVariant);
    }
  });
});

describe('토큰 열거 무결성', () => {
  it('모든 토큰 색이 #RRGGBB 형식이어야 한다', () => {
    for (const [path, hex] of Object.entries(allTokenColors())) {
      expect(hex, path).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });

  it('대비 계산기가 형식 오류를 거부해야 한다', () => {
    expect(() => contrastRatio('#FFF', hanji)).toThrow();
    expect(() => contrastRatio('rgb(0,0,0)', hanji)).toThrow();
  });

  it('동일 색끼리는 1:1 로 산출되어야 한다', () => {
    expect(contrastRatio(hanji, hanji)).toBeCloseTo(1, 5);
    expect(wcagGrade(1)).toBe('FAIL');
    expect(wcagGrade(7)).toBe('AAA');
    expect(wcagGrade(4.5)).toBe('AA');
  });
});

describe('색상 토큰 제정 기록 (Task 7 실행분)', () => {
  it('어두운 면 보조 2종이 역할로 분리되어 있어야 한다', () => {
    // 한랭(기능적 묵흑) vs 온기(의전적 묵흑) — 같은 역할처럼 보이지만 구분된다
    expect(T.colors.ink.mutedOnDark).toBe('#8A929D');
    expect(T.colors.ink.mutedCeremonial).toBe('#A69E8F');
    // 금박과 색조가 겹치지 않아야 「라벨:값」 위계가 산다
    expect(contrastRatio(T.colors.brass.onDark, T.colors.ink.mutedOnDark))
      .toBeLessThan(2);
  });

  it('묵흑면 보조 2종이 모두 어두운 면 4종에서 AA 를 충족해야 한다', () => {
    const darks = ['mourning.DEFAULT', 'mourning.slate', 'mourning.ink'] as const;
    for (const key of ['mutedOnDark', 'mutedCeremonial'] as const) {
      for (const bg of darks) {
        const ratio = contrastRatio(tokenColor(`ink.${key}`), tokenColor(bg));
        expect(ratio, `ink.${key} on ${bg}`).toBeGreaterThanOrEqual(WCAG_THRESHOLD.body);
      }
    }
  });

  it('묵흑면 장식 보조선이 유일한 값으로 수렴되어야 한다', () => {
    // 「온기 있는 묵색」 9색이 H34~42° 동일 축으로 흩어져 있었으나 한 값으로
    expect(T.colors.ink.borderOnDark).toBe('#3D382E');
    for (const bg of ['mourning.DEFAULT', 'mourning.slate', 'mourning.ink'] as const) {
      const ratio = contrastRatio(T.colors.ink.borderOnDark, tokenColor(bg));
      // 장식선은 1.4.11 비적용이나 「보이지 않는」 수준(1.3:1 이하)은 결함이다
      expect(ratio, `borderOnDark on ${bg}`).toBeGreaterThan(1.35);
    }
  });

  it('금박 배경 위 텍스트는 먹색이어야 한다 (흰 글자 3.83:1 로 미달)', () => {
    expect(contrastRatio('#FFFFFF', T.colors.brass.gold))
      .toBeLessThan(WCAG_THRESHOLD.body);
    expect(contrastRatio(T.colors.ink.DEFAULT, T.colors.brass.gold))
      .toBeGreaterThanOrEqual(WCAG_THRESHOLD.body);
  });

  it('어두운 비취 면 보조문자가 배너 대비 AA 를 충족해야 한다', () => {
    expect(T.colors.celadon.muted).toBe('#A8B2A9');
    expect(contrastRatio(T.colors.celadon.muted, T.colors.celadon.deep))
      .toBeGreaterThanOrEqual(WCAG_THRESHOLD.body);
  });
});
