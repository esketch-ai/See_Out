import React, { useState } from 'react';
import { 
  Calculator, 
  Building2, 
  PackageCheck, 
  ShieldCheck, 
  PhoneCall, 
  Play, 
  ChevronRight, 
  Bell, 
  HelpCircle, 
  Clock, 
  ArrowRight,
  HeartHandshake,
  Scale,
  FileText,
  CheckCircle2,
  X
} from 'lucide-react';
import { TraditionalSeal } from '../design-system/index.js';
import { ModalShell } from './ModalShell.js';

interface KmacaWarmHomeProps {
  onOpenQuoteDiagnostics: () => void;
  onOpenFuneralHallSearch: () => void;
  onOpenFixedPackages: () => void;
  onOpenDualStandby: () => void;
  onOpenVoucher: () => void;
  onOpenCare: (vertical: 'PSYCHOLOGY_CARE' | 'LEGAL_INHERITANCE') => void;
  onEnterEmergency: () => void;
}

export const KmacaWarmHome: React.FC<KmacaWarmHomeProps> = ({
  onOpenQuoteDiagnostics,
  onOpenFuneralHallSearch,
  onOpenFixedPackages,
  onOpenDualStandby,
  onOpenVoucher,
  onOpenCare,
  onEnterEmergency
}) => {
  const [activeTab, setActiveTab] = useState<'NOTICE' | 'FAQ'>('NOTICE');
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  return (
    <div className="space-y-10 pb-16 font-serif text-[#151719]">
      {/* ─── 1. 메인 비주얼 배너 (햇살 가족 사진 + 감성 카피 & 즉시 출동) ─── */}
      <div className="relative rounded-2xl overflow-hidden shadow-sm border border-[#DCD6C9] min-h-[380px] sm:min-h-[440px] flex items-center bg-[#FAF9F6]">
        {/* 정갈한 위로와 따뜻한 동행 — 고품격 K-헤리티지 배웅 비주얼 */}
        <img 
          src="/images/hero_reverent_comfort.jpg" 
          alt="슬픔을 보듬는 정중한 예우와 따뜻한 배웅" 
          className="absolute inset-0 w-full h-full object-cover object-right"
        />

        {/* 좌측 텍스트 가독성을 위한 한지 오버레이.
            ★ 스크림 알파는 「본문 구간에서 최소 50%」 를 지킨다. 그 아래로 내려가면
              사진 디테일이 글자 윤곽을 방해해 유족이 고쳐 읽게 된다.
              데스크톱도 예외가 아니다 — 투명 구간이 본문 줄 끝까지 닿아 있었다.
            ★ 모바일은 세로로 덮고, sm 이상에서만 가로 페이드를 쓴다. */}
        <div className="absolute inset-0 w-full bg-gradient-to-b from-[#FAF9F6] via-[#FAF9F6]/95 to-[#FAF9F6]/80 sm:w-3/5 sm:bg-gradient-to-r sm:from-[#FAF9F6] sm:via-[#FAF9F6]/90 sm:to-[#FAF9F6]/55" />

        {/* 배너 카피 & 즉각적인 CTA 버튼 */}
        <div className="relative z-10 p-6 sm:p-10 md:p-12 max-w-lg space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-[0.8125rem] font-bold bg-[#19382C]/10 text-[#19382C] border border-[#19382C]/20">
            <TraditionalSeal sealKey="mourningCondolence" size="sm" />
            <span>대한민국 1호 공공데이터 기반 안심 장례</span>
          </div>

          <h1 className="font-reverence font-bold text-3xl sm:text-4xl text-[#151719] leading-tight break-words">
            함께라서 든든한,<br />
            <span className="text-[#19382C]">따뜻한 배웅</span>
          </h1>

          <p className="text-sm sm:text-base text-[#5A5E66] leading-relaxed break-words">
            경황없는 이별의 순간, 불법 리베이트와 추가금 걱정 없이 고인에게만 온전히 집중하실 수 있도록 24시간 곁을 지킵니다.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button 
              type="button"
              onClick={onEnterEmergency}
              className="px-6 py-3.5 bg-[#19382C] hover:bg-[#2D4F43] active:scale-[0.99] text-[#FAF9F6] rounded-xl font-bold text-sm sm:text-base flex items-center justify-center space-x-2 shadow-sm transition-all cursor-pointer"
            >
              <span>24시 긴급 의전 접수</span>
              <ArrowRight className="w-4 h-4 text-[#FAF9F6]" />
            </button>

            <a 
              href="tel:1588-0000"
              className="px-5 py-3.5 bg-[#FFFFFF] hover:bg-[#F1EDE3] text-[#19382C] border border-[#DCD6C9] rounded-xl font-bold text-sm sm:text-base flex items-center justify-center space-x-2 transition-colors cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 text-[#9E7D47] shrink-0" />
              {/* 전화번호가 「1588-」 / 「0000」 로 어중간하게 끊기면 유족이
                  다시 읽어야 한다. 라벨과 번호를 나눠 각자 한 줄에 묶는다. */}
              <span className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2 leading-tight">
                <span className="text-[0.8125rem] font-normal whitespace-nowrap">상황실 직통</span>
                <span className="whitespace-nowrap">1588-0000</span>
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* ─── [임종 직후 긴급 분기] 경황없는 현장 유족을 위한 최우선 안심 가이드 ─── */}
      <div className="bg-[#FAF0EF] border-2 border-[#8B2520]/40 rounded-xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-full bg-[#8B2520] text-[#FAF9F6] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
            <PhoneCall className="w-5 h-5 animate-pulse" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-[0.8125rem] font-bold px-2 py-0.5 rounded bg-[#8B2520] text-[#FAF9F6]">
                긴급 상황
              </span>
              <h2 className="font-reverence font-bold text-base sm:text-lg text-[#151719]">
                방금 임종을 맞이하셨습니까?
              </h2>
            </div>
            <p className="text-[0.8125rem] sm:text-sm text-[#5A5E66] leading-relaxed break-words">
              경황없는 슬픔의 순간, 당황하지 마십시오. 24시간 언제든 연락 주시면 국가공인 1급 장례지도사가 2시간 이내에 현장으로 즉시 출동하여 고인의 이송부터 빈소 안치까지 온 마음으로 곁을 지킵니다.
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 pt-2 md:pt-0">
          <button
            type="button"
            onClick={onEnterEmergency}
            className="px-5 py-3 bg-[#8B2520] hover:bg-[#731C18] active:scale-[0.99] text-[#FAF9F6] font-bold text-sm sm:text-base rounded-lg flex items-center justify-center space-x-2 shadow-sm transition-all cursor-pointer"
          >
            <span>24시 긴급 출동 요청</span>
            <ArrowRight className="w-4 h-4 text-[#FAF9F6]" />
          </button>
          <a
            href="tel:1588-0000"
            className="px-4 py-3 bg-[#FFFFFF] hover:bg-[#FAF9F6] text-[#8B2520] border border-[#8B2520]/40 font-bold text-sm sm:text-base rounded-lg flex items-center justify-center space-x-2 transition-colors cursor-pointer"
          >
            <PhoneCall className="w-4 h-4 text-[#8B2520] shrink-0" />
            <span className="whitespace-nowrap">상황실 직통 1588-0000</span>
          </a>
        </div>
      </div>

      {/* ─── 2. 한국상조공제조합(KMACA)형 5대 플로팅 퀵 아이콘 바 ─── */}
      <div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {/* 1. 상조 증서 안심 진단 */}
          <button 
            type="button"
            onClick={onOpenQuoteDiagnostics}
            className="flex flex-col items-center justify-center p-4 sm:p-5 bg-[#FFFFFF] border border-[#DCD6C9] hover:border-[#19382C] rounded-xl shadow-xs hover:shadow-md transition-all group cursor-pointer text-center"
          >
            <div className="w-12 h-12 rounded-full bg-[#FAF9F6] group-hover:bg-[#19382C] flex items-center justify-center mb-3 transition-colors">
              <Calculator className="w-6 h-6 text-[#19382C] group-hover:text-[#FAF9F6] transition-colors" />
            </div>
            <span className="font-bold text-base text-[#151719] group-hover:text-[#19382C] break-words">
              상조 증서 안심 진단
            </span>
            <span className="text-[0.8125rem] text-[#5A5E66] mt-1 break-words">
              가입 상품 1:1 정직한 비교
            </span>
          </button>

          {/* 2. 전국 장례식장 찾기 */}
          <button 
            type="button"
            onClick={onOpenFuneralHallSearch}
            className="flex flex-col items-center justify-center p-4 sm:p-5 bg-[#FFFFFF] border border-[#DCD6C9] hover:border-[#19382C] rounded-xl shadow-xs hover:shadow-md transition-all group cursor-pointer text-center"
          >
            <div className="w-12 h-12 rounded-full bg-[#FAF9F6] group-hover:bg-[#19382C] flex items-center justify-center mb-3 transition-colors">
              <Building2 className="w-6 h-6 text-[#19382C] group-hover:text-[#FAF9F6] transition-colors" />
            </div>
            <span className="font-bold text-base text-[#151719] group-hover:text-[#19382C] break-words">
              장례식장 찾기
            </span>
            <span className="text-[0.8125rem] text-[#5A5E66] mt-1 break-words">
              전국 1,080곳 실시간
            </span>
          </button>

          {/* 3. 100% 정찰 패키지 */}
          <button 
            type="button"
            onClick={onOpenFixedPackages}
            className="flex flex-col items-center justify-center p-4 sm:p-5 bg-[#FFFFFF] border border-[#DCD6C9] hover:border-[#19382C] rounded-xl shadow-xs hover:shadow-md transition-all group cursor-pointer text-center"
          >
            <div className="w-12 h-12 rounded-full bg-[#FAF9F6] group-hover:bg-[#19382C] flex items-center justify-center mb-3 transition-colors">
              <PackageCheck className="w-6 h-6 text-[#19382C] group-hover:text-[#FAF9F6] transition-colors" />
            </div>
            <span className="font-bold text-base text-[#151719] group-hover:text-[#19382C] break-words">
              정찰 패키지
            </span>
            <span className="text-[0.8125rem] text-[#5A5E66] mt-1 break-words">
              투명한 품목 단가 공개
            </span>
          </button>

          {/* 4. 이중안심(二重安心) 등록 */}
          <button 
            type="button"
            onClick={onOpenDualStandby}
            className="flex flex-col items-center justify-center p-4 sm:p-5 bg-[#FFFFFF] border border-[#DCD6C9] hover:border-[#19382C] rounded-xl shadow-xs hover:shadow-md transition-all group cursor-pointer text-center"
          >
            <div className="w-12 h-12 rounded-full bg-[#FAF9F6] group-hover:bg-[#19382C] flex items-center justify-center mb-3 transition-colors">
              <ShieldCheck className="w-6 h-6 text-[#19382C] group-hover:text-[#FAF9F6] transition-colors" />
            </div>
            <span className="font-bold text-base text-[#151719] group-hover:text-[#19382C] break-words">
              이중안심(二重安心)
            </span>
            <span className="text-[0.8125rem] text-[#5A5E66] mt-1 break-words">
              기존 상조 유지 0원 대비
            </span>
          </button>

          {/* 5. 24시 긴급 접수 */}
          <button 
            type="button"
            onClick={onEnterEmergency}
            className="flex flex-col items-center justify-center p-4 sm:p-5 bg-[#FFFFFF] border border-[#DCD6C9] hover:border-[#19382C] rounded-xl shadow-xs hover:shadow-md transition-all group cursor-pointer text-center col-span-2 sm:col-span-1"
          >
            <div className="w-12 h-12 rounded-full bg-[#FAF9F6] group-hover:bg-[#19382C] flex items-center justify-center mb-3 transition-colors">
              <PhoneCall className="w-6 h-6 text-[#19382C] group-hover:text-[#FAF9F6] transition-colors" />
            </div>
            <span className="font-bold text-base text-[#151719] group-hover:text-[#19382C] break-words">
              긴급 상황실
            </span>
            <span className="text-[0.8125rem] text-[#5A5E66] mt-1 break-words">
              전국 2시간 내 도착
            </span>
          </button>
        </div>
      </div>

      {/* ─── 3. KMACA 시그니처 3열 분할 섹션 (영상 스토리 / 2탭 공지·FAQ / 3구 서비스 타일) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── 1열: 미디어 스토리 (영상 다큐) ── */}
        <div className="bg-[#FFFFFF] border border-[#DCD6C9] rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[0.8125rem] font-bold text-[#6E5429]">
                다큐멘터리 극장
              </span>
              <span className="text-[0.8125rem] text-[#5A5E66]">03:45</span>
            </div>

            {/* 비디오 썸네일 카드 & 재생 오버레이 */}
            <div 
              role="button"
              tabIndex={0}
              onClick={() => setIsVideoModalOpen(true)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsVideoModalOpen(true); } }}
              className="relative rounded-lg overflow-hidden h-44 cursor-pointer group bg-[#F1EDE3] border border-[#DCD6C9]"
              aria-label="배웅이 지켜온 약속 다큐멘터리 영상 보기"
            >
              <img 
                src="/images/video_story_thumb.jpg" 
                alt="한옥 창가의 어르신 다큐 영상" 
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-[#0D0E10]/30 group-hover:bg-[#0D0E10]/20 transition-colors flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-[#FFFFFF]/90 group-hover:bg-[#FFFFFF] flex items-center justify-center shadow-md transition-transform group-hover:scale-110">
                  <Play className="w-5 h-5 text-[#19382C] ml-0.5" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-base text-[#151719] break-words">
                배웅이 지켜온 약속: 투명한 장례 이야기
              </h3>
              <p className="text-[0.8125rem] text-[#5A5E66] mt-1.5 leading-relaxed break-words">
                슬픔 속에서도 부당한 비용 청구 없이, 고인의 존엄과 남겨진 가족의 마음을 온전히 지켜낸 실제 현장 기록입니다.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-[#DCD6C9] mt-4 flex items-center justify-between">
<button 
              type="button"
              onClick={() => setIsVideoModalOpen(true)}
              className="k-tap k-tap-pad text-[0.8125rem] font-bold text-[#19382C] hover:text-[#2D4F43] flex items-center"
            >
              <span>영상 시청하기</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <span className="text-[0.8125rem] text-[#5A5E66]">배웅 공식 채널</span>
          </div>
        </div>

        {/* ── 2열: 공지사항 & FAQ (2탭 인터랙션) ── */}
        <div className="bg-[#FFFFFF] border border-[#DCD6C9] rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            {/* 상단 2탭 전환 바 */}
            <div className="flex border-b border-[#DCD6C9] mb-4">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'NOTICE'}
                onClick={() => setActiveTab('NOTICE')}
                className={`flex-1 pb-3 text-sm font-bold text-center border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'NOTICE'
                    ? 'border-[#19382C] text-[#19382C]'
                    : 'border-transparent text-[#5A5E66] hover:text-[#151719]'
                }`}
              >
                <div className="flex items-center justify-center space-x-1.5">
                  <Bell className="w-4 h-4" />
                  <span>공지사항</span>
                </div>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'FAQ'}
                onClick={() => setActiveTab('FAQ')}
                className={`flex-1 pb-3 text-sm font-bold text-center border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'FAQ'
                    ? 'border-[#19382C] text-[#19382C]'
                    : 'border-transparent text-[#5A5E66] hover:text-[#151719]'
                }`}
              >
                <div className="flex items-center justify-center space-x-1.5">
                  <HelpCircle className="w-4 h-4" />
                  <span>자주 묻는 질문</span>
                </div>
              </button>
            </div>

            {/* 탭 내용 */}
            {activeTab === 'NOTICE' ? (
              <ul className="space-y-3">
                <li className="flex items-start justify-between text-[0.8125rem] group cursor-pointer">
                  <span className="text-[#151719] group-hover:text-[#19382C] break-words pr-2">
                    [공지] 2026년 공정위 표준약관 및 투명 실비 공시 가이드 준수 안내
                  </span>
                  <span className="text-[#5A5E66] shrink-0 font-sans">09.28</span>
                </li>
                <li className="flex items-start justify-between text-[0.8125rem] group cursor-pointer">
                  <span className="text-[#151719] group-hover:text-[#19382C] break-words pr-2">
                    [보도] 배웅, 대한민국 최초 공공데이터 실시간 장례식장 연동
                  </span>
                  <span className="text-[#5A5E66] shrink-0 font-sans">09.24</span>
                </li>
                <li className="flex items-start justify-between text-[0.8125rem] group cursor-pointer">
                  <span className="text-[#151719] group-hover:text-[#19382C] break-words pr-2">
                    [안내] 기존 상조 해약 손실 보전 바우처 50만 원 지원 사업
                  </span>
                  <span className="text-[#5A5E66] shrink-0 font-sans">09.20</span>
                </li>
                <li className="flex items-start justify-between text-[0.8125rem] group cursor-pointer">
                  <span className="text-[#151719] group-hover:text-[#19382C] break-words pr-2">
                    [고시] 2026년 상반기 장례용품 정찰 가격표 공시
                  </span>
                  <span className="text-[#5A5E66] shrink-0 font-sans">09.15</span>
                </li>
              </ul>
            ) : (
              <ul className="space-y-3">
                <li 
                  role="button"
                  tabIndex={0}
                  onClick={onOpenDualStandby}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpenDualStandby(); } }}
                  className="p-2.5 rounded-lg bg-[#FAF9F6] border border-[#DCD6C9] group cursor-pointer"
                >
                  <p className="font-bold text-[0.8125rem] text-[#151719] group-hover:text-[#19382C] break-words">
                    Q. 기존 상조를 유지하며 이용할 수 있나요?
                  </p>
                  <p className="text-[0.8125rem] text-[#5A5E66] mt-1 leading-relaxed break-words">
                    A. 네, 0원 이중안심 등록으로 비상 출동권과 손실보전권을 무료 발급해 드립니다.
                  </p>
                </li>
                <li 
                  role="button"
                  tabIndex={0}
                  onClick={onOpenFixedPackages}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpenFixedPackages(); } }}
                  className="p-2.5 rounded-lg bg-[#FAF9F6] border border-[#DCD6C9] group cursor-pointer"
                >
                  <p className="font-bold text-[0.8125rem] text-[#151719] group-hover:text-[#19382C] break-words">
                    Q. 후불제 정산은 언제 이루어지나요?
                  </p>
                  <p className="text-[0.8125rem] text-[#5A5E66] mt-1 leading-relaxed break-words">
                    A. 발인 완료 후 모든 내역을 1원 단위까지 확인하신 후 정산합니다.
                  </p>
                </li>
              </ul>
            )}
          </div>

          <div className="pt-4 border-t border-[#DCD6C9] mt-4 flex items-center justify-between">
            <span className="text-[0.8125rem] font-bold text-[#19382C]">안내 센터</span>
            <span className="text-[0.8125rem] text-[#5A5E66]">평일 09:00~18:00</span>
          </div>
        </div>

        {/* ── 3열: 3구 서비스 타일 카드 (안심 의전 / 바우처 지원 / 시니어 케어) ── */}
        <div className="space-y-3 flex flex-col justify-between">
          {/* 타일 1: 안심 의전 접수 */}
          <button 
            type="button"
            onClick={onEnterEmergency}
            className="flex-1 p-4 bg-[#FFFFFF] border border-[#DCD6C9] hover:border-[#19382C] rounded-xl shadow-xs hover:shadow-sm transition-all flex items-center space-x-3 text-left group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-lg bg-[#19382C]/10 flex items-center justify-center shrink-0">
              <HeartHandshake className="w-5 h-5 text-[#19382C]" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[0.8125rem] font-bold text-[#6E5429]">
                신속 접수
              </span>
              <h4 className="font-bold text-sm text-[#151719] group-hover:text-[#19382C] break-words">
                24시 안심 의전 긴급 신청
              </h4>
              <p className="text-[0.8125rem] text-[#5A5E66] break-words">
                국가공인 1급 지도사 즉시 출동
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-[#5A5E66] group-hover:translate-x-0.5 transition-transform shrink-0" />
          </button>

          {/* 타일 2: 50만 원 손실 보전 지원권 */}
          <button 
            type="button"
            onClick={onOpenVoucher}
            className="flex-1 p-4 bg-[#FFFFFF] border border-[#DCD6C9] hover:border-[#19382C] rounded-xl shadow-xs hover:shadow-sm transition-all flex items-center space-x-3 text-left group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-lg bg-[#9E7D47]/15 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-[#6E5429]" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[0.8125rem] font-bold text-[#6E5429]">
                권익 보호
              </span>
              <h4 className="font-bold text-sm text-[#151719] group-hover:text-[#19382C] break-words">
                50만 원 손실 보전 바우처
              </h4>
              <p className="text-[0.8125rem] text-[#5A5E66] break-words">
                기존 상조 해약 손실금 지원
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-[#5A5E66] group-hover:translate-x-0.5 transition-transform shrink-0" />
          </button>

          {/* 타일 3: 전문 심리상담 */}
          <button 
            type="button"
            onClick={() => onOpenCare('PSYCHOLOGY_CARE')}
            className="flex-1 p-3.5 bg-[#FFFFFF] border border-[#DCD6C9] hover:border-[#19382C] rounded-xl shadow-xs hover:shadow-sm transition-all flex items-center space-x-3 text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-[#19382C]/10 flex items-center justify-center shrink-0">
              <HeartHandshake className="w-5 h-5 text-[#19382C]" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[0.8125rem] font-bold text-[#19382C]">
                심리 케어
              </span>
              <h4 className="font-bold text-sm text-[#151719] group-hover:text-[#19382C] break-words">
                전문 심리상담
              </h4>
              <p className="text-[0.8125rem] text-[#5A5E66] break-words">
                생전 불안 및 유족 애도 치유
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-[#5A5E66] group-hover:translate-x-0.5 transition-transform shrink-0" />
          </button>

          {/* 타일 4: 상속 전문 변호사 */}
          <button 
            type="button"
            onClick={() => onOpenCare('LEGAL_INHERITANCE')}
            className="flex-1 p-3.5 bg-[#FFFFFF] border border-[#DCD6C9] hover:border-[#19382C] rounded-xl shadow-xs hover:shadow-sm transition-all flex items-center space-x-3 text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-[#9E7D47]/15 flex items-center justify-center shrink-0">
              <Scale className="w-5 h-5 text-[#6E5429]" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[0.8125rem] font-bold text-[#6E5429]">
                법률 자문
              </span>
              <h4 className="font-bold text-sm text-[#151719] group-hover:text-[#19382C] break-words">
                상속 전문 변호사
              </h4>
              <p className="text-[0.8125rem] text-[#5A5E66] break-words">
                상속세 및 유산 분할 원스톱 법률
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-[#5A5E66] group-hover:translate-x-0.5 transition-transform shrink-0" />
          </button>
        </div>
      </div>

      {/* ─── 4. 단아한 4대 안심 보증 헌장 배너 ─── */}
      <div className="bg-[#FFFFFF] border border-[#DCD6C9] rounded-xl p-6 sm:p-7 shadow-xs">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-5">
          <div className="inline-flex items-center space-x-1.5 text-[0.8125rem] font-bold text-[#19382C]">
            <TraditionalSeal sealKey="sincerity" size="sm" />
            <span>투명하고 정직한 배웅의 약속</span>
          </div>
          <h3 className="font-reverence font-bold text-xl sm:text-2xl text-[#151719] tracking-tight">
            배웅 4대 의전 안심 헌장
          </h3>
          <p className="text-[0.8125rem] sm:text-sm text-[#5A5E66] leading-relaxed break-words">
            고인의 고귀한 삶을 기리는 숭고한 자리에 상술이 없도록 모든 의전과 비용은 1원 단위까지 투명하게 공개합니다.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-[#FAF9F6] border border-[#DCD6C9] rounded-lg text-center">
            <CheckCircle2 className="w-4 h-4 text-[#19382C] mx-auto mb-1.5" />
            <div className="font-bold text-sm text-[#151719] break-words">선금 0원 후불제</div>
            <div className="text-[0.8125rem] text-[#5A5E66] mt-0.5 break-words">의전 종료 후 정산</div>
          </div>
          <div className="p-3 bg-[#FAF9F6] border border-[#DCD6C9] rounded-lg text-center">
            <CheckCircle2 className="w-4 h-4 text-[#19382C] mx-auto mb-1.5" />
            <div className="font-bold text-sm text-[#151719] break-words">부당 추가금 0원</div>
            <div className="text-[0.8125rem] text-[#5A5E66] mt-0.5 break-words">계약 외 비용 청구 차단</div>
          </div>
          <div className="p-3 bg-[#FAF9F6] border border-[#DCD6C9] rounded-lg text-center">
            <CheckCircle2 className="w-4 h-4 text-[#19382C] mx-auto mb-1.5" />
            <div className="font-bold text-sm text-[#151719] break-words">촌지 전면 금지</div>
            <div className="text-[0.8125rem] text-[#5A5E66] mt-0.5 break-words">수고비 관행 근절</div>
          </div>
          <div className="p-3 bg-[#FAF9F6] border border-[#DCD6C9] rounded-lg text-center">
            <CheckCircle2 className="w-4 h-4 text-[#19382C] mx-auto mb-1.5" />
            <div className="font-bold text-sm text-[#151719] break-words">100% 품목 공개</div>
            <div className="text-[0.8125rem] text-[#5A5E66] mt-0.5 break-words">공공데이터 실비 대조</div>
          </div>
        </div>
      </div>

      {/* ─── 5. 비디오 다큐멘터리 모달 (접근성 공용 셸 적용) ─── */}
      {isVideoModalOpen && (
        <ModalShell
          onClose={() => setIsVideoModalOpen(false)}
          titleId="video-story-modal-title"
          maxWidth="max-w-2xl"
          surface="white"
        >
          <div className="p-6 space-y-4 font-serif">
            <div className="flex items-center justify-between border-b border-[#DCD6C9] pb-3">
              <h3 id="video-story-modal-title" className="font-reverence font-bold text-lg text-[#151719]">
                다큐멘터리: 배웅이 지켜온 약속
              </h3>
              <button 
                type="button"
                onClick={() => setIsVideoModalOpen(false)}
                className="p-1 rounded-lg hover:bg-[#FAF9F6] text-[#5A5E66] hover:text-[#151719] cursor-pointer"
                aria-label="닫기"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative rounded-xl overflow-hidden bg-[#0D0E10] aspect-video flex items-center justify-center">
              <img 
                src="/images/video_story_thumb.jpg" 
                alt="배웅 다큐멘터리 영상 미리보기" 
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#FFFFFF]/90 flex items-center justify-center shadow-lg">
                  <Play className="w-7 h-7 text-[#19382C] ml-1" />
                </div>
                <p className="text-[#FAF9F6] font-bold text-base drop-shadow-sm">
                  “단 한 분의 어르신도 소홀함 없이 모십니다”
                </p>
                <p className="text-[0.8125rem] text-[#FAF9F6]/80 max-w-md">
                  상조 불법 리베이트 0원, 국가공인 1급 지도사의 72시간 동행 다큐멘터리
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(false)}
                className="px-5 py-2 bg-[#19382C] hover:bg-[#2D4F43] text-[#FAF9F6] font-bold text-sm rounded-lg cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        </ModalShell>
      )}
    </div>
  );
};
