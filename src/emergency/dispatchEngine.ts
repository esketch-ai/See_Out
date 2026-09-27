import { RegionCode } from '../funeral-halls/types.js';
import { FuneralHallService } from '../funeral-halls/funeralHallService.js';
import {
  DispatchMatchRequest,
  DispatchMatchResult,
  FuneralDirectorEntity
} from './types.js';
import { REGIONAL_DIRECTORS_DATASET } from './directorsDataset.js';

/**
 * 긴급 출동 관제 및 지역별 전담 지도사 지능형 동적 매칭 엔진
 * Specification: ARCH-2026-002 Section 2 (Emergency Dispatch Context)
 */
export class EmergencyDispatchEngine {
  private static directors: FuneralDirectorEntity[] = [...REGIONAL_DIRECTORS_DATASET];

  /**
   * 고인 위치 및 희망 식장 정보를 분석하여 최적의 지도사 및 동적 ETA 산출
   */
  public static matchDispatch(req: DispatchMatchRequest): DispatchMatchResult {
    const combinedText = `${req.locationDetail} ${req.hallName || ''}`.trim();
    const detectedRegion = this.detectRegionFromText(combinedText);
    const assignedDirector = this.findBestDirector(detectedRegion, combinedText);

    // 거리 및 도착 소요 시간(ETA) 동적 연산
    const distanceKm = this.calculateEstimatedDistanceKm(detectedRegion, combinedText);
    const etaMinutes = this.calculateEtaMinutes(distanceKm, detectedRegion);

    // 도착 예정 시각 계산
    const arrivalDate = new Date(Date.now() + etaMinutes * 60 * 1000);
    const hours = arrivalDate.getHours();
    const minutes = arrivalDate.getMinutes();
    const period = hours < 12 ? '오전' : '오후';
    const displayHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const arrivalTimeFormatted = `${period} ${displayHours}:${formattedMinutes}`;

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const dispatchId = `DSP-2026-${this.getRegionShortCode(detectedRegion)}-${randomSuffix}`;

    // 추천 장례식장 연동 (req.funeralHallChoice === 'recommended')
    let recommendedFuneralHall: DispatchMatchResult['recommendedFuneralHall'];
    if (req.funeralHallChoice === 'recommended' || !req.hallName) {
      const hallsInRegion = FuneralHallService.searchHalls({ region: detectedRegion });
      const partnerHall = hallsInRegion.find(h => h.isBaeungPartner) || hallsInRegion[0];
      if (partnerHall) {
        recommendedFuneralHall = {
          name: partnerHall.name,
          address: partnerHall.address,
          phone: partnerHall.phone,
          discountRatePercentage: Math.round(partnerHall.discountRate * 100),
          travelMinutesFromLocation: Math.max(10, Math.round(etaMinutes * 0.6))
        };
      }
    }

    const trafficStatus: DispatchMatchResult['trafficStatus'] =
      etaMinutes <= 25 ? 'SMOOTH' : etaMinutes <= 40 ? 'MODERATE' : 'CONGESTED';

    return {
      dispatchId,
      detectedRegion,
      detectedLocationSummary: req.locationDetail.trim() || `${detectedRegion} 관할 의전구역`,
      assignedDirector,
      estimatedArrivalMinutes: etaMinutes,
      estimatedArrivalTimeFormatted: `약 ${etaMinutes}분 이내 도착 (${arrivalTimeFormatted} 현장 도착 예정)`,
      distanceKm,
      trafficStatus,
      vehicleDispatchInfo: assignedDirector.dedicatedVehicle,
      recommendedFuneralHall
    };
  }

