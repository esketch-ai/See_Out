import React, { useState } from 'react';
import { FuneralHallEntity } from '../../funeral-halls/index.js';
import {
  MapPin,
  Navigation,
  ZoomIn,
  ZoomOut,
  ExternalLink,
  Layers,
  Sparkles,
  Train,
  Flame,
  Maximize2,
  Compass
} from 'lucide-react';

interface FuneralHallMapProps {
  halls: FuneralHallEntity[];
  selectedHall: FuneralHallEntity | null;
  onSelectHall: (hall: FuneralHallEntity) => void;
  selectedRegion: string;
  onSelectRegion?: (region: string) => void;
  className?: string;
}

/**
 * 실시간 Google 지도(Google Maps)를 임베드하여
 * 장례식장 정밀 위성/도로 위치, 대중교통 노선, 승화원 경로를 직관적으로 제공하는 컴포넌트
 */
export const FuneralHallMap: React.FC<FuneralHallMapProps> = ({
  halls,
  selectedHall,
  onSelectHall,
  selectedRegion,
  onSelectRegion,
  className = ''
}) => {
  // 줌 레벨: 15 (주변 권역), 16 (표준 동네/교통), 17 (상세 건물/진입로)
  const [zoomLevel, setZoomLevel] = useState<number>(16);
  // 지도 모드: 'm' (일반 도로지도) | 'k' (위성사진) | 'h' (하이브리드: 위성+도로명)
  const [mapType, setMapType] = useState<'m' | 'h'>('m');

  // 기준 좌표 (선택된 식장 좌표, 없으면 서울 시청 기준)
  const targetLat = selectedHall?.latitude ?? 37.5665;
  const targetLng = selectedHall?.longitude ?? 126.9780;

  // Google Maps Iframe 임베드 URL (API Key 없이 안정적으로 동작하는 공식 output=embed 형식)
  const googleMapEmbedUrl = `https://maps.google.com/maps?q=${targetLat},${targetLng}&hl=ko&z=${zoomLevel}&t=${mapType}&output=embed`;

  // Google Maps 외부 바로가기 URL
  const googleMapsSearchUrl = selectedHall
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${selectedHall.name} ${selectedHall.address}`
      )}`
    : `https://www.google.com/maps/@${targetLat},${targetLng},${zoomLevel}z?hl=ko`;

  // Google Maps 실시간 길찾기 URL (대중교통 기준)
  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${targetLat},${targetLng}&travelmode=transit`;

  // 카카오맵 바로가기 URL
  const kakaoMapUrl = selectedHall
    ? `https://map.kakao.com/link/map/${encodeURIComponent(selectedHall.name)},${targetLat},${targetLng}`
    : '#';

  // 네이버 지도 바로가기 URL
  const naverMapUrl = selectedHall
    ? `https://map.naver.com/v5/search/${encodeURIComponent(selectedHall.name)}`
    : '#';

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 1, 18));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 1, 12));
  };

  return (
    <div className={`rounded-xl border border-[#DCD6C9] bg-[#FFFFFF] shadow-sm overflow-hidden flex flex-col ${className}`}>
      {/* 1. 상단 컨트롤 바: Google Maps 상태, 식장명, 뷰 모드 및 줌 컨트롤 */}
      <div className="bg-[#FAF9F6] border-b border-[#DCD6C9] p-3 md:px-4 md:py-3 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center space-x-2">
          {/* 제3자 지도 제공 표기 — 배웅 고유 표색으로 표기한다 (AREA-DESIGN-2026-009: 타 서비스 브랜드색 금지) */}
          <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded bg-[#FFFFFF] border border-[#DCD6C9] text-[13px] font-bold text-[#42464E] shadow-2xs">
            <MapPin className="w-3 h-3 text-[#243F35] shrink-0" />
            <span>지도 제공: 구글</span>
          </div>

          <div className="text-xs font-serif font-bold text-[#151719] truncate max-w-[180px] sm:max-w-xs">
            {selectedHall ? (
              <span className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-[#8B2520] shrink-0 fill-[#8B2520]/20" />
                <span className="truncate">{selectedHall.name}</span>
              </span>
            ) : (
              <span>전국 장례식장 위치 안내</span>
            )}
          </div>
        </div>

        {/* 컨트롤 버튼 그룹: 줌 / 지도 모드 / 길찾기 */}
        <div className="flex items-center space-x-1.5 text-xs font-serif">
          {/* 일반 지도 / 위성 지도 토글 */}
          <div className="flex bg-[#FAF9F6] p-0.5 rounded border border-[#DCD6C9] text-[13px]">
            <button
              onClick={() => setMapType('m')}
              className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                mapType === 'm'
                  ? 'bg-[#19382C] text-white font-bold shadow-2xs'
                  : 'text-[#5A5E66] hover:text-[#151719]'
              }`}
            >
              일반 도로
            </button>
            <button
              onClick={() => setMapType('h')}
              className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                mapType === 'h'
                  ? 'bg-[#19382C] text-white font-bold shadow-2xs'
                  : 'text-[#5A5E66] hover:text-[#151719]'
              }`}
            >
              위성 하이브리드
            </button>
          </div>

          {/* 줌 확대/축소 버튼 */}
          <div className="flex bg-[#FFFFFF] border border-[#DCD6C9] rounded shadow-2xs">
            <button
              onClick={handleZoomIn}
              disabled={zoomLevel >= 18}
              className="p-1 hover:bg-[#FAF9F6] disabled:opacity-30 cursor-pointer text-[#151719]"
              title="지도 확대"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <span className="w-px bg-[#DCD6C9]" />
            <button
              onClick={handleZoomOut}
              disabled={zoomLevel <= 12}
              className="p-1 hover:bg-[#FAF9F6] disabled:opacity-30 cursor-pointer text-[#151719]"
              title="지도 축소"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Google 실시간 대중교통 길찾기 */}
          <a
            href={googleMapsDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 bg-[#19382C] hover:bg-[#2D4F43] text-white rounded font-bold text-[13px] flex items-center space-x-1 shadow-2xs transition-all cursor-pointer"
            title="Google 지도에서 실시간 대중교통 및 자동차 길찾기 열기"
          >
            <Navigation className="w-3 h-3 text-[#C2A26A]" />
            <span className="hidden sm:inline">Google 길찾기</span>
            <span className="sm:hidden">길찾기</span>
          </a>

          {/* Google 지도 새창 크게보기 */}
          <a
            href={googleMapsSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 bg-[#FFFFFF] hover:bg-[#FAF9F6] border border-[#DCD6C9] rounded text-[#42464E] shadow-2xs transition-all cursor-pointer"
            title="Google 지도 새 탭에서 크게 보기"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* 2. 빠른 식장 탐색 칩 바 (목록 내 다른 식장으로 즉시 Google 지도 이동) */}
      <div className="bg-[#FAF9F6] border-b border-[#DCD6C9] px-3 py-1.5 flex items-center gap-1.5 overflow-x-auto text-[13px] font-serif">
        <span className="shrink-0 text-[#5A5E66] font-medium flex items-center space-x-1">
          <Compass className="w-3 h-3 text-[#6E5429]" />
          <span>위치 바로보기:</span>
        </span>
        {halls.slice(0, 10).map((hall) => {
          const isSelected = selectedHall?.id === hall.id;
          return (
            <button
              key={hall.id}
              onClick={() => onSelectHall(hall)}
              className={`px-2 py-0.5 rounded-full shrink-0 transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-[#19382C] text-white border-[#19382C] font-bold shadow-2xs'
                  : 'bg-[#FFFFFF] text-[#42464E] border-[#DCD6C9] hover:border-[#9E7D47]'
              }`}
            >
              {hall.isBaeungPartner && <span className="text-[#C2A26A] mr-0.5">★</span>}
              {hall.name.length > 9 ? hall.name.slice(0, 9) + '…' : hall.name}
            </button>
          );
        })}
        {halls.length > 10 && (
          <span className="text-[13px] text-[#5A5E66] shrink-0">
            외 {halls.length - 10}곳 (좌측 목록 참조)
          </span>
        )}
      </div>

      {/* 3. Google Maps Iframe 본체 */}
      <div className="relative w-full h-[360px] md:h-[420px] bg-[#FAF9F6] overflow-hidden">
        <iframe
          key={`${targetLat}-${targetLng}-${zoomLevel}-${mapType}`}
          src={googleMapEmbedUrl}
          title={selectedHall ? `${selectedHall.name} Google 지도 위치` : 'Google 지도'}
          className="w-full h-full border-0"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />

        {/* 선택 식장 플로팅 정보 배너 (Google 지도 좌측 상단 오버레이) */}
        {selectedHall && (
          <div className="absolute top-2.5 left-2.5 max-w-[280px] sm:max-w-xs bg-[#FFFFFF]/95 backdrop-blur-xs border border-[#DCD6C9] rounded-lg p-2.5 shadow-md text-xs font-serif space-y-1 pointer-events-auto">
            <div className="flex items-center justify-between gap-1">
              <span className="font-bold text-[#151719] truncate">{selectedHall.name}</span>
              {selectedHall.isBaeungPartner && (
                <span className="shrink-0 text-[13px] font-bold bg-[#DCE8E2] text-[#19382C] px-1.5 py-0.2 rounded border border-[#DCE8E2]">
                  {Math.round(selectedHall.discountRate * 100)}% 감면
                </span>
              )}
            </div>
            <div className="text-[13px] text-[#5A5E66] truncate">{selectedHall.address}</div>
            {selectedHall.nearestSubway && (
              <div className="text-[13px] text-[#19382C] flex items-center space-x-1">
                <Train className="w-3 h-3 shrink-0" />
                <span className="truncate">{selectedHall.nearestSubway}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. 지도 하단 멀티 네비게이션 연동 풋바 */}
      <div className="bg-[#FAF9F6] border-t border-[#DCD6C9] px-3.5 py-2 flex flex-wrap items-center justify-between gap-2 text-[13px] font-serif">
        <div className="flex items-center space-x-1.5 text-[#5A5E66]">
          <span>좌표: {targetLat.toFixed(4)}, {targetLng.toFixed(4)}</span>
          {selectedHall?.nearestCrematorium && (
            <>
              <span>•</span>
              <span className="text-[#8B2520] flex items-center space-x-1 font-medium">
                <Flame className="w-3 h-3 text-[#8B2520]" />
                <span>연계 승화원: {selectedHall.nearestCrematorium} ({selectedHall.crematoriumDistanceKm}km, {selectedHall.crematoriumTravelMinutes}분)</span>
              </span>
            </>
          )}
        </div>

        {/* 국내 지도(카카오/네이버) 바로가기 옵션 */}
        <div className="flex items-center space-x-2 text-[#5A5E66]">
          <span className="text-[#5A5E66] hidden sm:inline">다른 지도 앱:</span>
          {selectedHall && (
            <>
              <a
                href={kakaoMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#151719] hover:underline flex items-center space-x-0.5 text-[#5A5E66]"
              >
                <span>카카오맵</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
              <span>|</span>
              <a
                href={naverMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#151719] hover:underline flex items-center space-x-0.5 text-[#5A5E66] font-medium"
              >
                <span>네이버지도</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
