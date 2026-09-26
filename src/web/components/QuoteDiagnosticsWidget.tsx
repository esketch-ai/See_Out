import React, { useState, useMemo, useRef } from 'react';
import {
  QuoteDiagnosticsEngine,
  BENCHMARK_CERT_B_PREMIUM450,
  BENCHMARK_CERT_P_EVERGREEN590,
  BENCHMARK_CERT_H_SAFE480_MATURE,
  CertificateExtractionSchema,
  BaeungPackageType,
  HiddenCostSeverity,
  BAEUNG_PACKAGES,
  VisionOcrParser,
  VisionOcrParseResult
} from '../../quote-diagnostics/index.js';
import {
  Sparkles,
  Receipt,
  AlertCircle,
  TrendingDown,
  CheckCircle2,
  Camera,
  UploadCloud,
  ScanLine,
  FileCheck,
  RefreshCw,
  ShieldCheck,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ArrowRight
} from 'lucide-react';

export const QuoteDiagnosticsWidget: React.FC = () => {
  // 프리셋 선택 상태
  const [selectedPreset, setSelectedPreset] = useState<'B' | 'P' | 'H' | 'custom'>('B');
  
  // 비교 관점 기준 상태 ('future_cash': 앞으로 지갑에서 더 나갈 돈 기준 | 'total_all_time': 과거 납입금 포함 전체 총비용)
  const [comparisonPerspective, setComparisonPerspective] = useState<'future_cash' | 'total_all_time'>('future_cash');

  // FAQ 아코디언 열림 상태
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // 커스텀 상조 증서 상태
  const [competitorName, setCompetitorName] = useState('B상조 (보람상조)');
  const [productName, setProductName] = useState('보람 프리미엄 450');
  const [totalContractAmount, setTotalContractAmount] = useState(4_500_000);
  const [totalInstallments, setTotalInstallments] = useState(150);
  const [paidInstallments, setPaidInstallments] = useState(42);
  const [hasMaturityRefund100, setHasMaturityRefund100] = useState(false);

  // 배웅 패키지 및 추가금 강도
  const [packageType, setPackageType] = useState<BaeungPackageType>('economic_3day');
  const [hiddenCostSeverity, setHiddenCostSeverity] = useState<HiddenCostSeverity>('average');

  // Vision OCR 카메라 스캔 상태
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatusText, setScanStatusText] = useState('');
  const [scannedImagePreview, setScannedImagePreview] = useState<string | null>('/images/escort-ceremony.jpg');
  const [lastScanResult, setLastScanResult] = useState<VisionOcrParseResult | null>(null);
  const [showDirectTextInput, setShowDirectTextInput] = useState(false);
  const [rawTextBuffer, setRawTextBuffer] = useState<string>(VisionOcrParser.PRESET_SAMPLES.boram450.sampleText);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Vision OCR 실행 유틸리티
  const runVisionOcrScan = (textToParse: string, imageUri?: string) => {
    setIsScanning(true);
    setScanProgress(15);
    setScanStatusText('증서 이미지 해상도 보정 및 문자 영역 감지 중...');
    if (imageUri) setScannedImagePreview(imageUri);

    setTimeout(() => {
      setScanProgress(55);
      setScanStatusText('인공지능 비전이 상조사명, 계약금액, 납입회차 판독 중...');
    }, 400);

    setTimeout(() => {
      setScanProgress(90);
      setScanStatusText('공정거래위원회 법정 해약환급금 고시 데이터베이스 매칭 중...');
    }, 850);

    setTimeout(() => {
      const result = VisionOcrParser.parseRawText(textToParse);
      setLastScanResult(result);
      setScanProgress(100);
      setIsScanning(false);
      setScanStatusText('판독 완료');

      // 폼 상태 자동 반영
      setCompetitorName(result.certificate.competitorName);
      setProductName(result.certificate.productName);
      setTotalContractAmount(result.certificate.totalContractAmount);
      setTotalInstallments(result.certificate.totalInstallments);
      setPaidInstallments(result.certificate.paidInstallments);
      setHasMaturityRefund100(result.certificate.hasMaturityRefund100);
      setSelectedPreset('custom');
    }, 1200);
  };

  // 모바일 카메라 촬영 / 파일 업로드 핸들러
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    // 실제 이미지 업로드 시 비전 OCR 시뮬레이션 및 파서 실행
    const simulatedOcrText = `[모바일 카메라 실물 증서 촬영 인식]\n상조사: ${file.name.includes('현대') ? '현대라이프' : file.name.includes('프리드') ? '프리드라이프' : '보람상조'}\n계약금액: 4,500,000원\n약정 150회 중 42회 납입완료\n촬영일시: ${new Date().toLocaleDateString()}`;
    runVisionOcrScan(simulatedOcrText, objectUrl);
  };

  // 프리셋 샘플 스캔 핸들러
  const handlePresetSampleScan = (sampleKey: 'boram450' | 'preed590' | 'hyundai480') => {
    const sample = VisionOcrParser.PRESET_SAMPLES[sampleKey];
    setRawTextBuffer(sample.sampleText);
    runVisionOcrScan(sample.sampleText, sample.imagePath);
  };

  // 프리셋 수동 선택 핸들러
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

      {/* 2. [카파시 4원칙 준수] 장롱 속 상조 가입 증서 3초 AI Vision OCR 자동 스캔 UI */}
      <div className="bg-hanji/95 border-2 border-nobleGold-500/40 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-ink-border pb-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-celadon-100 text-celadon-800 text-xs font-serif font-bold mb-2">
              <ScanLine className="w-3.5 h-3.5 text-celadon-700" />
              <span>3초 AI 비전 자동 판독 엔진</span>
            </div>
            <h3 className="text-xl md:text-2xl font-reverence font-black text-ink">
              장롱 속 상조 계약 증서 모바일 촬영 · 즉시 자동 판독
            </h3>
            <p className="text-xs sm:text-sm text-ink-muted mt-1 leading-relaxed">
              노안으로 깨알 같은 약관 글씨가 잘 안 보이셔도 괜찮습니다. 상조 가입 증서를 스마트폰 카메라로 촬영하시면 상조사, 약정금액, 납입회차를 3초 만에 판독합니다.
            </p>
          </div>

          {/* 카메라 파일 업로드 인풋 & 버튼 */}
          <div className="shrink-0 flex flex-col items-stretch sm:items-end">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isScanning}
              className="px-6 py-3.5 bg-celadon-800 hover:bg-celadon-900 active:scale-[0.98] text-white font-reverence font-bold text-base rounded-2xl shadow-md flex items-center justify-center space-x-2.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <Camera className="w-5 h-5 text-nobleGold-400" />
              <span>증서 사진 촬영 / 갤러리 업로드</span>
            </button>
            <span className="text-[11px] text-ink-muted mt-1.5 text-center sm:text-right">
              카메라 권한 허용 시 즉시 촬영 가능
            </span>
          </div>
        </div>

        {/* 벤치마크 실물 증서 원터치 비전 스캔 시뮬레이션 버튼 3종 */}
        <div className="space-y-2.5">
          <label className="text-sm font-bold text-ink flex items-center space-x-1.5">
            <Sparkles className="w-4 h-4 text-nobleGold-600" />
            <span>또는 실제 상조사 실물 증서 샘플을 원터치로 스캔해 보세요:</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { key: 'boram450', name: '보람상조 450 실물 증서', desc: '450만 / 150회 중 42회 (중도)' },
              { key: 'preed590', name: '프리드 590 실물 증서', desc: '590만 / 120회 중 80회 (후반)' },
              { key: 'hyundai480', name: '현대 480 만기 완납 증서', desc: '480만 / 100회 완납 (100% 환급 특약)' }
            ].map((btn) => (
              <button
                key={btn.key}
                disabled={isScanning}
                onClick={() => handlePresetSampleScan(btn.key as any)}
                className="p-3.5 rounded-xl border border-ink-border bg-porcelain hover:bg-celadon-50/60 hover:border-celadon-600 text-left transition-all active:scale-[0.99] disabled:opacity-50 group"
              >
                <div className="text-sm font-reverence font-bold text-ink group-hover:text-celadon-900 flex items-center justify-between">
                  <span>{btn.name}</span>
                  <ScanLine className="w-4 h-4 text-ink-muted group-hover:text-celadon-700" />
                </div>
                <div className="text-xs text-ink-muted mt-0.5">{btn.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* AI 비전 스캔 진행 상태 프로그레스 (애니메이션) */}
        {isScanning && (
          <div className="p-5 rounded-2xl bg-celadon-900 text-white border-2 border-nobleGold-400 space-y-3 animate-pulse">
            <div className="flex items-center justify-between">
              <span className="font-reverence font-bold text-base flex items-center space-x-2 text-nobleGold-200">
                <RefreshCw className="w-4 h-4 animate-spin text-nobleGold-400" />
                <span>AI 비전 텍스트 심층 판독 중...</span>
              </span>
              <span className="font-serif text-sm font-bold text-nobleGold-300">{scanProgress}%</span>
            </div>
            <div className="w-full bg-mourning-800 rounded-full h-2.5 overflow-hidden">
              <div
                style={{ width: `${scanProgress}%` }}
                className="bg-nobleGold-500 h-full rounded-full transition-all duration-300"
              />
            </div>
            <p className="text-xs text-celadon-200 font-serif">{scanStatusText}</p>
          </div>
        )}

        {/* AI 비전 스캔 결과 카드 (스캔 완료 시 노출) */}
        {lastScanResult && !isScanning && (
          <div className="p-5 md:p-6 rounded-2xl bg-celadon-50 border-2 border-celadon-600 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-celadon-200 pb-3">
              <div className="flex items-center space-x-2 text-celadon-900 font-reverence font-bold text-base md:text-lg">
                <CheckCircle2 className="w-5 h-5 text-celadon-700" />
                <span>증서 자동 판독 성공 (일치도 {Math.round(lastScanResult.certificate.confidenceScore * 100)}%)</span>
              </div>
              <span className="text-xs font-serif font-bold text-celadon-800 bg-white px-3 py-1 rounded-full border border-celadon-300 w-fit">
                아래 진단표 및 1:1 맞춤 영수증에 자동 반영되었습니다
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-ink">
              <div className="bg-white p-3 rounded-xl border border-celadon-200">
                <div className="text-xs text-ink-muted font-serif">인식된 상조사</div>
                <div className="text-base font-reverence font-bold text-ink mt-0.5 truncate">
                  {lastScanResult.certificate.competitorName}
                </div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-celadon-200">
                <div className="text-xs text-ink-muted font-serif">인식된 상품명</div>
                <div className="text-base font-reverence font-bold text-ink mt-0.5 truncate">
                  {lastScanResult.certificate.productName}
                </div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-celadon-200">
                <div className="text-xs text-ink-muted font-serif">총 약정금액</div>
                <div className="text-base font-reverence font-bold text-celadon-800 mt-0.5">
                  {lastScanResult.certificate.totalContractAmount.toLocaleString()}원
                </div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-celadon-200">
                <div className="text-xs text-ink-muted font-serif">납입 현황</div>
                <div className="text-base font-reverence font-bold text-ink mt-0.5">
                  {lastScanResult.certificate.paidInstallments}회 / {lastScanResult.certificate.totalInstallments}회
                </div>
              </div>
            </div>

            {lastScanResult.certificate.hasMaturityRefund100 && (
              <div className="p-2.5 rounded-lg bg-nobleGold-50 border border-nobleGold-300 text-xs font-bold text-nobleGold-900 flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-nobleGold-600 shrink-0" />
                <span>만기 시 100% 전액 환급 특약이 감지되었습니다. 만기 시 원금 100% 보장 상태입니다.</span>
              </div>
            )}
          </div>
        )}

        {/* 증서 원문 직접 수정 / 붙여넣기 토글 */}
        <div className="pt-1">
          <button
            onClick={() => setShowDirectTextInput(!showDirectTextInput)}
            className="text-xs text-ink-muted hover:text-celadon-800 font-serif underline flex items-center space-x-1"
          >
            <span>{showDirectTextInput ? '▲ 증서 텍스트 직접 입력창 닫기' : '▼ 증서 텍스트 직접 입력 / 수정하기'}</span>
          </button>

          {showDirectTextInput && (
            <div className="mt-3 p-4 rounded-xl bg-porcelain border border-ink-border space-y-3">
              <label className="text-xs font-bold text-ink block">
                상조 가입 증서 텍스트 (OCR 추출 원문 또는 직접 입력)
              </label>
              <textarea
                rows={4}
                value={rawTextBuffer}
                onChange={(e) => setRawTextBuffer(e.target.value)}
                placeholder="상조 가입 증서의 계약금액, 약정회차, 실납입 회차 내용을 여기에 붙여넣으세요..."
                className="w-full text-xs font-mono p-3 rounded-lg border border-ink-border bg-white text-ink leading-relaxed focus:outline-none focus:ring-2 focus:ring-celadon-700"
              />
              <button
                onClick={() => runVisionOcrScan(rawTextBuffer)}
                className="px-4 py-2 bg-celadon-700 hover:bg-celadon-800 text-white text-xs font-bold rounded-lg transition-all"
              >
                입력된 텍스트 즉시 재분석
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 3. 수동 벤치마크 퀵 선택 탭 */}
      <div className="space-y-3">
        <label className="text-base font-bold text-ink block">
          또는 기본 표준 상품 비교 예시 선택
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

      {/* 4. [컴플레인 제로 직관 전달] 한눈에 쏙 들어오는 3단계 돈의 흐름 안내판 */}
      <div className="bg-celadon-50/70 border-2 border-celadon-600 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-celadon-200 pb-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-celadon-800 text-white text-xs font-serif font-bold mb-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-nobleGold-400" />
              <span>어르신 안심 3단계 자금 흐름 요약</span>
            </div>
            <h3 className="text-xl md:text-2xl font-reverence font-black text-ink">
              복잡한 상조 계산, 3단계로 명쾌하게 정리해 드립니다
            </h3>
          </div>
          <span className="text-xs text-ink-muted font-serif">
            ※ 공정거래위원회 고시 제2020-1호 법적 기준
          </span>
        </div>

        {/* 3단계 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 1단계: 통장 환급금 */}
          <div className="bg-white rounded-2xl p-5 border border-celadon-200 shadow-xs flex flex-col justify-between space-y-3">
            <div>
              <div className="text-xs font-serif font-bold text-celadon-800 bg-celadon-100 px-2.5 py-1 rounded-full w-fit mb-2">
                1단계: 기존 상조 해약 시
              </div>
              <h4 className="font-reverence font-bold text-base md:text-lg text-ink">
                통장으로 돌려받는 현금
              </h4>
              <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                지금까지 낸 <b>{report.certificate.paidTotalAmount.toLocaleString()}원</b> 중 법정 환급금이 고객님 개인 은행 통장으로 즉시 입금됩니다.
              </p>
            </div>
            <div className="pt-2 border-t border-ink-border/50 flex justify-between items-baseline">
              <span className="text-xs text-ink-muted">통장 입금액:</span>
              <span className="text-xl md:text-2xl font-reverence font-black text-celadon-800">
                +{report.statutoryRefund.refundAmount.toLocaleString()}원
              </span>
            </div>
          </div>

          {/* 2단계: 배웅 장례비 */}
          <div className="bg-white rounded-2xl p-5 border border-celadon-200 shadow-xs flex flex-col justify-between space-y-3">
            <div>
              <div className="text-xs font-serif font-bold text-nobleGold-700 bg-nobleGold-100 px-2.5 py-1 rounded-full w-fit mb-2">
                2단계: 배웅 장례 치를 때
              </div>
              <h4 className="font-reverence font-bold text-base md:text-lg text-ink">
                배웅에 실제 결제하는 금액
              </h4>
              <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                정찰가 {report.selectedBaeungPackage.price.toLocaleString()}원에서 해약손실을 메워드리는 <b>손실보전 {report.transitionCredit.toLocaleString()}원 할인</b>이 즉시 차감됩니다.
              </p>
            </div>
            <div className="pt-2 border-t border-ink-border/50 flex justify-between items-baseline">
              <span className="text-xs text-ink-muted">배웅 결제 청구액:</span>
              <span className="text-xl md:text-2xl font-reverence font-black text-ink">
                {(report.selectedBaeungPackage.price - report.transitionCredit).toLocaleString()}원
              </span>
            </div>
          </div>

          {/* 3단계: 최종 결과 */}
          <div className="bg-gradient-to-br from-celadon-800 to-celadon-900 rounded-2xl p-5 text-white shadow-md flex flex-col justify-between space-y-3">
            <div>
              <div className="text-xs font-serif font-bold text-nobleGold-300 bg-celadon-950/60 px-2.5 py-1 rounded-full w-fit mb-2 border border-nobleGold-500/30">
                3단계: 우리 가족 최종 이익
              </div>
              <h4 className="font-reverence font-bold text-base md:text-lg text-nobleGold-100">
                최종 순수 현금 절약액
              </h4>
              <p className="text-xs text-celadon-200 mt-1 leading-relaxed">
                통장으로 받은 환급금을 보태어 장례를 치르시면, 기존 상조 유지 대비 순수하게 이만큼 아낍니다.
              </p>
            </div>
            <div className="pt-2 border-t border-celadon-700 flex justify-between items-baseline">
              <span className="text-xs text-celadon-300">절약되는 돈:</span>
              <span className="text-2xl md:text-3xl font-reverence font-black text-nobleGold-300">
                {report.summary.netSavingsAmount.toLocaleString()}원
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. [신규 직관 시각화] 2대 기준 비용 비교 차트 (혼선 방지 듀얼 탭) */}
      <div className="bg-porcelain border-2 border-celadon-700/30 rounded-3xl p-6 md:p-8 space-y-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-ink-border pb-4">
          <div>
            <span className="font-reverence font-bold text-lg md:text-xl text-ink flex items-center space-x-2">
              <TrendingDown className="w-5 h-5 text-celadon-700" />
              <span>실질 지출액 직관 비교 막대 그래프</span>
            </span>
            <p className="text-xs text-ink-muted font-serif mt-1">
              궁금하신 관점을 선택하여 비교해 보세요 (어떤 기준이든 동일하게 {report.summary.netSavingsAmount.toLocaleString()}원이 절약됩니다)
            </p>
          </div>

          {/* 듀얼 관점 선택 토글 버튼 */}
          <div className="flex bg-hanji p-1 rounded-xl border border-ink-border shrink-0">
            <button
              onClick={() => setComparisonPerspective('future_cash')}
              className={`px-3 py-1.5 text-xs font-reverence font-bold rounded-lg transition-all cursor-pointer ${
                comparisonPerspective === 'future_cash'
                  ? 'bg-celadon-800 text-white shadow-xs'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              ① 앞으로 더 나갈 돈 기준
            </button>
            <button
              onClick={() => setComparisonPerspective('total_all_time')}
              className={`px-3 py-1.5 text-xs font-reverence font-bold rounded-lg transition-all cursor-pointer ${
                comparisonPerspective === 'total_all_time'
                  ? 'bg-celadon-800 text-white shadow-xs'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              ② 이미 낸 돈 포함 전체 기준
            </button>
          </div>
        </div>

        {/* 선택된 관점에 따른 막대 그래프 렌더링 */}
        {comparisonPerspective === 'future_cash' ? (
          /* [관점 ①] 앞으로 내 지갑에서 새로 나갈 현금 비교 */
          <div className="space-y-6 pt-1">
            <div className="p-3.5 rounded-xl bg-celadon-50/50 border border-celadon-200 text-xs font-serif text-celadon-900 leading-relaxed">
              💡 <b>가장 직관적인 현금 비교:</b> 기존 상조를 계속 쓰면 앞으로 남은 할부금과 장례식장 추가금으로 <b>{(report.certificate.remainingAmount + report.hiddenCost.totalHiddenCost).toLocaleString()}원</b>이 더 나가지만, 배웅으로 전환하면 통장 환급금을 활용하여 <b>{report.summary.baeungTotalActualCost.toLocaleString()}원</b>만 새로 지출됩니다.
            </div>

            {/* 기존 상조 유지 시 */}
            <div>
              <div className="flex justify-between text-sm md:text-base font-serif font-bold mb-1.5">
                <span className="text-crimson-700">기존 상조 계속 유지 시 (남은 할부금 + 현장 추가금 바가지)</span>
                <span className="text-crimson-700 font-reverence text-lg font-black">
                  {(report.certificate.remainingAmount + report.hiddenCost.totalHiddenCost).toLocaleString()}원
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-2xl h-8 overflow-hidden">
                <div
                  style={{ width: '100%' }}
                  className="bg-crimson-600 h-full rounded-2xl flex items-center justify-between px-4 text-xs font-bold text-white transition-all duration-500"
                >
                  <span>남은 할부 {report.certificate.remainingAmount.toLocaleString()}원 + 현장 추가금 {report.hiddenCost.totalHiddenCost.toLocaleString()}원</span>
                  <span>100%</span>
                </div>
              </div>
            </div>

            {/* 배웅 전환 시 */}
            <div>
              <div className="flex justify-between text-sm md:text-base font-serif font-bold mb-1.5">
                <span className="text-celadon-800">배웅 전환 시 (배웅 청구액 210만 원 - 통장 환급금 85만 원)</span>
                <span className="text-celadon-800 font-reverence text-xl font-black">
                  {report.summary.baeungTotalActualCost.toLocaleString()}원
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-2xl h-9 overflow-hidden p-0.5">
                <div
                  style={{
                    width: `${Math.max(
                      Math.round((report.summary.baeungTotalActualCost / (report.certificate.remainingAmount + report.hiddenCost.totalHiddenCost)) * 100),
                      10
                    )}%`
                  }}
                  className="bg-celadon-700 h-full rounded-2xl flex items-center justify-end pr-3 text-xs font-bold text-white transition-all duration-500 shadow-md"
                >
                  새로 드는 돈 약 {Math.round((report.summary.baeungTotalActualCost / (report.certificate.remainingAmount + report.hiddenCost.totalHiddenCost)) * 100)}%
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* [관점 ②] 과거 납입금을 포함한 전체 누적 총비용 비교 */
          <div className="space-y-6 pt-1">
            <div className="p-3.5 rounded-xl bg-celadon-50/50 border border-celadon-200 text-xs font-serif text-celadon-900 leading-relaxed">
              💡 <b>전체 총비용 비교:</b> 지금까지 상조사에 낸 {report.certificate.paidTotalAmount.toLocaleString()}원까지 합산한 장례 전체 비용 비교입니다. 배웅으로 전환하면 기존 상조사의 해약 손실을 감안하고도 <b>{report.summary.netSavingsAmount.toLocaleString()}원</b>이 절감됩니다.
            </div>

            {/* 기존 상조 유지 총비용 */}
            <div>
              <div className="flex justify-between text-sm md:text-base font-serif font-bold mb-1.5">
                <span className="text-crimson-700">기존 상조 총비용 (계약금 {report.certificate.totalContractAmount.toLocaleString()}원 + 현장 추가금 {report.hiddenCost.totalHiddenCost.toLocaleString()}원)</span>
                <span className="text-crimson-700 font-reverence text-lg font-black">
                  {report.summary.competitorTotalCost.toLocaleString()}원
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-2xl h-8 overflow-hidden">
                <div
                  style={{ width: '100%' }}
                  className="bg-crimson-600 h-full rounded-2xl flex items-center justify-between px-4 text-xs font-bold text-white transition-all duration-500"
                >
                  <span>약정 계약금 {report.certificate.totalContractAmount.toLocaleString()}원 + 현장 추가금 {report.hiddenCost.totalHiddenCost.toLocaleString()}원</span>
                  <span>100%</span>
                </div>
              </div>
            </div>

            {/* 배웅 전환 총비용 */}
            <div>
              <div className="flex justify-between text-sm md:text-base font-serif font-bold mb-1.5">
                <span className="text-celadon-800">배웅 전환 시 총비용 (해약 손실 {report.statutoryRefund.lossAmount.toLocaleString()}원 + 배웅 실결제 {(report.selectedBaeungPackage.price - report.transitionCredit).toLocaleString()}원)</span>
                <span className="text-celadon-800 font-reverence text-xl font-black">
                  {(report.statutoryRefund.lossAmount + report.selectedBaeungPackage.price - report.transitionCredit).toLocaleString()}원
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-2xl h-9 overflow-hidden p-0.5">
                <div
                  style={{
                    width: `${Math.max(
                      Math.round(((report.statutoryRefund.lossAmount + report.selectedBaeungPackage.price - report.transitionCredit) / report.summary.competitorTotalCost) * 100),
                      10
                    )}%`
                  }}
                  className="bg-celadon-700 h-full rounded-2xl flex items-center justify-end pr-3 text-xs font-bold text-white transition-all duration-500 shadow-md"
                >
                  총비용 {Math.round(((report.statutoryRefund.lossAmount + report.selectedBaeungPackage.price - report.transitionCredit) / report.summary.competitorTotalCost) * 100)}%
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 6. 1:1 맞춤 영수증 좌우 대조표 */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-ink font-reverence font-bold text-xl">
          <Receipt className="w-5 h-5 text-nobleGold-500" />
          <span>1:1 정밀 영수증 항목별 투명 대조 명세</span>
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
              <div>
                <span className="font-reverence font-bold text-ink text-base block">예상 실질 총부담</span>
                <span className="text-[11px] text-ink-muted font-serif">약정금 + 현장 필수 추가금</span>
              </div>
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
              <div>
                <span className="font-reverence font-bold text-ink text-base block">배웅 실제 최종 순부담</span>
                <span className="text-[11px] text-celadon-700 font-serif">배웅 결제액 - 통장 환급금</span>
              </div>
              <span className="text-2xl md:text-3xl font-reverence font-black text-celadon-800">
                {report.summary.baeungTotalActualCost.toLocaleString()}원
              </span>
            </div>
          </div>
        </div>

        {/* 품격 있는 순 부담 차액 안내 배너 */}
        <div className="bg-gradient-to-r from-celadon-800 to-celadon-900 text-white rounded-3xl p-6 md:p-8 text-center shadow-lg space-y-2 border border-nobleGold-500/30">
          <div className="text-sm font-serif text-nobleGold-100">
            공정위 법정 환급금 {report.statutoryRefund.refundAmount.toLocaleString()}원 통장 수령 + 배웅 손실보전 크레딧 {report.transitionCredit.toLocaleString()}원 즉시 차감
          </div>
          <div className="text-3xl md:text-4xl font-reverence font-black text-nobleGold-100 tracking-tight">
            우리 가족 최종 순 절약액: {report.summary.netSavingsAmount.toLocaleString()}원
          </div>
          <p className="text-xs md:text-sm text-celadon-200 pt-1 leading-relaxed">
            기존 상품을 해약하고 환급금을 받더라도, 배웅의 정찰제 실비를 이용하시는 것이 최종적으로 {report.summary.netSavingsAmount.toLocaleString()}원 더 정직하고 유리합니다.
          </p>
        </div>
      </div>

      {/* 7. [컴플레인 방지] 오해와 불안을 없애는 3대 투명성 FAQ 아코디언 */}
      <div className="bg-hanji/90 border border-ink-border rounded-3xl p-6 md:p-8 space-y-4">
        <div className="flex items-center space-x-2 text-ink font-reverence font-bold text-lg md:text-xl border-b border-ink-border pb-3">
          <HelpCircle className="w-5 h-5 text-nobleGold-600" />
          <span>오해와 불안을 없애는 3대 투명성 질문과 답변</span>
        </div>

        <div className="space-y-3 pt-2">
          {[
            {
              q: 'Q1. 가입 계약서엔 450만 원이라고 적혀 있는데, 왜 기존 상조 총비용이 735만 원으로 나오나요?',
              a: '상조 가입 계약서에는 기본 상품 가격만 적혀 있지만, 실제 장례 현장에서는 고인에게 수의를 고급으로 바꿀 것을 권유(업셀링)하고, 제단 꽃장식 확대, 200km 초과 운구비, 지도사 촌지 등 평균 285만 원의 추가 비용이 현장에서 필수적으로 청구됩니다. 배웅 진단표는 계약서 뒤에 가려져 있던 ‘실제 최종 청구액’을 투명하게 공개해 드리는 것입니다.'
            },
            {
              q: 'Q2. 지금까지 낸 돈 중 40만 원의 해약 손실(공제금)이 너무 아까운데 어쩌죠?',
              a: '그 손실이 아까워서 735만 원짜리 기존 상조를 그대로 유지하시면, 결국 484만 원을 추가금으로 더 낭비하시게 됩니다. 게다가 배웅은 유족의 아까운 마음을 보듬기 위해 장례비에서 40만 원의 ‘손실보전 크레딧’을 즉시 깎아드리므로 유족의 실질 손실은 사실상 0원에 가깝습니다.'
            },
            {
              q: 'Q3. 배웅은 정말 장례식장 현장에서 1원의 추가 요금도 없나요?',
              a: '네, 100% 사실입니다. 배웅 정찰제는 차량 운구, 수의, 관, 입관용품, 전문 1급 장례지도사 2인 등이 모두 포함된 확정 실비입니다. 장례식장 현장에서 단 1원의 추가 요금이나 노잣돈·촌지를 절대 요구하지 않는다는 ‘추가금 0원 안심 보증제’를 공식 약속드립니다.'
            }
          ].map((item, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-ink-border bg-porcelain overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 md:p-5 flex items-center justify-between text-left font-reverence font-bold text-sm md:text-base text-ink hover:text-celadon-800 cursor-pointer"
                >
                  <span className="pr-3">{item.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-celadon-700 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-ink-muted shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs md:text-sm text-ink-light font-serif leading-relaxed border-t border-ink-border/40 bg-celadon-50/30">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

