/**
 * 배웅(Bae-ung) 디자인 토큰 정본 (Single Source of Truth)
 *
 * 정본 문서: docs/_para/20_areas/design-token-canonical-2026.md
 * 문서 번호: AREA-DESIGN-2026-009
 * 상태: Approved (강민석 총괄 지휘자 승인, 2026-09-27)
 *
 * ■ 이 파일이 유일한 진실이다.
 *   index.html 의 Tailwind 인라인 설정과 src/ 하위의 임의 HEX 는
 *   모두 본 토큰에 정렬되어야 하며, tests/token-drift.test.ts 가
 *   회귀를 차단한다.
 *
 * ■ 중재 기법: 「배제」가 아니라 「재위상(再位相)」
 *   단청 비취록 3안(AREA-DESIGN-005/007/008 이 각각 다른 값 지정)은
 *   색상환상 H 157~159° 로 동일 축 위의 명도 차이에 불과했다.
 *   3개 값을 폐기하지 않고 deep/DEFAULT/mid 3단계로 배정하여
 *   3개 문서의 의도를 동시에 충족시킨다.
 *
 * ■ 제정: 조성우 수석디자이너 (전통시각디자인, 34년)
 *   검수: 한수진 박사 (인지공학, 30년) · 이정환 박사 (상장례 예법, 33년)
 */

