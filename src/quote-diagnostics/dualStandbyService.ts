import {
  CertificateExtractionSchema,
  RefundCalculationResult,
  DualStandbyRegistration,
  CancellationClaimData
} from './types.js';
import { EmergencyDispatchEngine } from '../emergency/dispatchEngine.js';
import { formatKoreanDate } from '../utils/dateUtils.js';

/**
 * 3대 주요 상조회사 본사 법인 정보 데이터베이스
 */
export const COMPETITOR_CORPORATE_INFO: Record<string, { ceo: string; address: string }> = {
  '보람상조': {
    ceo: '오준오',
    address: '서울특별시 마포구 마포대로 130 보람빌딩 본관'
  },
  'B상조': {
    ceo: '오준오',
    address: '서울특별시 마포구 마포대로 130 보람빌딩 본관'
  },
  '프리드라이프': {
    ceo: '김만기',
    address: '서울특별시 중구 통일로 92 에이스타워 14층'
  },
  'P상조': {
    ceo: '김만기',
    address: '서울특별시 중구 통일로 92 에이스타워 14층'
  },
  '현대라이프': {
    ceo: '정승환',
    address: '서울특별시 강남구 테헤란로 418 다봉타워 8층'
  },
  'H상조': {
    ceo: '정승환',
    address: '서울특별시 강남구 테헤란로 418 다봉타워 8층'
  }
};

export class DualStandbyService {
  /**
   * 듀얼 스탠바이 사전 무약정 등록증 생성
   */
  public static createRegistration(params: {
    registrantName?: string;
    registrantPhone?: string;
    beneficiaryName?: string;
    relationship?: string;
    existingCompany?: string;
    existingProduct?: string;
    paidTotalAmount?: number;
    estimatedRefund?: number;
    lossAmount?: number;
    region?: string;
    address?: string;
    assignedDirectorName?: string;
    assignedDirectorPhone?: string;
  }): DualStandbyRegistration {
    const lossAmount = params.lossAmount || 0;
    // 해약 손실액의 최대 40%를 배웅 의전 전환 크레딧으로 보전 (최대 50만 원 한도)
    const rawCredit = Math.floor(lossAmount * 0.40);
    const lossProtectionCredit = Math.min(500_000, Math.max(200_000, Math.round(rawCredit / 10_000) * 10_000));
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);

    // 관할 권역 또는 회사 위치 기반 전담 지도사 지능형 동적 매칭
    const matchedDirector = EmergencyDispatchEngine.getDirectorForLocation({
      location: params.address || params.existingCompany,
      region: params.region
    });

    const directorName =
      params.assignedDirectorName ||
      `${matchedDirector.name} 수석 장례지도사 (국가공인 1급 ${matchedDirector.experienceYears}년 경력)`;
    const directorPhone = params.assignedDirectorPhone || matchedDirector.directPhone;

    return {
      registrationId: `DS-2026-KR-${randomSuffix}`,
      registrantName: params.registrantName?.trim() || '신청 유가족',
      registrantPhone: params.registrantPhone?.trim() || '',
      beneficiaryName: params.beneficiaryName?.trim() || '피공제자 (고인)',
      relationship: params.relationship || '가족',
      existingCompany: params.existingCompany || '주요 선불식 상조사',
      existingProduct: params.existingProduct || '상조 표준 상품',
      paidTotalAmount: params.paidTotalAmount || 1_200_000,
      estimatedRefund: params.estimatedRefund || 400_000,
      lossProtectionCredit,
      assignedDirectorName: directorName,
      assignedDirectorPhone: directorPhone,
      region: matchedDirector.primaryRegion,
      registeredAt: formatKoreanDate(),
      status: 'active'
    };
  }

  /**
   * 공정거래위원회 기준 법정 해약환급금 내용증명 청구서 생성
   */
  public static createCancellationClaim(params: {
    cert: CertificateExtractionSchema;
    refund: RefundCalculationResult;
    claimantName?: string;
    claimantPhone?: string;
    claimantAddress?: string;
    refundBank?: string;
    refundAccount?: string;
    refundHolder?: string;
  }): CancellationClaimData {
    const { cert, refund } = params;
    const companyKey = Object.keys(COMPETITOR_CORPORATE_INFO).find((k) =>
      cert.competitorName.includes(k)
    );
    const corp = companyKey
      ? COMPETITOR_CORPORATE_INFO[companyKey]
      : { ceo: '대표이사', address: '서울특별시 해당 상조사 본사' };

    const randomClaimId = Math.floor(100000 + Math.random() * 900000);
    const claimantName = params.claimantName || cert.subscriberName || '신청인';
    const claimantPhone = params.claimantPhone || cert.subscriberPhone || '';
    const claimantAddress = params.claimantAddress || cert.subscriberAddress || '서울특별시 송파구 올림픽로 300 (신천동)';
    const refundAccountBank = params.refundBank || cert.refundBank || '신한은행';
    const refundAccountNumber = params.refundAccount || cert.refundAccount || '110-384-291028';
    const refundAccountHolder = params.refundHolder || cert.refundHolder || claimantName;

    return {
      claimId: `REQ-2026-${randomClaimId}`,
      claimantName,
      claimantPhone,
      claimantAddress,
      competitorName: cert.competitorName,
      competitorCeo: corp.ceo,
      competitorAddress: corp.address,
      contractNumber: cert.certificateId || 'BR-2021-99482',
      productName: cert.productName,
      contractDate: cert.contractDate || '2021년 05월 10일',
      totalContractAmount: cert.totalContractAmount,
      paidInstallments: cert.paidInstallments,
      totalInstallments: cert.totalInstallments,
      paidTotalAmount: cert.paidTotalAmount,
      statutoryRefundAmount: refund.refundAmount,
      refundAccountBank,
      refundAccountNumber,
      refundAccountHolder,
      legalBasis:
        '「할부거래에 관한 법률」 제34조 제2항 및 공정거래위원회 고시 제2020-1호 「선불식 할부계약의 해약환급금 산정기준」',
      claimDate: formatKoreanDate()
    };
  }
}

/**
 * 기본 듀얼 스탠바이 등록증 샘플
 */
export const SAMPLE_DUAL_STANDBY: DualStandbyRegistration = {
  registrationId: 'DS-2026-KR-8831',
  registrantName: '김정우 (장남)',
  registrantPhone: '010-3849-2910',
  beneficiaryName: '故 김철수 님',
  relationship: '부친',
  existingCompany: 'B상조 (보람상조)',
  existingProduct: '보람 프리미엄 450 (150회 중 42회 납입)',
  paidTotalAmount: 1_260_000,
  estimatedRefund: 453_600,
  lossProtectionCredit: 500_000,
  assignedDirectorName: '박준형 수석 장례지도사 (국가공인 1급 24년 경력)',
  assignedDirectorPhone: '010-8832-1588',
  region: '서울특별시',
  registeredAt: formatKoreanDate(),
  status: 'active'
};
