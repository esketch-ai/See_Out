import {
  CertificateExtractionSchema,
  DiagnosticComparisonReport,
  HiddenCostSeverity,
  HiddenCostBreakdown,
  BaeungPackageType,
  BaeungPackageInfo,
  ReceiptSide
} from './types.js';
import { StatutoryRefundCalculator } from './refundCalculator.js';
import { HiddenCostEstimator } from './hiddenCostEstimator.js';

/**
 * 배웅 정찰제 표준 실비 패키지 목록
 */
export const BAEUNG_PACKAGES: Record<BaeungPackageType, BaeungPackageInfo> = {
  simple_non_hall: {
    type: 'simple_non_hall',
    name: '배웅 직장(무빈소) 실비 패키지',
    price: 1_200_000,
    badge: '무빈소·직장',
    targetGuests: '조문객 없는 가족 추모 (가족 5인 내외)',
    stayDays: 0,
    staffSummary: '1급 장례지도사 1명 전담 동행',
    vehicleSummary: '고인 전용 운구 이송차량 (관내 30km 무료)',
    description: '빈소 대여 없이 염습/입관 후 승화원(화장장)으로 직행하는 가장 간소하고 존엄한 실속 의전',
    includedHighlights: [
      '국가공인 1급 장례지도사 전담 배정 (입관·출관·화장 접수 동행)',
      '규격 오동나무 1.0치 관 및 특수 고인 위생 소독 용품',
      '고급 면의 또는 황금대마 기계직 수의 (원산지 100% 표기)',
      '고인 전용 운구 이송차량 (관내 30km 무료 지원)',
      '모바일 부고장 무제한 무료 발송 + e하늘 화장 예약 대행'
    ],
    excludedNotice: [
      '장례식장 안치실 사용료 (통상 1~2일 / 약 15~30만 원, 식장 직결제)',
      '시립 승화원 화장 접수 비용 (관내 주민 기준 통상 10~16만 원)'
    ],
    specs: [
      {
        category: '전문 인력',
        title: '국가공인 1급 장례지도사',
        detail: '1명 전담 (임종 직후 출동, 입관식 집도, 발인 및 승화원 화장 접수 전 과정 동행)',
        refundNotice: '정액 수임료 원칙 / 촌지·수고비 요구 시 200% 배상'
      },
      {
        category: '고인 용품',
        title: '오동나무 1.0치 규격관',
        detail: '천연 건조 오동나무 1.0치 규격관 (원산지: 국내가공 및 중국산 정품 규격)',
        origin: '시험성적서 완료 목재'
      },
      {
        category: '고인 용품',
        title: '기본 황금대마 수의',
        detail: '기계직 황금대마 특선 수의 1벌 (도포/원삼, 버선, 천금, 지석 등 완비)',
        origin: '원산지 전수 표기'
      },
      {
        category: '입관 용품',
        title: '궁중식 결관 및 위생 소독제',
        detail: '고인 전용 알코올 소독제, 탈지면, 결관바, 관보, 명정 일체'
      },
      {
        category: '유족 지원',
        title: '상주 완장 및 상표',
        detail: '현대식 상주 완장, 상표(리본), 방명록, 모바일 부고장 무제한 무료'
      },
      {
        category: '차량 의전',
        title: '고인 전용 운구 이송차량',
        detail: '병원/요양원 ➔ 안치실 ➔ 승화원 이동 (관내 및 30km 무료 이송 보증)'
      },
      {
        category: '사후 행정',
        title: 'e하늘 화장예약 원스톱 대행',
        detail: '보건복지부 e하늘 장사정보시스템 실시간 화장 접수 및 사망신고 안내'
      }
    ]
  },
  family_2day: {
    type: 'family_2day',
    name: '배웅 핵가족 2일 가족장 패키지',
    price: 1_800_000,
    badge: '핵가족 추천',
    targetGuests: '가까운 친지 30~50인 (가족 중심)',
    stayDays: 2,
    staffSummary: '1급 지도사 1명 + 의전도우미 1명 (8시간)',
    vehicleSummary: '고인 전용 운구 이송차량 (관내 50km 무료)',
    description: '친지 30~50인 중심, 48시간 압축 일정으로 유족의 피로와 불필요한 비용을 줄인 현대식 가족장',
    includedHighlights: [
      '국가공인 1급 장례지도사 24시간 전담 배정',
      '전문 의전도우미 1명 지원 (8시간, 빈소 접객 및 식대 관리)',
      '오동나무 1.5치 규격관 + 대마 혼방 특등 수의 (원산지 표기)',
      '현대식 상복 양복 2벌 + 여성 개량한복 2벌 (미사용 시 환급)',
      '라이프 아카이브 모바일 추모관 + e하늘 화장 예약 대행'
    ],
    excludedNotice: [
      '장례식장 빈소 2일 임대료 및 안치료 (배웅 제휴 시 최대 30% 감면)',
      '조문객 식음료비 (접객 도우미가 로스 및 잔반 최소화 관리)'
    ],
    specs: [
      {
        category: '전문 인력',
        title: '1급 장례지도사 1명 전담',
        detail: '빈소 세팅부터 입관, 완장식, 발인, 승화원 화장까지 24시간 유족 케어'
      },
      {
        category: '전문 인력',
        title: '전문 의전도우미 1명 (8시간)',
        detail: '조문객 접객, 음식 배분 및 낭비 차단 (촌지·수고비 전면 금지)'
      },
      {
        category: '고인 용품',
        title: '오동나무 1.5치 규격관',
        detail: '뒤틀림 없는 천연 건조 오동나무 1.5치 규격 정품관',
        origin: '정품 규격 목재'
      },
      {
        category: '고인 용품',
        title: '대마 혼방 특등 수의',
        detail: '특등 수의 일체 (도포, 원삼, 대님, 턱받침, 습신 등 완비)',
        origin: '대마 50% / 인견 50% 혼방 (공식 표기)'
      },
      {
        category: '입관 용품',
        title: '생화 꽃장식 입관',
        detail: '고인과의 마지막 대면을 위로하는 생화 관내 꽃장식 및 한지 구름베개'
      },
      {
        category: '유족 상복',
        title: '현대식 상복 4벌 제공',
        detail: '남성 정장 2벌(와이셔츠/넥타이 포함) + 여성 개량한복 2벌',
        refundNotice: '미사용 상복 1벌당 30,000원 결제 시 즉시 공제 환급'
      },
      {
        category: '차량 의전',
        title: '고인 전용 운구차량',
        detail: '임종지 ➔ 장례식장 ➔ 승화원 이동 (관내 및 50km 무료 보증)'
      },
      {
        category: '디지털 추모',
        title: '라이프 아카이브 모바일 추모관',
        detail: '생전 사진 헌정 갤러리, 모바일 조문록, 부고장/답례장 연동'
      }
    ]
  },
  economic_3day: {
    type: 'economic_3day',
    name: '배웅 실속 3일장 정찰 패키지',
    price: 2_500_000,
    badge: '가장 대중적',
    targetGuests: '일반 조문객 100~150인 표준',
    stayDays: 3,
    staffSummary: '1급 지도사 1명 + 의전도우미 2명 (각 8시간)',
    vehicleSummary: '고급 고인 리무진 or 45인승 대형 버스 택1',
    description: '가장 보편적인 3일장 모델. 전담 지도사, 의전도우미 2명, 고급 리무진 or 대형 버스 선택 완비',
    includedHighlights: [
      '국가공인 1급 장례지도사 1명 전담 (3일간 밀착 케어)',
      '전문 의전도우미 2명 지원 (각 8시간, 조문객 맞이 및 정산)',
      '오동나무 1.5치 규격관 + 대마 100% 특등 수의 (원산지 증명서)',
      '상복 8벌 지원 (남성 정장 4벌 + 여성 한복 4벌 / 미사용 환급)',
      '고급 리무진 or 45인승 대형 우등 버스 택1 (왕복 80km 무료)'
    ],
    excludedNotice: [
      '장례식장 빈소 3일 임대료 및 안치료 (배웅 제휴 시 최대 30% 감면)',
      '조문객 식음료비 (도우미가 밥·국·안주 정량 배분 관리)'
    ],
    specs: [
      {
        category: '전문 인력',
        title: '1급 장례지도사 1명 전담',
        detail: '3일 전 일정 동행, 빈소 차림, 입관식, 영결식, 화장장 및 장지 안내'
      },
      {
        category: '전문 인력',
        title: '전문 의전도우미 2명 (각 8시간)',
        detail: '피크 시간대 조문객 식음료 접객 및 식대 로스 방지 (총 16시간)'
      },
      {
        category: '고인 용품',
        title: '오동나무 1.5치 규격관',
        detail: '정밀 가공 오동나무 1.5치 관 (수분 차단 및 완전 연소 인증)'
      },
      {
        category: '고인 용품',
        title: '대마 100% 특등 수의',
        detail: '대마 100% 특등 수의 (공식 시험성적서 및 원산지 증명서 발급)',
        origin: '대마 100% (국내가공 및 수입 완제 품등 확인)'
      },
      {
        category: '입관 용품',
        title: '궁중 생화 꽃염습',
        detail: '전문 플로리스트 생화 꽃장식, 한지 구름베개, 관보, 명정 일체'
      },
      {
        category: '유족 상복',
        title: '현대식 상복 8벌 제공',
        detail: '남성 정장 4벌(셔츠/넥타이) + 여성 개량한복 4벌 (사이즈 무료 교환)',
        refundNotice: '미사용 상복 1벌당 30,000원 결제 시 즉시 공제 환급'
      },
      {
        category: '차량 의전',
        title: '고급 리무진 or 45인승 버스 택1',
        detail: '최고급 링컨/캐딜락 리무진 또는 45인승 대형 우등 버스 택1 (왕복 80km 무료)'
      },
      {
        category: '디지털 추모',
        title: '라이프 아카이브 모바일 분향소',
        detail: '고인 생애 기록관, 모바일 부고장/조문 답례장, 추모 영상 연동'
      }
    ]
  },
  standard_3day: {
    type: 'standard_3day',
    name: '배웅 품격 의전 3일장 패키지',
    price: 3_500_000,
    badge: '명품 의전',
    targetGuests: '대형 조문객 250인 이상 (사회장·단체장)',
    stayDays: 3,
    staffSummary: '1급 지도사 2명 + 의전도우미 4명 (각 8시간)',
    vehicleSummary: '최고급 리무진 + 45인승 대형 버스 2대 동시 기본 제공',
    description: '격식과 품격을 극대화한 최고급 명품 의전. 최고급 리무진과 대형 버스 2대 동시 제공 및 도우미 4명',
    includedHighlights: [
      '국가공인 1급 장례지도사 2인 전담 + 입관 전문팀 배정',
      '전문 의전도우미 4명 지원 (총 32시간, 대규모 조문객 밀착 서빙)',
      '오동나무 2.0치 특관 + 최고급 안동포/생초 수의 (보증서 발급)',
      '상복 16벌 지원 (남성 정장 8벌 + 여성 한복 8벌 / 무제한 교환)',
      '최고급 리무진 + 45인승 대형 우등 버스 2대 동시 기본 제공 (전국 장지)'
    ],
    excludedNotice: [
      '장례식장 특실/VIP실 임대료 및 안치료 (배웅 제휴 시 최대 30% 감면)',
      '조문객 식음료비 (도우미 4인이 조리실·접객실 체계적 분담 관리)'
    ],
    specs: [
      {
        category: '전문 인력',
        title: '1급 장례지도사 2인 전담',
        detail: '총괄 의전지도사 1인 + 입관 및 의전 보조 지도사 1인 전담 배치'
      },
      {
        category: '전문 인력',
        title: '전문 의전도우미 4명 (총 32시간)',
        detail: '조문객 맞이, 접객 테이블 세팅, 식대 누수 방지 (수고비 요구 절대 금지)'
      },
      {
        category: '고인 용품',
        title: '오동나무 2.0치 특관',
        detail: '최고 등급 천연 오동나무 2.0치 두께의 명품 특관 (궁중 문양 양각)'
      },
      {
        category: '고인 용품',
        title: '최고급 안동포/생초 수의',
        detail: '천연 삼베 100% 명품 안동포/생초 수의 (원산지 국가인증 보증서 동봉)',
        origin: '국내산 명품 삼베 100%'
      },
      {
        category: '입관 용품',
        title: '궁중식 생화 꽃침대 및 꽃관',
        detail: '고급 수입 생화로 채운 꽃침대 염습 및 실크 관보, 붓글씨 명정'
      },
      {
        category: '유족 상복',
        title: '현대식 상복 16벌 제공',
        detail: '남성 정장 8벌 + 여성 개량한복 8벌 (직계/방계 친족 전원 착용 가능)',
        refundNotice: '미사용 상복 1벌당 30,000원 결제 시 즉시 공제 환급'
      },
      {
        category: '차량 의전',
        title: '리무진 + 45인승 대형 버스 동시 2대',
        detail: '최고급 링컨/캐딜락 리무진 및 45인승 대형 우등 버스 2대 동시 기본 제공 (왕복 100km 무료)'
      },
      {
        category: '디지털 추모',
        title: '프리미엄 헌정 영상 & 영구 아카이브',
        detail: '전문 디렉터 제작 고인 헌정 영상, 디지털 분향소, 라이프 아카이브 영구 보존'
      }
    ]
  }
};

