import React, { useState } from 'react';
import { Phone, MapPin, Building2, CheckCircle2, Clock, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';

export const EmergencyMode: React.FC<{ onExitEmergency: () => void }> = ({ onExitEmergency }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [deceasedLocation, setDeceasedLocation] = useState<'hospital' | 'home' | 'care' | ''>('');
  const [locationDetail, setLocationDetail] = useState('');
  const [funeralHallChoice, setFuneralHallChoice] = useState<'recommended' | 'designated' | ''>('');
  const [hallName, setHallName] = useState('');

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-20">
      {/* 긴급 상단 경고 바 */}
      <div className="bg-emergency-600 text-white px-4 py-3 shadow-lg flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-6 h-6 animate-bounce" />
          <span className="font-extrabold text-lg">24시간 긴급 장례 지원 센터 (2시간 내 현장 도착)</span>
        </div>
        <button
          onClick={onExitEmergency}
          className="text-xs bg-black/40 hover:bg-black/60 px-3 py-1.5 rounded-lg font-bold"
        >
          평시 모드로 복귀 ✕
        </button>
      </div>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* 즉시 직통 전화 연결 (원터치 핫라인) */}
        <a
          href="tel:1588-0000"
          className="w-full bg-emergency-600 hover:bg-emergency-700 active:scale-95 text-white p-5 rounded-2xl flex items-center justify-center space-x-3 shadow-xl mb-8 border-2 border-red-400 transition-all cursor-pointer"
        >
          <Phone className="w-8 h-8 animate-pulse text-yellow-300" />
          <div className="text-left">
            <div className="text-sm font-semibold text-red-100">통화가 더 편하신가요?</div>
            <div className="text-2xl font-black">24시 상황실 즉시 전화 걸기</div>
          </div>
        </a>

        {/* 3단계 진행 바 */}
        <div className="flex items-center justify-between mb-8 px-2">
          {[
            { num: 1, label: '고인 위치' },
            { num: 2, label: '장례식장' },
            { num: 3, label: '출동 배정' }
          ].map((s) => (
            <div key={s.num} className="flex-1 flex items-center">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-lg ${
                    step >= s.num ? 'bg-emergency-500 text-white ring-4 ring-red-900/50' : 'bg-gray-800 text-gray-500'
                  }`}
                >
                  {s.num}
                </div>
                <span className={`text-xs mt-1.5 font-bold ${step >= s.num ? 'text-white' : 'text-gray-500'}`}>
                  {s.label}
                </span>
              </div>
              {s.num < 3 && (
                <div className={`h-1 flex-1 ${step > s.num ? 'bg-emergency-500' : 'bg-gray-800'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: 고인 위치 입력 */}
        {step === 1 && (
          <div className="bg-gray-800/90 border border-gray-700 rounded-3xl p-6 shadow-2xl space-y-6">
            <div>
              <h2 className="text-2xl font-black text-white flex items-center space-x-2">
                <MapPin className="text-emergency-500 w-7 h-7" />
                <span>현재 고인이 계신 곳은 어디인가요?</span>
              </h2>
              <p className="text-gray-400 text-base mt-1">이송용 전용 운구차량이 2시간 내 도착합니다.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'hospital', title: '병원 / 응급실', desc: '병원 내 안치 전' },
                { id: 'home', title: '자택', desc: '가정 내 임종' },
                { id: 'care', title: '요양병원 / 요양원', desc: '요양 시설' }
              ].map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => setDeceasedLocation(loc.id as any)}
                  className={`p-5 rounded-2xl text-left border-2 transition-all min-h-[90px] ${
                    deceasedLocation === loc.id
                      ? 'border-emergency-500 bg-red-950/40 text-white'
                      : 'border-gray-700 bg-gray-900/60 text-gray-300 hover:border-gray-500'
                  }`}
                >
                  <div className="font-extrabold text-lg">{loc.title}</div>
                  <div className="text-xs text-gray-400 mt-1">{loc.desc}</div>
                </button>
              ))}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">상세 위치 또는 병원명</label>
              <input
                type="text"
                value={locationDetail}
                onChange={(e) => setLocationDetail(e.target.value)}
                placeholder="예: 서울아산병원 본관 응급실 / 분당 자택"
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-4 text-white text-lg placeholder-gray-500 focus:outline-none focus:border-emergency-500"
              />
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!deceasedLocation}
              className="w-full btn-senior bg-emergency-600 hover:bg-emergency-700 disabled:bg-gray-700 disabled:text-gray-500 text-white flex items-center justify-center space-x-2 text-xl shadow-lg transition-all"
            >
              <span>다음: 장례식장 선택</span>
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* Step 2: 장례식장 선택 */}
        {step === 2 && (
          <div className="bg-gray-800/90 border border-gray-700 rounded-3xl p-6 shadow-2xl space-y-6">
            <div>
              <h2 className="text-2xl font-black text-white flex items-center space-x-2">
                <Building2 className="text-emergency-500 w-7 h-7" />
                <span>모실 장례식장을 결정하셨나요?</span>
              </h2>
              <p className="text-gray-400 text-base mt-1">배웅 제휴 식장 선택 시 빈소 임대료 최대 30% 감면 적용</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setFuneralHallChoice('recommended')}
                className={`w-full p-5 rounded-2xl text-left border-2 transition-all ${
                  funeralHallChoice === 'recommended'
                    ? 'border-emergency-500 bg-red-950/40 text-white'
                    : 'border-gray-700 bg-gray-900/60 text-gray-300 hover:border-gray-500'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-lg">💡 배웅 추천 최적 식장 (할인 제휴)</span>
                  <span className="text-xs bg-emerald-600 text-white px-2.5 py-1 rounded-full font-bold">임대료 감면</span>
                </div>
                <p className="text-sm text-gray-400 mt-1.5">현재 위치에서 가장 가깝고 가성비 높은 빈소 예약 조율</p>
              </button>

              <button
                onClick={() => setFuneralHallChoice('designated')}
                className={`w-full p-5 rounded-2xl text-left border-2 transition-all ${
                  funeralHallChoice === 'designated'
                    ? 'border-emergency-500 bg-red-950/40 text-white'
                    : 'border-gray-700 bg-gray-900/60 text-gray-300 hover:border-gray-500'
                }`}
              >
                <span className="font-extrabold text-lg">📍 이미 정해둔 장례식장이 있습니다</span>
                <p className="text-sm text-gray-400 mt-1.5">희망하시는 식장으로 즉시 운구 및 빈소 배정 안내</p>
              </button>
            </div>

            {funeralHallChoice === 'designated' && (
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">희망 장례식장 명칭</label>
                <input
                  type="text"
                  value={hallName}
                  onChange={(e) => setHallName(e.target.value)}
                  placeholder="예: 서울성모병원 장례식장"
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-4 text-white text-lg placeholder-gray-500 focus:outline-none focus:border-emergency-500"
                />
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 btn-senior bg-gray-700 hover:bg-gray-600 text-white font-bold"
              >
                이전
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!funeralHallChoice}
                className="w-2/3 btn-senior bg-emergency-600 hover:bg-emergency-700 disabled:bg-gray-700 disabled:text-gray-500 text-white flex items-center justify-center space-x-2 text-xl font-bold shadow-lg"
              >
                <span>긴급 접수 완료</span>
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: 출동 배정 완료 (ETA 카운트다운) */}
        {step === 3 && (
          <div className="bg-gray-800/90 border border-emerald-500 rounded-3xl p-6 shadow-2xl text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div>
              <h2 className="text-3xl font-black text-white">긴급 출동 배정이 완료되었습니다</h2>
              <p className="text-emerald-400 text-lg font-bold mt-2">
                국가공인 전담 장례지도사 1명이 즉시 현장으로 출발했습니다.
              </p>
            </div>

            <div className="bg-gray-900 rounded-2xl p-5 border border-gray-700 space-y-4 text-left">
              <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                <span className="text-gray-400">현장 도착 예정 시간 (ETA)</span>
                <span className="text-2xl font-black text-yellow-400 flex items-center space-x-1">
                  <Clock className="w-6 h-6" />
                  <span>약 45분 이내</span>
                </span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                <span className="text-gray-400">배정 지도사</span>
                <span className="text-lg font-bold text-white">김진우 전담 장례지도사 (자격 제11-0421호)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">배웅 안심 보증</span>
                <span className="text-sm font-bold text-emerald-400 flex items-center space-x-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>선금 0원 / 추가금 촌지 전면 금지</span>
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <a
                href="tel:1588-0000"
                className="w-full btn-senior bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center space-x-2 text-xl shadow-lg"
              >
                <Phone className="w-6 h-6" />
                <span>전담 지도사 직통 전화 걸기</span>
              </a>

              <button
                onClick={onExitEmergency}
                className="w-full py-3 text-sm text-gray-400 hover:text-white font-medium"
              >
                메인 홈으로 돌아가기
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
