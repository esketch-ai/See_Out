import {
  LifeStoryDocument,
  ContactGroupSummary,
  SmartphoneContactItem,
  PreMortemObituary,
  EndingNote,
  GatekeeperProtocol
} from './types.js';

/**
 * 故 김철수 선생 생애 평전 및 디지털 스토리북 데이터
 */
export const SAMPLE_LIFE_STORY: LifeStoryDocument = {
  deceasedName: '故 김철수 님',
  birthYear: 1938,
  memorialTitle: '한 인고의 삶, 영원한 기억 — 김철수 선생 생애 평전',
  epitaph: '“성실함에는 거짓이 없으며, 가족을 향한 사랑은 마르지 않는다.”',
  overallSummary:
    '일제강점기 말엽에 태어나 한국전쟁의 폐허를 딛고 대한민국 조선·해양 산업화의 1세대로서 평생을 헌신하신 김철수 님. 현장 기술자로서 국가 발전에 기여하고, 가정에서는 두 자녀에게 한없는 사랑과 바른 가치관을 물려주신 위대한 아버지이자 스승이셨습니다.',
  hardcoverBookAvailable: true,
  familyDedication:
    '언제나 든든한 거목처럼 비바람을 막아주셨던 아버지. 아버지의 땀방울과 따뜻한 눈빛을 영원히 가슴에 새기겠습니다. 사랑하고 존경합니다. — 장남 김정우, 차녀 김수연, 손자 김민준 올림',
  audioTribute: {
    title: '자식들과 손주들에게 남기는 마지막 육성 편지',
    duration: '03분 42초',
    recordedAt: '2025년 8월 15일 (자택 서재 녹음)',
    transcript:
      '“사랑하는 정우야, 수연아. 너희들이 내 자식으로 태어나 준 것이 내 인생 최고의 축복이었단다. 세상을 살다 보면 힘든 파도가 칠 때도 있겠지만, 서로 우애하고 정직하게 살면 언제나 길은 열린단다. 엄마와 너희들을 진심으로 사랑했고, 참으로 고마웠다. 울지 말고 서로 아껴주며 행복하게 살아라.”'
  },
  chapters: [
    {
      chapterNumber: 1,
      period: '1938년 ~ 1956년',
      title: '제1장: 태동과 학업 — 폐허 속에서 피어난 배움의 불꽃',
      storyContent:
        '1938년 경남 충무(현 통영)의 작은 어촌 마을에서 태어난 김철수 님은 유년기 한국전쟁의 혹독한 시련을 겪었습니다. 끼니를 거르는 날에도 호롱불 아래서 책을 놓지 않았던 배움의 열정으로 통영수산고등학교를 우수한 성적으로 졸업하며 넓은 바다로 나아갈 꿈을 키웠습니다.',
      keyAchievements: [
        '1950년 한국전쟁 피란 중 학업 지속 및 서당 한학 이수',
        '1956년 통영수산고등학교 우수 졸업 및 선박 도면 제도 자격 취득'
      ],
      featuredPhotos: [
        {
          title: '유년 시절 고향 통영 앞바다',
          year: '1948년',
          caption: '바다를 바라보며 큰 꿈을 키우던 열 살 소년 시절의 모습'
        },
        {
          title: '학창 시절 친구들과의 기록',
          year: '1956년',
          caption: '고등학교 졸업식 날 친구들과 찍은 흑백 기념사진'
        }
      ]
    },
    {
      chapterNumber: 2,
      period: '1957년 ~ 1975년',
      title: '제2장: 청춘과 도약 — 대한민국 조선 강국의 기틀을 닦다',
      storyContent:
        '군 복무를 마친 후, 황무지나 다름없던 울산 현대조선소 설립 초기 현장에 기술직으로 입사하였습니다. 거친 쇳물과 용접 불꽃 속에서 대한민국 최초의 26만 톤급 초대형 유조선(VLCC) 건조에 참여하며 밤낮없이 땀을 흘렸습니다. 1963년 평생의 반려자인 박순자 여사와 화촉을 밝히고 행복한 가정을 꾸렸습니다.',
      keyAchievements: [
        '1961년 해군 병역 필 (선박 통신 및 정비 특기)',
        '1963년 박순자 여사와 결혼 (백년가약)',
        '1974년 대한민국 1호 초대형 유조선(아틀랜틱 배런호) 건조 공로 표창'
      ],
      featuredPhotos: [
        {
          title: '단아했던 전통 혼례식',
          year: '1963년',
          caption: '두 손을 꼭 잡고 평생의 동반자가 되기로 맹세하던 날'
        },
        {
          title: '조선소 도크 앞 청년 기술자의 미소',
          year: '1974년',
          caption: '거대한 선박 건조를 성공시키고 동료들과 함께 흘린 값진 땀'
        }
      ]
    },
    {
      chapterNumber: 3,
      period: '1976년 ~ 1998년',
      title: '제3장: 헌신과 결실 — 사랑으로 세운 가정, 땀으로 일군 일터',
      storyContent:
        '장남 정우와 차녀 수연이 태어나며 가장으로서의 책임감은 더욱 깊어졌습니다. 피곤한 몸을 이끌고 귀가해서도 늘 아이들의 손을 잡고 따뜻한 이야기를 들려주던 자상한 아버지였습니다. 직장에서는 30년 무사고 근속을 달성하고, 상공부 장관 표창 및 조선기계 명장에 선정되며 후배 기술자들의 귀감이 되었습니다.',
      keyAchievements: [
        '1985년 상공부 장관 표창 (선박 구조 안전 혁신 부문)',
        '1992년 30년 장기근속 명예 표창장 수훈',
        '1998년 조선 생산기술 명장 선정 및 정년퇴임'
      ],
      featuredPhotos: [
        {
          title: '네 식구의 첫 가족사진',
          year: '1978년',
          caption: '돌을 맞은 정우와 아내 박순자 여사와 함께 활짝 웃던 날'
        },
        {
          title: '정년퇴임식 기념 촬영',
          year: '1998년',
          caption: '30여 년 청춘을 바친 일터를 명예롭게 떠나며 후배들과 나눈 포옹'
        }
      ]
    },
    {
      chapterNumber: 4,
      period: '1999년 ~ 현재',
      title: '제4장: 황혼의 지혜 — 따뜻한 나눔과 자녀들에게 남기는 축복',
      storyContent:
        '퇴임 후에는 지역 기술학교에서 청소년들에게 무료로 기술을 가르치고 장학금을 후원하며 나눔의 삶을 실천하셨습니다. 장성한 자녀들이 가정을 이루고 첫 손자 민준이를 품에 안았을 때 “내 인생은 참으로 온전하게 행복했다”며 환한 미소를 지으셨습니다. 가족과 주변 사람들에게 언제나 따스한 온기를 건네셨던 존경스러운 삶이었습니다.',
      keyAchievements: [
        '2003년 지역 직업전문학교 명예 멘토 위촉 (청소년 기술 후원)',
        '2015년 금혼식(결혼 50주년) 기념 온 가족 제주 여행',
        '2025년 배웅 생애기록관 자서전 및 육성 회고록 완간'
      ],
      featuredPhotos: [
        {
          title: '손자 민준이와 함께한 서재',
          year: '2016년',
          caption: '할아버지의 무릎 위에서 동화책을 읽던 행복한 주말'
        },
        {
          title: '온 가족이 모인 팔순 잔치',
          year: '2018년',
          caption: '자녀들과 손주들의 큰절을 받으시며 눈시울을 붉히시던 순간'
        }
      ]
    }
  ]
};

