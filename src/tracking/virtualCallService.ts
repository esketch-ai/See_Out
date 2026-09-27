import { VirtualCallMetadata } from './types.js';

/**
 * 0507 가상번호 중계 서비스 (Virtual Call Bridge Service)
 * 사업계획서 7.1절 및 법적 검토 5장 준수:
 * - 통화 메타데이터만 수집 (시각, 통화 시간, 연결 상태)
 * - 통신비밀보호법 및 전기통신사업법에 의거 녹음 미실시 (recordingDisabled: true)
 * - 30초 이상 통화 시 '실질 상담'으로 자동 분류
 */
export class VirtualCallBridgeService {
  // 장례식장별 가상번호 디렉터리 (0507-1420-XXXX)
  private static virtualDirectory: Map<string, string> = new Map([
    ['fh-seoul-asan', '0507-1420-2000'],
    ['fh-seoul-samsung', '0507-1420-3000'],
    ['fh-seoul-severance', '0507-1420-4000'],
    ['fh-seoul-stmary', '0507-1420-5000'],
    ['fh-busan-simin', '0507-1420-6364'],
    ['fh-gyeonggi-seongnam-medical', '0507-1420-7387']
  ]);

  // 통화 로그 저장소
  private static callLogs: VirtualCallMetadata[] = [
    {
      callId: 'CALL-2026-0927-0101',
      hallId: 'fh-seoul-asan',
      hallName: '서울아산병원장례식장',
      virtualNumber: '0507-1420-2000',
      destinationNumber: '02-3010-2000',
      startedAt: '2026-09-27T14:22:10+09:00',
      durationSeconds: 145, // 2분 25초
      callStatus: 'CONNECTED',
      isSubstantialCall: true,
      recordingDisabled: true
    },
    {
      callId: 'CALL-2026-0927-0102',
      hallId: 'fh-seoul-asan',
      hallName: '서울아산병원장례식장',
      virtualNumber: '0507-1420-2000',
      destinationNumber: '02-3010-2000',
      startedAt: '2026-09-27T16:05:30+09:00',
      durationSeconds: 12, // 12초 (단순 문의/부재)
      callStatus: 'CONNECTED',
      isSubstantialCall: false,
      recordingDisabled: true
    },
    {
      callId: 'CALL-2026-0927-0103',
      hallId: 'fh-busan-simin',
      hallName: '(주)시민장례식장',
      virtualNumber: '0507-1420-6364',
      destinationNumber: '051-636-4444',
      startedAt: '2026-09-27T11:10:45+09:00',
      durationSeconds: 182, // 3분 2초
      callStatus: 'CONNECTED',
      isSubstantialCall: true,
      recordingDisabled: true
    }
  ];

  /**
   * 장례식장 ID에 대응하는 0507 가상번호 조회 (없으면 자동 매핑 생성)
   */
  public static getVirtualNumber(hallId: string, phone: string): string {
    if (this.virtualDirectory.has(hallId)) {
      return this.virtualDirectory.get(hallId)!;
    }
    // 임의의 가상번호 4자리 생성 및 매핑
    const digits = phone.replace(/[^0-9]/g, '');
    const last4 = digits.slice(-4) || '1588';
    const newVirtual = `0507-1420-${last4}`;
    this.virtualDirectory.set(hallId, newVirtual);
    return newVirtual;
  }

  /**
   * 가상 통화 발생 이벤트 기록 (녹음 없이 메타데이터만 안전 로깅)
   */
  public static logCallEvent(params: {
    hallId: string;
    hallName: string;
    destinationNumber: string;
    durationSeconds: number;
    callStatus?: 'CONNECTED' | 'MISSED' | 'BUSY' | 'REJECTED';
  }): VirtualCallMetadata {
    const virtualNumber = this.getVirtualNumber(params.hallId, params.destinationNumber);
    const callStatus = params.callStatus || (params.durationSeconds > 0 ? 'CONNECTED' : 'MISSED');
    const isSubstantialCall = callStatus === 'CONNECTED' && params.durationSeconds >= 30;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);

    const call: VirtualCallMetadata = {
      callId: `CALL-2026-${randomSuffix}`,
      hallId: params.hallId,
      hallName: params.hallName,
      virtualNumber,
      destinationNumber: params.destinationNumber,
      startedAt: new Date().toISOString(),
      durationSeconds: params.durationSeconds,
      callStatus,
      isSubstantialCall,
      recordingDisabled: true
    };

    this.callLogs.push(call);
    return call;
  }

  /**
   * 장례식장별 통화 이력 조회
   */
  public static getCallLogsForHall(hallId: string): VirtualCallMetadata[] {
    return this.callLogs.filter((c) => c.hallId === hallId);
  }

  /**
   * 장례식장의 실질 상담 통화 수 반환 (30초 이상)
   */
  public static getSubstantialCallCount(hallId: string): number {
    return this.callLogs.filter((c) => c.hallId === hallId && c.isSubstantialCall).length;
  }

  /**
   * 장례식장 ID 기반 가상번호 조회 편의 헬퍼
   */
  public static getVirtualNumberForHall(hallId: string): string {
    return this.getVirtualNumber(hallId, '1588-0000');
  }
}

export const VirtualCallService = VirtualCallBridgeService;
