import React from 'react';

interface SeniorButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'emergency' | 'outline' | 'ghost';
  isLargeTouch?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

/**
 * 5090 시니어 어르신을 위한 64dp+ 안심 터치 버튼 컴포넌트
 * WCAG 2.1 AAA 고대비 및 인지공학적 피드백 보장
 */
export const SeniorButton: React.FC<SeniorButtonProps> = ({
  children,
  variant = 'primary',
  isLargeTouch = true,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const minHeightClass = isLargeTouch ? 'min-h-[64px] py-4 px-7 text-lg md:text-xl' : 'py-3 px-5 text-base';

  const variantClasses = {
    primary: 'bg-celadon-800 hover:bg-celadon-900 active:scale-[0.98] text-white shadow-md border border-celadon-700',
    emergency: 'bg-crimson-600 hover:bg-crimson-700 active:scale-[0.98] text-white shadow-lg border border-crimson-500/50',
    outline: 'bg-porcelain hover:bg-celadon-50 active:scale-[0.98] text-celadon-900 border-2 border-celadon-800 shadow-xs',
    ghost: 'bg-transparent hover:bg-hanji active:scale-[0.98] text-ink hover:text-celadon-800'
  }[variant];

  return (
    <button
      disabled={disabled}
      className={`rounded-2xl font-reverence font-bold flex items-center justify-center space-x-2.5 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${minHeightClass} ${variantClasses} ${className}`}
      {...props}
    >
      {leftIcon && <span className="shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
