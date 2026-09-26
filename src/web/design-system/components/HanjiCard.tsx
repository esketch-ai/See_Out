import React from 'react';

interface HanjiCardProps {
  children: React.ReactNode;
  hasCornerBrackets?: boolean;
  hasChanghoTexture?: boolean;
  elevation?: 'flat' | 'subtle' | 'elevated';
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

/**
 * 전통 한지와 백자의 질감을 살린 품격 있는 마스터 카드 컴포넌트
 * 34년 전통시각디자인연구원 조성우 수석 디자이너 조형 감수
 */
export const HanjiCard: React.FC<HanjiCardProps> = ({
  children,
  hasCornerBrackets = false,
  hasChanghoTexture = false,
  elevation = 'subtle',
  className = '',
  onClick,
  hoverable = false
}) => {
  const cornerClass = hasCornerBrackets ? 'k-corner-bracket' : '';
  const textureClass = hasChanghoTexture ? 'k-changho-texture' : '';

  const elevationClasses = {
    flat: 'border border-[#E3DFD5] shadow-none',
    subtle: 'border border-[#E3DFD5] shadow-xs',
    elevated: 'border border-[#D6D0C4] shadow-sm'
  }[elevation];

  const hoverClasses = hoverable
    ? 'hover:border-[#19382C] hover:shadow-md transition-all duration-300 cursor-pointer group'
    : '';

  return (
    <div
      onClick={onClick}
      className={`rounded-xl bg-porcelain ${elevationClasses} ${cornerClass} ${textureClass} ${hoverClasses} ${className}`}
    >
      {children}
    </div>
  );
};
