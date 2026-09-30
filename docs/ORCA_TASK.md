# [Orca 에이전트 전용 작업 지시서] 메인 홈 밝고 따뜻한 시안 A (KMACA 포털형) 연동 및 최적화

> **수신자**: Orca AI Coding Agent (`/Users/ssh/Documents/Develope/SeeOut/seasnake` 워크스페이스)  
> **발신자**: Antigravity 페어 프로그래밍 에이전트  
> **목적**: 어둡고 텍스트 위주였던 기존 메인 홈을 **한국상조공제조합(KMACA) 스타일의 밝고 따뜻한 가족 동행형 포털(시안 A)**로 최종 연동하고, 검증 통과(`npm run verify`)까지 완수한다.  
> **핵심 원칙**: 텍스트 70% 축소, 고화질 따뜻한 실사 비주얼 우선, 노안 유족(50·90세) 접근성 100% 보장.

---

## 📌 0. 사전 준비 완료된 에셋 및 컴포넌트 현황 (즉시 사용 가능)

이미 필요한 모든 고품질 이미지와 검증된 React 컴포넌트가 워크스페이스에 생성·커밋되어 있습니다. 새로 생성할 필요 없이 바로 임포트하여 연결하면 됩니다.

### ① UI 이미지 에셋 (`public/images/`)
- `public/images/hero_warm_family_banner.jpg` (16:9 와이드): 아침 햇살을 받는 3대 가족의 온화한 미소 (좌측 텍스트 여백 완비)
- `public/images/video_story_thumb.jpg` (16:9 와이드): 한옥 창가의 어르신 다큐 & 원형 재생 버튼 오버레이
- `public/images/service_tiles_bundle.jpg`: 3대 서비스 타일 일러스트

### ② 검증된 구현 컴포넌트 (`src/web/components/`)
- `src/web/components/KmacaWarmHome.tsx`:
  - 13px 하한선 (N-7), 텍스트 줄임(`truncate`) 금지, `tokens.ts` 정본 토큰 100% 준수
  - 1. 와이드 가족 배너 + 한지 소프트 크림 그라디언트 + 즉시 출동 CTA
  - 2. KMACA형 5대 대형 퀵 아이콘 바 (원가 진단, 장례식장, 정찰 패키지, 이중안심, 긴급 접수)
  - 3. KMACA 시그니처 3열 분할 그리드:
    - 1열: 다큐멘터리 영상 카드 (클릭 시 전용 팝업 호출)
    - 2열: 공지사항 & FAQ 2탭 인터랙션 위젯
    - 3열: 신속 의전 / 50만 원 바우처 / 전문 심리상담 / 상속 전문 변호사 4대 직통 타일
  - 4. 단아한 4대 안심 보증 헌장 배너

---

## 🛠️ 1. Orca가 수행해야 할 핵심 작업 (Task Checklist)

### [Task 1] `NormalMode.tsx`의 `'home'` 탭에 `KmacaWarmHome` 연동
- **대상 파일**: `src/web/components/NormalMode.tsx`
- **구현 내용**:
  `currentTab === 'home'` 렌더링 영역 상단에 `<KmacaWarmHome ... />`을 배치하고, 기존 팝업 및 탭 이동 핸들러를 바인딩합니다.
  ```tsx
  <KmacaWarmHome
    onOpenQuoteDiagnostics={() => onSelectTab('quote')}
    onOpenFuneralHallSearch={() => onSelectTab('funeral-halls')}
    onOpenFixedPackages={() => onSelectTab('packages')}
    onOpenDualStandby={() => setIsDualStandbyModalOpen(true)}
    onOpenVoucher={() => setIsVoucherModalOpen(true)}
    onOpenCare={(vertical) => {
      setCareModalVertical(vertical);
      setIsCareModalOpen(true);
    }}
    onEnterEmergency={onEnterEmergency}
  />
  ```

### [Task 2] 기존 단위 테스트(회귀 방지) 구조 준수
- **주의 사항**:
  `tests/modal-accessibility.test.ts`와 `tests/traditional-craft.test.ts`는 정적 정규식으로 `NormalMode.tsx` 파일 내에 아래 요소들이 존재하는지 검사합니다.
  1. `k-card-heritage` 클래스를 가진 4개의 서비스 카드 `<button type="button" onClick={() => onSelectTab(...)`
  2. `k-screen-panel k-corner-bracket` (3일차 절차도 패널 3면)
  3. `k-card-heritage k-changho-texture`
- **해결 방안**:
  `KmacaWarmHome`을 상단 핵심 포털 화면으로 전면 배치하되, 기존 4대 의전 도록 카드와 3일장 절차도는 하단 **"배웅 상세 의전 둘러보기"** 아코디언 또는 보조 섹션으로 유지하여 단위 테스트 244건을 100% 통과하도록 구성하십시오.

### [Task 3] 훅(Hooks) 호출 순서 계약 준수 (React #310 크래시 방지)
- `AGENTS.md` 명시 사항: `NormalMode.tsx`의 모든 `useState`, `useEffect` 등 훅은 컴포넌트 최상단에서 무조건 먼저 호출되어야 합니다.
- `if (currentTab === 'quote') return ...` 같은 조건문 아래에서 훅을 호출하면 절대 안 됩니다.

---

## 🚨 2. 엄격 준수 제약사항 (`AGENTS.md`)

1. **팔레트 규칙**:
   - `src/web/design-system/tokens.ts`에 등재되지 않은 임의의 HEX 색상이나 Tailwind 이름 색상(`text-red-300`, `#2D5A46` 등) 사용 금지.
   - 반드시 정본 토큰(`celadon.deep: #19382C`, `celadon.mid: #2D4F43`, `hanji.surface: #FAF9F6`, `ink.DEFAULT: #151719`, `ink.muted: #5A5E66`, `porcelain: #FFFFFF` 등)만 인용.
2. **타이포그래피 하한선 (N-7)**:
   - 13px 미만 금지 (`text-xs`(12px) 완전 금지, 본문 최소 `text-[13px]`, `text-sm`, `text-base` 적용).
3. **텍스트 줄임 금지**:
   - 노안 유족의 정보 누락을 막기 위해 `truncate` 클래스 사용 금지. `min-w-0 break-words` 사용.
4. **모달 및 인터랙션 접근성**:
   - 열림/닫힘 disclosure 버튼에는 `aria-expanded` 및 `aria-controls` 필수 적용.

---

## 🧪 3. 검증 명령어 및 완료 기준

작업 완료 후 반드시 터미널에서 아래 검증을 실행하여 0건의 에러가 나와야 합니다:

```bash
npm run verify
```

- **세부 통과 기준**:
  1. `npm run build` (`tsc`): 타입 에러 0건
  2. `npm test` (`vitest`): 244개 테스트 **전체 통과 (Pass 244 / 244)**
  3. `npm run audit:ui`: Playwright 기반 팝업 25종 및 페이지 5개 브라우저 전수 실측 감사 **위반 0건**
