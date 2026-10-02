/**
 * 생애기록관(Life Archive) 및 디지털 평전, 사전 부고 승계 시스템 타입 정의
 */

export type ContactGroupType = 'family' | 'career' | 'alumni' | 'social';

export interface SmartphoneContactItem {
  id: string;
  name: string;
  phone: string;
  group: ContactGroupType;
  relationship: string;
  notifyObituary: boolean;
  specialNote?: string;
}

export interface ContactGroupSummary {
  group: ContactGroupType;
  name: string;
  count: number;
  description: string;
}

export interface LifePhotoItem {
  id: string;
  title: string;
  year: string;
  caption: string;
  category: string;
  imageUrl: string;
}

export interface PreMortemObituary {
  title: string;
  preamble: string;                 // 공통 부고 안내문
  personalFarewell: string;         // 고인이 생전에 직접 작성한 마지막 작별 인사말
  funeralHallLinkedName?: string;   // 연계 장례식장
  crematoriumName?: string;         // 연계 승화원
  accountForCondolence?: string;    // 마음 전하실 곳 계좌
  representativePhotoUrl?: string;  // 고인 생전 대표 사진 (온화한 모습)
  lifePhotoGalleryUrl?: string;     // 고인의 생전 사진 및 추모 갤러리 링크
  lifePhotoCount?: number;          // 보존된 생전 사진 수 (예: 84장)
  lifeStoryUrl?: string;            // 고인 생애 평전 링크
}

export interface LifeStoryChapter {
  chapterNumber: number;
  period: string;                   // 예: '1938 ~ 1956년'
  title: string;                    // 예: '제1장: 격동의 시대, 배움의 열정과 바다를 향한 꿈'
  storyContent: string;             // 감동적인 생애 평전 본문 서술
  keyAchievements: string[];        // 해당 시기의 주요 업적 및 기록
  featuredPhotos: {
    title: string;
    year: string;
    caption: string;
  }[];
}

export interface LifeStoryDocument {
  deceasedName: string;
  birthYear: number;
  memorialTitle: string;
  epitaph: string;                  // 묘비명 / 좌우명
  overallSummary: string;           // 평전 총론
  chapters: LifeStoryChapter[];
  audioTribute: {
    title: string;
    duration: string;
    recordedAt: string;
    transcript: string;
  };
  familyDedication: string;         // 유가족 헌정사
  hardcoverBookAvailable: boolean;  // 실물 한지 양장본 발간 가능 여부
}

export interface EndingNote {
  preferredFuneralType: string;     // 예: '가족 중심 2일장'
  preferredReligion: string;        // 예: '천주교' or '무종교'
  preferredRestingPlace: string;    // 예: '화장 후 양평 수목장'
  livingWillRegistered: boolean;    // 사전연명의료의향서 등록 여부
  organDonationWish: boolean;       // 장기기증 희망 여부
  specialWishes: string[];          // 특별 당부 사항
}

export interface GatekeeperDelegate {
  name: string;
  relationship: string;
  phone: string;
  isConfirmed: boolean;
}

export interface GatekeeperProtocol {
  status: 'pre_mortem_locked' | 'verification_pending' | 'post_mortem_released';
  primaryDelegate: GatekeeperDelegate;
  secondaryDelegate: GatekeeperDelegate;
  unlockConditions: string[];
  lastConfirmedDate: string;
}

/**
 * 전국 장례식장, 정찰 패키지, 생애기록관 부고장 간 실시간 동기화 설정 모델
 */
export interface FuneralSetting {
  funeralHallId: string;
  funeralHallName: string;
  roomName: string;
  address: string;
  phone: string;
  discountRate: number;
  crematoriumName: string;
  packageType: 'simple_non_hall' | 'family_2day' | 'economic_3day' | 'standard_3day' | string;
  packageName: string;
  packagePrice: number;
  deceasedName: string;
  deceasedClan?: string;
  birthDate?: string;
  deathDate?: string;
  age?: number;
  motto?: string;
  chiefMourners: string[];
  /** 상주자(유가족 대표) 연락처 — 부고장에 실려야 하는 전화번호.
   *  조문객이 「전화하고 싶다」 고 할 때 받을 번호다. 없으면 부고장이 완성되지 않는다. */
  chiefPhone?: string;
  /** 배웅 견적 참조번호(REF). 유족이 식장에서 제시하면 정찰가를 보장받는다.
   *  이게 없으면 가족이 「몇 만 원짜리인지」 를 입증할 수 없다. */
  referenceCode?: string;
  /** 「아직 모르는 것」 수첩 — 항목별 메모 (누구에게 물어볼지).
   *  빈칸을 「미입력」 으로 두면 유족이 스스로를 잘못한 사람으로 여기게 된다. */
  unknownNotes?: Record<string, string>;
  /** 「나중에 정하기」 로 물러난 항목. 잊어버린 것이 아니라 보류한 것이다. */
  deferredUnknowns?: string[];
  departureDateTime: string;
  condolenceAccount: string;
  virtualPhone?: string;
  nearestSubway?: string;
  navigationLink?: string;
}

/**
 * AI 생애 구술 인터뷰어 문답 및 평전 합성 질문 모델
 */
export interface VoiceInterviewQuestion {
  id: string;
  category: string;
  title: string;
  questionAudioText: string;
  sampleSpokenAnswer: string;
  aiSynthesizedProse: string;
  targetChapterNumber: number;
}

