/**
 * ■ persona 기반 QA/QC — «사람이 몇 명이고 어떤 상황인가» 를 먼저 세운다.
 *
 *   이 서비스의 유족은 30대부터 90대까지, 도심 1인부터 4인 가족까지,
 *   초고속 광케이블부터 3G까지 편차가 크다. 화면을 한 번만 보고
 *   「이상 없음」 을 말하는 검사는 이 편차를 전혀 재현하지 못한다.
 *
 * ■ 왜 별도 하네스인가
 *   scripts/audit-ui.mjs  는 「화면이 규칙을 어겼나」 를 본다. 정적 규칙이므로 빠르다.
 *   여기서는 「그 사람이 실제로 과제를 끝낼 수 있었나」 를 본다. 느리다. 그래서 분리한다.
 *   판정이 다르면 결함의 성격이 다르다 — 규칙 위반과 통과 실패는 다른 수리다.
 *
 * ■ persona 가 만드는 차이
 *   같은 페이지라도 사람마다 다른 것이 실패다.
 *     · 세대가 크면 최소 본문 크기 · 최소 탭 영역 · 허용 오클릭 수가 달라진다.
 *     · 시골 독거면 대역폭·CPU 제한이 걸리고 「느려도 멈추지 않는가」 가 문제가 된다.
 *     · 가족 동거면 「혼자 결정할 수 있는가」, 1인이면 「되돌아갈 곳이 있는가」 가 관건이다.
 *     · 손 떨림이 있으면 44px 도 작다. 48px 이상을 요구한다.
 *
 * ■ 이 스크립트가 잡아낼 수 없는 것 (정직하게 밝힌다)
 *   · 진짜 슬픔·공포·시간 압박. 시뮬레이션은 그걸 재현하지 못한다.
 *   · 실제 OLED 화질·야간 모드·ANGES装了 앱 안에서의 경험.
 *   · 스크린리더 사용자의 실제 청취 경험. 무障碍 트리 구조만 본다.
 *   그래서 이 산출물은 「증거」 지 「증명」 이다.
 *
 * ■ 실행
 *   node scripts/qa-personas.mjs                    # 전체 persona × 여정
 *   node scripts/qa-personas.mjs --persona P90F     # 특정 persona 만
 *   node scripts/qa-personas.mjs --journey 긴급접수  # 특정 여정 만
 *   BASE_URL=https://... node scripts/qa-personas.mjs   # 라이브 대상
 *   OUT=qa-report.md node scripts/qa-personas.mjs       # 마크다운 보고서 저장
 */

