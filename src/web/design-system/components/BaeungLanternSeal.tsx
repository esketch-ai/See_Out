import React from 'react';

interface BaeungLanternSealProps {
  size?: number;
  className?: string;
  theme?: 'gold' | 'jade' | 'red';
}

/**
 * 배웅(Bae-ung) 공식 증서 인장 — [시안 2: 창호와 등불 (Lattice Window & Lantern)]
 * 
 * - 한옥 세살문 창호 격자 + 어둠을 밝히는 은은한 호롱불(등불)
 * - 사전 안심 등록증, 해약환급금 내용증명, 공인 바우처의 공식 직인 엠블럼으로 활용
 */
export const BaeungLanternSeal: React.FC<BaeungLanternSealProps> = ({
  size = 48,
  className = '',
  theme = 'gold'
}) => {
  const palette = {
    gold: {
      border: '#C2A26A',
      bg: '#141618',
      flame: '#C2A26A',
      lattice: '#9E7D47',
      glow: '#F5EBD8'
    },
    jade: {
      border: '#2D4F43',
      bg: '#19382C',
      flame: '#FAF9F6',
      lattice: '#2D4F43',
      glow: '#DCE8E2'
    },
    red: {
      border: '#8B2520',
      bg: '#FAF9F6',
      flame: '#8B2520',
      lattice: '#D4665A',
      glow: '#FAF0EF'
    }
  }[theme];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      role="img"
      aria-label="배웅 창호와 등불 공식 인장"
    >
      {/* 외곽 전통 정사각 창호 프레임 */}
      <rect
        x="3"
        y="3"
        width="94"
        height="94"
        rx="8"
        fill={palette.bg}
        stroke={palette.border}
        strokeWidth="3.5"
      />
      {/* 이중 테두리 장식 */}
      <rect
        x="9"
        y="9"
        width="82"
        height="82"
        rx="4"
        stroke={palette.lattice}
        strokeWidth="1.2"
        strokeOpacity="0.7"
      />

      {/* 전통 세살문 격자 라인 (Traditional Latticework Grid) */}
      <line x1="22" y1="9" x2="22" y2="91" stroke={palette.lattice} strokeWidth="1.2" strokeOpacity="0.45" />
      <line x1="78" y1="9" x2="78" y2="91" stroke={palette.lattice} strokeWidth="1.2" strokeOpacity="0.45" />
      <line x1="9" y1="22" x2="91" y2="22" stroke={palette.lattice} strokeWidth="1.2" strokeOpacity="0.45" />
      <line x1="9" y1="78" x2="91" y2="78" stroke={palette.lattice} strokeWidth="1.2" strokeOpacity="0.45" />

      {/* 중앙 원형 창호 원훈 (Central Circle) */}
      <circle
        cx="50"
        cy="50"
        r="28"
        fill={palette.bg}
        stroke={palette.border}
        strokeWidth="2.5"
      />
      <circle
        cx="50"
        cy="50"
        r="23"
        stroke={palette.lattice}
        strokeWidth="1"
        strokeDasharray="2 3"
        strokeOpacity="0.6"
      />

      {/* 중앙 호롱 등불 몸체 (Traditional Lantern Structure) */}
      {/* 1. 등불 갓 (Lantern Top Cap) */}
      <path
        d="M 39 39 Q 50 34 61 39 L 58 42 L 42 42 Z"
        fill={palette.border}
      />
      <path d="M 47 35 L 53 35 L 50 32 Z" fill={palette.border} />

      {/* 2. 등불 유리창 & 불꽃 (Lantern Glass & Gentle Flame) */}
      <rect
        x="42"
        y="42"
        width="16"
        height="22"
        rx="2"
        fill={palette.border}
        fillOpacity="0.2"
        stroke={palette.border}
        strokeWidth="1.5"
      />

      {/* 은은한 호롱불 불꽃 (Glowing Flame) */}
      <path
        d="M 50 45 C 47 50, 45 54, 47 58 C 48.5 61, 51.5 61, 53 58 C 55 54, 53 50, 50 45 Z"
        fill={palette.flame}
      />
      <circle cx="50" cy="56" r="2" fill="#FAF9F6" />

      {/* 3. 등불 받침대 (Lantern Base) */}
      <path
        d="M 41 64 L 59 64 L 62 68 L 38 68 Z"
        fill={palette.border}
      />
    </svg>
  );
};