export const BAEUNG_DESIGN_TOKENS = {
  meta: {
    docNumber: 'AREA-DESIGN-2026-009',
    status: 'Approved',
    approvedOn: '2026-09-27',
    approvedBy: '강민석 총괄 지휘자'
  },

  // ─────────────────────────────────────────────────────────────
  // 1. 색상 (AREA-DESIGN-2026-009 §3)
  //    각 값 옆 실측은 한지 #F7F5F0 기준, 묵흑면은 #0D0E10 기준
  // ─────────────────────────────────────────────────────────────
  colors: {
    // 한지·먹 계열 — 채면 (AREA-DESIGN-2026-009 §3-1)
    hanji: {
      DEFAULT: '#F7F5F0',   // 닥종이 한지 미색 · 앱 기본 배경
      surface: '#FAF9F6',   // 보조 표면 · 묵흑면 본문 겸용 (18.34:1)
      page: '#F1EDE3'       // 서면 톤 스텝 · 백자와 1.10:1 (§5.3-1)
    },
    porcelain: '#FFFFFF',    // 조선 백자 순백 · 카드 표면

    ink: {
      deep: '#0E1012',       // 최암부 (한지면 17.50:1 AAA)
      DEFAULT: '#151719',    // 수묵 진먹 · 주 본문 (16.49:1 AAA)
      light: '#42464E',      // 보조 본문 (8.69:1 AAA)
      muted: '#5A5E66',      // 각주·설명 (5.97:1 AA) — 2026 정정, 구 #727782/#6C757D 는 AA 미달
      border: '#DCD6C9',     // 장식적 보조선 (1.55:1) — 1.4.11 비적용
      borderOnDark: '#3D382E', // 묵흑면 장식 보조선 (묵흑 1.68:1 / 보조면 최저 1.39:1)
      //  ※ 「온기 있는 묵색」 9색이 H34~42° 동일 축으로 흩어져 있었다(L31~53%).
      //    구 #23201B 는 보조면 #1E2125 위에서 1.00:1 로 사실상 보이지 않았다.
      //    9색 모두 이 한 값으로 수렴시킨다.
      mutedCeremonial: '#A69E8F', // 의전적 어두운 면 보조 (빈소 키오스크·보전 바우처)
      //  ※ mutedOnDark(한랭) 와 구분되는 값. 이쪽은 「표시」 면이라
      //    무채색 온기를 유지해 팔레트 정합을 지킨다. 라벨:값 쌍이 아닌 자리에만 쓴다.
      onDark: '#FAF9F6',     // 묵흑면 본문 (18.34:1 AAA)
      mutedOnDark: '#8A929D', // 묵흑면 보조 (비상 6.14:1 / 보조면 4.95:1 / 톱바 5.87:1)
      //  ※ 한랭 회색(H215°)을 택한 이유: 묵흑면의 강조색은 고려 황동(H38°)과
      //    단청 비취(H150°)로 이미 따뜻하다. 보조 텍스트까지 따뜻하면 금박과
      //    색조가 겹쳐 「라벨:값」 쌍의 위계가 무너진다. 색상환상으로 분리한다.
    },

    // 단청 비취록 — 3단계 재위상 (AREA-DESIGN-2026-009 §3-3)
    celadon: {
      deep: '#19382C',       // 900 · 채면 최암부 · 헤더/풋터/인장 금테 (흰글자 12.78:1)
      DEFAULT: '#243F35',    // 700 · 브랜드 시그니처 · 주 CTA · 활성 상태 (흰글자 11.43:1)
      mid: '#2D4F43',        // 500 · 인라인 강조 (흰글자 9.09:1) · 묵흑면 사용 금지 (2.13:1)
      tint: '#DCE8E2',       // 연 청자빛 채색
      muted: '#A8B2A9',     // 어두운 비취 면 위 보조문자 (배너 #132B22 대비 6.88:1)
      night: '#0A1511'       // 심야 비취
    },

    // 고려 황동금 — 역할 분리 (AREA-DESIGN-2026-009 §3-5)
    brass: {
      surface: '#F1E9DB',    // 연금 면 채색
      gold: '#9E7D47',       // 인장 금테·장식선·≥24px 대제목 전용 (한지면 3.52:1)
      text: '#6E5429',       // 황동 톤 본문 텍스트 전용 (한지면 6.50:1)
      dark: '#876937',       // 짙은 황동
      onDark: '#C2A26A',     // 금박선 · 어두운 면 전용 (묵흑면 7.97:1 / 백자면 2.42:1 불가시)
      onLight: '#8A6A33',    // 금박선 · 밝은 면 전용
      onGoldTint: '#F5EBD8'  // 금박 알파 배경(15~20%) 위 밝은 글자 (합성면 대비 14.7:1)
      //  ※ 「금박 20% 알파 배경」은 합성하면 거의 검은 면이 된다.
      //    그 위에 밝은 글자를 올리는 구성이므로 금박 고유값이 아닌
      //    「금박 위」 전용 밝은 톤으로 분리한다.
    },

    // 궁중 주사 인주 — 24시 긴급·전각 인장 (AREA-DESIGN-2026-009 §3-4)
    cinnabar: {
      soft: '#FAF0EF',       // 연 인주색 채색
      DEFAULT: '#8B2520',    // 한지면 8.09:1 AAA · 묵흑면 2.19:1 금지
      dark: '#731C18',       // 짙은 인주
      press: '#B4453A',      // 눌림·비활성
      onDark: '#D4665A',     // 묵흑면 경고문 (5.38:1 AA)
      onDarkStrong: '#E08578'// 묵흑면 핵심 긴급 (7.17:1 AAA)
    },

    // 애도 묵흑 — 비상 모드 전용 (AREA-DESIGN-2026-009 §3-6)
    mourning: {
      ink: '#0B0C0E',        // 최암부 그림자
      DEFAULT: '#0D0E10',    // 비상 모드 루트 배경
      slate: '#141618',      // 헤더 톱바
      charcoal: '#1F2226'    // 비상 모드 보조 면
    },

    // 조작 대상 컨트롤 경계 (AREA-DESIGN-2026-009 §5.2)
    // 유일하게 WCAG 1.4.11 3:1 을 충족하는 회갈색. 장식선에 쓰지 않는다.
    control: {
      border: '#8F8878'      // 한지면 3.23:1 · 백자면 3.52:1
    }
  },

  // ─────────────────────────────────────────────────────────────
  // 2. 전각 낙관 (篆刻落款) — 6봉인 체계 (AREA-DESIGN-2026-009 §7)
  //    헌장 기둥 4 는 5대를 기재하나, 서비스의 핵심 축인 謹弔 을 포함한다.
  // ─────────────────────────────────────────────────────────────
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

  // ─────────────────────────────────────────────────────────────
  // 3. 타이포그래피 (AREA-DESIGN-2026-009 §4-1)
  //    「단계 분리」로 17px / 18~20px / 20~24px 3자 모순을 소멸시켰다.
  //    20~24px 는 UI 라벨·버튼, 18~20px 는 산문, 24px 산문은 금지(N-8).
  // ─────────────────────────────────────────────────────────────
  typography: {
    fontFamilies: {
      reverenceSerif: '"Noto Serif KR", Georgia, serif',
      modernSans: '"Pretendard GOV Variable", "Pretendard Variable", Pretendard, "Noto Sans KR", -apple-system, sans-serif'
    },
    fontSizePx: {
      micro: 13,             // 법적 고지·일자 형태 한정 (N-7)
      caption: 15,           // 각주·법적 고지
      label: 17,             // 라벨·데이터 전용. 산문 금지
      body: 18,              // 본문 표준
      bodyLarge: 20,         // 본문 기본
      subheading: 22,        // 소제목
      title: 24,             // 카드 제목
      headline: 28,          // 섹션 대제목
      hero: 40               // 히어로 배너
    },
    // ─────────────────────────────────────────────────────────────
    //  ★ font-size 에 px 를 쓰지 않는다 — rem 으로만 쓴다.
    //
    //  왜: px 는 루트 font-size 를 못 받는다. 그래서 두 곳이 무력해진다.
    //     ① html.senior-large-font (노안 「글씨 확대」 버튼)
    //     ② 운영체제 글자 크기 설정 — 90세 유족이 실제로 그걸 켠다
    //  실제로 ① 이 절반밖에 안 먹었다. 본문 45개 중 21개(47%)만 커졌고,
    //  나머지 24개는 text-[0.8125rem] 고정 px 였다. 「노안용」 버튼이 노안에게
    //  아무 효과가 없는 상태였다.
    //
    //  규칙: text-[Npx] 금지. text-[Nrem] 만 쓴다.
    //  검사: tests/modal-accessibility.test.ts (N-7) · scripts/audit-ui.mjs
    //
    //  루트 16px 기준. 1px = 0.0625rem
    fontSizeRem: {
      // ── 13px 가 허용되는 자리 ──────────────────────────────
      //  법적 고지 · 데이터 표기 · 칩/필터 · 버튼 안 행동 문구.
      //  산문(문장)에 쓰지 않는다. 18px 가 그 상한이다.
      micro: 0.8125,         // 13px — 법적 고지·데이터·라벨 (N-7 하한)
      caption: 0.9375,       // 15px — 각주
      // ── 13px 가 금지되는 자리 ──────────────────────────────
      //  사람이 「읽는」 글자. 1,025건 중 산문으로 분류된 64곳을 이 값으로 올렸다.
      body: 1.125,           // 18px — 본문 표준
      bodyLarge: 1.25,       // 20px — 60·70대
      label: 1.0625,         // 17px — 라벨·데이터 전용
      subheading: 1.375,     // 22px
      title: 1.5,            // 24px
      headline: 1.75,        // 28px
      hero: 2.5              // 40px
    },
    // micro 를 써도 되는 자리를 판별하는 기준 (tests 래칫이 이걸 지킨다)
    microAllowedIn: ['legal', 'data', 'chip', 'action'],
    microBannedIn: ['prose'],
    proseAtMicroBaseline: 62,
    // 「글씨 확대」 배율. senior-large-font 가 이 값을 1.25 로 올린다.
    largeFontScale: 1.25,
    // ─────────────────────────────────────────────────────────────
    //  최소 탭 영역 (손 떨림)
    //
    //  WCAG 2.2 AA 는 24px 다. 그건 「엄격한 WCAG 채점」 이고 이 서비스의
    //  유족에게는 모자라다. 실제로 푸터 약관 5종이 30px 로 측정됐다.
    //  약관은 이용자 동의의 근거 문서라 오타르면 안 된다.
    //
    //  ★ rem 으로 적는다 — px 면 「큰 글씨」 를 따라가지 못한다 (§2-1).
    //    탭 영역은 글자가 아니라 「손이 가는 곳」 이라 함께 커져야 한다.
    // ─────────────────────────────────────────────────────────────
    tapTargetPx: {
      min: 48,       // 60대 이상. WCAG 2.2 권고(44)보다 여유를 둔다
      elderly: 56    // 80·90대. 클릭 정밀도가 급격히 떨어진다
    },
    lineHeight: {
      tight: 1.3,
      normal: 1.65,
      relaxed: 1.85          // 시니어 피로도 완화
    }
  },

  // ─────────────────────────────────────────────────────────────
  // 4. 시니어 인체공학 규격 (AREA-DESIGN-2026-009 §4-2, §4-3, §4-4)
  // ─────────────────────────────────────────────────────────────
  ergonomics: {
    minTouchTargetPx: 64,          // 주 행동 요소 기본값 (N-6)
    denseTouchTargetPx: 56,        // 밀집 목록행 예외
    minTouchTargetAAPx: 44,        // WCAG 2.2 AAA 하한
    seniorZoomScale: 1.25,         // 전역 돋보기 125% (구 122% 폐기)
    buttonPaddingYPx: 16,
    buttonPaddingXPx: 24
  },

  // ─────────────────────────────────────────────────────────────
  // 5. 라운드 (AREA-DESIGN-2026-009 §4-4)
  //    24px 전면 적용은 헌장 기둥 1 「번쩍거림 배제」 위반이다.
  //    「24px = 종이」 규칙으로 의전 문서 면에만 쓴다. (N-10)
  // ─────────────────────────────────────────────────────────────
  radius: {
    control: 8,                   // 버튼·입력·칩
    card: 12,                     // 일반 정보 카드
    panel: 16,                    // 히어로·섹션 대형 패널
    document: 24                  // A4 평전·등록증·바우처 한정
  }
} as const;