import { chromium } from 'playwright';
import { existsSync, statSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';

const ROOT = process.cwd();
const PORT = Number(process.env.QA_PORT ?? 4311);
const ORIGIN = `http://localhost:${PORT}`;
const LIVE = process.env.BASE_URL || null;
const BASE_URL = LIVE || `${ORIGIN}/`;
const OUT = process.env.OUT || '';

// ── 인자 ────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const argOf = (f) => { const i = argv.indexOf(f); return i >= 0 ? argv[i + 1] : null; };
const ONLY_PERSONA = argOf('--persona');
const ONLY_JOURNEY = argOf('--journey');

// ★ 기준선 본문 크기는 나이로 갈리지 않는다 — 18px 하나다.
//   나이별 임계값(16/18/20)을 두었던 적이 있는데, 그건 「큰 글씨」 토글의
//   일을 검사가 대신하는 것이었다. 토글은 125% 를 얹으므로 90세에게 22.5px 이
//   실제로 보인다. 사다리를 두면 둘이 어긋나고, 어느 쪽이 정본인지 흐려진다.
//   법적으로 맞는 방식도 이것이다 — 「조건을 정한 쪽」 이 조명을 고려해야 한다.
const BODY_MIN = 18;

// ════════════════════════════════════════════════════════════════════
//  1. PERSONA — 사람을 만든다
// ════════════════════════════════════════════════════════════════════
// tap   : 손 떨림을 고려한 최소 탭 영역 px (WCAG 2.2 AA 는 24, AA 대상자 권고는 44)
const PC = 'fast-4g';
const SLOW = 'slow-3g';
// ★ 실제 시골의 값으로 정정했다. very-slow-2g(2초 RTT · 60KB/s) 는
//   현장치가 아니라 최악 경계다. 그 값으로 persona 를 만들면
//   「17초 만에 첫 버튼」 이 시골 현실처럼 보고된다 — 그게 오독이다.
const RURAL = 'rural-3g';   // 400ms RTT · 1Mbps — 시골 최다수
const SUPER_SLOW = 'very-slow-2g'; // 최악 케이스 전용 (1명만 남긴다)

const PERSONAS = [
  // ── 30~40대:speed와 편의 우선. 이들의 불만은 「내용이 많다」「깊이 없다」 다.
  {
    id: 'P30M', gen: '30대 남성', living: '도시 · 가족(배우자·자녀) 동거',
    goal: '부모님 장례 비용을 훔치지 않고 비교하고 싶다',
    device: '최신 플래그십', vp: { w: 390, h: 844 }, dpr: 3,
    net: PC, cpu: 1,
    tap: 44, body: BODY_MIN, maxClicks: 12, maxSec: 90,
    largeFont: false, voice: false,
  },
  {
    id: 'P40F', gen: '40대 여성', living: '도시 · 1인 거주',
    goal: '비용 정직성만 빠르게 확인하고 바로 결정하고 싶다',
    device: '최신 smartphone', vp: { w: 390, h: 844 }, dpr: 3,
    net: PC, cpu: 1,
    tap: 44, body: BODY_MIN, maxClicks: 12, maxSec: 90,
    largeFont: false, voice: false,
  },

  // ── 50대: 장례를 생애로 경험한 세대. 「아는 서비스」 라는 전제가 있다.
  {
    id: 'P50M', gen: '50대 남성', living: '도시 · 가족 동거',
    goal: '부모님 3일장 정식 의전을 크게 키우지 않고 하고 싶다',
    device: '중고 smartphone', vp: { w: 390, h: 844 }, dpr: 2,
    net: PC, cpu: 2,
    tap: 44, body: BODY_MIN, maxClicks: 14, maxSec: 120,
    largeFont: false, voice: false,
  },
  {
    id: 'P50F', gen: '50대 여성', living: '시골 · 1인 거주',
    goal: '우리 동네 식장과 비용을 먼저 알아야 전화하려고 한다',
    device: '저사양 smartphone', vp: { w: 360, h: 640 }, dpr: 2,
    net: RURAL, cpu: 3,
    tap: 44, body: BODY_MIN, maxClicks: 16, maxSec: 240,
    largeFont: false, voice: false,
  },

  // ── 60대: 도달 정점이 아니라 시작점. 여기서부터 「읽힘」 이 문제가 된다.
  {
    id: 'P60F', gen: '60대 여성', living: '도시 · 1인 거주',
    goal: '혼자서도 장례 전 과정을 끝까지 알아서 진행해 볼까 싶다',
    device: '구형 Android', vp: { w: 360, h: 640 }, dpr: 2,
    net: SLOW, cpu: 3,
    tap: 48, body: BODY_MIN, maxClicks: 16, maxSec: 240,
    largeFont: true, voice: false,
  },
  {
    id: 'P60M', gen: '60대 남성', living: '도시 · 가족 동거',
    goal: '딸·아내와 함께 정하는 걸 내가 정리해 놓고 싶다',
    device: '중고 smartphone', vp: { w: 390, h: 844 }, dpr: 2,
    net: PC, cpu: 2,
    tap: 48, body: BODY_MIN, maxClicks: 14, maxSec: 150,
    largeFont: true, voice: false,
  },

  // ── 70대: 손 떨림 · 시력 저하 · 낯선 조작이 겹친다.
  {
    id: 'P70F', gen: '70대 여성', living: '시골 · 1인 거주',
    goal: '남편이 떠나서 혼자 장례를 치러야 한다',
    device: '저사양 smartphone', vp: { w: 360, h: 640 }, dpr: 2,
    net: RURAL, cpu: 4,
    tap: 48, body: BODY_MIN, maxClicks: 18, maxSec: 300,
    largeFont: true, voice: false,
  },
  {
    id: 'P70M', gen: '70대 남성', living: '도시 · 1인 거주',
    goal: '요양병원에서 갑작스럽게 연락이 왔다. 지금 뭐부터 해야 하지',
    device: '구형 Android', vp: { w: 390, h: 844 }, dpr: 2,
    net: SLOW, cpu: 3,
    tap: 48, body: BODY_MIN, maxClicks: 14, maxSec: 240,
    largeFont: true, voice: false,
  },

  // ── 80대: 클릭 정밀도가 급격히 떨어진다. 44px 는 안전하지 않다.
  {
    id: 'P80F', gen: '80대 여성', living: '도시 · 자녀와 동거',
    goal: '자녀가 시켜준 것을 그대로 따라 끝까지 하겠다',
    device: '고대 smartphone', vp: { w: 390, h: 844 }, dpr: 2,
    net: SLOW, cpu: 3,
    tap: 56, body: BODY_MIN, maxClicks: 16, maxSec: 300,
    largeFont: true, voice: true,
  },
  {
    id: 'P80M', gen: '80대 남성', living: '시골 · 1인 거주',
    goal: '전화 한 통이 어디로 가는지 모르겠다. 사람 말을 듣고 싶다',
    device: '저사양 smartphone', vp: { w: 360, h: 640 }, dpr: 1.5,
    net: RURAL, cpu: 5,
    tap: 56, body: BODY_MIN, maxClicks: 16, maxSec: 360,
    largeFont: true, voice: true,
  },

  // ── 90대: 「마우스 정밀」 개념이 거의 없다. 큰 것, 단순한 것, 전화.
  {
    id: 'P90F', gen: '90대 여성', living: '도시 · 1인 거주 (자녀가 주간 방문)',
    goal: '화면이 잘 보여야 한다. 복잡하면 손을 댄다',
    device: '고대 smartphone (글자 크게 설정됨)', vp: { w: 390, h: 844 }, dpr: 2,
    net: SLOW, cpu: 4,
    tap: 56, body: BODY_MIN, maxClicks: 14, maxSec: 360,
    largeFont: true, voice: true,
  },
  {
    id: 'P90M', gen: '90대 남성', living: '시골 · 1인 거주',
    goal: '누가 내가 딸이라고 불러줬으면 좋겠다',
    device: '저사양 smartphone', vp: { w: 360, h: 640 }, dpr: 1.5,
    net: SUPER_SLOW, cpu: 6,
    tap: 56, body: BODY_MIN, maxClicks: 14, maxSec: 420,
    largeFont: true, voice: true,
  },
];

// ════════════════════════════════════════════════════════════════════
//  2. JOURNEY — 사람이 「끝내야 하는 일」
// ════════════════════════════════════════════════════════════════════
// step 은 사람이 하는 동작이다. 그리고 done 은 「성공」 의 정의.
//   done 에 못 미치면 실패다. 화면이 예뻤는지는 SUCCESS 가 아니다.

const clickText = (text, note) => ({ k: 'click', text, note });
const tabTo = (text) => ({ k: 'tab', text });

const JOURNEYS = [
  {
    id: '긴급접수',
    goal: '방금 임종했습니다. 지금 당장 의전 접수를 끝내야 합니다',
    critical: true,
    steps: [
      clickText('24시 긴급 의전 접수', '헤더의 긴급 진입'),
      { k: 'wait', ms: 900 },
      { k: 'assert', text: '고인 계신 곳' },
      clickText('자택', '가장 흔한 장소'),
      { k: 'type', placeholder: '서울아산병원', value: '전북 전주시 완산구 한마음로 12' },
      clickText('다음: 모실 장례식장 선택'),
      { k: 'assert', text: '모실 장례식장' },
      clickText('의전 출동 접수 완료'),
      { k: 'wait', ms: 1200 },
      { k: 'assert', text: 'DSP-' },
    ],
    done: '접수번호(DSP-)가 발급되었다',
  },
  {
    id: '장례식장찾기',
    goal: '동네(또는 시) 장례식장을 찾아 비교하고 싶다',
    critical: true,
    steps: [
      tabTo('장례식장'),
      { k: 'wait', ms: 800 },
      { k: 'type', placeholder: '장례식장 명칭 또는 지역', value: '서울' },
      { k: 'wait', ms: 700 },
      { k: 'click', text: '무빈소 직송', optional: true },
      { k: 'assertAny', list: ['무빈소', '장례식장', '검색'] },
      { k: 'countAtLeast', selector: 'button', n: 1 },
    ],
    done: '검색 결과가 최소 1곳 이상 보인다',
  },
  {
    id: '비용진단',
    goal: '기존 상조비가 얼마나 더 나오는지 알고 싶다',
    critical: true,
    steps: [
      tabTo('원가 진단'),
      { k: 'wait', ms: 800 },
      clickText('보람상조 450 실물 증서', '샘플 증서로 즉시 시도'),
      { k: 'wait', ms: 1400 },
      { k: 'assertAny', list: ['판독', '일치도', '총비용', '환급'] },
      { k: 'openModal', text: '이중안심 등록증' },
      { k: 'assertDialog' },
    ],
    done: '진단 결과가 나오고, 추가保护的證 (이중안심) 모달이 열린다',
  },
  {
    id: '패키지선택',
    goal: '몇만 원 규모에 맞는 패키지가 얼마인지 알고 싶다',
    critical: false,
    steps: [
      tabTo('정찰 패키지'),
      { k: 'wait', ms: 800 },
      clickText('친지 30~50인', '규모 선택'),
      clickText('3일 일반장', '기간 선택'),
      { k: 'wait', ms: 500 },
      clickText('5대 영역별', '상세 원가 아코디언 — 기본 열림이라 접으려 시도. 라벨이 「명세 닫기」 로 바뀐다'),
      { k: 'wait', ms: 600 },
      { k: 'assertAny', list: ['원가', '명세', '선택됨'] },
    ],
    done: '추천 패키지가 정해지고 상세 명세를 펼칠 수 있다',
  },
  {
    id: '바우처받기',
    goal: '사망insurance 해약 손실 보전 바우처를 받고 싶다',
    critical: true,
    steps: [
      clickText('50만 원 손실 보전 바우처', '홈 하단 권익 보호'),
      { k: 'wait', ms: 900 },
      { k: 'assertDialog' },
      { k: 'assertAny', list: ['바우처', '손실', '50'] },
    ],
    done: '바우처 모달이 열린다',
  },
  {
    id: '상속상담',
    goal: '상속이 말썽이 됐으니 변호사 상담을 받고 싶다',
    critical: false,
    steps: [
      clickText('상속 전문 변호사', '홈 하단 법률 자문'),
      { k: 'wait', ms: 900 },
      { k: 'assertDialog' },
      { k: 'type', placeholder: '홍길동', value: '김영수', optional: true },
      { k: 'click', text: '1:1 상담 예약', optional: true },
    ],
    done: '상속 상담 모달이 열리고 예약 경로에 들어갈 수 있다',
  },
  {
    id: '약관환불',
    goal: '환불 규정과 수수료가 뭔지 알고 싶다',
    critical: false,
    steps: [
      clickText('서비스 이용약관', '푸터'),
      { k: 'wait', ms: 900 },
      { k: 'assertDialog' },
      { k: 'type', placeholder: '약관 내 키워드 검색', value: '환급' },
      { k: 'wait', ms: 500 },
      { k: 'assertAny', list: ['환급', '일치하는', '검색'] },
    ],
    done: '약관이 열리고 키워드 검색이 결과를 준다',
  },
  {
    id: '부고발송',
    goal: '장례 소식을 알려야 할 사람들에게 보내고 싶다',
    critical: false,
    steps: [
      tabTo('생애기록관'),
      { k: 'wait', ms: 900 },
      clickText('모바일 부고장', '생애기록관 내부 탭'),
      { k: 'wait', ms: 700 },
      { k: 'assertAny', list: ['부고', '연락처'] },
    ],
    done: '생애기록관 안에서 부고장 화면에 들어갈 수 있다',
  },
  {
    id: '음성도움',
    goal: '눈에 안 띄면 소리라도 들어야 한다',
    critical: false,
    voiceOnly: true,
    steps: [
      { k: 'click', text: '음성 안내 열기', optional: true },
      { k: 'wait', ms: 900 },
      { k: 'assertAny', list: ['음성', '말씀', '버튼'] },
    ],
    done: '음성 안내를 열 수 있다',
  },
];

// ════════════════════════════════════════════════════════════════════
//  3. 측정 — 사람이 「실제로」 겪는 것만 잰다
// ════════════════════════════════════════════════════════════════════

// 한 화면에서 사람이 감지하는 숫자들을 한 번에 모은다.
const PROBE = ([p_body, p_tap]) => {
  const out = { taps: [], bodies: [], prose: [], hScroll: false, tinyCount: 0, unlabeled: 0, unl: [], ariaName: 0 };
  const vw = document.documentElement.clientWidth;

  // 가로 넘침 — 세로 화면만 사용하는 사람에게는 치명적이다
  out.hScroll = document.documentElement.scrollWidth > vw + 2;

  for (const el of document.querySelectorAll('button, a[href], [role=button], input, select, textarea')) {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    const r = el.getBoundingClientRect();
    if (r.width <= 0 || r.height <= 0) continue;
    // 산문 안의 인라인 링크는 탭 영역 판정에서 제외한다 — audit-ui.mjs 와
    // 같은 규칙이어야 한다. 두 도구의 기준이 다르면 「고친 쪽만 조용해진다」.
    // 패딩은 단축값이 아니라 개별 축으로 본다 (「0px」 이 아니라 「0px 0px…」 이 온다).
    if (el.tagName === 'A' && cs.display.startsWith('inline')
        && parseFloat(cs.paddingTop) === 0 && parseFloat(cs.paddingLeft) === 0) continue;
    // 이름 없는 조작 요소 — 스크린리더·음성 사용자에게 존재하지 않는 것처럼 보인다
    const name = (el.getAttribute('aria-label') || el.textContent || el.getAttribute('title') || '').replace(/\s+/g, ' ').trim();
    // 진짜 눌리는 높이만 본다. 「누가 작냐」 를 알아야 고칠 수 있으므로 이름을 함께 실어 보낸다
    if (name) out.taps.push({ h: Math.round(r.height), w: Math.round(r.width), name: name.slice(0, 22) });
    if (!name) { out.unlabeled++; out.unl.push((el.tagName + (el.className || '')).toString().slice(0, 46)); }
    if (el.getAttribute('role') || el.getAttribute('aria-label')) out.ariaName++;
  }

  // 본문 성격의 텍스트만 본다 (라벨·메타 제외)
  for (const el of document.querySelectorAll('p, li, td, th, label, dd, dt, span')) {
    const direct = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 3);
    if (!direct) continue;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) < 0.3) continue;
    const r = el.getBoundingClientRect();
    if (r.width <= 0) continue;
    const px = parseFloat(cs.fontSize);
    if (!px) continue;
    out.bodies.push(px);
    // ★ 산문과 표기를 구분해야 한다. 13px 는 법적 고지·데이터 표기에 허용된다
    //   (AGENTS.md §2-4). 둘을 섞으면 「어딘가에 13px 가 있다」 만 남아
    //   판단할 수 없는 신호가 되고, 진짜 산문 문제가 묻힌다.
    // 태그가 p/li 여도 「문장」 이 아니면 데이터 표기다 — 금액·날짜·문서번호.
    // AGENTS.md §2-4 의 분류와 같은 기준을 쓴다.
    const txt = (el.textContent || '').trim();
    const sentence = txt.length >= 24 || /[.。]$|습니다|입니다|드립니다|있습니다/.test(txt);
    if ((el.tagName === 'P' || el.tagName === 'LI') && sentence) out.prose.push(px);
    if (px < 13) out.tinyCount++;
  }
  return out;
};

