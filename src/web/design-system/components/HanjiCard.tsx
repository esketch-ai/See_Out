import React from 'react';
import { BAEUNG_DESIGN_TOKENS } from '../tokens.js';

interface HanjiCardProps {
  children: React.ReactNode;
  hasCornerBrackets?: boolean;
  hasChanghoTexture?: boolean;
  elevation?: 'flat' | 'subtle' | 'elevated' | 'document';
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  role?: string;
  tabIndex?: number;
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
  'aria-label'?: string;
}

const T = BAEUNG_DESIGN_TOKENS;

/**
 * 전통 한지와 백자의 질감을 살린 품격 있는 마스터 카드 컴포넌트
 *
 * 제정: 조성우 수석 디자이너 (전통시각디자인, 34년)
 * 정본: AREA-DESIGN-2026-009 §4-4 (라운드) · §5.3 (면 분리)
 *
 * ■ 라운드 규칙 (N-10)
 *   elevation="document" 만 radius 24px(radius.document) 를 쓴다.
 *   24px 전면 적용은 헌장 기둥 1 「번쩍거림 배제」 위반이므로,
 *   「24px = 종이」 규칙으로 의전 문서 면에만 허용한다.
 *
 * ■ 접근성
 *   onClick 이 지정되면 자동으로 button 역할과 키보드 정지를 부여한다.
 *   클릭 가능한 div 금지 (AREA-DESIGN-2026-009 §11 감수 항목).
 */
export const HanjiCard: React.FC<HanjiCardProps> = ({
  children,
  hasCornerBrackets = false,
  hasChanghoTexture = false,
  elevation = 'subtle',
  className = '',
  onClick,
  hoverable = false,
  role,
  tabIndex,
  onKeyDown,
  'aria-label': ariaLabel
}) => {
  const isInteractive = typeof onClick === 'function';

  const elevationClasses = {
    flat: 'border border-[#DCD6C9] shadow-none',
    subtle: 'border border-[#DCD6C9] shadow-xs',
    elevated: 'border border-[#DCD6C9] shadow-sm rounded-[16px]',
    document: 'rounded-[24px]'
  }[elevation];

  const hoverClasses = hoverable
    ? `hover:border-[${T.colors.celadon.DEFAULT}] hover:shadow-md transition-all duration-300 cursor-pointer group`
    : '';

  const interactiveProps = isInteractive
    ? {
        role: role ?? 'button',
        tabIndex: tabIndex ?? 0,
        'aria-label': ariaLabel,
        onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => {
          // Space / Enter 로 실제 버튼과 동일하게 동작시킨다
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
          onKeyDown?.(e);
        }
      }
    : { role, tabIndex };

  return (
    <div
      onClick={onClick}
      className={[
        'bg-porcelain overflow-hidden relative',
        elevationClasses,
        hasCornerBrackets ? 'k-corner-bracket' : '',
        hasChanghoTexture ? 'k-changho-texture' : '',
        hoverClasses,
        className
      ]
        .filter(Boolean)
        .join(' ')}
      {...interactiveProps}
    >
      {children}
    </div>
  );
};
