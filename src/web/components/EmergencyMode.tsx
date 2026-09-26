import React, { useState } from 'react';
import { Phone, MapPin, Building2, CheckCircle2, Clock, ShieldCheck, ArrowRight, Heart } from 'lucide-react';

export const EmergencyMode: React.FC<{ onExitEmergency: () => void }> = ({ onExitEmergency }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [deceasedLocation, setDeceasedLocation] = useState<'hospital' | 'home' | 'care' | ''>('');
  const [locationDetail, setLocationDetail] = useState('');
  const [funeralHallChoice, setFuneralHallChoice] = useState<'recommended' | 'designated' | ''>('');
  const [hallName, setHallName] = useState('');

  return (
    <div className="min-h-screen bg-[#0D0E10] text-[#FAF9F6] pb-24 relative overflow-hidden">
      {/* 삼국·조선 길상 구름문 은은한 추모 오버레이 */}
      <div className="pointer-events-none fixed inset-0 k-pattern-unmun-dark opacity-15" />
      {/* 경건한 상단 추모 및 안심 바 */}
      <div className="bg-[#141618] border-b border-[#2C2822] px-4 py-3.5 flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#C2A26A]" />
          <span className="font-serif font-bold text-sm sm:text-base text-[#E5E0D5]">
            24시간 국가공인 전담 의전 상황실 (전국 2시간 내 현장 도착)
          </span>
        </div>
        <button
          onClick={onExitEmergency}
          className="text-xs bg-[#1F2226] border border-[#3D382E] hover:border-[#C2A26A] text-[#D8D2C5] px-3.5 py-1.5 rounded-md font-serif font-medium transition-all"
        >
          평시 안내 화면 복귀 ✕
        </button>
      </div>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-7">
        {/* 추모 서두 문구 */}
        <div className="text-center space-y-2 py-2">
          <div className="inline-block text-[#C2A26A] font-serif text-sm tracking-widest">
            謹 弔 · 삼가 고인의 명복을 빕니다
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-reverence font-black tracking-tight text-[#FAF9F6]">
            가장 경건하고 정중한 예(禮)로 모시겠습니다
          </h1>
          <p className="text-[#A9A396] text-sm sm:text-base leading-relaxed pt-1 font-serif">
            경황없는 깊은 슬픔의 순간, 가족의 마음으로 처음부터 끝까지 곁을 지키겠습니다.
          </p>
        </div>

        {/* 24시 직통 상황실 핫라인 (고품격 심록/황동 의전 버튼) */}
        <a
          href="tel:1588-0000"
          className="w-full bg-[#19382C] hover:bg-[#204738] active:scale-[0.99] text-[#FAF9F6] p-5 sm:p-6 rounded-xl flex items-center justify-between shadow-lg border border-[#2D5A46] transition-all cursor-pointer group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-lg bg-[#0E1E18] flex items-center justify-center text-[#C2A26A] group-hover:scale-105 transition-transform border border-[#2A5442]">
              <Phone className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className="text-xs font-serif text-[#BFD4CA]">전화 상담이 가장 신속하고 편안하십니다</div>
              <div className="text-xl sm:text-2xl font-reverence font-black tracking-tight text-[#FAF9F6] mt-0.5">
                24시 전담 의전 상황실 즉시 연결 (1588-0000)
              </div>
            </div>
          </div>
          <ArrowRight className="w-6 h-6 text-[#C2A26A] hidden sm:block" />
        </a>

        {/* 3단계 진행 스테퍼 */}
        <div className="flex items-center justify-between px-4 bg-[#141618] rounded-xl p-4 border border-[#26231E]">
          {[
            { num: 1, label: '1. 고인 계신 곳' },
            { num: 2, label: '2. 모실 장례식장' },
            { num: 3, label: '3. 전담 지도사 배정' }
          ].map((s) => (
            <div key={s.num} className="flex-1 flex items-center">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-md flex items-center justify-center font-bold text-xs font-serif ${
                    step >= s.num
                      ? 'bg-[#9E7D47] text-[#0D0E10]'
                      : 'bg-[#212429] text-[#7A756C]'
                  }`}
                >
                  {s.num}
                </div>
                <span className={`text-[11px] mt-1 font-serif ${step >= s.num ? 'text-[#FAF9F6] font-bold' : 'text-[#7A756C]'}`}>
                  {s.label}
                </span>
              </div>
              {s.num < 3 && (
                <div className={`h-[1px] flex-1 ${step > s.num ? 'bg-[#9E7D47]' : 'bg-[#2A2722]'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: 고인 현재 위치 입력 */}
        {step === 1 && (
          <div className="bg-[#141618] border border-[#2C2822] rounded-xl p-6 md:p-8 shadow-md space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-reverence font-bold text-[#FAF9F6] flex items-center space-x-2">
                <MapPin className="text-[#C2A26A] w-6 h-6 shrink-0" />
                <span>현재 고인을 어디에 모시고 계십니까?</span>
              </h2>
              <p className="text-[#A39E93] text-sm mt-1.5 leading-relaxed font-serif">
                전국 어디든 전담 운구차량과 의전 지도사가 2시간 이내에 정중히 도착합니다.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'hospital', title: '병원 · 응급실', desc: '병원 내 임종 / 안치 전' },
                { id: 'home', title: '자택', desc: '가정 내 평온한 임종' },
                { id: 'care', title: '요양병원 · 시설', desc: '요양 전문 시설' }
              ].map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => setDeceasedLocation(loc.id as any)}
                  className={`p-4 rounded-lg text-left border transition-all min-h-[88px] cursor-pointer ${
                    deceasedLocation === loc.id
                      ? 'border-[#9E7D47] bg-[#9E7D47]/15 text-[#FAF9F6] ring-1 ring-[#9E7D47]'
                      : 'border-[#26231E] bg-[#101214] text-[#B8B2A6] hover:border-[#3D382E]'
                  }`}
                >
                  <div className="font-reverence font-bold text-lg">{loc.title}</div>
                  <div className="text-xs text-[#7A756C] mt-1 font-serif">{loc.desc}</div>
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-serif font-bold text-[#D8D2C5]">
                상세 위치 또는 병원 명칭 (아시는 만큼만 편히 적어주세요)
              </label>
              <input
                type="text"
                value={locationDetail}
                onChange={(e) => setLocationDetail(e.target.value)}
                placeholder="예: 서울아산병원 본관 응급실 / 분당 구미동 자택"
                className="w-full bg-[#0D0E10] border border-[#2D2A24] rounded-lg px-4 py-3.5 text-[#FAF9F6] text-base placeholder-[#5A564F] focus:outline-none focus:border-[#9E7D47]"
              />
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!deceasedLocation}
              className="w-full btn-senior-reverence bg-[#19382C] hover:bg-[#204738] disabled:bg-[#1E2125] disabled:text-[#555047] text-[#FAF9F6] flex items-center justify-center space-x-2 text-lg shadow-sm transition-all border border-[#2D5A46] cursor-pointer"
            >
              <span>다음: 모실 장례식장 선택</span>
              <ArrowRight className="w-5 h-5 text-[#C2A26A]" />
            </button>
          </div>
        )}

        {/* Step 2: 장례식장 선택 */}
        {step === 2 && (
          <div className="bg-[#141618] border border-[#2C2822] rounded-xl p-6 md:p-8 shadow-md space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-reverence font-bold text-[#FAF9F6] flex items-center space-x-2">
                <Building2 className="text-[#C2A26A] w-6 h-6 shrink-0" />
                <span>모시고자 하는 장례식장을 결정하셨습니까?</span>
              </h2>
              <p className="text-[#A39E93] text-sm mt-1.5 leading-relaxed font-serif">
                배웅 제휴 식장 선택 시 빈소 임대료 최대 30% 감면 혜택이 적용됩니다.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setFuneralHallChoice('recommended')}
                className={`w-full p-4 rounded-lg text-left border transition-all cursor-pointer ${
                  funeralHallChoice === 'recommended'
                    ? 'border-[#9E7D47] bg-[#9E7D47]/15 text-[#FAF9F6] ring-1 ring-[#9E7D47]'
                    : 'border-[#26231E] bg-[#101214] text-[#B8B2A6] hover:border-[#3D382E]'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-reverence font-bold text-lg">배웅 제휴 감면 장례식장 추천</span>
                  <span className="text-xs bg-[#19382C] text-[#C2A26A] px-2.5 py-0.5 rounded border border-[#2D5A46] font-serif">임대료 최대 30% 감면</span>
                </div>
                <p className="text-xs text-[#8A857B] mt-1.5 leading-relaxed font-serif">
                  현재 고인이 계신 곳에서 가장 가깝고 예우가 정갈한 빈소 예약을 즉시 조율해 드립니다.
                </p>
              </button>

              <button
                onClick={() => setFuneralHallChoice('designated')}
                className={`w-full p-4 rounded-lg text-left border transition-all cursor-pointer ${
                  funeralHallChoice === 'designated'
                    ? 'border-[#9E7D47] bg-[#9E7D47]/15 text-[#FAF9F6] ring-1 ring-[#9E7D47]'
                    : 'border-[#26231E] bg-[#101214] text-[#B8B2A6] hover:border-[#3D382E]'
                }`}
              >
                <span className="font-reverence font-bold text-lg">이미 희망하시는 장례식장이 있습니다</span>
                <p className="text-xs text-[#8A857B] mt-1.5 leading-relaxed font-serif">
                  가족분들께서 원하시는 장례식장으로 안전하고 정중하게 운구하여 모십니다.
                </p>
              </button>
            </div>

            {funeralHallChoice === 'designated' && (
              <div className="space-y-2">
                <label className="block text-sm font-serif font-bold text-[#D8D2C5]">희망 장례식장 명칭</label>
                <input
                  type="text"
                  value={hallName}
                  onChange={(e) => setHallName(e.target.value)}
                  placeholder="예: 서울성모병원 장례식장 / 분당서울대병원"
                  className="w-full bg-[#0D0E10] border border-[#2D2A24] rounded-lg px-4 py-3.5 text-[#FAF9F6] text-base placeholder-[#5A564F] focus:outline-none focus:border-[#9E7D47]"
                />
              </div>
            )}

            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 btn-senior-reverence bg-[#1C1F23] hover:bg-[#25282E] text-[#B8B2A6] font-serif font-bold text-base cursor-pointer"
              >
                이전
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!funeralHallChoice}
                className="w-2/3 btn-senior-reverence bg-[#19382C] hover:bg-[#204738] disabled:bg-[#1E2125] disabled:text-[#555047] text-[#FAF9F6] flex items-center justify-center space-x-2 text-lg font-serif font-bold shadow-sm border border-[#2D5A46] cursor-pointer"
              >
                <span>의전 접수 완료</span>
                <ArrowRight className="w-5 h-5 text-[#C2A26A]" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: 의전 지도사 배정 완료 */}
        {step === 3 && (
          <div className="bg-[#141618] border border-[#2D5A46] rounded-xl p-6 md:p-8 shadow-md text-center space-y-6">
            <div className="w-16 h-16 bg-[#19382C] text-[#C2A26A] rounded-full flex items-center justify-center mx-auto border border-[#2D5A46]">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="text-[#C2A26A] text-xs font-serif font-bold tracking-widest">
                의전팀 출동 접수 완료
              </span>
              <h2 className="text-2xl md:text-3xl font-reverence font-black text-[#FAF9F6] mt-1">
                전담 장례지도사가 가족의 곁으로 출발하였습니다
              </h2>
              <p className="text-[#B8B2A6] text-sm md:text-base mt-2 leading-relaxed font-serif">
                국가공인 1급 전담 지도사가 유족분들의 경황없는 마음을 보살피며 끝까지 함께하겠습니다.
              </p>
            </div>

            <div className="bg-[#0D0E10] rounded-lg p-5 border border-[#26231E] space-y-3.5 text-left font-serif">
              <div className="flex items-center justify-between pb-3 border-b border-[#1E2125]">
                <span className="text-[#7A756C] text-sm">현장 도착 예정 시간</span>
                <span className="text-xl font-reverence font-bold text-[#C2A26A] flex items-center space-x-1.5">
                  <Clock className="w-5 h-5" />
                  <span>약 40분 이내 도착</span>
                </span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-[#1E2125]">
                <span className="text-[#7A756C] text-sm">배정 지도사</span>
                <span className="text-base font-bold text-[#FAF9F6]">김진우 전담 장례지도사 (자격 제11-0421호)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#7A756C] text-sm">배웅 의전 서약</span>
                <span className="text-xs font-bold text-[#BFD4CA] flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#C2A26A]" />
                  <span>선금 0원 · 부당 추가금 0원 · 촌지 전면 금지</span>
                </span>
              </div>
            </div>

            <div className="space-y-2.5 pt-1">
              <a
                href="tel:1588-0000"
                className="w-full btn-senior-reverence bg-[#9E7D47] hover:bg-[#B38E52] text-[#0D0E10] font-black flex items-center justify-center space-x-2 text-lg shadow-sm"
              >
                <Phone className="w-5 h-5" />
                <span>전담 지도사 직통 전화 걸기 (1588-0000)</span>
              </a>

              <button
                onClick={onExitEmergency}
                className="w-full py-3 text-sm text-[#7A756C] hover:text-[#FAF9F6] font-serif cursor-pointer"
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
