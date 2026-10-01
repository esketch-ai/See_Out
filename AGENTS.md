# 배웅(Bae-ung) — 작업 규칙

이 저장소는 **노안 유족(50·90세)** 이 현장에서 읽는 서비스다.
설계와 개발은 아래 규칙을 지키는 것을 전제로 한다. 규칙은 실측으로 만들어졌고,
각 항목마다 그것이 왜 생겼는지가 적혀 있다.

## 검증 — 커밋 전에 반드시

```bash
npm run verify        # tsc + vitest(213) + 브라우저 전수 감사
```

브라우저 감사만 따로 돌리려면:

```bash
npm run audit:ui                                  # 빌드하고 띄워서 검사
BASE_URL=https://esketch-ai.github.io/See_Out/ npm run audit:ui:run   # 라이브 검사
```

`npm test` **만으로는 통과해도 된다.** 아래 「단위 테스트가 못 잡는 것」을 참조.

---

## 1. 팔레트 — 이름으로도, hex 로도 우회하지 않는다

**진실의 원천은 `src/web/design-system/tokens.ts` 하나뿐이다.**
새 색을 쓰려면 그 파일에 먼저 등재하고, `tokens.ts` 밖에서는 토큰값만 인용한다.

```tsx
// 금지 — 토큰에 없는 값
className="text-red-300"        // #FCA5A5
style={{ color: '#B5B0A0' }}

// 정본 인용
className="text-[#E08578]"      // rouge.onDarkStrong (묵흑면 긴급 7.17:1)
```

**면(surface)에 따라 토큰이 갈린다.** 이 오독이 실제로 반복됐다.

| 면 | 보조문자 토큰 | 근거 |
|---|---|---|
| 묵흑면 (`#0D0E10` `#141618` `#1F2226`) | `ink.mutedOnDark` `#8A929D` | 6.14:1 |
| 비취면 (`#132B22` `#19382C`) | `pine.muted` `#A8B2A9` | 6.88:1 |

바우처 헤더에 `ink.mutedOnDark` 를 비취면 위에 썼다가 4.07:1 로 떨어졌다.

> **왜 놓쳤나** — `token-drift` 란치는 `#[0-9A-Fa-f]{6}` 만 검사한다.
> `text-red-300` 은 6자리 hex 가 아니라 통과했고, 이름 팔레트 44종 191건이
> 그대로 배포됐다. 이제 이름까지 검사한다(`tests/token-drift.test.ts`).

**중립색 `text-white` `bg-black/*` 는 기능적 스크림 용도로 허용한다.**

---

## 2. 타이포 — 13px 는 하한이다 (N-7)

```tsx
// 금지
className="text-xs"          // Tailwind text-xs = 12px, N-7 위반
className="text-[11px]"

// 최소 — 그리고 반드시 rem
className="text-[0.8125rem]" // 13px — typography.micro, 법적 고지·라벨 한정
```

> **왜 놓쳤나** — N-7 검사기가 `text-[Npx]` 만 세고 `text-xs` 를 통과시켰다.
> 「13px 미만 95건 제거」 라고 보고한 뒤 실제 라이브에서 462건이 더 있었다.
> 지금은 검사기가 이름 스케일까지 본다.

본문은 18px 가 표준(`body`)이다. 13px 를 산문에 쓰지 않는다.

### 2-4. ★ 13px 를 써도 되는 자리와 안 되는 자리

정본이 13px 를 「하한」 으로만 정하고 **누가 13px 를 써도 되는지** 를
정하지 않았다. 그래서 산문 전체가 13px 가 됐다.

| 분류 | 뜻 | 크기 | 판별 기준 |
|---|---|---|---|
| `legal` | 약관·동의·조문·법적 고지 | **13px 유지** | 「약관/규정/동의/제○조」 등 |
| `data` | 날짜·금액·회차·연락처·문서번호 | **13px 유지** | 값 위주, 34자 미만 |
| `chip` | 칩·필터·배지 | 15px | `rounded-full` 계열 |
| `action` | 버튼 안 행동 문구 | 15px | `<button>` 내부 |
| `prose` | 사람이 읽는 문장 | **18px** | `<p>`/`<li>` + 문장 종결 |

