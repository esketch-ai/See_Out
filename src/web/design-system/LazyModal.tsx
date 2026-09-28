/**
 * 모달 코드 분할 헬퍼.
 *
 * ■ 왜 필요한가
 *   팝업 14종이 전부 정적 import 이라 749KB(197KB gzip) 단일 번들로 나갔다.
 *   그중 13종은 유족이 「약관 보기」나 「상속 변호사」를 눌러야 처음 읽히는
 *   보조 화면이다. 첫 화면에 필요 없는 코드를 즉시 내려받는 셈이다.
 *
 * ■ 이중안심 대상이라 지연을 감수할 수 없다
 *   모달을 누르는 즉시 아무 일도 없어 보이면 유족은 「멈췄다」고 판단하고
 *   두 번 눌러 상태가 뒤집히거나, 최악이면 아무것도 안 열린 채 화면을 건드린다.
 *   그래서 lazy 만 걸지 않는다 — 다음 두 가지를 함께 쓴다.
 *
 *   1. preload()  — 트리거에 포인터가 올라오거나 포커스가 닿으면 미리 받는다.
 *      노안 유족은 누르기 전에 「읽어보겠다」 고개를 천천히 대는 시간이 충분하다.
 *   2. warmAll()  — 앱이 한가해지면 남은 조각을 조용히 받아둔다.
 *      네트워크 여유가 있을 때 끝나므로 클릭 시 지연이 남지 않는다.
 *
 * ★ 청각 유족도 대상이다. 청각 유족은 pointerenter 가 발생하지 않는다.
 *   그래서 preload 는 focus 로도 걸고, button 의 onFocusCapture 로 연결한다.
 */

import React, { lazy, type ComponentType, type LazyExoticComponent } from 'react';

/** 한 번만 받기 위한 캐시. preload 와 lazy 가 같은 Promise 를 봐야 한다. */
const warm = new Map<unknown, Promise<unknown>>();

/**
 * named export 로 노출된 모달을 lazy 로 만든다.
 *
 * 이 저장소의 모달은 파일당 런타임 export 가 정확히 하나다
 * (나머지는 타입이라 빌드에서 지워진다). 그 사실을 제약으로 쓴다.
 * 컴포넌트 타입을 그대로 밀어 넣어 사용 지점에서 props 오타가 잡히게 한다.
 */
export function lazyModal<P>(
  load: () => Promise<Record<string, React.JSXElementConstructor<P>>>
) {
  const Comp = lazy(
    () => load().then((m) => ({ default: Object.values(m)[0] as ComponentType<P> }))
  ) as LazyExoticComponent<ComponentType<P>>;

  const preload = () => {
    let p = warm.get(load);
    if (!p) {
      p = load();
      // 실패한 조각은 캐시에서 빼낸다 — 다음 클릭에 재시도되게 한다.
      p.catch(() => warm.delete(load));
      warm.set(load, p);
    }
    return p;
  };

  return { Comp, preload };
}

/**
 * 앱이 한가할 때 남은 조각을 미리 받는다.
 * requestIdleCallback 를 쓰되 지원하지 않으면 setTimeout 으로 물러선다.
 */
export function warmAll(fns: Array<() => unknown>) {
  const run = () => {
    for (const f of fns) {
      try {
        f();
      } catch {
        /* 미리 받는 것 실패는 무시한다 — 실제 사용 시 다시 받는다 */
      }
    }
  };
  const ric = (globalThis as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number })
    .requestIdleCallback;
  if (typeof ric === 'function') ric(run, { timeout: 4000 });
  else setTimeout(run, 2500);
}

/**
 * 트리거 버튼에 붙이는 props.
 * 마우스·터치·키보드 전부에서 미리 받는다.
 * 청각 유족은 pointerenter 가 없으므로 focus 로도 걸어야 한다.
 */
export function preloadOn(on: () => unknown) {
  return {
    onPointerEnter: on,
    onFocusCapture: on,
    onTouchStart: on,
  };
}