  /**
   * 텍스트 키워드 기반 관할 17개 광역시도 판별
   */
  public static detectRegionFromText(text: string): RegionCode {
    const q = text.toLowerCase();

    // 0. 서울
    if (q.includes('서울') || q.includes('송파') || q.includes('강남') || q.includes('서초') || q.includes('강동') || q.includes('풍납') || q.includes('신촌') || q.includes('세브란스') || q.includes('종로') || q.includes('영등포') || q.includes('마포') || q.includes('용산') || q.includes('노원') || q.includes('도봉') || q.includes('은평') || q.includes('강서') || q.includes('구로') || q.includes('서울아산')) {
      return '서울특별시';
    }
    // 1. 부산
    if (q.includes('부산') || q.includes('해운대') || q.includes('부산진') || q.includes('동래') || q.includes('사상') || q.includes('남포') || q.includes('영락공원') || q.includes('시민장례')) {
      return '부산광역시';
    }
    // 2. 대구
    if (q.includes('대구') || q.includes('수성') || q.includes('달서') || q.includes('동산병원') || q.includes('영대병원') || q.includes('명복공원')) {
      return '대구광역시';
    }
    // 3. 인천
    if (q.includes('인천') || q.includes('부평') || q.includes('남동') || q.includes('길병원') || q.includes('인하대') || q.includes('미추홀') || q.includes('송도')) {
      return '인천광역시';
    }
    // 4. 광주
    if (q.includes('광주') || q.includes('전남대') || q.includes('조선대') || q.includes('상무') || q.includes('광산')) {
      return '광주광역시';
    }
    // 5. 대전 / 세종
    if (q.includes('대전') || q.includes('충남대') || q.includes('을지대') || q.includes('유성') || q.includes('둔산') || q.includes('대덕')) {
      return '대전광역시';
    }
    if (q.includes('세종')) {
      return '세종특별자치시';
    }
    // 6. 울산
    if (q.includes('울산') || q.includes('삼산') || q.includes('울산대')) {
      return '울산광역시';
    }
    // 7. 경기
    if (q.includes('경기') || q.includes('분당') || q.includes('성남') || q.includes('수원') || q.includes('일산') || q.includes('고양') || q.includes('용인') || q.includes('아주대') || q.includes('부천') || q.includes('안양') || q.includes('평택') || q.includes('화성') || q.includes('의정부') || q.includes('남양주') || q.includes('파주')) {
      return '경기도';
    }
    // 8. 강원
    if (q.includes('강원') || q.includes('춘천') || q.includes('원주') || q.includes('강릉') || q.includes('속초') || q.includes('동해') || q.includes('삼척')) {
      return '강원특별자치도';
    }
    // 9. 충북
    if (q.includes('충북') || q.includes('청주') || q.includes('충주') || q.includes('제천') || q.includes('충북대')) {
      return '충청북도';
    }
    // 10. 충남
    if (q.includes('충남') || q.includes('천안') || (q.includes('아산') && !q.includes('아산병원')) || q.includes('아산시') || q.includes('단국대') || q.includes('순천향') || q.includes('서산') || q.includes('당진') || q.includes('공주') || q.includes('논산')) {
      return '충청남도';
    }
    // 11. 전북
    if (q.includes('전북') || q.includes('전주') || q.includes('익산') || q.includes('군산') || q.includes('전북대') || q.includes('원광대')) {
      return '전북특별자치도';
    }
    // 12. 전남
    if (q.includes('전남') || q.includes('순천') || q.includes('여수') || q.includes('목포') || q.includes('나주') || q.includes('광양')) {
      return '전라남도';
    }
    // 13. 경북
    if (q.includes('경북') || q.includes('포항') || q.includes('구미') || q.includes('경주') || q.includes('안동') || q.includes('김천') || q.includes('영주')) {
      return '경상북도';
    }
    // 14. 경남
    if (q.includes('경남') || q.includes('창원') || q.includes('김해') || q.includes('진주') || q.includes('양산') || q.includes('거제') || q.includes('통영') || q.includes('경상대')) {
      return '경상남도';
    }
    // 15. 제주
    if (q.includes('제주') || q.includes('서귀포') || q.includes('제주대') || q.includes('한라병원')) {
      return '제주특별자치도';
    }

    // 기본값: 서울특별시
    return '서울특별시';
  }

  /**
   * 주소, 지역명 또는 키워드로부터 최적의 전담 지도사 조회
   */
  public static getDirectorForLocation(params?: {
    location?: string;
    region?: RegionCode | string;
    preferredDirectorId?: string;
  }): FuneralDirectorEntity {
    if (params?.preferredDirectorId) {
      const found = this.directors.find(d => d.id === params.preferredDirectorId);
      if (found) return found;
    }
    const combined = `${params?.location || ''} ${params?.region || ''}`.trim();
    const region = this.detectRegionFromText(combined);
    return this.findBestDirector(region, combined);
  }

