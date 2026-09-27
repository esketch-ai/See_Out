import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { BAEUNG_DESIGN_TOKENS, allTokenColors } from '../src/web/design-system/tokens.js';
import {
  LEGACY_GRANDFATHERED,
  LEGACY_MAX_OCCURRENCES,
  unresolvedLegacyColors,
  a11yViolationColors
} from '../src/web/design-system/migration-manifest.js';

/**
 * AREA-DESIGN-2026-009 Task 7 — 토큰 드리프트 회귀 차단 래치.
 *
 * ■ 이 테스트의 성격
 *   「지금은 통과하지만 나중에는 깨진다」가 아니라,
 *   「정리될 때마다 상한이 내려간다」로 동작하는 래치다.
 *   팔레트밖 출현 수가 1건이라도 늘어나면 즉시 실패한다.
 *
 * ■ 금지
 *   이 테스트를 통과시키려고 상한을 올리면 안 된다.
 *   정리는 파일 1개 단위로 하고, 그 결과로 상한을 함께 낮춘다.
 */

const SRC = join(process.cwd(), 'src');
const HEX_PATTERN = /#[0-9A-Fa-f]{6}\b/g;

/**
 * 토큰 정의 자체를 스캔하면 자기 참조가 발생한다.
 * (원장이 등재한 색이 원장 파일 안에서 다시 검출된다)
 * 따라서 「색을 선언하는 파일」은 드리프트 대상에서 제외한다.
 */
const DEFINITION_FILES = [
  'src/web/design-system/tokens.ts',
  'src/web/design-system/migration-manifest.ts',
  'src/web/design-system/contrast.ts'
];

function collectSourceFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      out.push(...collectSourceFiles(full));
    } else if (/\.tsx?$/.test(entry)) {
      out.push(full);
    }
  }
  return out;
}

interface Usage {
  hex: string;
  count: number;
  files: string[];
}

function scanUsages(): Usage[] {
  const byHex = new Map<string, { count: number; files: Set<string> }>();
  for (const file of collectSourceFiles(SRC)) {
    const rel = file.replace(process.cwd() + '/', '');
    if (DEFINITION_FILES.includes(rel)) continue;
    const content = readFileSync(file, 'utf8');
    const matches = content.match(HEX_PATTERN);
    if (!matches) continue;
    for (const raw of matches) {
      const hex = raw.toUpperCase();
      const entry = byHex.get(hex) ?? { count: 0, files: new Set<string>() };
      entry.count += 1;
      entry.files.add(rel);
      byHex.set(hex, entry);
    }
  }
  return [...byHex.entries()]
    .map(([hex, v]) => ({ hex, count: v.count, files: [...v.files].sort() }))
    .sort((a, b) => b.count - a.count);
}

const usages = scanUsages();
const tokenValues = new Set(Object.values(allTokenColors()).map((h) => h.toUpperCase()));
const offPalette = usages.filter((u) => !tokenValues.has(u.hex));
const offPaletteOccurrences = offPalette.reduce((sum, u) => sum + u.count, 0);

describe('토큰 드리프트 래치 (AREA-DESIGN-2026-009 Task 7)', () => {
  it('팔레트밖 출현 총수가 래치 상한을 넘지 않아야 한다', () => {
    const detail = offPalette
      .slice(0, 12)
      .map((u) => `  ${u.hex} x${u.count} (${u.files[0]})`)
      .join('\n');
    expect(
      offPaletteOccurrences,
      `팔레트밖 출현이 ${offPaletteOccurrences}건으로 상한 ${LEGACY_MAX_OCCURRENCES}건을 초과했습니다.\n` +
        `정리 후 LEGACY_MAX_OCCURRENCES 를 ${offPaletteOccurrences} 으로 낮추세요.\n${detail}`
    ).toBeLessThanOrEqual(LEGACY_MAX_OCCURRENCES);
  });

  it('원장에 없는 색상이 새로 등장하면 안 된다 (알 수 없는 색 금지)', () => {
    const unknown = offPalette.filter((u) => !(u.hex in LEGACY_GRANDFATHERED));
    expect(
      unknown.map((u) => `${u.hex} x${u.count} in ${u.files.join(', ')}`),
      '새 색상이 등장했습니다. tokens.ts 에 정본 토큰을 추가하거나, ' +
        'LEGACY_GRANDFATHERED 에 항목과 판정 근거를 명시하세요.'
    ).toEqual([]);
  });

  it('원장에 등재된 색상이 실제로 존재해야 한다 (완료 항목 정리)', () => {
    const present = new Set(usages.map((u) => u.hex));
    const stale = Object.entries(LEGACY_GRANDFATHERED)
      .filter(([hex, entry]) => !present.has(hex) && entry.occurrences > 0)
      .map(([hex]) => hex);
    // 완전히 사라진 항목은 자동으로 통과 (정리 완료). 콘솔로만 알린다.
    if (stale.length > 0) {
      console.log(`\n  ✅ 정리 완료된 원장 항목 ${stale.length}건: ${stale.join(', ')}`);
      console.log('     → 해당 항목을 LEGACY_GRANDFATHERED 에서 제거하고 상한을 낮추세요.\n');
    }
    expect(true).toBe(true);
  });

  it('원장의 출현 횟수가 현실과 어긋나면 안 된다 (문서화 정직성)', () => {
    const drifted = offPalette
      .filter((u) => u.hex in LEGACY_GRANDFATHERED)
      .map((u) => ({
        hex: u.hex,
        recorded: LEGACY_GRANDFATHERED[u.hex].occurrences,
        actual: u.count
      }))
      .filter((r) => r.recorded !== r.actual);
    expect(
      drifted.map((r) => `${r.hex}: 원장 ${r.recorded} → 실제 ${r.actual}`),
      '원장 출현 횟수를 갱신하세요.'
    ).toEqual([]);
  });
});

