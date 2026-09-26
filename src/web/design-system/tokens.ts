/**
 * 배웅(Bae-ung) 디자인 토큰 명세서
 * 34년 전통시각디자인연구원 조성우 수석 디자이너 제정 철학 헌장 준수
 */

export const BAEUNG_DESIGN_TOKENS = {
  // 1. 한국 전통 사색(四色) 및 기능 배색
  colors: {
    // 배경
    hanji: '#FAF8F5',             // 닥종이 한지 미색 (기본 배경)
    porcelain: '#FFFFFF',         // 조선 백자 순백 (카드 표면)
    
    // 텍스트 (먹색)
    deepInk: '#1F2226',           // 서예 진먹색 (WCAG AAA 고대비 주 텍스트)
    lightInk: '#4B5259',          // 중간 먹색 (보조 텍스트)
    mutedInk: '#6C757D',          // 은은한 먹빛 (설명 및 각주)
    borderInk: '#E3DFD7',         // 정갈한 창호살 테두리선
    
    // 브랜드 및 의전 상징색
    celadon: {
      light: '#E2ECE8',           // 은은한 청자빛
      base: '#2D4F43',            // 단청 비취록 (신뢰와 경건)
      dark: '#243F35',            // 깊은 비취록 (헤더/강조)
      deep: '#1C312A',            // 심야 비취 (어두운 배경)
      night: '#13221D'
    },
    
    // 고려 황동금 (예우와 품위)
    nobleGold: {
      soft: '#F6F1E6',            // 은은한 황동 미색
      light: '#C5A880',           // 밝은 금박선
      base: '#94784C',            // 고려 황동금 (전통 유기빛)
      dark: '#7F673E',            // 짙은 황동
      deep: '#695532'
    },

    // 비상 및 인장색
    crimson: {
      soft: '#FDF2F2',            // 연한 인주색
      base: '#A33B32',            // 전통 인주홍 (낙관 전각 인장)
      dark: '#8A2F27'             // 짙은 인주홍 (긴급 핫라인)
    },

    // 애도 묵흑
    mourning: {
      charcoal: '#212529',
      slate: '#16191D',
      midnight: '#0E1012'         // 비상 모드 배경
    }
  },

  // 2. 5대 핵심 전각 낙관 (전통 인장 시스템)
  seals: {
    courtesy: {
      character: '禮',
      hanja: '예도 례',
      meaning: '지극한 예우와 경건함 (종합 의전)',
      colorVariant: 'red'
    },
    truth: {
      character: '眞',
      hanja: '참 진',
      meaning: '거짓 없는 참된 실비 공개 (원가 진단)',
      colorVariant: 'gold'
    },
    peace: {
      character: '安',
      hanja: '편안할 안',
      meaning: '고인과 유족의 편안한 안식처 (장례식장)',
      colorVariant: 'jade'
    },
    sincerity: {
      character: '誠',
      hanja: '정성 성',
      meaning: '처음부터 끝까지 변함없는 정성과 신뢰 (정찰제)',
      colorVariant: 'red'
    },
    eternity: {
      character: '永',
      hanja: '길 영',
      meaning: '영원히 잊히지 않을 존엄한 기억 (생애기록관)',
      colorVariant: 'gold'
    },
    mourningCondolence: {
      character: '謹弔',
      hanja: '삼가 근, 조상할 조',
      meaning: '삼가 고인의 명복을 빌며 곁을 지킴',
      colorVariant: 'red'
    }
  },

  // 3. 타이포그래피 규격
  typography: {
    fontFamilies: {
      reverenceSerif: '"Noto Serif KR", Georgia, serif',
      modernSans: '"Pretendard Variable", Pretendard, -apple-system, sans-serif'
    },
    // 노안 배려 기본 크기 (rem)
    fontSize: {
      caption: '0.75rem',         // 12px
      small: '0.875rem',          // 14px
      body: '1.0625rem',          // 17px (기본 본문)
      bodyLarge: '1.1875rem',     // 19px
      subheading: '1.375rem',     // 22px
      title: '1.625rem',          // 26px
      headline: '2.125rem',       // 34px
      hero: '2.75rem'             // 44px
    },
    lineHeight: {
      tight: 1.3,
      normal: 1.65,
      relaxed: 1.85               // 시니어 피로도 완화 넉넉한 행간
    }
  },

  // 4. 시니어 터치 인체공학 규격 (WCAG 2.1 AAA)
  ergonomics: {
    minTouchTargetPx: 64,         // 최소 64dp 안전 터치 높이
    seniorZoomScale: 1.22,        // 돋보기 모드 시 122% 전역 스케일링
    buttonPaddingYPx: 16,
    buttonPaddingXPx: 24,
    cardRadiusPx: 24              // 완만한 백자 곡선미
  }
} as const;

export type BaeungSealKey = keyof typeof BAEUNG_DESIGN_TOKENS.seals;
export type BaeungSealVariant = 'red' | 'gold' | 'jade';