측정 결과 1,025건 → prose **142건**(전부 `<p>`·`<li>`) / data 165 / legal 76 /
action 84 / chip 26 / 판단보류 532(동적 표현식 322건 포함).
문장 조건까지 좁히면 승격 대상은 **64건**이었다. 나머지 78건은 짧은 라벨이라
13px 가 맞다.

**남은 `<p>` 13px 104건은 틀린 게 아니다** — 금액·날짜·문서번호 표기다.
전부 금지하면 규칙이 거짓말을 한다. 그래서 **래칫**으로 막는다
(baseline 104, 초과하면 실패).

> **왜 이래야 하나** — 「본문은 18px 가 표준」 이라는 규칙은 있었지만
> **검사기가 없었다.** 정적 검사는 문자열만 세므로 13px 가 산문인지 캡션인지
> 구별하지 못했다. persona QA 가 「최소 본문 13px < 요구 20px」 로
> 드러냈을 때에야 이 분류가 필요해졌다.

**규칙**: 문장(마침표·습니다·입니다·위해·경우)이 `<p>`/`<li>` 안에 있으면
`text-[1.125rem]`. 데이터 표기면 `text-[0.8125rem]`.
반응형 축소(`sm:text-sm`)를 붙이면 데스크톱에서 13~14px 로 되돌아가므로 금지.

### 2-1. ★ font-size 에 px 를 쓰지 않는다

```tsx
// 금지 — 값이 작든 크든
className="text-[13px]"      // 「큰 글씨」 를 따라가지 않는다
```

**px 는 루트 font-size 를 못 받는다.** 그래서 두 곳이 동시에 무력해진다.

| 곳 | 누구인가 | 상태 |
|---|---|---|
| `html.senior-large-font` | 노안 「글씨 확대」 버튼 | 죽어 있었음 |
| OS 글자 크기 설정 | 90세 유족이 실제로 켠다 | 죽어 있었음 |

> **왜 놓쳤나** — 「글씨 확대」 버튼이 **본문 45개 중 21개(47%)만** 키웠다.
> 나머지 24개가 `text-[13px]` 고정 px 였다. **「노안용」 버튼이 노안에게
> 아무 효과가 없는 상태**였고, 정적 검사는 CSS 를 읽지 않으므로 못 봤다.
>
> persona QA(`scripts/qa-personas.mjs`)가 실제로 눌러 보고 발견했다.

**규칙**: `text-[Nrem]` 만 쓴다. 루트 16px 기준 `1px = 0.0625rem`.
정본은 `src/web/design-system/tokens.ts` 의 `typography.fontSizeRem`.

**검사**: `tests/modal-accessibility.test.ts` (px 금지 · rem 하한 · 배율 일치)
+ `scripts/audit-ui.mjs` (글확대 열 — 실제 반응률 90% 이상)

### 2-2. ★ 배율은 정본과 어긋나지 않아야 한다

`index.html` 의 `senior-large-font { font-size: 125% }` 와
`tokens.largeFontScale` 이 갈리면 「노안용」 이 조용히 사라진다.
검사기가 두 값을 비교한다.

### 2-3. ★ 효과는 「측정」 으로만 증명된다

`font-size` 효과를 확인할 때는 아래 세 가지를 **모두** 지킨다.

1. **리플로우를 사이에 둔다** — 동기 블록 안에서 루트 `font-size` 를 바꾸면
   `getComputedStyle` 이 `rem` 을 재해석하지 않는다. `requestAnimationFrame`
   을 두 번await 한다.
2. **텍스트를 Map 키로 쓰지 않는다** — 같은 문구가 두 요소에 있으면 엉뚱한
   것끼리 비교해 통과시킨다.
