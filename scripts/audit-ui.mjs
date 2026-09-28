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
import { readFileSync } from 'node:fs';
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
const TAB = { home: null, quote: 4, hall: 5, package: 6, life: 7 };

/** [표시명, 탭키, 트리거 버튼 인덱스 배열(순차 클릭)] */
const POPUPS = [
  ['이중안심 등록증', TAB.home, [18]],
  ['전문 심리상담', TAB.home, [20]],
  ['상속 변호사', TAB.home, [21]],
  ['약관·이용약관', TAB.home, [22]],
  ['약관·개인정보', TAB.home, [23]],
  ['약관·위치기반', TAB.home, [24]],
  ['약관·e하늘', TAB.home, [25]],
  ['약관·디지털유산', TAB.home, [26]],
  ['이중안심(원가)', TAB.quote, [30]],
  ['내용증명 청구서', TAB.quote, [31]],
  ['손실보전 바우처', TAB.quote, [32]],
  ['옵트아웃', TAB.hall, [40]],
  ['B2B 제휴 입점', TAB.hall, [41]],
  ['공식 견적서', TAB.hall, [59]],
  ['제휴 안치·유품', TAB.hall, [61]],
  ['명세표 아코디언', TAB.package, [29]],
  ['A4 양장본', TAB.life, [13]],
  ['빈소 헌정 화면', TAB.life, [14]],
  ['생애 평전', TAB.life, [15]],
  ['생애 회고', TAB.life, [16]],
  ['모바일 부고장', TAB.life, [17]],
  ['엔딩노트', TAB.life, [18]],
  ['게이트키퍼', TAB.life, [19]],
  ['실물 양장본', TAB.life, [20]],
  ['파트너 실적 보고', TAB.hall, [46, 56]],
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

async function clickIdx(p, i) {
  return p.evaluate((idx) => {
    const e = document.querySelectorAll('button')[idx];
    if (!e) return false;
    e.scrollIntoView({ block: 'center' });
    e.click();
    return true;
  }, i);
}

async function openTab(p, idx) {
  if (idx == null) return true;
  await clickIdx(p, idx);
  await settle(p, 1200);
  return true;
}

/**
 * 루트 안의 모든 표시 텍스트를 판정한다.
 * root 를 생략하면 문서 전체를 본다.
 */
const INSPECT = ({ list, rootSel }) => {
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
  const r = { tiny: 0, tl: [], con: [], off: [], clip: 0, cl2: [] };
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

const fail = [];
const rows = [];
const pageRows = [];

const server = await startPreview();
const browser = await chromium.launch();
const BASE_URL = await resolveBase(browser);

// ── 팝업 전수 ────────────────────────────────────────────────────────
for (const [name, tab, seq] of POPUPS) {
  const p = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errs = [];
  p.on('pageerror', () => errs.push(1));
  p.on('console', (m) => { if (m.type() === 'error') errs.push(1); });

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
    r.tiny = ins.tiny; r.con = ins.con.length; r.off = ins.off.length; r.clip = ins.clip;
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
for (const [name, tab] of TABS) {
  const p = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errs = [];
  p.on('pageerror', () => errs.push(1));
  p.on('console', (m) => { if (m.type() === 'error') errs.push(1); });
  await p.goto(BASE_URL, { waitUntil: 'networkidle' });
  await settle(p, 2400);
  await openTab(p, tab);
  await settle(p, 1200);
  const ins = await p.evaluate(INSPECT, { list: CANON, rootSel: null });
  const acc = await p.evaluate(CHECK_DISCLOSURE);
  pageRows.push({ name, tiny: ins.tiny, con: ins.con.length, off: ins.off.length, clip: ins.clip, acc, errs: errs.length, tl: ins.tl, cl: ins.con, ol: ins.off, cl2: ins.cl2 });
  await p.close();
}

await browser.close();

const BAD = (r) =>
  !r.open || r.errs > 0 || r.off > 0 || r.tiny > 0 || r.con > 0 || r.clip > 0 || r.acc.length > 0 ||
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
console.log('   ' + '화면'.padEnd(20) + '13px 미만  대비 미달  팔레트 밖   잘림  aria-exp 에러');
console.log('   ' + '─'.repeat(60));
for (const r of pageRows) {
  const ok = r.tiny === 0 && r.con === 0 && r.off === 0 && r.clip === 0 && r.acc.length === 0 && r.errs === 0;
  console.log(
    '   ' + (ok ? '✅' : '❌') + ' ' + r.name.padEnd(18) +
    String(r.tiny).padStart(6) + String(r.con).padStart(10) + String(r.off).padStart(9) + String(r.clip).padStart(6) + String(r.acc.length).padStart(9) + String(r.errs).padStart(6)
  );
  if (r.tl?.length) console.log('        13px 미만: ' + r.tl.join(' / '));
  if (r.cl?.length) console.log('        대비 미달: ' + r.cl.join(' / '));
  if (r.ol?.length) console.log('        팔레트 밖: ' + r.ol.join(' '));
  if (r.cl2?.length) console.log('        텍스트 잘림: ' + r.cl2.join(' / '));
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

