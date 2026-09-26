import { FuneralHallEntity, RegionalStat } from './types.js';

/**
 * 전국 17개 시·도별 장례식장 등록 통계 (총 1,060개소)
 * 출처: 구글 문서 『전국 장례식장 현황 및 장사 인프라 종합 분석 보고서』
 */
export const REGIONAL_STATISTICS: RegionalStat[] = [
  { region: '서울특별시', registeredCount: 61, keyClusterNotes: '상급종합병원 부설 중심, 고밀도 분향실 및 입체 주차타워 집중' },
  { region: '부산광역시', registeredCount: 55, keyClusterNotes: '부산진구·동래구 중심 전문 장례타운 발달, 안치실 대형화' },
  { region: '대구광역시', registeredCount: 59, keyClusterNotes: '달서구(14곳), 북구(12곳) 중심의 도심 복합 전문시설 집중' },
  { region: '인천광역시', registeredCount: 35, keyClusterNotes: '계양구, 미추홀구, 부평구 등 종합병원 및 독립 장례식장 혼재' },
  { region: '광주광역시', registeredCount: 26, keyClusterNotes: '서구 매월동 대규모 장례타운 집적화 및 광산구 전문시설' },
  { region: '대전광역시', registeredCount: 19, keyClusterNotes: '서구(7곳), 중구(5곳) 등 도심 종합병원 부설 위주 배치' },
  { region: '울산광역시', registeredCount: 17, keyClusterNotes: '남구(8곳), 울주군(3곳), 중구(3곳) 중심의 산업단지 배후형' },
  { region: '세종특별자치시', registeredCount: 6, keyClusterNotes: '은하수공원 등 광역 공설 복합 장사시설 중심 운영' },
  { region: '경기도', registeredCount: 183, keyClusterNotes: '안산(13곳), 화성(12곳), 평택·파주(각 10곳) 등 전역 분산 (전국 1위)' },
  { region: '강원특별자치도', registeredCount: 54, keyClusterNotes: '원주(7곳), 강릉(6곳), 춘천(5곳) 및 군 단위 공설시설 중심' },
  { region: '충청북도', registeredCount: 50, keyClusterNotes: '충주(8곳), 청주(6곳), 음성(4곳), 괴산(3곳) 등 거점 분산' },
  { region: '충청남도', registeredCount: 74, keyClusterNotes: '천안(11곳), 아산·논산(각 7곳), 공주·서천(각 6곳) 분포' },
  { region: '전북특별자치도', registeredCount: 73, keyClusterNotes: '익산(10곳), 정읍(9곳), 전주(6곳), 군산(6곳) 거점 집적' },
  { region: '전라남도', registeredCount: 124, keyClusterNotes: '목포(17곳), 나주(12곳), 보성(7곳), 순천·여수(각 6곳) 광역 분산' },
  { region: '경상북도', registeredCount: 121, keyClusterNotes: '경주·경산(각 9곳), 의성(8곳), 포항(5곳) 등 중소도시 및 군 단위' },
  { region: '경상남도', registeredCount: 114, keyClusterNotes: '김해(13곳), 사천(10곳), 진주(9곳), 밀양·하동(각 6곳) 밀집' },
  { region: '제주특별자치도', registeredCount: 9, keyClusterNotes: '제주시 도심 종합병원 및 서귀포 공설·전문시설 배치' }
];

/**
 * 구글 독스 원문에서 정밀 추출한 전국 권역별 대표 장례식장 데이터셋
 * 카파시 2원칙: Minimal Viable Baseline Dataset
 */