3. **DOM 을 evaluate 경계로 넘기지 않는다** — 참조가 끊겨 비교가 무의미해진다.

이 세 가지를 지키지 않으면 「조용히 통과한다.」 실제로 세 번 그렇게 당했다.

---

## 3. 모달 — 여는 순간의 계약

팝업은 `ModalShell` 또는 `useModalA11y(onClose, isOpen)` 를 쓴다. 손으로 짜지 않는다.

필수 계약 6가지 — 전부 `scripts/audit-ui.mjs` 가 판정한다.

```
role="dialog" · aria-modal="true" · 포커스 진입 · Tab 비이탈 · ESC 닫힘 · body 잠금 해제
```

### isOpen 을 부모가 소유하면 훅을 먼저 모두 호출한다

```tsx
// 금지 — React #310 으로 화면 전체가 백화면이 된다
const x = useMemo(...);
if (!isOpen) return null;          // ← 이 아래에서 훅을 호출하면 크래시
const y = useMemo(...);            //   「닫힘 → 열림」 전이에서 훅 개수가 늘어
```

**모든 훅을 호출한 뒤에** `return null` 한다.

> **왜 생겼나** — 이 한 줄로 「상속 변호사」 버튼을 누르면 사이트 전체가 죽었다.
> 단위 테스트 213건이 전부 통과했다. 컴포넌트를 렌더하지 않으므로
> 훅 순서를 볼 수 없다. `tests/modal-accessibility.test.ts` 가 정적으로 막는다.

### 조건부 마운트 모달은 `isOpen` 을 셸에 전달한다

`useModalA11y(onClose)` 로 상수를 주면 `isOpen` 이 false 가 되어도 cleanup 이
안 돌아 body 잠금이 남는다. `useModalA11y(onClose, isOpen)` 로 넘긴다.

### 탭 분기 안에 훅을 넣지 않는다

`if (currentTab === 'quote') { ... }` 안쪽에 `useEffect` 를 두면 탭을 바꿀 때
훅 개수가 달라져 같은 #310 으로 죽는다. **조건부 `return` 보다 위, 함수 맨 앞에 둔다.**

> 실제로 이 작업에서저지 않았다. `warmAll` 을 `if (currentTab === ...)` 블록 안에
> 넣었다가 원가 진단 탭이 통째로 백화면이 되었다. 정적 검사기는
> `if (!isOpen) return null` 만 본다 — 탭 분기는 못 잡는다.

### `React.lazy` 는 `lazyModal` 헬퍼로만

`src/web/design-system/LazyModal.tsx` 를 쓴다. 순수 `lazy()` 는 지연이 남아
유족이 「멈췄다」고 판단해 두 번 누른다. 헬퍼는 `preload` 와 `warmAll` 로
포인터 진입·포커스·한가한 시점에 미리 받는다.

`Suspense` 는 탭 컴포넌트의 최상위 `return` 을 한 번만 감싼다. 팝업마다 감싸면
닫는 태그를 놓치기 쉽다.

---

## 4. 감사 도구를 믿기 전에, 감사를 검증한다

`scripts/audit-ui.mjs` 는 **실패할 수 없다면 무의미**하다. 새 검사 항목을
넣거나 판정 기준을 바꾸면 반드시 주입으로 확인한다.

```bash
# 1) 위반을 만든다  2) audit 가 exit 1 로 떨어지는지 본다  3) 되돌린다
python3 - <<'EOF'
f='src/web/components/LegalPolicyModal.tsx'
s=open(f,encoding='utf-8').read()
s=s.replace("text-[#5A5E66]","text-[#DCD6C9]",1)   # 백색 위 1.45:1
open(f,'w',encoding='utf-8').write(s)
EOF
npm run build:web && npx vite preview --port 4310 & sleep 6
node scripts/audit-ui.mjs; echo "exit=$?"   # 1 이어야 한다
git checkout src/web/components/LegalPolicyModal.tsx
```

### 이 감사 도구가 교정한 오독 — 반복하지 말 것

