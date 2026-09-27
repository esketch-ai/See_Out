import { describe, it, expect } from 'vitest';
import { EmergencyDispatchEngine } from '../src/emergency/index.js';

describe('긴급 출동 지역별 전담 지도사 및 동적 ETA 지능형 배정 엔진 검증 (ARCH-2026-002)', () => {
  it('부산 해운대 및 시민장례식장 입력 시 부산 전담 강태식 지도사와 동적 ETA가 배정되어야 한다', () => {
    const result = awaitDispatch({
      locationDetail: '부산 해운대구 우동 자택',
      hallName: '(주)시민장례식장'
    });

    expect(result.detectedRegion).toBe('부산광역시');
    expect(result.assignedDirector.name).toBe('강태식');
    expect(result.assignedDirector.licenseNo).toBe('제26-0312호');
    expect(result.assignedDirector.baseCenterName).toContain('부산');
    expect(result.estimatedArrivalMinutes).toBeLessThanOrEqual(50);
    expect(result.estimatedArrivalTimeFormatted).toContain('도착');
    expect(result.estimatedArrivalTimeFormatted).not.toBe('약 40분 이내 도착'); // 고정 문구 탈피
    expect(result.vehicleDispatchInfo).toContain('부산');
  });

  it('대구 동산병원 입력 시 대구 전담 서동민 지도사와 대구 의전거점이 배정되어야 한다', () => {
    const result = awaitDispatch({
      locationDetail: '대구 중구 계명대학교 동산병원 응급실',
      hallName: '대구동산병원장례식장'
    });

    expect(result.detectedRegion).toBe('대구광역시');
    expect(result.assignedDirector.name).toBe('서동민');
    expect(result.assignedDirector.licenseNo).toBe('제27-0409호');
    expect(result.assignedDirector.baseCenterName).toContain('대구');
    expect(result.dispatchId).toContain('DSP-2026-TAE-');
  });

  it('서울 신촌 세브란스 입력 시 서울 서부 전담 김도현 지도사가 배정되어야 한다', () => {
    const result = awaitDispatch({
      locationDetail: '신촌 세브란스병원 본관 9층 병동',
      hallName: '연세대학교 신촌장례식장'
    });

    expect(result.detectedRegion).toBe('서울특별시');
    expect(result.assignedDirector.name).toBe('김도현');
    expect(result.assignedDirector.licenseNo).toBe('제11-0182호');
    expect(result.assignedDirector.baseCenterName).toContain('중앙의전센터');
  });

  it('서울 송파구 아산병원 입력 시 서울 동부 전담 박준형 지도사가 배정되어야 한다', () => {
    const result = awaitDispatch({
      locationDetail: '서울 송파구 풍납동 서울아산병원 본관 응급실',
      hallName: '서울아산병원장례식장'
    });

    expect(result.detectedRegion).toBe('서울특별시');
    expect(result.assignedDirector.name).toBe('박준형');
    expect(result.assignedDirector.licenseNo).toBe('제11-0421호');
    expect(result.assignedDirector.baseCenterName).toContain('동부');
  });

  it('제주 서귀포 의료원 입력 시 제주 전담 고재필 지도사가 배정되어야 한다', () => {
    const result = awaitDispatch({
      locationDetail: '제주 서귀포의료원 응급실',
      hallName: '서귀포시장례문화센터'
    });

    expect(result.detectedRegion).toBe('제주특별자치도');
    expect(result.assignedDirector.name).toBe('고재필');
    expect(result.assignedDirector.licenseNo).toBe('제50-0082호');
    expect(result.assignedDirector.baseCenterName).toContain('제주');
    expect(result.vehicleDispatchInfo).toContain('제주');
  });

  it('식장 미정 및 추천 요청 시 해당 권역의 배웅 제휴 감면 장례식장이 함께 연계되어야 한다', () => {
    const result = awaitDispatch({
      locationDetail: '경기 성남시 분당구 야탑동 자택',
      funeralHallChoice: 'recommended'
    });

    expect(result.detectedRegion).toBe('경기도');
    expect(result.assignedDirector.name).toBe('최민석');
    expect(result.recommendedFuneralHall).toBeDefined();
    expect(result.recommendedFuneralHall?.discountRatePercentage).toBeGreaterThanOrEqual(10);
  });
});

function awaitDispatch(params: {
  locationDetail: string;
  hallName?: string;
  funeralHallChoice?: 'recommended' | 'designated';
}) {
  return EmergencyDispatchEngine.matchDispatch({
    deceasedLocationType: 'hospital',
    locationDetail: params.locationDetail,
    funeralHallChoice: params.funeralHallChoice || 'designated',
    hallName: params.hallName
  });
}
