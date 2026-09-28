import React, { useState, useMemo } from 'react';
import { Phone, MapPin, Building2, CheckCircle2, Clock, ShieldCheck, ArrowRight, Heart, Car, Navigation, Award, FileCheck2 } from 'lucide-react';
import { EmergencyDispatchEngine, DispatchMatchResult } from '../../emergency/index.js';
import { LiveDispatchTrackerModal } from './LiveDispatchTrackerModal.js';
import { DigitalTallySheetModal } from './DigitalTallySheetModal.js';

export const EmergencyMode: React.FC<{ onExitEmergency: () => void }> = ({ onExitEmergency }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [deceasedLocation, setDeceasedLocation] = useState<'hospital' | 'home' | 'care' | ''>('');
  const [locationDetail, setLocationDetail] = useState('');
  const [funeralHallChoice, setFuneralHallChoice] = useState<'recommended' | 'designated' | ''>('');
  const [hallName, setHallName] = useState('');
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [isTallyOpen, setIsTallyOpen] = useState(false);

  // 고인 위치 및 희망 식장에 따른 지역별 지능형 전담 지도사 및 동적 ETA 매칭
  const dispatchResult: DispatchMatchResult = useMemo(() => {
    return EmergencyDispatchEngine.matchDispatch({
      deceasedLocationType: (deceasedLocation as any) || 'hospital',
      locationDetail,
      funeralHallChoice: (funeralHallChoice as any) || 'recommended',
      hallName
    });
  }, [deceasedLocation, locationDetail, funeralHallChoice, hallName]);

  return (
    <div className="min-h-screen bg-[#0D0E10] text-[#FAF9F6] pb-24 relative overflow-hidden">
      {/* 삼국·조선 길상 구름문 은은한 추모 오버레이 */}
      <div className="pointer-events-none fixed inset-0 k-pattern-unmun-dark opacity-15" />
      {/* 경건한 상단 추모 및 안심 바 */}
      <div className="bg-[#141618] border-b border-[#3D382E] px-4 py-3.5 flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#C2A26A]" />
          <span className="font-serif font-bold text-sm sm:text-base text-[#8A929D]">
            24시간 국가공인 전담 의전 상황실 (전국 2시간 내 현장 도착)
          </span>
        </div>
        <button
          onClick={onExitEmergency}
          className="text-[13px] bg-[#1F2226] border border-[#3D382E] hover:border-[#C2A26A] text-[#8A929D] px-3.5 py-1.5 rounded-md font-serif font-medium transition-all"
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
          <p className="text-[#8A929D] text-sm sm:text-base leading-relaxed pt-1 font-serif">
            경황없는 깊은 슬픔의 순간, 가족의 마음으로 처음부터 끝까지 곁을 지키겠습니다.
          </p>
        </div>

        {/* 24시 직통 상황실 핫라인 (고품격 심록/황동 의전 버튼) */}
        <a
          href="tel:1588-0000"
          className="w-full bg-[#19382C] hover:bg-[#2D4F43] active:scale-[0.99] text-[#FAF9F6] p-5 sm:p-6 rounded-xl flex items-center justify-between shadow-lg border border-[#2D4F43] transition-all cursor-pointer group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-lg bg-[#0A1511] flex items-center justify-center text-[#C2A26A] group-hover:scale-105 transition-transform border border-[#2D4F43]">
              <Phone className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className="text-[13px] font-serif text-[#DCE8E2]">전화 상담이 가장 신속하고 편안하십니다</div>
              <div className="text-xl sm:text-2xl font-reverence font-black tracking-tight text-[#FAF9F6] mt-0.5">
                24시 전담 의전 상황실 즉시 연결 (1588-0000)
              </div>
            </div>
          </div>
          <ArrowRight className="w-6 h-6 text-[#C2A26A] hidden sm:block" />
        </a>

        {/* 3단계 진행 스테퍼 */}
        <div className="flex items-center justify-between px-4 bg-[#141618] rounded-xl p-4 border border-[#3D382E]">
          {[
            { num: 1, label: '1. 고인 계신 곳' },
            { num: 2, label: '2. 모실 장례식장' },
            { num: 3, label: '3. 전담 지도사 배정' }
          ].map((s) => (
            <div key={s.num} className="flex-1 flex items-center">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-md flex items-center justify-center font-bold text-[13px] font-serif ${
                    step >= s.num
                      ? 'bg-[#9E7D47] text-[#0D0E10]'
                      : 'bg-[#1F2226] text-[#8A929D]'
                  }`}
                >
                  {s.num}
                </div>
                <span className={`text-[13px] mt-1 font-serif ${step >= s.num ? 'text-[#FAF9F6] font-bold' : 'text-[#8A929D]'}`}>
                  {s.label}
                </span>
              </div>
              {s.num < 3 && (
                <div className={`h-[1px] flex-1 ${step > s.num ? 'bg-[#9E7D47]' : 'bg-[#3D382E]'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: 고인 현재 위치 입력 */}
        {step === 1 && (
          <div className="bg-[#141618] border border-[#3D382E] rounded-xl p-6 md:p-8 shadow-md space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-reverence font-bold text-[#FAF9F6] flex items-center space-x-2">
                <MapPin className="text-[#C2A26A] w-6 h-6 shrink-0" />
                <span>현재 고인을 어디에 모시고 계십니까?</span>
              </h2>
              <p className="text-[#8A929D] text-sm mt-1.5 leading-relaxed font-serif">
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
                      : 'border-[#3D382E] bg-[#0D0E10] text-[#8A929D] hover:border-[#3D382E]'
                  }`}
                >
                  <div className="font-reverence font-bold text-lg">{loc.title}</div>
                  <div className="text-[13px] text-[#8A929D] mt-1 font-serif">{loc.desc}</div>
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-serif font-bold text-[#8A929D]">
                상세 위치 또는 병원 명칭 (아시는 만큼만 편히 적어주세요)
              </label>
              <input
                type="text"
                value={locationDetail}
                onChange={(e) => setLocationDetail(e.target.value)}
                placeholder="예: 서울아산병원 본관 응급실 / 분당 구미동 자택"
                className="w-full bg-[#0D0E10] border border-[#3D382E] rounded-lg px-4 py-3.5 text-[#FAF9F6] text-base placeholder-[#8A929D] focus:outline-none focus:border-[#9E7D47]"
              />
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!deceasedLocation}
              className="w-full btn-senior-reverence bg-[#19382C] hover:bg-[#2D4F43] disabled:bg-[#1F2226] disabled:text-[#8A929D] text-[#FAF9F6] flex items-center justify-center space-x-2 text-lg shadow-sm transition-all border border-[#2D4F43] cursor-pointer"
            >
              <span>다음: 모실 장례식장 선택</span>
              <ArrowRight className="w-5 h-5 text-[#C2A26A]" />
            </button>
          </div>
        )}

        {/* Step 2: 장례식장 선택 */}
        {step === 2 && (
          <div className="bg-[#141618] border border-[#3D382E] rounded-xl p-6 md:p-8 shadow-md space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-reverence font-bold text-[#FAF9F6] flex items-center space-x-2">
                <Building2 className="text-[#C2A26A] w-6 h-6 shrink-0" />
                <span>모시고자 하는 장례식장을 결정하셨습니까?</span>
              </h2>
              <p className="text-[#8A929D] text-sm mt-1.5 leading-relaxed font-serif">
                배웅 제휴 식장 선택 시 빈소 임대료 최대 30% 감면 혜택이 적용됩니다.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setFuneralHallChoice('recommended')}
                className={`w-full p-4 rounded-lg text-left border transition-all cursor-pointer ${
                  funeralHallChoice === 'recommended'
                    ? 'border-[#9E7D47] bg-[#9E7D47]/15 text-[#FAF9F6] ring-1 ring-[#9E7D47]'
                    : 'border-[#3D382E] bg-[#0D0E10] text-[#8A929D] hover:border-[#3D382E]'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-reverence font-bold text-lg">배웅 제휴 감면 장례식장 추천</span>
                  <span className="text-[13px] bg-[#19382C] text-[#C2A26A] px-2.5 py-0.5 rounded border border-[#2D4F43] font-serif">임대료 최대 30% 감면</span>
                </div>
                <p className="text-[13px] text-[#8A929D] mt-1.5 leading-relaxed font-serif">
                  현재 고인이 계신 곳에서 가장 가깝고 예우가 정갈한 빈소 예약을 즉시 조율해 드립니다.
                </p>
              </button>

              <button
                onClick={() => setFuneralHallChoice('designated')}
                className={`w-full p-4 rounded-lg text-left border transition-all cursor-pointer ${
                  funeralHallChoice === 'designated'
                    ? 'border-[#9E7D47] bg-[#9E7D47]/15 text-[#FAF9F6] ring-1 ring-[#9E7D47]'
                    : 'border-[#3D382E] bg-[#0D0E10] text-[#8A929D] hover:border-[#3D382E]'
                }`}
              >
                <span className="font-reverence font-bold text-lg">이미 희망하시는 장례식장이 있습니다</span>
                <p className="text-[13px] text-[#8A929D] mt-1.5 leading-relaxed font-serif">
                  가족분들께서 원하시는 장례식장으로 안전하고 정중하게 운구하여 모십니다.
                </p>
              </button>
            </div>

            {funeralHallChoice === 'designated' && (
              <div className="space-y-2">
                <label className="block text-sm font-serif font-bold text-[#8A929D]">희망 장례식장 명칭</label>
                <input
                  type="text"
                  value={hallName}
                  onChange={(e) => setHallName(e.target.value)}
                  placeholder="예: 서울성모병원 장례식장 / 분당서울대병원"
                  className="w-full bg-[#0D0E10] border border-[#3D382E] rounded-lg px-4 py-3.5 text-[#FAF9F6] text-base placeholder-[#8A929D] focus:outline-none focus:border-[#9E7D47]"
                />
              </div>
            )}

            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 btn-senior-reverence bg-[#1F2226] hover:bg-[#1F2226] text-[#8A929D] font-serif font-bold text-base cursor-pointer"
              >
                이전
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!funeralHallChoice}
                className="w-2/3 btn-senior-reverence bg-[#19382C] hover:bg-[#2D4F43] disabled:bg-[#1F2226] disabled:text-[#8A929D] text-[#FAF9F6] flex items-center justify-center space-x-2 text-lg font-serif font-bold shadow-sm border border-[#2D4F43] cursor-pointer"
              >
                <span>의전 접수 완료</span>
                <ArrowRight className="w-5 h-5 text-[#C2A26A]" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: 의전 지도사 배정 완료 */}
        {step === 3 && (
          <div className="bg-[#141618] border border-[#2D4F43] rounded-xl p-6 md:p-8 shadow-md text-center space-y-6">
            <div className="w-16 h-16 bg-[#19382C] text-[#C2A26A] rounded-full flex items-center justify-center mx-auto border border-[#2D4F43]">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-[#C2A26A] text-[13px] font-serif font-bold tracking-widest">
                  의전팀 긴급 급파 접수 완료
                </span>
                <span className="text-[13px] bg-[#1F2226] text-[#8A929D] px-2 py-0.5 rounded border border-[#3D382E] font-mono">
                  {dispatchResult.dispatchId}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-reverence font-black text-[#FAF9F6] mt-2">
                {dispatchResult.detectedRegion} 전담 의전팀이 현장으로 출발하였습니다
              </h2>
              <p className="text-[#8A929D] text-sm md:text-base mt-2 leading-relaxed font-serif">
                {dispatchResult.detectedLocationSummary} 방면으로 국가공인 1급 지도사와 특수 운구차량이 실시간 급파되었습니다.
              </p>
            </div>

            <div className="bg-[#0D0E10] rounded-lg p-5 border border-[#3D382E] space-y-3.5 text-left font-serif">
              {/* 1. 도착 예정 시간 (동적 계산) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#1F2226] gap-1">
                <div>
                  <span className="text-[#8A929D] text-sm">현장 도착 예정 시간</span>
                  <div className="text-[13px] text-[#8A929D] mt-0.5">
                    {dispatchResult.assignedDirector.baseCenterName} ➔ 현장 ({dispatchResult.distanceKm}km)
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg sm:text-xl font-reverence font-bold text-[#C2A26A] flex items-center sm:justify-end space-x-1.5">
                    <Clock className="w-5 h-5" />
                    <span>{dispatchResult.estimatedArrivalTimeFormatted}</span>
                  </span>
                  <span className="text-[13px] text-[#C2A26A] font-sans font-medium flex items-center sm:justify-end space-x-1 mt-0.5">
                    <Navigation className="w-3.5 h-3.5" />
                    <span>실시간 경로 관제 중 (교통 원활)</span>
                  </span>
                </div>
              </div>

              {/* 2. 배정 지도사 (지역별 동적 배정) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#1F2226] gap-1">
                <div>
                  <span className="text-[#8A929D] text-sm">배정 지도사 ({dispatchResult.detectedRegion} 전담)</span>
                  <div className="text-[13px] text-[#8A929D] mt-0.5">
                    경력 {dispatchResult.assignedDirector.experienceYears}년 · 누적 의전 {dispatchResult.assignedDirector.completedCases}건 (평점 ★{dispatchResult.assignedDirector.ratingAvg})
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-base font-bold text-[#FAF9F6] flex items-center sm:justify-end space-x-1.5">
                    <Award className="w-4 h-4 text-[#C2A26A]" />
                    <span>{dispatchResult.assignedDirector.name} 수석 장례지도사 ({dispatchResult.assignedDirector.licenseNo})</span>
                  </span>
                  <span className="text-[13px] text-[#C2A26A] font-mono sm:justify-end flex mt-0.5">
                    안심 직통: {dispatchResult.assignedDirector.virtualPhone}
                  </span>
                </div>
              </div>

              {/* 3. 배차 운구차량 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#1F2226] gap-1">
                <span className="text-[#8A929D] text-sm">배차 특수 운구차량</span>
                <span className="text-sm font-bold text-[#FAF9F6] flex items-center sm:justify-end space-x-1.5">
                  <Car className="w-4 h-4 text-[#C2A26A]" />
                  <span>{dispatchResult.vehicleDispatchInfo}</span>
                </span>
              </div>

              {/* 4. 연계 장례식장 (추천인 경우) */}
              {dispatchResult.recommendedFuneralHall && funeralHallChoice === 'recommended' && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#1F2226] gap-1">
                  <div>
                    <span className="text-[#8A929D] text-sm">연계 추천 장례식장</span>
                    <div className="text-[13px] text-[#8A929D] mt-0.5">
                      {dispatchResult.recommendedFuneralHall.address}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-[#FAF9F6]">
                      {dispatchResult.recommendedFuneralHall.name}
                    </span>
                    <span className="text-[13px] text-[#C2A26A] block mt-0.5">
                      배웅 사전등록 빈소 {dispatchResult.recommendedFuneralHall.discountRatePercentage}% 감면 확보
                    </span>
                  </div>
                </div>
              )}

              {/* 5. 배웅 의전 서약 */}
              <div className="flex items-center justify-between pt-0.5">
                <span className="text-[#8A929D] text-sm">배웅 3대 의전 서약</span>
                <span className="text-[13px] font-bold text-[#DCE8E2] flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#C2A26A]" />
                  <span>선금 0원 · 부당 추가금 0원 · 촌지 전면 금지</span>
                </span>
              </div>
            </div>

            <div className="space-y-2.5 pt-1">
              {/* 실시간 GPS 관제 & 추가금 제로 검수표 버튼 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsTrackerOpen(true)}
                  className="py-3 px-4 bg-[#19382C] hover:bg-[#2D4F43] text-white rounded-xl font-serif font-bold text-[13px] flex items-center justify-center space-x-2 transition-colors cursor-pointer border border-[#2D4F43]"
                >
                  <Navigation className="w-4 h-4 text-[#C2A26A]" />
                  <span>실시간 GPS 운구 관제 (ETA 확인)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsTallyOpen(true)}
                  className="py-3 px-4 bg-[#1F2226] hover:bg-[#141618] text-[#FAF9F6] rounded-xl font-serif font-bold text-[13px] flex items-center justify-center space-x-2 transition-colors cursor-pointer border border-[#3D382E]"
                >
                  <FileCheck2 className="w-4 h-4 text-[#C2A26A]" />
                  <span>현장 추가금 제로 지출 검수표</span>
                </button>
              </div>

              <a
                href={`tel:${dispatchResult.assignedDirector.virtualPhone}`}
                className="w-full btn-senior-reverence bg-[#9E7D47] hover:bg-[#9E7D47] text-[#0D0E10] font-black flex items-center justify-center space-x-2 text-lg shadow-sm"
              >
                <Phone className="w-5 h-5" />
                <span>{dispatchResult.assignedDirector.name} 지도사 직통 전화 걸기 ({dispatchResult.assignedDirector.virtualPhone})</span>
              </a>

              <button
                onClick={onExitEmergency}
                className="w-full py-3 text-sm text-[#8A929D] hover:text-[#FAF9F6] font-serif cursor-pointer"
              >
                평시 메인 화면으로 돌아가기
              </button>
            </div>
          </div>
        )}
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
