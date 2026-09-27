# 디자인 토큰 중재 및 문서 정합화 (Design Token Arbitration & Documentation Harmonization)
Status: Active
Assignee: @조성우_수석디자이너 · @강민석_총괄아키텍트

## Overview

`AREA-DESIGN-2026-005` / `006` / `007` / `008` 및 `src/web/design-system/tokens.ts` 사이에 **8개 항목의 상호 모순된 수치**가 미해소 상태로 공존하고 있다. 본 프로젝트는 세 문서(문서 권위 / 현행 코드 / 제3자 중재) 중 어느 하나를 일방적으로 채택하지 않고, **WCAG 2.1 정량 측정 + 전통 조형 논리**를 근거로 각 모순을 개별 중재하여 **단일 정본(Canonical) 토큰 체계**를 제정한다.

중재 결과는 `docs/_para/20_areas/design-token-canonical-2026.md` (AREA-DESIGN-2026-009)에 수록하며, 이는 이후 모든 화면 작업의 유일한 기준선이 된다.

### 중재 필요 사유 (발견 경위)

| # | 항목 | 코드 값 | 문서 값 | 모순도 |
|---|---|---|---|---|
| 1 | 한지 배경 | `#F7F5F0` | `#FAF8F5` (3개 문서 일치) | 중 |
| 2 | 단청 비취록 | `#19382C` | `#243F35` / `#2D4F43` | **3자 상이** |
| 3 | 전통 인주홍 | `#8B2520` | `#A33B32` (3개 문서 일치) | 중 |
| 4 | 고려 황동금 | `#9E7D47` | `#94784C` | 약 |
| 5 | 본문 폰트 | 17px | 18~20px / 20~24px | **3단 상이** |
| 6 | 터치 타깃 | 60px | 64px / 56dp | **3단 상이** |
| 7 | 전역 돋보기 | 122% | 125% (2개 문서) | 경 |
| 8 | 카드 라운드 | 12px | 24px | 중 |

### 중재 과정에서 신규 발견된 4건의 접근성 결함 (원래 부재)

1. **고려 황동금 `#9E7D47` (3.52:1) · `#94784C` (3.82:1) 은 본문 텍스트 기준 WCAG AA 4.5:1 미달** — 두 문서 모두 본문 텍스트 색으로 지정하여 규격 위반 상태였다.
2. **보조 먹색 `#727782` (4.12:1) · `#6C757D` (4.30:1) 역시 AA 미달** — 헌장이 `color.text.mutedInk: #6C757D`로 지정한 값이 각주 텍스트 기준 미달이었다.
3. **금박선 `#C2A26A`는 백자·한지 면에서 2.22~2.42:1로 사실상 불가시** — 코드의 40여 곳 금박선 사용처 대부분이 백자 카드 위에 있어 위조 가독성을 야기한다.
4. **인주홍은 묵흑(비상) 배경 위에서 2.19:1로 전무** — 묵흑 면에 인주 적용 시 무가독. 묵흑 전용 밝은 변형이 토큰에 존재하지 않는다.
5. **카드 경계는 한지 면 대비 최대 2.45:1로 WCAG 1.4.11(3:1) 구조적 불만족** — 아래 §5 참조.

## Key Deliverables

- [x] Task 1: 8개 모순 항목 전수 조사 및 코드/문서 출처 대조표 작성
- [x] Task 2: 전 후보 색상 24건에 대한 WCAG 2.1 정량 대비 측정 수행
- [x] Task 3: 전통 조형 논리(AREA-DESIGN-2026-006) 관점에서의 중재 논거 수립
- [x] Task 4: 단일 정본 토큰 체계 제정 — `20_areas/design-token-canonical-2026.md`
- [x] Task 5: 마스터 명세 위원 경력 표기 오류 정정 (정본: `advisory-board-governance.md`)
- [x] Task 6: 기존 3개 디자인 문서에 정복(supercession) 교차 참조 삽입
- [x] Task 7: 누락 PARA 디렉터리(`00_inbox` / `40_archive` / `20_areas/templates`) 복구
- [ ] Task 8: 코드 정합화 — `tailwind.config.ts` 분리, 40여 곳 하드코딩 HEX를 토큰 참조로 전환 (**차기 라운드**)
- [ ] Task 9: 헌장 3기둥 「창호살격」 미구현분(`k-corner-bracket` · `k-changho-texture`) 실구현 (**차기 라운드**)
- [ ] Task 10: 접근성 결함 4건 코드 수정 (**차기 라운드**)

## 거버넌스 상태

- **중재 완료 · 총괄 승인 대기**: `advisory-board-governance.md` §의사결정 프로세스 1항에 따라, 본 문서는 강민석 총괄 지휘자의 최종 승인 전까지 `Status: Draft` 효력만 갖는다.
- **코드 반영 금지**: Task 8~10 착수 전까지 `src/` 하위는 일절 수정하지 않는다 (`.karpathyrules` 4원칙 — 점진적 확장).

## References
- `docs/_para/20_areas/design-token-canonical-2026.md` (산출물 · AREA-DESIGN-2026-009)
- `docs/_para/20_areas/advisory-board-governance.md` (위원회 구성 및 승인 절차 · 경력 정본)
- `docs/_para/20_areas/baeung-design-philosophy-charter.md` (AREA-CHARTER-2026-008)
- `docs/_para/20_areas/senior-reverence-design-system.md` (AREA-DESIGN-2026-005)
- `docs/_para/20_areas/traditional-aesthetic-cleanliness-guideline.md` (AREA-DESIGN-2026-006)
- `docs/_para/20_areas/master-uiux-redesign-specification.md` (AREA-SPEC-2026-007)
- `src/web/design-system/tokens.ts` (현행 코드 미러)
- `index.html:16-93` (Tailwind 인라인 설정 · 실효 정의부)
