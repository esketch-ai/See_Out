import {
  LifeStoryDocument,
  LifeStoryChapter,
  VoiceInterviewQuestion
} from './types.js';
import { VOICE_INTERVIEW_QUESTIONS } from './lifeArchiveDataset.js';

export interface BiographyGenerationInput {
  deceasedName: string;
  birthYear: number;
  hometown: string;
  careerFocus: string;
  familyMembers: string[];
  motto?: string;
  interviewAnswers?: {
    questionId: string;
    spokenAnswer: string;
  }[];
}

/**
 * AI 구술 생애 평전 자동 편찬 엔진 (Digital Biographer)
 * - 고인의 생전 인터뷰 육성, 음성 구술 데이터, 삶의 이력을 5대 문학적 챕터로 구조화하여
 *   품격 있는 한지 양장본 및 디지털 평전으로 자동 초안 편찬
 */
export class BiographyGenerator {
  /**
   * 입력된 구술 답변 및 인적 정보를 바탕으로 5대 챕터 평전 정본 생성
   */
  public static generateDocument(input: BiographyGenerationInput): LifeStoryDocument {
    const name = input.deceasedName || '故 김철수 님';
    const birthYear = input.birthYear || 1938;
    const hometown = input.hometown || '경남 충무(통영)';
    const career = input.careerFocus || '조선·해양 중공업 엔지니어';
    const motto = input.motto || '“성실함에는 거짓이 없으며, 가족을 향한 사랑은 마르지 않는다.”';
    const mourners = input.familyMembers.length > 0 ? input.familyMembers.join(', ') : '장남 김정우, 차녀 김수연, 손자 김민준';

    // 질문 답변 매핑
    const answerMap = new Map<string, string>();
    if (input.interviewAnswers) {
      input.interviewAnswers.forEach((a) => answerMap.set(a.questionId, a.spokenAnswer));
    }

    const q1Answer = answerMap.get('q1') || '어머니의 따스했던 온기와 고향 바다의 짠 냄새는 평생을 살아가는 데 가장 큰 힘이 되었습니다.';
    const q2Answer = answerMap.get('q2') || '영하의 칼바람 속에서도 기술을 익히고 조선소 현장에서 동료들과 쇳덩이를 용접하던 날들이 자랑스럽습니다.';
    const q3Answer = answerMap.get('q3') || '아내를 만나 가정을 꾸리고, 아이들이 태어나 작은 손으로 내 손가락을 쥐었을 때 가장 큰 행복을 느꼈습니다.';
    const q4Answer = answerMap.get('q4') || '남을 속이지 말고 정직하게 살아야 한다. 형제간에 우애하고 어려운 이웃을 돌아보는 것이 가장 값진 삶이다.';

    const chapters: LifeStoryChapter[] = [
      {
        chapterNumber: 1,
        period: `${birthYear}년 ~ ${birthYear + 18}년`,
        title: `제1장: 태동과 고향 — ${hometown}의 푸른 숨결과 배움의 시작`,
        storyContent: `${birthYear}년 ${hometown}에서 태어난 ${name}은(는) 유년기 혹독한 시대의 시련 속에서도 결코 배움의 끈을 놓지 않았습니다. 구술 회고록에서 고인은 “${q1Answer}”라고 회고하셨듯이, 척박한 환경 속에서도 부모님이 베풀어 주신 지극한 온기와 바른 성정은 훗날 삶의 풍파를 헤쳐 나가는 굳건한 주춧돌이 되었습니다.`,
        keyAchievements: [
          `${birthYear + 12}년 고향 서당 및 보통학교 우수 수료`,
          `${birthYear + 18}년 전문 기술 기본 자격 취득 및 상경 준비`
        ],
        featuredPhotos: [
          {
            title: '유년 시절 고향 앞바다',
            year: `${birthYear + 10}년`,
            caption: '바다를 바라보며 큰 꿈을 키우던 어린 시절의 흑백 기억'
          }
        ]
      },
      {
        chapterNumber: 2,
        period: `${birthYear + 19}년 ~ ${birthYear + 37}년`,
        title: `제2장: 청춘과 도약 — 대한민국 발전의 주역으로 쏟은 땀방울`,
        storyContent: `청년이 된 ${name}은(는) 조국 근대화의 현장으로 뛰어들어 ${career} 분야의 선구자로서 청춘을 바쳤습니다. “${q2Answer}”라는 육성 증언처럼, 손발이 얼어붙는 열악한 작업장 속에서도 묵묵히 쇳물과 기름때를 닦아내며 흘린 정직한 땀방울은 대한민국 산업화의 위대한 기둥이 되었습니다.`,
        keyAchievements: [
          `${birthYear + 22}년 국가 기간 산업 현장 수석 엔지니어 임용`,
          `${birthYear + 35}년 핵심 설비 국산화 성공 및 국무총리 표창 수훈`
        ],
        featuredPhotos: [
          {
            title: '산업 현장 청년 동료들과 함께',
            year: `${birthYear + 25}년`,
            caption: '작업을 마치고 땀을 훔치며 환하게 웃음 짓던 청춘의 한 페이지'
          }
        ]
      },
      {
        chapterNumber: 3,
        period: `${birthYear + 38}년 ~ ${birthYear + 55}년`,
        title: `제3장: 사랑과 보금자리 — 가족이라는 이름의 영원한 등대`,
        storyContent: `치열했던 일터 밖에서 고인은 한없이 다정하고 든든한 가장이었습니다. 평생의 반려자를 만나 소박하지만 따스한 가정을 꾸렸고, 자녀들이 자라나는 모습을 바라보는 것을 생애 최고의 보람으로 삼았습니다. “${q3Answer}”라고 말씀하셨던 그날의 벅찬 감격은 평생 가족을 지켜내는 마르지 않는 사랑의 샘물이 되었습니다.`,
        keyAchievements: [
          `${birthYear + 38}년 화목한 가정 창립 및 온전한 보금자리 마련`,
          `${birthYear + 52}년 슬하 자녀들의 훌륭한 학업 성취와 자립 지원`
        ],
        featuredPhotos: [
          {
            title: '단란한 가족 나들이',
            year: `${birthYear + 45}년`,
            caption: '손을 꼭 잡고 떠났던 봄날 공원에서의 행복한 한때'
          }
        ]
      },
      {
        chapterNumber: 4,
        period: `${birthYear + 56}년 ~ ${birthYear + 72}년`,
        title: `제4장: 결실과 황혼 — 지혜로 밝힌 인고의 세월`,
        storyContent: `현업에서 물러난 뒤에도 고인의 삶은 주변을 밝히는 은은한 등불이었습니다. 손주들의 재롱 속에서 황혼의 평온을 누리면서도 이웃의 아픔을 함께 나누고 지역 사회의 원로로서 올곧은 지혜를 베풀었습니다. 고난 앞에서도 비굴하지 않고 번영 앞에서도 교만하지 않았던 그분의 발자취는 맑은 향기로 남았습니다.`,
        keyAchievements: [
          `${birthYear + 60}년 정년퇴임 및 지역 사회 봉사 공로패 수상`,
          `${birthYear + 70}년 가문 족보 편찬 및 자손들을 위한 가훈 제정`
        ],
        featuredPhotos: [
          {
            title: '금혼식 기념 온 가족 축하 연회',
            year: `${birthYear + 68}년`,
            caption: '온 자손들이 모여 큰절을 올리며 감사와 축복을 나누던 날'
          }
        ]
      },
      {
        chapterNumber: 5,
        period: `${birthYear + 73}년 ~ 영원`,
        title: `제5장: 마지막 당부 — 사랑하는 자손들에게 전하는 유훈과 축복`,
        storyContent: `생의 황혼을 넘어 영원한 안식에 들기 전, 고인은 사랑하는 이들에게 마지막 가르침을 남기셨습니다. “${q4Answer}” 고인이 남기신 유훈은 단순한 글귀가 아니라 한 시대를 온몸으로 살아낸 거인이 전하는 가장 숭고한 사랑의 나침반입니다. 이제 우리는 그분의 고결했던 생애를 영원히 가슴에 품고 살아갈 것입니다.`,
        keyAchievements: [
          '사전연명의료의향서 및 평화로운 존엄 장례 서약',
          '지극한 정성의 생애기록관 디지털 평전 영구 보존'
        ],
        featuredPhotos: [
          {
            title: '인자한 미소의 영정',
            year: `${birthYear + 85}년`,
            caption: '모든 짐을 내려놓고 평안한 미소로 남겨진 가족들을 지켜보시는 모습'
          }
        ]
      }
    ];

    return {
      deceasedName: name,
      birthYear,
      memorialTitle: `한 시대를 온몸으로 살아낸 거인의 기록 — ${name} 생애 평전`,
      epitaph: motto,
      overallSummary: `일제강점기 말엽에 태어나 대한민국 산업 발전의 격동기를 묵묵한 땀방울로 헤쳐 나오신 ${name}. 일터에서는 불굴의 개척자였으며, 가정에서는 따스한 거목으로 가족을 품어주신 위대한 삶의 기록입니다.`,
      hardcoverBookAvailable: true,
      familyDedication: `언제나 비바람을 막아주던 든든한 아버지의 그늘. 가르쳐 주신 성실과 사랑을 영원히 가슴에 새기겠습니다. — ${mourners} 올림`,
      audioTribute: {
        title: '사랑하는 자손들에게 남기는 마지막 육성 편지',
        duration: '03분 42초',
        recordedAt: '생애기록관 음성 인터뷰 보존본',
        transcript: `“사랑하는 나의 가족들아. 너희들이 내 곁에 있어 주어 내 인생은 참으로 눈부시고 행복했단다. 살다 보면 힘들 때도 있겠지만 정직하고 서로 아껴주며 살아라. 참으로 고마웠다.”`
      },
      chapters
    };
  }
}
