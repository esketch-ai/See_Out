/**
 * 스크롤 기억 — 「맨 위로 되돌아가지 않는다」
 *
 * 왜 이것이 필요한가
 * ──────────────────
 * 유족이 장례식장 가격을 아래까지 내려가 비교하다가 어떤 버튼(외부 지도로
 * 나가는 링크, 인쇄, 또는 리로드가 걸린 경로)을 눌렀다. 돌아오면 화면이
 * 맨 위다. 무엇을 어디까지 봤는지 다시 찾느라 스크롤을 되감아야 한다.
 * 90세 유족에게는 이것이 「길이 잃었다」 는 경험이다.
 *
 * 무엇을 고쳤나
 * ────────────
 * 화면이 통째로 다시 그려져도 **같은 자리로 돌아오게** 한다.
 *   · 스크롤 위치를 sessionStorage 에 정기 저장한다
 *   · 마운트 때 복원한다
 *
 * 왜 sessionStorage 인가
 * ────────────────────
 * localStorage 는 「기기 저장」 이라 동의 없이 건드리면 안 된다.
 * AGENTS.md 1장 — 기기 저장은 명시적 동의 후에만. 스크롤 위치는
 * 개인정보가 아니지만 **같은 저장소를 함부로 쓰면 안 된다.**
 * 탭을 닫으면 사라지는 sessionStorage 가 알맞다.
 *
 * 왜 스로틀인가
 * ────────────
 * 스크롤은 초당 수십 번 발생한다. 저장소를 그 빈도로 쓰면 안 된다.
 */
const KEY = 'seasnake:scroll';

interface ScrollMemory {
  y: number;
  at: number;
}

const read = (): ScrollMemory | null => {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as ScrollMemory;
    if (typeof v?.y !== 'number') return null;
    // 30분 지나면 기억을 버린다 — 어제 본 위치로 돌아가는 것이 더 헷갈린다
    if (Date.now() - (v.at ?? 0) > 30 * 60 * 1000) {
      sessionStorage.removeItem(KEY);
      return null;
    }
    return v;
  } catch {
    // 저장소를 못 읽어도 화면은 정상이어야 한다
    return null;
  }
};

const write = (y: number) => {
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ y, at: Date.now() }));
  } catch {
    /* 용량 초과·프라이빗 모드 — 조용히 포기한다 */
  }
};

/**
 * 스크롤 기억을 건다. 한 번만 부른다(App 루트).
 * 반환값은 해제 함수 — StrictMode 이 두 번 부를 때를 위해.
 */
export const rememberScroll = (): (() => void) => {
  // 복원은 paints 뒤에 해야 한다. 첫 paint 전에滚시키면 브라우저가
  // 「 scroll anchoring 」 으로 다시 0 으로 당긴다 — 실제로 그래서 첫 시도가 실패했다.
  let raf = 0;
  const restore = () => {
    const m = read();
    if (!m || m.y <= 0) return;
    // 읽는 시점에 문서가 아직 짧으면(모달·이미지 로딩 전) 스크롤할 수 없다.
    const apply = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (m.y <= max) window.scrollTo(0, m.y);
    };
    requestAnimationFrame(() => {
      apply();
      // 레이아웃이 늦게 확정되는 경우가 있어 한 번 더 시도한다
      setTimeout(apply, 120);
      setTimeout(apply, 400);
    });
  };

  if (typeof window !== 'undefined') {
    // 여기서 scrollTo(0,0) 하지 않는다 — 그게 바로 「맨 위로」 라는 버그다
    restore();
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        write(window.scrollY);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }
  return () => {};
};

export const forgetScroll = () => {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* noop */
  }
};