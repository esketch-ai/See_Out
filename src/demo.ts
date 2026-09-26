import {
  QuoteDiagnosticsEngine,
  BENCHMARK_CERT_B_PREMIUM450,
  BENCHMARK_CERT_P_EVERGREEN590,
  BENCHMARK_CERT_H_SAFE480_MATURE,
  CertificateExtractionSchema
} from './quote-diagnostics/index.js';

function runDemo() {
  console.log('\n==========================================================================');
  console.log('  🏛️  배웅(Bae-ung) 상조 견적 진단 및 영수증 대조 시뮬레이션 데모');
  console.log('==========================================================================\n');

  // Case 1: B상조 프리미엄 450 (42회 납입, 28% 진행 고객)
  console.log('▶ [Case 1] B상조 중도 납입 고객 (42/150회차, 실속 3일장 전환)');
  const report1 = QuoteDiagnosticsEngine.diagnose({
    certificate: BENCHMARK_CERT_B_PREMIUM450,
    clientName: '이수민 고객님',
    packageType: 'economic_3day',
    hiddenCostSeverity: 'average'
  });
  console.log(QuoteDiagnosticsEngine.formatReportToCli(report1));

  // Case 2: P상조 늘푸른 590 (80/120회차 납입, 표준 3일장 전환)
  console.log('\n▶ [Case 2] P상조 고액 상품 후반부 납입 고객 (80/120회차, 표준 3일장 전환)');
  const report2 = QuoteDiagnosticsEngine.diagnose({
    certificate: BENCHMARK_CERT_P_EVERGREEN590,
    clientName: '박정호 고객님',
    packageType: 'standard_3day',
    hiddenCostSeverity: 'average'
  });
  console.log(QuoteDiagnosticsEngine.formatReportToCli(report2));

  // Case 3: H상조 안심 480 (100/100회 만기 완납 고객)
  console.log('\n▶ [Case 3] H상조 만기 100% 환급 특약 가입 고객 (100/100회 만기, 실속 3일장 전환)');
  const report3 = QuoteDiagnosticsEngine.diagnose({
    certificate: BENCHMARK_CERT_H_SAFE480_MATURE,
    clientName: '최영희 고객님',
    packageType: 'economic_3day',
    hiddenCostSeverity: 'average'
  });
  console.log(QuoteDiagnosticsEngine.formatReportToCli(report3));
}

runDemo();
