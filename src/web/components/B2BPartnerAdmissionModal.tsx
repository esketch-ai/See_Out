import React, { useState } from 'react';
import {
  X,
  Building2,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Scale,
  TrendingUp,
  FileCheck,
  Phone,
  Printer
} from 'lucide-react';
import { FuneralHallEntity } from '../../funeral-halls/types.js';
import { useModalA11y } from './ModalShell.js';
import {
  B2BAdmissionService,
  B2BAdmissionApplication
} from '../../b2b/index.js';

interface B2BPartnerAdmissionModalProps {
  initialHall?: FuneralHallEntity;
  onClose: () => void;
}

export const B2BPartnerAdmissionModal: React.FC<B2BPartnerAdmissionModalProps> = ({
  initialHall,
  onClose
}) => {
  // 공용 셸과 동일한 모달 접근성 계약 (포커스 트랩 · ESC · aria-modal)
  const { overlayProps, panelProps } = useModalA11y(onClose);
  const [hallName, setHallName] = useState(initialHall?.name || '');
  const [region, setRegion] = useState<string>(initialHall?.region || '서울특별시');
  const [address, setAddress] = useState(initialHall?.address || '');
  const [businessNumber, setBusinessNumber] = useState('');
  const [permitNumber, setPermitNumber] = useState('');
  const [directorName, setDirectorName] = useState('');
  const [contactPhone, setContactPhone] = useState(initialHall?.phone || '');
  const [contactEmail, setContactEmail] = useState('');
  const [offeredDiscountRate, setOfferedDiscountRate] = useState<number>(20);
  const [flatRateAgreed, setFlatRateAgreed] = useState(true);
  const [antiRebatePledge, setAntiRebatePledge] = useState(true);

  const [submittedApp, setSubmittedApp] = useState<B2BAdmissionApplication | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      const app = B2BAdmissionService.submitApplication({
        hallName,
        region,
        address,
        businessNumber,
        permitNumber,
        directorName,
        contactPhone,
        contactEmail,
        offeredDiscountRate,
        flatRateAgreed,
        antiRebatePledge
      });
      setSubmittedApp(app);
    } catch (err: any) {
      setErrorMsg(err.message || '입점 신청 처리 중 오류가 발생했습니다.');
    }
  };

  const handlePrint = () => {
    window.print();
  };


  return (
    <div {...overlayProps} onKeyDown={panelProps.onKeyDown} className="fixed inset-0 z-50 bg-[#0D0E10]/85 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto font-serif">
      <div {...panelProps} className="bg-[#FAF9F6] rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-[#DCD6C9] flex flex-col my-auto max-h-[96vh]">
        {/* 상단 헤더 툴바 */}
        <div className="bg-[#141618] text-[#FAF9F6] p-4 px-6 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-[#19382C] text-[#C2A26A] flex items-center justify-center border border-[#2D4F43]">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-reverence font-bold text-base text-[#FAF9F6]">
                배웅 공식 장례식장 파트너십 (정액제 광고) 입점 신청 창구
              </h3>
              <p className="text-[0.8125rem] text-[#A8B2A9]">
                사업계획서 3.1절 & 4.2절 준수 · 공정위 리베이트 제재 면책 보증
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {submittedApp && (
              <button
                onClick={handlePrint}
                className="px-3 py-1.5 bg-[#19382C] hover:bg-[#2D4F43] text-white rounded text-[0.8125rem] font-bold flex items-center space-x-1 border border-[#2D4F43] cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-[#C2A26A]" />
                <span className="hidden sm:inline">협약 신청서 인쇄</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/10 rounded-full text-[#5A5E66] hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 본문 스크롤 영역 */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-5">
          {!submittedApp ? (
            <>
              {/* 공정위 리베이트 철폐 및 3대 핵심 혜택 안내 배너 */}
              <div className="bg-[#FAF9F6] border border-[#F1E9DB] rounded-xl p-4 text-[0.8125rem] space-y-2">
                <div className="flex items-start space-x-2 text-[#6E5429]">
                  <Scale className="w-4 h-4 shrink-0 mt-0.5 text-[#9E7D47]" />
                  <div>
                    <span className="font-bold text-[#6E5429]">
                      2026년 3월 공정위 리베이트 제재 전면 시행 대응 클린 플랫폼
                    </span>
                    <p className="text-[0.8125rem] text-[#6E5429] mt-0.5 leading-relaxed">
                      배웅은 장례식장으로부터 알선 성공보수(소개 수수료)를 절대 취하지 않습니다.
                      오직 <b>월 300,000원 100% 정액 광고료</b>로만 운영되므로 리베이트 쌍벌제로부터 완벽히 면책됩니다.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-[#DCD6C9] text-[0.8125rem]">
                  <div className="p-2 bg-white rounded border border-[#DCD6C9]">
                    <div className="font-bold text-[#19382C]">① 공실 빈소 1건 유치</div>
                    <div className="text-[#5A5E66] mt-0.5">월 빈소 매출 240만~300만원 창출</div>
                  </div>
                  <div className="p-2 bg-white rounded border border-[#DCD6C9]">
                    <div className="font-bold text-[#19382C]">② 압도적 ROI (800%)</div>
                    <div className="text-[#5A5E66] mt-0.5">광고비 30만원 대비 8배~10배 효과</div>
                  </div>
                  <div className="p-2 bg-white rounded border border-[#DCD6C9]">
                    <div className="font-bold text-[#19382C]">③ 0507 가상번호 계측</div>
                    <div className="text-[#5A5E66] mt-0.5">녹음 없는 합법적 월간 성과 리포트</div>
                  </div>
                </div>
              </div>

              {/* 신청 입력 폼 */}
              <form onSubmit={handleSubmit} className="bg-[#FFFFFF] border border-[#DCD6C9] rounded-xl p-5 space-y-4 shadow-xs">
                <h4 className="font-bold text-sm text-[#151719] border-b border-[#DCD6C9] pb-2">
                  장례식장 B2B 제휴 협약 신청 정보 입력
                </h4>

                {errorMsg && (
                  <div className="p-3 bg-[#FAF0EF] border border-[#FAF0EF] text-[#8B2520] rounded text-[0.8125rem] flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[0.8125rem] font-bold text-[#42464E] mb-1">장례식장 상호명 *</label>
                    <input
                      type="text"
                      required
                      value={hallName}
                      onChange={(e) => setHallName(e.target.value)}
                      placeholder="예: 서울아산병원장례식장"
                      className="w-full bg-[#FAF9F6] border border-[#DCD6C9] rounded p-2.5 text-[0.8125rem] text-[#151719]"
                    />
                  </div>

                  <div>
                    <label className="block text-[0.8125rem] font-bold text-[#42464E] mb-1">관할 지역 (시·도) *</label>
                    <input
                      type="text"
                      required
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      placeholder="예: 서울특별시"
                      className="w-full bg-[#FAF9F6] border border-[#DCD6C9] rounded p-2.5 text-[0.8125rem] text-[#151719]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[0.8125rem] font-bold text-[#42464E] mb-1">도로명 상세 주소 *</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="예: 서울 송파구 올림픽로43길 88"
                    className="w-full bg-[#FAF9F6] border border-[#DCD6C9] rounded p-2.5 text-[0.8125rem] text-[#151719]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[0.8125rem] font-bold text-[#42464E] mb-1">
                      사업자등록번호 (10자리) *
                    </label>
                    <input
                      type="text"
                      required
                      value={businessNumber}
                      onChange={(e) => setBusinessNumber(e.target.value)}
                      placeholder="예: 215-82-00100"
                      className="w-full bg-[#FAF9F6] border border-[#DCD6C9] rounded p-2.5 text-[0.8125rem] text-[#151719]"
                    />
                  </div>

                  <div>
                    <label className="block text-[0.8125rem] font-bold text-[#42464E] mb-1">
                      장사법 제29조 영업신고증 번호 *
                    </label>
                    <input
                      type="text"
                      required
                      value={permitNumber}
                      onChange={(e) => setPermitNumber(e.target.value)}
                      placeholder="예: 제2010-서울송파-장례식장-01호"
                      className="w-full bg-[#FAF9F6] border border-[#DCD6C9] rounded p-2.5 text-[0.8125rem] text-[#151719]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[0.8125rem] font-bold text-[#42464E] mb-1">
                      원장 / 대표자 성함 *
                    </label>
                    <input
                      type="text"
                      required
                      value={directorName}
                      onChange={(e) => setDirectorName(e.target.value)}
                      placeholder="예: 박원석"
                      className="w-full bg-[#FAF9F6] border border-[#DCD6C9] rounded p-2.5 text-[0.8125rem] text-[#151719]"
                    />
                  </div>

                  <div>
                    <label className="block text-[0.8125rem] font-bold text-[#42464E] mb-1">
                      담당자 직통 연락처 *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="예: 010-1234-5678"
                      className="w-full bg-[#FAF9F6] border border-[#DCD6C9] rounded p-2.5 text-[0.8125rem] text-[#151719]"
                    />
                  </div>

                  <div>
                    <label className="block text-[0.8125rem] font-bold text-[#42464E] mb-1">
                      세금계산서 수신 이메일 *
                    </label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="예: admin@hall.kr"
                      className="w-full bg-[#FAF9F6] border border-[#DCD6C9] rounded p-2.5 text-[0.8125rem] text-[#151719]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[0.8125rem] font-bold text-[#42464E] mb-1">
                    배웅 회원 유족 대상 제공 빈소 감면율 선택 *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[10, 20, 30].map((rate) => (
                      <button
                        type="button"
                        key={rate}
                        onClick={() => setOfferedDiscountRate(rate)}
                        className={`py-2 rounded border text-[0.8125rem] font-bold cursor-pointer transition-all ${
                          offeredDiscountRate === rate
                            ? 'bg-[#19382C] text-white border-[#2D4F43]'
                            : 'bg-white text-[#42464E] border-[#DCD6C9] hover:bg-[#FAF9F6]'
                        }`}
                      >
                        빈소 임대료 {rate}% 감면
                      </button>
                    ))}
                  </div>
                  <p className="text-[0.8125rem] text-[#5A5E66] mt-1 font-serif">
                    ※ 감면 혜택을 제공하시는 식장은 배웅 지도 및 검색 상단에 우선 노출(★ 감면 제휴 뱃지)됩니다.
                  </p>
                </div>

                <div className="pt-2 border-t border-[#DCD6C9] space-y-2">
                  <label className="flex items-center space-x-2 text-[0.8125rem] text-[#151719] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={flatRateAgreed}
                      onChange={(e) => setFlatRateAgreed(e.target.checked)}
                      className="rounded border-[#DCD6C9] text-[#19382C] focus:ring-[#19382C]"
                    />
                    <span className="font-bold">
                      [필수] 월 300,000원 100% 정액 광고 계약에 동의합니다 (추가 알선 수수료 0원).
                    </span>
                  </label>

                  <label className="flex items-center space-x-2 text-[0.8125rem] text-[#151719] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={antiRebatePledge}
                      onChange={(e) => setAntiRebatePledge(e.target.checked)}
                      className="rounded border-[#DCD6C9] text-[#19382C] focus:ring-[#19382C]"
                    />
                    <span className="font-bold">
                      [필수] 공정위 리베이트 철폐 지침을 준수하며 유족에게 부당 추가금을 강요하지 않습니다.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#19382C] hover:bg-[#2D4F43] text-[#FAF9F6] rounded-lg font-reverence font-bold text-sm shadow-xs transition-colors cursor-pointer border border-[#2D4F43]"
                >
                  배웅 정액제 B2B 제휴 입점 신청서 접수하기 ➔
                </button>
              </form>
            </>
          ) : (
            /* 접수 완료 확인서 */
            <div className="bg-[#FFFFFF] border-2 border-[#19382C] rounded-xl p-6 sm:p-8 space-y-5 shadow-sm text-center">
              <div className="w-12 h-12 rounded-full bg-[#19382C] text-[#C2A26A] flex items-center justify-center mx-auto border border-[#2D4F43]">
                <CheckCircle2 className="w-6 h-6" />
              </div>

              <div>
                <span className="text-[0.8125rem] font-serif font-bold text-[#6E5429]">
                  신청 접수 번호: {submittedApp.applicationId}
                </span>
                <h3 className="font-reverence font-bold text-xl sm:text-2xl text-[#151719] mt-1">
                  [{submittedApp.hallName}] B2B 제휴 입점 신청 완료
                </h3>
                <p className="text-[0.8125rem] text-[#5A5E66] font-serif mt-1">
                  배웅 파트너십 운영팀에서 인허가 서류(신고증 {submittedApp.permitNumber})를 신속히 확인 후 담당자({submittedApp.contactPhone})께 연락드립니다.
                </p>
              </div>

              <div className="p-4 bg-[#FAF9F6] border border-[#DCD6C9] rounded-lg text-left text-[0.8125rem] font-serif space-y-2 max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-[#5A5E66]">월 광고비:</span>
                  <span className="font-bold text-[#19382C]">월 300,000원 (정액제)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5A5E66]">알선 수수료:</span>
                  <span className="font-bold text-[#151719]">0원 (공정위 준수)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5A5E66]">빈소 감면율:</span>
                  <span className="font-bold text-[#19382C]">{submittedApp.offeredDiscountRate}% 감면 제공</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5A5E66]">월 1건 유치 시 예상 매출:</span>
                  <span className="font-bold text-[#151719]">{submittedApp.expectedMonthlyRevenueEstimate.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between border-t border-[#DCD6C9] pt-1.5">
                  <span className="text-[#5A5E66]">광고비 대비 기대 ROI:</span>
                  <span className="font-bold text-[#8B2520]">{submittedApp.expectedRoiPercentage}%</span>
                </div>
              </div>

              <div className="flex gap-2 justify-center pt-2">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-[#FAF9F6] hover:bg-[#FAF9F6] text-[#151719] border border-[#DCD6C9] rounded text-[0.8125rem] font-bold cursor-pointer"
                >
                  신청 확인서 인쇄
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-[#19382C] hover:bg-[#2D4F43] text-white rounded text-[0.8125rem] font-bold cursor-pointer"
                >
                  확인 (닫기)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