// 「글씨 확대」 가 실제로 글씨를 키우는가 — 이 서비스의 핵심 보조기능이다.
//
// ★ 측정을 세 번 잘못했다. 전부 조용히 통과했다.
//   ① 동기 블록 안에서 루트 font-size 를 바꾸면 rem 이 재해석되지 않는다.
//      getComputedStyle 은 스타일만 계산하고 레이아웃을 강제하지 않는다.
//   ② 텍스트를 Map 키로 쓰면 중복 문구가 엉뚱한 요소끼리 비교된다.
//   ③ evaluate 경계로 DOM 을 넘기면 참조가 끊겨 비교가 무의미해진다.
//   전부 「페이지 안에서 + 리플로우를 사이에 두고 + 순서로」 하면 해결된다.
const FONT_EFFECT = async () => {
  const vis = (el) => {
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return cs.display !== 'none' && cs.visibility !== 'hidden' && r.width > 0 && r.height > 0;
  };
  const grab = () =>
    [...document.querySelectorAll('p,span,li,h1,h2,h3,h4,h5,h6,label,td,th,button,a')]
      .filter((el) => vis(el) && [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 3))
      .map((el) => ({ t: (el.textContent || '').trim().slice(0, 18), px: parseFloat(getComputedStyle(el).fontSize) }));
  const raf = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

  document.documentElement.classList.remove('senior-large-font');
  await raf();
  const before = grab();
  document.documentElement.classList.add('senior-large-font');
  await raf();
  const after = grab();
  document.documentElement.classList.remove('senior-large-font');

  let scaled = 0;
  const stuck = [];
  const n = Math.min(before.length, after.length);
  for (let i = 0; i < n; i++) {
    if (after[i].px > before[i].px + 0.5) scaled++;
    else if (before[i].px !== after[i].px) stuck.push(`${before[i].t} ${before[i].px}→${after[i].px}`);
  }
  return { scaled, total: before.length, stuck: stuck.slice(0, 6) };
};

