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
    primary: 'bg-[#19382C] hover:bg-[#132B22] active:scale-[0.98] text-[#FAF9F6] shadow-xs border border-[#19382C]',
    emergency: 'bg-[#8B2520] hover:bg-[#731E1A] active:scale-[0.98] text-[#FAF9F6] shadow-xs border border-[#8B2520]',
    outline: 'bg-[#FFFFFF] hover:bg-[#FAF9F6] active:scale-[0.98] text-[#19382C] border border-[#19382C]',
    ghost: 'bg-transparent hover:bg-[#FAF9F6] active:scale-[0.98] text-[#121417] hover:text-[#19382C]'
  }[variant];

  return (
    <button
      disabled={disabled}
      className={`rounded-lg font-reverence font-medium flex items-center justify-center space-x-2.5 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${minHeightClass} ${variantClasses} ${className}`}
      {...props}
    >
      {leftIcon && <span className="shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
