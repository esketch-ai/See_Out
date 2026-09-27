import React from 'react';
import { X, Printer, Download, BookOpen, Heart, Award, Mic, FileText } from 'lucide-react';
import { LifeStoryDocument, LifePhotoItem } from '../../life-archive/types.js';
import { TraditionalSeal } from '../design-system/index.js';

interface MemorialBookletModalProps {
  story: LifeStoryDocument;
  lifePhotos: LifePhotoItem[];
  onClose: () => void;
}

export const MemorialBookletModal: React.FC<MemorialBookletModalProps> = ({
  story,
  lifePhotos,
  onClose
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0D0E10]/85 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-[#FAF9F6] rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl border border-[#E3DFD5] flex flex-col my-auto max-h-[95vh]">
        {/* 상단 컨트롤 툴바 (화면 전용, 인쇄 시 숨김 no-print) */}
        <div className="no-print bg-[#121417] text-[#FAF9F6] p-4 px-6 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-[#19382C] text-[#C2A26A] flex items-center justify-center border border-[#2D5A46]">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#FAF9F6] flex items-center space-x-2">
                <span>{story.deceasedName} 생애 평전 (A4 양장본 책자 / PDF 내보내기)</span>
                <span className="text-[10px] bg-[#9E7D47]/20 text-[#E8C88B] px-2 py-0.5 rounded border border-[#9E7D47]/40">
                  영구 보존판
                </span>
              </h3>
              <p className="text-xs text-[#A69E8F] font-serif">
                인쇄 또는 PDF로 저장하여 빈소 방명록 옆에 비치하거나 가보로 보관하실 수 있습니다.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-[#19382C] hover:bg-[#224A3B] text-white rounded-md font-serif font-bold text-xs flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer border border-[#2D5A46]"
            >
              <Printer className="w-4 h-4 text-[#C2A26A]" />
              <span>A4 책자 인쇄 / PDF 저장</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/10 rounded-full text-[#D4CEC2] hover:text-white transition-colors cursor-pointer"
              title="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 인쇄 본문 컨테이너 (스크롤 가능, 인쇄 시 완벽한 A4 페이지 분할 적용) */}
        <div className="overflow-y-auto p-4 sm:p-8 font-serif space-y-10 bg-[#FAF9F6]">
          {/* ───────────────────────────────────────────────────────────── */}
          {/* [표지 - Cover Page] */}
          {/* ───────────────────────────────────────────────────────────── */}
          <div className="print-booklet-page bg-[#FFFFFF] border border-[#E3DFD5] rounded-xl p-8 sm:p-14 flex flex-col justify-between items-center text-center shadow-xs min-h-[750px] relative overflow-hidden">
            {/* 전통 귀갑문 패턴 은은한 배경 */}
            <div className="pointer-events-none absolute inset-0 k-pattern-unmun opacity-15" />

            {/* 상단 전각 낙관 */}
            <div className="relative z-10 flex items-center space-x-3 mt-4">
              <span className="k-seal-jade px-2.5 py-1 text-xs">禮</span>
              <span className="text-xs text-[#876937] tracking-[0.25em] uppercase font-bold">
                Bae-ung Dignified Life Archive
              </span>
              <span className="k-seal-gold px-2.5 py-1 text-xs">永</span>
            </div>

            {/* 중앙 타이틀 및 고인 사진 */}
            <div className="relative z-10 space-y-6 my-auto max-w-lg">
              <div className="relative mx-auto w-36 h-44 rounded-lg overflow-hidden border-2 border-[#9E7D47]/70 shadow-md bg-gray-100">
                <img
                  src="/images/life-story-book.jpg"
                  alt={story.deceasedName}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-2">
                <span className="text-xs text-[#727782] tracking-widest block">永 生 之 錄</span>
                <h1 className="text-3xl sm:text-4xl font-reverence font-black text-[#151719] tracking-tight">
                  {story.deceasedName} 생애 평전
                </h1>
                <p className="text-sm text-[#876937] font-bold">
                  {story.birthYear}년 ~ 2026년 (향년 88세)
                </p>
              </div>

              <div className="k-traditional-divider my-4" />

              <blockquote className="text-sm italic text-[#42464E] leading-relaxed px-4">
                {story.epitaph}
              </blockquote>
            </div>

            {/* 하단 발간 정보 */}
            <div className="relative z-10 text-xs text-[#727782] space-y-1 mb-2">
              <p className="font-bold text-[#151719]">배웅(Bae-ung) 생애기록관 영구 헌정 편찬위원회</p>
              <p>편찬 일자: 2026년 3월 25일 • 발간처: 사단법인 한국디지털추모협회 공인</p>
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────────── */}
          {/* [발간사 및 유족 헌정사 - Dedication & Foreword] */}
          {/* ───────────────────────────────────────────────────────────── */}
          <div className="print-booklet-page bg-[#FFFFFF] border border-[#E3DFD5] rounded-xl p-8 sm:p-12 space-y-6 shadow-xs relative">
            <div className="border-b border-[#ECE8E0] pb-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-[#876937] font-bold">獻呈辭 · 머리말</span>
                <h2 className="text-2xl font-reverence font-bold text-[#151719] mt-0.5">
                  사랑하는 가족들이 올리는 헌정사
                </h2>
              </div>
              <TraditionalSeal sealKey="mourningCondolence" size="sm" />
            </div>

            <div className="bg-[#FAF8F5] p-5 sm:p-6 rounded-lg border border-[#ECE8E0] text-sm text-[#42464E] leading-loose">
              <p className="indent-4 mb-4">
                {story.familyDedication}
              </p>
              <p className="indent-4">
                아버님께서 걸어오신 88년의 숭고한 세월은 우리 가족 모두의 가슴속에 꺼지지 않는 등불이자 영원한 지침입니다. 세상의 거센 비바람 속에서도 오직 가족의 안녕과 정직함을 위해 묵묵히 흘리셨던 땀방울을 기억하며, 삼가 이 평전을 아버님의 영전에 바칩니다.
              </p>
            </div>

            <div className="space-y-3 pt-3">
              <h3 className="text-base font-bold text-[#151719] flex items-center space-x-1.5">
                <Award className="w-4 h-4 text-[#9E7D47]" />
                <span>김철수 선생 평전 총론 (總論)</span>
              </h3>
              <p className="text-xs sm:text-sm text-[#5C6166] leading-relaxed">
                {story.overallSummary}
              </p>
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────────── */}
          {/* [4대 챕터 본문 - 4 Biographical Chapters] */}
          {/* ───────────────────────────────────────────────────────────── */}
          {story.chapters.map((chapter) => (
            <div
              key={chapter.chapterNumber}
              className="print-booklet-page bg-[#FFFFFF] border border-[#E3DFD5] rounded-xl p-8 sm:p-12 space-y-6 shadow-xs relative"
            >
              <div className="border-b border-[#ECE8E0] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="text-xs text-[#876937] font-bold flex items-center space-x-2">
                    <span>제{chapter.chapterNumber}장 연대기</span>
                    <span className="text-[#C2A26A]">•</span>
                    <span>{chapter.period}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-reverence font-bold text-[#151719] mt-1">
                    {chapter.title}
                  </h3>
                </div>
                <div className="text-xs text-[#727782] font-mono shrink-0">
                  Chapter {chapter.chapterNumber}
                </div>
              </div>

              {/* 챕터 본문 서술 */}
              <div className="text-sm text-[#383C43] leading-relaxed sm:leading-loose text-justify space-y-4">
                <p className="indent-4">
                  {chapter.storyContent}
                </p>
              </div>

              {/* 주요 업적 및 기록 */}
              <div className="bg-[#FAF8F5] p-4 rounded-lg border border-[#ECE8E0] space-y-2 text-xs">
                <span className="font-bold text-[#151719] block text-xs">
                  주요 생애 발자취 및 시대 기록:
                </span>
                <ul className="space-y-1.5 text-[#5C6166]">
                  {chapter.keyAchievements.map((ach, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-[#19382C] font-bold">•</span>
                      <span>{ach}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 챕터 수록 사진 2선 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {chapter.featuredPhotos.map((photo, pIdx) => (
                  <div
                    key={pIdx}
                    className="p-3 bg-[#FAF9F6] border border-[#E3DFD5] rounded-lg space-y-2"
                  >
                    <div className="h-36 rounded overflow-hidden bg-gray-100 relative">
                      <img
                        src="/images/life-archive.jpg"
                        alt={photo.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                        {photo.year}
                      </span>
                    </div>
                    <div>
                      <div className="font-bold text-xs text-[#151719]">{photo.title}</div>
                      <p className="text-[11px] text-[#727782] mt-0.5">{photo.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* ───────────────────────────────────────────────────────────── */}
          {/* [마지막 페이지 - 생전 육성 녹음 전문 및 엔딩노트 요약] */}
          {/* ───────────────────────────────────────────────────────────── */}
          <div className="print-booklet-page bg-[#FFFFFF] border border-[#E3DFD5] rounded-xl p-8 sm:p-12 space-y-6 shadow-xs relative">
            <div className="border-b border-[#ECE8E0] pb-4">
              <span className="text-xs text-[#876937] font-bold">遺言 · 생전 육성 전사</span>
              <h2 className="text-2xl font-reverence font-bold text-[#151719] mt-0.5">
                고인이 남기신 마지막 육성 편지 전문
              </h2>
              <p className="text-xs text-[#727782] mt-1">
                녹음 일시: {story.audioTribute.recordedAt} ({story.audioTribute.duration})
              </p>
            </div>

            <div className="bg-[#FAF8F5] p-6 rounded-lg border border-[#ECE8E0] text-sm text-[#42464E] leading-loose italic">
              <p className="indent-4">
                {story.audioTribute.transcript}
              </p>
            </div>

            <div className="k-traditional-divider my-6" />

            <div className="text-center space-y-2 py-4">
              <span className="k-seal-red px-3 py-1.5 text-sm">永眠</span>
              <p className="font-reverence font-bold text-lg text-[#151719]">
                삼가 고인의 명복을 빌며, 평안한 영면을 기원합니다.
              </p>
              <p className="text-xs text-[#727782]">
                본 평전은 배웅(Bae-ung) 생애기록관 암호화 봉안소에 영구 보존됩니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
