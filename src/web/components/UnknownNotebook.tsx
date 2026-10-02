import React from 'react';
import type { FuneralSetting } from '../../life-archive/types.js';
import { DEFAULT_FUNERAL_SETTING } from '../../life-archive/lifeArchiveDataset.js';

interface UnknownNotebookProps {
  funeralSetting?: FuneralSetting;
  onUpdate?: (patch: Partial<FuneralSetting>) => void;
}

/**
 * 「아직 모르는 것」 수첩
 *
 * 왜 이것이 필요한가
 * ──────────────────
 * 지금 이 화면의 빈칸은 「미입력」 이라고 적힌다. 유족은 그 말을
 * 「내가 빠뜨렸다」 고 읽는다. 실제로는 아직 모르는 것일 뿐이다.
 * 그 차이를 아무것도 남기지 않으면 유족은 자기 자신을ogensFault 한 것으로
 * 여기고, 물어볼 사람도 모른 채 화면을 닫는다.
 *
 * 그래서 빈칸을 세 가지로 갈라 이 수첩에 남긴다.
 *   1) 무엇을 모르는가  — 자동 판정 (입력값이 비면 그 항목)
 *   2) 누구에게 물어보면 되는가 — 각 항목마다 붙여 둔다
 *   3) 적어 둘 메모 — 「자세히는 이 사람에게」 라는 한 줄
 *
 * 「나중에 정해도 됩니다」 를 누르면 무리지 않고 한쪽으로 물러난다.
 * 모르는 채로 두는 것과 잊어버리는 것은 다르다.
 *
 * 모의 조작 금지: 「알았다」 버튼 같은 것은 두지 않는다. 항목은 실제 값이
 * 채워지면 스스로 사라진다. 상태를 거짓으로 만들면 수첩이 거짓말을 한다.
 */

interface UnknownItem {
  key: string;
  label: string;
  ask: string;
  filled: boolean;
}

const UNKNOWN_ITEMS: UnknownItem[] = [
  {
    key: 'deceasedName',
    label: '고인 성함',
    ask: '주민등록증이나 가족이 알고 계실 겁니다.',
    filled: false
  },
  {
    key: 'deathDate',
    label: '고인의 마지막 날짜',
    ask: '병원 기록이나 장례식장 방문 시 확인할 수 있습니다.',
    filled: false
  },
  {
    key: 'hall',
    label: '장례식장 · 빈소',
    ask: '고인분이 전에 이용하셨던 곳을 먼저 떠올려 보시면 좋습니다.',
    filled: false
  },
  {
    key: 'departure',
    label: '발머니 · 장례 일시',
    ask: '빈소를 잡으면 일시가 함께 정해집니다. 지금은 비워 두셔도 됩니다.',
    filled: false
  },
  {
    key: 'chief',
    label: '상주자 · 연락처',
    ask: '가까운 가족에게 문자 한 통이면 충분합니다.',
    filled: false
  },
  {
    key: 'account',
    label: '조문금 계좌',
    ask: '은행에서 고인 명의 계좌를 확인하시면 됩니다.',
    filled: false
  }
];