export type BaeungSealKey = keyof typeof BAEUNG_DESIGN_TOKENS.seals;
export type BaeungSealVariant = 'red' | 'gold' | 'jade';
export type BaeungColorPath =
  | 'hanji.DEFAULT' | 'hanji.surface' | 'hanji.page' | 'porcelain'
  | 'ink.deep' | 'ink.DEFAULT' | 'ink.light' | 'ink.muted' | 'ink.border' | 'ink.borderOnDark'
  | 'ink.mutedCeremonial' | 'ink.onDark' | 'ink.mutedOnDark'
  | 'celadon.deep' | 'celadon.DEFAULT' | 'celadon.mid' | 'celadon.tint' | 'celadon.muted' | 'celadon.night'
  | 'brass.surface' | 'brass.gold' | 'brass.text' | 'brass.dark' | 'brass.onDark' | 'brass.onLight' | 'brass.onGoldTint'
  | 'cinnabar.soft' | 'cinnabar.DEFAULT' | 'cinnabar.dark' | 'cinnabar.press'
  | 'cinnabar.onDark' | 'cinnabar.onDarkStrong'
  | 'mourning.ink' | 'mourning.DEFAULT' | 'mourning.slate' | 'mourning.charcoal'
  | 'control.border';

/** 토큰 경로 문자열로 실제 색 값을 조회한다 (테스트·검증 도구용) */
export function tokenColor(path: BaeungColorPath): string {
  const segments = path.split('.') as [keyof typeof BAEUNG_DESIGN_TOKENS.colors, string];
  const group = BAEUNG_DESIGN_TOKENS.colors[segments[0]];
  if (typeof group === 'string') return group;
  return (group as Record<string, string>)[segments[1]];
}

/** 정본에 수록된 모든 색 값을 평탄화해 반환한다 (드리프트 검사용) */
export function allTokenColors(): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [group, value] of Object.entries(BAEUNG_DESIGN_TOKENS.colors)) {
    if (typeof value === 'string') {
      out[group] = value;
    } else {
      for (const [step, hex] of Object.entries(value)) {
        out[`${group}.${step}`] = hex;
      }
    }
  }
  return out;
}
