import React from 'react';
import { Check } from 'lucide-react';

/**
 * 「지금 무엇을 해야 하나요?」 — 의전 진행 바
 *
 * ■ 왜 있는가
 *   유가족은 자정에 새로 들어와도 「나는 어디까지 왔는지」 알 수단이 없었다.
 *   화면이 5개 탭으로 흩어져 있고, 한 사람이 밤사이 시간 간격으로 다시 온다.
 *   시골 독거 유족은 특히 심하다 — 옆에 물어볼 사람이 없다.
 *
 * ★ 수동으로 체크를 표시하지 않는다
 *   「체크박스를 눌러 완료로 표시하는」 진행 바는 곧 거짓말이 된다.
 *   여기서는 실제 행동(빈소 선택·패키지 선택·부고장 작성·발송)으로만 켜진다.
 *   그래서 「이미 했는데 표시가 안 된다」 는 역오류가 생기지 않는다.
 *
 * ★ 「아직」 을 감추지 않는다
 *   빈소를 못 정했어도 상태로 남는다. 못 정했다는 것을 보이는 것이
 *   「오늘 뭐를 해야 하나」 를 알려주는 유일한 방법이다.
 */

export type BereavementStageKey = 'intake' | 'ceremony' | 'cost' | 'record';

export interface BereavementProgressProps {
  done: Partial<Record<BereavementStageKey, boolean>>;
  /** 각 단계로 이동할 화면. 미완료 단계는 「안내」 로만 쓴다. */
  onGo: (tab: 'quote' | 'funeral-halls' | 'packages' | 'life-archive') => void;
  /** 현재 보고 있는 화면 */
  currentTab: string;
}

const STAGES: { key: BereavementStageKey; no: string; label: string; todo: string; tab: 'quote' | 'funeral-halls' | 'packages' | 'life-archive' }[] = [
  {
    key: 'intake',
    no: '1',
    label: '접수',
    todo: '고인 정보와 부고장을 적어보세요. 지금 한 줄만 써도 됩니다.',
    tab: 'life-archive',
  },
  {
    key: 'ceremony',
    no: '2',
    label: '빈소 · 예식',
    todo: '들어가게 될 빈소를 고르세요. 못 고르셔도 「상담 전화」 로 대신 의뢰합니다.',
    tab: 'funeral-halls',
  },
  {
    key: 'cost',
    no: '3',
    label: '비용 정리',
    todo: '몇 만 원 규모인지 먼저 보세요. 비교 전에 금액을 알면 마음이 놓입니다.',
    tab: 'quote',
  },
  {
    key: 'record',
    no: '4',
    label: '전하기',
    todo: '부고장을 가족에게 보내세요. 시골에 혼자 계시면 이것만으로도 됩니다.',
    tab: 'life-archive',
  },
];

const countDone = (done: Partial<Record<BereavementStageKey, boolean>>) =>
  STAGES.filter((s) => done[s.key]).length;
const findNext = (done: Partial<Record<BereavementStageKey, boolean>>) =>
  STAGES.find((s) => !done[s.key]);

export const BereavementProgress: React.FC<BereavementProgressProps> = ({ done, onGo, currentTab }) => {
  // ★ 접힌 상태에서도 「몇 / 몇 · 다음」 이 보인다.
  //   폰에서는 히어로가 첫 화면을 다 차지해 진행 바가 화면 밖에 놓였다.
  //   도착했을 때 안 보이면 없는 것과 같다 — 그래서 접되 접히지 않는다.
  const [isOpen, setIsOpen] = React.useState(false);
  const doneCount = countDone(done);
  const n = doneCount;
  // 「다음에 할 일」 = 아직 안 끝난 첫 단계. 끝났으면 전부 끝난 것으로 본다
  const next = findNext(done);

  return (
    <section
      aria-labelledby="bereavement-progress-title"
      className="rounded-xl border border-[#DCD6C9] bg-[#FFFFFF] overflow-hidden"
    >
      <h2 id="bereavement-progress-title" className="sr-only">
        지금 무엇을 해야 하나요?
      </h2>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls="bereavement-progress-body"
        onClick={() => setIsOpen((v) => !v)}
        className="k-tap w-full px-4 py-3 bg-[#F1E9DB] flex items-center justify-between gap-3 text-left"
      >
        <span className="text-[1.125rem] font-bold text-[#151719]">
          지금 {n} / {STAGES.length} 완료
          <span className="block text-[0.8125rem] font-normal text-[#42464E]">
            {next ? `지금 필요한 것 — ${next.label}` : '네 단계 모두 끝났습니다'}
          </span>
        </span>
        <span aria-hidden="true" className="text-[0.9375rem] font-bold text-[#19382C] whitespace-nowrap">
          {isOpen ? '접기 ▲' : '자세히 보기 ▼'}
        </span>
      </button>

      <div id="bereavement-progress-body" hidden={!isOpen}>
      <div className="px-5 py-4 border-b border-[#DCD6C9] bg-[#FAF9F6] flex items-center justify-between gap-3">
        <span className="font-bold text-[1.125rem] text-[#151719]">지금 무엇을 해야 하나요?</span>
        <span className="text-[1.125rem] font-bold text-[#19382C] whitespace-nowrap">
          {doneCount} / {STAGES.length} 완료
        </span>
      </div>

      <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {STAGES.map((s) => {
          const isDone = !!done[s.key];
          const isNext = next?.key === s.key;
          return (
            <li
              key={s.key}
              className={`p-4 border-b sm:border-b-0 sm:border-r border-[#DCD6C9] last:border-r-0 ${
                isNext ? 'bg-[#F1E9DB]' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center font-bold ${
                    isDone
                      ? 'bg-[#19382C] text-[#FAF9F6]'
                      : isNext
                        ? 'bg-[#8B2520] text-[#FAF9F6]'
                        : 'border-2 border-[#DCD6C9] text-[#5A5E66]'
                  }`}
                >
                  {isDone ? <Check className="w-4 h-4" /> : s.no}
                </span>
                <span
                  className={`text-[1.125rem] font-bold ${
                    isDone ? 'text-[#5A5E66] line-through' : 'text-[#151719]'
                  }`}
                >
                  {s.label}
                </span>
              </div>

              <p className="mt-2 text-[0.9375rem] leading-relaxed text-[#42464E]">
                {isDone ? '끝났습니다.' : s.todo}
              </p>

              {!isDone && (
                <button
                  type="button"
                  onClick={() => onGo(s.tab)}
                  className="k-tap mt-2 w-full px-3 rounded-md border border-[#19382C] text-[#19382C] text-[0.9375rem] font-bold"
                >
                  {currentTab === s.tab ? '지금 보고 있는 화면입니다' : `여기로 가기 — ${s.label}`}
                </button>
              )}
            </li>
          );
        })}
      </ol>

      <p className="px-5 py-3 border-t border-[#DCD6C9] bg-[#FAF9F6] text-[0.9375rem] text-[#42464E]">
        {next
          ? `지금 필요한 것은 「${next.label}」 입니다. ${next.todo}`
          : '네 단계 모두 끝났습니다. 고인의 이야기를 남겨두시면 유가족이 오래 보게 됩니다.'}
      </p>
      </div>
    </section>
  );
};