/**
 * 배웅 UI 전수 감사 — 실제 브라우저로 팝업 25종과 탭 5개를 열어 판정한다.
 *
 * ■ 왜 이 파일이 존재하는가
 *   vitest 213건이 전부 통과한 상태에서 아래 결함들이 실제 배포돼 있었다.
 *     1. ProfessionalCareModal 이 isOpen 분기 아래 훅을 호출 → 클릭하면
 *        React #310 으로 화면 전체가 백화면이 된다.
 *     2. text-xs(12px) 462건 — N-7 「13px 금지」 위반.
 *     3. text-red-300 등 이름 팔래트 44종 191건 — 정본 밖.
 *   전부 단위 테스트가 통과하는 종류의 결함이다. 컴포넌트를 렌더하지 않고
 *   문자열과 정규식만 보기 때문이다. 이 스크립트가 그 빈틈을 메운다.
 *
 * ■ 판정 기준 (AREA-DESIGN-2026-009)
 *   - 대비      : 일반 4.5:1 / 대형(24px+, 또는 18.66px+·bold) 3:1 — WCAG AA
 *   - N-7       : 렌더된 font-size 13px 미만 금지
 *   - 팔레트    : tokens.ts 에 등재되지 않은 색 금지
 *   - 모달 계약 : role=dialog · aria-modal · 포커스 진입 · Tab 비이탈
 *                 · ESC 닫힘 · body 잠금 해제
 *
 * ■ 오독 방어
 *   그라디언트 위의 텍스트는 getComputedStyle().backgroundColor 로 조회되지 않는다.
 *   조상 backgroundColor 를 합성하면 크림색으로 잘못 계산해 2.3:1 을 보고하는
 *   사고가 실제로 있었다. 반드시 backgroundImage 를 먼저 확인한다.
 *
 * ■ 실행
 *   npm run audit:ui                    # preview 서버를 직접 띄워 검사
 *   BASE_URL=<url> npm run audit:ui     # 이미 떠 있는 서버 (라이브 검증용)
 */

