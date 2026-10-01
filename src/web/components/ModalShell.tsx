import React, { useCallback, useEffect, useId, useRef } from 'react';

/**
 * 배웅 공용 모달 셸 (Modal Shell)
 *
 * 제정: 한수진 박사 (시니어 인지공학) 감수 — AREA-DESIGN-2026-009 §11
 *
 * ■ 이 셸이 해결하는 결함 (2026-09-27 감사)
 *   1. 포커스 트랩 0건 — 모달이 열려 있어도 Tab 으로 배경으로 이탈 가능.
 *      50·90세 유족은 화면을 못 보고 Tab 을 눌러 배경으로 빠져나간다.
 *   2. ESC 미작동 6/7 — `title="닫기 (ESC)"` 라고 적혀 있으나 실제로는
 *      키보드 사용자가 모달을 닫을 수단이 없었다. 문구와 동작의 불일치.
 *   3. `aria-modal` / `role="dialog"` 부재 — 스크린리더에 배웅 모달이
 *      「제자리 확정」 임을 알리지 못해 배경이 함께 읽힌다.
 *   4. 포커스 복귀 부재 — 닫은 뒤 포커스가 body 로 소실되어 다음 행동 지점이 없다.
 *
 * ■ 포커스 이동을 「모달 밖으로는 절대 나가지 못하게」 하되,
 *   시각 단서를 남기지 않는다. 유족이 자기 의지와 무관하게 배경으로
 *   빠져나가 화면을 잃어버리는 것을 막는 것이 최우선이다.
 */

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(',');

/** 모달이 여러 겹으로 열릴 수 있으므로 잠금 횟수를 센다 */
/**
 * 배경 스크롤 잠금.
 *
 * 모듈 레벨 카운터로 구현한다. 모달 인스턴스가 여러 개여도(중첩 가능)
 * 마지막 하나가 닫힐 때만 원래 값으로 복원된다.
 * React 19 StrictMode 의 이펙트 재실행(setup → cleanup → setup)은
 * 카운터를 0 까지 내리지 않으므로 원래 값이 보존된다.
 */
const SCROLL_LOCK_ATTR = 'data-baeung-scroll-lock';
let lockCount = 0;
let lockPrevOverflow = '';

function useBodyScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return;
    const body = document.body;

    if (lockCount === 0) {
      lockPrevOverflow = body.style.overflow;
      body.setAttribute(SCROLL_LOCK_ATTR, '1');
      body.style.overflow = 'hidden';
    }
    lockCount += 1;

    return () => {
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0) {
        body.removeAttribute(SCROLL_LOCK_ATTR);
        body.style.overflow = lockPrevOverflow;
        lockPrevOverflow = '';
      }
    };
  }, [active]);
}

/**
 * 포커스 트랩 훅 — ModalShell 내부용이며 키오스크 등 특수 컨테이너에서도 재사용한다.
 * onEscape 를 넘기지 않으면 ESC 처리를 하지 않으므로, 자체 ESC 계층(2단계 등)을 가진
 * 컨테이너와 충돌하지 않는다.
 */