export const FUNERAL_HALLS_DATASET: FuneralHallEntity[] = [
  // --- 수도권 (서울) ---
  {
    id: 'fh-seoul-asan',
    name: '서울아산병원장례식장',
    region: '서울특별시',
    subRegion: '송파구',
    address: '서울 송파구 올림픽로43길 88 (풍납동)',
    phone: '02-3010-2000',
    roomCount: 18,
    capacityCount: 28,
    category: 'TERTIARY_HOSPITAL',
    parking: '광역 지하주차장 (대형)',
    conveniences: ['카페테리아', '개별 휴게실', '유족 전용 수면실', '고급 식당가'],
    isBaeungPartner: false,
    discountRate: 0,
    dailyRentEstimate: 1_850_000
,
    latitude: 37.5255,
    longitude: 127.1084,
    nearestSubway: '8호선 강동구청역 (도보 12분) / 2호선 잠실나루역 셔틀',
    nearestCrematorium: '서울추모공원 (원지동)',
    crematoriumDistanceKm: 18.5,
    crematoriumTravelMinutes: 25,
    roomTypes: [
      {
            name: "소형 (35평형)",
            pyeong: 35,
            dailyPrice: 1200000,
            recommendedGuests: "가족장 / 50명 내외"
      },
      {
            name: "중형 (55평형)",
            pyeong: 55,
            dailyPrice: 1850000,
            recommendedGuests: "일반 조문 150명 내외"
      },
      {
            name: "특실 (85평형)",
            pyeong: 85,
            dailyPrice: 2700000,
            recommendedGuests: "대형 조문 250명 이상"
      },
      {
            name: "VIP실 (130평형)",
            pyeong: 130,
            dailyPrice: 3900000,
            recommendedGuests: "사회장·의전 전용"
      }
]  },
  {
    id: 'fh-seoul-samsung',
    name: '삼성서울병원장례식장',
    region: '서울특별시',
    subRegion: '강남구',
    address: '서울 강남구 일원로 81 (일원동)',
    phone: '02-3410-3151',
    roomCount: 15,
    capacityCount: 24,
    category: 'TERTIARY_HOSPITAL',
    parking: '원내 대형 지하주차장',
    conveniences: ['유족 전용 숙면실', '고급 접객 식당', '상가 매점'],
    isBaeungPartner: false,
    discountRate: 0,
    dailyRentEstimate: 1_900_000
,
    latitude: 37.4882,
    longitude: 127.0856,
    nearestSubway: '3호선 일원역 1번 출구 (도보 5분)',
    nearestCrematorium: '서울추모공원 (원지동)',
    crematoriumDistanceKm: 12,
    crematoriumTravelMinutes: 18,
    roomTypes: [
      {
            name: "소형 (38평형)",
            pyeong: 38,
            dailyPrice: 1250000,
            recommendedGuests: "가족장 / 50명 내외"
      },
      {
            name: "중형 (60평형)",
            pyeong: 60,
            dailyPrice: 1900000,
            recommendedGuests: "일반 조문 150명 내외"
      },
      {
            name: "특실 (90평형)",
            pyeong: 90,
            dailyPrice: 2850000,
            recommendedGuests: "대형 조문 250명 이상"
      },
      {
            name: "VIP실 (140평형)",
            pyeong: 140,
            dailyPrice: 4200000,
            recommendedGuests: "의전 전용"
      }
]  },
  {
    id: 'fh-seoul-stmary',
    name: '서울성모장례식장',
    region: '서울특별시',
    subRegion: '서초구',
    address: '서울 서초구 반포대로 222 (반포동)',
    phone: '02-2258-5940',
    roomCount: 14,
    capacityCount: 20,
    category: 'TERTIARY_HOSPITAL',
    parking: '지상·지하 통합 주차장',
    conveniences: ['VIP 전용 접객구역', '종교 분향실', '전문 식음서비스'],
    isBaeungPartner: false,
    discountRate: 0,
    dailyRentEstimate: 1_750_000
,
    latitude: 37.502,
    longitude: 127.0048,
    nearestSubway: '3·7·9호선 고속터미널역 (도보 8분)',
    nearestCrematorium: '서울추모공원 (원지동)',
    crematoriumDistanceKm: 10.5,
    crematoriumTravelMinutes: 16,
    roomTypes: [
      {
            name: "소형 (35평형)",
            pyeong: 35,
            dailyPrice: 1150000,
            recommendedGuests: "가족장 / 50명 내외"
      },
      {
            name: "중형 (55평형)",
            pyeong: 55,
            dailyPrice: 1750000,
            recommendedGuests: "일반 조문 150명 내외"
      },
      {
            name: "특실 (80평형)",
            pyeong: 80,
            dailyPrice: 2600000,
            recommendedGuests: "대형 조문 200명 이상"
      },
      {
            name: "VIP실 (120평형)",
            pyeong: 120,
            dailyPrice: 3800000,
            recommendedGuests: "VIP 전용"
      }
]  },
  {
    id: 'fh-seoul-bohun',
    name: '중앙보훈병원장례식장',
    region: '서울특별시',
    subRegion: '강동구',
    address: '서울 강동구 진황도로61길 53 (둔촌동)',
    phone: '02-2225-1004',
    roomCount: 10,
    capacityCount: 16,
    category: 'PUBLIC_MUNICIPAL',
    parking: '대규모 옥외·지하 주차장',
    conveniences: ['상가 식당', '편의점', '국가유공자 예우실'],
    isBaeungPartner: true,
    discountRate: 0.20,
    dailyRentEstimate: 950_000
,
    latitude: 37.5292,
    longitude: 127.1478,
    nearestSubway: '9호선 중앙보훈병원역 2번 출구 (도보 3분)',
    nearestCrematorium: '성남영생관리사업소 (성남시립)',
    crematoriumDistanceKm: 19,
    crematoriumTravelMinutes: 28,
    roomTypes: [
      {
            name: "소형 (30평형)",
            pyeong: 30,
            dailyPrice: 650000,
            recommendedGuests: "국가유공자/가족장"
      },
      {
            name: "중형 (48평형)",
            pyeong: 48,
            dailyPrice: 950000,
            recommendedGuests: "일반 조문 100명 내외"
      },
      {
            name: "특실 (70평형)",
            pyeong: 70,
            dailyPrice: 1450000,
            recommendedGuests: "조문 180명 내외"
      }
]  },
  {
    id: 'fh-seoul-gangnam-severance',
    name: '연세대학교 강남장례식장',
    region: '서울특별시',
    subRegion: '강남구',
    address: '서울 강남구 언주로 211 (도곡동)',
    phone: '02-2019-4000',
    roomCount: 7,
    capacityCount: 12,
    category: 'TERTIARY_HOSPITAL',
    parking: '원내 기계식·자주식 주차장',
    conveniences: ['매점', '직영 식당', '상가 휴게공간'],
    isBaeungPartner: false,
    discountRate: 0,
    dailyRentEstimate: 1_500_000
,
    latitude: 37.4927,
    longitude: 127.0463,
    nearestSubway: '3호선 매봉역 2번 출구 (도보 10분) / 한티역',
    nearestCrematorium: '서울추모공원 (원지동)',
    crematoriumDistanceKm: 11.2,
    crematoriumTravelMinutes: 17,
    roomTypes: [
      {
            name: "소형 (35평형)",
            pyeong: 35,
            dailyPrice: 1000000,
            recommendedGuests: "가족장 40명 내외"
      },
      {
            name: "중형 (50평형)",
            pyeong: 50,
            dailyPrice: 1500000,
            recommendedGuests: "일반 조문 120명 내외"
      },
      {
            name: "특실 (75평형)",
            pyeong: 75,
            dailyPrice: 2200000,
            recommendedGuests: "대형 조문 200명 내외"
      }
]  },

  // --- 수도권 (경기/인천) ---
  {
    id: 'fh-gyeonggi-bundang-snu',
    name: '분당서울대학교병원장례식장',
    region: '경기도',
    subRegion: '성남시 분당구',
    address: '경기 성남시 분당구 구미로173번길 82',
    phone: '031-787-1500',
    roomCount: 11,
    capacityCount: 18,
    category: 'TERTIARY_HOSPITAL',
    parking: '입체 주차빌딩 완비',
    conveniences: ['24시간 매점', '식당가', '무인 정산기'],
    isBaeungPartner: false,
    discountRate: 0,
    dailyRentEstimate: 1_400_000
,
    latitude: 37.3518,
    longitude: 127.1232,
    nearestSubway: '수인분당선 미금역 3번 출구 (셔틀 5분)',
    nearestCrematorium: '성남영생관리사업소 (성남시립)',
    crematoriumDistanceKm: 14,
    crematoriumTravelMinutes: 20,
    roomTypes: [
      {
            name: "소형 (35평형)",
            pyeong: 35,
            dailyPrice: 900000,
            recommendedGuests: "가족장 50명 내외"
      },
      {
            name: "중형 (52평형)",
            pyeong: 52,
            dailyPrice: 1400000,
            recommendedGuests: "일반 조문 130명 내외"
      },
      {
            name: "특실 (80평형)",
            pyeong: 80,
            dailyPrice: 2100000,
            recommendedGuests: "대형 조문 200명 이상"
      }
]  },
  {
    id: 'fh-gyeonggi-seongnam-medical',
    name: '성남시의료원장례식장',
    region: '경기도',
    subRegion: '성남시 수정구',
    address: '경기 성남시 수정구 수정로171번길 10',
    phone: '031-738-7000',
    roomCount: 7,
    capacityCount: 12,
    category: 'PUBLIC_MUNICIPAL',
    parking: '공공 지하주차장',
    conveniences: ['공공 식당', '무인 정산기', '유족 쉼터'],
    isBaeungPartner: true,
    discountRate: 0.25,
    dailyRentEstimate: 650_000
,
    latitude: 37.4429,
    longitude: 127.1328,
    nearestSubway: '8호선 수진역 1번 출구 (도보 10분)',
    nearestCrematorium: '성남영생관리사업소 (성남시립)',
    crematoriumDistanceKm: 6.8,
    crematoriumTravelMinutes: 12,
    roomTypes: [
      {
            name: "소형 (32평형)",
            pyeong: 32,
            dailyPrice: 420000,
            recommendedGuests: "알뜰 가족장"
      },
      {
            name: "중형 (48평형)",
            pyeong: 48,
            dailyPrice: 650000,
            recommendedGuests: "표준 조문 100명"
      },
      {
            name: "특실 (65평형)",
            pyeong: 65,
            dailyPrice: 950000,
            recommendedGuests: "조문 150명"
      }
]  },
  {
    id: 'fh-gyeonggi-suwon-yeonhwajang',
    name: '수원시연화장장례식장',
    region: '경기도',
    subRegion: '수원시 영통구',
    address: '경기 수원시 영통구 광교호수로 278 (하동)',
    phone: '031-218-6560',
    roomCount: 10,
    capacityCount: 15,
    category: 'PUBLIC_MUNICIPAL',
    parking: '시영 대형 주차공간',
    conveniences: ['공설 매점', '식음시설', '화장장·봉안시설 연계'],
    isBaeungPartner: true,
    discountRate: 0.30,
    dailyRentEstimate: 600_000
,
    latitude: 37.2882,
    longitude: 127.0709,
    nearestSubway: '신분당선 광교중앙역 (차량 8분)',
    nearestCrematorium: '수원시연화장 승화원 (원내 복합 시설)',
    crematoriumDistanceKm: 0.1,
    crematoriumTravelMinutes: 1,
    roomTypes: [
      {
            name: "소형 (30평형)",
            pyeong: 30,
            dailyPrice: 380000,
            recommendedGuests: "가족장"
      },
      {
            name: "중형 (45평형)",
            pyeong: 45,
            dailyPrice: 600000,
            recommendedGuests: "표준 조문"
      },
      {
            name: "특실 (60평형)",
            pyeong: 60,
            dailyPrice: 850000,
            recommendedGuests: "대형 조문"
      }
]  },
  {
    id: 'fh-gyeonggi-ilsan-nhic',
    name: '국민건강보험공단일산병원장례식장',
    region: '경기도',
    subRegion: '고양시 일산동구',
    address: '경기 고양시 일산동구 일산로 100 (백석동)',
    phone: '031-900-0444',
    roomCount: 9,
    capacityCount: 14,
    category: 'PUBLIC_MUNICIPAL',
    parking: '지상·지하 주차장',
    conveniences: ['상가 전용 식당', '편의점'],
    isBaeungPartner: true,
    discountRate: 0.20,
    dailyRentEstimate: 800_000
,
    latitude: 37.6438,
    longitude: 126.7909,
    nearestSubway: '3호선 백석역 6번 출구 (도보 7분)',
    nearestCrematorium: '서울시립승화원 (벽제)',
    crematoriumDistanceKm: 15.2,
    crematoriumTravelMinutes: 22,
    roomTypes: [
      {
            name: "소형 (32평형)",
            pyeong: 32,
            dailyPrice: 520000,
            recommendedGuests: "가족장"
      },
      {
            name: "중형 (50평형)",
            pyeong: 50,
            dailyPrice: 800000,
            recommendedGuests: "일반 조문 100명"
      },
      {
            name: "특실 (70평형)",
            pyeong: 70,
            dailyPrice: 1200000,
            recommendedGuests: "대형 조문"
      }
]  },
  {
    id: 'fh-incheon-seongincheon',
    name: '(유)성인천장례식장',
    region: '인천광역시',
    subRegion: '미추홀구',
    address: '인천 미추홀구 석정로 6 (숭의동, 인천한방병원)',
    phone: '032-891-4444',
    roomCount: 9,
    capacityCount: 14,
    category: 'SPECIALIZED_INDEPENDENT',
    parking: '병원 주차시설 연계',
    conveniences: ['직영 식당 완비', '개별 휴게실'],
    isBaeungPartner: true,
    discountRate: 0.20,
    dailyRentEstimate: 750_000
,
    latitude: 37.4602,
    longitude: 126.6814,
    nearestSubway: '1호선 주안역 (도보 10분)',
    nearestCrematorium: '인천가족공원 승화원',
    crematoriumDistanceKm: 8.5,
    crematoriumTravelMinutes: 15,
    roomTypes: [
      {
            name: "소형 (30평형)",
            pyeong: 30,
            dailyPrice: 480000,
            recommendedGuests: "가족장"
      },
      {
            name: "중형 (48평형)",
            pyeong: 48,
            dailyPrice: 750000,
            recommendedGuests: "일반 조문 100명"
      },
      {
            name: "특실 (68평형)",
            pyeong: 68,
            dailyPrice: 1100000,
            recommendedGuests: "대형 조문"
      }
]  },

  // --- 영남권 (부산/대구/경북/경남) ---
  {
    id: 'fh-busan-simin',
    name: '(주)시민장례식장',
    region: '부산광역시',
    subRegion: '부산진구',
    address: '부산 부산진구 자유평화로 31 (범천동)',
    phone: '051-636-4444',
    roomCount: 18,
    capacityCount: 34,
    category: 'SPECIALIZED_INDEPENDENT',
    parking: '500대 수용 전용 주차빌딩',
    conveniences: ['직영 대형 식당', '상가 라운지', '전문 안치센터'],
    isBaeungPartner: true,
    discountRate: 0.25,
    dailyRentEstimate: 1_100_000
,
    latitude: 35.1485,
    longitude: 129.0583,
    nearestSubway: '1호선 범일역 10번 출구 (도보 8분) / 문현역',
    nearestCrematorium: '부산영락공원 승화원 (금정구)',
    crematoriumDistanceKm: 18,
    crematoriumTravelMinutes: 25,
    roomTypes: [
      {
            name: "소형 (35평형)",
            pyeong: 35,
            dailyPrice: 700000,
            recommendedGuests: "가족장"
      },
      {
            name: "중형 (55평형)",
            pyeong: 55,
            dailyPrice: 1100000,
            recommendedGuests: "일반 조문 150명"
      },
      {
            name: "특실 (80평형)",
            pyeong: 80,
            dailyPrice: 1650000,
            recommendedGuests: "대형 조문 250명"
      },
      {
            name: "VIP실 (120평형)",
            pyeong: 120,
            dailyPrice: 2400000,
            recommendedGuests: "VIP 전용"
      }
]  },
  {
    id: 'fh-busan-chakhan',
    name: '(주)착한전문장례식장',
    region: '부산광역시',
    subRegion: '동래구',
    address: '부산 동래구 반송로 183 (낙민동)',
    phone: '051-522-4444',
    roomCount: 9,
    capacityCount: 20,
    category: 'SPECIALIZED_INDEPENDENT',
    parking: '자주식 옥외 주차타워',
    conveniences: ['유족 식당', '카페'],
    isBaeungPartner: true,
    discountRate: 0.20,
    dailyRentEstimate: 750_000
,
    latitude: 35.2104,
    longitude: 129.0768,
    nearestSubway: '1호선 온천장역 3번 출구 (도보 6분)',
    nearestCrematorium: '부산영락공원 승화원 (금정구)',
    crematoriumDistanceKm: 9.5,
    crematoriumTravelMinutes: 14,
    roomTypes: [
      {
            name: "소형 (30평형)",
            pyeong: 30,
            dailyPrice: 480000,
            recommendedGuests: "가족장"
      },
      {
            name: "중형 (48평형)",
            pyeong: 48,
            dailyPrice: 750000,
            recommendedGuests: "일반 조문 100명"
      },
      {
            name: "특실 (65평형)",
            pyeong: 65,
            dailyPrice: 1150000,
            recommendedGuests: "대형 조문"
      }
]  },
  {
    id: 'fh-daegu-nongong-catholic',
    name: '(복)대구가톨릭사회복지회논공 장례식장',
    region: '대구광역시',
    subRegion: '달성군',
    address: '대구 달성군 논공읍 논공로 210 (남리)',
    phone: '053-615-4444',
    roomCount: 5,
    capacityCount: 8,
    category: 'PUBLIC_MUNICIPAL',
    parking: '복지회 전용 주차장',
    conveniences: ['상가 식당', '종교 시설'],
    isBaeungPartner: true,
    discountRate: 0.30,
    dailyRentEstimate: 500_000
,
    latitude: 35.7314,
    longitude: 128.4552,
    nearestSubway: '논공시외버스정류소 인근 (차량 3분)',
    nearestCrematorium: '대구명복공원 (수성구)',
    crematoriumDistanceKm: 28,
    crematoriumTravelMinutes: 35,
    roomTypes: [
      {
            name: "소형 (30평형)",
            pyeong: 30,
            dailyPrice: 350000,
            recommendedGuests: "소규모 가족장"
      },
      {
            name: "중형 (45평형)",
            pyeong: 45,
            dailyPrice: 500000,
            recommendedGuests: "일반 조문"
      }
]  },
  {
    id: 'fh-daegu-hwanggeum-care',
    name: '황금요양병원장례식장',
    region: '대구광역시',
    subRegion: '수성구',
    address: '대구 수성구 수성로 216 (중동)',
    phone: '053-745-4444',
    roomCount: 5,
    capacityCount: 8,
    category: 'CARE_HOSPITAL',
    parking: '요양병원 자주식 주차공간',
    conveniences: ['매점', '접객실'],
    isBaeungPartner: true,
    discountRate: 0.20,
    dailyRentEstimate: 550_000
,
    latitude: 35.8452,
    longitude: 128.6258,
    nearestSubway: '3호선 황금역 1번 출구 (도보 5분)',
    nearestCrematorium: '대구명복공원 (수성구)',
    crematoriumDistanceKm: 4.8,
    crematoriumTravelMinutes: 10,
    roomTypes: [
      {
            name: "소형 (28평형)",
            pyeong: 28,
            dailyPrice: 380000,
            recommendedGuests: "가족장"
      },
      {
            name: "중형 (45평형)",
            pyeong: 45,
            dailyPrice: 550000,
            recommendedGuests: "일반 조문"
      }
]  },

  // --- 호남권 (광주/전남/전북) ---
  {
    id: 'fh-gwangju-cheonji',
    name: '(주)천지문화원 (천지장례식장)',
    region: '광주광역시',
    subRegion: '서구',
    address: '광주 서구 풍서좌로 173-1 (매월동)',
    phone: '062-527-1000',
    roomCount: 12,
    capacityCount: 18,
    category: 'SPECIALIZED_INDEPENDENT',
    parking: '400대 이상 대형 평면 주차장',
    conveniences: ['직영 대형 식당', '상가 편의점', '유족 전용 휴게실'],
    isBaeungPartner: true,
    discountRate: 0.25,
    dailyRentEstimate: 850_000
,
    latitude: 35.1278,
    longitude: 126.8614,
    nearestSubway: '광주 1호선 상무역 (차량 7분) / 풍암지구 인근',
    nearestCrematorium: '광주영락공원 승화원 (북구)',
    crematoriumDistanceKm: 16.5,
    crematoriumTravelMinutes: 22,
    roomTypes: [
      {
            name: "소형 (35평형)",
            pyeong: 35,
            dailyPrice: 550000,
            recommendedGuests: "가족장"
      },
      {
            name: "중형 (55평형)",
            pyeong: 55,
            dailyPrice: 850000,
            recommendedGuests: "일반 조문 120명"
      },
      {
            name: "특실 (75평형)",
            pyeong: 75,
            dailyPrice: 1300000,
            recommendedGuests: "대형 조문"
      }
]  },
  {
    id: 'fh-jeonbuk-jesus-hospital',
    name: '(유)예수병원장례식장',
    region: '전북특별자치도',
    subRegion: '전주시 완산구',
    address: '전북 전주시 완산구 서원로 365 (중화산동1가)',
    phone: '063-285-1009',
    roomCount: 6,
    capacityCount: 10,
    category: 'TERTIARY_HOSPITAL',
    parking: '병원 주차타워',
    conveniences: ['접객실', '편의시설'],
    isBaeungPartner: true,
    discountRate: 0.15,
    dailyRentEstimate: 700_000
,
    latitude: 35.8142,
    longitude: 127.1284,
    nearestSubway: '전주고속버스터미널 (차량 10분)',
    nearestCrematorium: '전주시립승화원',
    crematoriumDistanceKm: 12,
    crematoriumTravelMinutes: 18,
    roomTypes: [
      {
            name: "소형 (30평형)",
            pyeong: 30,
            dailyPrice: 450000,
            recommendedGuests: "가족장"
      },
      {
            name: "중형 (48평형)",
            pyeong: 48,
            dailyPrice: 700000,
            recommendedGuests: "일반 조문 100명"
      }
]  },
  {
    id: 'fh-jeonnam-muan-hospital',
    name: '(유)무안병원장례식장',
    region: '전라남도',
    subRegion: '무안군',
    address: '전남 무안군 무안읍 몽탄로 65 (성동리)',
    phone: '061-453-4444',
    roomCount: 5,
    capacityCount: 6,
    category: 'CARE_HOSPITAL',
    parking: '병원 구내 주차장 연계',
    conveniences: ['구내 식당', '조문객 접객실'],
    isBaeungPartner: true,
    discountRate: 0.20,
    dailyRentEstimate: 450_000
,
    latitude: 34.9892,
    longitude: 126.4714,
    nearestSubway: '무안버스터미널 (도보 8분)',
    nearestCrematorium: '목포추모공원 승화원',
    crematoriumDistanceKm: 21,
    crematoriumTravelMinutes: 25,
    roomTypes: [
      {
            name: "소형 (25평형)",
            pyeong: 25,
            dailyPrice: 300000,
            recommendedGuests: "가족장"
      },
      {
            name: "중형 (42평형)",
            pyeong: 42,
            dailyPrice: 450000,
            recommendedGuests: "일반 조문"
      }
]  },

  // --- 충청/강원권 ---
  {
    id: 'fh-gangwon-yeongwol-medical',
    name: '강원도 영월의료원장례예식장',
    region: '강원특별자치도',
    subRegion: '영월군',
    address: '강원 영월군 영월읍 중앙1로 59 (영흥리)',
    phone: '033-370-9142',
    roomCount: 4,
    capacityCount: 6,
    category: 'PUBLIC_MUNICIPAL',
    parking: '공공의료원 주차장 연계',
    conveniences: ['영결식장', '공공 매점'],
    isBaeungPartner: true,
    discountRate: 0.30,
    dailyRentEstimate: 400_000
,
    latitude: 37.1852,
    longitude: 128.4632,
    nearestSubway: '영월시외버스터미널 (도보 10분)',
    nearestCrematorium: '제천영원한쉼터 승화원',
    crematoriumDistanceKm: 32,
    crematoriumTravelMinutes: 35,
    roomTypes: [
      {
            name: "소형 (28평형)",
            pyeong: 28,
            dailyPrice: 280000,
            recommendedGuests: "가족장"
      },
      {
            name: "중형 (40평형)",
            pyeong: 40,
            dailyPrice: 400000,
            recommendedGuests: "일반 조문"
      }
]  },
  {
    id: 'fh-sejong-eunhasu',
    name: '세종시 은하수공원 장례식장',
    region: '세종특별자치시',
    subRegion: '세종시',
    address: '세종특별자치시 산울동 정안세종로 1527',
    phone: '044-850-1350',
    roomCount: 10,
    capacityCount: 14,
    category: 'PUBLIC_MUNICIPAL',
    parking: '광역 복합공원 초대형 주차장',
    conveniences: ['화장장·봉안당 연계', '친환경 장사공원', '공설 식당'],
    isBaeungPartner: true,
    discountRate: 0.30,
    dailyRentEstimate: 550_000
  }
];
