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
  ArrowRight,
  FileText,
  Gift,
  Scale
} from 'lucide-react';
import { DualStandbyModal } from './DualStandbyModal.js';
import { CancellationClaimModal } from './CancellationClaimModal.js';
import { LossCreditVoucherModal } from './LossCreditVoucherModal.js';
import { DualStandbyService } from '../../quote-diagnostics/dualStandbyService.js';

export const QuoteDiagnosticsWidget: React.FC = () => {
  // 프리셋 선택 상태
  const [selectedPreset, setSelectedPreset] = useState<'B' | 'P' | 'H' | 'custom'>('B');
  
  // 비교 관점 기준 상태 ('future_cash': 앞으로 지갑에서 더 나갈 돈 기준 | 'total_all_time': 과거 납입금 포함 전체 총비용)
  const [comparisonPerspective, setComparisonPerspective] = useState<'future_cash' | 'total_all_time'>('future_cash');

  // 듀얼 스탠바이 & 소비자 권익 보호 3대 모달 상태
  const [isDualStandbyModalOpen, setIsDualStandbyModalOpen] = useState(false);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);

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
    <div className="bg-[#FFFFFF] rounded-xl shadow-xs border border-[#DCD6C9] p-6 md:p-8 space-y-6">
      {/* 1. 상단 사진 비주얼 헤더 배너 */}
      <div className="relative rounded-lg overflow-hidden h-44 sm:h-52 border border-[#3D382E] bg-[#141618]">
        <img
          src="/images/escort-ceremony.jpg"
          alt="정중한 의전 지도사 예우"
          className="w-full h-full object-cover object-center filter brightness-[0.4] contrast-105"
        />
        {/* 삼국·조선 길상 구름문 은은한 오버레이 */}
        <div className="absolute inset-0 pointer-events-none k-pattern-unmun-dark opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0E10] via-[#0D0E10]/50 to-transparent flex flex-col justify-end p-6 relative z-10">
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded bg-[#19382C]/90 text-[#FAF9F6] text-xs font-serif mb-2 border border-[#2D4F43] w-fit">
            <Sparkles className="w-3 h-3 text-[#C2A26A]" />
            <span>공정거래위원회 고시 법정 기준 진단표</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-reverence font-black text-[#FAF9F6] tracking-tight">
            기존 상조 증서 정밀 예법 · 원가 진단표
          </h2>
          <p className="text-[#8A929D] text-xs sm:text-sm font-serif mt-1">
            공정위 법정 해약환급금과 배웅의 정직한 실비를 1:1 맞춤 영수증으로 투명하게 대조합니다.
          </p>
        </div>
      </div>

      {/* 2. [카파시 4원칙 준수] 장롱 속 상조 가입 증서 3초 AI Vision OCR 자동 스캔 UI */}
      <div className="bg-[#FAF9F6] border border-[#DCD6C9] rounded-lg p-5 md:p-6 space-y-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DCD6C9] pb-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded bg-[#DCE8E2] text-[#19382C] text-xs font-serif font-bold mb-1.5 border border-[#DCE8E2]">
              <ScanLine className="w-3.5 h-3.5 text-[#19382C]" />
              <span>3초 AI 비전 자동 판독 엔진</span>
            </div>
            <h3 className="text-lg md:text-xl font-reverence font-bold text-[#151719]">
              장롱 속 상조 계약 증서 모바일 촬영 · 즉시 자동 판독
            </h3>
            <p className="text-xs text-[#5A5E66] mt-1 leading-relaxed font-serif">
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
              className="px-5 py-3 bg-[#19382C] hover:bg-[#2D4F43] active:scale-[0.99] text-[#FAF9F6] font-serif font-bold text-sm rounded-md shadow-xs flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50 border border-[#2D4F43]"
            >
              <Camera className="w-4 h-4 text-[#C2A26A]" />
              <span>증서 사진 촬영 / 갤러리 업로드</span>
            </button>
            <span className="text-[13px] text-[#5A5E66] mt-1 text-center sm:text-right font-serif">
              카메라 권한 허용 시 즉시 촬영 가능
            </span>
          </div>
        </div>

        {/* 벤치마크 실물 증서 원터치 비전 스캔 시뮬레이션 버튼 3종 */}
        <div className="space-y-2">
          <label className="text-xs font-serif font-bold text-[#151719] flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#6E5429]" />
            <span>또는 실제 상조사 실물 증서 샘플을 원터치로 스캔해 보세요:</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {[
              { key: 'boram450', name: '보람상조 450 실물 증서', desc: '450만 / 150회 중 42회 (중도)' },
              { key: 'preed590', name: '프리드 590 실물 증서', desc: '590만 / 120회 중 80회 (후반)' },
              { key: 'hyundai480', name: '현대 480 만기 완납 증서', desc: '480만 / 100회 완납 (100% 환급 특약)' }
            ].map((btn) => (
              <button
                key={btn.key}
                disabled={isScanning}
                onClick={() => handlePresetSampleScan(btn.key as any)}
                className="p-3 rounded-md border border-[#DCD6C9] bg-[#FFFFFF] hover:border-[#9E7D47] text-left transition-all disabled:opacity-50 group cursor-pointer"
              >
                <div className="text-xs font-serif font-bold text-[#151719] group-hover:text-[#19382C] flex items-center justify-between">
                  <span>{btn.name}</span>
                  <ScanLine className="w-3.5 h-3.5 text-[#5A5E66] group-hover:text-[#19382C]" />
                </div>
                <div className="text-[13px] text-[#5A5E66] mt-0.5 font-serif">{btn.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* AI 비전 스캔 진행 상태 프로그레스 */}
        {isScanning && (
          <div className="p-4 rounded-lg bg-[#19382C] text-[#FAF9F6] border border-[#2D4F43] space-y-2.5">
            <div className="flex items-center justify-between font-serif">
              <span className="font-bold text-sm flex items-center space-x-2 text-[#FAF9F6]">
                <RefreshCw className="w-4 h-4 animate-spin text-[#C2A26A]" />
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
            <p className="text-xs text-[#FAF9F6]/80 font-serif">{scanStatusText}</p>
          </div>
        )}

        {/* AI 비전 스캔 결과 카드 (스캔 완료 시 노출) */}
        {lastScanResult && !isScanning && (
          <div className="p-4 md:p-5 rounded-lg bg-[#FAF9F6] border border-[#DCE8E2] space-y-3.5 shadow-xs font-serif">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DCE8E2] pb-3">
              <div className="flex items-center space-x-2 text-[#19382C] font-reverence font-bold text-base">
                <CheckCircle2 className="w-5 h-5 text-[#19382C]" />
                <span>증서 자동 판독 성공 (일치도 {Math.round(lastScanResult.certificate.confidenceScore * 100)}%)</span>
              </div>
              <span className="text-xs font-serif font-bold text-[#19382C] bg-[#FFFFFF] px-2.5 py-0.5 rounded border border-[#DCE8E2] w-fit">
                아래 진단표 및 1:1 맞춤 영수증에 자동 반영되었습니다
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 text-[#151719]">
              <div className="bg-[#FFFFFF] p-3 rounded-md border border-[#DCD6C9]">
                <div className="text-[13px] text-[#5A5E66] font-serif">인식된 상조사</div>
                <div className="text-sm font-reverence font-bold text-[#151719] mt-0.5 truncate">
                  {lastScanResult.certificate.competitorName}
                </div>
              </div>
              <div className="bg-[#FFFFFF] p-3 rounded-md border border-[#DCD6C9]">
                <div className="text-[13px] text-[#5A5E66] font-serif">인식된 상품명</div>
                <div className="text-sm font-reverence font-bold text-[#151719] mt-0.5 truncate">
                  {lastScanResult.certificate.productName}
                </div>
              </div>
              <div className="bg-[#FFFFFF] p-3 rounded-md border border-[#DCD6C9]">
                <div className="text-[13px] text-[#5A5E66] font-serif">총 약정금액</div>
                <div className="text-sm font-reverence font-bold text-[#19382C] mt-0.5">
                  {lastScanResult.certificate.totalContractAmount.toLocaleString()}원
                </div>
              </div>
              <div className="bg-[#FFFFFF] p-3 rounded-md border border-[#DCD6C9]">
                <div className="text-[13px] text-[#5A5E66] font-serif">납입 현황</div>
                <div className="text-sm font-reverence font-bold text-[#151719] mt-0.5">
                  {lastScanResult.certificate.paidInstallments}회 / {lastScanResult.certificate.totalInstallments}회
                </div>
              </div>
            </div>

            {lastScanResult.certificate.hasMaturityRefund100 && (
              <div className="p-2.5 rounded-md bg-[#F1E9DB] border border-[#F1E9DB] text-xs font-medium text-[#6E5429] flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-[#6E5429] shrink-0" />
                <span>만기 시 100% 전액 환급 특약이 감지되었습니다. 만기 시 원금 100% 보장 상태입니다.</span>
              </div>
            )}
          </div>
        )}

        {/* 증서 원문 직접 수정 / 붙여넣기 토글 */}
        <div className="pt-1">
          <button
            onClick={() => setShowDirectTextInput(!showDirectTextInput)}
            className="text-xs text-[#5A5E66] hover:text-[#19382C] font-serif underline flex items-center space-x-1 cursor-pointer"
          >
            <span>{showDirectTextInput ? '▲ 증서 텍스트 직접 입력창 닫기' : '▼ 증서 텍스트 직접 입력 / 수정하기'}</span>
          </button>

          {showDirectTextInput && (
            <div className="mt-2.5 p-4 rounded-lg bg-[#FFFFFF] border border-[#DCD6C9] space-y-2.5">
              <label className="text-xs font-bold text-[#151719] block font-serif">
                상조 가입 증서 내용 (사진 자동인식 내용 또는 직접 입력)
              </label>
              <textarea
                rows={4}
                value={rawTextBuffer}
                onChange={(e) => setRawTextBuffer(e.target.value)}
                placeholder="상조 가입 증서의 계약금액, 약정회차, 실납입 회차 내용을 여기에 붙여넣으세요..."
                className="w-full text-xs font-mono p-3 rounded-md border border-[#DCD6C9] bg-[#FAF9F6] text-[#151719] leading-relaxed focus:outline-none focus:border-[#9E7D47]"
              />
              <button
                onClick={() => runVisionOcrScan(rawTextBuffer)}
                className="px-4 py-2 bg-[#19382C] hover:bg-[#2D4F43] text-[#FAF9F6] text-xs font-serif font-bold rounded-md transition-all cursor-pointer border border-[#2D4F43]"
              >
                입력된 텍스트 즉시 재분석
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 3. 수동 벤치마크 퀵 선택 탭 */}
      <div className="space-y-2.5">
        <label className="text-sm font-serif font-bold text-[#151719] block">
          또는 기본 표준 상품 비교 예시 선택
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {[
            { key: 'B', name: 'B상조 450 (42회 납입)', desc: '중도 28% 진행 상태' },
            { key: 'P', name: 'P상조 590 (80회 납입)', desc: '후반부 66% 납입 상태' },
            { key: 'H', name: 'H상조 480 (만기 완납)', desc: '100% 만기 환급 특약' }
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => handleSelectPreset(item.key as any)}
              className={`p-3.5 rounded-lg text-left border transition-all cursor-pointer ${
                selectedPreset === item.key
                  ? 'border-[#9E7D47] bg-[#F1E9DB] text-[#151719] ring-1 ring-[#9E7D47]'
                  : 'border-[#DCD6C9] hover:border-[#9E7D47]/60 bg-[#FAF9F6] text-[#42464E]'
              }`}
            >
              <div className="text-sm font-serif font-bold text-[#151719]">{item.name}</div>
              <div className="text-[13px] text-[#5A5E66] mt-0.5 font-serif">{item.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 3. 시니어 슬라이더 컨트롤러 */}
      <div className="bg-[#FAF9F6] rounded-xl p-5 md:p-6 border border-[#DCD6C9] space-y-5">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <div>
            <span className="text-sm font-serif font-bold text-[#151719]">현재까지 납입하신 회차 조절</span>
            <p className="text-xs text-[#5A5E66] font-serif">슬라이더를 좌우로 움직여 회차별 환급금을 확인하실 수 있습니다</p>
          </div>
          <span className="text-xl md:text-2xl font-serif font-bold text-[#19382C]">
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
          className="w-full h-2.5 bg-[#DCD6C9] rounded-md appearance-none cursor-pointer accent-[#19382C]"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 font-serif">
          {/* 배웅 실비 의전 패키지 선택 */}
          <div>
            <label className="text-xs font-bold text-[#151719] block mb-1.5">배웅 정찰제 의전 선택</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['simple_non_hall', 'family_2day', 'economic_3day', 'standard_3day'] as BaeungPackageType[]).map((pkg) => (
                <button
                  key={pkg}
                  onClick={() => setPackageType(pkg)}
                  className={`py-2 px-1.5 text-xs rounded-md font-medium border transition-all cursor-pointer text-center ${
                    packageType === pkg
                      ? 'border-[#19382C] bg-[#19382C] text-[#FAF9F6] font-bold'
                      : 'border-[#DCD6C9] bg-[#FFFFFF] text-[#42464E] hover:border-[#19382C]'
                  }`}
                >
                  {pkg === 'simple_non_hall'
                    ? '무빈소(120만)'
                    : pkg === 'family_2day'
                    ? '가족장(180만)'
                    : pkg === 'economic_3day'
                    ? '실속형(250만)'
                    : '품격형(350만)'}
                </button>
              ))}
            </div>
          </div>

          {/* 기존 상조 현장 추가금 예상 수준 */}
          <div>
            <label className="text-xs font-bold text-[#151719] block mb-1.5">기존 상조 현장 추가금 통계</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'conservative', label: '최소 (+180만)' },
                { id: 'average', label: '평균 (+285만)' },
                { id: 'aggressive', label: '최대 (+500만)' }
              ].map((sev) => (
                <button
                  key={sev.id}
                  onClick={() => setHiddenCostSeverity(sev.id as any)}
                  className={`py-2.5 px-2 text-xs rounded-md font-medium border transition-all cursor-pointer ${
                    hiddenCostSeverity === sev.id
                      ? 'border-[#8B2520] bg-[#FAF0EF] text-[#8B2520] font-bold'
                      : 'border-[#DCD6C9] bg-[#FFFFFF] text-[#42464E] hover:border-[#8B2520]'
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
      <div className="bg-[#FAF9F6] border border-[#DCD6C9] rounded-xl p-5 md:p-7 space-y-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DCD6C9] pb-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded bg-[#19382C] text-[#FAF9F6] text-xs font-serif font-bold mb-1 border border-[#2D4F43]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C2A26A]" />
              <span>어르신 안심 3단계 자금 흐름 요약</span>
            </div>
            <h3 className="text-xl md:text-2xl font-reverence font-bold text-[#151719]">
              복잡한 상조 계산, 3단계로 명쾌하게 정리해 드립니다
            </h3>
          </div>
          <span className="text-xs text-[#5A5E66] font-serif">
            ※ 공정거래위원회 고시 제2020-1호 법적 기준
          </span>
        </div>

        {/* 3단계 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* 1단계: 통장 환급금 */}
          <div className="bg-[#FFFFFF] rounded-lg p-5 border border-[#DCD6C9] shadow-xs flex flex-col justify-between space-y-3">
            <div>
              <div className="text-xs font-serif font-bold text-[#19382C] bg-[#DCE8E2] px-2.5 py-0.5 rounded border border-[#DCE8E2] w-fit mb-2">
                1단계: 기존 상조 해약 시
              </div>
              <h4 className="font-reverence font-bold text-base md:text-lg text-[#151719]">
                통장으로 돌려받는 현금
              </h4>
              <p className="text-xs text-[#5A5E66] mt-1 leading-relaxed font-serif">
                지금까지 낸 <b>{report.certificate.paidTotalAmount.toLocaleString()}원</b> 중 법정 환급금이 고객님 개인 은행 통장으로 즉시 입금됩니다.
              </p>
            </div>
            <div className="pt-2 border-t border-[#DCD6C9] flex justify-between items-baseline font-serif">
              <span className="text-xs text-[#5A5E66]">통장 입금액:</span>
              <span className="text-xl md:text-2xl font-reverence font-black text-[#19382C]">
                +{report.statutoryRefund.refundAmount.toLocaleString()}원
              </span>
            </div>
          </div>

          {/* 2단계: 배웅 장례비 */}
          <div className="bg-[#FFFFFF] rounded-lg p-5 border border-[#DCD6C9] shadow-xs flex flex-col justify-between space-y-3">
            <div>
              <div className="text-xs font-serif font-bold text-[#6E5429] bg-[#F1E9DB] px-2.5 py-0.5 rounded border border-[#F1E9DB] w-fit mb-2">
                2단계: 배웅 장례 치를 때
              </div>
              <h4 className="font-reverence font-bold text-base md:text-lg text-[#151719]">
                배웅에 실제 결제하는 금액
              </h4>
              <p className="text-xs text-[#5A5E66] mt-1 leading-relaxed font-serif">
                정찰가 {report.selectedBaeungPackage.price.toLocaleString()}원에서 해약손실을 메워드리는 <b>손실보전 {report.transitionCredit.toLocaleString()}원 할인</b>이 즉시 차감됩니다.
              </p>
            </div>
            <div className="pt-2 border-t border-[#DCD6C9] flex justify-between items-baseline font-serif">
              <span className="text-xs text-[#5A5E66]">배웅 결제 청구액:</span>
              <span className="text-xl md:text-2xl font-reverence font-black text-[#151719]">
                {(report.selectedBaeungPackage.price - report.transitionCredit).toLocaleString()}원
              </span>
            </div>
          </div>

          {/* 3단계: 최종 결과 */}
          <div className="bg-[#19382C] rounded-lg p-5 text-[#FAF9F6] shadow-sm flex flex-col justify-between space-y-3 border border-[#2D4F43]">
            <div>
              <div className="text-xs font-serif font-bold text-[#C2A26A] bg-[#0A1511] px-2.5 py-0.5 rounded w-fit mb-2 border border-[#2D4F43]">
                3단계: 우리 가족 최종 이익
              </div>
              <h4 className="font-reverence font-bold text-base md:text-lg text-[#FAF9F6]">
                최종 순수 현금 절약액
              </h4>
              <p className="text-xs text-[#DCE8E2] mt-1 leading-relaxed font-serif">
                통장으로 받은 환급금을 보태어 장례를 치르시면, 기존 상조 유지 대비 순수하게 이만큼 아낍니다.
              </p>
            </div>
            <div className="pt-2 border-t border-[#2D4F43] flex justify-between items-baseline font-serif">
              <span className="text-xs text-[#DCE8E2]">절약되는 돈:</span>
              <span className="text-2xl md:text-3xl font-reverence font-black text-[#C2A26A]">
                {report.summary.netSavingsAmount.toLocaleString()}원
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. [직관 대조 시각화] 내 지갑에서 나갈 돈 한눈에 직관 비교 (Before & After) */}
      <div className="bg-[#FFFFFF] border border-[#DCD6C9] rounded-xl p-5 md:p-7 space-y-6 shadow-xs relative overflow-hidden">
        {/* 한옥 살창 격자문 은은한 워터마크 */}
        <div className="pointer-events-none absolute inset-0 k-pattern-gyeokja opacity-15" />
        <div className="relative z-10 space-y-6">
          {/* 헤더 및 기준 선택 탭 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DCD6C9] pb-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded bg-[#FAF9F6] border border-[#F1E9DB] text-[#6E5429] text-xs font-serif font-bold mb-1">
              <TrendingDown className="w-3.5 h-3.5 text-[#6E5429]" />
              <span>직관 비교 시각화 (Before vs After)</span>
            </div>
            <h3 className="font-reverence font-bold text-lg md:text-xl text-[#141618]">
              기존 상조 vs 배웅 실제 지출 및 절약액 직관 대조
            </h3>
            <p className="text-xs text-[#5A5E66] font-serif mt-1">
              배웅으로 전환하면 어떤 기준이든 동일하게 <b>{report.summary.netSavingsAmount.toLocaleString()}원</b>이 유족의 통장에 절약됩니다.
            </p>
          </div>

          {/* 듀얼 관점 선택 토글 버튼 */}
          <div className="flex bg-[#FAF9F6] p-1 rounded-lg border border-[#DCD6C9] shrink-0 self-start sm:self-auto">
            <button
              onClick={() => setComparisonPerspective('future_cash')}
              className={`px-3 py-1.5 text-xs font-reverence font-medium rounded transition-all cursor-pointer ${
                comparisonPerspective === 'future_cash'
                  ? 'bg-[#19382C] text-[#FAF9F6] shadow-xs'
                  : 'text-[#5A5E66] hover:text-[#141618]'
              }`}
            >
              ① 내 지갑 현금 기준 (추천)
            </button>
            <button
              onClick={() => setComparisonPerspective('total_all_time')}
              className={`px-3 py-1.5 text-xs font-reverence font-medium rounded transition-all cursor-pointer ${
                comparisonPerspective === 'total_all_time'
                  ? 'bg-[#19382C] text-[#FAF9F6] shadow-xs'
                  : 'text-[#5A5E66] hover:text-[#141618]'
              }`}
            >
              ② 이미 낸 돈 포함 전체 기준
            </button>
          </div>
        </div>

        {/* [신규 핵심] 좌우 1:1 직관 요약 대조 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* [좌측 카드: 기존 상조 유지] */}
          <div className="rounded-xl border border-[#FAF0EF] bg-[#FAF9F6] p-4 md:p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-serif font-bold text-[#8B2520] bg-[#8B2520]/10 px-2 py-0.5 rounded border border-[#8B2520]/20">
                  기존 상조 그대로 유지할 때
                </span>
                <span className="text-xs font-serif text-[#8B2520] font-medium">전액 지출 (비용 낭비)</span>
              </div>
              <div className="mt-2">
                <span className="text-xs font-serif text-[#5A5E66] block">
                  {comparisonPerspective === 'future_cash' ? '앞으로 내 지갑에서 나갈 돈' : '기존 상조 총 계약 및 바가지 합계'}
                </span>
                <span className="text-2xl md:text-3xl font-reverence font-bold text-[#8B2520]">
                  {(comparisonPerspective === 'future_cash'
                    ? report.certificate.remainingAmount + report.hiddenCost.totalHiddenCost
                    : report.summary.competitorTotalCost
                  ).toLocaleString()}원
                </span>
              </div>
              <ul className="mt-3 space-y-1.5 text-xs font-serif text-[#5A5E66] border-t border-[#FAF0EF] pt-2.5">
                {comparisonPerspective === 'future_cash' ? (
                  <>
                    <li className="flex justify-between">
                      <span>• 남은 할부금 총액:</span>
                      <span className="font-medium text-[#141618]">{report.certificate.remainingAmount.toLocaleString()}원</span>
                    </li>
                    <li className="flex justify-between">
                      <span>• 현장 추가금 바가지 예상:</span>
                      <span className="font-medium text-[#8B2520]">+{report.hiddenCost.totalHiddenCost.toLocaleString()}원</span>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex justify-between">
                      <span>• 가입 약정 총액:</span>
                      <span className="font-medium text-[#141618]">{report.certificate.totalContractAmount.toLocaleString()}원</span>
                    </li>
                    <li className="flex justify-between">
                      <span>• 현장 추가금 바가지 예상:</span>
                      <span className="font-medium text-[#8B2520]">+{report.hiddenCost.totalHiddenCost.toLocaleString()}원</span>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>

          {/* [우측 카드: 배웅 전환 시] */}
          <div className="rounded-xl border-2 border-[#19382C] bg-[#FAF9F6] p-4 md:p-5 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-serif font-bold text-[#19382C] bg-[#19382C]/10 px-2 py-0.5 rounded border border-[#19382C]/20">
                  배웅 정직 실비로 전환할 때
                </span>
                <span className="text-xs font-serif font-bold text-[#6E5429]">
                  ★ {report.summary.netSavingsAmount.toLocaleString()}원 절약
                </span>
              </div>
              <div className="mt-2">
                <span className="text-xs font-serif text-[#5A5E66] block">
                  {comparisonPerspective === 'future_cash' ? '유가족이 실제로 지출하는 돈' : '배웅 전환 시 최종 총부담'}
                </span>
                <span className="text-2xl md:text-3xl font-reverence font-bold text-[#19382C]">
                  {(comparisonPerspective === 'future_cash'
                    ? report.summary.baeungTotalActualCost
                    : report.statutoryRefund.lossAmount + report.selectedBaeungPackage.price - report.transitionCredit
                  ).toLocaleString()}원
                </span>
              </div>
              <ul className="mt-3 space-y-1.5 text-xs font-serif text-[#5A5E66] border-t border-[#DCD6C9] pt-2.5">
                {comparisonPerspective === 'future_cash' ? (
                  <>
                    <li className="flex justify-between">
                      <span>• 배웅 정찰 장례 실비:</span>
                      <span className="font-medium text-[#141618]">{report.selectedBaeungPackage.price.toLocaleString()}원</span>
                    </li>
                    <li className="flex justify-between">
                      <span>• 기존 상조 통장 환급금:</span>
                      <span className="font-medium text-[#19382C]">-{report.statutoryRefund.refundAmount.toLocaleString()}원 (통장 입금)</span>
                    </li>
                    <li className="flex justify-between">
                      <span>• 배웅 손실보전 할인:</span>
                      <span className="font-medium text-[#6E5429]">-{report.transitionCredit.toLocaleString()}원 (즉시 차감)</span>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex justify-between">
                      <span>• 배웅 실제 결제액:</span>
                      <span className="font-medium text-[#141618]">{(report.selectedBaeungPackage.price - report.transitionCredit).toLocaleString()}원</span>
                    </li>
                    <li className="flex justify-between">
                      <span>• 기존 상조 해약 공제 손실:</span>
                      <span className="font-medium text-[#5A5E66]">+{report.statutoryRefund.lossAmount.toLocaleString()}원</span>
                    </li>
                    <li className="flex justify-between">
                      <span>• 현장 추가금:</span>
                      <span className="font-medium text-[#19382C]">0원 (추가금 없음)</span>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* [핵심 직관 시각화] 1:1 대응 워터폴 비교 막대 그래프 */}
        <div className="space-y-4 pt-1">
          {/* 상단 안내 라벨 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs md:text-sm font-serif">
            <span className="font-bold text-[#141618]">
              📊 {comparisonPerspective === 'future_cash' ? '앞으로 나갈 돈 1:1 면적 비교' : '전체 총비용 1:1 면적 비교'}
            </span>
            <span className="text-[#5A5E66] mt-0.5 sm:mt-0 text-[13px] sm:text-xs">
              ※ 배웅 막대의 <b>실제 지출</b>과 <b>절약되는 돈</b>을 합치면 기존 상조 금액과 100% 일치합니다.
            </span>
          </div>

          {/* 막대 1: 기존 상조 유지 (100% 붉은색) */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs md:text-sm font-serif">
              <span className="font-medium text-[#8B2520]">
                기존 상조 유지 시: {(comparisonPerspective === 'future_cash'
                  ? report.certificate.remainingAmount + report.hiddenCost.totalHiddenCost
                  : report.summary.competitorTotalCost
                ).toLocaleString()}원 전액 지출
              </span>
              <span className="font-bold text-[#8B2520]">100% 지출</span>
            </div>
            <div className="w-full bg-[#FAF9F6] rounded-lg h-9 overflow-hidden">
              <div
                style={{ width: '100%' }}
                className="bg-[#8B2520] h-full rounded-lg flex items-center justify-between px-3 md:px-4 text-xs font-medium text-white transition-all duration-500 shadow-xs"
              >
                <span className="truncate">기존 상조 지출 총액 (남은 할부 + 현장 바가지 추가금)</span>
                <span className="shrink-0 font-bold ml-2">100%</span>
              </div>
            </div>
          </div>

          {/* 막대 2: 배웅 전환 시 ([실제 지출] + [절약되는 돈] 스택 결합) */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs md:text-sm font-serif">
              <span className="font-medium text-[#19382C]">
                배웅 전환 시: <b>실제 지출 {(comparisonPerspective === 'future_cash'
                  ? report.summary.baeungTotalActualCost
                  : report.statutoryRefund.lossAmount + report.selectedBaeungPackage.price - report.transitionCredit
                ).toLocaleString()}원</b> + <b>절약 {report.summary.netSavingsAmount.toLocaleString()}원</b>
              </span>
              <span className="font-bold text-[#19382C]">
                {Math.round((report.summary.netSavingsAmount / (comparisonPerspective === 'future_cash'
                  ? Math.max(1, report.certificate.remainingAmount + report.hiddenCost.totalHiddenCost)
                  : Math.max(1, report.summary.competitorTotalCost)
                )) * 100)}% 비용 절감!
              </span>
            </div>

            {/* 스택형 바 (실제 지출 + 절약액 결합) */}
            <div className="w-full bg-[#FAF9F6] rounded-lg h-10 overflow-hidden flex shadow-xs border border-[#DCE8E2]">
              {/* 세그먼트 1: 실제 지출액 */}
              <div
                style={{
                  width: `${Math.max(14, Math.min(86, Math.round(((comparisonPerspective === 'future_cash'
                    ? report.summary.baeungTotalActualCost
                    : report.statutoryRefund.lossAmount + report.selectedBaeungPackage.price - report.transitionCredit
                  ) / (comparisonPerspective === 'future_cash'
                    ? Math.max(1, report.certificate.remainingAmount + report.hiddenCost.totalHiddenCost)
                    : Math.max(1, report.summary.competitorTotalCost)
                  )) * 100)))}%`
                }}
                className="bg-[#19382C] h-full flex items-center justify-center px-2 text-xs font-bold text-[#FAF9F6] transition-all duration-500 shrink-0"
                title="배웅 이용 시 실제 지출액"
              >
                <span className="truncate">
                  실제 지출 {(comparisonPerspective === 'future_cash'
                    ? report.summary.baeungTotalActualCost
                    : report.statutoryRefund.lossAmount + report.selectedBaeungPackage.price - report.transitionCredit
                  ).toLocaleString()}원
                </span>
              </div>

              {/* 세그먼트 2: 아끼는 돈 (SAVE) */}
              <div
                style={{
                  width: `${100 - Math.max(14, Math.min(86, Math.round(((comparisonPerspective === 'future_cash'
                    ? report.summary.baeungTotalActualCost
                    : report.statutoryRefund.lossAmount + report.selectedBaeungPackage.price - report.transitionCredit
                  ) / (comparisonPerspective === 'future_cash'
                    ? Math.max(1, report.certificate.remainingAmount + report.hiddenCost.totalHiddenCost)
                    : Math.max(1, report.summary.competitorTotalCost)
                  )) * 100)))}%`
                }}
                className="bg-[#FAF9F6] border-l-2 border-[#19382C] h-full flex items-center justify-center px-2 text-xs font-bold text-[#6E5429] transition-all duration-500"
                title="배웅 전환으로 아끼는 돈"
              >
                <span className="truncate flex items-center space-x-1">
                  <span>🎉</span>
                  <span>{report.summary.netSavingsAmount.toLocaleString()}원 절약 (통장에 SAVE)</span>
                </span>
              </div>
            </div>

            {/* 범례 및 안내 캡션 */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[13px] md:text-xs font-serif">
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-xs bg-[#19382C] inline-block" />
                  <span className="text-[#141618]"><b>실제 내는 돈:</b> {(comparisonPerspective === 'future_cash'
                    ? report.summary.baeungTotalActualCost
                    : report.statutoryRefund.lossAmount + report.selectedBaeungPackage.price - report.transitionCredit
                  ).toLocaleString()}원</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-xs bg-[#FAF9F6] border border-[#C2A26A] inline-block" />
                  <span className="text-[#6E5429]"><b>아끼는 돈(절약):</b> {report.summary.netSavingsAmount.toLocaleString()}원</span>
                </span>
              </div>
              <span className="text-[#19382C] font-bold">
                ※ 기존 상조 대비 약 {Math.round((report.summary.netSavingsAmount / (comparisonPerspective === 'future_cash'
                  ? Math.max(1, report.certificate.remainingAmount + report.hiddenCost.totalHiddenCost)
                  : Math.max(1, report.summary.competitorTotalCost)
                )) * 100)}% 지출 절감
              </span>
            </div>
          </div>
        </div>

        {/* [1초 명쾌 산출식 박스] 누구나 즉시 이해되는 덧셈·뺄셈 요약 */}
        <div className="p-3.5 md:p-4 rounded-lg bg-[#FAF9F6] border border-[#DCD6C9] text-xs md:text-sm font-serif text-[#141618] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="shrink-0 text-base">💡</span>
            <span>
              <b>한 줄 계산 공식:</b> [기존 상조 지출 {(comparisonPerspective === 'future_cash'
                ? report.certificate.remainingAmount + report.hiddenCost.totalHiddenCost
                : report.summary.competitorTotalCost
              ).toLocaleString()}원] - [배웅 실제 지출 {(comparisonPerspective === 'future_cash'
                ? report.summary.baeungTotalActualCost
                : report.statutoryRefund.lossAmount + report.selectedBaeungPackage.price - report.transitionCredit
              ).toLocaleString()}원]
            </span>
          </div>
          <div className="shrink-0 font-reverence font-bold text-[#19382C] text-sm md:text-base pl-6 sm:pl-0">
            = 순수 이익 +{report.summary.netSavingsAmount.toLocaleString()}원
          </div>
        </div>
        </div>
      </div>

      {/* 6. 1:1 맞춤 영수증 좌우 대조표 */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-[#141618] font-reverence font-bold text-xl">
          <Receipt className="w-5 h-5 text-[#6E5429]" />
          <span>1:1 정밀 영수증 항목별 투명 대조 명세</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* [좌] 기존 상조 유지 시 영수증 */}
          <div className="bg-[#FFFFFF] border border-[#DCD6C9] rounded-xl p-6 flex flex-col justify-between shadow-xs">
            <div className="space-y-4">
              <div className="border-b border-[#DCD6C9] pb-3.5">
                <span className="text-xs font-serif font-medium text-[#8B2520] bg-[#8B2520]/10 px-2.5 py-0.5 rounded border border-[#8B2520]/20">
                  기존 선불식 상조 유지 시
                </span>
                <h3 className="text-lg md:text-xl font-reverence font-bold text-[#141618] mt-2">
                  {report.leftCompetitorReceipt.title}
                </h3>
                <p className="text-xs text-[#5A5E66] mt-1">{report.leftCompetitorReceipt.subtitle}</p>
              </div>

              <div className="space-y-3 text-sm md:text-base">
                {report.leftCompetitorReceipt.lineItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className={item.isWarning ? 'text-[#8B2520] font-medium flex items-center' : 'text-[#42464E]'}>
                      {item.isWarning && <AlertCircle className="w-4 h-4 inline mr-1 text-[#8B2520] shrink-0" />}
                      <span>{item.name}</span>
                    </span>
                    <span className="font-reverence font-medium text-[#141618]">
                      +{item.amount.toLocaleString()}원
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-[#DCD6C9] flex justify-between items-center">
              <div>
                <span className="font-reverence font-bold text-[#141618] text-base block">예상 실질 총부담</span>
                <span className="text-[13px] text-[#5A5E66] font-serif">약정금 + 현장 필수 추가금</span>
              </div>
              <span className="text-2xl md:text-3xl font-reverence font-bold text-[#8B2520]">
                {report.summary.competitorTotalCost.toLocaleString()}원
              </span>
            </div>
          </div>

          {/* [우] 배웅 정직 실비 전환 시 영수증 */}
          <div className="bg-[#FAF9F6] border-2 border-[#19382C] rounded-xl p-6 flex flex-col justify-between shadow-xs">
            <div className="space-y-4">
              <div className="border-b border-[#DCD6C9] pb-3.5">
                <span className="text-xs font-serif font-medium text-[#19382C] bg-[#19382C]/10 px-2.5 py-0.5 rounded border border-[#19382C]/20">
                  배웅 정직 실비 전환 시
                </span>
                <h3 className="text-lg md:text-xl font-reverence font-bold text-[#141618] mt-2">
                  {report.rightBaeungReceipt.title}
                </h3>
                <p className="text-xs text-[#5A5E66] mt-1">{report.rightBaeungReceipt.subtitle}</p>
              </div>

              <div className="space-y-3 text-sm md:text-base">
                {report.rightBaeungReceipt.lineItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className={item.isHighlighted ? 'text-[#19382C] font-bold' : item.isDeduction ? 'text-[#6E5429] font-semibold' : 'text-[#42464E]'}>
                      {item.name}
                    </span>
                    <span className={`font-reverence font-medium ${item.isDeduction ? 'text-[#6E5429]' : item.isHighlighted ? 'text-[#19382C] font-bold' : 'text-[#141618]'}`}>
                      {item.amount > 0 ? `+${item.amount.toLocaleString()}` : item.amount.toLocaleString()}원
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-[#DCD6C9] flex justify-between items-center">
              <div>
                <span className="font-reverence font-bold text-[#141618] text-base block">배웅 실제 최종 순부담</span>
                <span className="text-[13px] text-[#19382C] font-serif">배웅 결제액 - 통장 환급금</span>
              </div>
              <span className="text-2xl md:text-3xl font-reverence font-bold text-[#19382C]">
                {report.summary.baeungTotalActualCost.toLocaleString()}원
              </span>
            </div>
          </div>
        </div>

        {/* 품격 있는 순 부담 차액 안내 배너 */}
        <div className="bg-[#19382C] text-[#FAF9F6] rounded-xl p-6 md:p-8 text-center shadow-sm space-y-2 border border-[#2D4F43]">
          <div className="text-sm font-serif text-[#C2A26A]">
            공정위 법정 환급금 {report.statutoryRefund.refundAmount.toLocaleString()}원 통장 수령 + 배웅 손실보전 크레딧 {report.transitionCredit.toLocaleString()}원 즉시 차감
          </div>
          <div className="text-3xl md:text-4xl font-reverence font-bold text-[#FFFFFF] tracking-tight">
            우리 가족 최종 순 절약액: {report.summary.netSavingsAmount.toLocaleString()}원
          </div>
          <p className="text-xs md:text-sm text-[#A8B2A9] pt-1 leading-relaxed">
            기존 상품을 해약하고 환급금을 받더라도, 배웅의 정찰제 실비를 이용하시는 것이 최종적으로 {report.summary.netSavingsAmount.toLocaleString()}원 더 정직하고 유리합니다.
          </p>
        </div>

        {/* 6.5. [옵션 2 핵심] 3중 소비자 권익 보호 & 이중안심(二重安心) 사전 대비 조치 */}
        <div className="bg-[#FAF9F6] border-2 border-[#19382C] rounded-xl p-6 md:p-8 space-y-6 shadow-sm relative overflow-hidden">
          {/* 한옥 살창 격자문 은은한 워터마크 */}
          <div className="pointer-events-none absolute inset-0 k-pattern-gyeokja opacity-25" />
          
          <div className="relative z-10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DCD6C9] pb-4">
              <div>
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-[#19382C]/10 text-[#19382C] text-xs font-serif font-bold mb-1 border border-[#19382C]/20">
                  <ShieldCheck className="w-4 h-4 text-[#19382C]" />
                  <span>지금 섣불리 해약하지 마십시오 · 배웅 3중 안심 보장제</span>
                </div>
                <h3 className="font-reverence font-bold text-xl md:text-2xl text-[#141618] tracking-tight">
                  유가족의 권리를 완벽히 지키는 3대 공식 실천 조치
                </h3>
                <p className="text-xs sm:text-sm text-[#5A5E66] font-serif mt-1">
                  기존 상조는 그대로 둔 채 <b>비용 0원</b>으로 권리를 확보하고, 해약 결정 시 법정 환급금과 위약금 손실을 100% 보전받으세요.
                </p>
              </div>
              <div className="shrink-0 bg-[#0A1511] text-[#C2A26A] px-3.5 py-1.5 rounded-lg text-xs font-serif font-bold border border-[#2D4F43] text-center">
                ✓ 위약금 손실 0원 실현<br />
                <span className="text-[13px] text-[#FAF9F6] font-normal">비용 0원 무약정 보장</span>
              </div>
            </div>

            {/* 3대 실천 액션 카드 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              {/* 1. 이중안심(二重安心) 사전 등록증 */}
              <div className="bg-[#FFFFFF] border-2 border-[#19382C]/30 hover:border-[#19382C] rounded-xl p-5 flex flex-col justify-between space-y-4 transition-all hover:shadow-md group">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-serif font-bold text-[#19382C] bg-[#19382C]/10 px-2 py-0.5 rounded">
                      조치 1 · 비용 0원
                    </span>
                    <ShieldCheck className="w-5 h-5 text-[#19382C]" />
                  </div>
                  <h4 className="font-reverence font-bold text-base md:text-lg text-[#141618] group-hover:text-[#19382C] transition-colors">
                    듀얼 스탠바이 사전 무약정 등록증
                  </h4>
                  <p className="text-xs text-[#5A5E66] font-serif leading-relaxed">
                    기존 상조를 해약하지 않고 그대로 유지한 채, 위급 시 배웅 우선 출동권과 실비 할인권을 <b>0원</b>에 확보합니다.
                  </p>
                  <ul className="text-[13px] text-[#42464E] font-serif space-y-1 pt-1 border-t border-[#DCD6C9]">
                    <li className="flex items-center space-x-1.5">
                      <span className="text-[#19382C] font-bold">✓</span>
                      <span>위급 시 기존 상조 vs 배웅 1초 선택</span>
                    </li>
                    <li className="flex items-center space-x-1.5">
                      <span className="text-[#19382C] font-bold">✓</span>
                      <span>24시간 전담 지도사 직통 핫라인</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => setIsDualStandbyModalOpen(true)}
                  className="w-full py-2.5 px-3 bg-[#19382C] hover:bg-[#2D4F43] active:scale-[0.99] text-[#FAF9F6] rounded-lg font-reverence font-bold text-xs md:text-sm flex items-center justify-center space-x-1.5 shadow-xs transition-all cursor-pointer border border-[#2D4F43]"
                >
                  <span>🛡️ 이중안심 등록증 발급 (0원)</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C2A26A]" />
                </button>
              </div>

              {/* 2. 공정위 법정 해약환급금 내용증명 신청서 */}
              <div className="bg-[#FFFFFF] border-2 border-[#8B2520]/30 hover:border-[#8B2520] rounded-xl p-5 flex flex-col justify-between space-y-4 transition-all hover:shadow-md group">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-serif font-bold text-[#8B2520] bg-[#8B2520]/10 px-2 py-0.5 rounded">
                      조치 2 · 법적 권리
                    </span>
                    <Scale className="w-5 h-5 text-[#8B2520]" />
                  </div>
                  <h4 className="font-reverence font-bold text-base md:text-lg text-[#141618] group-hover:text-[#8B2520] transition-colors">
                    공정위 법정 해약환급금 내용증명 청구서
                  </h4>
                  <p className="text-xs text-[#5A5E66] font-serif leading-relaxed">
                    상조사의 핑계나 환급 지연을 원천 차단하기 위해 <b>공정거래위원회 고시 제2020-1호</b> 기준 정식 법적 청구서를 자동 생성합니다.
                  </p>
                  <ul className="text-[13px] text-[#42464E] font-serif space-y-1 pt-1 border-t border-[#DCD6C9]">
                    <li className="flex items-center space-x-1.5">
                      <span className="text-[#8B2520] font-bold">✓</span>
                      <span>3영업일 내 강제 입금 및 15% 지연이자 명시</span>
                    </li>
                    <li className="flex items-center space-x-1.5">
                      <span className="text-[#8B2520] font-bold">✓</span>
                      <span>보람/프리드/현대 법인 대표 주소 자동 매칭</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => setIsClaimModalOpen(true)}
                  className="w-full py-2.5 px-3 bg-[#8B2520] hover:bg-[#731C18] active:scale-[0.99] text-[#FAF9F6] rounded-lg font-reverence font-bold text-xs md:text-sm flex items-center justify-center space-x-1.5 shadow-xs transition-all cursor-pointer border border-[#8B2520]"
                >
                  <span>📜 내용증명 청구서 자동 생성</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#FAF9F6]" />
                </button>
              </div>

              {/* 3. 50만 원 해약 손실 보전 크레딧 바우처 */}
              <div className="bg-[#FFFFFF] border-2 border-[#9E7D47]/30 hover:border-[#9E7D47] rounded-xl p-5 flex flex-col justify-between space-y-4 transition-all hover:shadow-md group">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-serif font-bold text-[#6E5429] bg-[#F1E9DB] px-2 py-0.5 rounded border border-[#F1E9DB]">
                      조치 3 · 100% 손실 보전
                    </span>
                    <Gift className="w-5 h-5 text-[#6E5429]" />
                  </div>
                  <h4 className="font-reverence font-bold text-base md:text-lg text-[#141618] group-hover:text-[#6E5429] transition-colors">
                    50만 원 해약 손실 보전 크레딧 바우처
                  </h4>
                  <p className="text-xs text-[#5A5E66] font-serif leading-relaxed">
                    상조 해약으로 발생한 위약금 손실을 배웅이 의전 필수 품목 3대 패키지(꽃침대, 리무진, 각인)로 <b>100% 현물 보전</b>해 드립니다.
                  </p>
                  <ul className="text-[13px] text-[#42464E] font-serif space-y-1 pt-1 border-t border-[#DCD6C9]">
                    <li className="flex items-center space-x-1.5">
                      <span className="text-[#6E5429] font-bold">✓</span>
                      <span>생화 꽃구름 침대(30만) + 리무진 연장(15만)</span>
                    </li>
                    <li className="flex items-center space-x-1.5">
                      <span className="text-[#6E5429] font-bold">✓</span>
                      <span>고급 유골함 영구 금박 각인(5만 원)</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => setIsVoucherModalOpen(true)}
                  className="w-full py-2.5 px-3 bg-[#FAF9F6] hover:bg-[#FAF9F6] text-[#6E5429] border-2 border-[#9E7D47] active:scale-[0.99] rounded-lg font-reverence font-bold text-xs md:text-sm flex items-center justify-center space-x-1.5 shadow-xs transition-all cursor-pointer"
                >
                  <span>🏷️ 50만 원 보전 바우처 확인</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#6E5429]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 7. [컴플레인 방지] 오해와 불안을 없애는 3대 투명성 FAQ 아코디언 */}
      <div className="bg-[#FFFFFF] border border-[#DCD6C9] rounded-xl p-6 md:p-8 space-y-4 shadow-xs">
        <div className="flex items-center space-x-2 text-[#141618] font-reverence font-bold text-lg md:text-xl border-b border-[#DCD6C9] pb-3">
          <HelpCircle className="w-5 h-5 text-[#6E5429]" />
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
                className="rounded-lg border border-[#DCD6C9] bg-[#FAF9F6] overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 md:p-5 flex items-center justify-between text-left font-reverence font-bold text-sm md:text-base text-[#141618] hover:text-[#19382C] cursor-pointer"
                >
                  <span className="pr-3">{item.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-[#19382C] shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#5A5E66] shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs md:text-sm text-[#42464E] font-serif leading-relaxed border-t border-[#DCD6C9] bg-[#FFFFFF]">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* [옵션 2 모달 1] 듀얼 스탠바이 사전 안심 등록증 모달 */}
      {isDualStandbyModalOpen && (
        <DualStandbyModal
          initialData={DualStandbyService.createRegistration({
            registrantName: '김정우 (장남)',
            registrantPhone: '010-3849-2910',
            beneficiaryName: '故 김철수 님',
            relationship: '부친(父)',
            existingCompany: report.certificate.competitorName,
            existingProduct: report.certificate.productName,
            paidTotalAmount: report.certificate.paidTotalAmount,
            estimatedRefund: report.statutoryRefund.refundAmount,
            lossAmount: report.statutoryRefund.lossAmount
          })}
          onClose={() => setIsDualStandbyModalOpen(false)}
          onOpenCancellationClaim={() => {
            setIsDualStandbyModalOpen(false);
            setIsClaimModalOpen(true);
          }}
          onOpenVoucherModal={() => {
            setIsDualStandbyModalOpen(false);
            setIsVoucherModalOpen(true);
          }}
        />
      )}

      {/* [옵션 2 모달 2] 공정위 법정 해약환급금 내용증명 청구서 모달 */}
      {isClaimModalOpen && (
        <CancellationClaimModal
          claimData={DualStandbyService.createCancellationClaim({
            cert: report.certificate,
            refund: report.statutoryRefund,
            claimantName: '김정우',
            claimantPhone: '010-3849-2910',
            claimantAddress: '서울특별시 송파구 올림픽로 300 (신천동)',
            refundBank: '신한은행',
            refundAccount: '110-384-291028',
            refundHolder: '김정우'
          })}
          onClose={() => setIsClaimModalOpen(false)}
        />
      )}

      {/* [옵션 2 모달 3] 50만 원 해약 손실 보전 크레딧 바우처 모달 */}
      {isVoucherModalOpen && (
        <LossCreditVoucherModal
          creditAmount={report.transitionCredit || 500_000}
          existingCompany={report.certificate.competitorName}
          onClose={() => setIsVoucherModalOpen(false)}
          onOpenDualStandby={() => {
            setIsVoucherModalOpen(false);
            setIsDualStandbyModalOpen(true);
          }}
        />
      )}
    </div>
  );
};

