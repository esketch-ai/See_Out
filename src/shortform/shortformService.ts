import {
  ShortformContentEntity,
  ShortformProductionRequest,
  ShortformTheme,
  ShortformAggregateOverview
} from './types.js';

/**
 * 배웅(BAEUNG) 1단계 사업계획서 3.2절(숏폼 제작·배포 대행) 및 7.2절(숏폼 지표 활용)
 * - 장례 준비 가이드 등 정보성 숏폼 콘텐츠 포트폴리오
 * - 유튜브·인스타그램·틱톡 플랫폼 연계 성과 지표
 * - 표시광고법 대응: 성과 "보장" 표현 배제 및 실제 평균치 기반 안내
 */
export class ShortformService {
  // 공식 숏폼 콘텐츠 포트폴리오 데이터셋 (시범 권역 4대 테마)
  private static portfolio: ShortformContentEntity[] = [
    {
      id: 'sf-guide-family-01',
      hallName: '서울아산병원장례식장 & 배웅 협업',
      title: '조문객 50명, 가족장으로 품격 있게 치르는 법 (준비 3단계)',
      theme: 'FAMILY_FUNERAL_GUIDE',
      themeLabel: '가족장 절차 가이드',
      durationSeconds: 48,
      platforms: ['YOUTUBE_SHORTS', 'INSTAGRAM_REELS'],
      metrics: {
        views: 34_200,
        likes: 1_280,
        comments: 142,
        shares: 310,
        engagementRate: 5.1,
        profileClicks: 420
      },
      scriptSummary:
        '1) 부고 범위 결정 ➔ 2) 30평형 소규모 빈소 선택 ➔ 3) 정찰제 시설비 절감 노하우를 48초 동안 차분한 톤으로 전달',
      captionTemplate:
        '가족장도 품격 있게. 불필요한 거품 없이 고인을 온전히 기리는 배웅 정찰제 가족장 안내 #장례준비 #가족장 #배웅',
      thumbnailGradient: 'from-[#19382C] to-[#2D4F43]',
      publishedDate: '2026-09-15',
      complianceDisclaimer: '※ 과거 집행 채널의 실제 평균 지표이며, 미래의 조회수를 단정적으로 보장하지 않습니다.'
    },
    {
      id: 'sf-tour-seongnam-02',
      hallName: '성남시의료원장례식장 랜선 투어',
      title: '공공의료원 분향실 실물 최초 공개! 1일 임대료와 시설 제원 총정리',
      theme: 'HALL_VIRTUAL_TOUR',
      themeLabel: '시설 랜선 투어',
      durationSeconds: 54,
      platforms: ['YOUTUBE_SHORTS', 'INSTAGRAM_REELS', 'TIKTOK'],
      metrics: {
        views: 41_800,
        likes: 1_920,
        comments: 215,
        shares: 530,
        engagementRate: 6.4,
        profileClicks: 680
      },
      scriptSummary:
        '성남 원도심 중심에 위치한 현대식 분향실, 안치실, 주차장 동선을 공인 장례지도사가 직접 걸으며 54초 만에 브리핑',
      captionTemplate:
        '성남·분당 시민을 위한 투명한 공공 장례식장 랜선 투어. e하늘 공시 정찰 가격을 직접 확인하세요 #성남시의료원 #장례식장투어',
      thumbnailGradient: 'from-[#141618] to-[#1F2226]',
      publishedDate: '2026-09-18',
      complianceDisclaimer: '※ 본 영상은 정보성 시설 안내 콘텐츠로, 특정 성과를 사전에 보장하지 않습니다.'
    },
    {
      id: 'sf-etiquette-modern-03',
      hallName: '전국 공통 조문 에티켓 가이드',
      title: '“부의 봉투 이름은 어디에?” 2030·초보 상주가 가장 많이 틀리는 3가지',
      theme: 'ETIQUETTE_DRESS_CODE',
      themeLabel: '현대적 조문 예절',
      durationSeconds: 42,
      platforms: ['YOUTUBE_SHORTS', 'INSTAGRAM_REELS', 'TIKTOK'],
      metrics: {
        views: 58_900,
        likes: 3_450,
        comments: 388,
        shares: 920,
        engagementRate: 8.1,
        profileClicks: 510
      },
      scriptSummary:
        '봉투 작성법, 헌화 방식, 공수(절할 때 손 위치)를 그래픽과 실제 시연으로 42초 압축 설명',
      captionTemplate:
        '갑작스러운 부고에도 당황하지 않도록. 현대적 조문 예절 1분 마스터 가이드 #조문예절 #장례문화 #배웅',
      thumbnailGradient: 'from-[#2D4F43] to-[#19382C]',
      publishedDate: '2026-09-20',
      complianceDisclaimer: '※ 플랫폼 알고리즘 및 시청 행태에 따라 실제 노출 수는 달라질 수 있습니다.'
    },
    {
      id: 'sf-direct-cremation-04',
      hallName: '수도권 직송 무빈소 가이드',
      title: '빈소 없이 120만 원대로? 무빈소 장례가 늘어나는 3가지 현실적 이유',
      theme: 'DIRECT_CREMATION_CHECK',
      themeLabel: '무빈소 체크리스트',
      durationSeconds: 50,
      platforms: ['YOUTUBE_SHORTS', 'INSTAGRAM_REELS'],
      metrics: {
        views: 31_500,
        likes: 1_150,
        comments: 198,
        shares: 280,
        engagementRate: 5.2,
        profileClicks: 390
      },
      scriptSummary:
        '안치실 보관부터 원지동 서울추모공원 승화원 이동까지, 무빈소 직송의 합법적 절차와 알뜰한 시설비 구성 안내',
      captionTemplate:
        '형식보다 애도에 집중하는 가족 중심 무빈소 장례. 배웅에서 투명한 정찰 명세를 확인하세요 #무빈소 #직송 #착한장례',
      thumbnailGradient: 'from-[#19382C] to-[#141618]',
      publishedDate: '2026-09-22',
      complianceDisclaimer: '※ 사업계획서 7.2절 준수: 과거 유사 콘텐츠 집행 결과 기준 통계치입니다.'
    }
  ];

