import React, { useState } from 'react';
import { useModalA11y } from './ModalShell.js';
import {
  X,
  ShieldCheck,
  Scale,
  FileText,
  Printer,
  Search,
  CheckCircle2,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import {
  LegalDocumentType,
  LegalDocument,
  LegalService
} from '../../legal/index.js';

interface LegalPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDocType?: LegalDocumentType;
}

export const LegalPolicyModal: React.FC<LegalPolicyModalProps> = ({
  isOpen,
  onClose,
  initialDocType = 'PRIVACY_POLICY'
}) => {
  // 공용 셸과 동일한 모달 접근성 계약 (포커스 트랩 · ESC · aria-modal)
  const { overlayProps, panelProps } = useModalA11y(onClose, isOpen);
  const [activeType, setActiveType] = useState<LegalDocumentType>(initialDocType);
  const [searchKeyword, setSearchKeyword] = useState('');

  if (!isOpen) return null;

  const currentDoc = LegalService.getDocumentByType(activeType) || LegalService.getAllDocuments()[0];
  const complianceMatrix = LegalService.getStatutoryComplianceSummary();
  const searchResults = searchKeyword.trim().length >= 2
    ? LegalService.searchLegalContent(searchKeyword)
    : [];

  const handlePrint = () => {
    window.print();
  };

  const tabs: { type: LegalDocumentType; label: string }[] = [
    { type: 'PRIVACY_POLICY', label: '개인정보 처리방침' },
    { type: 'TERMS_OF_SERVICE', label: '서비스 이용약관' },
    { type: 'LOCATION_TERMS', label: '위치기반서비스 약관' },
    { type: 'OPT_OUT_REGULATION', label: 'e하늘 & 옵트아웃 규정' },
    { type: 'DIGITAL_LEGACY_POLICY', label: '디지털 유산 사후 승계' }
  ];


  return (
    <div {...overlayProps} onKeyDown={panelProps.onKeyDown} className="fixed inset-0 z-50 bg-[#0D0E10]/85 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto font-serif">
      <div {...panelProps} className="bg-[#FAF9F6] rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl border border-[#DCD6C9] flex flex-col my-auto max-h-[96vh]">
        {/* 상단 툴바 (인쇄 시 no-print) */}
        <div className="no-print bg-[#141618] text-[#FAF9F6] p-4 px-6 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-[#19382C] text-[#C2A26A] flex items-center justify-center border border-[#2D4F43]">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-reverence font-bold text-base text-[#FAF9F6]">
                배웅(BAEUNG) 법률 및 컴플라이언스 약관 규정
              </h3>
              <p className="text-[13px] text-[#A8B2A9]">
                대한변호사협회 등록 30년+ 전문변호인단 법률 감수 · 대한민국 현행 실정법 완벽 준수
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-[#19382C] hover:bg-[#2D4F43] text-white rounded text-[13px] font-bold flex items-center space-x-1.5 border border-[#2D4F43] cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#C2A26A]" />
              <span className="hidden sm:inline">약관 전문 인쇄</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/10 rounded-full text-[#5A5E66] hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="no-print bg-[#FFFFFF] border-b border-[#DCD6C9] px-4 sm:px-6 flex overflow-x-auto text-[13px] font-medium">
          {tabs.map((tab) => (
            <button
              key={tab.type}
              onClick={() => {
                setActiveType(tab.type);
                setSearchKeyword('');
              }}
              className={`py-3 px-3.5 border-b-2 font-bold whitespace-nowrap cursor-pointer transition-all ${
                activeType === tab.type
                  ? 'border-[#19382C] text-[#19382C]'
                  : 'border-transparent text-[#5A5E66] hover:text-[#151719]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 본문 스크롤 영역 */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-6 text-[#151719] bg-[#FAF9F6]">
          {/* 상단 30년 전문 변호인단 감수 확인 배너 */}
          <div className="bg-[#FAF9F6] border border-[#F1E9DB] rounded-xl p-4 text-[13px] space-y-2">
            <div className="flex items-start space-x-2 text-[#6E5429]">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-[#9E7D47]" />
              <div>
                <span className="font-bold text-[#6E5429]">
                  {currentDoc.legalCounselReview}
                </span>
                <p className="text-[13px] text-[#6E5429] mt-0.5 leading-relaxed">
                  본 규정은 「개인정보 보호법」, 「통신비밀보호법」, 「독점규제 및 공정거래에 관한 법률(2026.03 리베이트 철폐)」, 「장사법」에 의거하여 이용자의 권익을 두텁게 보호하도록 성안되었습니다.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#DCD6C9] text-[13px]">
              {currentDoc.statutoryBases.map((base, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded bg-white border border-[#DCD6C9] text-[#6E5429]">
                  ✓ {base}
                </span>
              ))}
            </div>
          </div>

          {/* 검색창 (약관 내 조항 검색) */}
          <div className="no-print relative">
            <Search className="w-4 h-4 text-[#5A5E66] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="약관 내 키워드 검색 (예: '통신비밀보호법', '리베이트', '환급금', '위치정보')..."
              className="w-full bg-[#FFFFFF] border border-[#DCD6C9] rounded-lg pl-10 pr-4 py-2.5 text-[13px] text-[#151719] placeholder-[#5A5E66] focus:outline-none focus:border-[#9E7D47]"
            />
          </div>

          {/* 검색 결과가 있을 경우 우선 표시 */}
          {searchKeyword.trim().length >= 2 && (
            <div className="bg-[#FFFFFF] border border-[#DCE8E2] rounded-xl p-4 text-[13px] space-y-2">
              <div className="font-bold text-[#19382C] flex items-center justify-between">
                <span>‘{searchKeyword}’ 검색 결과 ({searchResults.length}건)</span>
                <button
                  onClick={() => setSearchKeyword('')}
                  className="text-[13px] text-[#5A5E66] hover:underline cursor-pointer"
                >
                  검색 초기화
                </button>
              </div>
              {searchResults.length === 0 ? (
                <p className="text-[13px] text-[#5A5E66]">일치하는 조항이 없습니다.</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {searchResults.map((res, idx) => (
                    <div key={idx} className="p-2.5 bg-[#DCE8E2] rounded border border-[#DCE8E2]">
                      <div className="font-bold text-[#19382C] text-[13px]">
                        [{res.documentTitle}] {res.matchedArticle}
                      </div>
                      <div className="text-[13px] text-[#42464E] mt-0.5 leading-relaxed">
                        {res.snippet}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 약관 정식 공문서 뷰 */}
          <div className="bg-[#FFFFFF] border border-[#DCD6C9] rounded-xl p-6 sm:p-8 space-y-6 shadow-xs font-serif">
            {/* 문서 헤더 */}
            <div className="border-b-2 border-[#151719] pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-reverence font-black text-xl sm:text-2xl text-[#141618]">
                    {currentDoc.title}
                  </h4>
                  <div className="text-[13px] text-[#5A5E66] mt-1 space-x-3">
                    <span>시행일자: <b>{currentDoc.effectiveDate}</b></span>
                    <span>버전: <b>{currentDoc.version}</b></span>
                  </div>
                </div>
                <span className="text-[13px] font-bold text-[#19382C] bg-[#DCE8E2] px-2.5 py-1 rounded border border-[#DCE8E2] shrink-0">
                  공식 법률 효력 규정
                </span>
              </div>

              {/* 전문 */}
              <div className="mt-4 p-3 bg-[#FAF9F6] rounded border border-[#DCD6C9] text-[13px] text-[#5A5E66] leading-relaxed">
                <span className="font-bold text-[#151719] block mb-1">【전 문】</span>
                {currentDoc.preamble}
              </div>
            </div>

            {/* 조항 본문 */}
            <div className="space-y-6 text-[13px] text-[#151719] leading-relaxed">
              {currentDoc.sections.map((sec, idx) => (
                <div key={idx} className="space-y-2 border-b border-[#DCD6C9] pb-4 last:border-0 last:pb-0">
                  <div className="font-bold text-sm text-[#19382C] flex items-center space-x-2">
                    <span>{sec.articleNumber}</span>
                  </div>

                  <div className="space-y-1.5 pl-1 text-[#42464E]">
                    {sec.paragraphs.map((p, pIdx) => (
                      <p key={pIdx} className="leading-relaxed">
                        {p}
                      </p>
                    ))}
                  </div>

                  {sec.notes && sec.notes.length > 0 && (
                    <div className="mt-2 p-2.5 bg-[#FAF9F6] border border-[#F1E9DB] rounded text-[13px] text-[#6E5429] space-y-1">
                      {sec.notes.map((note, nIdx) => (
                        <div key={nIdx} className="font-medium">
                          {note}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 7대 법률 준수 매트릭스 요약 표 */}
          <div className="p-4 bg-[#FFFFFF] rounded-xl border border-[#DCD6C9] space-y-2 text-[13px]">
            <h5 className="font-bold text-[#151719] flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#19382C]" />
              <span>대한민국 7대 관계 법령 적격 준수 감사 결과표</span>
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1 text-[13px]">
              {complianceMatrix.map((item, idx) => (
                <div key={idx} className="p-2.5 bg-[#FAF9F6] rounded border border-[#DCD6C9] flex flex-col justify-between">
                  <div>
                    <div className="font-bold text-[#19382C]">{item.lawName}</div>
                    <div className="text-[#5A5E66] text-[13px] mt-0.5">{item.enactedStandard}</div>
                    <div className="text-[#42464E] text-[13px] mt-1">{item.complianceMechanism}</div>
                  </div>
                  <div className="mt-2 text-right">
                    <span className="text-[13px] font-bold text-[#19382C] bg-[#DCE8E2] px-1.5 py-0.5 rounded border border-[#DCE8E2]">
                      ✓ 법적 검증 적격
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 하단 고정 닫기 툴바 */}
        <div className="no-print bg-[#FAF9F6] p-4 px-6 border-t border-[#DCD6C9] flex items-center justify-between shrink-0 text-[13px]">
          <span className="text-[#5A5E66] text-[13px]">
            법률 준법 지원: legal@baeung.kr · 고문 변호인단 직통 1588-0000
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