import { chromium } from 'playwright';
import { readFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';

const ROOT = process.cwd();
const PORT = Number(process.env.AUDIT_PORT ?? 4310);
const ORIGIN = `http://localhost:${PORT}`;
// BASE_URL 이 주어지면 그대로 쓰고, 아니면 배포 경로를 탐색한다.
// 로컬 빌드는 '/', CI 빌드는 BASE_PATH=/See_Out/ 로 서빙된다.
const BASE = process.env.BASE_URL ?? null;

/**
 * 서버가 실제로 서빙하는 경로를 찾는다.
 * 루트가 302 로 리다이렉트되거나 빈 문서면 BASE_PATH 를 붙인 경로를 시도한다.
 */
async function resolveBase(browser) {
  if (BASE) return BASE;
  const p = await browser.newPage();
  try {
    for (const path of ['/', '/See_Out/', '/baeung/']) {
      try {
        const res = await p.goto(ORIGIN + path, { waitUntil: 'domcontentloaded', timeout: 8000 });
        if (!res || res.status() >= 400) continue;
        const len = await p.evaluate(() => document.body.innerText.trim().length);
        if (len > 0) return ORIGIN + path;
      } catch {
        /* 다음 후보를 시도한다 */
      }
    }
    return ORIGIN + '/';
  } finally {
    await p.close();
  }
}

// ── 정본 팔레트: 토큰 파일을 직접 읽는다 ──────────────────────────────
// 하드코딩하면 토큰이 바뀌었을 때 감사가 조용히 통과해 버린다.
const CANON = [
  ...new Set(
    (readFileSync(join(ROOT, 'src/web/design-system/tokens.ts'), 'utf8').match(/#[0-9A-Fa-f]{6}/g) ?? []).map(
      (h) => h.toUpperCase()
    )
  )
];

/** 헤더 탭은 버튼 인덱스로 찾는다 — 한글 정규식은 렌더 타깃에 따라 깨진다. */
// ★ 탭·버튼은 인덱스가 아니라 「화면 글자」 로 찾는다.
//   인덱스는 홈 상단에 컴포넌트를 하나 넣으면 전부 어긋나서 엉뚱한 버튼을
//   누르게 된다. 실제로 KmacaWarmHome 연동 때 그 일이 났다.
const TAB = { home: null, quote: '원가 진단', hall: '장례식장', package: '정찰 패키지', life: '생애기록관' };

/** [표시명, 탭키, 트리거 버튼 텍스트 배열(순차 클릭, 일부만 포함 문자)] */
const POPUPS = [
  ['이중안심 등록증', TAB.home, ['이중안심']],
  ['전문 심리상담', TAB.home, ['전문 심리상담']],
  ['상속 변호사', TAB.home, ['상속 변호사']],
  ['약관·이용약관', TAB.home, ['서비스 이용약관']],
  ['약관·개인정보', TAB.home, ['개인정보 처리방침']],
  ['약관·위치기반', TAB.home, ['위치기반서비스 약관']],
  ['약관·e하늘', TAB.home, ['e하늘']],
  ['약관·디지털유산', TAB.home, ['디지털 유산']],
  ['이중안심(원가)', TAB.quote, ['이중안심 등록증']],
  ['내용증명 청구서', TAB.quote, ['내용증명']],
  ['손실보전 바우처', TAB.quote, ['바우처']],
  ['옵트아웃', TAB.hall, ['비노출 요청']],
  ['B2B 제휴 입점', TAB.hall, ['제휴 입점']],
  ['공식 견적서', TAB.hall, ['공식 정찰 견적서']],
  ['제휴 안치·유품', TAB.hall, ['상세 보기']],
  ['명세표 아코디언', TAB.package, ['상세 원가 명세표']],
  ['A4 양장본', TAB.life, ['A4 양장본']],
  ['빈소 헌정 화면', TAB.life, ['빈소 디지털 헌정']],
  ['생애 평전', TAB.life, ['생애 평전']],
  ['생애 회고', TAB.life, ['생애 회고']],
  ['모바일 부고장', TAB.life, ['모바일 부고장']],
  ['엔딩노트', TAB.life, ['사전 장례 의향서']],
  ['게이트키퍼', TAB.life, ['사후 유산관리']],
  ['실물 양장본', TAB.life, ['실물 양장본']],
  ['파트너 실적 보고', TAB.hall, ['서울아산병원']],
];
/** [표시명, 탭키] — 페이지 전역 판정 */
const TABS = [
  ['종합 의전', TAB.home],
  ['원가 진단', TAB.quote],
  ['장례식장', TAB.hall],
  ['정찰 패키지', TAB.package],
  ['생애기록관', TAB.life],
];

const settle = (p, ms = 900) => p.waitForTimeout(ms);

async function clickIdx(p, needle) {
  // ★ 정규식이 아니라 includes() 로 찾는다. 한글 정규식은 렌더 타깃에 따라
  //   깨지는 일이 실제로 있었고, 그때 오탐이 조용히 통과했다.
  return p.evaluate((want) => {
    const t = String(want).replace(/\s+/g, '');
    const e = [...document.querySelectorAll('button, a, [role=button]')].find((x) => {
      const s = (x.textContent || '').replace(/\s+/g, '');
      return s.includes(t) && (x.offsetWidth > 0 || x.offsetHeight > 0);
    });
    if (!e) return { ok: false };
    const hit = (e.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 30);
    e.scrollIntoView({ block: 'center' });
    e.click();
    return { ok: true, hit };
  }, needle).then((r) => {
    if (process.env.AUDIT_DEBUG) {
      console.log(`   [dbg] ${JSON.stringify(needle)} → ${r.ok ? 'HIT ' + r.hit : 'MISS'}`);
    }
    return r.ok;
  });
}

async function openTab(p, needle) {
  if (needle == null) return true;
  await clickIdx(p, needle);
  await settle(p, 1400);
  return true;
}

/**
 * 루트 안의 모든 표시 텍스트를 판정한다.
 * root 를 생략하면 문서 전체를 본다.
 */
const INSPECT = ({ list, rootSel }) => {

/**
 * ★ 사진 위에 얹힌 텍스트를 잡는다.
 *
 * 그라디언트 오버레이를 「가장 불투명한 스톱 하나」 로 대표내는 방식으로는
 * 이 결함을 못 본다. 대표값이 크면 「항상 덮여 있다」 고 오독되기 때문이다.
 * 실제로 히어로 본문 오른쪽이 투명 구간(= 사진 그대로)에 얹힌 채 통과했다.
 *
 * 판정: 텍스트 상자가 「스크림이 50% 미만으로 내려간 구간」 까지 침범하는가.
 * 50% 은 임의의 상수가 아니라 「사진 디테일이 글자 윤곽을 방해하기 시작하는 지점」 이다.
 * 그 아래면 유족이 고쳐 읽어야 하고, 50% 위면 사진을 유지한 채 읽힌다.
 */
const overUnscreenedImage = (el, t) => {
  const SCRIM_MIN = 0.5;
  const tr = el.getBoundingClientRect();
  if (tr.width <= 0) return false;

  // 1) el 를 덮는 절대배치 <img> 와, 그 img 를 품은 위치조상 컨테이너
  let node = el.parentElement;
  let stage = null;
  let img = null;
  while (node && !stage) {
    for (const k of node.children) {
      if (k.tagName !== 'IMG' || k.closest('[role="dialog"]') !== null) continue;
      if (getComputedStyle(k).position !== 'absolute') continue;
      const r = k.getBoundingClientRect();
      if (r.width > 0 && tr.left < r.right - 2 && tr.right > r.left + 2) { stage = node; img = k; }
    }
    if (!stage) node = node.parentElement;
  }
  if (!stage) return false;

  // 2) 스크림은 텍스트의 「형제」 다 — 조상만 보면 영영 못 찾는다.
  //    (실제 히어로 구조: img → 스크림 div → 텍스트 div 가 나란히 있다)
  //    그리기 순서상 img 뒤에 있는 그라디언트 중 마지막 것이 최상단이다.
  let scrim = null;
  for (const k of stage.children) {
    if (k === img || k.contains(el) || k === el) continue;
    const bi = getComputedStyle(k).backgroundImage;
    if (bi && bi !== 'none' && /gradient/.test(bi)) scrim = k;
  }
  if (!scrim) return true; // 스크림 자체가 없다

  const bi = getComputedStyle(scrim).backgroundImage;
  const horiz = /to right|90deg/.test(bi) ? true : !/to bottom|180deg/.test(bi);
  const stops = [...bi.matchAll(/rgba?\(([^)]+)\)/g)].map((m) => {
    const p = m[1].split(/[,\s/]+/).filter(Boolean);
    return p.length >= 4 ? parseFloat(p[3]) : 1;
  });
  if (!stops.length) return true;
  if (Math.min(...stops) >= SCRIM_MIN) return false; // 어디든 덮인다

  // 3) 페이드 방향으로 「거의 투명한 구간」 이 어디부터인지 역산
  const n = stops.length;
  const THRESH = SCRIM_MIN;
  let bad = 1; // 스톱을 균등 배치로 가정
  for (let i = 0; i < n - 1; i++) {
    const a0 = stops[i];
    const a1 = stops[i + 1];
    if (a0 >= THRESH && a1 < THRESH) {
      bad = (i + (a0 - THRESH) / (a0 - a1)) / (n - 1);
      break;
    }
  }
  const sr = scrim.getBoundingClientRect();
  return horiz
    ? tr.right > sr.left + sr.width * bad + 2
    : tr.bottom > sr.top + sr.height * bad + 2;
};
  // Playwright 의 evaluate 는 인자를 하나만 넘긴다. 배열로 넘기면 색 목록이
  // 통째로 첫 인자에 들어가 Set 이 비어 「팔레트밖」 이 전부 오탐이 된다.
  const CANON_SET = new Set(list);
  const root = rootSel ? document.querySelector(rootSel) : document.body;
  if (!root) return null;

  const lum = (c) => {
    const m = c.match(/[\d.]+/g).map(Number).slice(0, 3)
      .map((v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * m[0] + 0.7152 * m[1] + 0.0722 * m[2];
  };
  const cr = (a, b) => {
    const x = lum(a), y = lum(b);
    const h = x > y ? x : y, l = x > y ? y : x;
    return (h + 0.05) / (l + 0.05);
  };
  const pa = (c) => {
    const m = c.match(/[\d.]+/g);
    return m ? { r: +m[0], g: +m[1], b: +m[2], a: m[3] === undefined ? 1 : +m[3] } : null;
  };
  const over = (f, b) => ({
    r: f.r * f.a + b.r * (1 - f.a),
    g: f.g * f.a + b.g * (1 - f.a),
    b: f.b * f.a + b.b * (1 - f.a),
    a: 1,
  });
  // ★ 그라디언트를 먼저 본다. backgroundColor 만 보면 크림색으로 오독된다.
  const gradOf = (el) => {
    let e = el;
    while (e) {
      const bi = getComputedStyle(e).backgroundImage;
      if (bi && bi !== 'none') {
        const ms = [...bi.matchAll(/rgba?\(([^)]+)\)/g)].map((m) => pa(m[0]));
        if (ms.length) {
          const t = ms.sort((a, b) => b.a - a.a)[0];
          return 'rgb(' + t.r + ', ' + t.g + ', ' + t.b + ')';
        }
      }
      e = e.parentElement;
    }
    return null;
  };
  const bgOf = (el) => {
    const g = gradOf(el);
    if (g) return g;
    const st = [];
    let e = el;
    while (e) {
      const c = pa(getComputedStyle(e).backgroundColor);
      if (c && c.a > 0) st.push(c);
      if (c && c.a === 1) break;
      e = e.parentElement;
    }
    let a = { r: 247, g: 245, b: 240, a: 1 };
    for (let i = st.length - 1; i >= 0; i--) a = over(st[i], a);
    return 'rgb(' + a.r.toFixed(0) + ', ' + a.g.toFixed(0) + ', ' + a.b.toFixed(0) + ')';
  };
  const hexOf = (c) => {
    const m = c.match(/[\d.]+/g);
    if (!m) return null;
    return '#' + [0, 1, 2].map((i) => (+m[i]).toString(16).padStart(2, '0')).join('').toUpperCase();
  };

  // 잘림: 스크롤폭이 더 큰데 넘침이 숨겨져 있는 요소.
  // 「정찰 패키지」 표는 무엇이 포함되는지 읽게 하는 것이 목적인데,
  // truncate 로 노안 유족이 못 읽으면 정찰이라는 장점이 사라진다.
  const r = { tiny: 0, tl: [], con: [], off: [], clip: 0, cl2: [], imgRisk: 0, il: [] };
  root.querySelectorAll('*').forEach((el) => {
    const direct = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1);
    if (!direct) return;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || Number(cs.opacity) < 0.3) return;
    const sz = parseFloat(cs.fontSize);
    const t = (el.textContent || '').trim();
    if (!t) return;

    if (sz < 13) {
      r.tiny++;
      if (r.tl.length < 3) r.tl.push(t.slice(0, 14) + ' ' + sz + 'px');
    }

    const bg = bgOf(el);
    const large = sz >= 24 || (sz >= 18.66 && Number(cs.fontWeight) >= 700);
    const need = large ? 3 : 4.5;
    const v = cr(cs.color, bg);
    if (v < need - 0.01 && r.con.length < 3) r.con.push(t.slice(0, 16) + ' ' + v.toFixed(2) + ':1 (필요 ' + need + ')');

    const h = hexOf(cs.color);
    if (h && !CANON_SET.has(h) && r.off.length < 3) r.off.push(h);

    if (el.children.length === 0 && cs.overflow !== 'visible' && el.scrollWidth > el.clientWidth + 2) {
      r.clip++;
      if (r.cl2.length < 3) r.cl2.push(t.slice(0, 20) + ' ' + el.scrollWidth + '>' + el.clientWidth);
    }

    if (overUnscreenedImage(el, t)) {
      r.imgRisk++;
      if (r.il.length < 3) r.il.push(t.slice(0, 18) + ' — 사진 위, 스크림 없는 구간');
    }
  });
  return r;
};


