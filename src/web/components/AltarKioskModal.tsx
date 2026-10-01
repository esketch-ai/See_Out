import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Heart,
  Calendar,
  MapPin,
  Clock,
  Printer,
  Sparkles,
  Award
} from 'lucide-react';
import { LifeStoryDocument, LifePhotoItem, FuneralSetting } from '../../life-archive/types.js';
import { TraditionalSeal } from '../design-system/index.js';
import { useDialogFocus } from './ModalShell.js';

interface AltarKioskModalProps {
  story: LifeStoryDocument;
  lifePhotos: LifePhotoItem[];
  setting: FuneralSetting;
  onClose: () => void;
  onOpenBooklet?: () => void;
}

export const AltarKioskModal: React.FC<AltarKioskModalProps> = ({
  story,
  lifePhotos,
  setting,
  onClose,
  onOpenBooklet
}) => {
  const [currentPhotoIdx, setCurrentPhotoIdx] = useState<number>(0);
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // 포커스 트랩은 공용 훅을 재사용한다. ESC 는 이 컨테이너의 2단계 처리
  // (전체화면 해제 → 닫기) 가 이미 window 리스너로 동작하므로 위임하지 않는다.
  const { panelRef, handleKeyDown } = useDialogFocus(true, undefined);

  // ESC 키 이벤트 및 키보드 좌우 화살표 네비게이션
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsAutoPlay((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, lifePhotos.length]);

  // 4초마다 자동 슬라이드쇼 재생
  useEffect(() => {
    if (!isAutoPlay || lifePhotos.length === 0) return;
    const timer = setInterval(() => {
      setCurrentPhotoIdx((prev) => (prev + 1) % lifePhotos.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isAutoPlay, lifePhotos.length]);

  const handleNext = () => {
    setCurrentPhotoIdx((prev) => (prev + 1) % lifePhotos.length);
  };

  const handlePrev = () => {
    setCurrentPhotoIdx((prev) => (prev - 1 + lifePhotos.length) % lifePhotos.length);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(() => {});
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(() => {});
    }
  };

  const currentPhoto = lifePhotos[currentPhotoIdx] || lifePhotos[0];

  return (
    <div
      ref={(el) => {
        containerRef.current = el;
        panelRef.current = el;
      }}
      role="dialog"
      aria-modal="true"
      aria-label="빈소 헌정 키오스크 (빈소 영정 TV)"
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      className="fixed inset-0 z-50 bg-[#0B0C0E] text-[#FAF9F6] flex flex-col select-none overflow-hidden focus:outline-none"
    >
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. 상단 컨트롤 바 (키오스크 상태 표시 & 조작 버튼) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <header className="h-16 px-6 bg-[#141618]/90 backdrop-blur-md border-b border-white/10 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <TraditionalSeal sealKey="mourningCondolence" size="sm" />
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[0.8125rem] uppercase tracking-widest text-[#C2A26A] font-bold">
                Bae-ung Altar TV Kiosk System
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[0.8125rem] bg-[#8B2520]/60 text-[#E08578] border border-[#731C18]/50">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4665A] animate-pulse mr-1" />
                빈소 현장 실시간 송출 중
              </span>
            </div>
            <h2 className="text-sm md:text-base font-serif font-bold text-[#FAF9F6]">
              {setting.funeralHallName} {setting.roomName} 故 {setting.deceasedName.replace('故 ', '')} 디지털 헌정관
            </h2>
          </div>
        </div>

        <div className="flex items-center space-x-2 md:space-x-3">
          {/* 음성 플레이어 제어 */}
          <button
            onClick={() => setIsPlayingAudio(!isPlayingAudio)}
            className={`px-3 py-1.5 rounded text-[0.8125rem] font-serif flex items-center space-x-1.5 border transition-all cursor-pointer ${
              isPlayingAudio
                ? 'bg-[#19382C] text-[#FAF9F6] border-[#2D4F43]'
                : 'bg-white/5 text-[#8A929D] border-white/10 hover:bg-white/10'
            }`}
            title="생전 육성 회고 음성 on/off"
          >
            {isPlayingAudio ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#C2A26A] animate-pulse" />
                <span className="hidden sm:inline">육성 음성 송출 중</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">음성 일시정지</span>
              </>
            )}
          </button>

          {/* 슬라이드쇼 재생/정지 */}
          <button
            onClick={() => setIsAutoPlay(!isAutoPlay)}
            className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-[0.8125rem] font-serif flex items-center space-x-1.5 border border-white/10 transition-colors cursor-pointer"
          >
            {isAutoPlay ? <Pause className="w-3.5 h-3.5 text-[#C2A26A]" /> : <Play className="w-3.5 h-3.5 text-[#C2A26A]" />}
            <span className="hidden sm:inline">{isAutoPlay ? '일시정지' : '자동재생'}</span>
          </button>

          {/* 양장본 책자 인쇄 바로가기 */}
          {onOpenBooklet && (
            <button
              onClick={onOpenBooklet}
              className="px-3 py-1.5 rounded bg-[#9E7D47]/20 hover:bg-[#9E7D47]/30 text-[0.8125rem] font-serif text-[#C2A26A] flex items-center space-x-1.5 border border-[#9E7D47]/40 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#C2A26A]" />
              <span className="hidden md:inline">A4 평전 인쇄</span>
            </button>
          )}

          {/* 전체화면 전환 */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors cursor-pointer"
            title="전체화면"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-[#C2A26A]" /> : <Maximize2 className="w-4 h-4 text-[#C2A26A]" />}
          </button>

          {/* 닫기 */}
          <button
            onClick={onClose}
            className="p-2 rounded bg-white/5 hover:bg-[#731C18]/40 text-[#8A929D] hover:text-white border border-white/10 transition-colors cursor-pointer"
            title="닫기 (ESC)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. 중앙 메인 뷰어 (좌: 고인 영정 & 의전 프로필 | 우: 생애 사진 84선 슬라이드쇼) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* 2-A. 좌측 패널: 고인 존영 및 장례 의전 제원 (폭: 420px 고정) */}
        <aside className="w-full lg:w-[420px] bg-[#0B0C0E] border-b lg:border-b-0 lg:border-r border-white/10 p-6 md:p-8 flex flex-col justify-between overflow-y-auto shrink-0 font-serif">
          <div className="space-y-6">
            {/* 고인 영정 사진 액자 */}
            <div className="relative mx-auto w-44 h-56 rounded-lg overflow-hidden border-2 border-[#C2A26A]/80 shadow-2xl bg-black group">
              <img
                src="/images/life-story-book.jpg"
                alt={setting.deceasedName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
              <div className="absolute bottom-2 left-2 right-2 text-center">
                <span className="text-[0.8125rem] tracking-widest text-[#C2A26A] bg-black/70 px-2 py-0.5 rounded border border-[#C2A26A]/40">
                  {setting.deceasedClan || '김해 김씨'}
                </span>
              </div>
            </div>

            {/* 고인 함자 및 생몰년 */}
            <div className="text-center space-y-2">
              <span className="text-[0.8125rem] text-[#8A929D] tracking-widest block font-serif">
                영원한 안식 · 지극한 정성으로 모십니다
              </span>
              <h1 className="text-2xl md:text-3xl font-reverence font-bold text-[#FAF9F6] tracking-tight">
                {setting.deceasedName}
              </h1>
              <p className="text-[0.8125rem] text-[#C2A26A] font-medium">
                {setting.birthDate} ~ {setting.deathDate} (향년 {setting.age || 88}세)
              </p>
              <div className="p-3 bg-white/5 rounded-lg border border-white/10 text-[1.125rem] italic text-[#8A929D] leading-relaxed">
                {setting.motto || story.epitaph}
              </div>
            </div>

            {/* 빈소 및 발인 상세 정보 */}
            <div className="bg-[#141618] rounded-xl p-4 border border-white/10 space-y-3 text-[0.8125rem]">
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-[#C2A26A] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#8A929D] block text-[0.8125rem]">빈소 위치</span>
                  <p className="text-[#FAF9F6] font-bold">{setting.funeralHallName} {setting.roomName}</p>
                  <p className="text-[0.8125rem] text-[#8A929D] mt-0.5">{setting.address}</p>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <Clock className="w-4 h-4 text-[#C2A26A] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#8A929D] block text-[0.8125rem]">발인 일시</span>
                  <p className="text-[#FAF9F6] font-bold">{setting.departureDateTime}</p>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <Sparkles className="w-4 h-4 text-[#C2A26A] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#8A929D] block text-[0.8125rem]">안식 장지</span>
                  <p className="text-[#FAF9F6] font-bold">{setting.crematoriumName}</p>
                </div>
              </div>
            </div>

            {/* 상주 및 유가족 */}
            <div className="p-3.5 bg-white/5 rounded-xl border border-white/10 space-y-1.5 text-[0.8125rem]">
              <span className="text-[#C2A26A] font-bold block text-[0.8125rem]">상주 및 유족 일동</span>
              <div className="flex flex-wrap gap-1.5 text-[#DCD6C9]">
                {setting.chiefMourners.map((m, idx) => (
                  <span key={idx} className="bg-white/5 px-2 py-0.5 rounded text-[0.8125rem] border border-white/10">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 좌측 하단 조문 계좌 */}
          <div className="pt-4 border-t border-white/10 text-center">
            <span className="text-[0.8125rem] text-[#8A929D] block">마음 전하실 곳 (비대면 조문)</span>
            <p className="text-[0.8125rem] text-[#FAF9F6] font-mono font-bold mt-0.5">{setting.condolenceAccount}</p>
          </div>
        </aside>

        {/* 2-B. 우측 패널: 생애 사진 84선 슬라이드쇼 & 연대기 회고 */}
        <main className="flex-1 flex flex-col justify-between p-6 md:p-10 relative overflow-hidden bg-radial from-[#141618] to-[#0B0C0E]">
          {/* 전통 구름문 은은한 배경 */}
          <div className="pointer-events-none absolute inset-0 k-pattern-unmun opacity-10" />

          {/* 중앙: 대형 사진 슬라이드 뷰 */}
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-auto max-h-[70vh]">
            <div className="relative max-w-4xl w-full h-full flex items-center justify-center">
              {/* 이전 사진 버튼 */}
              <button
                onClick={handlePrev}
                className="absolute left-2 md:left-4 z-20 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all cursor-pointer"
                title="이전 사진"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* 사진 렌더링 카드 */}
              <div className="relative max-h-full max-w-full rounded-2xl overflow-hidden shadow-2xl border-2 border-[#C2A26A]/40 bg-black flex items-center justify-center">
                <img
                  key={currentPhoto.id}
                  src={currentPhoto.imageUrl}
                  alt={currentPhoto.title}
                  className="max-h-[58vh] w-auto object-contain transition-opacity duration-700 ease-in-out"
                />

                {/* 사진 연도 및 장소 배지 */}
                <div className="absolute top-4 left-4 flex items-center space-x-2">
                  <span className="px-3 py-1 bg-black/75 text-[#C2A26A] text-[0.8125rem] font-mono font-bold rounded-md border border-[#C2A26A]/50">
                    {currentPhoto.year}년
                  </span>
                  <span className="px-3 py-1 bg-black/75 text-white/90 text-[0.8125rem] font-serif rounded-md border border-white/20">
                    {currentPhoto.category}
                  </span>
                </div>

                {/* 사진 번호 인덱스 */}
                <div className="absolute top-4 right-4 px-3 py-1 bg-black/75 text-[0.8125rem] text-[#8A929D] font-mono rounded-md border border-white/20">
                  {currentPhotoIdx + 1} / {lifePhotos.length}
                </div>

                {/* 하단 캡션 오버레이 */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 text-center space-y-1">
                  <h3 className="text-lg md:text-xl font-reverence font-bold text-[#FAF9F6]">
                    {currentPhoto.title}
                  </h3>
                  <p className="text-[0.8125rem] md:text-sm text-[#8A929D] font-serif max-w-2xl mx-auto">
                    {currentPhoto.caption}
                  </p>
                </div>
              </div>

              {/* 다음 사진 버튼 */}
              <button
                onClick={handleNext}
                className="absolute right-2 md:right-4 z-20 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all cursor-pointer"
                title="다음 사진"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* 하단: 실시간 썸네일 스트립 & 생전 육성 내레이션 바 */}
          <div className="relative z-10 space-y-4 pt-4 shrink-0">
            {/* 생전 육성 내레이션 바 */}
            <div className="bg-[#141618]/90 backdrop-blur-md rounded-xl p-3 px-5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[0.8125rem] font-serif">
              <div className="flex items-center space-x-3">
                <div className="w-7 h-7 rounded-full bg-[#19382C] text-[#C2A26A] flex items-center justify-center border border-[#2D4F43] shrink-0">
                  <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                </div>
                <div>
                  <span className="text-[#C2A26A] font-bold text-[0.8125rem] block">
                    생전 육성 회고 음성 송출 중 • {story.audioTribute.duration}
                  </span>
                  <p className="text-[#FAF9F6] text-[0.8125rem] font-medium">
                    “{story.audioTribute.transcript.slice(0, 52)}...”
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-[0.8125rem] text-[#8A929D] shrink-0">
                <span>자동 사진 전환: 4.5초 간격</span>
                <span>•</span>
                <span>전체 84장 수록</span>
              </div>
            </div>

            {/* 썸네일 캐러셀 */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-thin">
              {lifePhotos.map((photo, idx) => (
                <button
                  key={photo.id}
                  onClick={() => setCurrentPhotoIdx(idx)}
                  className={`w-16 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    currentPhotoIdx === idx
                      ? 'border-[#C2A26A] scale-105 shadow-lg'
                      : 'border-white/10 opacity-50 hover:opacity-90'
                  }`}
                >
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
