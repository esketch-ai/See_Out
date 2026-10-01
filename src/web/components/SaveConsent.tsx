import React from 'react';
import { useState } from 'react';
import { ShieldCheck, Trash2 } from 'lucide-react';

/**
 * 「이 기기에 기억시키기」 동의 화면
 *
 * ★ 왜 동의 화면이 먼저인가
 *   저장되는 것에는 고인 이름과 조문금 계좌가 들어간다. 「편하니까」 만으로는
 *   동의가 아니다. 무엇을 · 어디에 · 어떻게 지우는지를 말한 뒤에 물어야 한다.
 *   고령 유족이면 「다음」 을 누르는 것이 기본값이 되기 때문에 더 그렇다.
 *
 * ★ 기본값은 「아니오」 다
 *   체크가 미리 켜져 있으면 동의로 치지 않는다. 무엇을 지우려 했는지에 따라
 *   「다음」 이 누르는 쪽이 잘못 누를 수 있으므로, 두 버튼을 같은 크기로 준다.
 *
 * ★ 「지우기」 는 언제나 보인다
 *   나중에 후회해도 되려면. 동의 철회 경로가 없으면 동의가 강요가 된다.
 */

export interface SaveConsentProps {
  /** 이미 동의했는지 */
  granted: boolean;
  /** 이 기기에 저장된 내용이 있는지 */
  hasRecord: boolean;
  onAgree: () => void;
  onErase: () => void;
}

const PENDING = `저장되는 것
· 지금 어디까지 왔는지 (접수 · 예식 · 비용 · 전하기 4단계)
· 이 화면에 적으신 부고장 내용 (성함 · 생년월일 · 상주자 · 연락처 · 조문금 계좌)

저장되지 않는 것
· 결제 정보 · 신분증 정보 · 위치 기록
· 서버로 보내는 일은 없습니다. 이 기기 안에만 남습니다.

잊어버리면
· 다시 처음부터 하셔야 합니다. 밤사이 다시 들어오신 분이 특히 그렇습니다.

나중에 지우려면
· 「이 기기에서 지우기」 를 누르시면 남긴 것이 전부 사라집니다.`;

export const SaveConsent: React.FC<SaveConsentProps> = ({ granted, hasRecord, onAgree, onErase }) => {
  if (granted) {
    return (
      <section
        aria-label="이 기기에 저장된 의전 기록"
        className="rounded-xl border border-[#DCD6C9] bg-[#FAF9F6] p-4 flex flex-wrap items-center justify-between gap-3"
      >
        <p className="text-[0.9375rem] text-[#42464E] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#19382C] shrink-0" />
          {hasRecord
            ? '이 기기에 이어서 기록하고 있습니다. 다른 사람이 이 기기를 쓰시면 내용도 보입니다.'
            : '이 기기에 기억시키기로 하셨습니다. 아직 적으신 내용은 없습니다.'}
        </p>
        <button
          type="button"
          onClick={onErase}
          className="k-tap px-4 rounded-md border border-[#8B2520] text-[#8B2520] text-[0.9375rem] font-bold flex items-center gap-1.5"
        >
          <Trash2 className="w-4 h-4" />
          이 기기에서 지우기
        </button>
      </section>
    );
  }

  // ★ 기본 접힘 — 동의 화면이 첫 화면을 가리면 안 된다.
  //   긴급 의전 접수하러 온 분에게 가장 먼저 보여줄 것은 동의가 아니라
  //   「24시 전화」 다. 한 줄로 물어보고, 필요할 때 펼친다.
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section
      aria-labelledby="save-consent-title"
      className="rounded-xl border border-[#DCD6C9] bg-[#FFFFFF] overflow-hidden"
    >
      <h2 id="save-consent-title" className="sr-only">이 기기에 기억시킬까요?</h2>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls="save-consent-body"
        onClick={() => setIsOpen((v) => !v)}
        className="k-tap w-full px-4 py-3 bg-[#F1E9DB] flex items-center justify-between gap-3 text-left"
      >
        <span className="text-[1.125rem] font-bold text-[#151719]">
          이 기기에 기억시키기
          <span className="block text-[0.8125rem] font-normal text-[#42464E]">
            선택입니다 · 고인 이름과 조문금 계좌가 이 휴대전화에 남습니다
          </span>
        </span>
        <span aria-hidden="true" className="text-[0.9375rem] font-bold text-[#19382C] whitespace-nowrap">
          {isOpen ? '접기 ▲' : '자세히 ▼'}
        </span>
      </button>

      <div id="save-consent-body" hidden={!isOpen}>
      <div className="px-5 py-4 bg-[#FFFFFF] border-t border-[#DCD6C9]">
        <p className="font-bold text-[1.125rem] text-[#151719]">이 기기에 기억시킬까요?</p>
        <p className="text-[0.9375rem] text-[#42464E] mt-1">
          밤사이 다시 들어오실 때 매번 처음부터 하지 않도록, 진행 상황과 부고장 내용을
          이 휴대전화 안에만 남기는 기능입니다.
        </p>
      </div>

      <pre className="px-5 py-4 text-[0.9375rem] leading-relaxed whitespace-pre-wrap font-sans text-[#151719]">
        {PENDING}
      </pre>

      {/* 두 버튼을 같은 크기로 — 「다음」 을 누르는 분이 「아니오」 를 고르려면
          어느 쪽이 답인지 알아야 하고, 어느 쪽이 답이든 누를 수 있어야 한다. */}
      <div className="px-5 pb-5 flex flex-col sm:flex-row gap-2">
        <button
          type="button"
          onClick={onAgree}
          className="k-tap flex-1 px-4 py-3 rounded-md bg-[#19382C] text-[#FAF9F6] text-[1.125rem] font-bold"
        >
          네, 이 기기에 기억시켜 주세요
        </button>
        <button
          type="button"
          onClick={onErase}
          className="k-tap flex-1 px-4 py-3 rounded-md border border-[#8B2520] text-[#8B2520] text-[1.125rem] font-bold"
        >
          아니요, 매번 처음부터 할게요
        </button>
      </div>
      </div>
    </section>
  );
};