/**
 * 펼침/접기 disclosure 버튼은 aria-expanded 로 상태를 알려야 한다.
 *
 * ■ 왜 이 검사가 있는가
 *   스크린리더 사용자는 「명세 펼치기」 라는 문구만으로는 지금 열려 있는지
 *   알 수 없다. aria-expanded 가 없으면 상태 변화가 전혀 전달되지 않는다.
 *   정적 문자열로는 토글 대상을 알 수 없어 화면을 열어 확인해야 한다.
 */
const CHECK_DISCLOSURE = () => {
  // 「펼침/접힘」 쌍과 화살표 글리프. 닫기 버튼(「창 닫기」)과 구분하려면
  // 닫기 버튼이 전부 [role=dialog] 안에 있다는 사실을 쓴다.
  const HINT = /(펼치|접기|펼침|접힘|닫기|\u25b8|\u25be|\u25b2|\u25bc|\u25b6|\u25c0|\u203a|\u2039)/;
  const out = [];
  for (const b of document.querySelectorAll('button')) {
    // 모달 안의 버튼은 닫기 동작이므로 disclosure 가 아니다.
    if (b.closest('[role="dialog"]')) continue;
    const label = (b.textContent || '').replace(/\s+/g, ' ').trim();
    if (!HINT.test(label)) continue;
    if (b.offsetWidth === 0 && b.offsetHeight === 0) continue;
    if (!b.hasAttribute('aria-expanded')) out.push(label.slice(0, 30));
  }
  return out;
};

