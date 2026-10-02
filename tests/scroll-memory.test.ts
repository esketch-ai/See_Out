import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { rememberScroll, forgetScroll } from '../src/web/design-system/scrollMemory.js';

/** sessionStorage 를 그대로 대체한다 — 「기기 저장」 이라 Consent 를 건드리지 않는다 */
const makeStore = () => {
  const m = new Map<string, string>();
  return {
    getItem: (k: string) => (m.has(k) ? (m.get(k) as string) : null),
    setItem: (k: string, v: string) => void m.set(k, v),
    removeItem: (k: string) => void m.delete(k),
    clear: () => m.clear()
  };
};

describe('스크롤 기억 (새로고침 후에도 유족의 자리에 돌아온다)', () => {
  let store: ReturnType<typeof makeStore>;
  let rafSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    store = makeStore();
    vi.stubGlobal('sessionStorage', store);
    // requestAnimationFrame 은 테스트에서 즉시 실행되게 한다
    rafSpy = vi.fn((cb: FrameRequestCallback) => {
      cb(0);
      return 1;
    });
    vi.stubGlobal('requestAnimationFrame', rafSpy);
    vi.stubGlobal('window', {
      innerHeight: 800,
      scrollY: 0,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      scrollTo: vi.fn()
    });
    vi.stubGlobal('document', {
      documentElement: { scrollHeight: 5000 }
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('localStorage 를 건드리지 않는다 — 「기기 저장」 은 동의 후에만', () => {
    const localSet = vi.fn();
    const localRemove = vi.fn();
    vi.stubGlobal('localStorage', { setItem: localSet, removeItem: localRemove, getItem: () => null });
    forgetScroll();
    expect(localSet).not.toHaveBeenCalled();
    expect(localRemove).not.toHaveBeenCalled();
  });

  it('기억이 없으면 아무것도 하지 않는다 (첫 방문이 망가지지 않는다)', () => {
    expect(() => forgetScroll()).not.toThrow();
    expect(store.getItem('seasnake:scroll')).toBeNull();
  });

  it('오래된 기억은 버린다 — 어제 본 위치로 돌아가는 것이 더 헷갈린다', () => {
    store.setItem(
      'seasnake:scroll',
      JSON.stringify({ y: 2200, at: Date.now() - 40 * 60 * 1000 })
    );
    rememberScroll();
    expect(store.getItem('seasnake:scroll')).toBeNull();
  });

  it('조금 지난 기억은 남긴다 (30분 이내면 같은 자리로 돌아온다)', () => {
    store.setItem('seasnake:scroll', JSON.stringify({ y: 2200, at: Date.now() - 5 * 60 * 1000 }));
    expect(() => rememberScroll()).not.toThrow();
    // 즉시 덮어쓰지 않는다 — 지워지지 않았어야 한다
    expect(store.getItem('seasnake:scroll')).toContain('2200');
  });

  it('깨진 값이 들어와도 조용히 죽지 않는다', () => {
    store.setItem('seasnake:scroll', '{깨졌다');
    expect(() => rememberScroll()).not.toThrow();
  });
});