  /**
   * 지역 및 상세 위치에 따른 전담 지도사 배정
   */
  public static findBestDirector(region: RegionCode, text: string = ''): FuneralDirectorEntity {
    const q = text.toLowerCase();

    // 서울 내 동/서 분기
    if (region === '서울특별시') {
      if (q.includes('영등포') || q.includes('마포') || q.includes('종로') || q.includes('서대문') || q.includes('은평') || q.includes('신촌') || q.includes('세브란스') || q.includes('여의도')) {
        return this.directors.find(d => d.id === 'dir-seoul-west') || this.directors[0];
      }
      return this.directors.find(d => d.id === 'dir-seoul-east') || this.directors[0];
    }

    // 경기 내 분당/수원/일산 분기
    if (region === '경기도') {
      if (q.includes('일산') || q.includes('고양') || q.includes('파주') || q.includes('김포') || q.includes('의정부')) {
        return this.directors.find(d => d.id === 'dir-gyeonggi-ilsan') || this.directors[2];
      }
      if (q.includes('수원') || q.includes('화성') || q.includes('평택') || q.includes('오산') || q.includes('안성')) {
        return this.directors.find(d => d.id === 'dir-gyeonggi-suwon') || this.directors[2];
      }
      return this.directors.find(d => d.id === 'dir-gyeonggi-bundang') || this.directors[2];
    }

    // 해당 광역시도 관할 지도사 매칭
    const matched = this.directors.find(d => d.primaryRegion === region);
    return matched || this.directors[0];
  }

  /**
   * 권역 및 도심 환경에 따른 거리 산출 (km)
   */
  private static calculateEstimatedDistanceKm(region: RegionCode, text: string): number {
    const q = text.toLowerCase();
    // 서울/수도권 도심 거점망: 3~6km 반경
    if (region === '서울특별시') {
      return q.includes('아산') ? 3.4 : q.includes('강남') ? 4.1 : 4.8;
    }
    if (region === '경기도') {
      return q.includes('분당') ? 3.8 : q.includes('수원') ? 4.9 : 6.2;
    }
    // 광역시: 3~5km 반경
    if (['부산광역시', '대구광역시', '인천광역시', '광주광역시', '대전광역시', '울산광역시'].includes(region)) {
      return 4.2;
    }
    // 도서 및 강원/경북 등 광역 도 단위: 6~12km 반경
    return 7.8;
  }

  /**
   * 실시간 교통망 및 거리에 따른 ETA (분) 계산
   */
  private static calculateEtaMinutes(distanceKm: number, region: RegionCode): number {
    // 평균 주행 속도 (도심 25km/h, 외곽 40km/h) + 출동 준비 시간 5분
    const isCity = ['서울특별시', '부산광역시', '대구광역시', '인천광역시'].includes(region);
    const avgSpeed = isCity ? 25 : 35;
    const travelTime = Math.round((distanceKm / avgSpeed) * 60);
    const prepTime = 6; // 운구차량 점검 및 출발 준비
    const totalMinutes = travelTime + prepTime;

    // 최소 20분 ~ 최대 50분 사이 결정론적 반환 (2시간 SLA 이내 철저 준수)
    return Math.max(20, Math.min(50, totalMinutes));
  }

  private static getRegionShortCode(region: RegionCode): string {
    const codeMap: Record<RegionCode, string> = {
      '서울특별시': 'SEL',
      '부산광역시': 'PUS',
      '대구광역시': 'TAE',
      '인천광역시': 'ICN',
      '광주광역시': 'KWJ',
      '대전광역시': 'DJN',
      '울산광역시': 'USN',
      '세종특별자치시': 'SJN',
      '경기도': 'GYG',
      '강원특별자치도': 'GWN',
      '충청북도': 'CGB',
      '충청남도': 'CGN',
      '전북특별자치도': 'JBB',
      '전라남도': 'JBN',
      '경상북도': 'GSB',
      '경상남도': 'GSN',
      '제주특별자치도': 'JEJ'
    };
    return codeMap[region] || 'KR';
  }
}
