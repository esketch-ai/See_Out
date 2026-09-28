import React from 'react';

export type BaeungLogoVariant = 'symbol' | 'full' | 'horizontal' | 'seal';
export type BaeungLogoTheme = 'dark' | 'light' | 'gold';

interface BaeungLogoProps {
  variant?: BaeungLogoVariant;
  theme?: BaeungLogoTheme;
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  className?: string;
  showSubtitle?: boolean;
}

/**
 * 배웅(Bae-ung) 시니어 맞춤형 공식 브랜드 로고
 * 
 * [조형 철학: 처마와 사립문 (The Eaves & Open Gate)]
 * - 1950년대 이전 세대 유족의 고향집 기억 소환
 * - 한옥 기와 처마의 고요한 곡선과 따뜻하게 열린 사립문이
 *   배웅의 첫 자음 'ㅂ'을 자연스럽게 형성하여 편안한 귀향(歸鄕)의 안식을 상징
 */
export const BaeungLogo: React.FC<BaeungLogoProps> = ({
  variant = 'symbol',
  theme = 'dark',
  size = 'md',
  className = '',
  showSubtitle = true
}) => {
  const pixelSize = typeof size === 'number' ? size : {
    sm: 32,
    md: 42,
    lg: 54,
    xl: 72
  }[size];

  // 배웅 정본 토큰 팔레트 (AREA-DESIGN-2026-009)
  const colors = {
    dark: {
      bg: '#19382C',
      border: '#2D4F43',
      roof: '#FAF9F6',
      roofAccent: '#C2A26A',
      door: '#C2A26A',
      doorFrame: '#FAF9F6',
      text: '#FAF9F6',
      subtext: '#8A929D'
    },
    light: {
      bg: '#FAF9F6',
      border: '#DCD6C9',
      roof: '#19382C',
      roofAccent: '#9E7D47',
      door: '#9E7D47',
      doorFrame: '#19382C',
      text: '#151719',
      subtext: '#6E5429'
    },
    gold: {
      bg: '#141618',
      border: '#3D382E',
      roof: '#C2A26A',
      roofAccent: '#FAF9F6',
      door: '#C2A26A',
      doorFrame: '#FAF9F6',
      text: '#FAF9F6',
      subtext: '#C2A26A'
    }
  }[theme];

  // 1. 단독 심볼 마크 (Icon Symbol)
  const renderSymbol = (w: number, h: number) => (
    <svg
      width={w}
      height={h}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
      role="img"
      aria-label="배웅 처마와 사립문 브랜드 심볼"
    >
      {/* 백그라운드 라운드 타일 */}
      <rect
        x="2"
        y="2"
        width="96"
        height="96"
        rx="18"
        fill={colors.bg}
        stroke={colors.border}
        strokeWidth="3"
      />

      {/* 전통 살창 은은한 수직 보조선 */}
      <line x1="50" y1="28" x2="50" y2="78" stroke={colors.door} strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />

      {/* 한옥 기와 처마 곡선 상단 덧지붕 (추녀마루) */}
      <path
        d="M 28 25 Q 50 17 72 25"
        stroke={colors.roofAccent}
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* 한옥 본 처마 유려한 곡선 (Eaves Curve) */}
      <path
        d="M 16 38 C 28 36, 42 27, 50 27 C 58 27, 72 36, 84 38 C 85 41, 79 43, 75 42 C 65 38, 56 33, 50 33 C 44 33, 35 38, 25 42 C 21 43, 15 41, 16 38 Z"
        fill={colors.roof}
      />

      {/* 지붕 아래 처마 서까래 장식선 */}
      <path
        d="M 26 42 Q 50 35 74 42"
        stroke={colors.roofAccent}
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* 사립문 기둥 및 문틀: 한글 'ㅂ' 조형 */}
      {/* 1. 좌측 문설주 (Left Pillar) */}
      <rect x="25" y="44" width="7" height="38" rx="2" fill={colors.doorFrame} />

      {/* 2. 우측 문설주 (Right Pillar) */}
      <rect x="68" y="44" width="7" height="38" rx="2" fill={colors.doorFrame} />

      {/* 3. 하단 문턱 (Base Threshold — 안식의 바닥) */}
      <rect x="23" y="77" width="54" height="6.5" rx="2" fill={colors.doorFrame} />

      {/* 4. 중인방 (Middle Beam — 'ㅂ'의 중심 획) */}
      <rect x="28" y="58" width="44" height="4.5" rx="1.5" fill={colors.doorFrame} />

      {/* 열린 사립문 (Open Gates in Perspective) */}
      {/* 좌측 열린 문짝 */}
      <path
        d="M 32 46 L 43 51 L 43 75 L 32 76 Z"
        fill={colors.door}
        fillOpacity="0.85"
      />
      {/* 우측 열린 문짝 */}
      <path
        d="M 68 46 L 57 51 L 57 75 L 68 76 Z"
        fill={colors.door}
        fillOpacity="0.85"
      />

      {/* 문살 장식선 (세살 격자 은은한 라인) */}
      <line x1="37.5" y1="48.5" x2="37.5" y2="75.5" stroke={colors.bg} strokeWidth="1" strokeOpacity="0.6" />
      <line x1="62.5" y1="48.5" x2="62.5" y2="75.5" stroke={colors.bg} strokeWidth="1" strokeOpacity="0.6" />

      {/* 중앙 영원한 안식의 금빛 빛살 (Auspicious Core) */}
      <circle cx="50" cy="50" r="2.5" fill={colors.roofAccent} />
    </svg>
  );

  if (variant === 'symbol') {
    return <div className={`inline-flex items-center justify-center ${className}`}>{renderSymbol(pixelSize, pixelSize)}</div>;
  }

  // 2. 가로형 풀 로고 (Horizontal Wordmark with Symbol)
  if (variant === 'horizontal') {
    return (
      <div className={`inline-flex items-center space-x-3 ${className}`}>
        {renderSymbol(pixelSize, pixelSize)}
        <div className="flex flex-col text-left">
          <div className="flex items-center space-x-2">
            <span
              className="font-reverence font-black tracking-wider leading-none"
              style={{ fontSize: `${Math.round(pixelSize * 0.52)}px`, color: colors.text }}
            >
              배 웅
            </span>
            <span
              className="text-[13px] px-1.5 py-0.5 rounded font-serif border hidden sm:inline leading-none"
              style={{
                backgroundColor: theme === 'dark' ? '#1F2226' : '#FAF9F6',
                borderColor: colors.border,
                color: colors.subtext
              }}
            >
              지극한 정성 의전
            </span>
          </div>
          {showSubtitle && (
            <span
              className="text-[13px] font-serif tracking-tight mt-1 hidden md:block"
              style={{ color: colors.subtext }}
            >
              삼가 고인의 명복을 빌며 지극한 정성으로 모십니다
            </span>
          )}
        </div>
      </div>
    );
  }

  // 3. 풀 브랜드 록업 (Full Lockup)
  return (
    <div className={`flex flex-col items-center text-center space-y-2 ${className}`}>
      {renderSymbol(pixelSize, pixelSize)}
      <span
        className="font-reverence font-black tracking-widest leading-tight"
        style={{ fontSize: `${Math.round(pixelSize * 0.45)}px`, color: colors.text }}
      >
        배 웅
      </span>
      {showSubtitle && (
        <span className="text-[13px] font-serif" style={{ color: colors.subtext }}>
          지극한 정성 · 정직원가 의전
        </span>
      )}
    </div>
  );
};
