import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Volume2,
  FileText,
  BookOpen,
  ArrowRight,
  BookmarkCheck,
  Award
} from 'lucide-react';
import { VOICE_INTERVIEW_QUESTIONS } from '../../life-archive/lifeArchiveDataset.js';
import { VoiceInterviewQuestion } from '../../life-archive/types.js';
import { TraditionalSeal } from '../design-system/index.js';

interface VoiceInterviewSectionProps {
  onApplyProseToChapter?: (chapterNumber: number, prose: string) => void;
  onOpenBooklet?: () => void;
}

export const VoiceInterviewSection: React.FC<VoiceInterviewSectionProps> = ({
  onApplyProseToChapter,
  onOpenBooklet
}) => {
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>('q1');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [isPlayingQuestionAudio, setIsPlayingQuestionAudio] = useState<boolean>(false);
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [userSpokenText, setUserSpokenText] = useState<string>('');
  const [synthesizedProse, setSynthesizedProse] = useState<string>('');
  const [savedChapters, setSavedChapters] = useState<number[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currentQ: VoiceInterviewQuestion =
    VOICE_INTERVIEW_QUESTIONS.find((q) => q.id === selectedQuestionId) || VOICE_INTERVIEW_QUESTIONS[0];

  // 질문 선택 변경 시 상태 리셋
  useEffect(() => {
    setIsRecording(false);
    setRecordingSeconds(0);
    setIsPlayingQuestionAudio(false);
    setUserSpokenText(currentQ.sampleSpokenAnswer);
    setSynthesizedProse(currentQ.aiSynthesizedProse);
  }, [selectedQuestionId]);

  // 녹음 타이머
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const toggleRecording = () => {
    if (isRecording) {
      // 녹음 종료 -> AI 평전 문장화 시뮬레이션
      setIsRecording(false);
      setIsSynthesizing(true);
      setTimeout(() => {
        setIsSynthesizing(false);
        setSynthesizedProse(currentQ.aiSynthesizedProse);
        setToastMessage(`제${currentQ.targetChapterNumber}장 평전 문장이 성공적으로 합성되었습니다.`);
        setTimeout(() => setToastMessage(null), 3500);
      }, 900);
    } else {
      // 녹음 시작
      setRecordingSeconds(0);
      setIsRecording(true);
    }
  };

  const handleSaveToChapter = () => {
    if (!savedChapters.includes(currentQ.targetChapterNumber)) {
      setSavedChapters((prev) => [...prev, currentQ.targetChapterNumber]);
    }
    onApplyProseToChapter?.(currentQ.targetChapterNumber, synthesizedProse);
    setToastMessage(`제${currentQ.targetChapterNumber}장 연대기에 문장이 영구 저장되었습니다.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="space-y-8 font-serif">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. 상단 안내 헤더 & 특허 기술 배지 */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="bg-[#141618] text-[#FAF9F6] rounded-xl p-6 md:p-8 space-y-4 border border-[#3D382E] relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 k-pattern-unmun-dark opacity-30" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#19382C] text-[#C2A26A] flex items-center justify-center border border-[#2D4F43] shrink-0">
              <Mic className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[0.8125rem] uppercase tracking-widest text-[#C2A26A] font-bold">
                  Voice-to-Biography Engine
                </span>
                <span className="text-[0.8125rem] bg-[#9E7D47]/20 text-[#C2A26A] px-2 py-0.5 rounded border border-[#9E7D47]/40">
                  AI 구술 인터뷰 특허 기술
                </span>
              </div>
              <h3 className="font-reverence font-bold text-xl md:text-2xl text-[#FAF9F6] mt-0.5">
                AI 생애 구술 인터뷰어
              </h3>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[0.8125rem] text-[#5A5E66]">
              완성된 챕터: <strong className="text-[#C2A26A]">{savedChapters.length}</strong> / 4장
            </span>
          </div>
        </div>

        <p className="relative z-10 text-[0.8125rem] md:text-sm text-[#5A5E66] leading-relaxed max-w-3xl">
          글 작성이 부담스러운 시니어 어르신도 마이크에 편안하게 말씀만 하시면 됩니다.
          AI 구술 인터뷰어가 4대 핵심 질문을 음성으로 여쭙고, 고인의 따뜻한 육성을 고풍스러운 문체의 <strong>영구 보존판 생애 평전</strong>으로 자동 승화해 드립니다.
        </p>

        {/* 토스트 알림 */}
        {toastMessage && (
          <div className="relative z-20 bg-[#19382C] text-[#FAF9F6] border border-[#2D4F43] px-4 py-2.5 rounded-lg text-[0.8125rem] flex items-center space-x-2 shadow-lg animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-[#C2A26A] shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. 4대 연대기 표준 질문 탭 셀렉터 */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        {VOICE_INTERVIEW_QUESTIONS.map((q) => {
          const isSelected = selectedQuestionId === q.id;
          const isSaved = savedChapters.includes(q.targetChapterNumber);
          return (
            <button
              key={q.id}
              onClick={() => setSelectedQuestionId(q.id)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative ${
                isSelected
                  ? 'bg-[#19382C] text-[#FAF9F6] border-[#2D4F43] shadow-sm'
                  : 'bg-[#FFFFFF] text-[#42464E] border-[#DCD6C9] hover:bg-[#FAF9F6]'
              }`}
            >
              <div className="flex items-center justify-between text-[0.8125rem] mb-1 font-bold">
                <span className={isSelected ? 'text-[#C2A26A]' : 'text-[#6E5429]'}>
                  제{q.targetChapterNumber}장 • {q.category}
                </span>
                {isSaved && (
                  <span className="text-[0.8125rem] text-[#243F35] font-normal flex items-center space-x-0.5">
                    <BookmarkCheck className="w-3 h-3" />
                    <span>저장완료</span>
                  </span>
                )}
              </div>
              <div className="font-bold text-[0.8125rem] truncate">
                {q.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. 대화형 인터뷰 무대 (질문 음성 청취 + 어르신 녹음 + AI 평전 문장화) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="bg-[#FAF9F6] border border-[#DCD6C9] rounded-xl p-5 md:p-8 space-y-6 shadow-xs">
        {/* 3-A. AI 인터뷰어 질문 카드 */}
        <div className="bg-[#FFFFFF] border-2 border-[#C2A26A]/40 rounded-xl p-5 md:p-6 space-y-3 relative overflow-hidden shadow-xs">
          <div className="flex items-center justify-between border-b border-[#DCD6C9] pb-2.5">
            <div className="flex items-center space-x-2">
              <span className="k-seal-gold px-2 py-0.5 text-[0.8125rem] font-bold">질문</span>
              <span className="text-[0.8125rem] font-bold text-[#6E5429]">
                AI 인터뷰어 질문 (제{currentQ.targetChapterNumber}장 {currentQ.category})
              </span>
            </div>
            <button
              onClick={() => setIsPlayingQuestionAudio(!isPlayingQuestionAudio)}
              className="text-[0.8125rem] text-[#19382C] font-bold flex items-center space-x-1.5 px-3 py-1 bg-[#FAF9F6] border border-[#DCD6C9] rounded-md hover:bg-[#FAF9F6] transition-colors cursor-pointer"
            >
              <Volume2 className={`w-3.5 h-3.5 text-[#6E5429] ${isPlayingQuestionAudio ? 'animate-pulse' : ''}`} />
              <span>{isPlayingQuestionAudio ? '음성 재생 중...' : '질문 음성으로 듣기'}</span>
            </button>
          </div>

          <p className="text-base sm:text-lg font-reverence font-bold text-[#151719] leading-relaxed">
            {currentQ.questionAudioText}
          </p>
        </div>

        {/* 3-B. 어르신 음성 녹음 콘솔 (마이크 대형 버튼 & 파형 시뮬레이션) */}
        <div className="p-6 bg-[#FFFFFF] border border-[#DCD6C9] rounded-xl flex flex-col items-center justify-center text-center space-y-4">
          <div className="relative">
            {isRecording && (
              <span className="absolute -inset-3 rounded-full bg-[#8B2520]/20 animate-ping pointer-events-none" />
            )}
            <button
              onClick={toggleRecording}
              className={`w-20 h-20 rounded-full flex flex-col items-center justify-center shadow-lg transition-all cursor-pointer border-2 ${
                isRecording
                  ? 'bg-[#731C18] border-[#8B2520] text-white animate-pulse'
                  : 'bg-[#19382C] border-[#2D4F43] text-[#FAF9F6] hover:bg-[#2D4F43]'
              }`}
            >
              {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8 text-[#C2A26A]" />}
            </button>
          </div>

          <div className="space-y-1">
            <div className="text-sm font-bold text-[#151719] flex items-center justify-center space-x-2">
              <span>{isRecording ? '어르신 음성을 경청하고 있습니다...' : '마이크를 누르고 편안히 말씀해 주세요'}</span>
              {isRecording && (
                <span className="text-[0.8125rem] font-mono text-[#D4665A] font-bold">
                  {String(Math.floor(recordingSeconds / 60)).padStart(2, '0')}:
                  {String(recordingSeconds % 60).padStart(2, '0')}
                </span>
              )}
            </div>
            <p className="text-[0.8125rem] text-[#5A5E66]">
              {isRecording
                ? '말씀이 끝나시면 버튼을 다시 눌러 녹음을 완료해 주세요.'
                : '스마트폰 마이크에 대고 어린 시절 기억, 직장에서의 보람, 가족 이야기를 들려주시면 됩니다.'}
            </p>
          </div>

          {/* 실시간 음성 파형 애니메이션 (녹음 중일 때 노출) */}
          {isRecording && (
            <div className="flex items-center space-x-1.5 h-8">
              {[40, 70, 95, 60, 85, 100, 45, 90, 75, 50, 80, 65].map((h, i) => (
                <span
                  key={i}
                  className="w-1.5 bg-[#8B2520] rounded-full animate-bounce"
                  style={{
                    height: `${h}%`,
                    animationDuration: `${0.6 + (i % 4) * 0.2}s`
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* 3-C. 어르신 육성 말씀 전사 (STT) & 편집 창 */}
        <div className="bg-[#FFFFFF] border border-[#DCD6C9] rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[0.8125rem] font-bold text-[#151719] flex items-center space-x-1.5">
              <FileText className="w-3.5 h-3.5 text-[#6E5429]" />
              <span>어르신 구술 전사 원문 (STT)</span>
            </span>
            <span className="text-[0.8125rem] text-[#5A5E66]">직접 수정하거나 추가 작성하실 수 있습니다</span>
          </div>

          <textarea
            value={userSpokenText}
            onChange={(e) => setUserSpokenText(e.target.value)}
            rows={3}
            className="w-full p-3.5 bg-[#FAF9F6] border border-[#DCD6C9] rounded-lg text-[0.8125rem] md:text-sm text-[#42464E] leading-relaxed focus:outline-none focus:border-[#9E7D47]"
            placeholder="마이크로 구술하시거나 이곳에 직접 기억을 적어주셔도 됩니다."
          />
        </div>

        {/* 3-D. AI 생애 평전 산문 문장화 결과 (Biographical Prose Synthesis) */}
        <div className="bg-[#19382C] text-[#FAF9F6] rounded-xl p-6 md:p-7 space-y-4 border border-[#2D4F43] relative overflow-hidden shadow-md">
          <div className="pointer-events-none absolute inset-0 k-pattern-geummun opacity-25" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div className="flex items-center space-x-2">
              <TraditionalSeal sealKey="sincerity" size="sm" />
              <div>
                <span className="text-[0.8125rem] text-[#C2A26A] font-bold block">
                  AI 생애 평전 문장화 결과 (제{currentQ.targetChapterNumber}장 본문)
                </span>
                <span className="text-[0.8125rem] text-[#5A5E66]">
                  구술 원문을 바탕으로 품격 높은 한국 문학 산문체로 정돈된 완성본입니다
                </span>
              </div>
            </div>

            {isSynthesizing && (
              <span className="text-[0.8125rem] text-[#C2A26A] flex items-center space-x-1 animate-pulse">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI가 평전 문장을 집필 중입니다...</span>
              </span>
            )}
          </div>

          {/* 산문 텍스트 영역 */}
          <div className="relative z-10 bg-[#0A1511] p-5 rounded-lg border border-[#2D4F43] text-[0.8125rem] sm:text-sm text-[#FAF9F6] leading-loose italic">
            <p className="indent-4">
              {synthesizedProse}
            </p>
          </div>

          {/* 하단 액션 버튼들 */}
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="text-[0.8125rem] text-[#8A929D] flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#C2A26A]" />
              <span>영구 보존판 A4 양장본 평전 및 디지털 뷰어에 실시간 연동됩니다</span>
            </div>

            <div className="flex items-center space-x-2.5">
              <button
                onClick={handleSaveToChapter}
                className="px-4 py-2 bg-[#9E7D47] hover:bg-[#9E7D47] text-[#151719] rounded-md font-bold text-[0.8125rem] flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer"
              >
                <BookmarkCheck className="w-4 h-4" />
                <span>제{currentQ.targetChapterNumber}장 평전에 영구 저장</span>
              </button>

              {onOpenBooklet && (
                <button
                  onClick={onOpenBooklet}
                  className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-[#FAF9F6] rounded-md font-bold text-[0.8125rem] flex items-center space-x-1.5 border border-white/20 transition-all cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-[#C2A26A]" />
                  <span>A4 평전 책자 보기</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
