import { describe, it, expect } from 'vitest';
import { OptOutService } from '../src/compliance/index.js';

describe('사업계획서 1단계 3.1절 및 4.3절: 옵트아웃 및 공공데이터 비제휴 고지 검증', () => {
  it('공공데이터 기반 정보 제공 및 비제휴 법적 고지문이 완비되어 있어야 한다', () => {
    const disclaimer = OptOutService.getDisclaimer();
    expect(disclaimer.title).toContain('비제휴');
    expect(disclaimer.statement).toContain('e하늘 장사정보시스템');
    expect(disclaimer.statement).toContain('사전 제휴 관계를 의미하지 않습니다');
    expect(disclaimer.publicDataDate).toContain('2023년 06월');
    expect(disclaimer.optOutNotice).toContain('옵트아웃 창구');
  });

  it('장례식장 정보 정정(CORRECTION) 요청 시 접수 번호(OPT-2026-KR-XXXX)가 정상 발급되어야 한다', () => {
    const req = OptOutService.submitRequest({
      hallId: 'fh-seoul-asan',
      hallName: '서울아산병원장례식장',
      requestType: 'CORRECTION',
      requesterRole: 'DIRECTOR',
      requesterName: '박관리',
      requesterPhone: '010-9988-7766',
      requesterEmail: 'admin@asan.org',
      details: '특실 80평형 임대료가 1,800,000원으로 인상되어 정정을 요청합니다.'
    });

    expect(req.requestId).toMatch(/^OPT-2026-KR-\d{4}$/);
    expect(req.status).toBe('RECEIVED');
    expect(req.requesterName).toBe('박관리');
  });

  it('게재 중단(TAKEDOWN) 요청 접수 시 해당 장례식장이 숨김 처리(isHallHidden: true)되어야 한다', () => {
    const hallId = 'fh-temp-takedown-test';
    expect(OptOutService.isHallHidden(hallId)).toBe(false);

    const req = OptOutService.submitRequest({
      hallId,
      hallName: '임시 테스트 장례식장',
      requestType: 'TAKEDOWN',
      requesterRole: 'OWNER',
      requesterName: '김대표',
      requesterPhone: '010-1111-2222',
      requesterEmail: 'owner@hall.com',
      details: '영업 종료로 인한 전체 리스팅 삭제를 요청합니다.'
    });

    expect(req.status).toBe('RESOLVED_HIDDEN');
    expect(OptOutService.isHallHidden(hallId)).toBe(true);
  });
});