- **그라디언트 위 텍스트.** `backgroundColor` 로는 조회되지 않아 조상을
  합성하면 크림색으로 계산한다. 바우처 헤더가 2.3:1 로 잘못 보고됐다.
  **반드시 `backgroundImage` 를 먼저 본다.** 실제치는 4.1:1 이었고
  그 위에 진짜 결함이 겹쳐 있었다.
- **`page.evaluate(fn, arg)` 는 인자를 하나만 넘긴다.** 색 목록을
  `[CANON, sel]` 로 넘기면 Set 이 비어 「팔레트밖」 이 전부 오탐이 된다.
  `evaluate(fn, { list, rootSel })` 로 객체 하나로 넘긴다.
- **탭·버튼은 인덱스로 찾지 않는다.** 인덱스는 홈 상단에 컴포넌트를 하나
  넣으면 전부 어긋나서 **엉뚱한 버튼을 누른다.** `KmacaWarmHome` 을 연동할 때
  실제로 25개 팝업 중 20개가 트리거를 못 찾았다. 화면 글자로 찾는다
  (`includes()`, 정규식 아님). 그리고 **헤더 탭의 `textContent` 에는 한자가 없다** —
  「禮 眞 安 誠 永」 은 아이콘이라 `textContent` 는 「원가 진단」 이다.
  needle 도 한글로 잡는다.
- **`dist` 가 `src` 보다 낡으면 옛 빌드를 검사한다.** 조용히 통과한다.
  포트를 다른 서버가 물고 있으면 더 심하다 — spawn 은 조용히 죽는데
  fetch 는 그 서버에 닿아 「떴다」 고 판단한다. 실제로 이중 가드로 막았다.

---

## 4-0-1. 폰 폭을 검사한다

감사가 1440px 만 보면 **폰에서만 나는 결함이 영영 안 보인다.**
이 서비스는 폰 우선이다 — 유족 대다수가 390px 에서 읽는다.

실제로 데스크톱 검사에서는 통과하던 히어로 본문이 폰에서 사진 위에 얹혀
읽을 수 없었다. 이제 5개 전 탭을 1440 · 390 양쪽으로 검사한다.

| 폭 | 대상 |
|---|---|
| 1440 | 데스크톱 |
| 390 | 폰 — 유족이 실제 쓰는 폭 |

**이 검사가 처음 돌렸을 때 `truncate` 7건을 잡았다.** 잘림은 폰에서만 나타난다.

---

## 4-0-2. 사진 위 텍스트 — 스크림 50%

텍스트를 `<img>` 위에 올릴 때는 **본문 구간에서 스크림 알파가 최소 50%** 다.

```
// 금지 — 투명 구간이 본문 줄 끝까지 닿는다
<div className="absolute inset-0 bg-gradient-to-r from-[#FAF9F6] to-transparent" />
```

50% 아래로 내려가면 **사진 디테일이 글자 윤곽을 방해한다.** 그때는 유족이
고쳐 읽어야 하고, 50% 위면 사진을 유지한 채 읽힌다.

> **왜 놓쳤나** — 그라디언트 가드는 `backgroundColor` 로 안 잡히므로
> 「가장 불투명한 스톱 하나」 를 대표값으로 삼는다. 대표값이 크면
> 「어디든 덮여 있다」 고 **오독**한다. 히어로를 고쳐도 계속 걸렸다.
> 두 가지가 겹친 까닭이다 — 스크림이 텍스트의 **형제** 인데 가드는
> **조상** 만 찾았다. 그리고 **데스크톱만** 검사했다.
>
> 그래서 판정은 「스크림이 50% 미만으로 내려간 구간」 까지
> 텍스트 상자가 침범하는가 로 한다. `min(알파) >= 0.5` 면 즉시 통과.

---

## 4-1. 텍스트를 잘라 말하지 않는다