/**
 * 로컬에서 돌릴 때 preview 서버를 직접 띄운다.
 * npm 스크립트에서 `cmd &` 로 띄우면 프로세스 그룹이 살아 있어
 * 명령이 종료되지 않는다 — 수명은 이 함수가 전부 책임진다.
 */
async function startPreview() {
  if (BASE) return null;

  // ■ 방어 1 — 포트를 이미 다른 서버가 물고 있으면 아무도 모르게 그 서버를 검사한다.
  //   spawn 은 포트가 이미 점유돼 있으면 조용히 죽는데, 아래 fetch 는 그 서버에 닿아
  //   「떴다」 고 판단한다. 실제로 옛 빌드가 통째로 통과한 사고가 이거였다.
  try {
    const pre = await fetch(ORIGIN + '/', { redirect: 'follow' });
    if (pre.status < 500) {
      throw new Error(
        `${PORT} 포트에 이미 서버가 떠 있다 (${new URL(pre.url).origin}). ` +
          `그 서버가 dist 를 따로 들고 있을 수 있어 검사가 엉뚱한 빌드를 본다. ` +
          `먼저 그 서버를 내린 뒤 다시 돌려라.`,
      );
    }
  } catch (e) {
    if (String(e?.message || '').includes('이미 서버')) throw e;
    /* 포트가 비었음 — 정상 */
  }

  // ■ 방어 2 — dist 가 소스보다 낡으면 옛 빌드를 검사한다. 역시 조용히 통과한다.
  assertDistFresh();

  const proc = spawn('npx', ['vite', 'preview', '--port', String(PORT)], {
    cwd: ROOT,
    stdio: 'ignore',
  });
  for (let i = 0; i < 40; i++) {
    await sleep(500);
    try {
      const res = await fetch(ORIGIN + '/', { redirect: 'follow' });
      if (res.status < 500) return proc;
    } catch {
      /* 아직 안 뜬 것 */
    }
  }
  proc.kill('SIGTERM');
  throw new Error(`preview 서버가 ${PORT} 포트에서 뜨지 않았다`);
}