/**
 * 스마트폰 연락처 사전 백업 그룹 통계 (총 640명)
 */
export const SAMPLE_CONTACT_GROUPS: ContactGroupSummary[] = [
  {
    group: 'family',
    name: '가족 및 친족',
    count: 28,
    description: '직계 존비속, 형제자매, 사촌 및 친인척'
  },
  {
    group: 'career',
    name: '직장 및 조선소 동료',
    count: 342,
    description: '30년간 함께 땀 흘린 현대조선소 동료 및 선후배'
  },
  {
    group: 'alumni',
    name: '학교 동창 (수산고/해군)',
    count: 186,
    description: '통영수산고 총동문회 및 해군 동기 모임'
  },
  {
    group: 'social',
    name: '성당 및 지역 봉사 모임',
    count: 84,
    description: '통영성당 레지오 마리애 및 기술학교 봉사단'
  }
];

/**
 * 스마트폰 사전 연락처 세부 샘플
 */
export const SAMPLE_CONTACTS: SmartphoneContactItem[] = [
  {
    id: 'c-1',
    name: '김정우 (장남)',
    phone: '010-3849-2910',
    group: 'family',
    relationship: '장남 (상주)',
    notifyObituary: true,
    specialNote: '1차 게이트키퍼 대리인'
  },
  {
    id: 'c-2',
    name: '김수연 (차녀)',
    phone: '010-9182-3847',
    group: 'family',
    relationship: '차녀',
    notifyObituary: true,
    specialNote: '2차 게이트키퍼 대리인'
  },
  {
    id: 'c-3',
    name: '이만석 부사장 (조선소 선배)',
    phone: '010-4492-1092',
    group: 'career',
    relationship: '현대조선소 전 직속상관',
    notifyObituary: true,
    specialNote: '동료 대표 연락망'
  },
  {
    id: 'c-4',
    name: '박철호 동기회장',
    phone: '010-8812-3918',
    group: 'alumni',
    relationship: '통영수산고 12회 동기회장',
    notifyObituary: true,
    specialNote: '동창회 단체 부고 전파'
  },
  {
    id: 'c-5',
    name: '정베드로 신부님',
    phone: '010-5519-7210',
    group: 'social',
    relationship: '통영성당 주임신부',
    notifyObituary: true,
    specialNote: '연령회 연도(기도) 요청'
  }
];