// 느린 대역폭에서 「멈춘 화면」 이 남는가 — 시골 독거 유족이 제일 많이 겪는다
const LOADING_STALL = () => {
  const txt = document.body.innerText || '';
  return {
    // 무한 로딩 스피너만 있고 내용물이 없는 상태
    spinnerOnly:
      !!document.querySelector('[class*=animate-spin],[aria-busy=true]') && txt.trim().length < 120,
    hasRetry: /다시\s*(시도|로딩|새로고침)|재시도|다시\s*열기/.test(txt),
    blank: txt.trim().length < 40,
  };
};

const A11Y_TREE = () => {
  const names = [];
  for (const el of document.querySelectorAll('button, a[href], [role=button], input, select, textarea')) {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    const r = el.getBoundingClientRect();
    if (r.width <= 0 || r.height <= 0) continue;
    const n = (el.getAttribute('aria-label') || el.textContent || el.getAttribute('title') || '').replace(/\s+/g, ' ').trim();
    names.push(n || '(이름없음)');
  }
  return names;
};

// ════════════════════════════════════════════════════════════════════
//  4. 서버 기동 — 오독 방어
// ════════════════════════════════════════════════════════════════════
function assertDistFresh() {
  const idx = join(ROOT, 'dist', 'index.html');
  if (!existsSync(idx)) throw new Error('dist/index.html 이 없다 — npm run build:web 를 먼저 돌려라');
  const distT = statSync(idx).mtimeMs;
  let newest = 0;
  const walk = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      if (e.name === 'node_modules' || e.name.startsWith('.')) continue;
      const f = join(d, e.name);
      if (e.isDirectory()) walk(f);
      else newest = Math.max(newest, statSync(f).mtimeMs);
    }
  };
  walk(join(ROOT, 'src'));
  if (newest > distT) {
    throw new Error(`dist 가 src 보다 ${Math.round((newest - distT) / 1000)}초 낡다 — 옛 빌드를 검사한다. npm run build:web 를 먼저 돌려라.`);
  }
}

