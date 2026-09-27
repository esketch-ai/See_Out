import {
  OptOutRequest,
  OptOutRequestType,
  RequesterRole,
  NonAffiliationDisclaimer
} from './types.js';

/**
 * 장례식장 옵트아웃(정보 정정·게재 중단) 및 비제휴 법적 고지 서비스
 * 사업계획서 3.1절 및 4.3절 준수
 */
export class OptOutService {
  private static requests: OptOutRequest[] = [];
  private static hiddenHallIds: Set<string> = new Set();

  /**
   * 사업계획서 3.1절 및 4.3절 표준 비제휴 고지문 반환
   */
  public static getDisclaimer(): NonAffiliationDisclaimer {
    return {
      title: '공공데이터 기반 정보 제공 및 비제휴 법적 고지',
      statement:
        '배웅 플랫폼에 등록된 기본 장례식장 정보(상호, 주소, 연락처, 공시 가격 등)는 공공데이터포털 및 보건복지부 e하늘 장사정보시스템의 공개 정보를 기반으로 유가족의 알 권리를 위해 중립적으로 제공되며, 개별 장례식장과의 사전 제휴 관계를 의미하지 않습니다.',
      publicDataSource: '한국장례문화진흥원 전국 장사시설 현황 데이터셋 (공공데이터포털)',
      publicDataDate: '2023년 06월 기준 (현장 실비는 식장 정책에 따라 다를 수 있음)',
      optOutNotice:
        '시설 정보의 변경이나 게재 중단을 원하시는 장례식장 관계자분께서는 온라인 옵트아웃 창구를 통해 접수해 주시면 확인 즉시 신속히 정정 또는 삭제 처리해 드립니다.',
      inquiryContact: '배웅 고객권익보호팀 1588-0000 (평일 09:00~18:00)'
    };
  }

  /**
   * 장례식장 옵트아웃(정정 또는 게재 중단) 요청 접수
   */
  public static submitRequest(params: {
    hallId: string;
    hallName: string;
    requestType: OptOutRequestType;
    requesterRole: RequesterRole;
    requesterName: string;
    requesterPhone: string;
    requesterEmail: string;
    details: string;
  }): OptOutRequest {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const requestId = `OPT-2026-KR-${randomSuffix}`;

    const req: OptOutRequest = {
      requestId,
      hallId: params.hallId,
      hallName: params.hallName,
      requestType: params.requestType,
      requesterRole: params.requesterRole,
      requesterName: params.requesterName.trim(),
      requesterPhone: params.requesterPhone.trim(),
      requesterEmail: params.requesterEmail?.trim() || '',
      details: params.details.trim(),
      status: 'RECEIVED',
      submittedAt: new Date().toISOString()
    };

    this.requests.push(req);

    // 게재 중단(TAKEDOWN) 요청인 경우 즉시 숨김 처리 큐에 반영 (빠른 유저 보호)
    if (params.requestType === 'TAKEDOWN') {
      this.hiddenHallIds.add(params.hallId);
      req.status = 'RESOLVED_HIDDEN';
      req.resolvedAt = new Date().toISOString();
    }

    return req;
  }

  /**
   * 해당 장례식장이 게재 중단(삭제) 처리되었는지 확인
   */
  public static isHallHidden(hallId: string): boolean {
    return this.hiddenHallIds.has(hallId);
  }

  /**
   * 특정 장례식장의 옵트아웃 접수 이력 조회
   */
  public static getRequestsForHall(hallId: string): OptOutRequest[] {
    return this.requests.filter((r) => r.hallId === hallId);
  }

  /**
   * 전체 접수 요청 목록 조회 (관리자용)
   */
  public static getAllRequests(): OptOutRequest[] {
    return this.requests;
  }
}
