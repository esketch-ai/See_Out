import React, { useState } from 'react';
import {
  BookOpen,
  Award,
  Image,
  Mic,
  Archive,
  Shield,
  Lock,
  Sparkles,
  Phone,
  Users,
  Send,
  CheckCircle2,
  Play,
  Pause,
  Download,
  Share2,
  Printer,
  ChevronRight,
  Heart,
  Calendar,
  Compass,
  FileText,
  Key,
  X,
  Tv,
  RefreshCw
} from 'lucide-react';
import { TraditionalSeal } from '../design-system/index.js';
import {
  SAMPLE_LIFE_STORY,
  SAMPLE_CONTACT_GROUPS,
  SAMPLE_CONTACTS,
  SAMPLE_PRE_MORTEM_OBITUARY,
  SAMPLE_ENDING_NOTE,
  SAMPLE_GATEKEEPER,
  SAMPLE_LIFE_PHOTOS,
  DEFAULT_FUNERAL_SETTING,
  createObituaryFromSetting,
  FuneralSetting
} from '../../life-archive/index.js';
import { MemorialBookletModal } from './MemorialBookletModal.js';
import { AltarKioskModal } from './AltarKioskModal.js';
import { VoiceInterviewSection } from './VoiceInterviewSection.js';

interface LifeArchiveWidgetProps {
  funeralSetting?: FuneralSetting;
  onUpdateFuneralSetting?: (setting: FuneralSetting) => void;
  onNavigateTab?: (tab: string) => void;
}