/**
 * 고인 사전 작성 모바일 부고장
 */
export const SAMPLE_PRE_MORTEM_OBITUARY: PreMortemObituary = {
  title: '[부고] 故 김철수 베드로 님(향년 88세)께서 선종하셨기에 알립니다',
  preamble:
    '평생을 성실과 사랑으로 살아오신 저희 아버님 故 김철수 님께서 하나님의 부르심을 받아 영원한 안식에 들어가셨습니다.',
  personalFarewell:
    '“평생 분에 넘치는 사랑과 은혜를 받았습니다. 먼 길 가기 전, 함께 웃고 울었던 소중한 인연들께 머리 숙여 깊이 감사드립니다. 부디 슬퍼하지 마시고 저와의 따뜻했던 기억 하나만 품어 주십시오.” — 고인 김철수 올림',
  funeralHallLinkedName: '서울아산병원 장례식장 2층 20호실',
  crematoriumName: '서울시립승화원 (벽제 화장장)',
  accountForCondolence: '신한은행 110-384-291028 (예금주: 장남 김정우)'
};

/**
 * 나의 사전 장례 의향서 (엔딩노트)
 */
export const SAMPLE_ENDING_NOTE: EndingNote = {
  preferredFuneralType: '가족 중심 2일 가족장 (배웅 정찰제 180만 원 패키지)',
  preferredReligion: '천주교 의전 (성당 연령회 연도 및 천주교식 입관 기도)',
  preferredRestingPlace: '화장 후 양평 용문산 자연장지(수목장) 안치',
  livingWillRegistered: true,
  organDonationWish: false,
  specialWishes: [
    '조문객들의 화환은 사양하고 정갈한 마음과 기도만 받기를 원함',
    '입관 시 가족들이 직접 적은 편지 1장씩을 가슴에 품어주기를 바람',
    '빈소 모니터에 손자들과 함께했던 여행 사진을 밝은 음악과 함께 틀어줄 것'
  ]
};

/**
 * 2단계 게이트키퍼(Gatekeeper) 승계 프로토콜
 */
export const SAMPLE_GATEKEEPER: GatekeeperProtocol = {
  status: 'pre_mortem_locked',
  lastConfirmedDate: '2026년 3월 10일 (최종 안전 점검 완료)',
  primaryDelegate: {
    name: '김정우',
    relationship: '장남',
    phone: '010-3849-2910',
    isConfirmed: true
  },
  secondaryDelegate: {
    name: '김수연',
    relationship: '차녀',
    phone: '010-9182-3847',
    isConfirmed: true
  },
  unlockConditions: [
    '생전에는 본인 외 가족이라도 암호화되어 절대 열람 불가 (E2EE)',
    '임종 시 지정 대리인(장남 김정우)의 1차 승계 신청',
    '사망진단서 원본 업로드 검증 또는 차녀 김수연의 2차 상호 인증 완료 시 즉시 봉인 해제',
    '봉인 해제 즉시 스마트폰 640명 지인 연락처 열람 및 원터치 모바일 부고 발송 활성화'
  ]
};