async function startPreview() {
  if (LIVE) return null;
  try {
    const pre = await fetch(ORIGIN + '/', { redirect: 'follow' });
    if (pre.status < 500) throw new Error(`${PORT} 포트에 이미 서버가 떠 있다 — 엉뚱한 빌드를 검사할 수 있다.`);
  } catch (e) {
    if (String(e?.message || '').includes('이미 서버')) throw e;
  }
  assertDistFresh();
  const proc = spawn('npx', ['vite', 'preview', '--port', String(PORT)], { cwd: ROOT, stdio: 'ignore' });
  for (let i = 0; i < 60; i++) {
    await sleep(500);
    try {
      const r = await fetch(ORIGIN + '/', { redirect: 'follow' });
      if (r.status < 500) return proc;
    } catch { /* 아직 */ }
  }
  proc.kill('SIGTERM');
  throw new Error(`preview 가 ${PORT} 에서 뜨지 않았다`);
}

// ════════════════════════════════════════════════════════════════════
//  5. 실행
// ════════════════════════════════════════════════════════════════════
// CDP 규격: latency(ms) · downloadThroughput · uploadThroughput (bytes/sec)
const NET = {
  'fast-4g': { latency: 40, downloadThroughput: 12.5 * 1024 * 1024, uploadThroughput: 3 * 1024 * 1024 },
  'slow-3g': { latency: 250, downloadThroughput: 1.5 * 1024 * 1024, uploadThroughput: 750 * 1024 },
  // 실제 시골 3G. 측정했다 「첫 버튼 2.7초」 — 감내 가능한 값이다
  'rural-3g': { latency: 400, downloadThroughput: 1 * 1024 * 1024, uploadThroughput: 512 * 1024 },
  'very-slow-2g': { latency: 2000, downloadThroughput: 60 * 1024, uploadThroughput: 60 * 1024 },
};

