import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * AREA-DESIGN-2026-009 Task 10 — 모달 접근성 계약 검증
 *
 * ■ 이 테스트가 막는 회귀 (2026-09-27 실측)
 *   1. 포커스 트랩 0건, ESC 미작동 6/7 — `title="닫기 (ESC)"` 라는
 *      문구만 있고 키보드 사용자에게 실제 수단이 없었다.
 *   2. stopPropagation 회귀 — 공용 셸이 React 루트에서 stopPropagation 을
 *      걸어, 그 아래의 네이티브 window ESC 리스너(빈소 키오스크)를 차단했다.
 *      Playwright 검증에서 ESC 가 닫히지 않는 것으로 발견·수정했다.
 *      「ESC 가 조용히 죽는」 유형은 로그도 남지 않아, 계약으로 고정한다.
 */

const ROOT = process.cwd();
const read = (p: string) => readFileSync(join(ROOT, p), 'utf8');

const SHELL = read('src/web/components/ModalShell.tsx');
const KIOSK = read('src/web/components/AltarKioskModal.tsx');

/** ModalShell 로 전환된 모달 */
const SHELL_MODALS = [
  'src/web/components/MemorialBookletModal.tsx',
  'src/web/components/DualStandbyModal.tsx',
  'src/web/components/CancellationClaimModal.tsx',
  'src/web/components/LossCreditVoucherModal.tsx',
  'src/web/components/LifeArchiveWidget.tsx',
  'src/web/components/PackagePricingWidget.tsx'
] as const;

