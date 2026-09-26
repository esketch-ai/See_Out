import React, { useState } from 'react';
import { Phone, MapPin, Building2, CheckCircle2, Clock, ShieldCheck, ArrowRight, Heart } from 'lucide-react';

export const EmergencyMode: React.FC<{ onExitEmergency: () => void }> = ({ onExitEmergency }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [deceasedLocation, setDeceasedLocation] = useState<'hospital' | 'home' | 'care' | ''>('');
  const [locationDetail, setLocationDetail] = useState('');
  const [funeralHallChoice, setFuneralHallChoice] = useState<'recommended' | 'designated' | ''>('');
  const [hallName, setHallName] = useState('');

  return (
    <div className="min-h-screen bg-mourning-950 text-white pb-24">
      {/* 경건한 상단 추모 및 안심 바 */}
      <div className="bg-mourning-900 border-b border-white/10 px-4 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-3 h-3 rounded-full bg-crimson-600 animate-ping" />
          <span className="font-serif font-bold text-base md:text-lg text-gray-200">
            24시간 국가공인 전담 의전 상황실 (전국 2시간 내 현장 도착)
          </span>
        </div>
        <button
          onClick={onExitEmergency}
          className="text-xs bg-white/10 hover:bg-white/20 text-gray-300 px-3.5 py-1.5 rounded-xl font-bold transition-all"
        >
          평시 화면으로 돌아가기 ✕
        </button>
      </div>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        {/* 추모 서두 문구 */}
        <div className="text-center space-y-2 py-2">
          <div className="inline-block text-nobleGold-500 font-serif text-sm tracking-widest uppercase">
            謹 弔 · 삼가 고인의 명복을 빕니다
          </div>
          <h1 className="text-3xl md:text-4xl font-reverence font-black tracking-tight text-white">
            가장 경건하고 정중한 예(禮)로 모시겠습니다
          </h1>
          <p className="text-gray-400 text-base md:text-lg leading-relaxed pt-1">
            경황없는 깊은 슬픔의 순간, 가족의 마음으로 처음부터 끝까지 곁을 지키겠습니다.
          </p>
        </div>

        {/* 24시 직통 상황실 핫라인 (어르신 전용 특대형 버튼 68dp) */}
        <a
          href="tel:1588-0000"
          className="w-full bg-gradient-to-r from-crimson-700 to-crimson-600 hover:from-crimson-600 hover:to-crimson-500 active:scale-[0.99] text-white p-6 rounded-3xl flex items-center justify-between shadow-2xl border-2 border-crimson-600/60 transition-all cursor-pointer group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-nobleGold-100 group-hover:scale-105 transition-transform">
              <Phone className="w-8 h-8" />
            </div>
            <div className="text-left">
              <div className="text-sm font-serif text-nobleGold-100">통화로 안내받는 것이 가장 편안하십니다</div>
              <div className="text-2xl md:text-3xl font-reverence font-black tracking-tight">
                24시 전담 의전팀 즉시 전화 연결
              </div>
            </div>
          </div>
          <ArrowRight className="w-7 h-7 text-nobleGold-100 hidden sm:block" />
        </a>

        {/* 3단계 진행 스테퍼 (시니어 명료 UI) */}
        <div className="flex items-center justify-between px-4 bg-mourning-900/80 rounded-2xl p-4 border border-white/5">
          {[
            { num: 1, label: '1. 고인 계신 곳' },
            { num: 2, label: '2. 모실 장례식장' },
            { num: 3, label: '3. 전담 지도사 배정' }
          ].map((s) => (
            <div key={s.num} className="flex-1 flex items-center">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${
                    step >= s.num
                      ? 'bg-nobleGold-500 text-gray-950 ring-4 ring-nobleGold-500/20'
                      : 'bg-gray-800 text-gray-500'
                  }`}
                >
                  {s.num}
                </div>
                <span className={`text-xs mt-1.5 font-bold ${step >= s.num ? 'text-nobleGold-100' : 'text-gray-500'}`}>
                  {s.label}
                </span>
              </div>
              {s.num < 3 && (
                <div className={`h-0.5 flex-1 ${step > s.num ? 'bg-nobleGold-500' : 'bg-gray-800'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: 고인 현재 위치 입력 */}
        {step === 1 && (
          <div className="bg-mourning-900 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-reverence font-bold text-white flex items-center space-x-2">
                <MapPin className="text-nobleGold-500 w-7 h-7 shrink-0" />
                <span>현재 고인을 어디에 모시고 계십니까?</span>
              </h2>
              <p className="text-gray-400 text-base mt-2 leading-relaxed">
                전국 어디든 전담 운구차량과 의전 지도사가 2시간 이내에 정중히 도착합니다.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'hospital', title: '병원 · 응급실', desc: '병원 내 임종 / 안치 전' },
                { id: 'home', title: '자택', desc: '가정 내 평온한 임종' },
                { id: 'care', title: '요양병원 · 요양원', desc: '요양 전문 시설' }
              ].map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => setDeceasedLocation(loc.id as any)}
                  className={`p-5 rounded-2xl text-left border-2 transition-all min-h-[96px] ${
                    deceasedLocation === loc.id
                      ? 'border-nobleGold-500 bg-nobleGold-500/10 text-white shadow-md ring-2 ring-nobleGold-500/30'
                      : 'border-white/10 bg-mourning-950/60 text-gray-300 hover:border-white/30'
                  }`}
                >
                  <div className="font-reverence font-bold text-xl">{loc.title}</div>
                  <div className="text-xs text-gray-400 mt-1">{loc.desc}</div>
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <label className="block text-base font-bold text-gray-300">
                상세 위치 또는 병원 명칭 (아시는 만큼만 편히 적어주세요)
              </label>
              <input
                type="text"
                value={locationDetail}
                onChange={(e) => setLocationDetail(e.target.value)}
                placeholder="예: 서울아산병원 본관 응급실 / 분당 구미동 자택"
                className="w-full bg-mourning-950 border border-white/15 rounded-2xl px-5 py-4 text-white text-lg placeholder-gray-500 focus:outline-none focus:border-nobleGold-500"
              />
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!deceasedLocation}
              className="w-full btn-senior-reverence bg-celadon-700 hover:bg-celadon-600 disabled:bg-gray-800 disabled:text-gray-600 text-white flex items-center justify-center space-x-2 text-xl shadow-xl transition-all"
            >
              <span>다음: 모실 장례식장 선택</span>
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* Step 2: 장례식장 선택 */}
        {step === 2 && (
          <div className="bg-mourning-900 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-reverence font-bold text-white flex items-center space-x-2">
                <Building2 className="text-nobleGold-500 w-7 h-7 shrink-0" />
                <span>모시고자 하는 장례식장을 결정하셨습니까?</span>
              </h2>
              <p className="text-gray-400 text-base mt-2 leading-relaxed">
                배웅 제휴 식장 선택 시 빈소 임대료 최대 30% 감면 혜택이 적용됩니다.
              </p>
            </div>

            <div className="space-y-3.5">
              <button
                onClick={() => setFuneralHallChoice('recommended')}
                className={`w-full p-5 rounded-2xl text-left border-2 transition-all ${
                  funeralHallChoice === 'recommended'
                    ? 'border-nobleGold-500 bg-nobleGold-500/10 text-white shadow-md ring-2 ring-nobleGold-500/30'
                    : 'border-white/10 bg-mourning-950/60 text-gray-300 hover:border-white/30'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-reverence font-bold text-xl">배웅 제휴 감면 장례식장 추천</span>
                  <span className="text-xs bg-celadon-600 text-white px-3 py-1 rounded-full font-bold">임대료 감면 혜택</span>
                </div>
                <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                  현재 고인이 계신 곳에서 가장 가깝고 예우가 정갈한 빈소 예약을 즉시 조율해 드립니다.
                </p>
              </button>

              <button
                onClick={() => setFuneralHallChoice('designated')}
                className={`w-full p-5 rounded-2xl text-left border-2 transition-all ${
                  funeralHallChoice === 'designated'
                    ? 'border-nobleGold-500 bg-nobleGold-500/10 text-white shadow-md ring-2 ring-nobleGold-500/30'
                    : 'border-white/10 bg-mourning-950/60 text-gray-300 hover:border-white/30'
                }`}
              >
                <span className="font-reverence font-bold text-xl">이미 희망하시는 장례식장이 있습니다</span>
                <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                  가족분들께서 원하시는 장례식장으로 안전하고 정중하게 운구하여 모십니다.
                </p>
              </button>
            </div>

            {funeralHallChoice === 'designated' && (
              <div className="space-y-2">
                <label className="block text-base font-bold text-gray-300">희망 장례식장 명칭</label>
                <input
                  type="text"
                  value={hallName}
                  onChange={(e) => setHallName(e.target.value)}
                  placeholder="예: 서울성모병원 장례식장 / 분당서울대병원"
                  className="w-full bg-mourning-950 border border-white/15 rounded-2xl px-5 py-4 text-white text-lg placeholder-gray-500 focus:outline-none focus:border-nobleGold-500"
                />
              </div>
            )}

            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 btn-senior-reverence bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold"
              >
                이전
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!funeralHallChoice}
                className="w-2/3 btn-senior-reverence bg-celadon-700 hover:bg-celadon-600 disabled:bg-gray-800 disabled:text-gray-600 text-white flex items-center justify-center space-x-2 text-xl font-bold shadow-xl"
              >
                <span>의전 접수 완료</span>
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: 의전 지도사 배정 완료 */}
        {step === 3 && (
          <div className="bg-mourning-900 border border-celadon-600/50 rounded-3xl p-6 md:p-8 shadow-2xl text-center space-y-6">
            <div className="w-20 h-20 bg-celadon-600/20 text-nobleGold-500 rounded-full flex items-center justify-center mx-auto ring-8 ring-celadon-600/10">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div>
              <span className="text-nobleGold-500 text-sm font-serif font-bold tracking-widest">
                의전팀 출동 완료
              </span>
              <h2 className="text-3xl md:text-4xl font-reverence font-black text-white mt-1">
                전담 장례지도사가 가족의 곁으로 출발하였습니다
              </h2>
              <p className="text-gray-300 text-lg mt-3 leading-relaxed">
                국가공인 1급 전담 지도사가 유족분들의 경황없는 마음을 보살피며 끝까지 함께하겠습니다.
              </p>
            </div>

            <div className="bg-mourning-950 rounded-2xl p-5 border border-white/10 space-y-4 text-left">
              <div className="flex items-center justify-between pb-3.5 border-b border-white/5">
                <span className="text-gray-400 text-base">현장 도착 예정 시간</span>
                <span className="text-2xl font-reverence font-black text-nobleGold-500 flex items-center space-x-1.5">
                  <Clock className="w-6 h-6" />
                  <span>약 40분 이내 도착</span>
                </span>
              </div>
              <div className="flex items-center justify-between pb-3.5 border-b border-white/5">
                <span className="text-gray-400 text-base">배정 지도사</span>
                <span className="text-lg font-bold text-white">김진우 전담 장례지도사 (자격 제11-0421호)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-base">배웅 의전 약속</span>
                <span className="text-sm font-bold text-celadon-200 flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-nobleGold-500" />
                  <span>선금 0원 · 부당 추가금 0원 · 촌지 전면 금지</span>
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <a
                href="tel:1588-0000"
                className="w-full btn-senior-reverence bg-nobleGold-500 hover:bg-nobleGold-600 text-gray-950 font-black flex items-center justify-center space-x-2 text-xl shadow-2xl"
              >
                <Phone className="w-6 h-6" />
                <span>전담 지도사 직통 전화 걸기</span>
              </a>

              <button
                onClick={onExitEmergency}
                className="w-full py-3.5 text-base text-gray-400 hover:text-white font-medium"
              >
                평시 메인 화면으로 돌아가기
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