/** dist/index.html 이 src 보다 오래됐으면 손댈 수 없다 — 옛 빌드를 검사하는 셈이다. */
function assertDistFresh() {
  const idx = join(ROOT, 'dist', 'index.html');
  if (!existsSync(idx)) {
    throw new Error('dist/index.html 이 없다 — npm run build:web 를 먼저 돌려라');
  }
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
    const lag = Math.round((newest - distT) / 1000);
    throw new Error(
      `dist 가 src 보다 ${lag}초 낡다 — 지금 검사하면 옛 빌드를 본다. ` +
        `npm run build:web 를 먼저 돌려라.`,
    );
  }
}

const fail = [];
const rows = [];
const pageRows = [];

const server = await startPreview();
const browser = await chromium.launch();
const BASE_URL = await resolveBase(browser);

// ── 팝업 전수 ────────────────────────────────────────────────────────
for (const [name, tab, seq] of POPUPS) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 }, permissions: ['clipboard-read', 'clipboard-write'] });
  const p = await ctx.newPage();
  const errs = [];
  const isIgnorable = (msg) => /clipboard/i.test(msg) || /write permission denied/i.test(msg);
  p.on('pageerror', (e) => {
    if (isIgnorable(e.message)) return;
    console.error('  [PAGEERROR in ' + name + ']:', e.message);
    errs.push(1);
  });
  p.on('console', (m) => {
    if (m.type() === 'error') {
      if (isIgnorable(m.text())) return;
      console.error('  [CONSOLE_ERR in ' + name + ']:', m.text());
      errs.push(1);
    }
  });

  const r = { name, kind: '', open: false, focus: '-', tabTrap: '-', esc: '-', rel: '-', tiny: 0, con: 0, off: 0, clip: 0, acc: [], errs: 0, note: '' };

  try {
    await p.goto(BASE_URL, { waitUntil: 'networkidle' });
    await settle(p, 2400);
    await openTab(p, tab);
    await settle(p, 700);

    let done = true;
    for (const i of seq) {
      if (!(await clickIdx(p, i))) { done = false; r.note = '트리거 없음 idx=' + i; break; }
      await settle(p, 1300);
    }
    if (!done) { rows.push(r); await p.close(); continue; }
    await settle(p, 800);

    const n = await p.locator('[role="dialog"]').count();
    if (n === 0) {
      const alt = await p.evaluate(
        () => [...document.querySelectorAll('[aria-modal="true"]')].filter((e) => e.offsetWidth > 300 && e.offsetHeight > 200).length
      );
      r.kind = alt ? '비dialog' : '인라인';
      r.open = true;
      r.note = alt ? '오버레이만 (dialog 역할 없음)' : '탭 내 인라인 흐름 — 모달 아님';
      rows.push(r);
      await p.close();
      continue;
    }

    r.kind = '모달';
    r.open = true;
    r.focus = await p.evaluate(() => (document.querySelector('[role="dialog"]').contains(document.activeElement) ? 'OK' : 'NO'));
    for (let i = 0; i < 22; i++) await p.keyboard.press('Tab');
    r.tabTrap = await p.evaluate(() => (document.querySelector('[role="dialog"]').contains(document.activeElement) ? 'OK' : 'NO'));
    const ins = await p.evaluate(INSPECT, { list: CANON, rootSel: '[role="dialog"]' });
    r.acc = await p.evaluate(CHECK_DISCLOSURE);
    r.tiny = ins.tiny; r.con = ins.con.length; r.off = ins.off.length; r.clip = ins.clip; r.img = ins.imgRisk;
    r.tl = ins.tl; r.cl = ins.con; r.ol = ins.off; r.c2 = ins.cl2;
    await p.keyboard.press('Escape');
    await settle(p, 700);
    r.esc = (await p.locator('[role="dialog"]').count()) === 0 ? 'OK' : 'NO';
    r.rel = await p.evaluate(() => (document.body.style.overflow === '' ? 'OK' : 'NO'));
  } catch (e) {
    r.note = String(e.message).split('\n')[0].slice(0, 44);
  }
  r.errs = errs.length;
  rows.push(r);
  await p.close();
}