describe('공용 모달 셸 — 계약', () => {
  it('포커스 트랩 가능 요소 선택자를 갖추어야 한다', () => {
    expect(SHELL).toContain('a[href]');
    expect(SHELL).toContain('button:not([disabled])');
    expect(SHELL).toContain('input:not([disabled]');
    expect(SHELL).toContain('tabindex]:not([tabindex="-1"])');
  });

  it('Tab 경계에서 포커스를 되감아야 한다', () => {
    expect(SHELL).toContain('e.preventDefault()');
    expect(SHELL).toMatch(/shiftKey[\s\S]{0,200}last\.focus\(\)/);
    expect(SHELL).toMatch(/!e\.shiftKey[\s\S]{0,120}first\.focus\(\)/);
  });

  it('닫힐 때 포커스를 원래 위치로 복귀시켜야 한다', () => {
    expect(SHELL).toContain('restoreRef');
    expect(SHELL).toContain('document.activeElement');
    expect(SHELL).toMatch(/document\.contains\(target\)/);
  });

  it('대화형 시맨틱을 갖추어야 한다', () => {
    expect(SHELL).toContain('role="dialog"');
    expect(SHELL).toContain('aria-modal="true"');
    expect(SHELL).toContain('aria-labelledby');
    expect(SHELL).toContain('aria-describedby');
  });

  it('배경 스크롤을 잠그고 해제해야 한다', () => {
    // lockCount 는 모듈 레벨이어야 한다. 인스턴스 로컬이면 모달이 여러 개
    // 중첩될 때 하나가 닫혀도 잠금이 풀린다.
    expect(SHELL).toMatch(/^let lockCount = 0;$/m);
    expect(SHELL).toMatch(/if \(lockCount === 0\) \{\s*lockPrevOverflow = body\.style\.overflow/);
    // 마지막 하나가 닫힐 때만 원래 값으로 복원한다
    expect(SHELL).toMatch(
      /lockCount = Math\.max\(0, lockCount - 1\);[\s\S]{0,200}lockCount === 0[\s\S]{0,240}body\.style\.overflow = lockPrevOverflow/
    );
    expect(SHELL).toContain('removeAttribute(SCROLL_LOCK_ATTR)');
  });

  it('모달이 닫히면 잠금이 실제로 풀려야 한다 (useModalA11y 는 active 를 받는다)', () => {
    // isOpen 을 모듈에 알리지 못하면 「언마운트가 아니라 재렌더」가 되어
    // cleanup 이 호출되지 않고 body 잠금이 남는다.
    expect(SHELL).toMatch(/export function useModalA11y\(onClose: \(\) => void, active = true/);
    expect(SHELL).toMatch(/useBodyScrollLock\(active\);/);
  });

  it('조건을 만족할 때까지 포커스 이동을 미뤄야 한다 (조건부 렌더링 모달)', () => {
    // isOpen 이 true 로 바뀐 직후에는 ref 가 아직 null 이다. 이때 포커스를 트리거
    // 버튼에 남겨두면 ESC 가 닫지 못하고, Tab 이 배경으로 이탈한다.
    expect(SHELL).toMatch(/if \(!panel\) \{\s*rafId = requestAnimationFrame\(focusFirst\)/);
    expect(SHELL).toContain('cancelAnimationFrame(rafId)');
  });

  it('닫기 단추에 「닫기 (ESC)」 문구와 접근성 이름을 부여해야 한다', () => {
    expect(SHELL).toContain('aria-label={closeLabel}');
    expect(SHELL).toContain('${closeLabel} (ESC)');
  });
});

describe('stopPropagation 회귀 차단', () => {
  it('자체 ESC 계층이 없는 경우에만 전파를 막아야 한다', () => {
    // React 17+ 는 루트 컨테이너에 리스너를 두므로 여기서 stopPropagation 을 걸면
    // 하위 네이티브 window 리스너가 죽는다. onEscape 유무로 게이트해야 한다.
    expect(SHELL).toMatch(
      /if \(onEscape\) \{\s*e\.stopPropagation\(\);\s*onEscape\(\);/
    );
    expect(SHELL).not.toMatch(/e\.key === 'Escape'\) \{\s*e\.stopPropagation\(\);\s*onEscape\?\.\(\);/);
  });

  it('키오스크는 자체 window ESC 계층을 유지해야 한다', () => {
    expect(KIOSK).toContain("window.addEventListener('keydown'");
    // 2단계 처리: 전체화면 해제 → 닫기
    expect(KIOSK).toMatch(/document\.fullscreenElement[\s\S]{0,120}exitFullscreen[\s\S]{0,120}onClose\(\)/);
  });

  it('키오스크는 트랩 훅에 onEscape 를 넘기지 않아야 한다 (ESC 위임 안 함)', () => {
    expect(KIOSK).toMatch(/useDialogFocus\(true, undefined\)/);
  });

  it('키오스크도 대화형 시맨틱을 갖추어야 한다', () => {
    expect(KIOSK).toContain('role="dialog"');
    expect(KIOSK).toContain('aria-modal="true"');
    expect(KIOSK).toContain('aria-label="빈소 헌정 키오스크');
  });
});

describe('모달 6종의 셸 적용', () => {
  it.each(SHELL_MODALS)('%s 은 ModalShell 을 사용해야 한다', (file) => {
    const src = read(file);
    expect(src, file).toContain('<ModalShell');
    expect(src, file).toContain('</ModalShell>');
    expect(src, file).toMatch(/<ModalToolbar/);
  });

  it.each(SHELL_MODALS)('%s 은 접근성 이름 id 를 제공해야 한다', (file) => {
    const src = read(file);
    expect(src, file).toMatch(/titleId="[a-z-]+"/);
    // titleId 는 셸과 툴바 양쪽에 동일하게 실려야 aria 연결이 성립한다
    const ids = [...src.matchAll(/titleId="([a-z-]+)"/g)].map((m) => m[1]);
    expect(new Set(ids).size, `${file} titleId 중복 (${ids.join(',')})`).toBe(1);
  });

  it.each(SHELL_MODALS)('%s 에 남은 「닫기 (ESC)」 라는 거짓 문구가 없어야 한다', (file) => {
    // ESC 가 실제로 동작하므로, X 단추에 그 문구를 직접 적을 필요가 없다
    const src = read(file);
    const manualEsc = src.match(/title="닫기 \(ESC\)"/g);
    expect(manualEsc, `${file} 에 수동 ESC 문구 ${manualEsc?.length ?? 0}건 잔존`).toBeNull();
  });

  it('셸을 쓰지 않는 유일한 모달은 키오스크여야 한다', () => {
    const all = [
      'src/web/components/MemorialBookletModal.tsx',
      'src/web/components/DualStandbyModal.tsx',
      'src/web/components/CancellationClaimModal.tsx',
      'src/web/components/LossCreditVoucherModal.tsx',
      'src/web/components/AltarKioskModal.tsx',
      'src/web/components/LifeArchiveWidget.tsx',
      'src/web/components/PackagePricingWidget.tsx'
    ];
    const legacy = all.filter((f) => !read(f).includes('<ModalShell'));
    expect(legacy, `셸 미적용: ${legacy.join(', ')}`).toEqual(['src/web/components/AltarKioskModal.tsx']);
  });

  it('오버레이 클릭으로 문서가 닫히지 않아야 한다 (의전 문서 유실 방지)', () => {
    expect(SHELL).toMatch(/e\.target === e\.currentTarget\) e\.preventDefault\(\)/);
  });
});

describe('타이포그래피 하한 (통치 N-7)', () => {
  it('공용 셸이 11px 를 쓰지 않아야 한다 (micro 하한 13px)', () => {
    expect(SHELL).not.toContain('text-[11px]');
  });
});

describe('타이포그래피 하한 — N-7 (Task 10)', () => {
  const MIN_PX = 13;

  it('micro 하한 13px 미만 임의 폰트가 없어야 한다', () => {
    const { readdirSync, statSync } = require('node:fs') as typeof import('node:fs');
    const walk = (dir: string): string[] =>
      readdirSync(dir).flatMap((e) => {
        const f = join(dir, e);
        return statSync(f).isDirectory() ? walk(f) : /\.tsx?$/.test(e) ? [f] : [];
      });
    const offenders: string[] = [];
    for (const f of walk(join(ROOT, 'src'))) {
      const src = readFileSync(f, 'utf8');
      for (const m of src.matchAll(/text-\[(\d+)px\]/g)) {
        if (Number(m[1]) < MIN_PX) {
          offenders.push(`${f.replace(ROOT + '/', '')}: text-[${m[1]}px]`);
        }
      }
    }
    expect(offenders, `통치 N-7 위반 (최소 ${MIN_PX}px):\n  ${offenders.join('\n  ')}`).toEqual([]);
  });
});

describe('클릭 가능 요소의 시맨틱 — Task 10', () => {
  it('서비스 카드 4장이 button 이어야 한다', () => {
    const src = read('src/web/components/NormalMode.tsx');
    const cards = [...src.matchAll(/<button\n\s*type="button"\n\s*onClick=\{\(\) => onSelectTab/g)];
    expect(cards.length, '서비스 카드 4장').toBe(4);
    // 모든 카드에 w-full text-left 가 있어야 버튼으로 바뀐 뒤 폭이 유지된다
    const withLayout = src.match(/k-card-heritage[^"]*w-full text-left/g) ?? [];
    expect(withLayout.length, '레이아웃 보존 클래스').toBe(4);
  });

  it('버튼으로 바뀐 카드에 중첩 button 이 없어야 한다 (HTML 위반)', () => {
    const src = read('src/web/components/NormalMode.tsx');
    const starts = [...src.matchAll(/<button\n\s*type="button"\n\s*onClick=\{\(\) => onSelectTab/g)].map(
      (m) => m.index ?? 0
    );
    expect(starts.length, '서비스 카드 4장').toBe(4);
    // 카드의 실제 범위 = 자기 <button …> 부터 매칭 </button> 까지.
    // 다음 카드 시작점을 경계로 삼으면 안 된다 — 마지막 카드는 파일 끝까지
    // 뻗어 다른 컴포넌트의 button 을 삼켜 「중첩」으로 오인한다.
    starts.forEach((start, i) => {
      const close = src.indexOf('</button>', start);
      expect(close, `카드 ${i + 1} 닫는 태그 위치`).toBeGreaterThan(start);
      const card = src.slice(start, close + '</button>'.length);
      expect(card.match(/<button\b/g)?.length, `카드 ${i + 1} 내부 button 수`).toBe(1);
      expect(card.match(/<\/button>/g)?.length, `카드 ${i + 1} 닫는 태그 수`).toBe(1);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // React 훅 규칙: 조건부 렌더 분기 아래에 훅을 두면 안 된다.
  //
  // `if (!isOpen) return null;` 아래에 useMemo 가 있으면 「닫힘 → 열림」 전이에서
  // 훅 개수가 늘어난다. React 는 이를 #310 (Rendered more hooks than during
  // the previous render) 로 거부하고 컴포넌트 트리 전체를 백화면으로 죽인다.
  // 단위 테스트는 컴포넌트를 렌더하지 않으므로 188건 전부 통과해도 놓친다.
  // ─────────────────────────────────────────────────────────────────────────
  it('조건부 렌더 모달은 훅을 전부 호출한 뒤에 return null 해야 한다', () => {
    const HOOK =
      /(?<![\w.])(useState|useMemo|useEffect|useRef|useCallback|useReducer|useLayoutEffect|useModalA11y|useBodyScrollLock|useDialogFocus)\s*\(/;
    const { readdirSync, statSync } = require('node:fs') as typeof import('node:fs');
    const walk = (dir: string): string[] =>
      readdirSync(dir).flatMap((e) => {
        const fp = join(dir, e);
        return statSync(fp).isDirectory() ? walk(fp) : /\.tsx?$/.test(e) ? [fp] : [];
      });
    const offenders: string[] = [];

    for (const f of walk(join(ROOT, 'src/web/components'))) {
      const src = readFileSync(f, 'utf8');
      const lines = src.split('\n');
      const guardIdx = lines.findIndex((l) => /^\s*if\s*\(\s*!?(isOpen|open|visible|show)\b[^)]*\)\s*return\s+null/.test(l));
      if (guardIdx < 0) continue;

      for (let i = guardIdx + 1; i < lines.length; i += 1) {
        // 빈 줄은 건너뛴다 — 빈 줄의 indent 는 0 이므로 여기서 break 하면
        // 훅이 있는 다음 줄을 검사하기 전에 루프가 죽는다.
        if (lines[i].trim() === '') continue;
        const indent = lines[i].match(/^\s*/)?.[0].length ?? 0;
        const guardIndent = lines[guardIdx].match(/^\s*/)?.[0].length ?? 0;
        if (indent < guardIndent) break;
        if (HOOK.test(lines[i])) {
          offenders.push(`${f}:${i + 1} — ${lines[i].trim().slice(0, 48)}`);
        }
      }
    }

    expect(offenders, '조기 반환 뒤에 훅이 있는 컴포넌트\n' + offenders.join('\n')).toHaveLength(0);
  });

});
