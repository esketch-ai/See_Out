import {
  LifeStoryDocument,
  ContactGroupSummary,
  SmartphoneContactItem,
  PreMortemObituary,
  EndingNote,
  GatekeeperProtocol,
  FuneralSetting,
  VoiceInterviewQuestion
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
 * 고인 생전 사진 갤러리 샘플 데이터 (총 84장 중 대표 6선)
 */
export const SAMPLE_LIFE_PHOTOS = [
  {
    id: 'p-1',
    title: '백년가약 전통 혼례식 (아내 박순자 여사와 함께)',
    year: '1963년',
    category: '결혼 및 가족',
    caption: '두 손을 꼭 잡고 평생의 동반자가 되기로 맹세하던 날. 검은 머리 파뿌리 될 때까지 사랑하겠다는 약속을 지켰습니다.',
    imageUrl: '/images/life-story-book.jpg'
  },
  {
    id: 'p-2',
    title: '대한민국 1호 초대형 유조선 도크 현장에서',
    year: '1974년',
    category: '일터와 업적',
    caption: '거대한 쇳물과 용접 불꽃 속에서 동료들과 함께 일군 조선 강국의 꿈. 내 청춘의 가장 뜨거웠던 땀방울이었습니다.',
    imageUrl: '/images/escort-ceremony.jpg'
  },
  {
    id: 'p-3',
    title: '네 식구의 첫 가족사진 (정우 돌잔치)',
    year: '1978년',
    category: '결혼 및 가족',
    caption: '어려운 형편이었지만 아이들의 웃음소리 하나로 온 세상을 다 가진 듯 행복했던 젊은 날의 우리 집.',
    imageUrl: '/images/life-archive.jpg'
  },
  {
    id: 'p-4',
    title: '30년 근속 정년퇴임식과 후배들의 꽃다발',
    year: '1998년',
    category: '일터와 업적',
    caption: '청춘을 바친 일터를 명예롭게 떠나며 후배들이 걸어준 꽃목걸이. 부끄러움 없이 성실하게 살았다는 자긍심.',
    imageUrl: '/images/floral-coffin.jpg'
  },
  {
    id: 'p-5',
    title: '금혼식(결혼 50주년) 온 가족 제주도 여행',
    year: '2015년',
    category: '황혼과 추억',
    caption: '자녀들과 손주들이 마련해 준 제주 바닷가에서. 아내의 주름진 손을 잡고 "고마웠소"라고 속삭였습니다.',
    imageUrl: '/images/memorial-altar.jpg'
  },
  {
    id: 'p-6',
    title: '손자 민준이와 함께한 서재의 오후',
    year: '2020년',
    category: '황혼과 추억',
    caption: '내 무릎에 앉아 재롱을 피우던 민준이. 세상 무엇과도 바꿀 수 없던 내 인생 황혼의 가장 눈부신 햇살.',
    imageUrl: '/images/hero-memorial.jpg'
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
  accountForCondolence: '신한은행 110-384-291028 (예금주: 장남 김정우)',
  representativePhotoUrl: '/images/life-story-book.jpg',
  lifePhotoGalleryUrl: '#photo-gallery',
  lifePhotoCount: 84,
  lifeStoryUrl: '#biography'
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

/**
 * 3대 모듈(전국 장례식장, 정찰 패키지, 생애기록관) 간 실시간 동기화 기본값
 */
export const DEFAULT_FUNERAL_SETTING: FuneralSetting = {
  funeralHallId: 'fh-seoul-asan',
  funeralHallName: '서울아산병원장례식장',
  roomName: '2층 특20호실',
  address: '서울 송파구 올림픽로43길 88 (풍납동)',
  phone: '02-3010-2000',
  discountRate: 0,
  crematoriumName: '서울시립승화원 (벽제 화장장)',
  packageType: 'standard_3day',
  packageName: '배웅 정직 실속 3일장',
  packagePrice: 2_500_000,
  deceasedName: '故 김철수 님',
  deceasedClan: '김해(金海)',
  birthDate: '1938년 4월 12일',
  deathDate: '2026년 3월 25일',
  age: 88,
  motto: '“성실함에는 거짓이 없으며, 가족을 향한 사랑은 마르지 않는다.”',
  chiefMourners: ['장남 김정우', '차녀 김수연', '자부 박미영', '사위 이진수', '손자 김민준'],
  departureDateTime: '2026년 3월 27일 (금) 오전 07시 30분',
  condolenceAccount: '신한은행 110-384-291028 (예금주: 장남 김정우)'
};

/**
 * AI 생애 구술 인터뷰어 4대 표준 질문 및 문답 데이터셋
 */
export const VOICE_INTERVIEW_QUESTIONS: VoiceInterviewQuestion[] = [
  {
    id: 'q1',
    category: '유년과 고향',
    title: '어릴 적 고향과 부모님에 대한 따스한 기억',
    questionAudioText: '“어르신, 어린 시절 나고 자란 고향의 모습과 부모님에 대한 가장 따뜻했던 기억을 들려주세요.”',
    sampleSpokenAnswer: '충무 앞바다에서 물질하던 어머니가 밤에 쪄주던 군고구마 맛이 아직도 생각나요. 전쟁통이라 참 가난했지만 어머니의 따뜻한 품과 바다 냄새는 지금도 가슴에 생생합니다.',
    aiSynthesizedProse: '통영 앞바다의 푸른 물결과 어머니의 온기 어린 군고구마는 소년 철수의 가슴속에 꺼지지 않는 삶의 등대가 되었다. 전쟁의 혹독한 궁핍 속에서도 부모님이 베풀어준 사랑은 훗날 그가 거친 세파를 꿋꿋이 헤쳐 나가는 가장 든든한 정신적 자양분이 되었다.',
    targetChapterNumber: 1
  },
  {
    id: 'q2',
    category: '청춘과 땀방울',
    title: '청년 시절 산업 현장의 땀방울과 보람',
    questionAudioText: '“젊은 날 처음 세상에 나아가 땀 흘리며 일하셨던 순간과 가장 보람찼던 도전은 무엇이었나요?”',
    sampleSpokenAnswer: '울산 조선소 바닥에서 한겨울에 칼바람 맞아가며 쇳덩이를 용접했어요. 손발이 다 얼어 터져도 우리 손으로 거대한 배를 띄우던 날, 사나이들끼리 부둥켜안고 펑펑 울었지요.',
    aiSynthesizedProse: '거친 쇳가루와 영하의 칼바람 속에서도 그의 망치질은 멈추지 않았다. 대한민국 최초의 초대형 유조선이 바다로 진수되던 순간, 그의 이마에 맺힌 땀방울은 조국 근대화의 자랑스러운 주춧돌이 되었으며 그 무엇과도 바꿀 수 없는 청춘의 훈장이었다.',
    targetChapterNumber: 2
  },
  {
    id: 'q3',
    category: '가족과 사랑',
    title: '반려자와 자녀들을 품에 안았던 벅찬 감동',
    questionAudioText: '“평생을 함께한 반려자를 처음 만났을 때와, 아이들이 태어나 품에 안았을 때의 심정은 어떠셨나요?”',
    sampleSpokenAnswer: '순자 씨를 중매로 처음 만난 날 참 곱고 수줍어했어요. 그리고 정우 녀석이 태어나서 내 새끼손가락을 꽉 쥐었을 때, 아 이제 진짜 어른이 되었구나 세상에 무서울 게 없더군요.',
    aiSynthesizedProse: '단아한 박순자 여사와의 소박한 혼례, 그리고 첫 아들 정우가 작은 손으로 아비의 손가락을 꼭 쥐었던 그날의 전율. 그는 가족이라는 세상에서 가장 숭고한 쉼터를 위해 기꺼이 자신의 온 생애를 바치기로 굳게 다짐하였다.',
    targetChapterNumber: 3
  },
  {
    id: 'q4',
    category: '삶의 지혜와 당부',
    title: '사랑하는 자녀와 후손들에게 남기는 당부',
    questionAudioText: '“일평생을 살아오시며 얻은 가장 큰 배움과, 사랑하는 자녀와 후손들에게 남기고 싶은 말씀은 무엇인가요?”',
    sampleSpokenAnswer: '남 속이지 말고 정직하게 살면 결국 남는 게 있단다. 형제끼리 절대 돈 때문에 다투지 말고, 힘들 때 서로 보듬어줘라. 너희들이 내 자식이라 참 행복했다.',
    aiSynthesizedProse: '“정직한 땀방울에는 거짓이 없단다.” 황혼의 문턱에서 고인이 남긴 마지막 가르침은 소박하지만 영원히 빛나는 인생의 나침반이었다. 서로를 보듬으며 우애하라는 아비의 당부는 남겨진 자손들의 가슴속에 영원한 사랑의 언어로 아로새겨졌다.',
    targetChapterNumber: 4
  }
];

/**
 * 장례 설정(FuneralSetting) 객체를 기반으로 실시간 모바일 부고장 데이터를 자동 생성/동기화하는 헬퍼
 */
export function createObituaryFromSetting(
  setting: FuneralSetting,
  baseObituary: PreMortemObituary = SAMPLE_PRE_MORTEM_OBITUARY
): PreMortemObituary {
  return {
    ...baseObituary,
    title: `${setting.deceasedName} 부고 (배웅 정찰제 의전 연계)`,
    funeralHallLinkedName: `${setting.funeralHallName} ${setting.roomName}`,
    crematoriumName: setting.crematoriumName,
    accountForCondolence: setting.condolenceAccount
  };
}