export function useDialogFocus(active: boolean, onEscape?: () => void) {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  let rafId = 0;

  // 1) 열릴 때 첫 조작 가능 요소로 이동, 이전 위치 기억
  useEffect(() => {
    if (!active) return;
    restoreRef.current = document.activeElement as HTMLElement | null;

    // 조건부 렌더링되는 모달은 이 이펌트가 실행될 때 ref 가 아직 연결되지 않은
    // 경우가 있다 (isOpen 이 true 로 바뀐 직후). panelRef.current 가 null 이면
    // 다음 프레임까지 미룬다 — 포커스를 트리거 버튼에 남겨두면 ESC 가 닫지 못한다.
    const focusFirst = () => {
      const panel = panelRef.current;
      if (!panel) {
        rafId = requestAnimationFrame(focusFirst);
        return;
      }
      const first = panel.querySelector<HTMLElement>(FOCUSABLE);
      (first ?? panel).focus({ preventScroll: true });
    };
    focusFirst();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      // 2) 닫히면 원래 위치로 복귀 (다음 행동 지점을 되찾아 준다)
      const target = restoreRef.current;
      if (target && document.contains(target)) {
        target.focus({ preventScroll: true });
      }
    };
  }, [active]);

  // 3) Tab 순환 + ESC
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Escape') {
        // onEscape 가 있을 때만 전파를 막는다.
        // React 17+ 는 루트 컨테이너에 리스너를 두므로, 여기서 stopPropagation 을 걸면
        // 그 아래의 네이티브 window 리스너까지 차단된다. 자체 ESC 계층을 가진
        // 컨테이너(예: 빈소 키오스크의 2단계 처리)가 조용히 죽는 원인이 된다.
        if (onEscape) {
          e.stopPropagation();
          onEscape();
        }
        return;
      }
      if (e.key !== 'Tab') return;

      const panel = panelRef.current;
      if (!panel) return;
      const items = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
        (el) => el.offsetParent !== null || el === document.activeElement
      );
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];

      // 브라우저 기본 Tab 은 문서 밖으로 나갈 수 있으므로 경계에서 되감는다
      if (e.shiftKey && (document.activeElement === first || !panel.contains(document.activeElement))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [onEscape]
  );

  return { panelRef, handleKeyDown };
}

export interface ModalShellProps {
  onClose: () => void;
  /** 패널 최대 폭 (기존 모달의 max-w-* 와 1:1 대응) */
  maxWidth?: 'max-w-2xl' | 'max-w-3xl' | 'max-w-4xl';
  /** 패널 최대 높이 */
  maxHeight?: string;
  /** 패널 표면 — paper(한지 계열) / white(백자) */
  surface?: 'paper' | 'white';
  /** 오버레이 스크롤 허용 여부 (인쇄 문서가 많은 모달은 true) */
  overlayScroll?: boolean;
  /** 명조 적용 (의전 문서 계열) */
  serif?: boolean;
  /** 오버레이 추가 클래스 */
  overlayClassName?: string;
  /** 패널 추가 클래스 */
  panelClassName?: string;
  /** 접근성 이름 — 제목 요소의 id. 미지정 시 자동 생성 */
  titleId?: string;
  /** 접근성 설명 요소의 id */
  descriptionId?: string;
  children: React.ReactNode;
}

