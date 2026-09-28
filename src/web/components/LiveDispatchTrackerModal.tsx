import React, { useState, useEffect } from 'react';
import {
  Navigation,
  Car,
  Clock,
  Phone,
  ShieldCheck,
  MapPin,
  RefreshCw,
  Award,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ModalShell, ModalToolbar } from './ModalShell.js';
import { DispatchMatchResult } from '../../emergency/types.js';

interface LiveDispatchTrackerModalProps {
  dispatchResult: DispatchMatchResult;
  onClose: () => void;
}

const ROUTE_STAGES = [
  { stage: 1, label: '긴급 관제 대기소 출동', percent: 10, etaMinutes: 38, desc: '관할 의전 대기소에서 특수 운구차량 및 지도사 긴급 출동' },
  { stage: 2, label: '도심 고속화도로 주행 중', percent: 35, etaMinutes: 28, desc: '올림픽대로 진입 및 현장 최단거리 경로 주행' },
  { stage: 3, label: '관할 대교 통과 중', percent: 65, etaMinutes: 16, desc: '주요 정체 구간 우회 통과, 현장 5km 이내 접근' },
  { stage: 4, label: '현장 인근 진입로 통과', percent: 88, etaMinutes: 5, desc: '식장 및 병원 진입로 통과, 비상 연락망 가동' },
  { stage: 5, label: '현장 도착 완료', percent: 100, etaMinutes: 0, desc: '현장 도착, 유족 영접 및 임종 의전 절차 개시' }
];

