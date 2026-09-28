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
 * [조형 철학: 맞잡은 두 손과 비상 (Clasped Hands & Soaring Crane)]
 * - 1950년대 이전 세대 유족의 가장 따뜻한 기억 소환:
 *   "부모님의 거칠고 주름진 손을 마지막으로 꼭 잡아드리던 가슴 벅찬 체온과 안도감"
 * - 하단의 다정한 두 손의 맞잡음과, 상단으로 고통 없는 하늘을 향해 날아오르는
 *   백학(白鶴)의 날갯짓이 배웅의 첫 자음 'ㅂ'을 완벽한 대칭과 조화로 형성.
 * - 온전한 사랑과 효(孝), 그리고 존엄한 배웅의 약속을 상징.
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
      main: '#FAF9F6',
      accent: '#C2A26A',
      stroke: '#19382C',
      eye: '#141618',
      text: '#FAF9F6',
      subtext: '#8A929D'
    },
    light: {
      bg: '#FAF9F6',
      border: '#DCD6C9',
      main: '#19382C',
      accent: '#9E7D47',
      stroke: '#FAF9F6',
      eye: '#19382C',
      text: '#151719',
      subtext: '#6E5429'
    },
    gold: {
      bg: '#141618',
      border: '#3D382E',
      main: '#FAF9F6',
      accent: '#C2A26A',
      stroke: '#141618',
      eye: '#FAF9F6',
      text: '#FAF9F6',
      subtext: '#C2A26A'
    }
  }[theme];

  // 1. 단독 심볼 마크 (Icon Symbol: 맞잡은 두 손과 비상)
  const renderSymbol = (w: number, h: number) => (
    <svg
      width={w}
      height={h}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
      role="img"
      aria-label="배웅 맞잡은 두 손과 비상 브랜드 심볼"
    >
      {/* 백그라운드 라운드 타일 */}
      <rect
        x="2"
        y="2"
        width="96"
        height="96"
        rx="22"
        fill={colors.bg}
        stroke={colors.border}
        strokeWidth="2.5"
      />

      {/* 중심 온기 아우라 */}
      <circle cx="50" cy="52" r="24" fill={colors.accent} fillOpacity="0.08" />

      {/* 1. 좌측 날개 및 팔: 비상하는 날개와 감싸는 팔 */}
      {/* 상단 첫째 깃털 */}
      <path
        d="M 46 36 C 38 26, 32 16, 28 14 C 29 22, 33 30, 40 38 Z"
        fill={colors.main}
      />
      <path d="M 31 18 Q 36 28 42 37" stroke={colors.accent} strokeWidth="1.8" strokeLinecap="round" />

      {/* 중간 둘째 깃털 */}
      <path
        d="M 42 42 C 32 32, 23 23, 19 20 C 20 28, 25 38, 35 45 Z"
        fill={colors.main}
      />
      <path d="M 23 25 Q 28 35 36 44" stroke={colors.accent} strokeWidth="1.8" strokeLinecap="round" />

      {/* 외곽 셋째 깃털 및 좌측 팔 감싸안음 */}
      <path
        d="M 37 48 C 26 40, 18 32, 15 29 C 15 39, 20 50, 27 58 C 23 63, 25 70, 31 77 C 36 82, 42 85, 48 85 C 50 85, 48 80, 45 79 C 41 78, 36 75, 33 71 C 29 65, 30 59, 33 55 C 37 51, 41 48, 45 46 Z"
        fill={colors.main}
      />
      <path d="M 18 34 Q 22 44 28 52" stroke={colors.accent} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M 28 60 Q 34 72 44 80" stroke={colors.accent} strokeWidth="1.8" strokeLinecap="round" />

      {/* 2. 우측 학 머리와 목선, 우측 날개 및 팔 */}
      {/* 학의 머리와 S자 목선, 황동빛 목깃 */}
      <path
        d="M 46 44 C 52 44, 57 39, 58 29 C 59 23, 58 19, 61 17 C 63 16, 67 18, 77 12 C 70 18, 66 22, 65 27 C 63 36, 56 46, 48 50 Z"
        fill={colors.main}
      />
      <path d="M 60 21 Q 61 31 54 43" stroke={colors.accent} strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="63.5" cy="18.5" r="1.3" fill={colors.eye} />

      {/* 우측 날개깃과 우측 팔 감싸안음 */}
      <path
        d="M 63 28 C 70 24, 77 30, 80 37 C 74 37, 71 42, 68 48 C 74 43, 80 47, 81 54 C 77 56, 73 60, 68 64 C 73 68, 73 74, 68 79 C 63 83, 57 85, 52 85 C 50 85, 52 80, 55 79 C 59 78, 64 76, 66 72 C 68 68, 66 64, 62 60 L 60 56 C 65 52, 68 46, 63 41 Z"
        fill={colors.main}
      />
      <path d="M 75 32 Q 72 41 66 49" stroke={colors.accent} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M 77 47 Q 73 54 66 60" stroke={colors.accent} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M 69 66 Q 64 74 54 80" stroke={colors.accent} strokeWidth="1.8" strokeLinecap="round" />

      {/* 3. 맞잡은 두 손: 체온과 영원한 약속 */}
      {/* 윗손 엄지와 손바닥 곡선 */}
      <path
        d="M 33 60 C 39 56, 47 57, 53 62 C 55 64, 54 67, 50 68 C 45 66, 39 64, 33 65 Z"
        fill={colors.accent}
      />

      {/* 아랫손 네 손가락의 정성스러운 감싸안음 */}
      {/* 검지 */}
      <path
        d="M 43 65 C 47 67, 53 70, 58 68 C 60 67, 60 65, 57 64 C 53 65, 48 65, 43 63 Z"
        fill={colors.main}
        stroke={colors.stroke}
        strokeWidth="0.8"
      />
      {/* 중지 */}
      <path
        d="M 41 69 C 45 71, 51 74, 56 72 C 58 71, 58 69, 55 68 C 51 69, 46 69, 41 67 Z"
        fill={colors.main}
        stroke={colors.stroke}
        strokeWidth="0.8"
      />
      {/* 약지 */}
      <path
        d="M 39 73 C 43 75, 49 78, 54 76 C 56 75, 56 73, 53 72 C 49 73, 44 73, 39 71 Z"
        fill={colors.main}
        stroke={colors.stroke}
        strokeWidth="0.8"
      />
      {/* 소지 */}
      <path
        d="M 38 77 C 42 79, 47 82, 51 80 C 53 79, 53 77, 50 76 C 46 77, 42 77, 38 75 Z"
        fill={colors.main}
        stroke={colors.stroke}
        strokeWidth="0.8"
      />

      {/* 4. 마음의 중심에 맺힌 온기의 불씨 */}
      <circle cx="49" cy="51" r="2.8" fill={colors.accent} />
      <circle cx="49" cy="51" r="1.2" fill={colors.main} />
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