export const UnknownNotebook: React.FC<UnknownNotebookProps> = ({
  funeralSetting,
  onUpdate
}) => {
  // ★ 모든 훅을 먼저 호출한다 — 이후 조건부 return 을 두지 않는다.
  const [showLater, setShowLater] = React.useState(false);

  const f = funeralSetting;
  const notes = f?.unknownNotes ?? {};
  const deferred: string[] = Array.isArray(f?.deferredUnknowns) ? f.deferredUnknowns : [];

  // ★ 기본값은 「비어 있음」 이 아니라 「아직 예시값」 이다.
  //   비었다고 세면 처음 열었을 때 수첩이 텅 비어 있어 아무 쓸모가 없다.
  //   실제로는 저 이름이 그대로 발송될 위험이 있는 상태다 — 그것이 「모른다」 이다.
  const isExample = (v: string | undefined, def: string | undefined) =>
    Boolean(v) && Boolean(def) && v === def;

  const items: UnknownItem[] = UNKNOWN_ITEMS.map((it) => {
    switch (it.key) {
      case 'deceasedName':
        return { ...it, filled: Boolean(f?.deceasedName) && !isExample(f?.deceasedName, DEFAULT_FUNERAL_SETTING.deceasedName) };
      case 'deathDate':
        return { ...it, filled: Boolean(f?.deathDate) && !isExample(f?.deathDate, DEFAULT_FUNERAL_SETTING.deathDate) };
      case 'hall':
        return { ...it, filled: Boolean(f?.funeralHallName) && !isExample(f?.funeralHallName, DEFAULT_FUNERAL_SETTING.funeralHallName) };
      case 'departure':
        return { ...it, filled: Boolean(f?.departureDateTime) && !isExample(f?.departureDateTime, DEFAULT_FUNERAL_SETTING.departureDateTime) };
      case 'chief':
        return { ...it, filled: (f?.chiefMourners ?? []).length > 0 && !isExample((f?.chiefMourners ?? []).join(', '), (DEFAULT_FUNERAL_SETTING.chiefMourners ?? []).join(', ')) };
      case 'account':
        return { ...it, filled: Boolean(f?.condolenceAccount) && !isExample(f?.condolenceAccount, DEFAULT_FUNERAL_SETTING.condolenceAccount) };
      default:
        return it;
    }
  });

  const unknown = items.filter((it) => !it.filled && !deferred.includes(it.key));
  const later = items.filter((it) => !it.filled && deferred.includes(it.key));

  const setNote = (key: string, value: string) => {
    onUpdate?.({ unknownNotes: { ...notes, [key]: value } });
  };

  const defer = (key: string, on: boolean) => {
    const next = on ? [...deferred, key] : deferred.filter((k) => k !== key);
    onUpdate?.({ deferredUnknowns: next });
  };

  if (unknown.length === 0 && later.length === 0) {
    return (
      <section
        aria-labelledby="unknown-notebook-heading"
        className="rounded-2xl border border-[#DCD6C9] bg-[#F1E9DB] p-5"
      >
        <h3
          id="unknown-notebook-heading"
          className="font-reverence text-[1.25rem] font-bold text-[#151719]"
        >
          아직 모르는 것
        </h3>
        <p className="mt-1 text-[1.125rem] text-[#42464E]">
          필요한 것을 모두 채우셨습니다. 남은 것은 정찰가가 계산해 드립니다.
        </p>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="unknown-notebook-heading"
      className="rounded-2xl border border-[#DCD6C9] bg-[#F1E9DB] p-5"
    >
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3
          id="unknown-notebook-heading"
          className="font-reverence text-[1.25rem] font-bold text-[#151719]"
        >
          아직 모르는 것
        </h3>
        <p className="text-[1.125rem] font-bold text-[#19382C]">
          {unknown.length > 0 ? `${unknown.length}가지` : '없음'}
        </p>
      </div>

      <p className="mt-1 text-[1.125rem] leading-relaxed text-[#42464E]">
        지금 안 아셔도 됩니다. 빠뜨린 것이 아닙니다. 무엇을 어디에 물어보면 되는지
        적어 두고 나중에 채우셔도 됩니다.
      </p>

      <ul className="mt-4 space-y-3">
        {unknown.map((it) => (
          <li
            key={it.key}
            className="rounded-xl border border-[#DCD6C9] bg-[#FAF9F6] p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[1.125rem] font-bold text-[#151719]">{it.label}</p>
                <p className="text-[1.125rem] leading-relaxed text-[#42464E]">{it.ask}</p>
              </div>
              <button
                type="button"
                onClick={() => defer(it.key, true)}
                className={`shrink-0 cursor-pointer rounded-lg border border-[#9E7D47] px-4 text-[1.125rem] font-bold text-[#6E5429] transition-colors hover:bg-[#F1EDE3] min-h-[3rem]`}
              >
                나중에 정하기
              </button>
            </div>
            <label className="mt-3 block">
              <span className="block text-[0.8125rem] font-bold text-[#5A5E66]">
                메모 — 누구에게 물어볼지
              </span>
              {/* 6개 입력의 라벨 문구가 모두 같았다. 스크린리더는 어느 항목의
                  메모인지 알 수 없었다 — 항목 이름을 이름에 넣는다. */}
              <input
                type="text"
                aria-label={`${it.label} 메모 — 누구에게 물어볼지`}
                value={notes[it.key] ?? ''}
                onChange={(e) => setNote(it.key, e.target.value)}
                placeholder="예: 큰딸에게 문자"
                className="mt-1 w-full rounded-lg border border-[#DCD6C9] bg-[#FFFFFF] px-3 text-[1.125rem] text-[#151719]"
              />
            </label>
          </li>
        ))}
      </ul>

      {later.length > 0 && (
        <div className="mt-4 rounded-xl border border-[#DCD6C9] bg-[#F1EDE3] p-4">
          <button
            type="button"
            onClick={() => setShowLater((v) => !v)}
            aria-expanded={showLater}
            aria-controls="unknown-notebook-later"
            className={`flex w-full cursor-pointer items-center justify-between gap-3 text-left font-bold text-[#151719] min-h-[3rem]`}
          >
            <span className="text-[1.125rem]">
              나중에 정하기로 해 둔 것 {later.length}가지
            </span>
            <span aria-hidden="true" className="text-[1.25rem] text-[#6E5429]">
              {showLater ? '−' : '+'}
            </span>
          </button>

          <div id="unknown-notebook-later" hidden={!showLater} className="mt-3 space-y-2">
            {later.map((it) => (
              <div
                key={it.key}
                className="flex flex-wrap items-center justify-between gap-2 border-t border-[#DCD6C9] pt-2"
              >
                <div className="min-w-0">
                  <p className="text-[1.125rem] font-bold text-[#151719]">{it.label}</p>
                  {notes[it.key] && (
                    <p className="text-[1.125rem] break-words text-[#42464E]">
                      {notes[it.key]}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => defer(it.key, false)}
                  className={`shrink-0 cursor-pointer rounded-lg border border-[#9E7D47] px-4 text-[1.125rem] font-bold text-[#6E5429] transition-colors hover:bg-[#F1EDE3] min-h-[3rem]`}
                >
                  지금 정하기
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default UnknownNotebook;