import { describe, it, expect } from 'vitest';
import {
  SAMPLE_LIFE_STORY,
  SAMPLE_CONTACT_GROUPS,
  SAMPLE_PRE_MORTEM_OBITUARY,
  SAMPLE_ENDING_NOTE,
  SAMPLE_GATEKEEPER,
  DEFAULT_FUNERAL_SETTING,
  createObituaryFromSetting,
  VOICE_INTERVIEW_QUESTIONS
} from '../src/life-archive/index.js';

describe('LifeArchive Domain & Biographical Storybook Engine', () => {
  it('생애 평전 데이터는 4개 연대기 챕터와 유가족 헌정사를 온전히 포함해야 한다', () => {
    expect(SAMPLE_LIFE_STORY.deceasedName).toBe('故 김철수 님');
    expect(SAMPLE_LIFE_STORY.birthYear).toBe(1938);
    expect(SAMPLE_LIFE_STORY.chapters.length).toBe(4);
    expect(SAMPLE_LIFE_STORY.familyDedication).toContain('장남 김정우');
    expect(SAMPLE_LIFE_STORY.hardcoverBookAvailable).toBe(true);
  });

  it('생전 육성 내레이션 및 텍스트 전사 데이터가 유효해야 한다', () => {
    const audio = SAMPLE_LIFE_STORY.audioTribute;
    expect(audio.title).toContain('육성 편지');
    expect(audio.duration).toBe('03분 42초');
    expect(audio.transcript.length).toBeGreaterThan(50);
  });

  it('스마트폰 주소록 사전 동기화 그룹은 4대 카테고리로 총 640명이 분류되어야 한다', () => {
    expect(SAMPLE_CONTACT_GROUPS.length).toBe(4);
    const totalCount = SAMPLE_CONTACT_GROUPS.reduce((acc, g) => acc + g.count, 0);
    expect(totalCount).toBe(640);
  });

  it('사전 부고장에는 고인 생전 작별인사와 계좌, 빈소 정보가 포함되어야 한다', () => {
    const obit = SAMPLE_PRE_MORTEM_OBITUARY;
    expect(obit.title).toContain('故 김철수');
    expect(obit.personalFarewell).toContain('평생 분에 넘치는 사랑');
    expect(obit.funeralHallLinkedName).toContain('서울아산병원');
    expect(obit.accountForCondolence).toBeDefined();
    expect(obit.representativePhotoUrl).toBeDefined();
    expect(obit.lifePhotoGalleryUrl).toBeDefined();
    expect(obit.lifePhotoCount).toBe(84);
  });

  it('게이트키퍼 사후 승계 프로토콜은 1차 및 2차 대리인이 지정되어 있어야 한다', () => {
    expect(SAMPLE_GATEKEEPER.primaryDelegate.name).toBe('김정우');
    expect(SAMPLE_GATEKEEPER.secondaryDelegate.name).toBe('김수연');
    expect(SAMPLE_GATEKEEPER.status).toBe('pre_mortem_locked');
    expect(SAMPLE_GATEKEEPER.unlockConditions.length).toBeGreaterThan(2);
  });

  it('사전 장례 의향서(엔딩노트)는 희망 장례 형태와 수목장 장지를 포함해야 한다', () => {
    expect(SAMPLE_ENDING_NOTE.preferredFuneralType).toContain('2일 가족장');
    expect(SAMPLE_ENDING_NOTE.preferredRestingPlace).toContain('수목장');
    expect(SAMPLE_ENDING_NOTE.specialWishes.length).toBe(3);
  });

  it('3대 모듈 실시간 동기화 헬퍼는 장례식장 및 패키지 변경 시 모바일 부고장에 즉각 반영되어야 한다', () => {
    const customSetting = {
      ...DEFAULT_FUNERAL_SETTING,
      funeralHallName: '삼성서울병원장례식장',
      roomName: '지하 1층 1호실',
      packageName: '배웅 정직 2일 가족장',
      condolenceAccount: '국민은행 987-654-3210 (예금주: 김정우)'
    };

    const syncedObituary = createObituaryFromSetting(customSetting);
    expect(syncedObituary.funeralHallLinkedName).toBe('삼성서울병원장례식장 지하 1층 1호실');
    expect(syncedObituary.accountForCondolence).toBe('국민은행 987-654-3210 (예금주: 김정우)');
    expect(syncedObituary.title).toContain('故 김철수 님 부고');
  });

  it('AI 생애 구술 인터뷰어 데이터셋은 4대 표준 질문과 AI 산문 평전을 구비해야 한다', () => {
    expect(VOICE_INTERVIEW_QUESTIONS.length).toBe(4);
    const categories = VOICE_INTERVIEW_QUESTIONS.map((q) => q.category);
    expect(categories).toEqual(['유년과 고향', '청춘과 땀방울', '가족과 사랑', '삶의 지혜와 당부']);

    VOICE_INTERVIEW_QUESTIONS.forEach((q, idx) => {
      expect(q.targetChapterNumber).toBe(idx + 1);
      expect(q.questionAudioText.length).toBeGreaterThan(10);
      expect(q.sampleSpokenAnswer.length).toBeGreaterThan(20);
      expect(q.aiSynthesizedProse.length).toBeGreaterThan(50);
    });
  });
});
