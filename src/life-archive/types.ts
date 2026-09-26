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

export interface PreMortemObituary {
  title: string;
  preamble: string;                 // 공통 부고 안내문
  personalFarewell: string;         // 고인이 생전에 직접 작성한 마지막 작별 인사말
  funeralHallLinkedName?: string;   // 연계 장례식장
  crematoriumName?: string;         // 연계 승화원
  accountForCondolence?: string;    // 마음 전하실 곳 계좌
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
