/**
 * 배웅(BAEUNG) 1단계 사업계획서 3.2절(프리미엄 숏폼 제작·배포 대행) 및 7.2절(숏폼 지표 활용)
 * 숏폼 콘텐츠 제작 대행 및 플랫폼 성과 데이터 모델
 */

export type ShortformTheme =
  | 'FAMILY_FUNERAL_GUIDE'   // 가족장·간소화 장례 절차 가이드
  | 'HALL_VIRTUAL_TOUR'      // 장례식장 시설 및 정갈한 분향실 랜선 투어
  | 'ETIQUETTE_DRESS_CODE'   // 현대적 조문 예절 및 복장 가이드
  | 'DIRECT_CREMATION_CHECK';// 무빈소 직송 사전 준비 체크리스트

export type ShortformPlatform = 'YOUTUBE_SHORTS' | 'INSTAGRAM_REELS' | 'TIKTOK';

export interface ShortformMetrics {
  views: number;               // 누적 조회수 (과거 집행 실제 평균치)
  likes: number;               // 좋아요 수
  comments: number;            // 댓글 수
  shares: number;              // 공유 수
  engagementRate: number;      // 참여율 (%)
  profileClicks: number;       // 프로필 링크 클릭 수 (유입 전환)
}

export interface ShortformContentEntity {
  id: string;                  // 고유 ID (예: "sf-seoul-asan-01")
  hallId?: string;             // 매칭 장례식장 ID (선택)
  hallName: string;            // 대상 장례식장 명칭
  title: string;               // 숏폼 제목
  theme: ShortformTheme;       // 주제 분류
  themeLabel: string;          // 주제 한글 표시명
  durationSeconds: number;     // 영상 길이 (초 단위, 30~60초)
  platforms: ShortformPlatform[];// 배포 플랫폼
  metrics: ShortformMetrics;   // 트래킹 성과 지표
  scriptSummary: string;       // 시나리오 요약
  captionTemplate: string;     // 게시 본문 캡션 템플릿
  thumbnailGradient: string;   // 비주얼 그라디언트 톤
  publishedDate: string;       // 배포 일자
  complianceDisclaimer: string;// 표시광고법 준수 고지 (보장 표현 금지)
}

export interface ShortformProductionRequest {
  requestId: string;
  hallId: string;
  hallName: string;
  applicantRole: string;       // 신청인 직책 (대표, 사무장 등)
  applicantPhone: string;
  selectedThemes: ShortformTheme[]; // 제작 희망 주제
  targetPlatforms: ShortformPlatform[]; // 배포 희망 플랫폼
  filmingPreference: 'VISIT_FILMING' | 'ASSET_PROVIDED'; // 현장 방문 촬영 vs 기존 사진/영상 제공
  preferredDate?: string;
  status: 'SUBMITTED' | 'REVIEWING' | 'SCHEDULED' | 'PRODUCED';
  submittedAt: string;
}

export interface ShortformAggregateOverview {
  totalProducedCount: number;  // 누적 제작 편수
  avgViewsPerVideo: number;    // 편당 평균 조회수
  avgEngagementRate: number;   // 평균 참여율 (%)
  totalProfileClicks: number;  // 총 프로필 링크 클릭 수
  topPerformingPlatform: string;// 최고 성과 플랫폼
}