async function findByText(p, text) {
  // 정규식이 아니라 includes(). 한글 정규식은 깨지는 일이 실제로 있었다.
  const t = text.replace(/\s+/g, '');
  const h = await p.evaluateHandle((want) => {
    const all = [...document.querySelectorAll('button, a[href], [role=button]')].filter(
      (x) => x.offsetWidth > 0 || x.offsetHeight > 0,
    );
    const norm = (s) => (s || '').replace(/\s+/g, '');
    // ★ 빈 문자열은 절대 후보에서 뺀다. norm('') 은 모든 문자열에 포함되므로
    //   hamburger 같은 아이콘 버튼이 매번 잡히고, 탭 이동이 아니라 메뉴를 연다.
    //   실제로 이 하네스가 몇 차례 엉뚱한 버튼을 눌렀다.
    const vis = all.filter((x) => norm(x.textContent).length > 0);
    let el = vis.find((x) => norm(x.textContent).includes(want));
    if (!el) {
      el = all.find((x) => norm(x.getAttribute('aria-label') || x.getAttribute('title')).includes(want));
    }
    return el || null;
  }, t);
  const el = h.asElement();
  return el;
}

async function runJourney(p, persona, journey) {
  const P_BODY = persona.body;
  const P_TAP = persona.tap;
  const ctx = await p.context().newPage?.();
  const r = {
    persona: persona.id, journey: journey.id, critical: !!journey.critical,
    ok: false, failedAt: '', clicks: 0, sec: 0, note: '',
    minTapH: 999, minTapW: 999, minBody: 999, minProse: 999, tinyCount: 0, unlabeled: 0,
    hScroll: false, errors: [], stall: null, font: null, dupNames: [],
  };
  const t0 = Date.now();

  const observe = async () => {
    const pr = await p.evaluate(PROBE, [P_BODY, P_TAP]);
    if (pr.taps.length) {
      r.minTapH = Math.min(r.minTapH, Math.min(...pr.taps.map((x) => x.h)));
      r.minTapW = Math.min(r.minTapW, Math.min(...pr.taps.map((x) => x.w)));
      // 이 사람이 못 누르는 탭만 「누가」 를 모은다 — 48px 고정이 아니라 persona 기준
      const bad = pr.taps.filter((x) => x.h < P_TAP).sort((a, b) => a.h - b.h);
      if (bad.length) r.tinyTaps = [...new Set([...(r.tinyTaps || []), ...bad.map((x) => `${x.name} ${x.h}px`)])].slice(0, 6);
    }
    if (pr.bodies.length) {
      const low = pr.bodies.filter((x) => x < P_BODY);
      if (low.length) r.tinyWho = `${Math.min(...low)}px 텍스트`;
      r.minBody = Math.min(r.minBody, ...pr.bodies);
    }
    // 산문만 따로 — persona 의 「읽는 글자」 기준
    if (pr.prose.length) r.minProse = Math.min(r.minProse, ...pr.prose);
    r.tinyCount += pr.tinyCount;
    if (pr.unlabeled) r.unlNames = [...new Set([...(r.unlNames || []), ...(pr.unl || [])])];
    r.unlabeled += pr.unlabeled;
    if (pr.hScroll) r.hScroll = true;
  };

  try {
    for (const step of journey.steps) {
      if (step.k === 'wait') { await p.waitForTimeout(step.ms); continue; }

      if (step.k === 'tab' || (step.k === 'click' && !step.aria)) {
        const el = await findByText(p, step.text);
        if (!el) {
          if (step.optional) continue;
          r.failedAt = `탐색 실패: 「${step.text}」 버튼을 찾지 못함`;
          break;
        }
        await el.scrollIntoViewIfNeeded().catch(() => {});
        await observe();
        const names = await p.evaluate(A11Y_TREE);
        const dup = names.filter((n, i) => n !== '(이름없음)' && names.indexOf(n) !== i);
        if (dup.length) r.dupNames = [...new Set(dup)].slice(0, 3);
        await el.click({ timeout: 25000 }).catch((e) => { r.failedAt = `클릭 실패: ${e.message.slice(0, 60)}`; });
        if (r.failedAt) break;
        r.clicks++;
        await p.waitForTimeout(step.k === 'tab' ? 1200 : 900);
        continue;
      }

      if (step.k === 'openModal') {
        const el = await findByText(p, step.text);
        if (el) { await el.click({ timeout: 25000 }).catch(() => {}); r.clicks++; await p.waitForTimeout(900); }
        else { r.failedAt = `모달 트리거 「${step.text}」 없음`; break; }
        continue;
      }

      if (step.k === 'type') {
        const q = step.placeholder
          ? p.locator(`[placeholder*="${step.placeholder}"]`).first()
          : p.locator('textarea, input[type=text]').first();
        const n = await q.count();
        if (!n) { if (step.optional) continue; r.failedAt = `입력란 「${step.placeholder || '기본'}」 없음`; break; }
        await q.fill(step.value, { timeout: 8000 }).catch(() => {});
        r.clicks++;
        continue;
      }

      if (step.k === 'assert' || step.k === 'assertAny') {
        const list = step.list || [step.text];
        const body = await p.evaluate(() => document.body.innerText || '');
        const hit = list.some((x) => body.includes(x));
        if (!hit) { r.failedAt = `기대 문구 없음: ${list.join(' / ')}`; break; }
        await observe();
        r.stall = await p.evaluate(LOADING_STALL);
        r.font = await p.evaluate(FONT_EFFECT);
        continue;
      }

      if (step.k === 'assertDialog') {
        const n = await p.locator('[role="dialog"]').count();
        if (!n) { r.failedAt = '모달이 열리지 않았다 (role=dialog 없음)'; break; }
        continue;
      }

      if (step.k === 'countAtLeast') {
        const n = await p.locator(step.selector).count();
        if (n < step.n) { r.failedAt = `결과 부족: ${step.selector} ${n}개 (<${step.n})`; break; }
        continue;
      }
    }

    if (!r.failedAt) r.ok = true;
  } catch (e) {
    r.failedAt = `예외: ${String(e.message || e).slice(0, 90)}`;
  }
  r.sec = Math.round((Date.now() - t0) / 1000);
  return r;
}

