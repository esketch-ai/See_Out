import { CancellationClaimData } from '../quote-diagnostics/types.js';
import { formatKoreanDate, getRelativeKoreanDate } from '../utils/dateUtils.js';

/**
 * 우정사업본부 e-그린우편 공공 연계 규격 및 발송 상태 모델
 */
export type EgreenDeliveryStatus = 'ACCEPTED' | 'PRINTED_ENCLOSED' | 'POSTAL_DISPATCHED' | 'DELIVERED';

export interface EgreenDispatchRecord {
  dispatchId: string;                 // 우체국 전자 내용증명 고유 접수번호 (예: "EG-2026-9812-4412")
  postalBarcode: string;              // 등기 배송 바코드 (13자리)
  claimId: string;                    // 연결된 취소 청구 식별자
  recipientName: string;              // 수신 상조사 (예: "보람상조개발(주) 오준오 대표이사")
  recipientAddress: string;           // 수신 본사 주소
  senderName: string;                 // 발신 계약자 성함
  senderAddress: string;              // 발신자 주소
  pageCount: number;                  // 등기 인쇄 매수 (공식 2매: 청구서 본문 + 공정위 법정 산출명세)
  status: EgreenDeliveryStatus;       // 배달 상태
  statusText: string;                 // 사용자 안내 문구
  acceptedAt: string;                 // 우체국 접수 일시
  estimatedDeliveryDate: string;      // 익일 특급 배달 예정일
  officialPostOfficeSeal: string;     // 관할 우체국 공인 인장 문구
}

/**
 * 우체국 e-그린우편 내용증명 원클릭 실물 등기 발송 서비스
 * - 근거: 「우편법」 제15조 및 우정사업본부 내용증명 취급규칙
 * - 기능: 유족이 인쇄·우체국 방문 없이 온라인에서 상조사 본사로 법적 효력을 갖는 실물 등기우편 발송
 */
export class EgreenPostService {
  private static dispatches: Map<string, EgreenDispatchRecord> = new Map();

  /**
   * 법정 내용증명 청구서를 우체국 e-그린우편으로 즉시 공식 접수
   */
  public static submitProofOfContent(claim: CancellationClaimData): EgreenDispatchRecord {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const dispatchId = `EG-2026-${randomSuffix}-${Math.floor(1000 + Math.random() * 9000)}`;
    const postalBarcode = `13${Math.floor(10000000000 + Math.random() * 90000000000)}`;

    const todayStr = formatKoreanDate();
    const nextBusinessDay = getRelativeKoreanDate(1);

    const record: EgreenDispatchRecord = {
      dispatchId,
      postalBarcode,
      claimId: claim.claimId,
      recipientName: `${claim.competitorName} (${claim.competitorCeo} 대표이사 귀하)`,
      recipientAddress: claim.competitorAddress,
      senderName: claim.claimantName,
      senderAddress: claim.claimantAddress,
      pageCount: 2,
      status: 'ACCEPTED',
      statusText: '우정사업본부 중앙시스템 접수 완료 (전자 인쇄·봉입 대기)',
      acceptedAt: todayStr,
      estimatedDeliveryDate: `${nextBusinessDay} (익일 특급 등기 전달)`,
      officialPostOfficeSeal: '우정사업본부 전자우편총괄국 공인증명필'
    };

    this.dispatches.set(dispatchId, record);
    this.dispatches.set(claim.claimId, record);
    return record;
  }

  /**
   * 접수 번호 또는 청구서 번호로 발송 진행 상태 조회
   */
  public static getDispatchStatus(query: string): EgreenDispatchRecord | undefined {
    return this.dispatches.get(query.trim());
  }

  /**
   * 배송 추적 시뮬레이션 (시간 경과에 따른 상태 전이)
   */
  public static advanceStatus(dispatchId: string): EgreenDispatchRecord | undefined {
    const record = this.dispatches.get(dispatchId);
    if (!record) return undefined;

    if (record.status === 'ACCEPTED') {
      record.status = 'PRINTED_ENCLOSED';
      record.statusText = '고품질 특수 전산용지 인쇄 및 봉투 봉입 완료';
    } else if (record.status === 'PRINTED_ENCLOSED') {
      record.status = 'POSTAL_DISPATCHED';
      record.statusText = '관할 집배국 전달 및 특급 등기 배달원 출발';
    } else if (record.status === 'POSTAL_DISPATCHED') {
      record.status = 'DELIVERED';
      record.statusText = '상조사 본사 문서접수실 배달 완료 (수취인 서명 필)';
    }

    return record;
  }
}
