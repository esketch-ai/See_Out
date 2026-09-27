import { AffiliatePartnerEntity } from './types.js';

/**
 * 사업계획서 4.4절 기준 입점 자격 심사를 통과한 공식 부가 제휴사 데이터셋
 * - 지자체 인허가 필증 검증 완료
 * - 과장 광고("최저가", "마감임박") 필터링 통과
 * - 정액제 광고(월 25만~30만원) 및 알선 수수료 0원 원칙 준수
 */
export const AFFILIATE_PARTNERS_DATASET: AffiliatePartnerEntity[] = [
  // ── 1. 봉안시설 (납골당) ──
  {
    id: 'aff-colum-bundang',
    category: 'COLUMBARIUM',
    categoryName: '실내 봉안당',
    name: '분당 메모리얼파크 실내 봉안당',
    region: '경기도',
    address: '경기도 성남시 분당구 새마을로 210 (야탑동)',
    phone: '031-704-6501',
    licenseNumber: '제2012-성남분당-사설봉안-04호',
    licenseType: '「장사 등에 관한 법률」 제15조 사설봉안시설 설치신고 필증',
    isVerified: true,
    verifiedDate: '2026년 08월 15일',
    pricingInfo: [
      { name: '개인 안치단 (눈높이 4단 로열층)', price: 4_500_000, unit: '영구 안치', description: '항온항습 무결점 보존실' },
      { name: '부부 합장 안치단 (3~5단)', price: 8_500_000, unit: '영구 안치', description: '부부 동시 모심 전용단' },
      { name: '연간 시설 관리비', price: 60_000, unit: '1년', description: 'CCTV 및 24시간 공조 관리' }
    ],
    prohibitedKeywordCheckPassed: true,
    adPricingModel: 'FIXED_FLAT_RATE',
    monthlyAdFee: 300_000,
    features: ['분당선 야탑역 셔틀 운행', '24시간 무인 보안 시스템', '사계절 온습도 정밀 제어', '유족 전용 추모 예배실']
  },
  {
    id: 'aff-colum-yongin',
    category: 'COLUMBARIUM',
    categoryName: '실내 봉안당',
    name: '용인 로뎀파크 봉안당',
    region: '경기도',
    address: '경기도 용인시 처인구 양지면 주북로 120',
    phone: '031-338-9900',
    licenseNumber: '제2015-용인처인-사설봉안-11호',
    licenseType: '「장사 등에 관한 법률」 제15조 사설봉안시설 설치신고 필증',
    isVerified: true,
    verifiedDate: '2026년 08월 20일',
    pricingInfo: [
      { name: '개인단 (일반 2~6단)', price: 3_500_000, unit: '영구 안치', description: '자연 채광 통풍 구조' },
      { name: '부부단 (중앙홀 4단)', price: 7_000_000, unit: '영구 안치', description: '황금 동판 장정' },
      { name: '연간 시설 관리비', price: 55_000, unit: '1년', description: '조경 및 시설 유지보수' }
    ],
    prohibitedKeywordCheckPassed: true,
    adPricingModel: 'FIXED_FLAT_RATE',
    monthlyAdFee: 250_000,
    features: ['양지IC 5분 거리 접근성', '호수 조망 야외 테라스', '종교별 제례실 완비']
  },

  // ── 2. 수목장림 (자연장지) ──
  {
    id: 'aff-woodland-yangpyeong',
    category: 'WOODLAND_BURIAL',
    categoryName: '수목장림 자연장지',
    name: '양평 푸른숲 수목장림',
    region: '경기도',
    address: '경기도 양평군 양동면 양동로 420',
    phone: '031-774-8833',
    licenseNumber: '제2018-양평-자연장지-02호',
    licenseType: '「장사 등에 관한 법률」 제16조 및 「산림자원법」 사설자연장지 허가증',
    isVerified: true,
    verifiedDate: '2026년 09월 01일',
    pricingInfo: [
      { name: '공동목 (소나무 한 그루 4위 모심)', price: 2_500_000, unit: '1위 기준 (영구)', description: '소나무 자연 회귀' },
      { name: '개인 지정목 (주목·단풍나무)', price: 5_000_000, unit: '1위 지정목 (영구)', description: '고인 전용 표지석 포함' },
      { name: '가족 추모목 (소나무 대경목 4~8위)', price: 12_000_000, unit: '가족목 1주 (영구)', description: '3대 가족 선산형 수목' }
    ],
    prohibitedKeywordCheckPassed: true,
    adPricingModel: 'FIXED_FLAT_RATE',
    monthlyAdFee: 300_000,
    features: ['100년 수령 적송 군락지', '친환경 생분해 유골함 사용', '완만한 경사로 휠체어 산책로', '산림청 인증 관리']
  },
  {
    id: 'aff-woodland-paju',
    category: 'WOODLAND_BURIAL',
    categoryName: '수목장림 자연장지',
    name: '파주 서현 추모공원 잔디·수목장',
    region: '경기도',
    address: '경기도 파주시 광탄면 보광로 542',
    phone: '031-948-2233',
    licenseNumber: '제2019-파주-자연장지-07호',
    licenseType: '「장사 등에 관한 법률」 제16조 사설자연장지 설치신고 필증',
    isVerified: true,
    verifiedDate: '2026년 09월 05일',
    pricingInfo: [
      { name: '평장 잔디장 (개인 1위)', price: 1_800_000, unit: '1위 잔디 평장 (영구)', description: '천연 화강석 명패' },
      { name: '부부 수목장 (주목나무)', price: 6_500_000, unit: '2위 모심 (영구)', description: '사계절 푸른 상록목' }
    ],
    prohibitedKeywordCheckPassed: true,
    adPricingModel: 'FIXED_FLAT_RATE',
    monthlyAdFee: 250_000,
    features: ['서울 구파발 30분 거리', '정남향 배산임수 명당 터', '연중 무휴 관리사무소 운영']
  },

  // ── 3. 유품정리 (특수청소·폐기물 수집운반) ──
  {
    id: 'aff-clearing-baeung',
    category: 'ESTATE_CLEARING',
    categoryName: '유품정리 및 특수케어',
    name: '배웅 안심 유품정리 케어단',
    region: '서울특별시',
    address: '서울특별시 마포구 마포대로 130 본관',
    phone: '02-710-1588',
    licenseNumber: '제2021-서울마포-폐기물수집운반-51호',
    licenseType: '「폐기물관리법」 제25조 사업장생활계·생활폐기물 수집·운반업 정식 허가증',
    isVerified: true,
    verifiedDate: '2026년 09월 10일',
    pricingInfo: [
      { name: '원룸·소형 평형 (10~15평 기준)', price: 650_000, unit: '1회 작업 완결', description: '유품 소각 선별 + 폐기물 전량 수거' },
      { name: '아파트 표준형 (25~32평 기준)', price: 1_400_000, unit: '1회 작업 완결', description: '생활용품 분류 + 가구 반출 + 기본 탈취' },
      { name: '공간 살균 및 피톤치드 탈취 소독', price: 200_000, unit: '1회 옵션', description: '전문 방역 소독기 방제' }
    ],
    prohibitedKeywordCheckPassed: true,
    adPricingModel: 'FIXED_FLAT_RATE',
    monthlyAdFee: 300_000,
    features: ['폐기물 인허가 차량 직영 운행', '고인 유품 경건한 봉투 봉인 전달', '추가 견적 요구 없는 정찰 견적', '완료 후 현장 사진 리포트 전송']
  },
  {
    id: 'aff-clearing-sweepers',
    category: 'ESTATE_CLEARING',
    categoryName: '유품정리 및 특수케어',
    name: '스위퍼스 바이오 특수방역 정리',
    region: '경기도',
    address: '경기도 하남시 미사강변서로 25',
    phone: '1800-8824',
    licenseNumber: '제2020-경기하남-폐기물수집운반-88호',
    licenseType: '「폐기물관리법」 제25조 폐기물 수집·운반업 및 감염병예방법 소독업 허가',
    isVerified: true,
    verifiedDate: '2026년 09월 12일',
    pricingInfo: [
      { name: '특수 오염 정밀 방역 및 소독', price: 900_000, unit: '기본 1회', description: '바이오 케어 전문 약품 시공' },
      { name: '주택 전량 유품 정리 (20평형대)', price: 1_200_000, unit: '전량 반출', description: '재활용·소각 구분 적법 처리' }
    ],
    prohibitedKeywordCheckPassed: true,
    adPricingModel: 'FIXED_FLAT_RATE',
    monthlyAdFee: 250_000,
    features: ['특수청소 전문가 국가공인 방역 자격', '경찰청·지자체 공식 위탁 협력사', '완벽한 악취 제거 보증']
  }
];
