import React from 'react';
import { PhoneCall } from 'lucide-react';
import type { SharedObituary } from '../life-archive/obituaryShare.js';

/**
 * 「링크를 받은 사람이 보는 부고장」 — 읽기 전용.
 *
 * ■ 왜 따로 만드는가
 *   받는 쪽은 유족이 아니다. 조문객이거나 도시에 있는 가족이다.
 *   이들은 「24시 전화」 도 「비용 진단」 도 필요 없다. 부고장 한 장이면 충분하다.
 *   앱 전체를 열면 아무것도 찾지 못한다 — 그래서 주소창 하나에 이 화면이 온다.
 *
 * ★ 이 화면에서는 아무것도 저장하지 않는다
 *   수신자의 기기에 유족의 정보가 남으면 안 된다. 읽기만 한다.
 */

export interface SharedObituaryViewProps {
  data: SharedObituary;
  /** 손상된 링크였을 때 */
  broken?: boolean;
}

export const SharedObituaryView: React.FC<SharedObituaryViewProps> = ({ data, broken }) => {
  if (broken || !data) {
    return (
      <main className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-6">
        <div className="max-w-md text-center space-y-3">
          <h1 className="text-[1.5rem] font-bold text-[#151719]">부고장을 열 수 없습니다</h1>
          <p className="text-[1.125rem] text-[#42464E] leading-relaxed">
            링크가 중간에 잘렸을 수 있습니다. 보내주신 분에게 다시 요청해 주세요.
          </p>
          <a
            href="tel:1588-0000"
            className="k-tap-lg inline-flex items-center justify-center gap-2 px-6 rounded-lg bg-[#19382C] text-[#FAF9F6] text-[1.125rem] font-bold"
          >
            <PhoneCall className="w-5 h-5" />
            배웅 24시 1588-0000
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF9F6] py-6 px-4">
      <article className="max-w-2xl mx-auto bg-[#FFFFFF] border border-[#DCD6C9] rounded-2xl overflow-hidden">
        <header className="px-6 py-5 border-b border-[#DCD6C9] bg-[#F1E9DB] text-center">
          <p className="text-[0.8125rem] font-bold text-[#8B2520] tracking-widest">부 고</p>
          <h1 className="mt-1 font-reverence font-bold text-[1.75rem] leading-tight text-[#151719] break-words">
            {data.n}
          </h1>
          {data.c && <p className="mt-1 text-[1.125rem] text-[#42464E]">본관 {data.c}</p>}
          {(data.b || data.d) && (
            <p className="mt-1 text-[1.125rem] text-[#151719]">
              {data.b ? `${data.b} 생` : ''}
              {data.b && data.d ? ' → ' : ''}
              {data.d ? `${data.d} 별` : ''}
              {typeof data.a === 'number' ? ` · 만 ${data.a}세` : ''}
            </p>
          )}
        </header>

        <div className="px-6 py-5 space-y-4 text-[1.125rem] leading-relaxed">
          {data.t && (
            <p>
              <span className="font-bold">발인</span> {data.t}
            </p>
          )}

          {(data.h || data.r) && (
            <p>
              <span className="font-bold">빈소</span> {data.h} {data.r}
            </p>
          )}
          {data.g && (
            <p className="text-[#42464E]">
              <span className="font-bold text-[#151719]">주소</span> {data.g}
            </p>
          )}

          {data.m && (
            <p>
              <span className="font-bold">상주</span> {data.m}
            </p>
          )}
          {data.p && (
            <a
              href={`tel:${data.p.replace(/[^0-9+]/g, '')}`}
              className="flex items-center gap-2 font-bold text-[#19382C] underline underline-offset-4 min-h-[3rem]"
            >
              <PhoneCall className="w-5 h-5 shrink-0" />
              {data.p}
            </a>
          )}

          {data.x && (
            <p className="rounded-lg bg-[#F1E9DB] p-3 border border-[#DCD6C9]">
              <span className="block text-[0.8125rem] font-bold text-[#8B2520]">정찰가 근거 번호</span>
              <span className="block text-[1.25rem] font-bold text-[#151719] break-all">{data.x}</span>
              <span className="block text-[0.9375rem] text-[#42464E]">
                식장에서 이 번호를 말씀하시면 사전 등록 정찰가가 적용됩니다.
              </span>
            </p>
          )}

          <p className="pt-3 border-t border-[#DCD6C9] text-[#42464E] text-[0.9375rem]">
            조문금은 상주자에게 직접 문의해 주세요.
          </p>
        </div>

        <footer className="px-6 py-5 border-t border-[#DCD6C9] bg-[#F1E9DB] flex flex-col sm:flex-row gap-2">
          <a
            href={`tel:${(data.p || '1588-0000').replace(/[^0-9+]/g, '')}`}
            className="k-tap-lg flex-1 inline-flex items-center justify-center gap-2 px-5 rounded-lg bg-[#19382C] text-[#FAF9F6] text-[1.125rem] font-bold"
          >
            <PhoneCall className="w-5 h-5" />
            {data.p ? '상주자에게 전화' : '배웅 24시 1588-0000'}
          </a>
          <a
            href="tel:1588-0000"
            className="k-tap-lg flex-1 inline-flex items-center justify-center px-5 rounded-lg border border-[#19382C] text-[#19382C] text-[1.125rem] font-bold"
          >
            의전 관련 도움
          </a>
        </footer>
      </article>
    </main>
  );
};