// ── 페이지 전수 ──────────────────────────────────────────────────────
// ★ 데스크톱(1440) 만 보면 폰에서만 나는 결함이 영영 안 보인다.
//   이 서비스는 폰 우선이다 — 유족 대다수가 390px 에서 읽는다.
//   실제로 히어로 본문이 사진 위에 얹히는 문제가 1440 검사에서는 통과했다.
const WIDTHS = [
  { w: 1440, h: 1000, tag: '' },
  { w: 390, h: 844, tag: ' 폰' },
];
for (const [name, tab] of TABS) {
 for (const vp of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, permissions: ['clipboard-read', 'clipboard-write'] });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', (e) => { if (!/clipboard/i.test(e.message)) errs.push(1); });
  p.on('console', (m) => { if (m.type() === 'error' && !/clipboard/i.test(m.text())) errs.push(1); });
  await p.goto(BASE_URL, { waitUntil: 'networkidle' });
  await settle(p, 2400);
  await openTab(p, tab);
  await settle(p, 1200);
  const ins = await p.evaluate(INSPECT, { list: CANON, rootSel: null });
  const acc = await p.evaluate(CHECK_DISCLOSURE);
  pageRows.push({ name: name + vp.tag, tiny: ins.tiny, con: ins.con.length, off: ins.off.length, clip: ins.clip, img: ins.imgRisk, il: ins.il, c2: ins.cl2, acc, errs: errs.length });
  await p.close();
  await ctx.close();
 }
}