async function runPersona(browser, persona) {
  const ctx = await browser.newContext({
    viewport: { width: persona.vp.w, height: persona.vp.h },
    deviceScaleFactor: persona.dpr,
    hasTouch: true,
    isMobile: persona.vp.w < 700,
    locale: 'ko-KR',
    timezoneId: 'Asia/Seoul',
  });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(`JS: ${e.message.slice(0, 70)}`));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(`CON: ${m.text().slice(0, 70)}`); });

  // 시골 독거 persona 의 현실: 느린 대역폭 + 약한 CPU
  const cdp = await ctx.newCDPSession(page);
  const net = NET[persona.net];
  if (net) await cdp.send('Network.emulateNetworkConditions', { offline: false, ...net });
  if (persona.cpu > 1) await cdp.send('Emulation.setCPUThrottlingRate', { rate: persona.cpu });

  let loadMs = 0;
  const t0 = Date.now();
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForSelector('button', { timeout: 60000 }).catch(() => {});
  loadMs = Date.now() - t0;
  await sleep(1200);

  // 이 사람이 첫 화면에서 「큰 글씨」 를 켜야 하는가
  let fontToggled = false;
  if (persona.largeFont) {
    const b = await findByText(page, '글씨 확대');
    if (b) { await b.click().catch(() => {}); fontToggled = true; await sleep(700); }
  }

  const results = [];
  for (const j of JOURNEYS) {
    if (ONLY_JOURNEY && j.id !== ONLY_JOURNEY) continue;
    if (j.voiceOnly && !persona.voice) continue;
    const jp = await ctx.newPage();
    const jerrs = [];
    jp.on('pageerror', (e) => jerrs.push(e.message.slice(0, 60)));
    await jp.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 90000 });
    await jp.waitForSelector('button', { timeout: 60000 }).catch(() => {});
    await sleep(1400);
    if (persona.largeFont) {
      const b = await findByText(jp, '글씨 확대');
      if (b) await b.click().catch(() => {});
      await sleep(600);
    }
    const r = await runJourney(jp, persona, j);
    r.errs = [...new Set([...jerrs, ...errs])].slice(0, 3);
    r.loadSec = Math.round(loadMs / 1000);
    results.push(r);
    await jp.close();
  }
  await ctx.close();
  return { persona, fontToggled, results };
}

// ════════════════════════════════════════════════════════════════════
//  6. 판정 + 보고
// ════════════════════════════════════════════════════════════════════
function judge(run) {
  const p = run.persona;
  const f = [];
  const add = (sev, code, msg) => f.push({ sev, code, msg });

  for (const r of run.results) {
    const tag = `${p.id}/${r.journey}`;
    const kind = (x) => x.replace(`${p.id}/`, '');
    if (!r.ok) add('P0', `${tag}:완료실패`, `${r.failedAt} — 목표: ${r.journey}`);
    if (r.minTapH < p.tap) {
      // 20대·30대에 20px 탭은 불편이지 막히지는 않는다. 심각도는 「이 사람에게 얼마나 치명적인가」 로 정한다
      const sev = p.tap >= 56 ? 'P0' : p.tap >= 48 ? 'P1' : 'P2';
      const who = (r.tinyTaps || []).slice(0, 3).join(' / ');
      add(sev, `${tag}:탭영역`, `최소 ${r.minTapH}px < 요구 ${p.tap}px — ${who || '이름 확인 불가'}`);
    }
    if (r.minProse < p.body) {
      const sev = p.body >= 20 ? 'P1' : 'P2';
      add(sev, `${tag}:본문크기`, `산문 최소 ${r.minProse}px < 요구 ${p.body}px`);
    }
    if (r.hScroll) add('P1', `${tag}:가로넘침`, '세로 화면 사용자가 좌우로 밀어야 한다');
    if (r.stall?.blank) add('P0', `${tag}:빈화면`, '내용물이 없는 백지 화면');
    if (r.stall?.spinnerOnly) add('P1', `${tag}:무한로딩`, '스피너만 도는 화면 — 재시도 수단 없음');
    if (r.stall && !r.stall.hasRetry && r.stall.spinnerOnly) add('P2', `${tag}:재시도없음`, '회복 수단이 화면에 없다');
    if (r.clicks > p.maxClicks) add('P2', `${tag}:단계수`, `${r.clicks}단계 > ${p.maxClicks}`);
    if (r.sec > p.maxSec) add('P1', `${tag}:시간`, `${r.sec}초 > ${p.maxSec}초 (포기하고 전화한다)`);
    if (r.tinyCount > 0) add('P2', `${tag}:13px미만`, `${r.tinyCount}건`);
    if (r.unlabeled > 0) add('P2', `${tag}:이름없는조작`, `${r.unlabeled}건 — 스크린리더·음성에 안 읽힌다: ${(r.unlNames || []).slice(0, 2).join(' / ')}`);
    for (const e of r.errs) add('P1', `${tag}:런타임에러`, e);
  }

  // 글씨 확대가 실제로 글씨를 키우는가 — 유족이 처음 누르는 버튼이다
  const fe = run.results.find((r) => r.font)?.font;
  if (run.persona.largeFont && fe && fe.total > 0) {
    const pct = Math.round((fe.scaled / fe.total) * 100);
    if (pct < 90) {
      add('P0', `${p.id}:글씨확대무효`, `본문 텍스트의 ${pct}%만 커짐 (${fe.scaled}/${fe.total}). 고정 px 때문에 이 형식은 반응하지 않는다 — 예: ${fe.stuck[0] || ''}`);
    }
  }
  return f;
}