export const LifeArchiveWidget: React.FC<LifeArchiveWidgetProps> = ({
  funeralSetting = DEFAULT_FUNERAL_SETTING,
  onUpdateFuneralSetting,
  onNavigateTab
}) => {
  // 메인 상단 탭: 'biography' | 'interview' | 'contacts' | 'ending_note' | 'gatekeeper'
  const [activeTab, setActiveTab] = useState<'biography' | 'interview' | 'contacts' | 'ending_note' | 'gatekeeper'>('biography');

  // 평전 챕터 선택 (1~4)
  const [activeChapter, setActiveChapter] = useState<number>(1);

  // 음성 플레이어 시뮬레이션 상태
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // 부고 발송 시뮬레이션 상태
  const [isBroadcasting, setIsBroadcasting] = useState<boolean>(false);
  const [broadcastSuccess, setBroadcastSuccess] = useState<boolean>(false);

  // 모달 상태 (생전 사진 갤러리, A4 양장본 평전 책자, 빈소 헌정 키오스크)
  const [showPhotoGalleryModal, setShowPhotoGalleryModal] = useState<boolean>(false);
  const [isBookletModalOpen, setIsBookletModalOpen] = useState<boolean>(false);
  const [isAltarKioskOpen, setIsAltarKioskOpen] = useState<boolean>(false);
  const [copiedAccount, setCopiedAccount] = useState<boolean>(false);

  // 연락처 그룹 필터
  const [selectedGroup, setSelectedGroup] = useState<string>('all');

  const story = SAMPLE_LIFE_STORY;
  const currentChapter = story.chapters.find((c) => c.chapterNumber === activeChapter) || story.chapters[0];
  const activeObituary = createObituaryFromSetting(funeralSetting, SAMPLE_PRE_MORTEM_OBITUARY);

  const handleSimulateBroadcast = () => {
    setIsBroadcasting(true);
    setTimeout(() => {
      setIsBroadcasting(false);
      setBroadcastSuccess(true);
      setTimeout(() => setBroadcastSuccess(false), 5000);
    }, 1200);
  };

  const filteredContacts = selectedGroup === 'all'
    ? SAMPLE_CONTACTS
    : SAMPLE_CONTACTS.filter((c) => c.group === selectedGroup);

  return (
    <div className="bg-[#FFFFFF] rounded-xl shadow-xs border border-[#E3DFD5] p-5 md:p-8 space-y-7">
      {/* 1. 상단 실제 훈장 및 가족 사진 비주얼 헤더 배너 */}
      <div className="relative rounded-lg overflow-hidden h-48 sm:h-56 border border-[#2D2A26] bg-[#121417]">
        <img
          src="/images/life-archive.jpg"
          alt="훈장과 흑백 가족 사진, 소중한 회고록"
          className="w-full h-full object-cover object-center filter brightness-[0.38] contrast-105"
        />
        {/* 삼국·조선 길상 구름문 은은한 오버레이 */}
        <div className="absolute inset-0 pointer-events-none k-pattern-unmun-dark opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0E10] via-[#0D0E10]/50 to-transparent flex flex-col justify-end p-6 md:p-8 relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded bg-[#19382C]/90 text-[#FAF9F6] text-xs font-serif border border-[#2A5442]">
              <TraditionalSeal sealKey="eternity" size="sm" />
              <span>배웅 핵심 주력 서비스</span>
            </div>
            <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded bg-[#9E7D47]/20 text-[#E8C88B] text-xs font-serif border border-[#9E7D47]/40">
              <Shield className="w-3.5 h-3.5 text-[#E8C88B]" />
              <span>평시 사전 준비 (Pre-Mortem) ➔ 사후 안전 승계</span>
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-reverence font-black text-[#FAF9F6] tracking-tight">
            배웅 스마트 생애기록관 & 디지털 평전
          </h2>
          <p className="text-[#D4CEC2] text-xs sm:text-sm font-serif mt-1 max-w-2xl leading-relaxed">
            건강하실 때 스마트폰 연락처와 사진, 생전 육성을 정갈하게 남겨두고, 사후에는 가족에게 안전하게 전해져 존엄한 부고 알림과 영원한 생애 평전(評傳)으로 헌정됩니다.
          </p>

          {/* 상단 퀵 액션: A4 책자 인쇄 & 빈소 키오스크 송출 */}
          <div className="flex flex-wrap items-center gap-2.5 mt-3 pt-3 border-t border-white/10 text-xs font-serif">
            <button
              onClick={() => setIsBookletModalOpen(true)}
              className="px-3.5 py-1.5 bg-[#19382C] text-[#FAF9F6] rounded-md font-bold hover:bg-[#224A3B] transition-all flex items-center space-x-1.5 cursor-pointer border border-[#2D5A46] shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-[#C2A26A]" />
              <span>A4 양장본 평전 인쇄 / PDF 저장</span>
            </button>
            <button
              onClick={() => setIsAltarKioskOpen(true)}
              className="px-3.5 py-1.5 bg-black/60 hover:bg-black/90 text-[#E8C88B] rounded-md font-bold transition-all flex items-center space-x-1.5 cursor-pointer border border-[#C2A26A]/40 shadow-xs"
            >
              <Tv className="w-3.5 h-3.5 text-[#C2A26A]" />
              <span>빈소 헌정 키오스크 송출 (Altar TV)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. 5대 메인 내비게이션 탭 바 */}
      <div className="flex bg-[#F0EDE6] p-1.5 rounded-xl border border-[#E3DFD5] text-xs md:text-sm font-serif overflow-x-auto">
        <button
          onClick={() => setActiveTab('biography')}
          className={`flex-1 min-w-[140px] py-3 px-2 rounded-lg text-center font-bold transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
            activeTab === 'biography'
              ? 'bg-[#19382C] text-[#FAF9F6] shadow-xs'
              : 'text-[#5C6166] hover:text-[#151719]'
          }`}
        >
          <BookOpen className="w-4 h-4 text-[#C2A26A]" />
          <span>생애 평전 스토리북</span>
        </button>

        <button
          onClick={() => setActiveTab('interview')}
          className={`flex-1 min-w-[140px] py-3 px-2 rounded-lg text-center font-bold transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
            activeTab === 'interview'
              ? 'bg-[#19382C] text-[#FAF9F6] shadow-xs'
              : 'text-[#5C6166] hover:text-[#151719]'
          }`}
        >
          <Mic className="w-4 h-4 text-[#C2A26A]" />
          <span>AI 생애 구술 인터뷰어</span>
        </button>

        <button
          onClick={() => setActiveTab('contacts')}
          className={`flex-1 min-w-[140px] py-3 px-2 rounded-lg text-center font-bold transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
            activeTab === 'contacts'
              ? 'bg-[#19382C] text-[#FAF9F6] shadow-xs'
              : 'text-[#5C6166] hover:text-[#151719]'
          }`}
        >
          <Phone className="w-4 h-4 text-[#C2A26A]" />
          <span>스마트폰 연락처 & 부고</span>
        </button>

        <button
          onClick={() => setActiveTab('ending_note')}
          className={`flex-1 min-w-[140px] py-3 px-2 rounded-lg text-center font-bold transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
            activeTab === 'ending_note'
              ? 'bg-[#19382C] text-[#FAF9F6] shadow-xs'
              : 'text-[#5C6166] hover:text-[#151719]'
          }`}
        >
          <FileText className="w-4 h-4 text-[#C2A26A]" />
          <span>사전 엔딩노트</span>
        </button>

        <button
          onClick={() => setActiveTab('gatekeeper')}
          className={`flex-1 min-w-[140px] py-3 px-2 rounded-lg text-center font-bold transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
            activeTab === 'gatekeeper'
              ? 'bg-[#19382C] text-[#FAF9F6] shadow-xs'
              : 'text-[#5C6166] hover:text-[#151719]'
          }`}
        >
          <Lock className="w-4 h-4 text-[#C2A26A]" />
          <span>사후 승계 게이트키퍼</span>
        </button>
      </div>

      {/* ───────────────────────────────────────────────────────────────────────────────── */}
      {/* [탭 1] 생애 평전 스토리북 & 헌정관 (Biographical Storybook) */}
      {/* ───────────────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'biography' && (
        <div className="space-y-6">
          {/* 상단: 실물 양장본 책자 & 디지털 태블릿 평전 비주얼 카드 */}
          <div className="rounded-xl border border-[#E3DFD5] overflow-hidden bg-[#FAF8F5] grid grid-cols-1 md:grid-cols-12 shadow-xs">
            <div className="md:col-span-6 relative bg-[#121417] min-h-[300px] md:min-h-[360px] overflow-hidden">
              <img
                src="/images/life-story-book.jpg"
                alt="고급 한지 양장본 생애 평전과 태블릿 회고록"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute top-3 left-3 bg-[#19382C]/90 text-white text-[11px] font-serif font-bold px-2.5 py-1 rounded shadow-xs border border-[#2A5442] flex items-center space-x-1">
                <Award className="w-3.5 h-3.5 text-[#C2A26A]" />
                <span>유가족 헌정용 실물 양장본 & 모바일 평전 완간</span>
              </div>
            </div>

            <div className="md:col-span-6 p-5 md:p-6 flex flex-col justify-between space-y-4 font-serif">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-bold text-[#876937] bg-[#F8F5EE] px-2 py-0.5 rounded border border-[#E8DFCF]">
                    {story.deceasedName} (1938~2026)
                  </span>
                  <span className="text-xs text-[#727782]">세례명: 베드로</span>
                </div>

                <h3 className="font-reverence font-bold text-xl md:text-2xl text-[#151719] mt-2">
                  {story.memorialTitle}
                </h3>

                <blockquote className="my-2.5 pl-3 border-l-2 border-[#9E7D47] text-xs font-serif italic text-[#876937]">
                  {story.epitaph}
                </blockquote>

                <p className="text-xs text-[#5C6166] leading-relaxed">
                  {story.overallSummary}
                </p>
              </div>

              {/* 유가족 헌정사 */}
              <div className="bg-[#FFFFFF] border border-[#E3DFD5] rounded-lg p-3.5 space-y-1.5 text-xs">
                <div className="flex items-center space-x-1 font-bold text-[#19382C]">
                  <Heart className="w-3.5 h-3.5 text-[#8B2520] fill-[#8B2520]" />
                  <span>유가족 헌정사</span>
                </div>
                <p className="text-[#5C6166] italic leading-relaxed">
                  {story.familyDedication}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-1 text-xs">
                <button
                  onClick={() => setIsBookletModalOpen(true)}
                  className="px-3.5 py-2 bg-[#19382C] text-white rounded-md font-bold hover:bg-[#224A3B] transition-colors cursor-pointer flex items-center space-x-1.5 shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5 text-[#C2A26A]" />
                  <span>실물 양장본 평전 신청 (A4 인쇄 / PDF)</span>
                </button>
                <button
                  onClick={() => setIsBookletModalOpen(true)}
                  className="px-3.5 py-2 bg-[#FFFFFF] border border-[#E3DFD5] text-[#42464E] rounded-md font-bold hover:bg-[#FAF9F6] transition-colors cursor-pointer flex items-center space-x-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-[#727782]" />
                  <span>PDF 전자책 다운로드</span>
                </button>
                <button
                  onClick={() => setIsAltarKioskOpen(true)}
                  className="px-3.5 py-2 bg-[#121417] text-[#FAF9F6] border border-white/20 rounded-md font-bold hover:bg-[#1D2126] transition-colors cursor-pointer flex items-center space-x-1.5 shadow-xs"
                >
                  <Tv className="w-3.5 h-3.5 text-[#C2A26A]" />
                  <span>빈소 헌정 키오스크 (Altar TV)</span>
                </button>
              </div>
            </div>
          </div>

          {/* 중단: 4대 챕터 연대기 인터랙티브 리더 */}
          <div className="bg-[#FAF9F6] border border-[#E3DFD5] rounded-xl p-5 md:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#ECE8E0] pb-3">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-[#9E7D47]" />
                <h4 className="font-serif font-bold text-sm md:text-base text-[#151719]">
                  연대기별 생애 스토리 (전체 4장)
                </h4>
              </div>
              <span className="text-xs text-[#727782] font-serif">
                챕터를 클릭하시면 해당 시기의 발자취와 주요 업적을 읽으실 수 있습니다
              </span>
            </div>

            {/* 챕터 셀렉터 탭 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-serif">
              {story.chapters.map((ch) => (
                <button
                  key={ch.chapterNumber}
                  onClick={() => setActiveChapter(ch.chapterNumber)}
                  className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                    activeChapter === ch.chapterNumber
                      ? 'border-2 border-[#19382C] bg-[#FFFFFF] shadow-2xs font-bold text-[#19382C]'
                      : 'border-[#E3DFD5] bg-[#FAF8F5] text-[#5C6166] hover:bg-[#FFFFFF]'
                  }`}
                >
                  <div className="text-[10px] text-[#876937] font-normal">{ch.period}</div>
                  <div className="font-serif font-bold text-xs truncate mt-0.5">
                    제{ch.chapterNumber}장. {ch.title.split('—')[0].replace(`제${ch.chapterNumber}장: `, '')}
                  </div>
                </button>
              ))}
            </div>

            {/* 선택된 챕터 본문 뷰어 */}
            <div className="bg-[#FFFFFF] border border-[#E3DFD5] rounded-xl p-5 md:p-6 space-y-4 font-serif">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-[#ECE8E0] pb-2.5">
                <h4 className="font-reverence font-bold text-base md:text-lg text-[#151719]">
                  {currentChapter.title}
                </h4>
                <span className="text-xs text-[#876937] font-bold">
                  {currentChapter.period}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#42464E] leading-loose whitespace-pre-line">
                {currentChapter.storyContent}
              </p>

              {/* 주요 업적 및 훈장 기록 */}
              <div className="bg-[#FAF8F5] border border-[#E3DFD5] rounded-lg p-4 space-y-2">
                <span className="text-xs font-bold text-[#151719] flex items-center space-x-1.5">
                  <Award className="w-4 h-4 text-[#9E7D47]" />
                  <span>이 시기의 주요 생애 업적 및 공적 기록</span>
                </span>
                <ul className="text-xs text-[#5C6166] space-y-1 pl-1">
                  {currentChapter.keyAchievements.map((ach, idx) => (
                    <li key={idx} className="flex items-start space-x-1.5">
                      <span className="text-[#9E7D47] font-bold">•</span>
                      <span>{ach}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 챕터 대표 사진 기록 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {currentChapter.featuredPhotos.map((photo, idx) => (
                  <div key={idx} className="p-3 bg-[#FAF9F6] border border-[#ECE8E0] rounded-lg text-xs space-y-1">
                    <div className="flex justify-between items-center text-[11px] font-bold text-[#151719]">
                      <span>📷 {photo.title}</span>
                      <span className="text-[#876937]">{photo.year}</span>
                    </div>
                    <p className="text-[#727782] text-[11px]">{photo.caption}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 하단: 고인 생전 육성 내레이션 플레이어 */}
          <div className="bg-[#121417] text-[#FAF9F6] rounded-xl p-5 md:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <Mic className="w-5 h-5 text-[#C2A26A]" />
                <h4 className="font-serif font-bold text-sm md:text-base text-[#FAF9F6]">
                  {story.audioTribute.title}
                </h4>
              </div>
              <div className="text-xs text-[#D8CEBA] font-serif">
                녹음 일시: {story.audioTribute.recordedAt} ({story.audioTribute.duration})
              </div>
            </div>

            {/* 오디오 컨트롤러 */}
            <div className="bg-[#1D2126] rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-white/5">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className="w-10 h-10 rounded-full bg-[#19382C] hover:bg-[#224A3B] text-white flex items-center justify-center shrink-0 transition-transform active:scale-95 cursor-pointer border border-[#2D5A46]"
                >
                  {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5 text-[#C2A26A]" />}
                </button>
                <div>
                  <div className="font-serif font-bold text-xs text-[#FAF9F6]">
                    {isPlayingAudio ? '고인의 육성을 재생 중입니다...' : '고인의 생전 음성 듣기'}
                  </div>
                  <div className="text-[11px] text-[#A69E8F] font-serif">
                    부모님의 따뜻한 목소리와 숨결을 그대로 보존하였습니다
                  </div>
                </div>
              </div>

              {/* 재생 파형 애니메이션 시뮬레이션 */}
              <div className="flex items-center space-x-1 h-6">
                {[12, 24, 16, 28, 8, 20, 14, 26, 18, 10, 22, 16].map((h, i) => (
                  <span
                    key={i}
                    style={{ height: isPlayingAudio ? `${h}px` : '4px' }}
                    className={`w-1 rounded-full transition-all duration-300 ${
                      isPlayingAudio ? 'bg-[#C2A26A] animate-pulse' : 'bg-[#5C6166]'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* 녹음 전문(Transcript) */}
            <div className="bg-[#181B1F] rounded-lg p-4 border border-white/5 text-xs text-[#D4CEC2] leading-relaxed font-serif">
              <span className="text-[#C2A26A] font-bold block mb-1">육성 전문 (Transcript):</span>
              <p className="italic">{story.audioTribute.transcript}</p>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────────────────── */}
      {/* [탭 2] AI 생애 구술 인터뷰어 (Voice-to-Biography) */}
      {/* ───────────────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'interview' && (
        <VoiceInterviewSection
          onOpenBooklet={() => setIsBookletModalOpen(true)}
        />
      )}

      {/* ───────────────────────────────────────────────────────────────────────────────── */}
      {/* [탭 3] 스마트폰 연락처 & 부고 사전발송 엔진 (Contacts & Obituary) */}
      {/* ───────────────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'contacts' && (
        <div className="space-y-6 font-serif">
          {/* 상단: 스마트폰 연락처 사전 동기화 통계 */}
          <div className="bg-[#FAF8F5] border border-[#E3DFD5] rounded-xl p-5 md:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#ECE8E0] pb-3">
              <div>
                <h3 className="font-serif font-bold text-base md:text-lg text-[#151719] flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-[#9E7D47]" />
                  <span>스마트폰 주소록 사전 동기화 현황 (총 640명 정리 완료)</span>
                </h3>
                <p className="text-xs text-[#727782] mt-0.5">
                  부모님의 스마트폰 연락처를 4대 그룹으로 안전하게 백업하여, 사후에 비밀번호를 몰라도 가족들이 즉시 부고를 전할 수 있습니다.
                </p>
              </div>
              <span className="text-[11px] text-[#19382C] font-bold bg-[#F0F5F2] px-2.5 py-1 rounded border border-[#BFD4CA]">
                동기화 완료: 2026. 03. 15
              </span>
            </div>

            {/* 4대 그룹 통계 카드 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              {SAMPLE_CONTACT_GROUPS.map((grp) => (
                <div
                  key={grp.group}
                  onClick={() => setSelectedGroup(grp.group)}
                  className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                    selectedGroup === grp.group
                      ? 'border-[#19382C] bg-[#FFFFFF] shadow-2xs ring-1 ring-[#19382C]/10'
                      : 'border-[#E3DFD5] bg-[#FFFFFF] hover:border-[#9E7D47]'
                  }`}
                >
                  <div className="text-[11px] text-[#727782] font-medium">{grp.name}</div>
                  <div className="text-xl font-bold font-reverence text-[#19382C] mt-1">
                    {grp.count}<span className="text-xs font-normal text-[#5C6166] ml-0.5">명</span>
                  </div>
                  <p className="text-[10px] text-[#727782] mt-1 line-clamp-1">{grp.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 중단: 고인 사전 작성 모바일 부고장 & 원터치 발송 시뮬레이터 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* 좌측 (7/12): 부고장 미리보기 */}
            <div className="lg:col-span-7 bg-[#FAF9F6] border border-[#E3DFD5] rounded-xl p-5 md:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#ECE8E0] pb-3">
                <span className="font-bold text-sm text-[#151719] flex items-center space-x-1.5">
                  <FileText className="w-4 h-4 text-[#9E7D47]" />
                  <span>사전 설정된 모바일 부고장 미리보기</span>
                </span>
                <span className="text-[11px] text-[#876937] font-bold bg-[#F8F5EE] px-2 py-0.5 rounded border border-[#E8DFCF]">
                  고인 생전 친필 인사말 포함
                </span>
              </div>

              {/* 3대 모듈 실시간 동기화 상태 배너 */}
              <div className="bg-[#132B22] text-[#FAF9F6] rounded-lg p-3 px-4 border border-[#2D5A46] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  <div>
                    <span className="font-bold text-[#E8C88B] block">전국 장례식장 & 정찰 패키지 1초 실시간 연계 중</span>
                    <span className="text-[11px] text-[#D4CEC2]">
                      {funeralSetting.funeralHallName} ({funeralSetting.roomName}) • {funeralSetting.packageName} ({funeralSetting.packagePrice.toLocaleString()}원)
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsAltarKioskOpen(true)}
                  className="px-2.5 py-1 bg-[#0E1E18] hover:bg-[#152E24] text-[#C2A26A] text-[11px] font-bold rounded border border-[#2D5A46] flex items-center space-x-1 transition-colors cursor-pointer shrink-0"
                >
                  <Tv className="w-3 h-3 text-[#C2A26A]" />
                  <span>빈소 키오스크 송출</span>
                </button>
              </div>

              {/* 스마트폰 부고장 프레임 */}
              <div className="bg-[#FFFFFF] border-2 border-[#121417]/10 rounded-xl p-5 space-y-4 shadow-sm max-w-lg mx-auto">
                <div className="text-center pb-3 border-b border-[#ECE8E0]">
                  <div className="text-xs font-bold text-[#8B2520] tracking-widest">부 고 (訃告)</div>
                  <h4 className="font-reverence font-bold text-base md:text-lg text-[#151719] mt-1">
                    {activeObituary.title}
                  </h4>
                </div>

                {/* 고인의 생전 온화한 인물 사진 프로필 배너 */}
                <div className="flex items-center space-x-3.5 p-3 rounded-lg bg-[#FAF8F5] border border-[#ECE8E0]">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#9E7D47] shrink-0 bg-[#121417] shadow-xs">
                    <img
                      src="/images/life-story-book.jpg"
                      alt="故 김철수 님 생전 인물 사진"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div>
                    <div className="text-xs font-serif font-bold text-[#151719] flex items-center space-x-1.5">
                      <span>{funeralSetting.deceasedName} ({funeralSetting.birthDate?.slice(0, 4)} ~ 2026)</span>
                      <span className="text-[10px] text-[#876937] bg-[#F8F5EE] px-1.5 py-0.2 rounded border border-[#E8DFCF]">
                        향년 {funeralSetting.age || 88}세
                      </span>
                    </div>
                    <p className="text-[11px] text-[#727782] font-serif mt-0.5">
                      {funeralSetting.motto || '“성실함에는 거짓이 없으며, 가족을 향한 사랑은 마르지 않는다.”'}
                    </p>
                  </div>
                </div>

                <div className="text-xs text-[#42464E] leading-relaxed">
                  {activeObituary.preamble}
                </div>

                {/* 고인 생전 작별인사 하이라이트 박스 */}
                <div className="bg-[#FAF6EE] border border-[#E8DFCF] rounded-lg p-3 text-xs text-[#876937] leading-relaxed">
                  <span className="font-bold block mb-1">고인께서 생전에 남기신 말씀:</span>
                  <p className="italic">{activeObituary.personalFarewell}</p>
                </div>

                {/* ★ [유저 핵심 요청] 생전 사진 및 추모 갤러리 바로가기 링크 버튼 ★ */}
                <div className="space-y-2 pt-1">
                  <button
                    onClick={() => setShowPhotoGalleryModal(true)}
                    className="w-full py-3 px-3.5 bg-[#FAF8F5] hover:bg-[#F2ECE0] border border-[#D9D3C7] hover:border-[#9E7D47] rounded-lg text-xs font-serif font-bold text-[#151719] flex items-center justify-between transition-all cursor-pointer shadow-2xs group"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#19382C] text-[#C2A26A] flex items-center justify-center shrink-0">
                        <Image className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-left">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-bold text-[#19382C]">{funeralSetting.deceasedName} 생전 사진 및 추모 갤러리</span>
                          <span className="text-[10px] bg-[#19382C] text-white px-1.5 py-0.2 rounded font-mono">
                            {activeObituary.lifePhotoCount || 84}장
                          </span>
                        </div>
                        <div className="text-[10px] text-[#727782] font-normal">
                          청년 시절부터 가족과 함께한 소중한 생전 모습을 확인하세요
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#9E7D47] group-hover:translate-x-1 transition-transform shrink-0" />
                  </button>

                  <button
                    onClick={() => setActiveTab('biography')}
                    className="w-full py-2.5 px-3.5 bg-[#F0F5F2] hover:bg-[#E2EDE7] border border-[#BFD4CA] rounded-lg text-xs font-serif font-bold text-[#19382C] flex items-center justify-between transition-all cursor-pointer group"
                  >
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-3.5 h-3.5 text-[#19382C]" />
                      <span>고인의 일생 히스토리 및 생애 평전 스토리북 읽기</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#19382C] group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={() => setIsAltarKioskOpen(true)}
                    className="w-full py-2.5 px-3.5 bg-[#121417] hover:bg-[#1D2126] text-[#FAF9F6] border border-white/20 rounded-lg text-xs font-serif font-bold flex items-center justify-between transition-all cursor-pointer group"
                  >
                    <div className="flex items-center space-x-2">
                      <Tv className="w-3.5 h-3.5 text-[#C2A26A]" />
                      <span>빈소 전용 디지털 헌정 모니터 뷰어 (Altar TV)</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#C2A26A] group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* 빈소 및 계좌 정보 (실시간 동기화 값) */}
                <div className="text-xs space-y-1.5 pt-2 border-t border-[#ECE8E0]">
                  <div className="flex justify-between">
                    <span className="text-[#727782]">빈소 안내:</span>
                    <span className="font-bold text-[#151719]">{activeObituary.funeralHallLinkedName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#727782]">장지(승화원):</span>
                    <span className="font-bold text-[#151719]">{activeObituary.crematoriumName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#727782]">마음 전하실 곳:</span>
                    <div className="flex items-center space-x-1.5">
                      <span className="font-bold text-[#19382C]">{activeObituary.accountForCondolence}</span>
                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText(activeObituary.accountForCondolence || '');
                          setCopiedAccount(true);
                          setTimeout(() => setCopiedAccount(false), 2000);
                        }}
                        className="text-[10px] px-1.5 py-0.5 rounded border border-[#E3DFD5] bg-[#FAF9F6] text-[#5C6166] hover:text-[#151719] cursor-pointer"
                      >
                        {copiedAccount ? '복사됨' : '복사'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 우측 (5/12): 사후 승계 원터치 발송 테스트 */}
            <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#E3DFD5] rounded-xl p-5 md:p-6 space-y-4">
              <div className="border-b border-[#ECE8E0] pb-3">
                <h4 className="font-bold text-sm text-[#151719] flex items-center space-x-1.5">
                  <Send className="w-4 h-4 text-[#19382C]" />
                  <span>사후 원터치 부고 대량 발송</span>
                </h4>
                <p className="text-xs text-[#727782] mt-0.5">
                  임종 발생 시 상주(유산관리자)의 승인으로 사전 동기화된 640명 지인에게 카카오 알림톡/문자가 동시 발송됩니다.
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-2 border-b border-[#ECE8E0]">
                  <span className="text-[#727782]">발송 예정 인원:</span>
                  <span className="font-bold text-[#151719]">총 640명 (연락처 전원)</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#ECE8E0]">
                  <span className="text-[#727782]">발송 채널:</span>
                  <span className="font-bold text-[#151719]">카카오 알림톡 + 비상 SMS</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#ECE8E0]">
                  <span className="text-[#727782]">발송 비용:</span>
                  <span className="font-bold text-[#19382C]">무제한 무료 지원 (배웅 특전)</span>
                </div>
              </div>

              {/* 발송 성공 알림 */}
              {broadcastSuccess && (
                <div className="p-3 bg-[#F0F5F2] border border-[#BFD4CA] rounded-lg text-xs text-[#19382C] font-bold flex items-center space-x-1.5 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-[#19382C]" />
                  <span>640명 전원에게 맞춤 모바일 부고장이 성공적으로 발송되었습니다.</span>
                </div>
              )}

              <button
                onClick={handleSimulateBroadcast}
                disabled={isBroadcasting}
                className="w-full py-3.5 bg-[#19382C] hover:bg-[#224A3B] disabled:opacity-50 text-white rounded-lg font-bold text-xs md:text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-xs"
              >
                <Send className="w-4 h-4 text-[#C2A26A]" />
                <span>{isBroadcasting ? '640명에게 부고장 전송 중...' : '사후 원터치 부고 발송 모의 체험'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────────────────── */}
      {/* [탭 3] 나의 엔딩노트 (사전 장례의향서) */}
      {/* ───────────────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'ending_note' && (
        <div className="space-y-6 font-serif">
          <div className="bg-[#FAF8F5] border border-[#E3DFD5] rounded-xl p-5 md:p-6 space-y-4">
            <div className="border-b border-[#ECE8E0] pb-3">
              <h3 className="font-serif font-bold text-base md:text-lg text-[#151719] flex items-center space-x-2">
                <FileText className="w-4 h-4 text-[#9E7D47]" />
                <span>故 김철수 님의 사전 장례 의향서 (Dignified Ending Note)</span>
              </h3>
              <p className="text-xs text-[#727782] mt-0.5">
                “내가 세상을 떠날 때, 자식들이 당황하거나 다투지 않도록 나의 마지막 바람을 미리 적어둡니다.”
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-4 bg-[#FFFFFF] border border-[#E3DFD5] rounded-lg space-y-1">
                <span className="text-[#876937] font-bold">희망 장례 형태</span>
                <p className="text-base font-bold text-[#151719]">{SAMPLE_ENDING_NOTE.preferredFuneralType}</p>
                <p className="text-[11px] text-[#727782]">불필요한 허례허식을 줄인 실속 가족장</p>
              </div>

              <div className="p-4 bg-[#FFFFFF] border border-[#E3DFD5] rounded-lg space-y-1">
                <span className="text-[#876937] font-bold">희망 종교 의식</span>
                <p className="text-base font-bold text-[#151719]">{SAMPLE_ENDING_NOTE.preferredReligion}</p>
                <p className="text-[11px] text-[#727782]">천주교 연령회 기도 및 성체 조문</p>
              </div>

              <div className="p-4 bg-[#FFFFFF] border border-[#E3DFD5] rounded-lg space-y-1">
                <span className="text-[#876937] font-bold">희망 안식 장지</span>
                <p className="text-base font-bold text-[#151719]">{SAMPLE_ENDING_NOTE.preferredRestingPlace}</p>
                <p className="text-[11px] text-[#727782]">자연으로 돌아가는 친환경 수목장</p>
              </div>
            </div>

            {/* 특별 당부 사항 */}
            <div className="bg-[#FFFFFF] border border-[#E3DFD5] rounded-lg p-4 space-y-2 text-xs">
              <span className="font-bold text-[#151719] block">가족들에게 남기는 3대 특별 당부:</span>
              <ul className="space-y-1.5 text-[#5C6166]">
                {SAMPLE_ENDING_NOTE.specialWishes.map((w, idx) => (
                  <li key={idx} className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#19382C] shrink-0" />
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────────────────── */}
      {/* [탭 4] 사후 승계 게이트키퍼(Gatekeeper) 보안 */}
      {/* ───────────────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'gatekeeper' && (
        <div className="space-y-6 font-serif">
          <div className="bg-[#132B22] text-[#FAF9F6] rounded-xl p-5 md:p-6 space-y-4 border border-[#2D5A46] relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 k-pattern-geummun opacity-25" />
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2.5">
                <Lock className="w-5 h-5 text-[#C2A26A]" />
                <h3 className="font-serif font-bold text-base md:text-lg text-[#FAF9F6]">
                  2단계 게이트키퍼(Gatekeeper) 사후 승계 보안 현황
                </h3>
              </div>
              <span className="text-xs text-[#C2A26A] font-bold bg-[#0E1E18] px-2.5 py-1 rounded border border-[#2A5442]">
                생전 암호화 잠금 중 (E2EE 1등급)
              </span>
            </div>

            <p className="relative z-10 text-xs text-[#D4CEC2] leading-relaxed">
              생전에는 본인 외에 가족이라도 절대 열람할 수 없도록 철저히 암호화되어 보관됩니다. 임종 발생 시 지정된 1차·2차 대리인이 사망진단서 또는 상호 승인을 진행해야만 보안이 해제됩니다.
            </p>

            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-[#0E1E18] p-3.5 rounded-lg border border-[#2A5442] space-y-1">
                <span className="text-[#C2A26A] font-bold">1차 지정 대리인 (상주)</span>
                <p className="text-[#FAF9F6] font-bold text-sm">
                  {SAMPLE_GATEKEEPER.primaryDelegate.name} ({SAMPLE_GATEKEEPER.primaryDelegate.relationship})
                </p>
                <p className="text-[11px] text-[#A69E8F]">{SAMPLE_GATEKEEPER.primaryDelegate.phone} • 본인 동의 완료</p>
              </div>

              <div className="bg-[#0E1E18] p-3.5 rounded-lg border border-[#2A5442] space-y-1">
                <span className="text-[#C2A26A] font-bold">2차 지정 대리인</span>
                <p className="text-[#FAF9F6] font-bold text-sm">
                  {SAMPLE_GATEKEEPER.secondaryDelegate.name} ({SAMPLE_GATEKEEPER.secondaryDelegate.relationship})
                </p>
                <p className="text-[11px] text-[#A69E8F]">{SAMPLE_GATEKEEPER.secondaryDelegate.phone} • 본인 동의 완료</p>
              </div>
            </div>

            <div className="relative z-10 bg-[#0E1E18] p-3.5 rounded-lg border border-[#2A5442] text-xs text-[#D4CEC2] space-y-1">
              <span className="font-bold text-[#C2A26A] block mb-1">봉인 해제 필수 조건:</span>
              {SAMPLE_GATEKEEPER.unlockConditions.map((cond, idx) => (
                <div key={idx} className="flex items-start space-x-1.5">
                  <span className="text-[#C2A26A] font-bold">•</span>
                  <span>{cond}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────────────────── */}
      {/* [고인 생전 사진 및 추모 갤러리 팝업 모달] (부고장 링크 클릭 시 열림) */}
      {/* ───────────────────────────────────────────────────────────────────────────────── */}
      {showPhotoGalleryModal && (
        <div className="fixed inset-0 z-50 bg-[#0D0E10]/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-[#E3DFD5] flex flex-col max-h-[92vh]">
            {/* 모달 헤더 */}
            <div className="bg-[#121417] text-[#FAF9F6] p-4 px-5 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-full bg-[#19382C] text-[#C2A26A] flex items-center justify-center">
                  <Image className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-serif font-bold text-sm md:text-base text-[#FAF9F6] flex items-center space-x-2">
                    <span>故 김철수 님의 생전 사진 및 추모 갤러리</span>
                    <span className="text-[10px] bg-[#19382C] text-[#C2A26A] px-2 py-0.5 rounded border border-[#2A5442] font-mono">
                      총 {SAMPLE_PRE_MORTEM_OBITUARY.lifePhotoCount || 84}장
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowPhotoGalleryModal(false)}
                className="p-1.5 hover:bg-white/10 rounded-full text-[#D4CEC2] hover:text-white transition-colors cursor-pointer"
                title="닫기"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 모달 본문 */}
            <div className="overflow-y-auto p-5 md:p-6 space-y-5 font-serif">
              {/* 상단 따뜻한 회고 배너 */}
              <div className="bg-[#FAF8F5] border border-[#ECE8E0] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-bold text-[#151719] flex items-center space-x-1.5">
                    <Heart className="w-3.5 h-3.5 text-[#8B2520] fill-[#8B2520]" />
                    <span>“저와 함께 웃고 울었던 소중한 인연들을 기억하며 감사드립니다.”</span>
                  </div>
                  <p className="text-[#727782] text-[11px] mt-0.5">
                    고인이 생전에 직접 모아둔 소중한 삶의 기록입니다. 사진을 누르시면 큰 화면으로 감상하실 수 있습니다.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowPhotoGalleryModal(false);
                    setActiveTab('biography');
                  }}
                  className="px-3.5 py-2 bg-[#19382C] text-white rounded font-bold text-xs shrink-0 cursor-pointer flex items-center space-x-1.5 hover:bg-[#224A3B] transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#C2A26A]" />
                  <span>생애 평전 스토리북 읽기</span>
                </button>
              </div>

              {/* 6대 대표 생전 사진 그리드 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {SAMPLE_LIFE_PHOTOS.map((photo) => (
                  <div
                    key={photo.id}
                    className="group rounded-xl border border-[#E3DFD5] overflow-hidden bg-[#FAF9F6] hover:border-[#9E7D47] transition-all flex flex-col justify-between shadow-2xs"
                  >
                    <div className="relative h-44 overflow-hidden bg-[#121417]">
                      <img
                        src={photo.imageUrl}
                        alt={photo.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 left-2 bg-[#121417]/85 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                        {photo.year}
                      </div>
                      <div className="absolute top-2 right-2 bg-[#19382C]/90 text-[#FAF9F6] text-[10px] px-2 py-0.5 rounded font-bold">
                        {photo.category}
                      </div>
                    </div>

                    <div className="p-3.5 space-y-1">
                      <h5 className="font-serif font-bold text-xs text-[#151719] line-clamp-1">
                        {photo.title}
                      </h5>
                      <p className="text-[11px] text-[#5C6166] leading-relaxed line-clamp-2">
                        {photo.caption}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 모달 푸터 */}
            <div className="bg-[#FAF9F6] border-t border-[#E3DFD5] p-3.5 px-5 flex items-center justify-between text-xs font-serif">
              <span className="text-[#727782]">
                ※ 유가족과 조문객 누구나 모바일 부고장 링크를 통해 평생 열람 및 추모가 가능합니다.
              </span>
              <button
                onClick={() => setShowPhotoGalleryModal(false)}
                className="px-4 py-2 bg-[#19382C] text-white rounded font-bold hover:bg-[#224A3B] transition-colors cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* 실물 양장본 평전 (A4 인쇄 & PDF 내보내기) 모달 */}
      {/* ───────────────────────────────────────────────────────────────── */}
      {isBookletModalOpen && (
        <MemorialBookletModal
          story={story}
          lifePhotos={SAMPLE_LIFE_PHOTOS}
          onClose={() => setIsBookletModalOpen(false)}
        />
      )}

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* 빈소 전용 디지털 헌정 모니터 뷰어 (Altar TV Kiosk) 모달 */}
      {/* ───────────────────────────────────────────────────────────────── */}
      {isAltarKioskOpen && (
        <AltarKioskModal
          story={story}
          lifePhotos={SAMPLE_LIFE_PHOTOS}
          setting={funeralSetting}
          onClose={() => setIsAltarKioskOpen(false)}
          onOpenBooklet={() => {
            setIsAltarKioskOpen(false);
            setIsBookletModalOpen(true);
          }}
        />
      )}
    </div>
  );
};
