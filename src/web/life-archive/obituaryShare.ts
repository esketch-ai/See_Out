/**
 * 부고장을 「링크 하나로」 보낸다 — 서버 없이.
 *
 * ■ 왜 링크인가
 *   가족끼리 상의하려면 내용 하나가 두 손에 있어야 한다. 시골에 있는 유족과
 *   도시에 있는 가족은 다른 기기를 쓴다. 평문으로 붙여 넣으면 벽돌같은 글이 되고,
 *   서로 무엇을 봤는지 확인이 안 된다.
 *   링크를 열면 「부고장」 으로 보이는 화면이 되니 상의가 시작된다.
 *
 * ★ 서버로 보내지 않는다
 *   내용을 URL 조각(#)에 담는다. 조각은 브라우저가 서버로 보내지 않는다 —
 *   주소창에 있어도 네트워크를 지나지 않는다. 그래서 백엔드가 필요 없다.
 *
 * ★ 조각을 쓰는 이유
 *   질의 문자열(?id=…)은 서버로 전달된다. 유족의 성함·전화가 요청 로그에
 *   남으면 안 된다. 해시는 전달되지 않는다.
 *
 * ■ 담는 것과 담지 않는 것
 *   담는다: 성함 · 본관 · 생몰년월 · 상주자 · 연락처 · 발인 · 빈소 · 조문금
 *   담지 않는다: 계좌번호. 「조문금 입금이 필요하다」 에 성함과 전화만 있으면
 *   충분하고, 링크가 카톡 기록·스크린샷에 남었을 때 계좌까지 노출되면
 *   회복이 불가능하다. 유족이 따로 알려주는 방식으로 한다.
 */

import type { FuneralSetting } from '../../life-archive/types.js';

export const SHARE_HASH_KEY = 'b';

/** 링크로 보낼 최소 정보. 키를 짧게 써서 URL 길이를 아낀다. */
export interface SharedObituary {
  n: string;  // 성함
  c?: string; // 본관
  b?: string; // 생년월일
  d?: string; // 사망일
  a?: number; // 나이
  m: string;  // 상주자 (쉼표로)
  p?: string; // 상주자 연락처
  t?: string; // 발인 일시
  h?: string; // 빈소
  r?: string; // 빈소 호실
  g?: string; // 주소
}

const b64url = {
  enc(s: string): string {
    const bytes = new TextEncoder().encode(s);
    let bin = '';
    for (const b of bytes) bin += String.fromCharCode(b);
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  },
  dec(s: string): string {
    const pad = s + '='.repeat((4 - (s.length % 4)) % 4);
    const bin = atob(pad.replace(/-/g, '+').replace(/_/g, '/'));
    const bytes = Uint8Array.from(bin, (ch) => ch.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  },
};

export const encodeObituary = (f: FuneralSetting): SharedObituary => ({
  n: (f.deceasedName || '').replace(/^故\s*/, '').replace(/\s*님\s*$/, '') || '고인',
  c: f.deceasedClan || undefined,
  b: f.birthDate || undefined,
  d: f.deathDate || undefined,
  a: typeof f.age === 'number' ? f.age : undefined,
  m: (f.chiefMourners || []).join(', '),
  p: f.chiefPhone || undefined,
  t: f.departureDateTime || undefined,
  h: f.funeralHallName || undefined,
  r: f.roomName || undefined,
  g: f.address || undefined,
});

export const encodeShareLink = (f: FuneralSetting, origin: string): string => {
  const payload = b64url.enc(JSON.stringify(encodeObituary(f)));
  const base = `${origin}${origin.includes('#') ? '' : ''}#${SHARE_HASH_KEY}=${payload}`;
  return base;
};

export const decodeShareLink = (hash: string): SharedObituary | null => {
  try {
    const raw = (hash || '').replace(/^#/, '');
    const params = new URLSearchParams(raw);
    const payload = params.get(SHARE_HASH_KEY);
    if (!payload) return null;
    const obj = JSON.parse(b64url.dec(payload)) as SharedObituary;
    if (!obj || typeof obj.n !== 'string') return null;
    return obj;
  } catch {
    // 손상된 링크여도 조용히 죽지 않는다 — 수신자는 「열 수 없다」 를 알아야 한다
    return null;
  }
};