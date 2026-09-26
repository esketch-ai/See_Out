import React, { useState } from 'react';
import { BookOpen, Award, Image, Mic, Archive, Shield, Check, Lock, ChevronRight } from 'lucide-react';

export const LifeArchiveWidget: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<'storage' | 'organization' | 'companion'>('organization');

  const categories = [
    { icon: BookOpen, name: '일기 · 수첩', count: '12권', desc: '비파괴 스캔 및 텍스트 OCR 색인' },
    { icon: Award, name: '상장 · 자격증', count: '8점', desc: '생애 주요 성취 및 본인 의미 기록' },
    { icon: Image, name: '사진 · 영상', count: '1,420장', desc: '연도별·장소별 디지털 아카이빙' },
    { icon: Mic, name: '일상 · 음성 인터뷰', count: '4회', desc: '목소리로 남기는 삶의 철학과 이야기' },
    { icon: Archive, name: '물건 · 유품', count: '5점', desc: '다각도 3D/사진 촬영 및 가치 보존' },
    { icon: Shield, name: '디지털 유언장', count: '1통', desc: '게이트키퍼 사후 상속 암호화 보관' }
  ];

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 md:p-8 space-y-8">
      {/* 헤더 */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold mb-2">
          <span>평시 생애기록관 (Pre-mortem)</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
          내가 살아온 삶의 이야기와 흔적을 안전하게
        </h2>
        <p className="text-gray-600 mt-1.5 text-base">
          장례 이전 일상의 기억과 유품을 디지털로 정갈하게 보존하고, 사후에만 지정인에게 전달되는 안심 금고.
        </p>
      </div>

      {/* 6대 기록 카테고리 그리드 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {categories.map((c, i) => {
          const Icon = c.icon;
          return (
            <div
              key={i}
              className="p-4 rounded-2xl bg-gray-50 border border-gray-200 hover:border-blue-400 hover:bg-blue-50/40 transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-blue-600 mb-3 group-hover:scale-110 transition-transform">
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-gray-900 text-base">{c.name}</span>
                <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">{c.count}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{c.desc}</p>
            </div>
          );
        })}
      </div>

      {/* 게이트키퍼 사후 승계 프로토콜 배너 */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/30 text-blue-400 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-base flex items-center space-x-1.5">
              <span>사후 승계 게이트키퍼(Gatekeeper) 가동 중</span>
              <span className="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">보안 1등급</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              사망진단서 및 유산관리자 보안키 인증 전까지 데이터 열람이 100% 차단됩니다.
            </p>
          </div>
        </div>
      </div>

      {/* 구독 플랜 (기록 보관 / 정리 / 동행) */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-gray-900">생애기록관 구독 멤버십</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            {
              id: 'storage',
              name: '기록 보관 (Storage)',
              price: '월 4,900원',
              desc: '자율 업로드 및 영구 보관'
            },
            {
              id: 'organization',
              name: '기록 정리 (Organization)',
              price: '월 12,900원',
              popular: true,
              desc: 'AI 텍스트/음성 초안 정리 및 연표 생성'
            },
            {
              id: 'companion',
              name: '기록 동행 (Companionship)',
              price: '월 29,900원',
              desc: '전문 아키비스트 1:1 대면 인터뷰 지원'
            }
          ].map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id as any)}
              className={`p-4 rounded-2xl text-left border-2 transition-all relative ${
                selectedPlan === plan.id
                  ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/20'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-2.5 right-4 bg-blue-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                  가장 추천
                </span>
              )}
              <div className="font-extrabold text-base text-gray-900">{plan.name}</div>
              <div className="text-lg font-black text-blue-700 mt-1">{plan.price}</div>
              <div className="text-xs text-gray-500 mt-1">{plan.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
