import React, { useState } from 'react';
import {
  X,
  Printer,
  Play,
  Share2,
  ThumbsUp,
  MessageCircle,
  Eye,
  CheckCircle2,
  Film,
  Sparkles,
  ShieldCheck,
  Send,
  Building2,
  Smartphone,
  ExternalLink,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { useModalA11y } from './ModalShell.js';
import {
  ShortformService,
  ShortformContentEntity,
  ShortformTheme,
  ShortformPlatform,
  ShortformAggregateOverview
} from '../../shortform/index.js';
import { FuneralHallService } from '../../funeral-halls/funeralHallService.js';
import { TraditionalSeal } from '../design-system/index.js';

interface ShortformShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialHallId?: string;
  initialTab?: 'portfolio' | 'platforms' | 'apply';
}

export const ShortformShowcaseModal: React.FC<ShortformShowcaseModalProps> = ({
  isOpen,
  onClose,
  initialHallId,
  initialTab = 'portfolio'
}) => {
  // 모달 접근성 계약: 모든 훅을 if (!isOpen) return null 전에 최상단 호출
  const { overlayProps, panelProps } = useModalA11y(onClose, isOpen);
  const [activeTab, setActiveTab] = useState<'portfolio' | 'platforms' | 'apply'>(initialTab);
  const [selectedTheme, setSelectedTheme] = useState<ShortformTheme | 'ALL'>('ALL');
  const [activeVideoId, setActiveVideoId] = useState<string>('sf-guide-family-01');

  // 제작 신청 폼 상태
  const pilotHalls = FuneralHallService.getPilotRegionHalls();
  const [applicantHallId, setApplicantHallId] = useState(initialHallId || pilotHalls[0]?.id || '');
  const [applicantRole, setApplicantRole] = useState('사무장');
  const [applicantPhone, setApplicantPhone] = useState('010-0000-0000');
  const [appliedThemes, setAppliedThemes] = useState<ShortformTheme[]>(['HALL_VIRTUAL_TOUR']);
  const [filmingPref, setFilmingPref] = useState<'VISIT_FILMING' | 'ASSET_PROVIDED'>('VISIT_FILMING');
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  // 데이터 조회
  const portfolio = ShortformService.getPortfolio(selectedTheme === 'ALL' ? undefined : selectedTheme);
  const activeVideo = ShortformService.getContentById(activeVideoId) || portfolio[0];
  const overview: ShortformAggregateOverview = ShortformService.getAggregateOverview();

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hall = pilotHalls.find((h) => h.id === applicantHallId) || pilotHalls[0];

    ShortformService.submitProductionRequest({
      hallId: hall.id,
      hallName: hall.name,
      applicantRole,
      applicantPhone,
      selectedThemes: appliedThemes,
      targetPlatforms: ['YOUTUBE_SHORTS', 'INSTAGRAM_REELS'],
      filmingPreference: filmingPref
    });

    setSubmitMessage(`[${hall.name}] 숏폼 제작 대행 신청이 접수되었습니다. 전담 영상팀이 24시간 내 일정 조율 연락을 드립니다.`);
    setTimeout(() => {
      setSubmitMessage(null);
    }, 4000);
  };

  const toggleThemeSelection = (theme: ShortformTheme) => {
    if (appliedThemes.includes(theme)) {
      if (appliedThemes.length > 1) {
        setAppliedThemes(appliedThemes.filter((t) => t !== theme));
      }
    } else {
      setAppliedThemes([...appliedThemes, theme]);
    }
  };

  return (
    <div {...overlayProps} onKeyDown={panelProps.onKeyDown} className="fixed inset-0 z-50 bg-[#0D0E10]/85 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto font-serif">
      <div {...panelProps} className="bg-[#FAF9F6] rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl border border-[#DCD6C9] flex flex-col my-auto max-h-[96vh]">
        {/* 상단 컨트롤 툴바 (no-print) */}
        <div className="no-print bg-[#141618] text-[#FAF9F6] p-4 px-6 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-[#19382C] text-[#C2A26A] flex items-center justify-center border border-[#2D4F43]">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-reverence font-bold text-base text-[#FAF9F6] flex items-center space-x-2">
                <span>배웅 숏폼(Short-form) 콘텐츠 제작·배포 쇼케이스</span>
                <span className="text-[13px] font-mono font-normal text-[#C2A26A] bg-[#19382C] px-2 py-0.5 rounded border border-[#2D4F43]">
                  유튜브·인스타·틱톡 3사 배포
                </span>
              </h3>
              <p className="text-[13px] text-[#A8B2A9]">
                사업계획서 3.2절 프리미엄 제작 대행 · 7.2절 자체 트래킹 지표 활용
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="p-2 sm:px-3 sm:py-1.5 rounded-lg bg-[#19382C] hover:bg-[#2D4F43] text-[#FAF9F6] text-[13px] font-serif flex items-center space-x-1.5 transition-colors cursor-pointer border border-[#2D4F43]"
            >
              <Printer className="w-4 h-4 text-[#C2A26A]" />
              <span className="hidden sm:inline">제작 안내서 인쇄</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-[#FAF9F6]/10 hover:bg-[#FAF9F6]/20 text-[#FAF9F6] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="no-print bg-[#FFFFFF] border-b border-[#DCD6C9] px-4 sm:px-6 flex overflow-x-auto text-[13px] font-medium">
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`py-3 px-4 border-b-2 font-bold whitespace-nowrap cursor-pointer transition-all flex items-center space-x-1.5 ${
              activeTab === 'portfolio'
                ? 'border-[#19382C] text-[#19382C]'
                : 'border-transparent text-[#5A5E66] hover:text-[#151719]'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>숏폼 콘텐츠 포트폴리오 (4대 테마)</span>
          </button>
          <button
            onClick={() => setActiveTab('platforms')}
            className={`py-3 px-4 border-b-2 font-bold whitespace-nowrap cursor-pointer transition-all flex items-center space-x-1.5 ${
              activeTab === 'platforms'
                ? 'border-[#19382C] text-[#19382C]'
                : 'border-transparent text-[#5A5E66] hover:text-[#151719]'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>플랫폼별 지표 분석 & 표시광고법 준수</span>
          </button>
          <button
            onClick={() => setActiveTab('apply')}
            className={`py-3 px-4 border-b-2 font-bold whitespace-nowrap cursor-pointer transition-all flex items-center space-x-1.5 ${
              activeTab === 'apply'
                ? 'border-[#19382C] text-[#19382C]'
                : 'border-transparent text-[#5A5E66] hover:text-[#151719]'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>숏폼 제작 대행 및 결합 번들 신청</span>
          </button>
        </div>

        {/* 본문 영역 */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-[#151719] bg-[#FAF9F6] relative">
          <div className="pointer-events-none absolute inset-0 k-pattern-gyeokja opacity-15" />

          {/* 탭 1: 숏폼 포트폴리오 쇼케이스 */}
          {activeTab === 'portfolio' && (
            <div className="relative z-10 space-y-6">
              {/* 상단 통계 요약 칩 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-[#FFFFFF] p-3 rounded-xl border border-[#DCD6C9]">
                  <span className="text-[13px] text-[#5A5E66] block">누적 제작 편수</span>
                  <span className="font-reverence font-bold text-xl text-[#141618]">{overview.totalProducedCount}개 작품</span>
                </div>
                <div className="bg-[#FFFFFF] p-3 rounded-xl border border-[#DCD6C9]">
                  <span className="text-[13px] text-[#5A5E66] block">편당 평균 조회수</span>
                  <span className="font-reverence font-bold text-xl text-[#19382C]">{overview.avgViewsPerVideo.toLocaleString()}회</span>
                </div>
                <div className="bg-[#FFFFFF] p-3 rounded-xl border border-[#DCD6C9]">
                  <span className="text-[13px] text-[#5A5E66] block">평균 시청 참여율</span>
                  <span className="font-reverence font-bold text-xl text-[#6E5429]">{overview.avgEngagementRate}%</span>
                </div>
                <div className="bg-[#FFFFFF] p-3 rounded-xl border border-[#DCD6C9]">
                  <span className="text-[13px] text-[#5A5E66] block">프로필 링크 클릭</span>
                  <span className="font-reverence font-bold text-xl text-[#19382C]">{overview.totalProfileClicks.toLocaleString()}건</span>
                </div>
              </div>

              {/* 테마 필터 칩 */}
              <div className="flex gap-1.5 overflow-x-auto text-[13px]">
                {[
                  { key: 'ALL', label: '전체 보기' },
                  { key: 'FAMILY_FUNERAL_GUIDE', label: '가족장 절차 가이드' },
                  { key: 'HALL_VIRTUAL_TOUR', label: '시설 랜선 투어' },
                  { key: 'ETIQUETTE_DRESS_CODE', label: '현대적 조문 예절' },
                  { key: 'DIRECT_CREMATION_CHECK', label: '무빈소 체크리스트' }
                ].map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setSelectedTheme(t.key as any)}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer transition-all ${
                      selectedTheme === t.key
                        ? 'bg-[#19382C] text-[#FAF9F6] font-bold shadow-xs'
                        : 'bg-[#FFFFFF] text-[#5A5E66] border border-[#DCD6C9] hover:bg-[#FAF9F6]'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* 비디오 뷰어 & 리스트 2열 레이아웃 */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* 좌측: 스마트폰 9:16 비주얼 시뮬레이터 */}
                <div className="md:col-span-5 flex flex-col items-center">
                  <div className="w-64 sm:w-72 bg-[#141618] rounded-3xl p-3 border-4 border-[#3D382E] shadow-xl relative overflow-hidden flex flex-col justify-between aspect-[9/16]">
                    {/* 상단 노치 & 스피커 */}
                    <div className="flex justify-between items-center px-3 pt-1 text-[13px] text-white/60">
                      <span>배웅 Shorts</span>
                      <span className="text-[13px] font-mono text-[#C2A26A]">{activeVideo.durationSeconds}초</span>
                    </div>

                    {/* 영상 재생 시뮬레이션 화면 */}
                    <div className="flex-1 flex flex-col justify-center items-center text-center p-4 text-[#FAF9F6] relative">
                      <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center border border-white/30 mb-3 shadow-md">
                        <Play className="w-7 h-7 text-white fill-white ml-1" />
                      </div>
                      <span className="text-[13px] font-bold text-[#C2A26A] bg-black/40 px-2.5 py-1 rounded-full mb-1">
                        {activeVideo.themeLabel}
                      </span>
                      <h4 className="font-reverence font-bold text-sm text-[#FAF9F6] leading-snug">
                        {activeVideo.title}
                      </h4>
                    </div>

                    {/* 하단 오버레이 정보 */}
                    <div className="p-3 bg-gradient-to-t from-black/90 to-transparent rounded-2xl text-white space-y-1.5 text-[13px]">
                      <div className="font-bold text-[#FAF9F6]">{activeVideo.hallName}</div>
                      <p className="text-[13px] text-white/80 line-clamp-2">
                        {activeVideo.scriptSummary}
                      </p>
                      <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[13px] text-[#A8B2A9]">
                        <span className="flex items-center space-x-1">
                          <Eye className="w-3.5 h-3.5 text-[#C2A26A]" />
                          <span>{activeVideo.metrics.views.toLocaleString()}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>{activeVideo.metrics.likes.toLocaleString()}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>{activeVideo.metrics.comments}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 우측: 상세 명세 및 시나리오 */}
                <div className="md:col-span-7 space-y-4">
                  <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#DCD6C9] space-y-3 shadow-xs">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className="text-[13px] font-bold text-[#19382C] bg-[#DCE8E2] px-2.5 py-0.5 rounded border border-[#DCE8E2]">
                          {activeVideo.themeLabel}
                        </span>
                        <h3 className="font-reverence font-bold text-lg text-[#141618] mt-1.5">
                          {activeVideo.title}
                        </h3>
                        <div className="text-[13px] text-[#5A5E66] mt-0.5">
                          배포처: <b>{activeVideo.hallName}</b> | 배포일: {activeVideo.publishedDate}
                        </div>
                      </div>
                      <TraditionalSeal sealKey="truth" size="sm" />
                    </div>

                    <div className="border-t border-[#DCD6C9] pt-3 space-y-2 text-[13px]">
                      <div className="font-bold text-[#151719]">45초 핵심 시나리오 구성:</div>
                      <p className="text-[#42464E] bg-[#FAF9F6] p-3 rounded-lg border border-[#DCD6C9] leading-relaxed">
                        {activeVideo.scriptSummary}
                      </p>
                    </div>

                    <div className="space-y-1.5 text-[13px]">
                      <div className="font-bold text-[#151719]">SNS 게시용 캡션 템플릿:</div>
                      <p className="text-[#5A5E66] bg-[#FAF9F6] p-2.5 rounded border border-[#DCD6C9] font-mono text-[13px]">
                        {activeVideo.captionTemplate}
                      </p>
                    </div>

                    {/* 표시광고법 준수 고지 */}
                    <div className="p-2.5 bg-[#FAF9F6] border border-[#F1E9DB] rounded text-[13px] text-[#6E5429]">
                      {activeVideo.complianceDisclaimer}
                    </div>
                  </div>

                  {/* 포트폴리오 리스트 썸네일 카드들 */}
                  <div className="space-y-2">
                    <div className="font-bold text-[13px] text-[#141618]">포트폴리오 영상 선택:</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {portfolio.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setActiveVideoId(item.id)}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            activeVideoId === item.id
                              ? 'border-2 border-[#19382C] bg-[#FAF9F6] shadow-xs'
                              : 'border-[#DCD6C9] bg-[#FFFFFF] hover:bg-[#FAF9F6]'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[13px] font-bold text-[#19382C]">{item.themeLabel}</span>
                            <span className="text-[13px] text-[#5A5E66] font-mono">{item.durationSeconds}초</span>
                          </div>
                          <div className="font-bold text-sm text-[#141618] line-clamp-1">{item.title}</div>
                          <div className="text-[13px] text-[#5A5E66] mt-1 flex justify-between">
                            <span>조회 {item.metrics.views.toLocaleString()}회</span>
                            <span className="text-[#6E5429]">참여 {item.metrics.engagementRate}%</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 탭 2: 플랫폼별 지표 분석 & 표시광고법 */}
          {activeTab === 'platforms' && (
            <div className="relative z-10 space-y-6">
              <div className="border-b-2 border-[#151719] pb-4">
                <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded bg-[#19382C]/10 text-[#19382C] text-[13px] font-bold mb-1 border border-[#19382C]/20">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>사업계획서 7.2절 지표 연계 표준</span>
                </div>
                <h2 className="font-reverence font-black text-2xl text-[#141618]">
                  플랫폼 자체 지표 활용 및 표시광고법 준수 체계
                </h2>
                <p className="text-[13px] text-[#5A5E66] mt-1 font-serif">
                  유튜브·인스타그램·틱톡의 공식 지표를 활용하여 별도 트래킹 구축 부담 없이 홍보 효과를 투명하게 증명합니다.
                </p>
              </div>

              {/* 표시광고법 성과 비보장 원칙 배너 */}
              <div className="p-4 bg-[#DCE8E2] border border-[#DCE8E2] rounded-xl flex items-start space-x-3 text-[13px] leading-relaxed font-serif text-[#19382C]">
                <ShieldCheck className="w-5 h-5 shrink-0 text-[#19382C] mt-0.5" />
                <div>
                  <b>[표시광고법 대응 원칙] 성과 "보장" 표현 금지 및 사실적 데이터 공개:</b><br />
                  배웅은 「표시·광고의 공정화에 관한 법률」을 준수하여 <i>"무조건 조회수 10만 회 보장", "매출 10배 확정"</i> 등의 기만적 표현을 절대 사용하지 않습니다.
                  오직 과거 유사 시범 사례의 <b>실제 평균 조회수(3.4만~5.8만 회)</b>와 플랫폼 애널리틱스 공식 지표만을 정직하게 공개합니다.
                </div>
              </div>

              {/* 3대 플랫폼 특성 및 지표 카드 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[13px] font-serif">
                {/* 유튜브 쇼츠 */}
                <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#DCD6C9] space-y-3 shadow-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-base text-[#141618]">YouTube Shorts</span>
                    <span className="text-[13px] font-bold text-[#19382C] bg-[#DCE8E2] px-2 py-0.5 rounded">
                      검색 유입 1위
                    </span>
                  </div>
                  <div className="space-y-1 text-[#42464E]">
                    <div className="flex justify-between">
                      <span className="text-[#5A5E66]">주요 타깃:</span>
                      <span className="font-bold">40~60대 유족 및 상주</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5A5E66]">평균 조회수:</span>
                      <span className="font-bold text-[#19382C]">35,000 ~ 60,000회</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5A5E66]">효과 특성:</span>
                      <span>지역 검색 및 시설 랜선투어 최적화</span>
                    </div>
                  </div>
                  <p className="text-[13px] text-[#5A5E66] border-t border-[#DCD6C9] pt-2 leading-relaxed">
                    유튜브 검색 알고리즘과 연계되어 ‘지역명+장례식장’ 탐색 유족에게 장기적으로 지속 노출됩니다.
                  </p>
                </div>

                {/* 인스타그램 릴스 */}
                <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#DCD6C9] space-y-3 shadow-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-base text-[#141618]">Instagram Reels</span>
                    <span className="text-[13px] font-bold text-[#6E5429] bg-[#F1E9DB] px-2 py-0.5 rounded">
                      참여·공유 1위
                    </span>
                  </div>
                  <div className="space-y-1 text-[#42464E]">
                    <div className="flex justify-between">
                      <span className="text-[#5A5E66]">주요 타깃:</span>
                      <span className="font-bold">20~40대 자녀 세대 및 조문객</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5A5E66]">평균 참여율:</span>
                      <span className="font-bold text-[#6E5429]">7.2% (저장·공유 빈도 높음)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5A5E66]">효과 특성:</span>
                      <span>조문 예절 및 정갈한 분위기 브랜딩</span>
                    </div>
                  </div>
                  <p className="text-[13px] text-[#5A5E66] border-t border-[#DCD6C9] pt-2 leading-relaxed">
                    젊은 유족들이 부모님 장례를 준비할 때 카드뉴스처럼 저장하고 친지들에게 전달하는 채널입니다.
                  </p>
                </div>

                {/* 틱톡 */}
                <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#DCD6C9] space-y-3 shadow-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-base text-[#141618]">TikTok</span>
                    <span className="text-[13px] font-bold text-[#5A5E66] bg-[#FAF9F6] px-2 py-0.5 rounded border border-[#DCD6C9]">
                      바이럴 확산
                    </span>
                  </div>
                  <div className="space-y-1 text-[#42464E]">
                    <div className="flex justify-between">
                      <span className="text-[#5A5E66]">주요 타깃:</span>
                      <span className="font-bold">모바일 세대 전체</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5A5E66]">평균 시청 시간:</span>
                      <span className="font-bold">평균 38초 완시청</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5A5E66]">효과 특성:</span>
                      <span>상식 퀴즈 및 오해 바로잡기 콘텐츠</span>
                    </div>
                  </div>
                  <p className="text-[13px] text-[#5A5E66] border-t border-[#DCD6C9] pt-2 leading-relaxed">
                    ‘장례 비용의 진실’, ‘봉투 작성법’ 등 정보성 팁이 높은 알고리즘 추천을 유발합니다.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 탭 3: 숏폼 제작 대행 및 번들 신청 */}
          {activeTab === 'apply' && (
            <div className="relative z-10 space-y-6">
              <div className="border-b-2 border-[#151719] pb-4">
                <h2 className="font-reverence font-black text-2xl text-[#141618]">
                  숏폼 콘텐츠 제작 대행 및 지역 노출 결합 번들 신청
                </h2>
                <p className="text-[13px] text-[#5A5E66] mt-1 font-serif">
                  사업계획서 3.2절: 월 500,000원 결합 번들 선택 시 지역 우선 노출과 맞춤 숏폼 제작 월 2편이 패키지로 제공됩니다.
                </p>
              </div>

              {submitMessage && (
                <div className="p-3.5 bg-[#DCE8E2] border border-[#DCE8E2] rounded-xl text-[13px] font-bold text-[#19382C] flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#19382C]" />
                  <span>{submitMessage}</span>
                </div>
              )}

              <form onSubmit={handleApplySubmit} className="p-5 sm:p-6 bg-[#FFFFFF] rounded-xl border border-[#DCD6C9] space-y-4 text-[13px]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* 신청 장례식장 */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-[#141618] block">신청 장례식장</label>
                    <select
                      value={applicantHallId}
                      onChange={(e) => setApplicantHallId(e.target.value)}
                      className="w-full p-2.5 bg-[#FAF9F6] border border-[#DCD6C9] rounded-lg text-[#151719] focus:outline-none focus:border-[#19382C]"
                    >
                      {pilotHalls.map((h) => (
                        <option key={h.id} value={h.id}>
                          {h.name} ({h.pilotDistrict || h.subRegion})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 담당자 연락처 */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-[#141618] block">담당자 직책 및 연락처</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={applicantRole}
                        onChange={(e) => setApplicantRole(e.target.value)}
                        placeholder="사무장 / 대표"
                        className="w-28 p-2.5 bg-[#FAF9F6] border border-[#DCD6C9] rounded-lg text-[#151719]"
                      />
                      <input
                        type="text"
                        value={applicantPhone}
                        onChange={(e) => setApplicantPhone(e.target.value)}
                        placeholder="010-0000-0000"
                        className="flex-1 p-2.5 bg-[#FAF9F6] border border-[#DCD6C9] rounded-lg text-[#151719]"
                      />
                    </div>
                  </div>
                </div>

                {/* 제작 희망 테마 다중 선택 */}
                <div className="space-y-1.5 pt-1">
                  <label className="font-bold text-[#141618] block">
                    제작 희망 주제 (복수 선택 가능)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { theme: 'HALL_VIRTUAL_TOUR' as ShortformTheme, label: '장례식장 시설 및 분향실 랜선 투어', desc: '분향실 규모, 주차, 편의시설 집중 홍보' },
                      { theme: 'FAMILY_FUNERAL_GUIDE' as ShortformTheme, label: '가족장·정찰제 비용 안내 가이드', desc: '불필요한 추가금 없는 정직한 실비 투명 안내' },
                      { theme: 'DIRECT_CREMATION_CHECK' as ShortformTheme, label: '무빈소 직송 절차 가이드', desc: '수도권 승화원 연계 및 안치실 사용 절차' },
                      { theme: 'ETIQUETTE_DRESS_CODE' as ShortformTheme, label: '조문객 에티켓 및 부고장 연계', desc: '시설 브랜드 인지도 제고용 공익 콘텐츠' }
                    ].map((item) => (
                      <button
                        key={item.theme}
                        type="button"
                        onClick={() => toggleThemeSelection(item.theme)}
                        className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                          appliedThemes.includes(item.theme)
                            ? 'border-2 border-[#19382C] bg-[#FAF9F6]'
                            : 'border-[#DCD6C9] bg-[#FFFFFF] hover:bg-[#FAF9F6]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#141618]">{item.label}</span>
                          <span className={`text-[13px] font-bold ${appliedThemes.includes(item.theme) ? 'text-[#19382C]' : 'text-[#5A5E66]'}`}>
                            {appliedThemes.includes(item.theme) ? '✓ 선택됨' : '선택'}
                          </span>
                        </div>
                        <span className="text-[13px] text-[#5A5E66] block mt-0.5">{item.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 촬영 방식 선택 */}
                <div className="space-y-1.5 pt-1">
                  <label className="font-bold text-[#141618] block">촬영 선호 방식</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className={`p-3 rounded-lg border flex items-center space-x-2.5 cursor-pointer ${filmingPref === 'VISIT_FILMING' ? 'border-[#19382C] bg-[#FAF9F6]' : 'border-[#DCD6C9]'}`}>
                      <input
                        type="radio"
                        name="filming"
                        checked={filmingPref === 'VISIT_FILMING'}
                        onChange={() => setFilmingPref('VISIT_FILMING')}
                        className="text-[#19382C] focus:ring-0"
                      />
                      <div>
                        <span className="font-bold text-[#141618] block">배웅 전담 촬영팀 현장 방문</span>
                        <span className="text-[13px] text-[#5A5E66]">전문 촬영 감독이 방문하여 1시간 내 촬영 완료</span>
                      </div>
                    </label>

                    <label className={`p-3 rounded-lg border flex items-center space-x-2.5 cursor-pointer ${filmingPref === 'ASSET_PROVIDED' ? 'border-[#19382C] bg-[#FAF9F6]' : 'border-[#DCD6C9]'}`}>
                      <input
                        type="radio"
                        name="filming"
                        checked={filmingPref === 'ASSET_PROVIDED'}
                        onChange={() => setFilmingPref('ASSET_PROVIDED')}
                        className="text-[#19382C] focus:ring-0"
                      />
                      <div>
                        <span className="font-bold text-[#141618] block">보유 사진·영상 자료 제공</span>
                        <span className="text-[13px] text-[#5A5E66]">기존 보유하신 시설 사진을 편집·자막 그래픽화</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* 정액 요율 안내 및 제출 */}
                <div className="p-3.5 bg-[#FAF9F6] border border-[#F1E9DB] rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-3">
                  <div>
                    <span className="font-bold text-[#19382C] block">결합 번들 요금: 월 500,000원 (정액제)</span>
                    <span className="text-[13px] text-[#6E5429]">
                      시범 권역 지역 우선 노출(월 30만 원) + 숏폼 월 2편 제작 대행(20만 원 상당) 패키지
                    </span>
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#19382C] hover:bg-[#2D4F43] text-white rounded-lg font-bold flex items-center space-x-1.5 transition-colors cursor-pointer shrink-0"
                  >
                    <Send className="w-4 h-4" />
                    <span>숏폼 제작 대행 신청하기</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* 하단 고정 툴바 */}
        <div className="no-print bg-[#FAF9F6] p-4 px-6 border-t border-[#DCD6C9] flex items-center justify-between shrink-0 text-[13px]">
          <span className="text-[#5A5E66]">
            제작 문의: shortform@baeung.kr · 전담 프로덕션 핫라인 1588-0000
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#19382C] hover:bg-[#2D4F43] text-white rounded font-bold transition-colors cursor-pointer"
          >
            확인 (닫기)
          </button>
        </div>
      </div>
    </div>
  );
};