function report(rows) {
  const lines = [];
  const allF = rows.flatMap((r) => r.findings);
  const bySev = { P0: allF.filter((x) => x.sev === 'P0'), P1: allF.filter((x) => x.sev === 'P1'), P2: allF.filter((x) => x.sev === 'P2') };

  lines.push('## QA/QC — persona 기반 실사용 시뮬레이션');
  lines.push('');
  lines.push(`persona ${rows.length}명 · 여정 ${JOURNEYS.length}종 · 측정 ${rows.reduce((n, r) => n + r.results.length, 0)}건`);
  lines.push('');

  lines.push('### 요약');
  lines.push('');
  lines.push(`| 등급 | 건수 | 의미 |`);
  lines.push(`|---|---|---|`);
  lines.push(`| P0 | ${bySev.P0.length} | 과제를 끝내지 못함 |`);
  lines.push(`| P1 | ${bySev.P1.length} | 되지만 극도의 시간·정밀도를 요구함 |`);
  lines.push(`| P2 | ${bySev.P2.length} | 위엄을 깎거나 접근성을 해친다 |`);
  lines.push('');

  for (const [sev, list] of Object.entries(bySev)) {
    if (!list.length) continue;
    lines.push(`### ${sev}`);
    lines.push('');
    const agg = new Map();
    for (const f of list) {
      const k = f.code.split(':').slice(1).join(':') || f.code;
      if (!agg.has(k)) agg.set(k, { n: 0, eg: f.msg, who: new Set() });
      const a = agg.get(k);
      a.n++;
      a.who.add(f.code.split(':')[0]);
    }
    for (const [k, a] of [...agg.entries()].sort((x, y) => y[1].n - x[1].n)) {
      lines.push(`- **${k}** — ${a.n}건 · ${[...a.who].join(', ')}`);
      lines.push(`  - ${a.eg}`);
    }
    lines.push('');
  }

  lines.push('### persona별 과제 성적');
  lines.push('');
  lines.push('| persona | 세대/거주 | 성공 | 실패 | 최소탭 | 최소산문 | 글씨확대 |');
  lines.push('|---|---|---|---|---|---|---|');
  for (const r of rows) {
    const p = r.persona;
    const ok = r.results.filter((x) => x.ok).length;
    const bad = r.results.length - ok;
    const mt = Math.min(...r.results.map((x) => x.minTapH));
    const mb = Math.min(...r.results.map((x) => x.minProse));
    const fe = r.results.find((x) => x.font)?.font;
    const fp = fe ? `${Math.round((fe.scaled / fe.total) * 100)}%` : '—';
    lines.push(`| ${p.id} | ${p.gen} · ${p.living} | ${ok} | ${bad} | ${mt}px (요구 ${p.tap}) | ${mb}px (요구 ${p.body}) | ${p.largeFont ? fp : '—'} |`);
  }
  lines.push('');
  return lines.join('\n');
}

// ── main ────────────────────────────────────────────────────────────
const proc = await startPreview();
const browser = await chromium.launch();

const targets = PERSONAS.filter((p) => !ONLY_PERSONA || p.id === ONLY_PERSONA);
const rows = [];
for (const persona of targets) {
  process.stdout.write(`  · ${persona.id} ${persona.gen} … `);
  const run = await runPersona(browser, persona);
  run.findings = judge(run);
  rows.push(run);
  console.log(`완료(${run.results.length} 여정, 결함 ${run.findings.length})`);
}

await browser.close();
if (proc) proc.kill('SIGTERM');

const text = report(rows);
console.log('\n' + text);
if (OUT) {
  writeFileSync(join(ROOT, OUT), text + '\n', 'utf8');
  console.log(`  → ${OUT} 저장`);
}
const fatal = rows.flatMap((r) => r.findings).filter((f) => f.sev === 'P0').length;
process.exit(fatal > 0 ? 1 : 0);