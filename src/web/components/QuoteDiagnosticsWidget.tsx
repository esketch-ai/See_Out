import React, { useState, useMemo } from 'react';
import {
  QuoteDiagnosticsEngine,
  BENCHMARK_CERT_B_PREMIUM450,
  BENCHMARK_CERT_P_EVERGREEN590,
  BENCHMARK_CERT_H_SAFE480_MATURE,
  CertificateExtractionSchema,
  BaeungPackageType,
  HiddenCostSeverity,
  BAEUNG_PACKAGES
} from '../../quote-diagnostics/index.js';
import { Calculator, ArrowRight, ShieldCheck, AlertCircle, Sparkles, Receipt, CheckCircle } from 'lucide-react';

export const QuoteDiagnosticsWidget: React.FC = () => {
  // 프리셋 선택 상태
  const [selectedPreset, setSelectedPreset] = useState<'B' | 'P' | 'H' | 'custom'>('B');
  
  // 커스텀 상조 증서 상태
  const [competitorName, setCompetitorName] = useState('B상조');
  const [productName, setProductName] = useState('프리미엄 450');
  const [totalContractAmount, setTotalContractAmount] = useState(4_500_000);
  const [totalInstallments, setTotalInstallments] = useState(150);
  const [paidInstallments, setPaidInstallments] = useState(42);
  const [hasMaturityRefund100, setHasMaturityRefund100] = useState(false);

  // 배웅 패키지 및 추가금 강도
  const [packageType, setPackageType] = useState<BaeungPackageType>('economic_3day');
  const [hiddenCostSeverity, setHiddenCostSeverity] = useState<HiddenCostSeverity>('average');

  // 프리셋 변경 핸들러
  const handleSelectPreset = (key: 'B' | 'P' | 'H') => {
    setSelectedPreset(key);
    let cert: CertificateExtractionSchema;
    if (key === 'B') cert = BENCHMARK_CERT_B_PREMIUM450;
    else if (key === 'P') cert = BENCHMARK_CERT_P_EVERGREEN590;
    else cert = BENCHMARK_CERT_H_SAFE480_MATURE;

    setCompetitorName(cert.competitorName);
    setProductName(cert.productName);
    setTotalContractAmount(cert.totalContractAmount);
    setTotalInstallments(cert.totalInstallments);
    setPaidInstallments(cert.paidInstallments);
    setHasMaturityRefund100(cert.hasMaturityRefund100);
  };

  // 실시간 진단 결과 산출
  const report = useMemo(() => {
    const monthlyPayment = Math.floor(totalContractAmount / Math.max(1, totalInstallments));
    const paidTotalAmount = monthlyPayment * paidInstallments;

    const cert: CertificateExtractionSchema = {
      certificateId: 'CUSTOM-CERT',
      recognizedAt: new Date().toISOString(),
      competitorName,
      productName,
      contractDate: '2022-01-01',
      totalContractAmount,
      monthlyPayment,
      totalInstallments,
      paidInstallments,
      paidTotalAmount,
      remainingAmount: Math.max(0, totalContractAmount - paidTotalAmount),
      hasMaturityRefund100,
      confidenceScore: 1.0
    };

    return QuoteDiagnosticsEngine.diagnose({
      certificate: cert,
      clientName: '회원님',
      packageType,
      hiddenCostSeverity
    });
  }, [competitorName, productName, totalContractAmount, totalInstallments, paidInstallments, hasMaturityRefund100, packageType, hiddenCostSeverity]);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 md:p-8 space-y-8">
      {/* 타이틀 헤더 */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>공정거래위원회 고시 기준 1:1 영수증 비교</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
          내 상조 견적 진단기 — 손익 계산 시뮬레이터
        </h2>
        <p className="text-gray-600 mt-1.5 text-base">
          기존 선불식 상조를 해약하고 환급금을 받아 배웅으로 전환했을 때 남는 **순 절감액**을 실시간으로 확인하세요.
        </p>
      </div>

      {/* 벤치마크 퀵 선택 탭 */}
      <div className="space-y-3">
        <label className="text-sm font-bold text-gray-700">대표 상조사 상품 예시로 즉시 계산해보기</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { key: 'B', name: 'B상조 450 (42회)', desc: '중도 납입 28%' },
            { key: 'P', name: 'P상조 590 (80회)', desc: '후반부 66%' },
            { key: 'H', name: 'H상조 480 (만기)', desc: '100% 완납 특약' }
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => handleSelectPreset(item.key as any)}
              className={`p-3 rounded-2xl text-left border-2 transition-all ${
                selectedPreset === item.key
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="text-sm md:text-base font-extrabold">{item.name}</div>
              <div className="text-xs text-gray-500 mt-0.5">{item.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 슬라이더 인터랙션 컨트롤러 */}
      <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 space-y-5">
        <div className="flex justify-between items-center">
          <span className="text-sm font-bold text-gray-700">현재 납입 회차 조절</span>
          <span className="text-lg font-black text-emerald-700">
            {paidInstallments}회 / {totalInstallments}회 ({report.statutoryRefund.progressRatioPercentage}%)
          </span>
        </div>
        <input
          type="range"
          min={1}
          max={totalInstallments}
          value={paidInstallments}
          onChange={(e) => {
            setSelectedPreset('custom');
            setPaidInstallments(Number(e.target.value));
          }}
          className="w-full h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* 배웅 전환 패키지 선택 */}
          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1.5">배웅 전환 패키지 선택</label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['simple_non_hall', 'economic_3day', 'standard_3day'] as BaeungPackageType[]).map((pkg) => (
                <button
                  key={pkg}
                  onClick={() => setPackageType(pkg)}
                  className={`py-2 px-1 text-xs rounded-xl font-bold border transition-all ${
                    packageType === pkg
                      ? 'border-emerald-600 bg-white text-emerald-800 shadow-sm'
                      : 'border-gray-200 text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {pkg === 'simple_non_hall' ? '무빈소(120만)' : pkg === 'economic_3day' ? '실속형(250만)' : '표준형(350만)'}
                </button>
              ))}
            </div>
          </div>

          {/* 현장 추가금 강도 */}
          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1.5">기존 상조 현장 추가금 예상 수준</label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'conservative', label: '최소(+180만)' },
                { id: 'average', label: '평균(+285만)' },
                { id: 'aggressive', label: '최대(+500만)' }
              ].map((sev) => (
                <button
                  key={sev.id}
                  onClick={() => setHiddenCostSeverity(sev.id as any)}
                  className={`py-2 px-1 text-xs rounded-xl font-bold border transition-all ${
                    hiddenCostSeverity === sev.id
                      ? 'border-red-500 bg-red-50 text-red-800 shadow-sm'
                      : 'border-gray-200 text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {sev.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 1:1 맞춤 영수증 좌우 대조 UI (핵심 시각화) */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-gray-900 font-extrabold text-lg">
          <Receipt className="w-5 h-5 text-emerald-600" />
          <span>1:1 맞춤 영수증 실시간 비교표</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* [좌] 기존 상조 유지 시 영수증 */}
          <div className="bg-red-50/50 border-2 border-red-200 rounded-3xl p-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="border-b border-red-200 pb-3">
                <span className="text-xs font-bold text-red-600 bg-red-100 px-2.5 py-0.5 rounded-full">
                  기존 방식 유지 시
                </span>
                <h3 className="text-lg font-black text-gray-900 mt-1.5">
                  {report.leftCompetitorReceipt.title}
                </h3>
                <p className="text-xs text-gray-500">{report.leftCompetitorReceipt.subtitle}</p>
              </div>

              <div className="space-y-2.5 text-sm">
                {report.leftCompetitorReceipt.lineItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className={item.isWarning ? 'text-red-700 font-bold flex items-center space-x-1' : 'text-gray-700'}>
                      {item.isWarning && <AlertCircle className="w-3.5 h-3.5 inline mr-1 text-red-500" />}
                      <span>{item.name}</span>
                    </span>
                    <span className="font-extrabold text-gray-900">
                      +{item.amount.toLocaleString()}원
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t-2 border-red-200 flex justify-between items-center">
              <span className="font-bold text-red-900">예상 총 지출</span>
              <span className="text-2xl font-black text-red-600">
                {report.summary.competitorTotalCost.toLocaleString()}원
              </span>
            </div>
          </div>

          {/* [우] 배웅 전환 시 영수증 */}
          <div className="bg-emerald-50/60 border-2 border-emerald-500 rounded-3xl p-5 flex flex-col justify-between shadow-md ring-4 ring-emerald-500/10">
            <div className="space-y-4">
              <div className="border-b border-emerald-200 pb-3">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-200 px-2.5 py-0.5 rounded-full">
                  배웅 후불제 전환 시
                </span>
                <h3 className="text-lg font-black text-gray-900 mt-1.5">
                  {report.rightBaeungReceipt.title}
                </h3>
                <p className="text-xs text-gray-600">{report.rightBaeungReceipt.subtitle}</p>
              </div>

              <div className="space-y-2.5 text-sm">
                {report.rightBaeungReceipt.lineItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className={item.isHighlighted ? 'text-emerald-700 font-bold' : item.isDeduction ? 'text-blue-700 font-medium' : 'text-gray-700'}>
                      {item.name}
                    </span>
                    <span className={`font-extrabold ${item.isDeduction ? 'text-blue-600' : item.isHighlighted ? 'text-emerald-600' : 'text-gray-900'}`}>
                      {item.amount > 0 ? `+${item.amount.toLocaleString()}` : item.amount.toLocaleString()}원
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t-2 border-emerald-300 flex justify-between items-center">
              <span className="font-bold text-emerald-950">실제 최종 부담</span>
              <span className="text-2xl font-black text-emerald-700">
                {report.summary.baeungTotalActualCost.toLocaleString()}원
              </span>
            </div>
          </div>
        </div>

        {/* 대형 순 절감액 하이라이트 배너 */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-3xl p-6 text-center shadow-lg space-y-2">
          <div className="text-sm font-bold text-emerald-100">
            공정위 고시 환급금 {report.statutoryRefund.refundAmount.toLocaleString()}원 수령 + 배웅 크레딧 {report.transitionCredit.toLocaleString()}원 지원
          </div>
          <div className="text-3xl md:text-4xl font-black tracking-tight">
            총 {report.summary.netSavingsAmount.toLocaleString()}원 절감
          </div>
          <div className="inline-block bg-white/20 backdrop-blur px-4 py-1 rounded-full text-sm font-semibold">
            기존 대비 {report.summary.savingsRatePercentage}% 비용 절감 효과
          </div>
        </div>
      </div>
    </div>
  );
};
