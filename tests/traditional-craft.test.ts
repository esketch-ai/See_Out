import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

/**
 * AREA-DESIGN-2026-009 Task 9 — 헌장 기둥 3 「창호살격 (窓戶殺格)」 조형 규약 검증
 *
 * ■ 이 테스트가 막는 회귀
 *   2026-09-27 이전 `HanjiCard.tsx` 는 `k-corner-bracket` 과
 *   `k-changho-texture` 를 참조했으나 index.html 에 정의가 없었다.
 *   즉 헌장 3기둥이 문서상으로는 제정되어 있고 코드상으로는 존재하지 않는
 *   상태가 묵인 채 3개월 이상 방치되었다. 이 테스트는 그 부재를 막는다.
 */

const ROOT = process.cwd();
const HTML = readFileSync(join(ROOT, 'index.html'), 'utf8');
const CSS = HTML.slice(HTML.indexOf('<style>'), HTML.indexOf('</style>'));

function collectSourceFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...collectSourceFiles(full));
    else if (/\.tsx?$/.test(entry)) out.push(full);
  }
  return out;
}

/** 클래스 선택자 블록 전체를 잘라낸다 (중괄호 균형 기준) */
function cssBlock(selector: string): string {
  const start = CSS.indexOf(selector);
  if (start === -1) return '';
  let depth = 0;
  for (let i = CSS.indexOf('{', start); i < CSS.length; i++) {
    if (CSS[i] === '{') depth++;
    else if (CSS[i] === '}') {
      depth--;
      if (depth === 0) return CSS.slice(start, i + 1);
    }
  }
  return CSS.slice(start);
}

const sources = new Map<string, string>(
  collectSourceFiles(join(ROOT, 'src')).map((f) => [f.replace(ROOT + '/', ''), readFileSync(f, 'utf8')])
);

describe('창호살격 — 참조와 정의의 일치', () => {
  it('src/ 가 참조하는 k-* 클래스는 반드시 index.html 에 정의되어 있어야 한다', () => {
    const referenced = new Set<string>();
    for (const [file, content] of sources) {
      for (const m of content.matchAll(/\bk-[a-z0-9-]+/g)) referenced.add(m[0]);
    }
    const undefinedClasses = [...referenced]
      .filter((c) => !CSS.includes(`.${c}`))
      .sort();
    expect(
      undefinedClasses,
      '다음 클래스는 참조되지만 정의되어 있지 않습니다. 헌장 기둥이 문서에만 존재하는 상태입니다.'
    ).toEqual([]);
  });

  it('창호살격 3요소가 모두 정의되어 있어야 한다', () => {
    for (const cls of ['k-corner-bracket', 'k-corner-bracket-dark', 'k-changho-texture']) {
      expect(CSS.includes(`.${cls} {`) || CSS.includes(`.${cls} {`), cls).toBe(true);
    }
  });
});

describe('창호살격 — 조형 계층 규약', () => {
  it('귀접이와 살창은 서로 다른 가상 요소를 써야 한다 (경합 방지)', () => {
    // 2026-09-27 실측 버그: 두 클래스가 모두 ::before 를 선점해
    // 뒤에 정의된 살창이 귀접이의 inset/background-image 를 덮어썼다.
    expect(cssBlock('.k-changho-texture::after'), '살창 문양은 ::after').toContain('background-image');
    expect(cssBlock('.k-changho-texture::before'), '살창이 ::before 를 선점하면 귀접이와 상쇄된다').toBe('');
    expect(cssBlock('.k-corner-bracket::before'), '귀접이는 ::before').toContain('inset: 7px');
  });

  it('귀접이는 4모서리 레이어를 모두 선언해야 한다', () => {
    const rule = cssBlock('.k-corner-bracket::before');
    const layers = rule.split('url(').length - 1;
    expect(layers, '좌상·우상·우하·좌하 4방향 SVG 가 필요합니다').toBe(4);
    expect(rule).toContain('left top, right top, right bottom, left bottom');
    // 4방향이 모두 서로 다른 좌표여야 한다 (동일 SVG 4회 반복 아님)
    // 모서리당 외곽선 + 안쪽 이중선 = 2개 × 4모서리 = 8
    const paths = [...rule.matchAll(/ d='([^']+)'/g)].map((m) => m[1]);
    expect(paths.length, '모서리당 2선(외곽·이중) × 4모서리 = 8선').toBe(8);
    expect(new Set(paths).size, '4모서리 경로가 모두 달라야 합니다').toBe(8);
    // 좌상·우하는 대각 대칭 / 우상·좌하도 대각 대칭이어야 한다
    expect(paths[0]).toBe('M0.5 14.5V0.5h14');
    expect(paths[4]).toBe('M19.5 5.5v14h-14');
    // 각 모서리 팔요(elbow) 금점 좌표도 방향별로 달라야 한다
    const dots = [...rule.matchAll(/cx='([\d.]+)' cy='([\d.]+)' r='1\.15'/g)]
      .map((m) => `${m[1]},${m[2]}`);
    expect(new Set(dots).size, '4모서리 팔요 좌표가 모두 달라야 합니다').toBe(4);
  });

  it('귀접이는 조작을 가로채지 않아야 한다 (클릭 가능한 카드 보호)', () => {
    for (const cls of ['k-corner-bracket::before', 'k-corner-bracket-dark::before']) {
      expect(cssBlock(`.${cls}`), cls).toContain('pointer-events: none');
    }
  });

  it('금박선은 배경별로 다른 값을 써야 한다 (§3-2 ③)', () => {
    // 밝은 면 = brass.gold #9E7D47, 어두운 면 = brass.onDark #C2A26A
    const light = cssBlock('.k-corner-bracket::before');
    const dark = cssBlock('.k-corner-bracket-dark::before');
    expect(light).toContain('%239E7D47');
    expect(dark).toContain('%23C2A26A');
    expect(dark).not.toContain('%239E7D47');
  });
});

