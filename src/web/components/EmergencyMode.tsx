import React, { useState, useMemo } from 'react';
import {
  Phone,
  MapPin,
  Building2,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowRight,
  Heart,
  Car,
  Navigation,
  Award,
  FileCheck2
} from 'lucide-react';
import { EmergencyDispatchEngine, DispatchMatchResult } from '../../emergency/index.js';
import { LiveDispatchTrackerModal } from './LiveDispatchTrackerModal.js';
import { DigitalTallySheetModal } from './DigitalTallySheetModal.js';

export const EmergencyMode: React.FC<{ onExitEmergency: () => void }> = ({ onExitEmergency }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [deceasedLocation, setDeceasedLocation] = useState<'hospital' | 'home' | 'care'>('hospital');
  const [locationDetail, setLocationDetail] = useState('');
  const [funeralHallChoice, setFuneralHallChoice] = useState<'recommended' | 'designated'>('recommended');
  const [hallName, setHallName] = useState('');
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [isTallyOpen, setIsTallyOpen] = useState(false);

  // 고인 위치 및 희망 식장에 따른 지역별 지능형 전담 지도사 및 동적 ETA 매칭
  const dispatchResult: DispatchMatchResult = useMemo(() => {
    return EmergencyDispatchEngine.matchDispatch({
      deceasedLocationType: deceasedLocation,
      locationDetail,
      funeralHallChoice,
      hallName
    });
  }, [deceasedLocation, locationDetail, funeralHallChoice, hallName]);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#151719] pb-24 relative overflow-hidden">
      {/* 1. 상단 안심 및 비상 상황실 안내 띠 바 (시그니처 단청 비취) */}
      <div className="bg-[#19382C] text-[#FAF9F6] border-b border-[#243F35] px-4 py-3 flex items-center justify-between relative z-10 shadow-sm">
        <div className="flex items-center space-x-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E08578] animate-pulse shrink-0" />
          <span className="font-serif font-bold text-sm sm:text-base text-[#FAF9F6] tracking-tight">
            24시 국가공인 긴급 의전 상황실 · 전국 2시간 내 현장 도착 보증
          </span>
        </div>
        <button
          onClick={onExitEmergency}
          className="k-tap-lg text-[0.8125rem] bg-[#243F35] hover:bg-[#2D4F43] border border-[#2D4F43] text-[#FAF9F6] px-3 py-1.5 rounded-md font-serif font-medium transition-all cursor-pointer flex items-center space-x-1 shrink-0"
        >
          <span>평시 화면 복귀 ✕</span>
        </button>
      </div>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6 relative z-10">
        {/* 추모 서두 및 경황없는 유족을 위한 즉각 안심 메시지 */}
        <div className="text-center space-y-2 py-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#FAF0EF] text-[#8B2520] font-serif font-bold text-[0.8125rem] border border-[#8B2520]/20">
            <Heart className="w-3.5 h-3.5 fill-[#8B2520]" />
            <span>삼가 고인의 명복을 빕니다 · 유족 긴급 지원 체계</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-reverence font-black tracking-tight text-[#151719]">
            경황없는 슬픔의 순간, 곁에서 지체없이 돕겠습니다
          </h1>
          <p className="text-[#42464E] text-[1.125rem] sm:text-[1.125rem] leading-relaxed font-serif max-w-xl mx-auto">
            당황하지 마시고 아래 안내를 편안히 따라주세요.<br className="hidden sm:inline" />
            <strong>전화 한 통</strong> 또는 <strong>1분 온라인 접수</strong> 즉시 전담 지도사와 특수 운구차량이 출동합니다.
          </p>
        </div>

        {/* [행동 1: 최우선] 원터치 24시 직통 핫라인 (전화 한 통으로 출동 접수 완료) */}
        <div className="bg-[#FFFFFF] border-2 border-[#8B2520] rounded-2xl p-5 sm:p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-[#8B2520] text-white text-[0.8125rem] font-bold px-3 py-1 rounded-bl-lg font-serif">
            10초 내 직통 연결
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center space-x-3.5">
              <div className="w-13 h-13 rounded-xl bg-[#FAF0EF] text-[#8B2520] flex items-center justify-center border border-[#8B2520]/20 shrink-0 mt-0.5 sm:mt-0">
                <Phone className="w-7 h-7" />
              </div>
              <div className="min-w-0 break-words">
                <div className="text-[0.8125rem] font-bold text-[#8B2520] font-serif flex items-center space-x-1">
                  <span>경황이 없으실 땐 아무것도 적지 마시고 전화만 누르세요</span>
                </div>
                <div className="text-2xl sm:text-3xl font-reverence font-black text-[#151719] mt-0.5 tracking-tight">
                  24시 긴급 상황실 <span className="text-[#8B2520]">1588-0000</span>
                </div>
                <p className="text-[1.125rem] text-[#5A5E66] font-serif mt-1 leading-normal">
                  통화 즉시 관할 거점 전담 지도사 1:1 배정 · 선금 0원 무료 출동 보증
                </p>
              </div>
            </div>
            <a
              href="tel:1588-0000"
              className="k-tap-lg w-full sm:w-auto px-6 py-3.5 bg-[#8B2520] hover:bg-[#731C18] text-white font-bold rounded-xl flex items-center justify-center space-x-2 text-base shadow-sm transition-all shrink-0 cursor-pointer active:scale-[0.98]"
            >
              <Phone className="w-5 h-5 fill-current" />
              <span>지금 바로 전화 걸기</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* [행동 2: 필수 지침] 임종 직후 유족 3대 골든타임 행동 요령 (뭘 해야 할지 모르는 유족을 위한 즉각 가이드) */}
        <div className="bg-[#FFFFFF] border border-[#DCD6C9] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#DCD6C9] pb-3">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-[#8B2520]" />
              <h2 className="font-reverence font-bold text-lg text-[#151719]">
                임종 직후 유족 필수 3대 행동 요령
              </h2>
            </div>
            <span className="text-[0.8125rem] font-bold text-[#8B2520] bg-[#FAF0EF] px-2.5 py-0.5 rounded-full border border-[#8B2520]/20">
              현장 필수 체크
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#DCD6C9] space-y-1.5">
              <div className="flex items-center space-x-2 text-[#8B2520] font-bold text-sm">
                <span className="w-5 h-5 rounded-full bg-[#FAF0EF] text-[#8B2520] flex items-center justify-center text-[0.8125rem] border border-[#8B2520]/20 font-mono">1</span>
                <span>사망진단서 7~10부 발급</span>
              </div>
              <p className="text-[1.125rem] text-[#42464E] leading-relaxed font-serif min-w-0 break-words">
                화장장 예약, 사망신고, 금융·보험 처리에 원본이 필요합니다. 퇴원 시 한 번에 넉넉히 발급받으셔야 병원을 재방문하지 않습니다.
              </p>
            </div>

            <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#DCD6C9] space-y-1.5">
              <div className="flex items-center space-x-2 text-[#8B2520] font-bold text-sm">
                <span className="w-5 h-5 rounded-full bg-[#FAF0EF] text-[#8B2520] flex items-center justify-center text-[0.8125rem] border border-[#8B2520]/20 font-mono">2</span>
                <span>고인 임의 이동 금지</span>
              </div>
              <p className="text-[1.125rem] text-[#42464E] leading-relaxed font-serif min-w-0 break-words">
                의사의 공식 사망 판정 및 진단서 발급 전 임의 이송 시 법적 문제가 될 수 있습니다. 배웅 전용 특수 운구차량이 안전히 모십니다.
              </p>
            </div>

            <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#DCD6C9] space-y-1.5">
              <div className="flex items-center space-x-2 text-[#8B2520] font-bold text-sm">
                <span className="w-5 h-5 rounded-full bg-[#FAF0EF] text-[#8B2520] flex items-center justify-center text-[0.8125rem] border border-[#8B2520]/20 font-mono">3</span>
                <span>기존 상조도 배웅으로 이관</span>
              </div>
              <p className="text-[1.125rem] text-[#42464E] leading-relaxed font-serif min-w-0 break-words">
                타 상조에 가입되어 있으셔도 선납금 손실 없이 배웅 실비 패키지로 즉시 전환 가능하며, 제휴 빈소 최대 30% 감면을 동일 적용받습니다.
              </p>
            </div>
          </div>
        </div>

        {/* [행동 3: 온라인 출동 접수] 3단계 진행 스테퍼 및 폼 (말씀하시기 어려울 때) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-reverence font-bold text-lg sm:text-xl text-[#151719] flex items-center space-x-2">
              <Clock className="w-5 h-5 text-[#19382C]" />
              <span>온라인 1분 즉시 출동 접수 (통화가 어려우실 때)</span>
            </h2>
            <span className="text-[0.8125rem] text-[#5A5E66] font-serif">전국 2시간 도착</span>
          </div>

          {/* 3단계 진행 스테퍼 */}
          <div className="flex items-center justify-between px-4 bg-[#FFFFFF] rounded-xl p-4 border border-[#DCD6C9] shadow-2xs">
            {[
              { num: 1, label: '1. 고인 계신 곳' },
              { num: 2, label: '2. 모실 장례식장' },
              { num: 3, label: '3. 전담 지도사 배정' }
            ].map((s) => (
              <div key={s.num} className="flex-1 flex items-center">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[0.8125rem] font-serif transition-colors ${
                      step >= s.num
                        ? 'bg-[#19382C] text-[#FAF9F6]'
                        : 'bg-[#F1EDE3] text-[#5A5E66]'
                    }`}
                  >
                    {s.num}
                  </div>
                  <span className={`text-[0.8125rem] mt-1 font-serif ${step >= s.num ? 'text-[#19382C] font-bold' : 'text-[#5A5E66]'}`}>
                    {s.label}
                  </span>
                </div>
                {s.num < 3 && (
                  <div className={`h-[2px] flex-1 ${step > s.num ? 'bg-[#19382C]' : 'bg-[#DCD6C9]'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: 고인 현재 위치 입력 */}
          {step === 1 && (
            <div className="bg-[#FFFFFF] border border-[#DCD6C9] rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-reverence font-bold text-[#151719] flex items-center space-x-2">
                  <MapPin className="text-[#19382C] w-6 h-6 shrink-0" />
                  <span>현재 고인을 어디에 모시고 계십니까?</span>
                </h3>
                <p className="text-[#42464E] text-[1.125rem] mt-1.5 leading-relaxed font-serif">
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
                    className={`p-4 rounded-xl text-left border-2 transition-all min-h-[96px] cursor-pointer ${
                      deceasedLocation === loc.id
                        ? 'border-[#19382C] bg-[#FAF9F6] text-[#19382C] shadow-2xs'
                        : 'border-[#DCD6C9] bg-[#FFFFFF] text-[#42464E] hover:border-[#8F8878]'
                    }`}
                  >
                    <div className="font-reverence font-bold text-lg flex items-center justify-between">
                      <span>{loc.title}</span>
                      {deceasedLocation === loc.id && (
                        <CheckCircle2 className="w-5 h-5 text-[#19382C]" />
                      )}
                    </div>
                    <div className="text-[0.8125rem] text-[#5A5E66] mt-1.5 font-serif">{loc.desc}</div>
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-serif font-bold text-[#151719]">
                  상세 위치 또는 병원 명칭 (아시는 만큼만 편히 적어주세요)
                </label>
                <input
                  type="text"
                  value={locationDetail}
                  onChange={(e) => setLocationDetail(e.target.value)}
                  placeholder="예: 서울아산병원 본관 응급실 / 분당 구미동 자택"
                  className="w-full bg-[#FFFFFF] border-2 border-[#DCD6C9] rounded-xl px-4 py-3.5 text-[#151719] text-base placeholder-[#8F8878] focus:outline-none focus:border-[#19382C]"
                />
                <p className="text-[1.125rem] text-[#5A5E66] font-serif">
                  * 정확한 주소를 모르셔도 괜찮습니다. 접수 즉시 배정 지도사가 전화로 정확한 위치를 확인해 드립니다.
                </p>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full py-4 rounded-xl bg-[#19382C] hover:bg-[#243F35] text-[#FAF9F6] flex items-center justify-center space-x-2 text-lg font-serif font-bold shadow-sm transition-all cursor-pointer"
              >
                <span>다음: 모실 장례식장 선택</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Step 2: 장례식장 선택 */}
          {step === 2 && (
            <div className="bg-[#FFFFFF] border border-[#DCD6C9] rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-reverence font-bold text-[#151719] flex items-center space-x-2">
                  <Building2 className="text-[#19382C] w-6 h-6 shrink-0" />
                  <span>모시고자 하는 장례식장을 결정하셨습니까?</span>
                </h3>
                <p className="text-[#42464E] text-[1.125rem] mt-1.5 leading-relaxed font-serif">
                  배웅 제휴 식장 선택 시 빈소 임대료 최대 30% 감면 혜택이 즉시 적용됩니다.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setFuneralHallChoice('recommended')}
                  className={`w-full p-5 rounded-xl text-left border-2 transition-all cursor-pointer ${
                    funeralHallChoice === 'recommended'
                      ? 'border-[#19382C] bg-[#FAF9F6] text-[#19382C] shadow-2xs'
                      : 'border-[#DCD6C9] bg-[#FFFFFF] text-[#42464E] hover:border-[#8F8878]'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-reverence font-bold text-lg text-[#151719]">
                      배웅 제휴 감면 장례식장 추천 (가장 추천)
                    </span>
                    <span className="text-[0.8125rem] bg-[#19382C] text-[#FAF9F6] px-3 py-1 rounded-full font-serif font-bold">
                      임대료 최대 30% 감면
                    </span>
                  </div>
                  <p className="text-[1.125rem] text-[#5A5E66] mt-2 leading-relaxed font-serif min-w-0 break-words">
                    현재 고인이 계신 곳에서 가장 가깝고 예우가 정갈한 빈소 예약을 배웅 전담팀이 즉시 조율해 드립니다.
                  </p>
                </button>

                <button
                  onClick={() => setFuneralHallChoice('designated')}
                  className={`w-full p-5 rounded-xl text-left border-2 transition-all cursor-pointer ${
                    funeralHallChoice === 'designated'
                      ? 'border-[#19382C] bg-[#FAF9F6] text-[#19382C] shadow-2xs'
                      : 'border-[#DCD6C9] bg-[#FFFFFF] text-[#42464E] hover:border-[#8F8878]'
                  }`}
                >
                  <span className="font-reverence font-bold text-lg text-[#151719]">
                    이미 희망하시는 특정 장례식장이 있습니다
                  </span>
                  <p className="text-[1.125rem] text-[#5A5E66] mt-2 leading-relaxed font-serif min-w-0 break-words">
                    가족분들께서 원하시는 장례식장으로 안전하고 정중하게 운구하여 모십니다.
                  </p>
                </button>
              </div>

              {funeralHallChoice === 'designated' && (
                <div className="space-y-2">
                  <label className="block text-sm font-serif font-bold text-[#151719]">희망 장례식장 명칭</label>
                  <input
                    type="text"
                    value={hallName}
                    onChange={(e) => setHallName(e.target.value)}
                    placeholder="예: 서울성모병원 장례식장 / 분당서울대병원"
                    className="w-full bg-[#FFFFFF] border-2 border-[#DCD6C9] rounded-xl px-4 py-3.5 text-[#151719] text-base placeholder-[#8F8878] focus:outline-none focus:border-[#19382C]"
                  />
                </div>
              )}

              <div className="flex space-x-3 pt-2">
                <button
                  onClick={() => setStep(1)}
                  className="w-1/3 py-4 rounded-xl bg-[#F1EDE3] hover:bg-[#FAF9F6] border border-[#DCD6C9] text-[#151719] font-serif font-bold text-base cursor-pointer"
                >
                  이전
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="w-2/3 py-4 rounded-xl bg-[#19382C] hover:bg-[#243F35] text-[#FAF9F6] flex items-center justify-center space-x-2 text-lg font-serif font-bold shadow-sm transition-all cursor-pointer"
                >
                  <span>의전 출동 접수 완료</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: 의전 지도사 배정 완료 */}
          {step === 3 && (
            <div className="bg-[#FFFFFF] border-2 border-[#19382C] rounded-2xl p-6 md:p-8 shadow-md text-center space-y-6">
              <div className="w-16 h-16 bg-[#19382C] text-[#FAF9F6] rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-[#8B2520] text-[0.8125rem] font-serif font-bold tracking-widest bg-[#FAF0EF] px-2.5 py-0.5 rounded-full border border-[#8B2520]/20">
                    의전팀 긴급 급파 접수 완료
                  </span>
                  <span className="text-[0.8125rem] bg-[#F1EDE3] text-[#5A5E66] px-2 py-0.5 rounded border border-[#DCD6C9] font-mono">
                    {dispatchResult.dispatchId}
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-reverence font-black text-[#151719] mt-2">
                  {dispatchResult.detectedRegion} 전담 의전팀이 현장으로 출발하였습니다
                </h2>
                <p className="text-[#42464E] text-[1.125rem] md:text-[1.125rem] mt-2 leading-relaxed font-serif">
                  {dispatchResult.detectedLocationSummary} 방면으로 국가공인 1급 지도사와 특수 운구차량이 실시간 급파되었습니다.
                </p>
              </div>

              <div className="bg-[#FAF9F6] rounded-xl p-5 border border-[#DCD6C9] space-y-3.5 text-left font-serif">
                {/* 1. 도착 예정 시간 (동적 계산) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#DCD6C9] gap-1">
                  <div>
                    <span className="text-[#5A5E66] text-sm">현장 도착 예정 시간</span>
                    <div className="text-[0.8125rem] text-[#5A5E66] mt-0.5">
                      {dispatchResult.assignedDirector.baseCenterName} ➔ 현장 ({dispatchResult.distanceKm}km)
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg sm:text-xl font-reverence font-bold text-[#19382C] flex items-center sm:justify-end space-x-1.5">
                      <Clock className="w-5 h-5 text-[#19382C]" />
                      <span>{dispatchResult.estimatedArrivalTimeFormatted}</span>
                    </span>
                    <span className="text-[0.8125rem] text-[#19382C] font-sans font-medium flex items-center sm:justify-end space-x-1 mt-0.5">
                      <Navigation className="w-3.5 h-3.5" />
                      <span>실시간 경로 관제 중 (교통 원활)</span>
                    </span>
                  </div>
                </div>

                {/* 2. 배정 지도사 (지역별 동적 배정) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#DCD6C9] gap-1">
                  <div>
                    <span className="text-[#5A5E66] text-sm">배정 지도사 ({dispatchResult.detectedRegion} 전담)</span>
                    <div className="text-[0.8125rem] text-[#5A5E66] mt-0.5">
                      경력 {dispatchResult.assignedDirector.experienceYears}년 · 누적 의전 {dispatchResult.assignedDirector.completedCases}건 (평점 ★{dispatchResult.assignedDirector.ratingAvg})
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-bold text-[#151719] flex items-center sm:justify-end space-x-1.5">
                      <Award className="w-4 h-4 text-[#6E5429]" />
                      <span>{dispatchResult.assignedDirector.name} 수석 장례지도사 ({dispatchResult.assignedDirector.licenseNo})</span>
                    </span>
                    <span className="text-[0.8125rem] text-[#6E5429] font-mono sm:justify-end flex mt-0.5 font-bold">
                      안심 직통: {dispatchResult.assignedDirector.virtualPhone}
                    </span>
                  </div>
                </div>

                {/* 3. 배차 운구차량 */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#DCD6C9] gap-1">
                  <span className="text-[#5A5E66] text-sm">배차 특수 운구차량</span>
                  <span className="text-sm font-bold text-[#151719] flex items-center sm:justify-end space-x-1.5">
                    <Car className="w-4 h-4 text-[#19382C]" />
                    <span>{dispatchResult.vehicleDispatchInfo}</span>
                  </span>
                </div>

                {/* 4. 연계 장례식장 (추천인 경우) */}
                {dispatchResult.recommendedFuneralHall && funeralHallChoice === 'recommended' && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#DCD6C9] gap-1">
                    <div>
                      <span className="text-[#5A5E66] text-sm">연계 추천 장례식장</span>
                      <div className="text-[0.8125rem] text-[#5A5E66] mt-0.5">
                        {dispatchResult.recommendedFuneralHall.address}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-[#151719]">
                        {dispatchResult.recommendedFuneralHall.name}
                      </span>
                      <span className="text-[0.8125rem] text-[#19382C] font-bold block mt-0.5">
                        배웅 사전등록 빈소 {dispatchResult.recommendedFuneralHall.discountRatePercentage}% 감면 확보
                      </span>
                    </div>
                  </div>
                )}

                {/* 5. 배웅 의전 서약 */}
                <div className="flex items-center justify-between pt-0.5">
                  <span className="text-[#5A5E66] text-sm">배웅 3대 의전 서약</span>
                  <span className="text-[0.8125rem] font-bold text-[#19382C] flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#19382C]" />
                    <span>선금 0원 · 부당 추가금 0원 · 촌지 전면 금지</span>
                  </span>
                </div>
              </div>

              <div className="space-y-3 pt-1">
                {/* 실시간 GPS 관제 & 추가금 제로 검수표 버튼 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setIsTrackerOpen(true)}
                    className="k-tap-lg py-3.5 px-4 bg-[#19382C] hover:bg-[#243F35] text-white rounded-xl font-serif font-bold text-[0.8125rem] flex items-center justify-center space-x-2 transition-colors cursor-pointer shadow-sm"
                  >
                    <Navigation className="w-4 h-4 text-[#DCE8E2]" />
                    <span>실시간 GPS 운구 관제 (ETA 확인)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsTallyOpen(true)}
                    className="k-tap-lg py-3.5 px-4 bg-[#FFFFFF] hover:bg-[#FAF9F6] text-[#151719] rounded-xl font-serif font-bold text-[0.8125rem] flex items-center justify-center space-x-2 transition-colors cursor-pointer border border-[#DCD6C9] shadow-2xs"
                  >
                    <FileCheck2 className="w-4 h-4 text-[#6E5429]" />
                    <span>현장 추가금 제로 지출 검수표</span>
                  </button>
                </div>

                <a
                  href={`tel:${dispatchResult.assignedDirector.virtualPhone}`}
                  className="w-full py-4 rounded-xl bg-[#8B2520] hover:bg-[#731C18] text-white font-bold flex items-center justify-center space-x-2 text-lg shadow-sm transition-all cursor-pointer"
                >
                  <Phone className="w-5 h-5 fill-current" />
                  <span>{dispatchResult.assignedDirector.name} 지도사 직통 전화 걸기 ({dispatchResult.assignedDirector.virtualPhone})</span>
                </a>

                <button
                  onClick={onExitEmergency}
                  className="k-tap-lg w-full py-3 text-sm text-[#5A5E66] hover:text-[#151719] font-serif cursor-pointer underline underline-offset-4"
                >
                  평시 메인 화면으로 돌아가기
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 실시간 GPS 운구 관제 모달 */}
      {isTrackerOpen && (
        <LiveDispatchTrackerModal
          dispatchResult={dispatchResult}
          onClose={() => setIsTrackerOpen(false)}
        />
      )}

      {/* 현장 추가금 제로 디지털 지출 검수표 모달 */}
      {isTallyOpen && (
        <DigitalTallySheetModal
          hallName={dispatchResult.recommendedFuneralHall?.name || hallName || '서울아산병원 장례식장'}
          directorName={`${dispatchResult.assignedDirector.name} 수석 장례지도사 (${dispatchResult.assignedDirector.licenseNo})`}
          onClose={() => setIsTallyOpen(false)}
        />
      )}
    </div>
  );
};
