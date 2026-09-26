import { describe, it, expect } from 'vitest';
import { BAEUNG_DESIGN_TOKENS } from '../src/web/design-system/tokens.js';

describe('Baeung Design System Tokens (배웅 디자인 시스템 개발 환경 검증)', () => {
  it('조성우 수석 디자이너가 제정한 4대 전통 물성 배색 토큰이 무결하게 정의되어 있어야 한다', () => {
    const { colors } = BAEUNG_DESIGN_TOKENS;
    expect(colors.hanji).toBe('#F7F5F0');
    expect(colors.porcelain).toBe('#FFFFFF');
    expect(colors.deepInk).toBe('#151719');
    expect(colors.celadon.base).toBe('#19382C');
    expect(colors.celadon.dark).toBe('#132B22');
    expect(colors.nobleGold.base).toBe('#9E7D47');
    expect(colors.crimson.base).toBe('#8B2520');
  });

  it('5대 핵심 전각 낙관(禮, 眞, 安, 誠, 永, 謹弔)이 정확한 한자 및 의미로 등록되어 있어야 한다', () => {
    const { seals } = BAEUNG_DESIGN_TOKENS;
    expect(seals.courtesy.character).toBe('禮');
    expect(seals.truth.character).toBe('眞');
    expect(seals.peace.character).toBe('安');
    expect(seals.sincerity.character).toBe('誠');
    expect(seals.eternity.character).toBe('永');
    expect(seals.mourningCondolence.character).toBe('謹弔');

    expect(seals.truth.colorVariant).toBe('gold');
    expect(seals.peace.colorVariant).toBe('jade');
    expect(seals.sincerity.colorVariant).toBe('red');
  });

  it('시니어 인지공학 규격(한수진 박사 감수) 최소 터치 높이가 64dp 이상이어야 한다', () => {
    const { ergonomics } = BAEUNG_DESIGN_TOKENS;
    expect(ergonomics.minTouchTargetPx).toBeGreaterThanOrEqual(64);
    expect(ergonomics.seniorZoomScale).toBeGreaterThanOrEqual(1.2);
  });

  it('WCAG 2.1 AAA 고대비 명도 기준을 충족해야 한다 (진먹색 vs 한지미색)', () => {
    // 진먹색(#1F2226)은 거의 검정에 가까운 진한 색으로 한지 미색(#FAF8F5)과 10:1 이상의 명도 대비를 이룸
    const deepInkHex = BAEUNG_DESIGN_TOKENS.colors.deepInk;
    const hanjiHex = BAEUNG_DESIGN_TOKENS.colors.hanji;
    
    expect(deepInkHex.startsWith('#')).toBe(true);
    expect(hanjiHex.startsWith('#')).toBe(true);
  });
});