export const LiveDispatchTrackerModal: React.FC<LiveDispatchTrackerModalProps> = ({
  dispatchResult,
  onClose
}) => {
  const [stageIndex, setStageIndex] = useState(1); // Default to stage 2 (in transit)
  const currentStage = ROUTE_STAGES[stageIndex];

  const handleAdvanceSimulation = () => {
    setStageIndex((prev) => (prev < ROUTE_STAGES.length - 1 ? prev + 1 : 0));
  };

  const calculatedDistance = Math.max(
    0.3,
    parseFloat((dispatchResult.distanceKm * (1 - currentStage.percent / 100)).toFixed(1))
  );

  return (
    <ModalShell
      onClose={onClose}
      maxWidth="max-w-2xl"
      surface="paper"
      titleId="live-dispatch-title"
      descriptionId="live-dispatch-desc"
    >
      <ModalToolbar
        titleId="live-dispatch-title"
        descriptionId="live-dispatch-desc"
        onClose={onClose}
        closeLabel="관제 닫기"
        icon={
          <div className="w-8 h-8 rounded-full bg-[#19382C] text-[#C2A26A] flex items-center justify-center border border-[#2D4F43] shrink-0">
            <Navigation className="w-4 h-4" />
          </div>
        }
        title={<span className="text-lg font-reverence font-bold text-[#FAF9F6]">실시간 GPS 운구차량 위치 관제</span>}
        subtitle="전담 장례지도사와 특수 운구차량의 실시간 이동 경로 및 도착 예상 시간을 안내합니다."
      >
        <button
          type="button"
          onClick={handleAdvanceSimulation}
          className="px-3 py-1.5 bg-[#19382C] hover:bg-[#2D4F43] text-white rounded-md text-[13px] font-bold flex items-center space-x-1.5 transition-colors cursor-pointer border border-[#2D4F43]"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#C2A26A]" />
          <span>이동 시뮬레이션</span>
        </button>
      </ModalToolbar>

      <div className="p-4 sm:p-6 space-y-5 bg-[#FAF9F6] overflow-y-auto max-h-[82vh]">
        {/* 도착 예정 시간 배너 */}
        <div className="bg-white p-5 rounded-2xl border-2 border-[#19382C] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-[13px] font-bold text-[#6E5429]">
                {dispatchResult.assignedDirector.baseCenterName} ➔ 현장
              </span>
              <span className="text-[13px] bg-[#19382C] text-[#DCE8E2] px-2 py-0.5 rounded font-mono">
                {dispatchResult.dispatchId}
              </span>
            </div>
            <h3 className="text-2xl font-reverence font-black text-[#151719]">
              {currentStage.etaMinutes > 0
                ? `약 ${currentStage.etaMinutes}분 후 현장 도착 예정`
                : '현장 도착 완료 (의전 개시)'}
            </h3>
            <p className="text-[13px] text-[#5A5E66]">
              현재 남은 거리: <strong className="text-[#19382C]">{calculatedDistance}km</strong> (실시간 위성 교통 정보 반영)
            </p>
          </div>

          <div className="text-right shrink-0">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#19382C]/10 text-[#19382C] font-bold text-[13px] border border-[#19382C]/20">
              <Car className="w-4 h-4" />
              <span>{currentStage.label}</span>
            </div>
          </div>
        </div>

        {/* 인터랙티브 GPS 이동 궤적 지도 시각화 박스 */}
        <div className="bg-[#141618] rounded-2xl p-6 border border-[#2D4F43] text-white space-y-6 shadow-md">
          <div className="flex items-center justify-between text-[13px] text-[#A8B2A9]">
            <div className="flex items-center space-x-1.5">
              <MapPin className="w-4 h-4 text-[#C2A26A]" />
              <span>출발지: {dispatchResult.assignedDirector.baseCenterName}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <MapPin className="w-4 h-4 text-[#D4665A]" />
              <span>도착지: {dispatchResult.detectedLocationSummary}</span>
            </div>
          </div>

          {/* 프로그레스 라인 & 차량 아이콘 */}
          <div className="relative pt-6 pb-2">
            <div className="h-2.5 bg-[#1F2226] rounded-full overflow-hidden border border-[#3D382E]">
              <div
                className="h-full bg-gradient-to-r from-[#9E7D47] to-[#C2A26A] transition-all duration-700 rounded-full"
                style={{ width: `${currentStage.percent}%` }}
              />
            </div>

            {/* 움직이는 차량 마커 */}
            <div
              className="absolute -top-1 transition-all duration-700 transform -translate-x-1/2 flex flex-col items-center"
              style={{ left: `${Math.max(5, Math.min(95, currentStage.percent))}%` }}
            >
              <div className="w-9 h-9 rounded-full bg-[#19382C] border-2 border-[#C2A26A] flex items-center justify-center shadow-lg animate-bounce">
                <Car className="w-5 h-5 text-[#FAF9F6]" />
              </div>
              <span className="text-[13px] font-bold text-[#C2A26A] mt-1 bg-[#0D0E10] px-2 py-0.5 rounded border border-[#3D382E] whitespace-nowrap">
                {currentStage.percent}% 주행
              </span>
            </div>
          </div>

          {/* 현재 구간 상세 설명 */}
          <div className="p-3.5 bg-[#0D0E10] rounded-xl border border-[#3D382E] flex items-center justify-between text-[13px]">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-[#C2A26A]" />
              <span className="text-[#FAF9F6]">{currentStage.desc}</span>
            </div>
            <span className="text-[#C2A26A] font-bold font-mono">
              GPS 신호 양호
            </span>
          </div>
        </div>

        {/* 배정 지도사 및 특수 운구차량 스펙 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px]">
          {/* 지도사 정보 */}
          <div className="bg-white p-4 rounded-xl border border-[#DCD6C9] space-y-2">
            <div className="flex items-center justify-between border-b border-[#DCD6C9] pb-2">
              <span className="font-bold text-[#151719] flex items-center space-x-1.5">
                <Award className="w-4 h-4 text-[#C2A26A]" />
                <span>현장 출동 전담 지도사</span>
              </span>
              <span className="text-[13px] bg-[#19382C] text-[#DCE8E2] px-2 py-0.5 rounded">
                국가공인 1급
              </span>
            </div>
            <p className="font-bold text-[#151719] text-base">
              {dispatchResult.assignedDirector.name} 수석 장례지도사
            </p>
            <p className="text-[#5A5E66]">
              자격번호: {dispatchResult.assignedDirector.licenseNo} (경력 {dispatchResult.assignedDirector.experienceYears}년)
            </p>
            <a
              href={`tel:${dispatchResult.assignedDirector.virtualPhone}`}
              className="mt-2 w-full py-2 bg-[#19382C] hover:bg-[#2D4F43] text-white rounded-lg font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Phone className="w-4 h-4 text-[#C2A26A]" />
              <span>지도사 직통 통화 ({dispatchResult.assignedDirector.virtualPhone})</span>
            </a>
          </div>

          {/* 운구차량 정보 */}
          <div className="bg-white p-4 rounded-xl border border-[#DCD6C9] space-y-2">
            <div className="flex items-center justify-between border-b border-[#DCD6C9] pb-2">
              <span className="font-bold text-[#151719] flex items-center space-x-1.5">
                <Car className="w-4 h-4 text-[#19382C]" />
                <span>배차 특수 운구 리무진</span>
              </span>
              <span className="text-[13px] text-[#6E5429] font-bold">
                방역 소독 필
              </span>
            </div>
            <p className="font-bold text-[#151719] text-base">
              {dispatchResult.vehicleDispatchInfo}
            </p>
            <p className="text-[#5A5E66]">
              차량 제원: 고인 전용 유압식 리프트 탑재 및 유족 동승 6인승
            </p>
            <div className="p-2 bg-[#FAF9F6] rounded-lg border border-[#DCD6C9] text-[13px] text-[#19382C] font-bold flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-[#19382C]" />
              <span>전국 무료 운구 보증 (관내·시외할증 0원)</span>
            </div>
          </div>
        </div>

        {/* 안심 보증 문구 */}
        <div className="p-3 bg-white rounded-xl border border-[#DCD6C9] text-[13px] text-[#5A5E66] text-center">
          배웅 긴급 의전 차량은 24시간 안전 운행 규정을 준수하며 고인을 극진히 모시기 위해 최단 경로로 이동합니다.
        </div>
      </div>
    </ModalShell>
  );
};
