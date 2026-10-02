import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  PhoneCall,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  Scale,
  RotateCcw
} from 'lucide-react';
import { ModalShell, ModalToolbar } from './ModalShell.js';

interface SeniorVoiceAssistantModalProps {
  onClose: () => void;
  onNavigateToEmergency?: () => void;
  onSelectHall?: (hallName: string) => void;
  onOpenPackagePricing?: () => void;
  onOpenQuoteDiagnostics?: () => void;
}

type QueryIntent = 'EMERGENCY' | 'HOSPITAL_SEARCH' | 'PACKAGE_INQUIRY' | 'REFUND_CLAIM' | 'GENERAL';

interface AssistantResponse {
  intent: QueryIntent;
  spokenMessage: string;
  displayTitle: string;
  displayDescription: string;
  actionText?: string;
  onAction?: () => void;
}

export const SeniorVoiceAssistantModal: React.FC<SeniorVoiceAssistantModalProps> = ({
  onClose,
  onNavigateToEmergency,
  onSelectHall,
  onOpenPackagePricing,
  onOpenQuoteDiagnostics
}) => {
  const [isListening, setIsListening] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState('');
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [response, setResponse] = useState<AssistantResponse | null>({
    intent: 'GENERAL',
    spokenMessage: '어르신, 무엇이든 편안하게 말씀해 주세요. 계신 병원이나 장례 비용, 긴급 출동까지 배웅이 바로 안내해 드립니다.',
    displayTitle: '어르신을 위한 무타자 음성 안내',
    displayDescription: '아래 마이크를 누르고 말씀하시거나, 자주 묻는 질문을 터치해 주세요.'
  });

  const recognitionRef = useRef<any>(null);

  // 음성 합성 (TTS)
  const speakText = (text: string) => {
    if (!ttsEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      utterance.rate = 0.95; // 시니어 청취를 위한 약간 차분한 템포
      window.speechSynthesis.speak(utterance);
    } catch {
      // Graceful fallback if TTS fails
    }
  };

  // 음성 인식 초기화
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'ko-KR';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = () => setIsListening(false);
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setSpeechTranscript(transcript);
          handleProcessQuery(transcript);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setSpeechTranscript('');
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch {
        // Fallback if browser permission is blocked
        setIsListening(false);
      }
    }
  };

  // 의도(Intent) 분석 엔진
  const handleProcessQuery = (query: string) => {
    const trimmed = query.trim().toLowerCase();
    let res: AssistantResponse;

    if (
      trimmed.includes('임종') ||
      trimmed.includes('돌아가') ||
      trimmed.includes('사망') ||
      trimmed.includes('급해') ||
      trimmed.includes('도와') ||
      trimmed.includes('운구') ||
      trimmed.includes('숨')
    ) {
      res = {
        intent: 'EMERGENCY',
        spokenMessage: '마음이 많이 황망하시지요. 배웅의 국가공인 1급 전담 장례지도사가 전국 어디든 40분 이내에 현장으로 달려갑니다. 지금 바로 24시 긴급 출동으로 연결해 드리겠습니다.',
        displayTitle: '24시 긴급 출동 & 리무진 운구 대기 중',
        displayDescription: '황망한 순간, 절대로 당황하지 마십시오. 전담 장례지도사가 현장 도착하여 사망진단서 수령부터 안치실 배정까지 곁에서 모십니다.',
        actionText: '24시 긴급 출동 화면으로 바로 이동',
        onAction: () => {
          onClose();
          onNavigateToEmergency?.();
        }
      };
    } else if (
      trimmed.includes('아산') ||
      trimmed.includes('삼성') ||
      trimmed.includes('세브란스') ||
      trimmed.includes('성모') ||
      trimmed.includes('동산') ||
      trimmed.includes('부산시민') ||
      trimmed.includes('병원') ||
      trimmed.includes('식장')
    ) {
      let hallName = '서울아산병원 장례식장';
      if (trimmed.includes('삼성')) hallName = '삼성서울병원 장례식장';
      if (trimmed.includes('세브란스')) hallName = '신촌세브란스병원 장례식장';
      if (trimmed.includes('성모')) hallName = '서울성모병원 장례식장';
      if (trimmed.includes('동산')) hallName = '계명대 대구동산병원 장례식장';
      if (trimmed.includes('부산')) hallName = '부산시민장례식장';

      res = {
        intent: 'HOSPITAL_SEARCH',
        spokenMessage: `${hallName}의 시설 정보와 배웅 제휴 30% 감면 견적을 준비했습니다. 실시간 안치실 공실과 투명한 시설 이용료를 안내해 드립니다.`,
        displayTitle: `${hallName} 제휴 정보 확인`,
        displayDescription: `배웅 제휴 시 빈소 사용료 30% 감면 혜택과 불법 리베이트 0원 보증이 적용됩니다.`,
        actionText: `${hallName} 상세 견적 확인`,
        onAction: () => {
          onClose();
          onSelectHall?.(hallName);
        }
      };
    } else if (
      trimmed.includes('무빈소') ||
      trimmed.includes('가족장') ||
      trimmed.includes('일반장') ||
      trimmed.includes('정찰') ||
      trimmed.includes('패키지') ||
      trimmed.includes('비용') ||
      trimmed.includes('가격') ||
      trimmed.includes('얼마')
    ) {
      res = {
        intent: 'PACKAGE_INQUIRY',
        spokenMessage: '배웅은 현장 추가금이 일체 없는 100% 투명 정찰제입니다. 무빈소 120만 원, 가족장 180만 원, 일반장 390만 원으로 마지막 가시는 예를 정성껏 모십니다.',
        displayTitle: '현장 추가금 제로 투명 정찰제 패키지',
        displayDescription: '오동나무 관, 명품 삼베 수의, 최고급 특장 리무진 운구까지 모든 필수 항목이 포함되어 있으며 현장에서 1원도 추가되지 않습니다.',
        actionText: '정찰제 패키지 상세 비교 보기',
        onAction: () => {
          onClose();
          onOpenPackagePricing?.();
        }
      };
    } else if (
      trimmed.includes('해약') ||
      trimmed.includes('환급') ||
      trimmed.includes('상조') ||
      trimmed.includes('위약금') ||
      trimmed.includes('보람') ||
      trimmed.includes('프리드') ||
      trimmed.includes('대명') ||
      trimmed.includes('취소')
    ) {
      res = {
        intent: 'REFUND_CLAIM',
        spokenMessage: '기존 가입하신 상조회사의 부당한 위약금 공제를 막고, 공정거래위원회 기준에 따른 법정 해약환급금을 100% 되찾으실 수 있도록 내용증명 서식을 작성해 드립니다.',
        displayTitle: '공정위 기준 법정 해약환급금 전액 청구',
        displayDescription: '상조사 임의 공제는 위법입니다. 할부거래법 제34조에 따라 우체국 e-그린우편으로 공식 내용증명을 원클릭 발송할 수 있습니다.',
        actionText: '상조 해약환급금 진단 및 내용증명 발송',
        onAction: () => {
          onClose();
          onOpenQuoteDiagnostics?.();
        }
      };
    } else {
      res = {
        intent: 'GENERAL',
        spokenMessage: `말씀해 주신 내용에 대해 배웅 전문 상담원이 친절히 안내해 드릴 수 있습니다. 지금 바로 24시 무료 상담 1588-0000으로 편안하게 문의해 주세요.`,
        displayTitle: '배웅 24시 직통 안심 상담센터',
        displayDescription: `상담을 원하시면 언제든 1588-0000(24시간 연중무휴)으로 전화 주시면 국가공인 지도사가 정성껏 상담해 드립니다.`,
        actionText: '24시 직통 상담 전화 걸기 (1588-0000)',
        onAction: () => {
          window.location.href = 'tel:1588-0000';
        }
      };
    }

    setResponse(res);
    speakText(res.spokenMessage);
  };

  const sampleVoiceChips = [
    { label: '아산병원 장례식장 찾아줘', query: '서울아산병원 장례식장 찾아줘' },
    { label: '무빈소 120만원 패키지 알려줘', query: '무빈소 120만원 패키지' },
    { label: '지금 임종하셨어. 급해요', query: '지금 부모님이 임종하셨어 급해요' },
    { label: '상조 해약하고 환급금 받고 싶어', query: '상조 해약 환급금 청구' },
    { label: '가족장 180만원 견적 확인', query: '가족장 180만원 정찰제' }
  ];

  return (
    <ModalShell
      onClose={onClose}
      maxWidth="max-w-2xl"
      surface="paper"
      titleId="voice-assistant-title"
      descriptionId="voice-assistant-desc"
    >
      <ModalToolbar
        titleId="voice-assistant-title"
        descriptionId="voice-assistant-desc"
        onClose={onClose}
        closeLabel="음성 안내 닫기"
        icon={
          <div className="w-8 h-8 rounded-full bg-[#19382C] text-[#C2A26A] flex items-center justify-center border border-[#2D4F43] shrink-0">
            <Mic className="w-4 h-4" />
          </div>
        }
        title={<span className="text-lg font-reverence font-bold text-[#FAF9F6]">어르신 무타자(Zero-Typing) 음성 안내</span>}
        subtitle="손가락으로 글자를 치지 않으셔도 말로 편안하게 물어보시면 즉시 찾아드립니다."
      >
        <button
          type="button"
          onClick={() => setTtsEnabled(!ttsEnabled)}
          className={`px-3 py-1.5 rounded-md text-[0.8125rem] font-bold flex items-center space-x-1.5 transition-colors cursor-pointer border ${
            ttsEnabled
              ? 'bg-[#19382C] text-[#DCE8E2] border-[#2D4F43]'
              : 'bg-white/10 text-[#FAF9F6] border-white/20'
          }`}
          aria-label={ttsEnabled ? '음성 안내 켜짐' : '음성 안내 꺼짐'}
        >
          {ttsEnabled ? <Volume2 className="w-4 h-4 text-[#C2A26A]" /> : <VolumeX className="w-4 h-4 text-[#8A929D]" />}
          <span>{ttsEnabled ? '음성 낭독 켜짐' : '음성 낭독 꺼짐'}</span>
        </button>
      </ModalToolbar>

      <div className="p-6 sm:p-8 space-y-6 bg-[#FAF9F6] overflow-y-auto max-h-[80vh]">
        {/* 마이크 인터랙션 영역 */}
        <div className="text-center space-y-4 bg-white p-6 rounded-2xl border border-[#DCD6C9] shadow-xs">
          <div className="flex justify-center">
            <button
              type="button"
              onClick={toggleListening}
              className={`w-24 h-24 rounded-full flex flex-col items-center justify-center transition-all cursor-pointer relative shadow-lg ${
                isListening
                  ? 'bg-[#8B2520] text-white animate-pulse ring-8 ring-[#8B2520]/20'
                  : 'bg-[#19382C] text-white hover:bg-[#2D4F43] ring-4 ring-[#C2A26A]/30'
              }`}
              aria-label={isListening ? '음성 듣는 중... 중지하려면 터치하세요' : '마이크를 터치하고 말씀하세요'}
            >
              {isListening ? (
                <>
                  <MicOff className="w-9 h-9 text-[#FAF9F6]" />
                  <span className="text-[0.8125rem] font-bold mt-1">듣는 중...</span>
                </>
              ) : (
                <>
                  <Mic className="w-9 h-9 text-[#C2A26A]" />
                  <span className="text-[0.8125rem] font-bold mt-1">터치 후 말씀</span>
                </>
              )}
            </button>
          </div>

          <div>
            <p className="text-base sm:text-lg font-reverence font-bold text-[#151719]">
              {isListening
                ? '어르신, 편안하게 말씀해 주십시오. 듣고 있습니다...'
                : '마이크를 누르고 원하시는 것을 편하게 말씀해 주세요.'}
            </p>
            {speechTranscript && (
              <div className="mt-2 p-3 bg-[#FAF9F6] rounded-xl border border-[#DCD6C9] text-base font-bold text-[#19382C] inline-block">
                "{speechTranscript}"
              </div>
            )}
          </div>

          {/* 간편 질문 칩 (무타자 원터치 지원) */}
          <div className="pt-2">
            <span className="text-[0.8125rem] font-bold text-[#5A5E66] block mb-2">
              터치 한 번으로 바로 물어보기:
            </span>
            <div className="flex flex-wrap justify-center gap-2">
              {sampleVoiceChips.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSpeechTranscript(chip.query);
                    handleProcessQuery(chip.query);
                  }}
                  className="px-3.5 py-2 bg-[#FAF9F6] hover:bg-[#F1EDE3] text-[#151719] border border-[#DCD6C9] rounded-full text-[0.8125rem] font-bold transition-colors cursor-pointer"
                >
                  🎤 {chip.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 어시스턴트 답변 카드 */}
        {response && (
          <div
            className={`p-6 rounded-2xl border-2 space-y-4 shadow-sm transition-all ${
              response.intent === 'EMERGENCY'
                ? 'bg-[#8B2520]/5 border-[#8B2520]'
                : 'bg-white border-[#19382C]'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${
                  response.intent === 'EMERGENCY'
                    ? 'bg-[#8B2520] text-white border-[#731C18]'
                    : 'bg-[#19382C] text-[#C2A26A] border-[#2D4F43]'
                }`}
              >
                {response.intent === 'EMERGENCY' ? (
                  <PhoneCall className="w-5 h-5" />
                ) : response.intent === 'HOSPITAL_SEARCH' ? (
                  <Building2 className="w-5 h-5" />
                ) : response.intent === 'REFUND_CLAIM' ? (
                  <Scale className="w-5 h-5" />
                ) : (
                  <Sparkles className="w-5 h-5" />
                )}
              </div>
              <div className="space-y-1">
                <h3
                  className={`text-lg font-reverence font-bold ${
                    response.intent === 'EMERGENCY' ? 'text-[#8B2520]' : 'text-[#19382C]'
                  }`}
                >
                  {response.displayTitle}
                </h3>
                <p className="text-[0.9375rem] sm:text-base text-[#42464E] leading-relaxed">
                  {response.spokenMessage}
                </p>
                <p className="text-[1.125rem] text-[#5A5E66] pt-1">
                  {response.displayDescription}
                </p>
              </div>
            </div>

            {response.actionText && response.onAction && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={response.onAction}
                  className={`w-full py-3.5 px-4 rounded-xl font-reverence font-bold text-base flex items-center justify-center space-x-2 transition-all shadow-xs cursor-pointer ${
                    response.intent === 'EMERGENCY'
                      ? 'bg-[#8B2520] hover:bg-[#731C18] text-white border border-[#731C18]'
                      : 'bg-[#19382C] hover:bg-[#2D4F43] text-white border border-[#2D4F43]'
                  }`}
                >
                  <span>{response.actionText}</span>
                  <ArrowRight className="w-5 h-5 text-[#C2A26A]" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* 24시 무료 직통 연결 바 */}
        <div className="p-4 bg-white rounded-xl border border-[#DCD6C9] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <PhoneCall className="w-5 h-5 text-[#19382C]" />
            <span className="text-[0.8125rem] font-bold text-[#151719]">
              말씀이 어려우시면 언제든 전화 주십시오: <strong>1588-0000</strong> (24시 무료)
            </span>
          </div>
          <a
            href="tel:1588-0000"
            className="px-3 py-1.5 bg-[#19382C] hover:bg-[#2D4F43] text-white rounded-lg text-[0.8125rem] font-bold shrink-0"
          >
            직통 전화
          </a>
        </div>
      </div>
    </ModalShell>
  );
};