describe('창호살격 — 적용 지점', () => {
  it('정례 절차도 패널(사진 없음 · 전 면 노출)에 귀접이가 적용되어야 한다', () => {
    const normalMode = sources.get('src/web/components/NormalMode.tsx') ?? '';
    const panels = normalMode.match(/k-screen-panel k-corner-bracket/g) ?? [];
    expect(panels.length, '3일차 절차도 패널 3면').toBeGreaterThanOrEqual(3);
  });

  it('사진 히어로 카드에는 귀접이를 적용하지 않는다 (절반의 액자 방지)', () => {
    const normalMode = sources.get('src/web/components/NormalMode.tsx') ?? '';
    // 상단이 전체 폭 사진인 카드에는 4모서리가 모두 노출되지 않는다
    expect(normalMode).not.toMatch(/k-card-heritage k-corner-bracket/);
    // 살창 문양(텍스처)은 흰 여백 면에 잘 읽히므로 유지한다
    expect(normalMode).toMatch(/k-card-heritage k-changho-texture/);
  });

  it('의전 문서 면 4종에 귀접이가 적용되어야 한다 (N-10 「24px = 종이」)', () => {
    const docs = [
      'src/web/components/MemorialBookletModal.tsx',
      'src/web/components/DualStandbyModal.tsx',
      'src/web/components/CancellationClaimModal.tsx',
      'src/web/components/LossCreditVoucherModal.tsx'
    ];
    for (const file of docs) {
      const content = sources.get(file) ?? '';
      expect(content, file).toMatch(/print-booklet-page k-corner-bracket/);
      // N-10: 의전 문서 면만 radius 24px (rounded-xl=12px 전면 적용 금지)
      const pageClasses = [...content.matchAll(/print-booklet-page k-corner-bracket[^"]*/g)];
      for (const m of pageClasses) {
        expect(m[0], `${file} 문서 면 라운드`).toContain('rounded-[24px]');
        expect(m[0], `${file} rounded-xl 금지는 N-10 위반`).not.toMatch(/rounded-xl/);
      }
    }
  });

  it('어두운 바우처에는 다크 변형을 써야 한다', () => {
    const voucher = sources.get('src/web/components/LossCreditVoucherModal.tsx') ?? '';
    expect(voucher).toMatch(/print-booklet-page k-corner-bracket-dark/);
    expect(voucher).not.toMatch(/print-booklet-page k-corner-bracket /);
  });
});

describe('창호살격 — 인쇄 보존', () => {
  it('인쇄 시에도 귀접이와 살창이 유지되어야 한다', () => {
    const printBlock = CSS.slice(CSS.indexOf('@media print'));
    expect(printBlock).toContain('print-color-adjust: exact');
    expect(printBlock).toMatch(/\.k-corner-bracket::before/);
    expect(printBlock).toMatch(/\.k-changho-texture::after/);
  });
});