await browser.close();

const BAD = (r) =>
  !r.open || r.errs > 0 || r.off > 0 || r.tiny > 0 || r.con > 0 || r.clip > 0 || r.img > 0 || r.acc.length > 0 ||
  (r.kind === '모달' && (r.focus !== 'OK' || r.tabTrap !== 'OK' || r.esc !== 'OK' || r.rel !== 'OK'));

console.log('══ 배웅 UI 전수 감사 ══');
console.log(`   대상 ${BASE_URL}  ·  정본 색상 ${CANON.length}개\n`);

console.log('── 팝업 ──');
console.log('   ' + '팝업'.padEnd(20) + '형태'.padEnd(8) + '개봉 포커스 Tab ESC 해제 13px 대비 팔레트 에러');
console.log('   ' + '─'.repeat(84));
for (const r of rows) {
  const isM = r.kind === '모달';
  const ok = !BAD(r);
  const mark = ok ? '✅' : r.kind === '인라인' || r.kind === '비dialog' ? '➖' : '❌';
  console.log(
    '   ' + mark + ' ' + r.name.padEnd(18) + (r.kind || '-').padEnd(8) + String(r.open).padEnd(4) +
    (isM
      ? r.focus.padEnd(5) + r.tabTrap.padEnd(4) + r.esc.padEnd(4) + r.rel.padEnd(4) +
        String(r.tiny).padStart(4) + String(r.con).padStart(4) + String(r.off).padStart(5) + String(r.errs).padStart(4)
      : '   — 인라인 흐름'.padEnd(30)) +
    (r.note ? '  ' + r.note : '')
  );
  if (r.tl?.length) console.log('        13px 미만: ' + r.tl.join(' / '));
  if (r.cl?.length) console.log('        대비 미달: ' + r.cl.join(' / '));
  if (r.ol?.length) console.log('        팔레트 밖: ' + r.ol.join(' '));
  if (r.c2?.length) console.log('        텍스트 잘림: ' + r.c2.join(' / '));
  if (r.acc?.length) console.log('        aria-expanded 없음: ' + r.acc.join(' / '));
  if (BAD(r)) fail.push('팝업 ' + r.name);
}

console.log('\n── 페이지 ──');
console.log('   ' + '화면'.padEnd(20) + '13px 미만  대비 미달  팔레트 밖   잘림  사진 aria-exp 에러');
console.log('   ' + '─'.repeat(60));
for (const r of pageRows) {
  const ok = r.tiny === 0 && r.con === 0 && r.off === 0 && r.clip === 0 && r.img === 0 && r.acc.length === 0 && r.errs === 0;
  console.log(
    '   ' + (ok ? '✅' : '❌') + ' ' + r.name.padEnd(18) +
    String(r.tiny).padStart(6) + String(r.con).padStart(10) + String(r.off).padStart(9) + String(r.clip).padStart(6) +
    String(r.img).padStart(7) + String(r.acc.length).padStart(9) + String(r.errs).padStart(6)
  );
  if (r.tl?.length) console.log('        13px 미만: ' + r.tl.join(' / '));
  if (r.cl?.length) console.log('        대비 미달: ' + r.cl.join(' / '));
  if (r.ol?.length) console.log('        팔레트 밖: ' + r.ol.join(' '));
  if (r.c2?.length) console.log('        텍스트 잘림: ' + r.c2.join(' / '));
  if (r.il?.length) console.log('        사진 위 무스크림: ' + r.il.join(' / '));
  if (r.acc?.length) console.log('        aria-expanded 없음: ' + r.acc.join(' / '));
  if (!ok) fail.push('페이지 ' + r.name);
}

console.log('');
server?.kill('SIGTERM');

if (fail.length) {
  console.error(`   ✗ 위반 ${fail.length}건`);
  for (const f of fail) console.error('     · ' + f);
  process.exitCode = 1;
} else {
  console.log(`   ✓ 위반 0건 — 팝업 ${rows.length} · 페이지 ${pageRows.length}`);
}

