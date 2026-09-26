import React, { useState } from 'react';
import { BookOpen, Award, Image, Mic, Archive, Shield, Lock, Sparkles } from 'lucide-react';
import { TraditionalSeal } from '../design-system/index.js';

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
    <div className="bg-[#FFFFFF] rounded-xl shadow-xs border border-[#E3DFD5] p-6 md:p-8 space-y-6">
      {/* 1. 상단 실제 훈장 및 가족 사진 비주얼 헤더 */}
      <div className="relative rounded-lg overflow-hidden h-44 sm:h-52 border border-[#2D2A26] bg-[#121417]">
        <img
          src="/images/life-archive.jpg"
          alt="훈장과 흑백 가족 사진, 소중한 회고록"
          className="w-full h-full object-cover object-center filter brightness-[0.4] contrast-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0E10] via-[#0D0E10]/50 to-transparent flex flex-col justify-end p-6">
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded bg-[#19382C]/90 text-[#FAF9F6] text-xs font-serif mb-2 border border-[#2A5442] w-fit">
            <TraditionalSeal sealKey="eternity" size="sm" />
            <span>평시 생애기록관 (Pre-mortem)</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-reverence font-black text-[#FAF9F6] tracking-tight">
            내가 살아온 삶의 이야기와 흔적을 정갈하게
          </h2>
          <p className="text-[#D4CEC2] text-xs sm:text-sm font-serif mt-1">
            이별의 순간이 오기 전, 평생을 바쳐 일구어 오신 귀한 기억과 유품을 정성껏 디지털로 봉안하여 가족에게 온전히 전합니다.
          </p>
        </div>
      </div>

      {/* 2. 6대 기록 카테고리 그리드 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {categories.map((c, i) => {
          const Icon = c.icon;
          return (
            <div
              key={i}
              className="p-4 rounded-lg bg-[#FAF9F6] border border-[#E3DFD5] hover:border-[#9E7D47] hover:bg-[#FFFFFF] transition-all cursor-pointer group text-left"
            >
              <div className="w-9 h-9 rounded-md bg-[#FFFFFF] border border-[#E3DFD5] flex items-center justify-center text-[#9E7D47] mb-2.5 shadow-xs">
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex justify-between items-center">
                <span className="font-serif font-bold text-[#151719] text-sm md:text-base">{c.name}</span>
                <span className="text-[10px] font-serif font-bold bg-[#F8F5EE] text-[#876937] px-2 py-0.5 rounded border border-[#E4D5BC]">
                  {c.count}
                </span>
              </div>
              <p className="text-xs text-[#727782] mt-1 leading-relaxed font-serif">{c.desc}</p>
            </div>
          );
        })}
      </div>

      {/* 3. 게이트키퍼(Gatekeeper) 사후 승계 프로토콜 배너 */}
      <div className="bg-[#132B22] text-[#FAF9F6] rounded-lg p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-[#2D5A46]">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-md bg-[#0E1E18] text-[#C2A26A] flex items-center justify-center shrink-0 border border-[#2A5442]">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="font-serif font-bold text-base flex items-center space-x-2">
              <span>사후 승계 게이트키퍼 (Gatekeeper) 보안 가동</span>
              <span className="text-[10px] font-serif font-bold bg-[#19382C] text-[#C2A26A] px-2 py-0.5 rounded border border-[#2A5442]">
                보안 1등급
              </span>
            </div>
            <p className="text-xs text-[#BFD4CA] mt-0.5 leading-relaxed font-serif">
              사망진단서 및 유산관리자 접근키가 공식 인증되기 전까지, 모든 기록은 암호화되어 철저히 비공개로 봉인됩니다.
            </p>
          </div>
        </div>
      </div>

      {/* 4. 생애기록관 멤버십 */}
      <div className="space-y-3">
        <h3 className="text-base font-serif font-bold text-[#151719]">생애기록관 정기 보존 멤버십</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
          ].map((plan) => {
            const isSelected = selectedPlan === plan.id;
            return (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id as any)}
                className={`p-4 rounded-lg text-left border transition-all relative cursor-pointer ${
                  isSelected
                    ? 'border-[#9E7D47] bg-[#F8F5EE] ring-1 ring-[#9E7D47]'
                    : 'border-[#E3DFD5] bg-[#FAF9F6] hover:bg-[#FFFFFF]'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-2.5 right-3 bg-[#9E7D47] text-[#0E1012] text-[10px] font-serif font-black px-2 py-0.2 rounded shadow-xs">
                    가장 추천
                  </span>
                )}
                <div className="font-serif font-bold text-sm text-[#151719]">{plan.name}</div>
                <div className="text-lg font-serif font-black text-[#19382C] mt-1">{plan.price}</div>
                <div className="text-xs text-[#727782] mt-1 leading-relaxed font-serif">{plan.desc}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
