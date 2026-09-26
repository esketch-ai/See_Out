import React, { useState, useMemo } from 'react';
import { FuneralHallEntity, RegionCode } from '../../funeral-halls/index.js';
import { MapPin, Navigation, ZoomIn, ZoomOut, Layers, Building2, Sparkles } from 'lucide-react';

interface FuneralHallMapProps {
  halls: FuneralHallEntity[];
  selectedHall: FuneralHallEntity | null;
  onSelectHall: (hall: FuneralHallEntity) => void;
  selectedRegion: string;
  onSelectRegion?: (region: string) => void;
  className?: string;
}

/**
 * 한국 고지도(古地圖)와 대동여지도 수묵화 미학을 계승한
 * 전국 장례식장 인터랙티브 위치 시각화 지도 컴포넌트
 */
export const FuneralHallMap: React.FC<FuneralHallMapProps> = ({
  halls,
  selectedHall,
  onSelectHall,
  selectedRegion,
  onSelectRegion,
  className = ''
}) => {
  const [mapMode, setMapMode] = useState<'national' | 'capital'>('national');
  const [hoveredHall, setHoveredHall] = useState<FuneralHallEntity | null>(null);

  // 수도권 필터링 여부 감지 시 자동 줌 모드 연동
  const isCapitalFocused = mapMode === 'capital' || selectedRegion === '서울특별시' || selectedRegion === '경기도' || selectedRegion === '인천광역시';

  // 위경도 -> SVG 투영 좌표 변환 함수
  // 전국 뷰 바운드: Lat 34.2 ~ 38.3, Lng 125.8 ~ 129.8 (SVG 400 x 520)
  // 수도권 뷰 바운드: Lat 37.1 ~ 37.8, Lng 126.5 ~ 127.4 (SVG 400 x 520)
  const projectCoords = (lat?: number, lng?: number): { x: number; y: number } | null => {
    if (!lat || !lng) return null;

    if (isCapitalFocused) {
      // 수도권 정밀 확대 투영
      const minLat = 37.15;
      const maxLat = 37.75;
      const minLng = 126.55;
      const maxLng = 127.35;

      const x = ((lng - minLng) / (maxLng - minLng)) * 340 + 30;
      const y = ((maxLat - lat) / (maxLat - minLat)) * 440 + 40;
      return { x, y };
    } else {
      // 전국 매크로 투영
      const minLat = 34.2;
      const maxLat = 38.4;
      const minLng = 125.8;
      const maxLng = 129.8;

      const x = ((lng - minLng) / (maxLng - minLng)) * 320 + 40;
      const y = ((maxLat - lat) / (maxLat - minLat)) * 450 + 35;
      return { x, y };
    }
  };

  // 현재 뷰에 표시될 식장 핀 목록
  const mappedPins = useMemo(() => {
    return halls
      .map((hall) => {
        const coords = projectCoords(hall.latitude, hall.longitude);
        return {
          hall,
          coords
        };
      })
      .filter((item): item is { hall: FuneralHallEntity; coords: { x: number; y: number } } => item.coords !== null);
  }, [halls, isCapitalFocused]);

  return (
    <div className={`relative rounded-xl border border-[#E3DFD5] bg-[#FAF8F5] overflow-hidden shadow-xs select-none flex flex-col ${className}`}>
      {/* 1. 지도 상단 툴바: 권역 필터 및 줌 모드 토글 */}
      <div className="bg-[#FFFFFF]/90 backdrop-blur-xs border-b border-[#E3DFD5] px-3.5 py-2.5 flex items-center justify-between z-20">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#9E7D47]" />
          <span className="text-xs font-serif font-bold text-[#151719]">
            {isCapitalFocused ? '수도권(서울·경기·인천) 정밀 지도' : '대한민국 전국 장사 인프라 지도'}
          </span>
          <span className="text-[11px] text-[#727782] font-serif hidden sm:inline">
            (핀을 누르시면 해당 식장의 상세 제원이 즉시 열립니다)
          </span>
        </div>

        {/* 뷰 모드 전환 버튼 */}
        <div className="flex bg-[#F0EDE6] p-0.5 rounded border border-[#E3DFD5] text-[11px] font-serif">
          <button
            onClick={() => setMapMode('national')}
            className={`px-2 py-1 rounded transition-all cursor-pointer ${
              !isCapitalFocused ? 'bg-[#19382C] text-white font-bold' : 'text-[#727782] hover:text-[#151719]'
            }`}
          >
            전국 뷰
          </button>
          <button
            onClick={() => setMapMode('capital')}
            className={`px-2 py-1 rounded transition-all cursor-pointer ${
              isCapitalFocused ? 'bg-[#19382C] text-white font-bold' : 'text-[#727782] hover:text-[#151719]'
            }`}
          >
            수도권 확대
          </button>
        </div>
      </div>

      {/* 2. 메인 지도 캔버스 (SVG 인터랙티브 맵) */}
      <div className="relative flex-1 min-h-[360px] md:min-h-[440px] flex items-center justify-center overflow-hidden">
        {/* 고지도 한지 질감 워터마크 */}
        <div className="pointer-events-none absolute inset-0 k-pattern-gyeokja opacity-15" />

        <svg
          viewBox="0 0 400 520"
          className="w-full h-full max-h-[500px] object-contain transition-all duration-500"
        >
          <defs>
            {/* 고지도 음영 필터 */}
            <radialGradient id="landGradient" cx="50%" cy="45%" r="65%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#F2ECE0" stopOpacity="0.75" />
            </radialGradient>
            <filter id="shadowSoft" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#151719" floodOpacity="0.08" />
            </filter>
          </defs>

          {/* 수묵 방위표 (동서남북) */}
          <g transform="translate(345, 45)" className="opacity-40">
            <circle cx="15" cy="15" r="14" fill="none" stroke="#9E7D47" strokeWidth="0.75" strokeDasharray="2,2" />
            <line x1="15" y1="3" x2="15" y2="27" stroke="#9E7D47" strokeWidth="1" />
            <line x1="3" y1="15" x2="27" y2="15" stroke="#9E7D47" strokeWidth="1" />
            <text x="15" y="7" textAnchor="middle" fontSize="6" fontFamily="Noto Serif KR" fontWeight="bold" fill="#151719">北</text>
            <text x="15" y="26" textAnchor="middle" fontSize="6" fontFamily="Noto Serif KR" fill="#151719">南</text>
            <text x="25" y="17" textAnchor="middle" fontSize="6" fontFamily="Noto Serif KR" fill="#151719">東</text>
            <text x="5" y="17" textAnchor="middle" fontSize="6" fontFamily="Noto Serif KR" fill="#151719">西</text>
          </g>

          {/* 배경 지도 지형 윤곽 (수묵 실루엣) */}
          {!isCapitalFocused ? (
            /* 대한민국 전도 실루엣 (전국 뷰) */
            <g filter="url(#shadowSoft)">
              {/* 한반도 본토 백터 라인 */}
              <path
                d="M 125 35 
                   C 145 35, 175 42, 215 50 
                   C 260 60, 275 90, 275 140 
                   C 275 180, 295 210, 290 260 
                   C 285 300, 315 340, 315 390 
                   C 315 415, 290 425, 265 425 
                   C 230 425, 210 440, 170 435 
                   C 120 430, 85 410, 85 385 
                   C 85 340, 115 315, 110 270 
                   C 105 230, 85 190, 95 145 
                   C 100 120, 120 100, 115 70 
                   Z"
                fill="url(#landGradient)"
                stroke="#CFC7B8"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              {/* 제주도 */}
              <ellipse cx="110" cy="485" rx="30" ry="14" fill="url(#landGradient)" stroke="#CFC7B8" strokeWidth="1" />
              <text x="110" y="487" textAnchor="middle" fontSize="8" fontFamily="Noto Serif KR" fill="#727782">제주도</text>

              {/* 울릉도 및 독도 */}
              <circle cx="360" cy="180" r="6" fill="url(#landGradient)" stroke="#CFC7B8" strokeWidth="0.8" />
              <circle cx="380" cy="190" r="3" fill="url(#landGradient)" stroke="#CFC7B8" strokeWidth="0.8" />
              <text x="360" y="193" textAnchor="middle" fontSize="6" fontFamily="Noto Serif KR" fill="#727782">울릉도</text>
              <text x="380" y="200" textAnchor="middle" fontSize="5" fontFamily="Noto Serif KR" fill="#727782">독도</text>

              {/* 주요 권역 캘리그래피 명칭 */}
              <text x="140" y="125" fontSize="11" fontFamily="Noto Serif KR" fontWeight="bold" fill="#727782" opacity="0.6">서울·경기</text>
              <text x="240" y="145" fontSize="10" fontFamily="Noto Serif KR" fontWeight="bold" fill="#727782" opacity="0.6">강원</text>
              <text x="160" y="235" fontSize="10" fontFamily="Noto Serif KR" fontWeight="bold" fill="#727782" opacity="0.6">충청·세종</text>
              <text x="240" y="295" fontSize="10" fontFamily="Noto Serif KR" fontWeight="bold" fill="#727782" opacity="0.6">경북·대구</text>
              <text x="140" y="365" fontSize="10" fontFamily="Noto Serif KR" fontWeight="bold" fill="#727782" opacity="0.6">전라·광주</text>
              <text x="260" y="380" fontSize="10" fontFamily="Noto Serif KR" fontWeight="bold" fill="#727782" opacity="0.6">경남·부산</text>
            </g>
          ) : (
            /* 수도권 정밀 확대 뷰 (서울·경기·인천) */
            <g filter="url(#shadowSoft)">
              {/* 경기도 외곽 윤곽 */}
              <path
                d="M 60 40 
                   C 120 30, 250 35, 330 65 
                   C 365 110, 360 210, 345 320 
                   C 325 410, 260 460, 180 470 
                   C 100 480, 50 420, 45 340 
                   C 40 250, 45 150, 60 40 Z"
                fill="url(#landGradient)"
                stroke="#CFC7B8"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
              {/* 서울특별시 특별 경계선 */}
              <path
                d="M 160 170 
                   C 210 160, 265 175, 275 220 
                   C 285 260, 240 300, 190 295 
                   C 145 290, 135 240, 145 200 
                   C 150 185, 155 175, 160 170 Z"
                fill="#F7F3EA"
                stroke="#9E7D47"
                strokeWidth="1.2"
                strokeDasharray="3,2"
              />
              <text x="205" y="240" textAnchor="middle" fontSize="13" fontFamily="Noto Serif KR" fontWeight="bold" fill="#151719" opacity="0.35">
                서울특별시
              </text>

              {/* 한강 수계 라인 */}
              <path
                d="M 285 225 C 240 230, 210 250, 165 240 C 130 230, 95 210, 65 200"
                fill="none"
                stroke="#B8CBD0"
                strokeWidth="2.5"
                strokeOpacity="0.6"
                strokeLinecap="round"
              />
              <text x="250" y="222" fontSize="8" fontFamily="Noto Serif KR" fill="#6A8995" opacity="0.8">한강</text>

              {/* 인천광역시 */}
              <path
                d="M 65 210 C 95 215, 115 245, 105 285 C 80 290, 60 260, 65 210 Z"
                fill="#FAF6EE"
                stroke="#A8B2A9"
                strokeWidth="0.9"
              />
              <text x="85" y="255" textAnchor="middle" fontSize="9" fontFamily="Noto Serif KR" fill="#727782" opacity="0.6">인천</text>
            </g>
          )}

          {/* 3. 장례식장 위치 핀 (Interactive Markers) */}
          {mappedPins.map(({ hall, coords }) => {
            const isSelected = selectedHall?.id === hall.id;
            const isHovered = hoveredHall?.id === hall.id;
            const isPartner = hall.isBaeungPartner;

            return (
              <g
                key={hall.id}
                transform={`translate(${coords.x}, ${coords.y})`}
                onClick={() => onSelectHall(hall)}
                onMouseEnter={() => setHoveredHall(hall)}
                onMouseLeave={() => setHoveredHall(null)}
                className="cursor-pointer group"
              >
                {/* 선택 시 파동 펄스 애니메이션 링 */}
                {isSelected && (
                  <>
                    <circle cx="0" cy="0" r="16" fill="#9E7D47" fillOpacity="0.25" className="animate-ping" />
                    <circle cx="0" cy="0" r="12" fill="none" stroke="#9E7D47" strokeWidth="1.5" />
                  </>
                )}

                {/* 제휴 식장(할인 혜택) 시 황동 후광 */}
                {isPartner && !isSelected && (
                  <circle cx="0" cy="0" r="9" fill="#9E7D47" fillOpacity="0.18" />
                )}

                {/* 핀 심볼 베이스 */}
                <circle
                  cx="0"
                  cy="0"
                  r={isSelected ? 6.5 : isHovered ? 6 : isPartner ? 5 : 4}
                  fill={isSelected ? '#9E7D47' : isPartner ? '#19382C' : '#42464E'}
                  stroke="#FFFFFF"
                  strokeWidth={isSelected ? 2 : 1.2}
                  className="transition-all duration-200"
                />

                {/* 핀 중앙 엠블럼 점 */}
                <circle
                  cx="0"
                  cy="0"
                  r={isSelected ? 2 : 1.5}
                  fill={isSelected ? '#FFFFFF' : isPartner ? '#C2A26A' : '#FAF9F6'}
                />

                {/* 핀 라벨 (선택 또는 호버 시 선명하게 노출) */}
                {(isSelected || isHovered) && (
                  <g transform="translate(0, -12)" filter="url(#shadowSoft)">
                    {/* 라벨 배경 카드 */}
                    <rect
                      x="-65"
                      y="-26"
                      width="130"
                      height="24"
                      rx="4"
                      fill="#121417"
                      stroke={isSelected ? '#9E7D47' : '#2D2A26'}
                      strokeWidth="1"
                    />
                    {/* 말풍선 꼭지 */}
                    <polygon points="-4,-2 0,2 4,-2" fill="#121417" />
                    {/* 식장 명칭 */}
                    <text
                      x="0"
                      y="-14"
                      textAnchor="middle"
                      fill="#FAF9F6"
                      fontSize="9.5"
                      fontWeight="bold"
                      fontFamily="Noto Serif KR"
                    >
                      {hall.name.length > 9 ? hall.name.slice(0, 9) + '…' : hall.name}
                    </text>
                    {/* 감면 혜택 뱃지 */}
                    {isPartner && (
                      <text
                        x="0"
                        y="-4"
                        textAnchor="middle"
                        fill="#C2A26A"
                        fontSize="7.5"
                        fontFamily="Noto Serif KR"
                      >
                        배웅 {Math.round(hall.discountRate * 100)}% 감면
                      </text>
                    )}
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* 4. 지도 좌측 하단 나침반 및 축척 범례 */}
        <div className="absolute bottom-2.5 left-3 bg-[#FFFFFF]/95 backdrop-blur-xs border border-[#E3DFD5] rounded-md p-2 text-[10px] font-serif shadow-xs space-y-1">
          <div className="font-bold text-[#151719] flex items-center space-x-1">
            <span>지도 범례</span>
          </div>
          <div className="flex items-center space-x-1.5 text-[#19382C]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#19382C] border border-white inline-block" />
            <span>배웅 제휴 식장 (최대 30% 감면)</span>
          </div>
          <div className="flex items-center space-x-1.5 text-[#42464E]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#42464E] border border-white inline-block" />
            <span>일반 등록 장례식장</span>
          </div>
          <div className="flex items-center space-x-1.5 text-[#9E7D47]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#9E7D47] ring-1 ring-[#9E7D47] inline-block" />
            <span className="font-bold">현재 선택된 장례식장</span>
          </div>
        </div>

        {/* 5. 우측 하단 컨트롤러 */}
        <div className="absolute bottom-2.5 right-3 flex flex-col space-y-1">
          <button
            onClick={() => setMapMode(isCapitalFocused ? 'national' : 'capital')}
            className="p-1.5 rounded-md bg-[#FFFFFF] border border-[#E3DFD5] shadow-xs text-[#151719] hover:bg-[#FAF9F6] cursor-pointer"
            title={isCapitalFocused ? '전국 지도로 축소' : '수도권 지도로 확대'}
          >
            {isCapitalFocused ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
