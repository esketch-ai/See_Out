/**
 * 마이그레이션 원장 (Migration Manifest)
 *
 * AREA-DESIGN-2026-009 Task 7 — 팔레트밖 색상 정리 워크리스트.
 *
 * ■ 원칙
 *   1. `LEGACY_GRANDFATHERED` 는 **현재 상태의 스냅샷**이다. 새 색상을
 *      추가할 수 없다. 추가 자체가 테스트 실패다.
 *   2. 각 항목은 「대체 토큰」 을 선언한다. 값이 `null` 이면 의미 판정이
 *      필요한 색상으로, 임의로 대응시키지 않고 사람 검토 대상으로 남긴다.
 *   3. 출현 횟수는 파일 단위 점진 반영(`.karpathyrules` 4원칙)을 위한
 *      작업량 지표다.
 *
 * ■ 래치 (ratchet)
 *   출현 총수는 **증가할 수 없다.** 정리될 때마다 상한을 내려라.
 */

export interface LegacyEntry {
  /** 대체 토큰 경로. 의미 판정 대기 중이면 null */
  target: string | null;
  /** 출현 횟수 (측정 시점) */
  occurrences: number;
  /** 판정 근거 */
  reason: string;
  /** 접근성 위반 여부 — true 면 최우선 처리 */
  a11yViolation?: boolean;
}


export const LEGACY_GRANDFATHERED: Record<string, LegacyEntry> = {};

/**
 * 새로 발견된 색상이 추가되지 않도록 하는 래치 상한.
 *
 * 2026-09-27 최종: 0건.
 *   Task 7 착수 시점 896건 / 97종 → 전량 정리 완료.
 * 이 값은 0이며, **올릴 수 없다.** 새 색상이 필요하면
 * tokens.ts 에 정본 토큰을 먼저 정의할 것.
 */
export const LEGACY_MAX_OCCURRENCES = 0;

/** 의미 판정 대기 색상 — 2026-09-27 기준 0종 */
export function unresolvedLegacyColors(): string[] {
  return Object.entries(LEGACY_GRANDFATHERED)
    .filter(([, entry]) => entry.target === null)
    .map(([hex]) => hex);
}

/** 접근성 위반 색 — 2026-09-27 기준 0종 (전량 해소) */
export function a11yViolationColors(): string[] {
  return Object.entries(LEGACY_GRANDFATHERED)
    .filter(([, entry]) => entry.a11yViolation)
    .map(([hex]) => hex);
}
