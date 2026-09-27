import React, { useState, useMemo } from 'react';
import { useModalA11y } from './ModalShell.js';
import {
  X,
  Scale,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Phone,
  Clock,
  Building2,
  Sparkles,
  HeartHandshake,
  UserCheck,
  Timer,
  FileText,
  Info,
  ChevronRight,
  ExternalLink,
  Award
} from 'lucide-react';
import {
  ProfessionalCareService,
  ProfessionalProfile,
  CareVertical,
  CareCategory,
  InheritanceDeadlines,
  ConsultationBookingResult
} from '../../professional-care/index.js';

interface ProfessionalCareModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialVertical?: CareVertical;
}

export const ProfessionalCareModal: React.FC<ProfessionalCareModalProps> = ({
  isOpen,
  onClose,
  initialVertical = 'PSYCHOLOGY_CARE'
}) => {
  // 공용 셸과 동일한 모달 접근성 계약 (포커스 트랩 · ESC · aria-modal)
  const { overlayProps, panelProps } = useModalA11y(onClose, isOpen);
  const [activeVertical, setActiveVertical] = useState<CareVertical>(initialVertical);
  const [selectedCategory, setSelectedCategory] = useState<CareCategory | 'ALL'>('ALL');

  // 상속 3개월 골든타임 계산기 상태
  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const defaultDeathDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 18); // 기본값: 약 18일 전 임종
    return d.toISOString().slice(0, 10);
  }, []);
  const [deathDateInput, setDeathDateInput] = useState<string>(defaultDeathDate);

  // 예약 신청 모달 상태
  const [bookingTarget, setBookingTarget] = useState<ProfessionalProfile | null>(null);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [memo, setMemo] = useState('');
  const [agreedZeroCommission, setAgreedZeroCommission] = useState(true);
  const [privacyAgreed, setPrivacyAgreed] = useState(true);
  const [bookingResult, setBookingResult] = useState<ConsultationBookingResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 상속 기한 계산 결과
  // ⚠️ isOpen 조기 반환보다 위여야 한다. 아래에 두면 「닫힘→열림」 전이에서
  //    훅 개수가 늘어 React #310 (Rendered more hooks) 이 발생해
  //    화면 전체가 백화면으로 죽는다.
  const inheritanceDeadlines: InheritanceDeadlines | null = useMemo(() => {
    try {
      if (!deathDateInput) return null;
      return ProfessionalCareService.calculateInheritanceDeadlines(deathDateInput);
    } catch {
      return null;
    }
  }, [deathDateInput]);

  if (!isOpen) return null;

  // 전문가 목록 필터링
  const professionals = ProfessionalCareService.getProfessionalsByVertical(activeVertical).filter((p) => {
    if (selectedCategory === 'ALL') return true;
    return p.category === selectedCategory;
  });

  const handleOpenBooking = (profile: ProfessionalProfile) => {
    setBookingTarget(profile);
    setBookingResult(null);
    setErrorMessage(null);
    setMemo('');
  };

  const handleCloseBooking = () => {
    setBookingTarget(null);
    setBookingResult(null);
    setErrorMessage(null);
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingTarget) return;

    try {
      setErrorMessage(null);
      const res = ProfessionalCareService.bookConsultation({
        clientName: clientName || '신청자',
        clientPhone: clientPhone || '010-0000-0000',
        professionalId: bookingTarget.id,
        targetCategory: bookingTarget.category,
        preferredDate: preferredDate || todayStr,
        memo: memo || '안심 1:1 상담 신청',
        agreedToZeroCommission: agreedZeroCommission,
        privacyAgreed: privacyAgreed
      });
      setBookingResult(res);
    } catch (err: any) {
      setErrorMessage(err.message || '예약 신청 중 오류가 발생했습니다.');
    }
  };


  return (
    <div {...overlayProps} onKeyDown={panelProps.onKeyDown} className="fixed inset-0 z-50 bg-[#0D0E10]/85 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto font-serif">
      <div {...panelProps} className="bg-[#FAF9F6] rounded-2xl max-w-5xl w-full overflow-hidden shadow-2xl border border-[#DCD6C9] flex flex-col my-auto max-h-[94vh]">
        {/* 1. 상단 타이틀 툴바 */}
        <div className="bg-[#141618] text-[#FAF9F6] p-4 px-6 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-[#19382C] text-[#C2A26A] flex items-center justify-center border border-[#2D4F43] shrink-0">
              {activeVertical === 'PSYCHOLOGY_CARE' ? (
                <HeartHandshake className="w-5 h-5" />
              ) : (
                <Scale className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[13px] font-serif text-[#C2A26A] font-bold">
                  心理 · 法律 專業諮問
                </span>
                <span className="bg-[#2D4F43] text-[#FAF9F6] text-[13px] px-2 py-0.5 rounded font-mono font-bold">
                  중개수수료 0원 공공 안심 연결
                </span>
              </div>
              <h3 className="font-reverence font-bold text-base sm:text-lg text-[#FAF9F6] leading-tight">
                생전·유족 전문 심리상담 & 상속·유산 전문 변호사 안심 연계
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#A8B2A9] hover:text-[#FAF9F6] hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. 버티컬 대분류 전환 탭 (심리케어 vs 법률상속) */}
        <div className="bg-[#FAF9F6] border-b border-[#5A5E66] px-6 pt-3 flex items-center justify-between gap-4 shrink-0 overflow-x-auto">
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setActiveVertical('PSYCHOLOGY_CARE');
                setSelectedCategory('ALL');
              }}
              className={`pb-3 px-4 font-reverence font-bold text-sm sm:text-base border-b-2 flex items-center space-x-2 transition-all cursor-pointer whitespace-nowrap ${
                activeVertical === 'PSYCHOLOGY_CARE'
                  ? 'border-[#19382C] text-[#19382C]'
                  : 'border-transparent text-[#5A5E66] hover:text-[#151719]'
              }`}
            >
              <HeartHandshake className="w-4 h-4" />
              <span>🌿 생전 마음돌봄 & 사별 애도 심리상담</span>
            </button>
            <button
              onClick={() => {
                setActiveVertical('LEGAL_INHERITANCE');
                setSelectedCategory('ALL');
              }}
              className={`pb-3 px-4 font-reverence font-bold text-sm sm:text-base border-b-2 flex items-center space-x-2 transition-all cursor-pointer whitespace-nowrap ${
                activeVertical === 'LEGAL_INHERITANCE'
                  ? 'border-[#19382C] text-[#19382C]'
                  : 'border-transparent text-[#5A5E66] hover:text-[#151719]'
              }`}
            >
              <Scale className="w-4 h-4" />
              <span>⚖️ 상속·유산·채무정리 전문 변호사 상담</span>
            </button>
          </div>

          <span className="hidden md:inline-flex text-[13px] text-[#5A5E66] font-serif items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#19382C]" />
            <span>변호사법 제34조 100% 준수 · 국가공인 1급 라이선스</span>
          </span>
        </div>

        {/* 3. 본문 스크롤 영역 */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* 3.1. 버티컬별 안내 배너 및 특화 위젯 */}
          {activeVertical === 'PSYCHOLOGY_CARE' ? (
            <div className="bg-[#DCE8E2] border border-[#DCE8E2] rounded-xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="inline-flex items-center space-x-1.5 text-[13px] font-bold text-[#19382C]">
                  <Sparkles className="w-4 h-4 text-[#C2A26A]" />
                  <span>보건복지부 국가공인 정신건강임상심리사 1급 및 한국상담심리학회 1급 검증</span>
                </div>
                <h4 className="font-reverence font-bold text-lg text-[#151719]">
                  "이별의 슬픔은 억누르는 것이 아니라, 정성껏 보살필 때 치유됩니다"
                </h4>
                <p className="text-[13px] sm:text-sm text-[#42464E] leading-relaxed font-serif">
                  임종을 앞둔 어르신의 죽음 불안과 실존적 고뇌를 보듬는 <b>생전 마음돌봄</b>부터,
                  장례 후 가족을 잃은 슬픔으로 일상을 잃어버린 유족을 위한 <b>사별 비탄 애도상담</b>까지
                  100% 정찰제로 투명하게 연계해 드립니다.
                </p>
              </div>

              <div className="bg-[#FFFFFF] p-3 rounded-lg border border-[#DCE8E2] shrink-0 text-center space-y-1 min-w-[160px]">
                <span className="text-[13px] text-[#5A5E66] block">표준 1회기 정찰제</span>
                <span className="text-lg font-mono font-bold text-[#19382C]">1회기 50분</span>
                <span className="text-[13px] text-[#6E5429] font-bold block">알선 수수료 0원</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* 상속 법률 배너 */}
              <div className="bg-[#F1E9DB] border border-[#F1E9DB] rounded-xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="inline-flex items-center space-x-1.5 text-[13px] font-bold text-[#6E5429]">
                    <ShieldCheck className="w-4 h-4 text-[#6E5429]" />
                    <span>「변호사법」 제34조 중개수수료 금지 완벽 준수 · 대한변협 등록 전문 변호사 직통</span>
                  </div>
                  <h4 className="font-reverence font-bold text-lg text-[#151719]">
                    "빚 대물림 방지 3개월 골든타임, 단 하루도 놓쳐서는 안 됩니다"
                  </h4>
                  <p className="text-[13px] sm:text-sm text-[#42464E] leading-relaxed font-serif">
                    고인의 사망 사실을 안 날로부터 3개월 이내에 신청해야 하는 <b>상속포기 및 한정승인</b>,
                    가족 간 분쟁을 미연에 방지하는 <b>상속재산분할·유류분 반환</b>, <b>유언공증과 성년후견</b>까지
                    배웅은 어떠한 수수료도 떼지 않고 100% 무료 직통 안심 연결을 제공합니다.
                  </p>
                </div>

                <div className="bg-[#FFFFFF] p-3 rounded-lg border border-[#F1E9DB] shrink-0 text-center space-y-1 min-w-[160px]">
                  <span className="text-[13px] text-[#5A5E66] block">법률상담 정찰제</span>
                  <span className="text-lg font-mono font-bold text-[#6E5429]">30분 50,000원~</span>
                  <span className="text-[13px] text-[#19382C] font-bold block">플랫폼 소개료 0원</span>
                </div>
              </div>

              {/* [특화 위젯] 빚 대물림 방지: 상속포기·한정승인 3개월 필수 기한 계산기 */}
              <div className="bg-[#FFFFFF] border-2 border-[#19382C] rounded-xl p-4 sm:p-5 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DCD6C9] pb-3">
                  <div className="flex items-center space-x-2">
                    <Timer className="w-5 h-5 text-[#19382C]" />
                    <div>
                      <h5 className="font-reverence font-bold text-base text-[#151719]">
                        빚 대물림 방지: 상속포기·한정승인 3개월 필수 기한 계산기
                      </h5>
                      <p className="text-[13px] text-[#5A5E66]">
                        고인의 임종일자(사망일)를 입력하시면 빚 상속 방지를 위한 법정 신고 만료일과 잔여 D-day를 즉시 산출합니다.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <label className="text-[13px] font-serif text-[#42464E] font-bold">
                      고인 사망일자:
                    </label>
                    <input
                      type="date"
                      value={deathDateInput}
                      onChange={(e) => setDeathDateInput(e.target.value)}
                      className="px-2.5 py-1.5 border border-[#C2A26A] rounded-md text-[13px] font-mono bg-[#FAF9F6] text-[#151719] focus:outline-none focus:ring-1 focus:ring-[#19382C]"
                    />
                  </div>
                </div>

                {inheritanceDeadlines && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    {/* 한정승인 / 상속포기 기한 */}
                    <div
                      className={`p-3.5 rounded-lg border flex items-center justify-between ${
                        inheritanceDeadlines.isAcceptanceExpired
                          ? 'bg-red-50 border-red-300 text-red-900'
                          : inheritanceDeadlines.warningLevel === 'CRITICAL'
                          ? 'bg-amber-50 border-amber-300 text-amber-900'
                          : 'bg-[#DCE8E2] border-[#DCE8E2] text-[#19382C]'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <span className="text-[13px] font-bold opacity-80 block">
                          [1차 필수] 상속포기 · 한정승인 신고 만료일
                        </span>
                        <div className="text-base font-mono font-black">
                          {inheritanceDeadlines.limitedAcceptanceDeadline}
                        </div>
                        <span className="text-[13px] opacity-75">
                          사망일로부터 정확히 3개월 (가정법원 접수 기준)
                        </span>
                      </div>
                      <div className="text-right">
                        {inheritanceDeadlines.isAcceptanceExpired ? (
                          <span className="inline-block px-3 py-1 bg-red-600 text-white rounded font-mono font-bold text-[13px]">
                            기한 경과 (특별한정승인 검토 필요)
                          </span>
                        ) : (
                          <span
                            className={`inline-block px-3 py-1 rounded font-mono font-black text-sm ${
                              inheritanceDeadlines.warningLevel === 'CRITICAL'
                                ? 'bg-amber-600 text-white animate-pulse'
                                : 'bg-[#19382C] text-white'
                            }`}
                          >
                            D-{inheritanceDeadlines.daysRemainingAcceptance}일 남음
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 상속세 신고기한 */}
                    <div className="p-3.5 rounded-lg border border-[#DCD6C9] bg-[#FAF9F6] flex items-center justify-between text-[#151719]">
                      <div className="space-y-0.5">
                        <span className="text-[13px] font-bold text-[#5A5E66] block">
                          [2차 세무] 상속세 신고 및 납부 기한
                        </span>
                        <div className="text-base font-mono font-black text-[#6E5429]">
                          {inheritanceDeadlines.estateTaxDeadline}
                        </div>
                        <span className="text-[13px] text-[#5A5E66]">
                          사망월 말일로부터 6개월 (국세청 세무서 신고)
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-3 py-1 bg-[#FAF9F6] text-[#6E5429] rounded font-mono font-bold text-[13px]">
                          D-{inheritanceDeadlines.daysRemainingEstateTax}일 남음
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3.2. 세부 카테고리 필터 칩 */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[13px] text-[#5A5E66] font-serif mr-1">전문분야:</span>
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3 py-1 rounded-full text-[13px] font-serif cursor-pointer transition-all ${
                selectedCategory === 'ALL'
                  ? 'bg-[#19382C] text-white font-bold'
                  : 'bg-[#FAF9F6] text-[#42464E] hover:bg-[#DCD6C9]'
              }`}
            >
              전체 보기
            </button>

            {activeVertical === 'PSYCHOLOGY_CARE' ? (
              <>
                <button
                  onClick={() => setSelectedCategory('BEREAVEMENT_GRIEF')}
                  className={`px-3 py-1 rounded-full text-[13px] font-serif cursor-pointer transition-all ${
                    selectedCategory === 'BEREAVEMENT_GRIEF'
                      ? 'bg-[#19382C] text-white font-bold'
                      : 'bg-[#FAF9F6] text-[#42464E] hover:bg-[#DCD6C9]'
                  }`}
                >
                  사별 애도치유 · 복합비탄
                </button>
                <button
                  onClick={() => setSelectedCategory('PRE_MORTEM_LIFE_CARE')}
                  className={`px-3 py-1 rounded-full text-[13px] font-serif cursor-pointer transition-all ${
                    selectedCategory === 'PRE_MORTEM_LIFE_CARE'
                      ? 'bg-[#19382C] text-white font-bold'
                      : 'bg-[#FAF9F6] text-[#42464E] hover:bg-[#DCD6C9]'
                  }`}
                >
                  생전 마음돌봄 & 웰다잉
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setSelectedCategory('ESTATE_DEBT_DEFENSE')}
                  className={`px-3 py-1 rounded-full text-[13px] font-serif cursor-pointer transition-all ${
                    selectedCategory === 'ESTATE_DEBT_DEFENSE'
                      ? 'bg-[#19382C] text-white font-bold'
                      : 'bg-[#FAF9F6] text-[#42464E] hover:bg-[#DCD6C9]'
                  }`}
                >
                  빚 대물림 방지 (한정승인·상속포기)
                </button>
                <button
                  onClick={() => setSelectedCategory('INHERITANCE_DISPUTE')}
                  className={`px-3 py-1 rounded-full text-[13px] font-serif cursor-pointer transition-all ${
                    selectedCategory === 'INHERITANCE_DISPUTE'
                      ? 'bg-[#19382C] text-white font-bold'
                      : 'bg-[#FAF9F6] text-[#42464E] hover:bg-[#DCD6C9]'
                  }`}
                >
                  상속재산분할 & 유류분 반환
                </button>
                <button
                  onClick={() => setSelectedCategory('GUARDIANSHIP_WILL')}
                  className={`px-3 py-1 rounded-full text-[13px] font-serif cursor-pointer transition-all ${
                    selectedCategory === 'GUARDIANSHIP_WILL'
                      ? 'bg-[#19382C] text-white font-bold'
                      : 'bg-[#FAF9F6] text-[#42464E] hover:bg-[#DCD6C9]'
                  }`}
                >
                  성년후견 & 유언공증 & 디지털유산
                </button>
              </>
            )}
          </div>

          {/* 3.3. 전문가 프로필 카드 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {professionals.map((pro) => (
              <div
                key={pro.id}
                className="bg-[#FFFFFF] border border-[#DCD6C9] rounded-xl p-5 flex flex-col justify-between space-y-4 hover:border-[#19382C] hover:shadow-md transition-all relative overflow-hidden"
              >
                {/* 상단 프로필 헤더 */}
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[13px] font-serif font-bold bg-[#DCE8E2] text-[#19382C] border border-[#DCE8E2]">
                      <UserCheck className="w-3.5 h-3.5 text-[#19382C]" />
                      <span>{pro.badge}</span>
                    </span>
                    <span className="text-[13px] font-mono font-bold text-[#6E5429] bg-[#F1E9DB] px-2 py-0.5 rounded border border-[#F1E9DB]">
                      경력 {pro.experienceYears}년
                    </span>
                  </div>

                  <div>
                    <div className="flex items-baseline space-x-2">
                      <h4 className="font-reverence font-bold text-lg sm:text-xl text-[#151719]">
                        {pro.name}
                      </h4>
                      <span className="text-[13px] font-serif text-[#5A5E66]">
                        {pro.title}
                      </span>
                    </div>
                    <p className="text-[13px] text-[#19382C] font-bold mt-0.5">
                      {pro.organization}
                    </p>
                  </div>

                  <p className="text-[13px] text-[#5A5E66] bg-[#FAF9F6] p-2 rounded border border-[#DCD6C9] leading-relaxed">
                    📜 {pro.licenseInfo}
                  </p>

                  <p className="text-[13px] text-[#42464E] leading-relaxed line-clamp-3 font-serif">
                    "{pro.introduction}"
                  </p>

                  {/* 전문 분야 태그 */}
                  <div className="space-y-1 pt-1">
                    <span className="text-[13px] font-bold text-[#5A5E66] block">
                      주요 전문 취급 분야:
                    </span>
                    <ul className="text-[13px] text-[#5A5E66] space-y-1">
                      {pro.specialties.map((spec, sIdx) => (
                        <li key={sIdx} className="flex items-center space-x-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#19382C] shrink-0" />
                          <span className="truncate">{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 정찰제 상담 수가표 */}
                  <div className="space-y-1.5 pt-2 border-t border-[#DCD6C9]">
                    <span className="text-[13px] font-bold text-[#6E5429] flex items-center space-x-1">
                      <Sparkles className="w-3 h-3 text-[#9E7D47]" />
                      <span>투명 정찰제 상담 수가:</span>
                    </span>
                    <div className="space-y-1">
                      {pro.consultationFees.map((fee, fIdx) => (
                        <div
                          key={fIdx}
                          className="bg-[#FAF9F6] p-2 rounded border border-[#DCD6C9] flex items-center justify-between text-[13px]"
                        >
                          <div className="truncate pr-2">
                            <span className="font-bold text-[#151719] block truncate">
                              {fee.name}
                            </span>
                            <span className="text-[13px] text-[#5A5E66]">
                              {fee.duration} · {fee.description}
                            </span>
                          </div>
                          <span className="font-mono font-bold text-[#19382C] shrink-0">
                            {fee.price.toLocaleString()}원
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 하단 액션 버튼 (050 직통 통화 & 안심 예약) */}
                <div className="pt-3 border-t border-[#DCD6C9] space-y-2">
                  <div className="flex items-center justify-between text-[13px] text-[#5A5E66]">
                    <span>안심가상번호: <b className="font-mono text-[#151719]">{pro.virtualPhone}</b></span>
                    <span className="text-[#19382C] font-bold">수수료 0원</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={`tel:${pro.virtualPhone.replace(/-/g, '')}`}
                      className="py-2.5 px-3 bg-[#FFFFFF] hover:bg-[#FAF9F6] text-[#19382C] border border-[#19382C]/40 rounded-lg text-[13px] font-serif font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#19382C]" />
                      <span>050 직통 통화</span>
                    </a>
                    <button
                      onClick={() => handleOpenBooking(pro)}
                      className="py-2.5 px-3 bg-[#19382C] hover:bg-[#2D4F43] text-[#FAF9F6] rounded-lg text-[13px] font-serif font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <Calendar className="w-3.5 h-3.5 text-[#C2A26A]" />
                      <span>1:1 상담 예약</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 3.4. 변호사법 제34조 및 한국상담심리학회 윤리강령 준수 공시 */}
          <div className="bg-[#141618] text-[#FAF9F6] rounded-xl p-5 border border-white/10 space-y-3">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-[#C2A26A]" />
              <h5 className="font-reverence font-bold text-sm text-[#FAF9F6]">
                배웅 라이프엔딩 플랫폼 법률 & 심리 자문 컴플라이언스 선언
              </h5>
            </div>
            <p className="text-[13px] text-[#A8B2A9] leading-relaxed font-serif">
              1. <b>변호사법 제34조 준수</b>: 배웅은 법률사건의 수임과 관련하여 일체의 소개·알선 수수료(리베이트)를 수취하지 않으며, 전담 변호사와 유가족 간 직접 상담 및 수임을 100% 무료 연결합니다.<br />
              2. <b>심리상담 윤리강령 준수</b>: 민간 무자격 상담사를 전면 배제하며, 보건복지부 및 한국임상/상담심리학회 공인 1급 라이선스 자격자만을 엄선하여 고인의 존엄과 유족의 비밀을 보장합니다.<br />
              3. <b>정찰제 수가 공개</b>: 모든 상담료와 서류 대행 수가는 사전 고지된 정찰제로 운영되며 부당한 추가금을 요구하지 않습니다.
            </p>
          </div>
        </div>

        {/* 4. 모달 하단 푸터 바 */}
        <div className="bg-[#FAF9F6] border-t border-[#DCD6C9] p-3.5 px-6 flex items-center justify-between text-[13px] font-serif shrink-0">
          <span className="text-[#5A5E66] text-[13px] sm:text-[13px]">
            ※ 상담 및 수임 계약의 당사자는 전문가와 의뢰인 본인이며, 배웅은 공공 정보 디렉터리를 제공합니다.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#19382C] text-white rounded-lg font-bold hover:bg-[#2D4F43] transition-colors cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 서브 모달: 1:1 상담 예약 신청 서식 */}
      {/* ───────────────────────────────────────────────────────────── */}
      {bookingTarget && (
        <div className="fixed inset-0 z-60 bg-[#0D0E10]/85 backdrop-blur-xs flex items-center justify-center p-3 font-serif">
          <div className="bg-[#FAF9F6] rounded-xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#DCD6C9] space-y-4 p-5 sm:p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#DCD6C9] pb-3">
              <div>
                <span className="text-[13px] font-serif text-[#19382C] font-bold">
                  {bookingTarget.badge}
                </span>
                <h4 className="font-reverence font-bold text-lg text-[#151719]">
                  {bookingTarget.name} {bookingTarget.title} 상담 예약
                </h4>
                <p className="text-[13px] text-[#5A5E66]">{bookingTarget.organization}</p>
              </div>
              <button
                onClick={handleCloseBooking}
                className="p-1.5 text-[#5A5E66] hover:text-[#151719] rounded-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {bookingResult ? (
              /* 예약 성공 확인 화면 */
              <div className="space-y-4 py-2 text-center">
                <div className="w-12 h-12 rounded-full bg-[#19382C] text-[#FAF9F6] flex items-center justify-center mx-auto border border-[#2D4F43]">
                  <CheckCircle2 className="w-7 h-7 text-[#C2A26A]" />
                </div>
                <div className="space-y-1">
                  <span className="text-[13px] font-mono text-[#6E5429] font-bold">
                    접수번호: {bookingResult.bookingId}
                  </span>
                  <h4 className="font-reverence font-bold text-xl text-[#151719]">
                    상담 예약이 정상 접수되었습니다
                  </h4>
                  <p className="text-[13px] text-[#42464E] leading-relaxed pt-1">
                    담당 전문가 <b>{bookingResult.professionalName}</b> 사무소로 고객님의 상담 신청서가 직통 전달되었습니다.
                  </p>
                </div>

                <div className="bg-[#FFFFFF] p-3.5 rounded-lg border border-[#DCD6C9] text-left text-[13px] space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-[#5A5E66]">직통 안심번호:</span>
                    <span className="font-mono font-bold text-[#151719]">{bookingResult.virtualPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5A5E66]">플랫폼 중개 수수료:</span>
                    <span className="font-mono font-bold text-[#19382C]">0원 (무료 연결)</span>
                  </div>
                  <p className="text-[13px] text-[#5A5E66] pt-2 border-t border-[#DCD6C9] leading-relaxed">
                    {bookingResult.notice}
                  </p>
                </div>

                <button
                  onClick={handleCloseBooking}
                  className="w-full py-3 bg-[#19382C] text-white rounded-lg font-bold hover:bg-[#2D4F43] transition-colors cursor-pointer"
                >
                  확인 완료
                </button>
              </div>
            ) : (
              /* 신청 서식 작성 폼 */
              <form onSubmit={handleSubmitBooking} className="space-y-3.5 text-[13px]">
                {errorMessage && (
                  <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-md text-[13px] flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#151719] mb-1">
                      의뢰인 성명 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="홍길동"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full px-3 py-2 border border-[#DCD6C9] rounded-md bg-[#FFFFFF] text-[#151719] focus:outline-none focus:border-[#19382C]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#151719] mb-1">
                      연락처 (휴대전화) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="010-1234-5678"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-[#DCD6C9] rounded-md bg-[#FFFFFF] text-[#151719] focus:outline-none focus:border-[#19382C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#151719] mb-1">
                    희망 상담 일자
                  </label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full px-3 py-2 border border-[#DCD6C9] rounded-md bg-[#FFFFFF] text-[#151719] focus:outline-none focus:border-[#19382C]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#151719] mb-1">
                    상담 요망 사항 (주요 고민 및 사안)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="예: 선친 사망 후 채무 조회 결과 확인, 상속포기 vs 한정승인 상담 희망 / 사별 후 불면과 비탄 상태 상담 희망 등"
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    className="w-full px-3 py-2 border border-[#DCD6C9] rounded-md bg-[#FFFFFF] text-[#151719] focus:outline-none focus:border-[#19382C]"
                  />
                </div>

                <div className="bg-[#FAF9F6] p-3 rounded-lg border border-[#DCD6C9] space-y-2 text-[13px] text-[#42464E]">
                  <label className="flex items-start space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreedZeroCommission}
                      onChange={(e) => setAgreedZeroCommission(e.target.checked)}
                      className="mt-0.5 rounded text-[#19382C] focus:ring-0"
                    />
                    <span>
                      <b>[필수] 변호사법 제34조 준수 및 0원 수수료 안내 동의</b>: 본 예약은 배웅의 중개수수료 0원 원칙에 따라 전문가 사무소로 무료 직통 전달되며, 상담료는 전문가에게 직접 정산함에 동의합니다.
                    </span>
                  </label>

                  <label className="flex items-start space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={privacyAgreed}
                      onChange={(e) => setPrivacyAgreed(e.target.checked)}
                      className="mt-0.5 rounded text-[#19382C] focus:ring-0"
                    />
                    <span>
                      <b>[필수] 개인정보 수집 및 제3자(담당 전문가 사무소) 제공 동의</b>
                    </span>
                  </label>
                </div>

                <div className="pt-2 flex space-x-2">
                  <button
                    type="button"
                    onClick={handleCloseBooking}
                    className="w-1/3 py-2.5 bg-[#FAF9F6] hover:bg-[#DCD6C9] text-[#42464E] font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 py-2.5 bg-[#19382C] hover:bg-[#2D4F43] text-white font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
                  >
                    상담 신청 접수 (비용 0원)
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
