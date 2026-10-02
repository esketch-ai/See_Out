/**
 * 「내 의전 기록」 을 이 기기에 남긴다 — 단, 동의를 받고 나서만.
 *
 * ■ 왜 있는가
 *   유가족은 밤사이 다시 들어온다. 새로고침하면 진행이 0/4 로 돌아가면
 *   「이 사이트는 아무것도 기억 못 하는구나」 가 된다. 하루를 몇 번씩
 *   반복하는 분들에게 치명적이다.
 *
 * ★ 이 저장소에 들어가는 것
 *   · 의전 진행 단계 4개 (접수 · 예식 · 비용 · 전하기)
 *   · 유족이 직접 적은 부고장 내용 (성함 · 생몰년월 · 상주자 · 전화 · 조문금 계좌)
 *   고인 이름과 조문금 계좌가 들어간다. 그래서 동의를 먼저 받고,
 *   동의 전에는 **아무것도 쓰지 않는다.**
 *
 * ★ 하지 않는 것
 *   · 서버로 보내지 않는다. 이 파일에는 fetch 가 없다.
 *   · 동의 없는 저장을 하지 않는다. write 는 grant 없으면 거부한다.
 *   · 다른 기기와 공유하지 않는다. 브라우저 저장소는 그 기기 안에만 있다.
 *
 * ★ 지우는 길
 *   revokeBereavementConsent() — 동의와 데이터를 함께 삭제한다.
 */

const KEY = 'baeung.bereavement.v1';

export interface BereavementStages {
  intake?: boolean;
  ceremony?: boolean;
  cost?: boolean;
  record?: boolean;
}

/** 유족이 직접 고친 부고장 필드만 보관한다 (빈소 정보 등 자동 값은 제외) */
export interface StoredObituary {
  deceasedName?: string;
  deceasedClan?: string;
  birthDate?: string;
  deathDate?: string;
  age?: number;
  chiefMourners?: string[];
  chiefPhone?: string;
  departureDateTime?: string;
  condolenceAccount?: string;
  motto?: string;
  referenceCode?: string;
}

export interface BereavementRecord {
  consentAt: string;
  stages: BereavementStages;
  obituary: StoredObituary;
}

export interface ConsentState {
  granted: boolean;
  consentAt?: string;
  hasRecord: boolean;
}

const empty = (): BereavementRecord => ({
  consentAt: '',
  stages: {},
  obituary: {},
});

const safeParse = (raw: string | null): BereavementRecord | null => {
  if (!raw) return null;
  try {
    const v = JSON.parse(raw) as Partial<BereavementRecord>;
    if (!v || typeof v !== 'object') return null;
    return {
      consentAt: typeof v.consentAt === 'string' ? v.consentAt : '',
      stages: (v.stages && typeof v.stages === 'object' ? v.stages : {}) as BereavementStages,
      obituary: (v.obituary && typeof v.obituary === 'object' ? v.obituary : {}) as StoredObituary,
    };
  } catch {
    // 깨진 값은 없는 것으로 본다 — 조용히 덮어쓰지 않고 무시한다
    return null;
  }
};

const available = () => {
  try {
    return typeof window !== 'undefined' && !!window.localStorage;
  } catch {
    return false; // 브라우저 설정으로 차단된 경우
  }
};

export const readConsentState = (): ConsentState => {
  if (!available()) return { granted: false, hasRecord: false };
  const rec = safeParse(window.localStorage.getItem(KEY));
  return {
    granted: !!rec?.consentAt,
    consentAt: rec?.consentAt || undefined,
    hasRecord: !!rec && (Object.keys(rec.stages).length > 0 || Object.keys(rec.obituary).length > 0),
  };
};

export const readRecord = (): BereavementRecord | null => {
  if (!available()) return null;
  const rec = safeParse(window.localStorage.getItem(KEY));
  if (!rec?.consentAt) return null;
  return rec;
};

/** ★ 동의 없으면 쓰지 않는다. 조용히 저장되면 그게 동의 위반이다. */
export const writeRecord = (stages: BereavementStages, obituary: StoredObituary): boolean => {
  if (!available()) return false;
  const cur = safeParse(window.localStorage.getItem(KEY));
  if (!cur?.consentAt) return false;
  const rec: BereavementRecord = {
    consentAt: cur.consentAt,
    stages,
    // 빈 값은 저장하지 않는다 — 「고쳤는지」 와 「비워뒀는지」 를 구분해야 한다
    obituary: prune(obituary),
  };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(rec));
    return true;
  } catch {
    return false; // 용량 초과·접근 차단
  }
};

const prune = (o: StoredObituary): StoredObituary => {
  const out: StoredObituary = {};
  for (const [k, v] of Object.entries(o)) {
    if (v === undefined || v === null) continue;
    if (typeof v === 'string' && v.trim() === '') continue;
    if (Array.isArray(v) && v.length === 0) continue;
    (out as Record<string, unknown>)[k] = v;
  }
  return out;
};

export const grantConsent = (): boolean => {
  if (!available()) return false;
  try {
    const cur = safeParse(window.localStorage.getItem(KEY));
    window.localStorage.setItem(
      KEY,
      JSON.stringify({ consentAt: cur?.consentAt || new Date().toISOString(), stages: cur?.stages || {}, obituary: cur?.obituary || {} } satisfies BereavementRecord),
    );
    return true;
  } catch {
    return false;
  }
};

/** 동의와 데이터를 함께 지운다 — 「저장만 안 한다」 로는 충분하지 않다 */
export const revokeConsent = (): void => {
  if (!available()) return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* 차단된 환경에서는 지울 것도 없다 */
  }
};