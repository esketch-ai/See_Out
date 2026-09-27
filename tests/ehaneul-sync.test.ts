import { describe, it, expect } from 'vitest';
import { EhaneulSyncWorker } from '../src/funeral-halls/ehaneulSyncWorker.js';
import { OptOutService } from '../src/compliance/optOutService.js';

describe('보건복지부 e하늘 공공 API 일일 동기화 Cron 워커 검증 (ARCH-2026-002)', () => {
  it('동기화 워커가 정상 실행되고 수집 및 변동 통계 리포트를 생성해야 한다', async () => {
    const result = await EhaneulSyncWorker.executeSync();

    expect(result.syncId).toMatch(/^SYNC-\d{8}-\d{4}$/);
    expect(result.success).toBe(true);
    expect(result.totalFetched).toBeGreaterThan(0);
    expect(result.diffLogs.length).toBeGreaterThan(0);
  });

  it('비정상 임대료나 빈소 수(이상치)를 감지하여 DB 반영을 차단해야 한다', async () => {
    const result = await EhaneulSyncWorker.executeSync();

    const outlierLog = result.diffLogs.find(l => l.changeType === 'OUTLIER_BLOCKED');
    expect(outlierLog).toBeDefined();
    expect(outlierLog?.hallName).toContain('테스트 이상치');
    expect(result.outliersBlockedCount).toBeGreaterThanOrEqual(1);
  });

  it('옵트아웃(게재 중단) 처리된 장례식장은 동기화 대상에서 자동 제외(OPT_OUT_SKIPPED)되어야 한다', async () => {
    // 1. 임의 장례식장 옵트아웃 게재 중단 등록
    const hallIdToHide = 'fh-ehaneul-옵트아웃테스트장례식장';
    OptOutService.submitRequest({
      hallId: hallIdToHide,
      hallName: '옵트아웃 테스트 장례식장',
      requestType: 'TAKEDOWN',
      requesterRole: 'OWNER',
      requesterName: '최대표',
      requesterPhone: '010-0000-1111',
      requesterEmail: 'test@hall.com',
      details: '영업 종료로 인한 삭제 요청'
    });

    // 2. 해당 장례식장이 포함된 피드로 동기화 실행
    const result = await EhaneulSyncWorker.executeSync({
      customFeed: [
        {
          facilityId: 'EH-TEST-OPTOUT',
          facilityName: '옵트아웃 테스트 장례식장',
          region: '서울특별시',
          subRegion: '강남구',
          address: '서울시 강남구 테헤란로 100',
          phone: '02-555-5555',
          roomCount: 5,
          capacityCount: 10,
          dailyRent: 700_000,
          baseDate: '2026-09-28'
        }
      ]
    });

    expect(result.optOutSkippedCount).toBe(1);
    const skippedLog = result.diffLogs.find(l => l.changeType === 'OPT_OUT_SKIPPED');
    expect(skippedLog).toBeDefined();
    expect(skippedLog?.detail).toContain('옵트아웃');
  });

  it('동기화 스케줄러의 시작(startSchedule) 및 정지(stopSchedule) 생명주기가 안전하게 제어되어야 한다', () => {
    expect(() => {
      EhaneulSyncWorker.startSchedule(3600000); // 1시간 주기 등록
      EhaneulSyncWorker.stopSchedule();         // 정지
    }).not.toThrow();
  });
});