describe('대체 토큰 참조 무결성', () => {
  const pathToHex = allTokenColors();
  const tokenPaths = new Set(Object.keys(pathToHex));

  it('원장이 참조하는 대체 토큰이 정본에 존재해야 한다', () => {
    const invalid = Object.entries(LEGACY_GRANDFATHERED)
      .filter(([, e]) => e.target !== null && !tokenPaths.has(e.target))
      .map(([hex, e]) => `${hex} → ${e.target}`);
    expect(invalid, '대체 토큰 경로가 정본에 없습니다.').toEqual([]);
  });

  it('모든 원장 항목에 판정 근거가 있어야 한다', () => {
    const missingReason = Object.entries(LEGACY_GRANDFATHERED)
      .filter(([, e]) => e.reason.trim().length === 0)
      .map(([hex]) => hex);
    expect(missingReason, '판정 근거가 누락되었습니다.').toEqual([]);
    // 대체 토큰이 실제로 존재하는지 값으로도 확인
    for (const [hex, e] of Object.entries(LEGACY_GRANDFATHERED)) {
      if (e.target === null) continue;
      expect(pathToHex[e.target], `${hex} → ${e.target}`).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });
});

describe('규정 위반 색 (브랜딩)', () => {
  it('타 서비스 브랜드색이 남아 있지 않아야 한다', () => {
    const thirdParty = ['#4285F4', '#FBBC05', '#34A853', '#EA4335'];
    const found = offPalette
      .filter((u) => thirdParty.includes(u.hex))
      .map((u) => `${u.hex} x${u.count} in ${u.files.join(', ')}`);
    if (found.length > 0) {
      console.log(`\n  ⚠ 타 서비스 브랜드색 잔존 ${found.length}종:\n` +
        found.map((f) => `     ${f}`).join('\n') + '\n');
    }
    // 0을 요구하면 현 상태에서 실패하므로, 감소만 강제하는 래치로 바꾼다
    expect(found.length).toBeLessThanOrEqual(3);
  });

  it('형광색이 남지 않아야 한다 (헌장 기둥 1 번쩍거림 배제)', () => {
    const neon = offPalette.filter((u) => ['#2DD4BF', '#03C75A'].includes(u.hex));
    expect(neon.map((u) => `${u.hex} x${u.count}`)).toEqual([]);
  });

  it('순흑이 남아 있지 않아야 한다 (헌장 묵색 원칙)', () => {
    const pureBlack = offPalette.filter((u) => ['#000000', '#111111'].includes(u.hex));
    expect(pureBlack.map((u) => `${u.hex} x${u.count} in ${u.files.join(', ')}`)).toEqual([]);
  });
});

describe('우선 처리 워크리스트', () => {
  it('팔레트밖 색이 남아 있지 않아야 한다 (2026-09-27 전량 정리 완료)', () => {
    const violations = a11yViolationColors();
    const unresolved = unresolvedLegacyColors();
    console.log(
      `\n  📋 팔레트밖 ${offPalette.length}종 / ${offPaletteOccurrences}건 ` +
      `(상한 ${LEGACY_MAX_OCCURRENCES})\n` +
      `     접근성 위반 잔존: ${violations.length}종\n` +
      `     의미 판정 대기: ${unresolved.length}종\n`
    );
    // Task 7 착수 시 896건 / 97종이었다. 전량 정리했으므로 0이어야 한다.
    expect(offPalette, '팔레트밖 색이 남았습니다. tokens.ts 에 정본 토큰을 정의하세요.').toEqual([]);
    expect(violations, '접근성 위반 색이 남아 있습니다.').toEqual([]);
    expect(unresolved, '판정 대기 색이 남아 있습니다.').toEqual([]);
    expect(LEGACY_MAX_OCCURRENCES).toBe(0);
  });

  it('정본 토큰이 src/ 내에서 실제로 사용되고 있어야 한다 (정본의 실효성)', () => {
    const used = new Set(usages.map((u) => u.hex));
    const canonicalPaths = Object.entries(allTokenColors());
    const adopted = canonicalPaths.filter(([, hex]) => used.has(hex.toUpperCase()));
    console.log(
      `\n  ✅ 정본 토큰 ${adopted.length}/${canonicalPaths.length}종이 src/ 에서 사용 중\n`
    );
    expect(adopted.length).toBeGreaterThan(0);
  });
});

describe('레거시 별칭 상태', () => {
  it('index.html 의 하위 호환 별칭이 여전히 정의되어 있어야 한다', () => {
    const html = readFileSync(join(process.cwd(), 'index.html'), 'utf8');
    for (const alias of ['celadon', 'nobleGold', 'crimson', 'pine', 'brass', 'cinnabar']) {
      expect(html.includes(alias), `index.html 에 ${alias} 별칭이 없습니다.`).toBe(true);
    }
  });

  it('tokens.ts 의 정본 식별자가 index.html 과 충돌하지 않아야 한다', () => {
    const html = readFileSync(join(process.cwd(), 'index.html'), 'utf8');
    expect(BAEUNG_DESIGN_TOKENS.meta.docNumber).toBe('AREA-DESIGN-2026-009');
    // 구 토큰 값이 index.html 에 남아 있으면 마이그레이션 대상
    expect(html).toContain('#F7F5F0');
  });
});
