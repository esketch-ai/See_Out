import React, { useState } from 'react';
import { BookOpen, Award, Image, Mic, Archive, Shield, Lock } from 'lucide-react';

export const LifeArchiveWidget: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<'storage' | 'organization' | 'companion'>('organization');

  const categories = [
    { icon: BookOpen, name: '일기 · 친필 수첩', count: '12권 보존', desc: '비파괴 정밀 스캔 및 검색 색인' },
    { icon: Award, name: '상장 · 훈장 · 자격', count: '8점 보존', desc: '생애 주요 성취와 자긍심의 기록' },
    { icon: Image, name: '사진 · 가족 영상', count: '1,420장 보존', desc: '연대기별 디지털 보존 및 복원' },
    { icon: Mic, name: '육성 회고록 인터뷰', count: '4편 보존', desc: '부모님의 따뜻한 목소리와 삶의 지혜' },
    { icon: Archive, name: '물건 · 유품 이야기', count: '5점 보존', desc: '소중한 손때 묻은 유품의 의미 기록' },
    { icon: Shield, name: '디지털 유언장', count: '1통 보관', desc: '사후 지정인에게만 열리는 안심 금고' }
  ];

  return (
    <div className="bg-porcelain rounded-3xl shadow-sm border border-ink-border p-6 md:p-10 space-y-8">
      {/* 헤더 */}
      <div className="border-b border-ink-border pb-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-nobleGold-100 text-nobleGold-700 text-xs font-serif font-bold mb-3 border border-nobleGold-500/20">
          <span>평시 생애기록관 (Pre-mortem)</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-reverence font-black text-ink tracking-tight">
          내가 살아온 삶의 이야기와 흔적을 정갈하게
        </h2>
        <p className="text-ink-light mt-2 text-base md:text-lg leading-relaxed">
          이별의 순간이 오기 전, 평생을 바쳐 일구어 오신 귀한 기억과 유품을 정성껏 디지털로 봉안하여 가족에게 온전히 전합니다.
        </p>
      </div>

      {/* 6대 기록 카테고리 그리드 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5">
        {categories.map((c, i) => {
          const Icon = c.icon;
          return (
            <div
              key={i}
              className="p-5 rounded-2xl bg-hanji/60 border border-ink-border hover:border-nobleGold-500 hover:bg-porcelain transition-all cursor-pointer group text-left"
            >
              <div className="w-11 h-11 rounded-xl bg-porcelain border border-ink-border flex items-center justify-center text-nobleGold-600 mb-3.5 group-hover:scale-105 transition-transform shadow-xs">
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex justify-between items-center">
                <span className="font-reverence font-bold text-ink text-base md:text-lg">{c.name}</span>
                <span className="text-[11px] font-serif font-bold bg-nobleGold-100 text-nobleGold-700 px-2.5 py-0.5 rounded-full border border-nobleGold-500/20">
                  {c.count}
                </span>
              </div>
              <p className="text-xs text-ink-muted mt-1.5 leading-relaxed">{c.desc}</p>
            </div>
          );
        })}
      </div>

      {/* 게이트키퍼(Gatekeeper) 사후 승계 프로토콜 배너 */}
      <div className="bg-mourning-900 text-white rounded-3xl p-6 md:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-white/10">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 text-nobleGold-500 flex items-center justify-center shrink-0">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <div className="font-reverence font-bold text-lg md:text-xl flex items-center space-x-2">
              <span>사후 승계 게이트키퍼 (Gatekeeper) 보안 가동</span>
              <span className="text-[11px] font-serif font-bold bg-celadon-600 text-white px-2.5 py-0.5 rounded-full">
                보안 1등급
              </span>
            </div>
            <p className="text-xs md:text-sm text-gray-300 mt-1 leading-relaxed">
              사망진단서 및 유산관리자 접근키가 공식 인증되기 전까지, 모든 기록은 암호화되어 철저히 비공개로 봉인됩니다.
            </p>
          </div>
        </div>
      </div>

      {/* 생애기록관 멤버십 */}
      <div className="space-y-4">
        <h3 className="text-lg font-reverence font-bold text-ink">생애기록관 정기 보존 멤버십</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {[
            {
              id: 'storage',
              name: '기록 보관 (Storage)',
              price: '월 4,900원',
              desc: '자율 업로드 및 영구 보존'
            },
            {
              id: 'organization',
              name: '기록 정리 (Organization)',
              price: '월 12,900원',
              popular: true,
              desc: 'AI 텍스트/음성 초안 정리 및 연표 디지털화'
            },
            {
              id: 'companion',
              name: '기록 동행 (Companionship)',
              price: '월 29,900원',
              desc: '전문 아키비스트 1:1 대면 인터뷰 및 실물 기록집 제작'
            }
          ].map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id as any)}
              className={`p-5 rounded-2xl text-left border-2 transition-all relative ${
                selectedPlan === plan.id
                  ? 'border-celadon-700 bg-celadon-50/60 ring-2 ring-celadon-700/20'
                  : 'border-ink-border bg-hanji/40 hover:bg-porcelain'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 right-4 bg-nobleGold-500 text-gray-950 text-xs font-serif font-bold px-3 py-0.5 rounded-full shadow-sm">
                  가장 추천
                </span>
              )}
              <div className="font-reverence font-bold text-base md:text-lg text-ink">{plan.name}</div>
              <div className="text-xl font-reverence font-black text-celadon-800 mt-1.5">{plan.price}</div>
              <div className="text-xs text-ink-muted mt-1 leading-relaxed">{plan.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
