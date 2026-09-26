import { CertificateExtractionSchema } from './types.js';

/**
 * 주요 대형 상조사 실제 상품 기반 벤치마크 테스트 데이터셋
 */

/**
 * 1. B상조 프리미엄 450 (중도 납입 28% 진행 고객)
 */
export const BENCHMARK_CERT_B_PREMIUM450: CertificateExtractionSchema = {
  certificateId: 'CERT-2023-B-08912',
  recognizedAt: new Date().toISOString(),
  competitorName: 'B상조',
  productName: '프리미엄 450',
  contractDate: '2023-04-15',
  totalContractAmount: 4_500_000,
  monthlyPayment: 30_000,
  totalInstallments: 150,
  paidInstallments: 42,
  paidTotalAmount: 1_260_000,
  remainingAmount: 3_240_000,
  hasMaturityRefund100: false,
  confidenceScore: 0.98
};

/**
 * 2. P상조 늘푸른 590 (후반부 66% 납입 진행 고객)
 */
export const BENCHMARK_CERT_P_EVERGREEN590: CertificateExtractionSchema = {
  certificateId: 'CERT-2021-P-11409',
  recognizedAt: new Date().toISOString(),
  competitorName: 'P상조',
  productName: '늘푸른 590',
  contractDate: '2021-08-10',
  totalContractAmount: 5_900_000,
  monthlyPayment: 49_000,
  totalInstallments: 120,
  paidInstallments: 80,
  paidTotalAmount: 3_920_000,
  remainingAmount: 1_980_000,
  hasMaturityRefund100: false,
  confidenceScore: 0.99
};

/**
 * 3. H상조 안심 480 (100회 만기 완납 결합상품 고객)
 */
export const BENCHMARK_CERT_H_SAFE480_MATURE: CertificateExtractionSchema = {
  certificateId: 'CERT-2016-H-99321',
  recognizedAt: new Date().toISOString(),
  competitorName: 'H상조',
  productName: '안심 480 만기환급형',
  contractDate: '2016-01-20',
  totalContractAmount: 4_800_000,
  monthlyPayment: 48_000,
  totalInstallments: 100,
  paidInstallments: 100,
  paidTotalAmount: 4_800_000,
  remainingAmount: 0,
  hasMaturityRefund100: true,
  confidenceScore: 0.97
};
