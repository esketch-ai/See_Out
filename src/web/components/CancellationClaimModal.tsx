import React, { useState } from 'react';
import {
  X,
  Printer,
  Copy,
  Check,
  FileText,
  AlertTriangle,
  Scale,
  Building2,
  Calendar,
  CreditCard,
  CheckCircle2
} from 'lucide-react';
import { CancellationClaimData } from '../../quote-diagnostics/types.js';
import { TraditionalSeal } from '../design-system/index.js';
import { ModalShell, ModalToolbar } from './ModalShell.js';

interface CancellationClaimModalProps {
  claimData: CancellationClaimData;
  onClose: () => void;
}

export const CancellationClaimModal: React.FC<CancellationClaimModalProps> = ({
  claimData,
  onClose
}) => {
  const [claimantName, setClaimantName] = useState(claimData.claimantName);
  const [claimantPhone, setClaimantPhone] = useState(claimData.claimantPhone);
  const [claimantAddress, setClaimantAddress] = useState(claimData.claimantAddress);
  const [refundBank, setRefundBank] = useState(claimData.refundAccountBank);
  const [refundAccount, setRefundAccount] = useState(claimData.refundAccountNumber);
  const [refundHolder, setRefundHolder] = useState(claimData.refundAccountHolder);

  const [copiedText, setCopiedText] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const fullClaimText = `[내용증명] 선불식 할부계약 해제 및 법정 해약환급금 지급 청구서

1. 수신인
- 상호: ${claimData.competitorName}
- 대표자: ${claimData.competitorCeo} 대표이사 귀하
- 주소: ${claimData.competitorAddress}

2. 발신인 (계약자)
- 성명: ${claimantName}
- 연락처: ${claimantPhone}
- 주소: ${claimantAddress}

3. 계약 내역
- 계약(회원)번호: ${claimData.contractNumber}
- 계약 상품명: ${claimData.productName}
- 계약 체결일: ${claimData.contractDate}
- 총 약정 금액: ${claimData.totalContractAmount.toLocaleString()}원 (${claimData.totalInstallments}회 약정)
- 현재 실 납입액: ${claimData.paidTotalAmount.toLocaleString()}원 (${claimData.paidInstallments}회 납입)

4. 해약 사유 및 법정 환급 청구 금액
- 사유: 계약자의 사정에 의한 중도 해약
- 법정 해약환급금 청구액: 금 ${claimData.statutoryRefundAmount.toLocaleString()}원정
- 환급금 입금 계좌: ${refundBank} ${refundAccount} (예금주: ${refundHolder})

5. 법적 근거 및 지연배상금 고지
「할부거래에 관한 법률」 제34조 제2항 및 공정거래위원회 고시 제2020-1호 「선불식 할부계약의 해약환급금 산정기준」에 의거하여, 귀사는 본 통고서를 송달받은 날로부터 3영업일 이내에 위 법정 환급금을 상기 지정 계좌로 지급하여 주시기 바랍니다.
만약 정당한 사유 없이 3영업일 이내에 환급금을 미지급할 경우, 동법 제34조 제3항에 의거 연 15%의 지연이자(지연배상금)가 가산 청구되며, 관할 공정거래위원회 및 한국소비자원에 정식 분쟁 조정과 과태료 처분을 신청할 것임을 엄중히 통지합니다.

2026년 09월 27일
발신인: ${claimantName} (인)`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(fullClaimText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  return (
    <ModalShell
        onClose={onClose}
        maxWidth="max-w-4xl"
        maxHeight="max-h-[96vh]"
        surface="paper"
        overlayScroll
        serif
        titleId="claim-title"
        descriptionId="claim-desc"
    >
        {/* 상단 컨트롤 툴바 (인쇄 시 숨김 no-print) */}
                <ModalToolbar
          titleId="claim-title"
          descriptionId="claim-desc"
          onClose={onClose}
          closeLabel="내용증명 닫기"
          icon={
            <div className="w-8 h-8 rounded-full bg-[#19382C] text-[#C2A26A] flex items-center justify-center border border-[#2D4F43] shrink-0">
              <Scale className="w-4 h-4" />
            </div>
          }
          title={
            <>
              법정 해약환급금 지급 청구서 (내용증명 표준 서식){' '}
              <span className="text-[13px] bg-red-950/60 text-red-300 px-2 py-0.5 rounded border border-red-800/50 align-middle">
                공정위 고시 제2020-1호 준수
              </span>
            </>
          }
          subtitle={
            <span id="claim-desc">공정거래위원회 기준에 의거하여 상조회사 본사에 내용증명으로 발송할 수 있는 법적 효력 청구서입니다.</span>
          }
        >
          <button
            type="button"
            onClick={handleCopy}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-[#FAF9F6] rounded-md font-serif font-bold text-[13px] flex items-center space-x-1.5 transition-colors cursor-pointer border border-white/20"
          >
            {copiedText ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-[#C2A26A]" />}
            <span>{copiedText ? '복사 완료' : '전문 텍스트 복사'}</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 bg-[#19382C] hover:bg-[#2D4F43] text-white rounded-md font-serif font-bold text-[13px] flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer border border-[#2D4F43]"
          >
            <Printer className="w-4 h-4 text-[#C2A26A]" />
            <span>A4 인쇄 / PDF 저장</span>
          </button>
        </ModalToolbar>

        {/* 본문 컨테이너 */}
        <div className="overflow-y-auto p-4 sm:p-8 space-y-6 bg-[#FAF9F6]">
          {/* ───────────────────────────────────────────────────────────── */}
          {/* A4 인쇄 규격 내용증명 공문서 포맷 */}
          {/* ───────────────────────────────────────────────────────────── */}
          <div className="print-booklet-page k-corner-bracket k-changho-texture bg-[#FFFFFF] border border-[#DCD6C9] rounded-[24px] p-8 sm:p-14 space-y-6 shadow-xs relative">
            {/* 상단 공문서 헤더 */}
            <div className="border-b-2 border-[#151719] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[13px] text-[#6E5429] font-bold tracking-widest block uppercase">
                  Official Legal Notice
                </span>
                <h1 className="text-xl sm:text-2xl font-reverence font-bold text-[#151719] mt-0.5">
                  선불식 할부계약 해제 및 법정 해약환급금 지급 청구서 (내용증명)
                </h1>
              </div>
              <span className="text-[13px] font-mono text-[#5A5E66] shrink-0">
                문서 번호: {claimData.claimId}
              </span>
            </div>

            {/* 1. 수신인 & 발신인 그리드 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px]">
              {/* 수신인 */}
              <div className="bg-[#FAF9F6] p-4 rounded-lg border border-[#DCD6C9] space-y-2">
                <span className="font-bold text-[#151719] block border-b border-[#DCD6C9] pb-1">
                  1. 수신인 (상조회사)
                </span>
                <div className="space-y-1 text-[#42464E]">
                  <p><strong>상호:</strong> {claimData.competitorName}</p>
                  <p><strong>대표자:</strong> {claimData.competitorCeo} 대표이사 귀하</p>
                  <p><strong>본사 주소:</strong> {claimData.competitorAddress}</p>
                </div>
              </div>

              {/* 발신인 */}
              <div className="bg-[#FAF9F6] p-4 rounded-lg border border-[#DCD6C9] space-y-2">
                <span className="font-bold text-[#151719] block border-b border-[#DCD6C9] pb-1">
                  2. 발신인 (가입 계약자)
                </span>
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-1">
                    <span className="w-14 text-[#5A5E66] shrink-0">성명:</span>
                    <input
                      type="text"
                      value={claimantName}
                      onChange={(e) => setClaimantName(e.target.value)}
                      className="no-print p-1 bg-white border border-[#DCD6C9] rounded text-[13px] font-bold text-[#151719] w-full"
                    />
                    <span className="print-only font-bold text-[#151719]">{claimantName}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="w-14 text-[#5A5E66] shrink-0">연락처:</span>
                    <input
                      type="text"
                      value={claimantPhone}
                      onChange={(e) => setClaimantPhone(e.target.value)}
                      className="no-print p-1 bg-white border border-[#DCD6C9] rounded text-[13px] text-[#151719] w-full"
                    />
                    <span className="print-only text-[#151719]">{claimantPhone}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="w-14 text-[#5A5E66] shrink-0">주소:</span>
                    <input
                      type="text"
                      value={claimantAddress}
                      onChange={(e) => setClaimantAddress(e.target.value)}
                      className="no-print p-1 bg-white border border-[#DCD6C9] rounded text-[13px] text-[#151719] w-full"
                    />
                    <span className="print-only text-[#151719]">{claimantAddress}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. 가입 계약 체결 내역 */}
            <div className="space-y-2 text-[13px]">
              <span className="font-bold text-[#151719] block">3. 계약 체결 사항</span>
              <div className="border border-[#DCD6C9] rounded-lg overflow-hidden">
                <table className="w-full text-left divide-y divide-[#DCD6C9]">
                  <tbody className="divide-y divide-[#DCD6C9] bg-[#FFFFFF]">
                    <tr>
                      <th className="bg-[#FAF9F6] p-2.5 w-1/4 text-[#5A5E66] font-medium">계약(회원)번호</th>
                      <td className="p-2.5 font-mono font-bold text-[#151719]">{claimData.contractNumber}</td>
                      <th className="bg-[#FAF9F6] p-2.5 w-1/4 text-[#5A5E66] font-medium">상품명</th>
                      <td className="p-2.5 font-bold text-[#151719]">{claimData.productName}</td>
                    </tr>
                    <tr>
                      <th className="bg-[#FAF9F6] p-2.5 text-[#5A5E66] font-medium">총 약정금액</th>
                      <td className="p-2.5 text-[#151719]">{claimData.totalContractAmount.toLocaleString()}원 ({claimData.totalInstallments}회 약정)</td>
                      <th className="bg-[#FAF9F6] p-2.5 text-[#5A5E66] font-medium">실 납입 누계액</th>
                      <td className="p-2.5 font-bold text-[#8B2520]">{claimData.paidTotalAmount.toLocaleString()}원 ({claimData.paidInstallments}회 납입)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 3. 법정 해약환급금 산출 내역 및 지급 요청 */}
            <div className="bg-[#FAF9F6] border-2 border-[#19382C] rounded-xl p-5 space-y-3 text-[13px]">
              <div className="flex items-center justify-between border-b border-[#DCD6C9] pb-2">
                <span className="font-reverence font-bold text-sm text-[#19382C]">
                  4. 법정 해약환급금 산출 명세 및 지급 계좌
                </span>
                <span className="text-[13px] font-bold text-[#6E5429]">
                  공정위 체증 환급률 적용
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FFFFFF] p-4 rounded-lg border border-[#DCD6C9]">
                <div>
                  <span className="text-[#5A5E66] block">법정 지급 청구 금액:</span>
                  <span className="text-2xl font-reverence font-black text-[#19382C]">
                    금 {claimData.statutoryRefundAmount.toLocaleString()}원정
                  </span>
                </div>
                <div className="text-[13px] text-[#5A5E66] sm:text-right space-y-0.5">
                  <p>실 납입금: {claimData.paidTotalAmount.toLocaleString()}원</p>
                  <p>법정 모집수수료 공제 후 실 수령 권리액</p>
                </div>
              </div>

              {/* 환급 수령 계좌 인풋 */}
              <div className="pt-2 space-y-1.5">
                <span className="text-[#5A5E66] font-bold block">환급금 수령 지정 계좌:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={refundBank}
                    onChange={(e) => setRefundBank(e.target.value)}
                    placeholder="은행명"
                    className="no-print p-2 bg-white border border-[#DCD6C9] rounded text-[13px] text-[#151719]"
                  />
                  <input
                    type="text"
                    value={refundAccount}
                    onChange={(e) => setRefundAccount(e.target.value)}
                    placeholder="계좌번호"
                    className="no-print p-2 bg-white border border-[#DCD6C9] rounded text-[13px] text-[#151719]"
                  />
                  <input
                    type="text"
                    value={refundHolder}
                    onChange={(e) => setRefundHolder(e.target.value)}
                    placeholder="예금주"
                    className="no-print p-2 bg-white border border-[#DCD6C9] rounded text-[13px] text-[#151719]"
                  />
                </div>
                <p className="print-only text-sm font-bold text-[#151719] pt-1">
                  {refundBank} {refundAccount} (예금주: {refundHolder})
                </p>
              </div>
            </div>

            {/* 4. 법적 근거 및 지연배상금 고지문 */}
            <div className="p-4 bg-[#FFFFFF] border border-[#DCD6C9] rounded-lg space-y-2 text-[13px] text-[#42464E] leading-relaxed">
              <span className="font-bold text-[#151719] block">
                5. 법적 근거 및 지연배상금 가산 고지
              </span>
              <p>
                1) 「할부거래에 관한 법률」 제34조 제2항 및 공정거래위원회 고시 제2020-1호 「선불식 할부계약의 해약환급금 산정기준」에 의거하여, 귀사는 본 통고서를 송달받은 날로부터 <strong>3영업일 이내</strong>에 위 법정 환급금을 상기 지정 계좌로 지급하여 주시기 바랍니다.
              </p>
              <p>
                2) 만약 정당한 사유 없이 3영업일 이내에 환급금을 미지급할 경우, 동법 제34조 제3항 및 동법 시행령 제15조에 의거하여 <strong>연 15%의 지연이자(지연배상금)</strong>가 가산 청구되며, 관할 공정거래위원회 및 한국소비자원에 정식 분쟁 조정과 과태료 처분을 신청할 것임을 정중히 통지합니다.
              </p>
            </div>

            {/* 날짜 및 발신인 서명 날인란 */}
            <div className="pt-6 text-center space-y-3">
              <p className="text-sm font-bold text-[#151719]">
                2026년 09월 27일
              </p>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-base font-reverence font-bold text-[#151719]">
                  발신인: {claimantName}
                </span>
                <span className="k-seal-red px-2 py-0.5 text-[13px]">印</span>
              </div>
            </div>
          </div>
        </div>
    </ModalShell>
  );
};
