import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Building2,
  FileText,
  Send,
  HelpCircle
} from 'lucide-react';
import { FuneralHallEntity } from '../../funeral-halls/types.js';
import {
  OptOutService,
  OptOutRequestType,
  RequesterRole
} from '../../compliance/index.js';

interface OptOutModalProps {
  hall: FuneralHallEntity;
  onClose: () => void;
}

export const OptOutModal: React.FC<OptOutModalProps> = ({ hall, onClose }) => {
  const [requestType, setRequestType] = useState<OptOutRequestType>('CORRECTION');
  const [requesterRole, setRequesterRole] = useState<RequesterRole>('DIRECTOR');
  const [requesterName, setRequesterName] = useState('');
  const [requesterPhone, setRequesterPhone] = useState('');
  const [requesterEmail, setRequesterEmail] = useState('');
  const [details, setDetails] = useState('');
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requesterName || !requesterPhone || !details) {
      alert('신청인 성함, 연락처, 상세 요청 내용을 모두 입력해 주세요.');
      return;
    }

    const result = OptOutService.submitRequest({
      hallId: hall.id,
      hallName: hall.name,
      requestType,
      requesterRole,
      requesterName,
      requesterPhone,
      requesterEmail,
      details
    });

    setSubmittedCode(result.requestId);
  };

  const disclaimer = OptOutService.getDisclaimer();

  return (
    <div className="fixed inset-0 z-50 bg-[#0D0E10]/85 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto font-serif">
      <div className="bg-[#FAF9F6] rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#E3DFD5] flex flex-col my-auto max-h-[96vh]">
        {/* 상단 컨트롤 툴바 */}
        <div className="bg-[#121417] text-[#FAF9F6] p-4 px-6 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-[#19382C] text-[#C2A26A] flex items-center justify-center border border-[#2D5A46]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-reverence font-bold text-base text-[#FAF9F6]">
                장례식장 정보 수정 및 비노출(게재 중단) 요청 접수 창구
              </h3>
              <p className="text-[11px] text-[#A8B2A9]">
                장례식장 원장님 및 관리자 전용 · 24시간 이내 신속 처리
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-[#FAF9F6]/10 hover:bg-[#FAF9F6]/20 text-[#FAF9F6] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 모달 본문 */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-[#151719] bg-[#FAF9F6]">
          {submittedCode ? (
            /* 접수 완료 화면 */
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#F0F5F2] text-[#19382C] flex items-center justify-center mx-auto border-2 border-[#BFD4CA]">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="font-reverence font-bold text-2xl text-[#121417]">
                접수가 안전하게 완료되었습니다
              </h4>
              <p className="text-xs text-[#5C6166] font-serif max-w-md mx-auto leading-relaxed">
                장례식장 권리자 확인을 거쳐 영업일 기준 24시간 이내에 요청하신 사항이 반영됩니다.<br />
                접수 고유 번호를 보관해 주시기 바랍니다.
              </p>
              <div className="p-4 bg-[#FFFFFF] rounded-xl border border-[#E3DFD5] inline-block font-mono text-lg font-bold text-[#19382C]">
                접수 번호: {submittedCode}
              </div>
              <div className="pt-4">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#19382C] text-[#FAF9F6] rounded-lg font-bold text-sm hover:bg-[#204738] transition-colors cursor-pointer"
                >
                  확인 및 창 닫기
                </button>
              </div>
            </div>
          ) : (
            /* 신청서 입력 폼 */
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* 비제휴 고지 안내 박스 */}
              <div className="p-3.5 bg-[#F0F5F2] border border-[#BFD4CA] rounded-xl text-xs text-[#19382C] leading-relaxed">
                <b>{disclaimer.title}</b><br />
                {disclaimer.statement}
              </div>

              {/* 대상 시설 */}
              <div className="p-3 bg-[#FFFFFF] rounded-lg border border-[#E3DFD5] flex items-center justify-between text-xs">
                <span className="text-[#727782]">대상 장례식장:</span>
                <span className="font-bold text-[#151719] text-sm">{hall.name} ({hall.address})</span>
              </div>

              {/* 요청 유형 선택 */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#121417] block">요청 유형 선택:</label>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => setRequestType('CORRECTION')}
                    className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                      requestType === 'CORRECTION'
                        ? 'border-2 border-[#19382C] bg-[#FFFFFF] font-bold text-[#19382C]'
                        : 'border-[#E3DFD5] bg-[#FAF9F6] text-[#5C6166]'
                    }`}
                  >
                    ✏️ 정보 정정 요청<br />
                    <span className="text-[11px] font-normal text-[#727782]">임대료·전화번호·시설명 변경</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRequestType('TAKEDOWN')}
                    className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                      requestType === 'TAKEDOWN'
                        ? 'border-2 border-[#8B2520] bg-[#FFFFFF] font-bold text-[#8B2520]'
                        : 'border-[#E3DFD5] bg-[#FAF9F6] text-[#5C6166]'
                    }`}
                  >
                    🗑️ 게재 중단(삭제) 요청<br />
                    <span className="text-[11px] font-normal text-[#727782]">플랫폼 내 검색 노출 제외</span>
                  </button>
                </div>
              </div>

              {/* 신청인 인적 정보 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[#727782] block mb-1">신청인 권한/직책:</label>
                  <select
                    value={requesterRole}
                    onChange={(e) => setRequesterRole(e.target.value as RequesterRole)}
                    className="w-full p-2.5 bg-[#FFFFFF] border border-[#E3DFD5] rounded-md font-medium text-[#151719]"
                  >
                    <option value="DIRECTOR">장례지도사 (원내 근무)</option>
                    <option value="OWNER">대표자 (장례식장 운영자)</option>
                    <option value="ADMIN">원무·관리자</option>
                    <option value="OTHER">기타 관계자</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#727782] block mb-1">신청인 성명:</label>
                  <input
                    type="text"
                    required
                    value={requesterName}
                    onChange={(e) => setRequesterName(e.target.value)}
                    placeholder="성함을 입력하세요"
                    className="w-full p-2.5 bg-[#FFFFFF] border border-[#E3DFD5] rounded-md text-[#151719]"
                  />
                </div>
                <div>
                  <label className="text-[#727782] block mb-1">연락처:</label>
                  <input
                    type="tel"
                    required
                    value={requesterPhone}
                    onChange={(e) => setRequesterPhone(e.target.value)}
                    placeholder="010-0000-0000"
                    className="w-full p-2.5 bg-[#FFFFFF] border border-[#E3DFD5] rounded-md text-[#151719]"
                  />
                </div>
                <div>
                  <label className="text-[#727782] block mb-1">이메일 (결과 회신용):</label>
                  <input
                    type="email"
                    value={requesterEmail}
                    onChange={(e) => setRequesterEmail(e.target.value)}
                    placeholder="contact@funeralhall.com"
                    className="w-full p-2.5 bg-[#FFFFFF] border border-[#E3DFD5] rounded-md text-[#151719]"
                  />
                </div>
              </div>

              {/* 상세 요청 내용 */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#121417] block">
                  상세 요청 내용 (정정 항목 또는 게재 중단 사유):
                </label>
                <textarea
                  rows={4}
                  required
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="예: 특실 80평형 1일 임대료가 1,800,000원으로 변경되었으니 정정을 요청합니다. 또는 해당 식장의 게재 중단을 요청합니다."
                  className="w-full p-3 bg-[#FFFFFF] border border-[#E3DFD5] rounded-md text-xs text-[#151719] leading-relaxed resize-none focus:outline-none focus:border-[#19382C]"
                />
              </div>

              <div className="text-[11px] text-[#727782] flex items-center space-x-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-[#9E7D47] shrink-0" />
                <span>허위 신청 방지를 위해 접수 후 담당자가 유선으로 재직 여부를 확인할 수 있습니다.</span>
              </div>

              {/* 제출 버튼 */}
              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-lg border border-[#E3DFD5] text-[#5C6166] text-xs hover:bg-[#FFFFFF] transition-colors cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-[#19382C] hover:bg-[#204738] text-[#FAF9F6] text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer border border-[#2D5A46]"
                >
                  <Send className="w-3.5 h-3.5 text-[#C2A26A]" />
                  <span>옵트아웃 신청서 접수</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