  // 제작 대행 신청 접수 목록
  private static requests: ShortformProductionRequest[] = [
    {
      requestId: 'SFR-2026-0927-101',
      hallId: 'fh-seoul-gangnam-severance',
      hallName: '연세대학교 강남세브란스병원장례식장',
      applicantRole: '사무장',
      applicantPhone: '010-8899-1122',
      selectedThemes: ['HALL_VIRTUAL_TOUR', 'FAMILY_FUNERAL_GUIDE'],
      targetPlatforms: ['YOUTUBE_SHORTS', 'INSTAGRAM_REELS'],
      filmingPreference: 'VISIT_FILMING',
      preferredDate: '2026-10-08',
      status: 'SCHEDULED',
      submittedAt: '2026-09-27T10:30:00+09:00'
    }
  ];

  /**
   * 숏폼 포트폴리오 목록 조회
   */
  public static getPortfolio(theme?: ShortformTheme): ShortformContentEntity[] {
    if (!theme) return this.portfolio;
    return this.portfolio.filter((c) => c.theme === theme);
  }

  /**
   * 특정 ID의 숏폼 상세 조회
   */
  public static getContentById(id: string): ShortformContentEntity | undefined {
    return this.portfolio.find((c) => c.id === id);
  }

  /**
   * 숏폼 전체 누적 성과 요약 집계
   */
  public static getAggregateOverview(): ShortformAggregateOverview {
    const totalCount = this.portfolio.length;
    const totalViews = this.portfolio.reduce((sum, c) => sum + c.metrics.views, 0);
    const sumEngage = this.portfolio.reduce((sum, c) => sum + c.metrics.engagementRate, 0);
    const totalClicks = this.portfolio.reduce((sum, c) => sum + c.metrics.profileClicks, 0);

    return {
      totalProducedCount: totalCount,
      avgViewsPerVideo: totalCount > 0 ? Math.round(totalViews / totalCount) : 0,
      avgEngagementRate: totalCount > 0 ? Math.round((sumEngage / totalCount) * 10) / 10 : 0,
      totalProfileClicks: totalClicks,
      topPerformingPlatform: '유튜브 쇼츠 & 인스타그램 릴스 (참여율 6.2%)'
    };
  }

  /**
   * 숏폼 콘텐츠 제작 대행 신청 접수 (사업계획서 3.2절 번들 상품 연계)
   */
  public static submitProductionRequest(params: {
    hallId: string;
    hallName: string;
    applicantRole: string;
    applicantPhone: string;
    selectedThemes: ShortformTheme[];
    targetPlatforms: ShortformContentEntity['platforms'];
    filmingPreference?: 'VISIT_FILMING' | 'ASSET_PROVIDED';
    preferredDate?: string;
  }): ShortformProductionRequest {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const requestId = `SFR-2026-${randomSuffix}`;

    const req: ShortformProductionRequest = {
      requestId,
      hallId: params.hallId,
      hallName: params.hallName,
      applicantRole: params.applicantRole.trim(),
      applicantPhone: params.applicantPhone.trim(),
      selectedThemes: params.selectedThemes.length > 0 ? params.selectedThemes : ['HALL_VIRTUAL_TOUR'],
      targetPlatforms: params.targetPlatforms.length > 0 ? params.targetPlatforms : ['YOUTUBE_SHORTS', 'INSTAGRAM_REELS'],
      filmingPreference: params.filmingPreference || 'VISIT_FILMING',
      preferredDate: params.preferredDate,
      status: 'SUBMITTED',
      submittedAt: new Date().toISOString()
    };

    this.requests.push(req);
    return req;
  }

  /**
   * 전체 제작 신청 목록 조회
   */
  public static getAllRequests(): ShortformProductionRequest[] {
    return this.requests;
  }

  /**
   * 표시광고법 제재 방어 검증 (사업계획서 7.2절)
   * 숏폼 홍보 문구 내에 단정적 성과 "보장" 표현이 없는지 검사
   */
  public static validateComplianceCopy(text: string): {
    isValid: boolean;
    prohibitedWord?: string;
  } {
    const prohibited = ['100% 보장', '조회수 보장', '무조건 성약', '매출 10배 보장', '독점 1위'];
    for (const word of prohibited) {
      if (text.includes(word)) {
        return { isValid: false, prohibitedWord: word };
      }
    }
    return { isValid: true };
  }
}
