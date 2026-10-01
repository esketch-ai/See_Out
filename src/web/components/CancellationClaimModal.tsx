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
  CheckCircle2,
  Mail,
  Send,
  Truck,
  RefreshCw,
  ShieldCheck
} from 'lucide-react';
import { CancellationClaimData } from '../../quote-diagnostics/types.js';
import { EgreenPostService, EgreenDispatchRecord } from '../../legal/index.js';
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
  const [dispatchRecord, setDispatchRecord] = useState<EgreenDispatchRecord | null>(null);
  const [isSending, setIsSending] = useState(false);

  const handleEgreenSend = () => {
    setIsSending(true);
    setTimeout(() => {
      const record = EgreenPostService.submitProofOfContent({
        ...claimData,
        claimantName,
        claimantPhone,
        claimantAddress,
        refundAccountBank: refundBank,
        refundAccountNumber: refundAccount,
        refundAccountHolder: refundHolder
      });
      setDispatchRecord(record);
      setIsSending(false);
    }, 600);
  };

  const handleAdvanceStatus = () => {
    if (dispatchRecord) {
      const updated = EgreenPostService.advanceStatus(dispatchRecord.dispatchId);
      if (updated) {
        setDispatchRecord({ ...updated });
      }
    }
  };

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

${claimData.claimDate || '발송 당일'}
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
              <span className="text-[13px] bg-[#8B2520]/60 text-[#E08578] px-2 py-0.5 rounded border border-[#731C18]/50 align-middle">
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
            {copiedText ? <Check className="w-4 h-4 text-[#243F35]" /> : <Copy className="w-4 h-4 text-[#C2A26A]" />}
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
          <button
            type="button"
            onClick={handleEgreenSend}
            disabled={isSending}
            className="px-4 py-2 bg-[#19382C] hover:bg-[#2D4F43] text-white rounded-md font-serif font-bold text-[13px] flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer border border-[#2D4F43]"
          >
            <Mail className="w-4 h-4 text-[#C2A26A]" />
            <span>{isSending ? '우체국 전송 중...' : '우체국 e-그린 등기 발송'}</span>
          </button>
        </ModalToolbar>

        {/* 본문 컨테이너 */}
        <div className="overflow-y-auto p-4 sm:p-8 space-y-6 bg-[#FAF9F6]">
          {/* ───────────────────────────────────────────────────────────── */}
          {/* 우체국 e-그린우편 실물 발송 현황 안내 및 접수증 카드 */}
          {/* ───────────────────────────────────────────────────────────── */}
          {dispatchRecord ? (
            <div className="bg-[#FFFFFF] border-2 border-[#19382C] rounded-[20px] p-6 shadow-md space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#DCD6C9] pb-3 gap-2">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#19382C] text-[#C2A26A] flex items-center justify-center border border-[#2D4F43]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-reverence font-bold text-base text-[#151719] flex items-center space-x-2">
                      <span>우정사업본부 e-그린우편 공인 전자내용증명 접수증</span>
                      <span className="text-[13px] bg-[#19382C] text-[#DCE8E2] px-2 py-0.5 rounded border border-[#2D4F43]">
                        법적 효력 등기
                      </span>
                    </h2>
                    <p className="text-[13px] text-[#5A5E66]">
                      접수번호: <span className="font-mono font-bold text-[#19382C]">{dispatchRecord.dispatchId}</span> (우편법 제15조 준수)
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleAdvanceStatus}
                  className="px-3 py-1.5 bg-[#FAF9F6] hover:bg-[#F1EDE3] border border-[#DCD6C9] rounded-md text-[13px] font-bold text-[#151719] flex items-center space-x-1.5 self-start sm:self-auto cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#19382C]" />
                  <span>배송 상태 갱신 (시뮬레이션)</span>
                </button>
              </div>

              {/* 4단계 배송 스테퍼 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[13px]">
                <div className={`p-3 rounded-lg border ${dispatchRecord.status === 'ACCEPTED' ? 'bg-[#19382C] text-white border-[#19382C]' : 'bg-[#FAF9F6] text-[#5A5E66] border-[#DCD6C9]'}`}>
                  <p className="font-bold">1단계. 전산 접수</p>
                  <p className="text-[13px] opacity-85 mt-0.5">우체국 시스템 등록</p>
                </div>
                <div className={`p-3 rounded-lg border ${dispatchRecord.status === 'PRINTED_ENCLOSED' ? 'bg-[#19382C] text-white border-[#19382C]' : 'bg-[#FAF9F6] text-[#5A5E66] border-[#DCD6C9]'}`}>
                  <p className="font-bold">2단계. 인쇄·봉입</p>
                  <p className="text-[13px] opacity-85 mt-0.5">전산용지 봉투 봉입</p>
                </div>
                <div className={`p-3 rounded-lg border ${dispatchRecord.status === 'POSTAL_DISPATCHED' ? 'bg-[#19382C] text-white border-[#19382C]' : 'bg-[#FAF9F6] text-[#5A5E66] border-[#DCD6C9]'}`}>
                  <p className="font-bold">3단계. 등기 출발</p>
                  <p className="text-[13px] opacity-85 mt-0.5">특급 집배국 전달</p>
                </div>
                <div className={`p-3 rounded-lg border ${dispatchRecord.status === 'DELIVERED' ? 'bg-[#19382C] text-white border-[#19382C]' : 'bg-[#FAF9F6] text-[#5A5E66] border-[#DCD6C9]'}`}>
                  <p className="font-bold">4단계. 본사 배달완료</p>
                  <p className="text-[13px] opacity-85 mt-0.5">수취인 날인 도달</p>
                </div>
              </div>

              {/* 실시간 상태 안내 및 바코드 */}
              <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#DCD6C9] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-[13px] w-full sm:w-auto">
                  <p className="font-bold text-[#151719] flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#19382C]" />
                    <span>현재 진행: {dispatchRecord.statusText}</span>
                  </p>
                  <p className="text-[#5A5E66]">
                    수신: <strong>{dispatchRecord.recipientName}</strong> ({dispatchRecord.recipientAddress})
                  </p>
                  <p className="text-[#5A5E66]">
                    배달 예정: <span className="font-bold text-[#19382C]">{dispatchRecord.estimatedDeliveryDate}</span>
                  </p>
                </div>

                {/* 13자리 바코드 그래픽 */}
                <div className="bg-white p-3 rounded-lg border border-[#DCD6C9] text-center shrink-0">
                  <div className="flex items-center justify-center space-x-1 h-8">
                    {[1, 3, 2, 4, 1, 3, 2, 1, 4, 2, 3, 1, 2, 4, 1, 3, 2, 1, 3].map((w, idx) => (
                      <div
                        key={idx}
                        className="bg-[#151719] h-full"
                        style={{ width: `${w * 1.8}px` }}
                      />
                    ))}
                  </div>
                  <span className="font-mono text-[13px] font-bold text-[#151719] tracking-wider block mt-1">
                    {dispatchRecord.postalBarcode}
                  </span>
                  <span className="text-[13px] text-[#6E5429] font-bold block mt-0.5">
                    {dispatchRecord.officialPostOfficeSeal}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#FFFFFF] border border-[#DCD6C9] rounded-[20px] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#19382C]/10 text-[#19382C] flex items-center justify-center shrink-0 border border-[#19382C]/20">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="text-[13px]">
                  <p className="font-bold text-[#151719]">
                    우체국에 직접 방문하거나 종이로 출력할 필요가 없습니다
                  </p>
                  <p className="text-[#5A5E66]">
                    우정사업본부 e-그린우편을 통해 상조사 본사로 공인 전자 내용증명 등기우편을 즉시 발송할 수 있습니다.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleEgreenSend}
                disabled={isSending}
                className="px-4 py-2.5 bg-[#19382C] hover:bg-[#2D4F43] text-white rounded-lg font-bold text-[13px] flex items-center space-x-1.5 shrink-0 transition-colors shadow-xs cursor-pointer border border-[#2D4F43]"
              >
                <Send className="w-4 h-4 text-[#C2A26A]" />
                <span>{isSending ? '우체국 전송 처리 중...' : '우체국 e-그린 등기 발송 신청'}</span>
              </button>
            </div>
          )}
          {/* ───────────────────────────────────────────────────────────── */}
          {/* A4 인쇄 규격 내용증명 공문서 포맷 */}
          {/* ───────────────────────────────────────────────────────────── */}
          <div className="print-single-page print-booklet-page k-corner-bracket k-changho-texture bg-[#FFFFFF] border border-[#DCD6C9] rounded-[24px] p-8 sm:p-14 space-y-6 shadow-xs relative">
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
                {claimData.claimDate || '발송 당일'}
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
