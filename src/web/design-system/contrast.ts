/**
 * WCAG 2.1 상대 휘도 대비 산출 유틸리티
 *
 * AREA-DESIGN-2026-009 §6 대비 검증 매트릭스의 계산 근거.
 * 본 모듈은 토큰 값을 하드코딩하지 않는다 — 토큰에서 색을 읽어
 * 실제 비율을 산출하므로, 토큰이 바뀌면 검증 결과가 함께 바뀐다.
 *
 * 중재: 한수진 박사 (인지공학) · 조성우 수석디자이너 (전통시각디자인)
 */

const HEX_PATTERN = /^#[0-9A-Fa-f]{6}$/;

function assertHex(hex: string): void {
  if (!HEX_PATTERN.test(hex)) {
    throw new Error(`토큰 값은 #RRGGBB 형식이어야 합니다: ${hex}`);
  }
}

/** 8비트 채널값을 선형 광도로 변환 (WCAG 2.1 §Relative luminance) */
function linearize(channel: number): number {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

/** 상대 휘도 L = 0.2126R + 0.7152G + 0.0722B */
export function relativeLuminance(hex: string): number {
  assertHex(hex);
  const r = linearize(parseInt(hex.slice(1, 3), 16));
  const g = linearize(parseInt(hex.slice(3, 5), 16));
  const b = linearize(parseInt(hex.slice(5, 7), 16));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** 대비율 (L1 + 0.05) / (L2 + 0.05) */
export function contrastRatio(foreground: string, background: string): number {
  const a = relativeLuminance(foreground);
  const b = relativeLuminance(background);
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

export type ContrastKind = 'body' | 'large' | 'nonText';

export const WCAG_THRESHOLD = {
  /** 본문 산문 (1.4.3) */
  body: 4.5,
  /** 24px 이상 대제목 (1.4.3) */
  large: 3,
  /** 비텍스트 UI 경계 (1.4.11) */
  nonText: 3
} as const;

export type WcagGrade = 'AAA' | 'AA' | 'FAIL';

export function wcagGrade(ratio: number): WcagGrade {
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  return 'FAIL';
}

export function meetsThreshold(ratio: number, kind: ContrastKind): boolean {
  return ratio >= WCAG_THRESHOLD[kind];
}
