/**
 * 스크롤 기억 — 「맨 위로 되돌아가지 않는다」
 *
 * 왜 이것이 필요한가
 * ──────────────────
 * 유족이 종합 의전 화면을 아래까지 내려가 서비스들을 비교하다가, 화면 가운데
 * 놓인 「장례식장 찾기」 카드를 눌렀다. 탭이 통째로 바뀌면서 스크롤이 0 이 된다.
 * 다시 종합 의전 탭으로 돌아와도 **0 이다 — 돌아갈 자리가 없다.**
 *
 * 실제로 잰 값 (1440px · 브라우저)
 *   클릭 전 1200 → 클릭 후 0        ← 새 화면은 맨 위가 자연스럽다
 *   원래 탭 복귀 후 0              ← ★ 여기가 결함이다. 잃어버렸다.
 *
 * 그러므로 「새 탭은 위에서 시작한다」 는 그대로 두고,
 * **자기 탭으로 돌아왔을 때의 자리만 되돌려 준다.**
 *
 * 왜 sessionStorage 인가
 * ────────────────────
 * localStorage 는 「기기 저장」 이라 동의 없이 건드리면 안 된다.
 * AGENTS.md 1장 — 기기 저장은 명시적 동의 후에만. 스크롤 위치는 개인정보가
 * 아니지만 **같은 저장소를 함부로 쓰면 안 된다.**
 * 탭을 닫으면 사라지는 sessionStorage 가 알맞다.
 */
const KEY = 'seasnake:scroll';

interface Entry {
  y: number;
  at: number;
}

const MAX_AGE_MS = 30 * 60 * 1000;

const readAll = (): { all: Record<string, Entry>; pruned: boolean } => {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return { all: {}, pruned: false };
    const v = JSON.parse(raw);
    if (!v || typeof v !== 'object') return { all: {}, pruned: false };
    // 30분 지나면 기억을 버린다 — 어제 보던 자리로 돌아가는 것이 더 헷갈리다
    const now = Date.now();
    let pruned = false;
    for (const [k, e] of Object.entries(v as Record<string, Entry>)) {
      if (!e || typeof e.y !== 'number' || now - (e.at ?? 0) > MAX_AGE_MS) {
        delete (v as Record<string, Entry>)[k];
        pruned = true;
      }
    }
    return { all: v as Record<string, Entry>, pruned };
  } catch {
    return { all: {}, pruned: false };
  }
};

const writeAll = (all: Record<string, Entry>) => {
  try {
    if (Object.keys(all).length === 0) sessionStorage.removeItem(KEY);
    else sessionStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    /* 용량 초과·프라이빗 모드 — 조용히 포기한다 */
  }
};

/** 지금 보고 있는 영역(탭). 바뀌면 그 자리에서 저장하고 새 곳의 자리를 되살린다 */
let scope = 'default';
let listenerInstalled = false;

const save = (y: number) => {
  if (typeof window === 'undefined') return;
  const { all } = readAll();
  all[scope] = { y, at: Date.now() };
  writeAll(all);
};

const restoreInto = (s: string) => {
  const { all, pruned } = readAll();
  // 버린 것은 실제로 지운다 — 다음에 다시 읽을 때 같은 판정을 반복하지 않게
  if (pruned) writeAll(all);
  const y = all[s]?.y ?? 0;
  const max = () => document.documentElement.scrollHeight - window.innerHeight;
  const apply = () => {
    const m = max();
    window.scrollTo(0, Math.max(0, Math.min(y, m)));
  };
  // 첫 paint 전에 굴리면 브라우저의 scroll anchoring 이 0 으로 다시 당긴다.
  // 실제로 첫 시도가 그랬다. paint 뒤, 그리고 레이아웃이 늦게 확정되는 경우를
  // 위해 두 번 더 시도한다.
  requestAnimationFrame(() => {
    apply();
    setTimeout(apply, 120);
    setTimeout(apply, 400);
  });
};

/**
 * 스크롤 기억을 건다. 한 번만 부른다(App 루트).
 * 반환값은 해제 함수 — StrictMode 이 두 번 부를 때를 위해.
 */
export const rememberScroll = (): (() => void) => {
  if (typeof window === 'undefined') return () => {};
  if (!listenerInstalled) {
    listenerInstalled = true;
    // 초당 수십 번 발생하므로 저장소는 rAF 로 한 번에 한 번만 쓴다
    let raf = 0;
    window.addEventListener(
      'scroll',
      () => {
        if (raf) return;
        raf = window.requestAnimationFrame(() => {
          raf = 0;
          save(window.scrollY);
        });
      },
      { passive: true }
    );
  }
  restoreInto(scope);
  return () => {};
};

/**
 * 지금 자리를 즉시 저장한다.
 *
 * ★ 이게 핵심이다. 탭 전환을 useEffect 에서 저장하면 늦다 —
 *   React 가 DOM 을 갈아끼운 직후에야 effects 가 도는데, 그 사이에 브라우저가
 *   문서가 짧아진 만큼 스크롤을 0 으로 당겨 놓는다. 그래서 저장되는 값이 0 이고
 *   「돌아와도 맨 위」 가 그대로였다. 실제로 잰 값이다.
 *   전환을 시키기 **직전** 에 저장해야 한다.
 */
export const saveScrollNow = () => {
  if (typeof window === 'undefined') return;
  save(window.scrollY);
};

/** 탭이 바뀌었을 때 부른다 — 온 자리는 되살린다 (저장은 saveScrollNow 가 맡는다) */
export const setScrollScope = (next: string) => {
  if (typeof window === 'undefined' || next === scope) return;
  scope = next;
  restoreInto(scope);
};

export const forgetScroll = () => {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* noop */
  }
};