/**
 * 상조 견적 진단 및 영수증 대조 종합 엔진
 * Specification: ALGO-2026-003 Section 5 & 6
 */
export class QuoteDiagnosticsEngine {
  /**
   * 상조 증서 및 옵션을 입력받아 최종 1:1 맞춤 영수증 진단 리포트를 생성
   */
  public static diagnose(params: {
    certificate: CertificateExtractionSchema;
    clientName?: string;
    packageType?: BaeungPackageType;
    hiddenCostSeverity?: HiddenCostSeverity;
    customHiddenCost?: Partial<HiddenCostBreakdown>;
  }): DiagnosticComparisonReport {
    const {
      certificate,
      clientName = '고객',
      packageType = 'economic_3day',
      hiddenCostSeverity = 'average',
      customHiddenCost
    } = params;

    // 1. 법정 해약환급금 계산
    const statutoryRefund = StatutoryRefundCalculator.calculateRefund(certificate);

    // 2. 현장 숨은 추가금 추정
    const hiddenCost = customHiddenCost
      ? HiddenCostEstimator.estimateCustom(customHiddenCost)
      : HiddenCostEstimator.estimateBySeverity(hiddenCostSeverity);

    // 3. 배웅 패키지 및 전환 크레딧 산출
    const selectedPackage = BAEUNG_PACKAGES[packageType];
    // 전환 크레딧: 손실액의 30% (최대 50만 원 한도)
    const transitionCredit = Math.min(
      Math.floor(statutoryRefund.lossAmount * 0.30),
      500_000
    );

    // 4. 총 지출액 및 순 절감액 산출
    // [A] 기존 상조 유지 시 총 예상 지출
    const competitorTotalCost = certificate.totalContractAmount + hiddenCost.totalHiddenCost;

    // [B] 배웅 전환 시 실제 지출액
    // 배웅 패키지 가격 - 해약환급금 수령액 - 전환 크레딧
    const baeungTotalActualCost = Math.max(
      0,
      selectedPackage.price - statutoryRefund.refundAmount - transitionCredit
    );

    // [C] 최종 순 절감액 및 절감률
    const netSavingsAmount = competitorTotalCost - baeungTotalActualCost;
    const savingsRatePercentage =
      competitorTotalCost > 0
        ? Math.round((netSavingsAmount / competitorTotalCost) * 1000) / 10
        : 0;

    // 5. 좌우 영수증 모델 생성
    const leftCompetitorReceipt: ReceiptSide = {
      title: `기존 ${certificate.competitorName} 유지 시 예상 총지출`,
      subtitle: `${certificate.productName} (약정 ${certificate.totalInstallments}회차 / 월 ${certificate.monthlyPayment.toLocaleString()}원)`,
      lineItems: [
        {
          name: '기존 상조 약정 총액',
          amount: certificate.totalContractAmount,
          description: `총 ${certificate.totalInstallments}회 약정 납입금`
        },
        {
          name: '현장 수의·관 업셀링 예상',
          amount: hiddenCost.shroudUpgrade,
          isWarning: true,
          description: '원산지 미표기 및 등급 변경 강요 관행'
        },
        {
          name: '제단 꽃장식 추가금 예상',
          amount: hiddenCost.flowerUpgrade,
          isWarning: true,
          description: '기본형 대비 규격 확대 유도'
        },
        {
          name: '운구차량 초과 운임 예상',
          amount: hiddenCost.distanceOvercharge,
          isWarning: true,
          description: '기본 거리(대부분 20~50km) 초과 요금'
        },
        {
          name: '지도사/도우미 수고비(촌지)',
          amount: hiddenCost.tipGratuity,
          isWarning: true,
          description: '현장 관행적 촌지 요구'
        }
      ],
      totalAmount: competitorTotalCost
    };

    const rightBaeungReceipt: ReceiptSide = {
      title: '배웅 후불제 전환 시 실제 부담액',
      subtitle: `${selectedPackage.name} (선금 0원 / 후불 정산)`,
      lineItems: [
        {
          name: selectedPackage.name,
          amount: selectedPackage.price,
          description: selectedPackage.description
        },
        {
          name: '기존 상조 법정 해약환급금 (수령 차감)',
          amount: -statutoryRefund.refundAmount,
          isDeduction: true,
          description: `${certificate.paidInstallments}회차 납입 (${statutoryRefund.refundRatePercentage}% 환급 적용)`
        },
        {
          name: '배웅 해약손실 보전 크레딧 (차감)',
          amount: -transitionCredit,
          isDeduction: true,
          description: '해약 손실액의 30% 바우처/크레딧 지원'
        },
        {
          name: '현장 추가금 및 촌지 관행',
          amount: 0,
          isHighlighted: true,
          description: '100% 원가 정찰제 / 추가금 및 촌지 전면 금지'
        }
      ],
      totalAmount: baeungTotalActualCost
    };

    const diagnosticId = `diag-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

    return {
      diagnosticId,
      clientName,
      analyzedAt: new Date().toISOString(),
      certificate,
      statutoryRefund,
      hiddenCost,
      selectedBaeungPackage: selectedPackage,
      transitionCredit,
      leftCompetitorReceipt,
      rightBaeungReceipt,
      summary: {
        competitorTotalCost,
        baeungTotalActualCost,
        netSavingsAmount,
        savingsRatePercentage,
        callToActionBadge: `배웅 전환 시 총 ${netSavingsAmount.toLocaleString()}원 (${savingsRatePercentage}%) 절감됩니다!`
      }
    };
  }

  /**
   * 터미널(CLI) 가독성을 위한 아스키 아트 영수증 포맷터
   */
  public static formatReportToCli(report: DiagnosticComparisonReport): string {
    const divider = '━'.repeat(74);
    const thinDivider = '─'.repeat(74);
    const { leftCompetitorReceipt: left, rightBaeungReceipt: right, summary, certificate } = report;

    let out = '\n';
    out += `\x1b[1;36m${divider}\x1b[0m\n`;
    out += `  🕊️  \x1b[1;37m배웅 (Bae-ung) 상조 견적 진단기 — 1:1 맞춤 영수증 대조 리포트\x1b[0m\n`;
    out += `  진단 ID: ${report.diagnosticId} | 대상자: ${report.clientName} | 분석일시: ${report.analyzedAt.substring(0, 10)}\n`;
    out += `\x1b[1;36m${divider}\x1b[0m\n\n`;

    out += `  📋 \x1b[1m[인식된 상조 증서 요약]\x1b[0m\n`;
    out += `  • 가입 상조사: ${certificate.competitorName} (${certificate.productName})\n`;
    out += `  • 계약 총액: ${certificate.totalContractAmount.toLocaleString()}원 (${certificate.totalInstallments}회 약정)\n`;
    out += `  • 납입 현황: ${certificate.paidInstallments}회 납입 완료 (${certificate.paidTotalAmount.toLocaleString()}원 / ${report.statutoryRefund.progressRatioPercentage}%)\n`;
    out += `  • 법정 해약환급금: \x1b[32m${report.statutoryRefund.refundAmount.toLocaleString()}원\x1b[0m (환급률: ${report.statutoryRefund.refundRatePercentage}%, 손실액: ${report.statutoryRefund.lossAmount.toLocaleString()}원)\n`;
    out += `  • 배웅 보전 크레딧: \x1b[35m${report.transitionCredit.toLocaleString()}원 지원\x1b[0m\n\n`;

    out += `  ${thinDivider}\n`;
    out += `  ${'【기존 상조 유지 시 예상 영수증】'.padEnd(34)} | ${'【배웅 전환 시 실제 영수증】'}\n`;
    out += `  ${thinDivider}\n`;

    const maxItems = Math.max(left.lineItems.length, right.lineItems.length);
    for (let i = 0; i < maxItems; i++) {
      const l = left.lineItems[i];
      const r = right.lineItems[i];

      const leftText = l ? `• ${l.name}: ${l.amount.toLocaleString()}원` : '';
      const rightText = r ? `• ${r.name}: ${r.amount > 0 ? '+' : ''}${r.amount.toLocaleString()}원` : '';

      out += `  ${leftText.padEnd(35)} | ${rightText}\n`;
    }

    out += `  ${thinDivider}\n`;
    out += `  \x1b[31m[기존 예상 총지출] ${left.totalAmount.toLocaleString()}원\x1b[0m`.padEnd(46);
    out += ` | \x1b[32m[배웅 실제 총부담] ${right.totalAmount.toLocaleString()}원\x1b[0m\n`;
    out += `  ${thinDivider}\n\n`;

    out += `\x1b[1;42;30m   🎉  ${summary.callToActionBadge}   \x1b[0m\n\n`;
    out += `  💰 순 절감액: \x1b[1;32m${summary.netSavingsAmount.toLocaleString()}원\x1b[0m (총 지출의 \x1b[1;33m${summary.savingsRatePercentage}%\x1b[0m 세이브)\n`;
    out += `  🛡️ 안전 보증: 선금 0원 / 100% 후불 정산 / 현장 추가금 0원 보증제 적용\n`;
    out += `\x1b[1;36m${divider}\x1b[0m\n`;

    return out;
  }
}
