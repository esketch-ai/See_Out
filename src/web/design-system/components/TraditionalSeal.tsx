import React from 'react';
import { BAEUNG_DESIGN_TOKENS, BaeungSealKey, BaeungSealVariant } from '../tokens.js';

interface TraditionalSealProps {
  sealKey?: BaeungSealKey;
  text?: string;
  variant?: BaeungSealVariant;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * 한국 전통 전각 낙관 (인장 도장) 컴포넌트
 * 34년 전통시각디자인연구원 조성우 수석 디자이너 조형 감수
 */
export const TraditionalSeal: React.FC<TraditionalSealProps> = ({
  sealKey,
  text,
  variant,
  size = 'md',
  className = ''
}) => {
  const sealConfig = sealKey ? BAEUNG_DESIGN_TOKENS.seals[sealKey] : null;
  const sealText = text || sealConfig?.character || '禮';
  const sealVariant = variant || sealConfig?.colorVariant || 'red';

  const sizeClasses = {
    sm: 'text-[13px] px-1.5 py-0.2',
    md: 'text-xs px-2 py-0.5',
    lg: 'text-sm px-2.5 py-1'
  }[size];

  const variantClass = {
    red: 'k-seal-red',
    gold: 'k-seal-gold',
    jade: 'k-seal-jade'
  }[sealVariant];

  const titleTooltip = sealConfig
    ? `${sealConfig.hanja} — ${sealConfig.meaning}`
    : sealText;

  return (
    <span
      className={`${variantClass} ${sizeClasses} ${className}`}
      title={titleTooltip}
      role="img"
      aria-label={titleTooltip}
    >
      {sealText}
    </span>
  );
};