export const ModalShell: React.FC<ModalShellProps> = ({
  onClose,
  maxWidth = 'max-w-3xl',
  maxHeight = 'max-h-[92vh]',
  surface = 'paper',
  overlayScroll = false,
  serif = false,
  overlayClassName = '',
  panelClassName = '',
  titleId,
  descriptionId,
  children
}) => {
  const autoId = useId();
  const resolvedTitleId = titleId ?? `modal-title-${autoId}`;
  const resolvedDescId = descriptionId ?? `modal-desc-${autoId}`;

  const { panelRef, handleKeyDown } = useDialogFocus(true, onClose);
  useBodyScrollLock(true);

  return (
    <div
      className={[
        'fixed inset-0 z-50 bg-[#0D0E10]/85 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4',
        overlayScroll ? 'overflow-y-auto' : 'overflow-hidden',
        serif ? 'font-serif' : '',
        overlayClassName
      ]
        .filter(Boolean)
        .join(' ')}
      // 오버레이 자체 클릭으로 닫지 않는다 — 진행 중인 의전 문서를 실수로 닫으면 되돌릴 수 없다.
      // 닫기는 명시적 X 단추 또는 ESC 로만 한다.
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) e.preventDefault();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={resolvedTitleId}
        aria-describedby={descriptionId ? resolvedDescId : undefined}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className={[
          surface === 'paper' ? 'bg-[#FAF9F6]' : 'bg-[#FFFFFF]',
          'rounded-2xl w-full overflow-hidden shadow-2xl border border-[#DCD6C9] flex flex-col',
          maxWidth,
          maxHeight,
          overlayScroll ? 'my-auto' : '',
          'focus:outline-none',
          panelClassName
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {children}
      </div>
    </div>
  );
};

export interface ModalToolbarProps {
  titleId: string;
  /** 부제 요소의 id — ModalShell 의 aria-describedby 연결점 */
  descriptionId?: string;
  icon?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  onClose: () => void;
  closeLabel?: string;
  children?: React.ReactNode;
  /** 황동 어두운 톤 (바우처) */
  goldAccent?: boolean;
}

/**
 * 모달 상단 컨트롤 툴바 — titleId 로 ModalShell 의 aria-labelledby 를 만족시킨다.
 * 기존 5개 모달의 「상단 컨트롤 바」 를 표준화한다.
 */
export const ModalToolbar: React.FC<ModalToolbarProps> = ({
  titleId,
  descriptionId,
  icon,
  title,
  subtitle,
  onClose,
  closeLabel = '닫기',
  children,
  goldAccent = false
}) => (
  <div className="no-print bg-[#141618] text-[#FAF9F6] p-4 px-6 flex items-center justify-between border-b border-white/10 shrink-0 gap-3">
    <div className="flex items-center space-x-2.5 min-w-0">
      {icon}
      <div className="min-w-0">
        <div
          id={titleId}
          className="font-serif font-bold text-sm md:text-base text-[#FAF9F6] truncate"
        >
          {title}
        </div>
        {subtitle && (
          <div id={descriptionId} className="text-[0.8125rem] text-[#A69E8F] truncate">
            {subtitle}
          </div>
        )}
      </div>
    </div>
    <div className="flex items-center gap-2 shrink-0">
      {children}
      <button
        type="button"
        onClick={onClose}
        aria-label={closeLabel}
        title={`${closeLabel} (ESC)`}
        className="p-1.5 hover:bg-white/10 rounded-full text-[#5A5E66] hover:text-white transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C2A26A]"
      >
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
);

/**
 * 모달 접근성 계약 훅 — 기존 구조를 그대로 둔 채 배웅 모달 기준을 부여한다.
 *
 * 2026-09-27: main 이 추가한 신규 모달 7종(LegalPolicy · OptOut · ProfessionalCare
 * · FuneralHallQuote · AffiliatePartners · B2BPartnerAdmission · PartnerPerformanceReport)
 * 이 ModalShell 을 쓰지 않아 포커스 트랩·ESC·aria-modal 이 전무했다.
 * 구조를 리팩터링하지 않고 계약을 부착하기 위해 이 훅을 제공한다.
 *
 * 사용:
 *   const { overlayProps, panelProps } = useModalA11y(onClose);
 *   <div {...overlayProps} className="fixed inset-0 …">
 *     <div {...panelProps} className="…">
 */
export function useModalA11y(onClose: () => void, active = true, titleId?: string) {
  const { panelRef, handleKeyDown } = useDialogFocus(active, onClose);
  useBodyScrollLock(active);
  const autoId = useId();

  return {
    overlayProps: {
      onMouseDown: (e: React.MouseEvent) => {
        // 오버레이 클릭으로 닫지 않는다 — 진행 중인 의전·법률 문서를 실수로 닫으면 복구 불가
        if (e.target === e.currentTarget) e.preventDefault();
      }
    },
    panelProps: {
      // ref 를 그대로 전달해야 트랩이 패널 DOM 을 실제로 참조한다.
      // (중간 객체를 거쳐 복사하면 최초 렌더 시점의 null 만 남고 트랩이 무력화된다)
      ref: panelRef,
      role: 'dialog' as const,
      'aria-modal': true as const,
      'aria-label': titleId,
      tabIndex: -1,
      onKeyDown: handleKeyDown
    }
  };
}
