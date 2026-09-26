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
import { Sparkles, Receipt, AlertCircle, TrendingDown, CheckCircle2 } from 'lucide-react';

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
      clientName: '유족 가족',
      packageType,
      hiddenCostSeverity
    });
  }, [competitorName, productName, totalContractAmount, totalInstallments, paidInstallments, hasMaturityRefund100, packageType, hiddenCostSeverity]);

  // 시각적 비율 계산 (막대 그래프용)
  const maxCost = Math.max(report.summary.competitorTotalCost, 1);
  const competitorRatio = 100;
  const baeungRatio = Math.round((report.summary.baeungTotalActualCost / maxCost) * 100);

  return (
    <div className="bg-porcelain rounded-3xl shadow-sm border border-ink-border p-6 md:p-10 space-y-8">
      {/* 1. 상단 사진 비주얼 헤더 배너 */}
      <div className="relative rounded-2xl overflow-hidden h-44 sm:h-56 border border-ink-border">
        <img
          src="/images/escort-ceremony.jpg"
          alt="정중한 의전 지도사 예우"
          className="w-full h-full object-cover object-center filter brightness-[0.55]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-mourning-950 via-mourning-950/40 to-transparent flex flex-col justify-end p-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-nobleGold-500/20 text-nobleGold-100 text-xs font-serif font-bold mb-2 border border-nobleGold-500/30 w-fit">
            <Sparkles className="w-3.5 h-3.5" />
            <span>공정거래위원회 고시 법정 기준 진단표</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-reverence font-black text-white tracking-tight">
            기존 상조 증서 정밀 예법 · 원가 진단표
          </h2>
          <p className="text-gray-200 text-xs sm:text-sm font-serif mt-1">
            공정위 법정 해약환급금과 배웅의 정직한 실비를 1:1 맞춤 영수증으로 투명하게 대조합니다.
          </p>
        </div>
      </div>

      {/* 2. 벤치마크 퀵 선택 탭 */}
      <div className="space-y-3">
        <label className="text-base font-bold text-ink block">
          보유 중이신 상조 상품 예시 선택
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { key: 'B', name: 'B상조 450 (42회 납입)', desc: '중도 28% 진행 상태' },
            { key: 'P', name: 'P상조 590 (80회 납입)', desc: '후반부 66% 납입 상태' },
            { key: 'H', name: 'H상조 480 (만기 완납)', desc: '100% 만기 환급 특약' }
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => handleSelectPreset(item.key as any)}
              className={`p-4 rounded-2xl text-left border-2 transition-all ${
                selectedPreset === item.key
                  ? 'border-celadon-700 bg-celadon-50/70 text-celadon-900 shadow-sm ring-1 ring-celadon-700/20'
                  : 'border-ink-border hover:border-ink-muted/50 bg-hanji/50 text-ink-light'
              }`}
            >
              <div className="text-base font-reverence font-bold text-ink">{item.name}</div>
              <div className="text-xs text-ink-muted mt-1">{item.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 3. 시니어 슬라이더 컨트롤러 */}
      <div className="bg-hanji rounded-3xl p-6 border border-ink-border space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <div>
            <span className="text-base font-bold text-ink">현재까지 납입하신 회차 조절</span>
            <p className="text-xs text-ink-muted">슬라이더를 좌우로 움직여 회차별 환급금을 확인하실 수 있습니다</p>
          </div>
          <span className="text-2xl font-reverence font-bold text-celadon-800">
            {paidInstallments}회 / 총 {totalInstallments}회 ({report.statutoryRefund.progressRatioPercentage}%)
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
          className="w-full h-3.5 bg-ink-border rounded-lg appearance-none cursor-pointer accent-celadon-700"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* 배웅 실비 의전 패키지 선택 */}
          <div>
            <label className="text-sm font-bold text-ink block mb-2">배웅 정찰제 의전 선택</label>
            <div className="grid grid-cols-3 gap-2">
              {(['simple_non_hall', 'economic_3day', 'standard_3day'] as BaeungPackageType[]).map((pkg) => (
                <button
                  key={pkg}
                  onClick={() => setPackageType(pkg)}
                  className={`py-3 px-2 text-xs rounded-xl font-bold border transition-all ${
                    packageType === pkg
                      ? 'border-celadon-700 bg-porcelain text-celadon-900 shadow-sm ring-1 ring-celadon-700/20'
                      : 'border-ink-border text-ink-muted hover:bg-porcelain'
                  }`}
                >
                  {pkg === 'simple_non_hall' ? '무빈소(120만)' : pkg === 'economic_3day' ? '실속형(250만)' : '표준형(350만)'}
                </button>
              ))}
            </div>
          </div>

          {/* 기존 상조 현장 추가금 예상 수준 */}
          <div>
            <label className="text-sm font-bold text-ink block mb-2">기존 상조 현장 추가금 통계</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'conservative', label: '최소 (+180만)' },
                { id: 'average', label: '평균 (+285만)' },
                { id: 'aggressive', label: '최대 (+500만)' }
              ].map((sev) => (
                <button
                  key={sev.id}
                  onClick={() => setHiddenCostSeverity(sev.id as any)}
                  className={`py-3 px-2 text-xs rounded-xl font-bold border transition-all ${
                    hiddenCostSeverity === sev.id
                      ? 'border-crimson-600 bg-crimson-50 text-crimson-700 shadow-sm'
                      : 'border-ink-border text-ink-muted hover:bg-porcelain'
                  }`}
                >
                  {sev.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. [신규 직관 시각화] 한눈에 보는 비용 비교 막대 인포그래픽 */}
      <div className="bg-porcelain border-2 border-celadon-700/30 rounded-3xl p-6 md:p-8 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-ink-border pb-3">
          <span className="font-reverence font-bold text-lg text-ink flex items-center space-x-2">
            <TrendingDown className="w-5 h-5 text-celadon-700" />
            <span>실질 총지출 시각적 비교 (한눈에 알아보기)</span>
          </span>
          <span className="text-xs font-serif font-bold text-celadon-800 bg-celadon-100 px-3 py-1 rounded-full">
            약 {report.summary.savingsRatePercentage}% 부담 경감
          </span>
        </div>

        <div className="space-y-5 pt-2">
          {/* 기존 상조 막대 */}
          <div>
            <div className="flex justify-between text-sm md:text-base font-serif font-bold mb-1.5">
              <span className="text-crimson-700">기존 상조 유지 시 (약정금 + 현장 추가금)</span>
              <span className="text-crimson-700 font-reverence text-lg font-black">
                {report.summary.competitorTotalCost.toLocaleString()}원
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-2xl h-8 overflow-hidden">
              <div
                style={{ width: `${competitorRatio}%` }}
                className="bg-crimson-600 h-full rounded-2xl flex items-center justify-end pr-4 text-xs font-bold text-white transition-all duration-500"
              >
                기존 총지출 100%
              </div>
            </div>
          </div>

          {/* 배웅 전환 막대 */}
          <div>
            <div className="flex justify-between text-sm md:text-base font-serif font-bold mb-1.5">
              <span className="text-celadon-800">배웅 전환 시 (실비 - 환급금 - 보전 크레딧)</span>
              <span className="text-celadon-800 font-reverence text-xl font-black">
                {report.summary.baeungTotalActualCost.toLocaleString()}원
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-2xl h-9 overflow-hidden p-0.5">
              <div
                style={{ width: `${Math.max(baeungRatio, 8)}%` }}
                className="bg-celadon-700 h-full rounded-2xl flex items-center justify-end pr-3 text-xs font-bold text-white transition-all duration-500 shadow-md"
              >
                {baeungRatio}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. 1:1 맞춤 영수증 좌우 대조표 */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-ink font-reverence font-bold text-xl">
          <Receipt className="w-5 h-5 text-nobleGold-500" />
          <span>1:1 정밀 영수증 항목별 대조 명세</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* [좌] 기존 상조 유지 시 영수증 */}
          <div className="bg-hanji/80 border-2 border-crimson-600/30 rounded-3xl p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="border-b border-ink-border pb-3.5">
                <span className="text-xs font-serif font-bold text-crimson-700 bg-crimson-50 px-3 py-1 rounded-full border border-crimson-600/20">
                  기존 선불식 상조 유지 시
                </span>
                <h3 className="text-lg md:text-xl font-reverence font-bold text-ink mt-2">
                  {report.leftCompetitorReceipt.title}
                </h3>
                <p className="text-xs text-ink-muted mt-1">{report.leftCompetitorReceipt.subtitle}</p>
              </div>

              <div className="space-y-3 text-sm md:text-base">
                {report.leftCompetitorReceipt.lineItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className={item.isWarning ? 'text-crimson-700 font-bold flex items-center' : 'text-ink-light'}>
                      {item.isWarning && <AlertCircle className="w-4 h-4 inline mr-1 text-crimson-600 shrink-0" />}
                      <span>{item.name}</span>
                    </span>
                    <span className="font-reverence font-bold text-ink">
                      +{item.amount.toLocaleString()}원
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-5 border-t-2 border-crimson-600/20 flex justify-between items-center">
              <span className="font-reverence font-bold text-ink text-base">예상 실질 총부담</span>
              <span className="text-2xl md:text-3xl font-reverence font-black text-crimson-700">
                {report.summary.competitorTotalCost.toLocaleString()}원
              </span>
            </div>
          </div>

          {/* [우] 배웅 정직 실비 전환 시 영수증 */}
          <div className="bg-celadon-50/50 border-2 border-celadon-600 rounded-3xl p-6 flex flex-col justify-between shadow-md ring-4 ring-celadon-600/10">
            <div className="space-y-4">
              <div className="border-b border-celadon-200 pb-3.5">
                <span className="text-xs font-serif font-bold text-celadon-800 bg-celadon-100 px-3 py-1 rounded-full border border-celadon-600/20">
                  배웅 정직 실비 전환 시
                </span>
                <h3 className="text-lg md:text-xl font-reverence font-bold text-ink mt-2">
                  {report.rightBaeungReceipt.title}
                </h3>
                <p className="text-xs text-ink-muted mt-1">{report.rightBaeungReceipt.subtitle}</p>
              </div>

              <div className="space-y-3 text-sm md:text-base">
                {report.rightBaeungReceipt.lineItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className={item.isHighlighted ? 'text-celadon-800 font-bold' : item.isDeduction ? 'text-blue-800 font-medium' : 'text-ink-light'}>
                      {item.name}
                    </span>
                    <span className={`font-reverence font-bold ${item.isDeduction ? 'text-blue-700' : item.isHighlighted ? 'text-celadon-700' : 'text-ink'}`}>
                      {item.amount > 0 ? `+${item.amount.toLocaleString()}` : item.amount.toLocaleString()}원
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-5 border-t-2 border-celadon-200 flex justify-between items-center">
              <span className="font-reverence font-bold text-ink text-base">배웅 실제 최종 부담</span>
              <span className="text-2xl md:text-3xl font-reverence font-black text-celadon-800">
                {report.summary.baeungTotalActualCost.toLocaleString()}원
              </span>
            </div>
          </div>
        </div>

        {/* 품격 있는 순 부담 차액 안내 배너 */}
        <div className="bg-gradient-to-r from-celadon-800 to-celadon-900 text-white rounded-3xl p-6 md:p-8 text-center shadow-lg space-y-2 border border-nobleGold-500/30">
          <div className="text-sm font-serif text-nobleGold-100">
            공정위 고시 법정 환급금 {report.statutoryRefund.refundAmount.toLocaleString()}원 수령 + 배웅 손실보전 크레딧 {report.transitionCredit.toLocaleString()}원 적용
          </div>
          <div className="text-3xl md:text-4xl font-reverence font-black text-nobleGold-100 tracking-tight">
            가족 실질 부담 차액: {report.summary.netSavingsAmount.toLocaleString()}원
          </div>
          <p className="text-xs md:text-sm text-celadon-200 pt-1 leading-relaxed">
            기존 상품을 해약하고 환급금을 받더라도, 배웅의 정찰제 실비를 이용하시는 것이 최종적으로 {report.summary.netSavingsAmount.toLocaleString()}원 더 정직하고 유리합니다.
          </p>
        </div>
      </div>
    </div>
  );
};