```tsx
// 금지 — 노안 유족이 못 읽는다
<span className="truncate">{pkg.vehicleSummary}</span>

// 정찰이라는 약속을 지켜야 하는 자리
<span className="min-w-0 break-words">{pkg.vehicleSummary}</span>
```

`truncate` 는 「무엇이 포함되는가」 를 읽게 하라는 정찰의 목적을 무너뜨린다.
아이콘과 나란한 flex 행이면 부모도 `items-start` 로 바꿔야 줄이 맞는다.

> 실제 사례 — 장례식장 주소와 정찰 패키지 10개 항목이 잘려 있었다.

---

## 4-2. 펼침/접기에는 aria-expanded

`모달 아님 (탭 내 인라인 흐름)` 으로 판정되는 disclosure 버튼은
`aria-expanded` 와 `aria-controls` 를 함께 단다. 스크린리더 사용자는
「명세 펼치기」 라는 문구만으로 지금 열려 있는지 알 수 없다.

닫기 버튼도 같은 단어를 쓰지만 **모달 안**에 있다. 감사 도구는 `[role=dialog]`
내부를 제외하고 판정해 둘을 구분한다.

---

## 5. 단위 테스트가 못 잡는 것

`vitest` 는 컴포넌트를 렌더하지 않는다. 문자열과 정규식으로만 본다.
아래는 **테스트 213건이 전부 통과한 상태로 배포된 실제 결함**이다.

| 결함 | 규모 | 잡는 곳 |
|---|---|---|
| 훅 순서 위반 → 클릭 시 백화면 | 1건 | `tests/modal-accessibility.test.ts` |
| `text-xs` 12px | 462건 | `tests/modal-accessibility.test.ts` (N-7) |
| 이름 팔레트 (`text-red-300` 등) | 191건 | `tests/token-drift.test.ts` |
| 대비 미달 (비취면 위 ink 토큰) | 7건 | `scripts/audit-ui.mjs` |
| 그라디언트 위 대비 오독 | 도구 결함 | `scripts/audit-ui.mjs` |
| **사진 위 본문 (스크림 50% 미만)** | 1건 | `scripts/audit-ui.mjs` |
| **「글씨 확대」 절반 무효 (px 고정)** | 24건 | `tests/` + `audit-ui.mjs` (글확대) |
| **persona 과제 실패** | 12명 × 9여정 | `scripts/qa-personas.mjs` |
| **폰에서만 나는 `truncate` 잘림** | 7건 | `scripts/audit-ui.mjs` (390px) |
| **잘린 화면을 조용히 통과시키는 감사** | 도구 결함 | `scripts/audit-ui.mjs` (dist·포트 가드) |
| 버튼 인덱스 기반 트리거 → 엉뚱한 버튼 | 도구 결함 | `scripts/audit-ui.mjs` (화면 글자 탐색) |
| **rem 효과를 못 재는 측정** | 도구 결함 | 리플로우·키·경계 세 가지 (§2-3) |
| **본문이 13px** (정본은 18px) | 64곳 | §2-4 분류 → `text-[1.125rem]` |

**문자열로 보이면 놓친다. 화면을 열어 재야 나온다.**
구조·색·폰트는 `npm run audit:ui` 가 단언한다.

---

## 6. 카피

- 「듀얼 스탠바이」 → **「이중안심(二重安心)」**. `main` 확정한 용어다.
- 죽은 분신 duel 같은 기계어를 유족에게 쓰지 않는다.
- 「고인의 곁을 지킵니다」 류의 1인칭 존대 어조를 유지한다.

---

## 정본 문서

- `docs/_para/20_areas/design-token-canonical-2026.md` — AREA-DESIGN-2026-009
- `src/web/design-system/tokens.ts` — 색·타이포·간격의 유일한 원천
- `src/web/components/ModalShell.tsx` — 모달 계약의 유일한 원천

규칙을 바꿀 때는 문서·토큰·감사를 **같이** 고친다. 셋이 어긋나면
감사가 조용히 통과하고 그 공백으로 다음 결함이 들어온다.
