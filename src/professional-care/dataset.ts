import { ProfessionalProfile } from './types.js';

export const VERIFIED_PROFESSIONALS: ProfessionalProfile[] = [
  // ── [버티컬 1] 생전 마음돌봄 & 유가족 사별 애도 심리상담 ──────────
  {
    id: 'care-psy-01',
    vertical: 'PSYCHOLOGY_CARE',
    category: 'BEREAVEMENT_GRIEF',
    categoryName: '유가족 사별 애도치유',
    name: '박은주 박사',
    title: '수석 임상심리전문가 / 연구소장',
    organization: '마음누리 사별애도심리연구원 (서울 서초)',
    licenseInfo: '보건복지부 정신건강임상심리사 1급 (제1142호) / 한국임상심리학회 임상심리전문가',
    experienceYears: 24,
    badge: '보건복지부 공인 1급 · 애도전문',
    directPhone: '02-588-3490',
    virtualPhone: '0507-1854-9201',
    address: '서울특별시 서초구 서초대로 254 (교대역 1번 출구)',
    specialties: [
      '사별 직후 급성 비탄(Acute Grief) 진정',
      '복합 비탄(Complicated Grief) 심층 치료',
      '고인과의 마지막 작별 및 죄책감 완화',
      '배우자·자녀 사별 유족 자조모임 연계'
    ],
    consultationFees: [
      {
        name: '유가족 1회기 심층 애도 심리상담 (대면/화상)',
        price: 110_000,
        duration: '50분',
        description: '사별 충격 완화, 정서적 비탄 수용 및 심리적 안정화 기법 지도'
      },
      {
        name: '사별 유족 비탄 종합 심리평가 패키지',
        price: 250_000,
        duration: '90분 (검사+해석)',
        description: '외상후스트레스(PTSD) 척도 및 복합 비탄 상태 정밀 평가 보고서 제공'
      }
    ],
    introduction:
      '24년간 대학병원 호스피스 및 애도전문클리닉에서 수많은 유가족의 눈물을 함께 닦아왔습니다. 사랑하는 이를 떠나보낸 슬픔은 억누르는 것이 아니라 정성껏 애도할 때 온전히 치유됩니다.',
    attorneyLawAct34Compliant: true,
    platformReferralFee: 0,
    licenseVerified: true
  },
  {
    id: 'care-psy-02',
    vertical: 'PSYCHOLOGY_CARE',
    category: 'PRE_MORTEM_LIFE_CARE',
    categoryName: '생전 마음돌봄 & 웰다잉',
    name: '정민석 소장',
    title: '공인 상담심리사 1급 / 호스피스 전담 카운슬러',
    organization: '한국라이프케어 심리상담센터 (경기 성남 분당)',
    licenseInfo: '한국상담심리학회 상담심리사 1급 (제842호) / 보건복지부 연명의료상담사',
    experienceYears: 19,
    badge: '한국상담심리학회 1급 · 웰다잉 전담',
    directPhone: '031-719-8820',
    virtualPhone: '0507-1854-9202',
    address: '경기도 성남시 분당구 정자일로 162',
    specialties: [
      '임종 앞둔 어르신 죽음 불안(Death Anxiety) 완화',
      '사전연명의료의향서 작성 전후 심리적 갈등 상담',
      '삶의 회고(Life Review) 구술 테라피',
      '간병 가족의 소진(Burnout) 및 우울 치유'
    ],
    consultationFees: [
      {
        name: '생전 마음돌봄 & 웰다잉 개인 상담',
        price: 90_000,
        duration: '50분',
        description: '죽음에 대한 실존적 불안 해소 및 가족 간 미완의 감정 화해'
      },
      {
        name: '환자 및 간병 보호자 동반 가족 심리케어',
        price: 150_000,
        duration: '80분',
        description: '환자와 보호자가 서로에게 남기고 싶은 진심을 편안히 나누는 치유 세션'
      }
    ],
    introduction:
      '인생의 마지막 계절을 평온하고 존엄하게 맞이할 수 있도록 곁에서 경청합니다. 두려움 대신 삶에 대한 감사와 평안으로 채워질 수 있도록 돕겠습니다.',
    attorneyLawAct34Compliant: true,
    platformReferralFee: 0,
    licenseVerified: true
  },
  {
    id: 'care-psy-03',
    vertical: 'PSYCHOLOGY_CARE',
    category: 'BEREAVEMENT_GRIEF',
    categoryName: '가족 트라우마 회복',
    name: '강서윤 부소장',
    title: '임상심리전문가 / 트라우마 치유 디렉터',
    organization: '연세 웰다잉 & 마음회복 클리닉 (서울 서대문)',
    licenseInfo: '한국임상심리학회 임상심리전문가 (제1503호)',
    experienceYears: 15,
    badge: '임상심리전문가 · 사별 트라우마',
    directPhone: '02-314-5510',
    virtualPhone: '0507-1854-9203',
    address: '서울특별시 서대문구 신촌로 115',
    specialties: [
      '갑작스러운 사고·돌연사 사별 트라우마 치유',
      '아동·청소년 유족을 위한 맞춤 놀이/미술 애도',
      '유족의 일상 업무 복귀(Return-to-work) 인지 프로그램'
    ],
    consultationFees: [
      {
        name: '사별 외상 트라우마 긴급 상담',
        price: 100_000,
        duration: '50분',
        description: '패닉, 불면, 지속적 플래시백에 대처하는 안정화 EMDR 및 이완 기법'
      }
    ],
    introduction:
      '예기치 못한 이별은 가족 전체를 흔듭니다. 남겨진 분들이 건강한 일상으로 걸어 나오실 수 있도록 든든한 디딤돌이 되어드립니다.',
    attorneyLawAct34Compliant: true,
    platformReferralFee: 0,
    licenseVerified: true
  },

  // ── [버티컬 2] 상속·유산·채무방어 전문 변호사 상담 ──────────
  {
    id: 'law-inh-01',
    vertical: 'LEGAL_INHERITANCE',
    category: 'ESTATE_DEBT_DEFENSE',
    categoryName: '빚 대물림 방지 (한정승인·상속포기)',
    name: '윤태호 대표변호사',
    title: '대한변호사협회 등록 상속 전문변호사',
    organization: '법무법인 정율 상속채무방어센터 (서울 서초)',
    licenseInfo: '대한변호사협회 등록 상속 전문 (제2015-88호) / 사법연수원 38기',
    experienceYears: 18,
    badge: '대한변협 등록 상속전문 · 3개월 골든타임 전담',
    directPhone: '02-535-9011',
    virtualPhone: '0507-1854-9301',
    address: '서울특별시 서초구 서초중앙로 156 (서초법조타운)',
    specialties: [
      '민법 제1019조 상속포기 / 한정승인 3개월 골든타임 신속 처리',
      '뒤늦게 알게 된 빚에 대한 특별한정승인 청구',
      '안심상속원스톱 서비스 조회 결과 채무 정밀 분석',
      '상속재산 파산 및 배당 청산 절차 완결'
    ],
    consultationFees: [
      {
        name: '30분 긴급 상속채무 진단 (전화/방문)',
        price: 50_000,
        duration: '30분',
        description: '안심상속 내역 검토 후 상속포기 vs 한정승인 최적 방안 1:1 제시'
      },
      {
        name: '가정법원 상속포기 / 한정승인 서류 일체 대리 (1인 기준 정찰제)',
        price: 330_000,
        duration: '접수부터 인용 판결까지',
        description: '인지대·송달료 포함, 법원 심판문 정본 수령 및 공고까지 완벽 대행'
      }
    ],
    introduction:
      '부모님이 남기신 빚으로 인해 자녀와 손자녀의 미래가 위협받아서는 안 됩니다. 사망일로부터 3개월이라는 법정 골든타임을 단 하루도 놓치지 않도록 신속하고 철저하게 방어합니다.',
    attorneyLawAct34Compliant: true,
    platformReferralFee: 0,
    licenseVerified: true
  },
  {
    id: 'law-inh-02',
    vertical: 'LEGAL_INHERITANCE',
    category: 'INHERITANCE_DISPUTE',
    categoryName: '상속재산분할 & 유류분 반환',
    name: '송치원 대표변호사',
    title: '대한변협 등록 가사·상속 전문변호사',
    organization: '법무법인 한울 상속분쟁조정센터 (서울 강남)',
    licenseInfo: '대한변호사협회 등록 가사·상속 전문 (제2009-41호) / 32년 법조 경력',
    experienceYears: 32,
    badge: '대한변협 32년 경력 · 가사상속 수석',
    directPhone: '02-562-7740',
    virtualPhone: '0507-1854-9302',
    address: '서울특별시 강남구 테헤란로 134 (역삼역)',
    specialties: [
      '공동상속인 간 상속재산분할 협의 및 가정법원 심판청구',
      '부모님 특별 부양에 따른 기여분(寄與分) 인정 소송',
      '생전 특정 자녀 증여에 대응한 유류분(遺留分) 반환 청구',
      '해외 거주 상속인이 포함된 복합 유산 분할 협의'
    ],
    consultationFees: [
      {
        name: '40분 1:1 심층 상속분쟁 법률자문',
        price: 100_000,
        duration: '40분',
        description: '부동산·금융자산 등 유산 명세 분석 및 소송 실익 사전 평가'
      },
      {
        name: '상속재산분할 협의서 작성 및 공증 검토',
        price: 550_000,
        duration: '작성 완료 시까지',
        description: '형제자매 간 후속 분쟁을 원천 차단하는 완전무결 합의서 작성'
      }
    ],
    introduction:
      '32년간 법정에서 목격한 가장 안타까운 일은 유산으로 인해 피를 나눈 가족이 갈라서는 것입니다. 가족 간 우애를 지키면서도 법적으로 온당한 권리를 찾을 수 있도록 지혜롭게 조율하겠습니다.',
    attorneyLawAct34Compliant: true,
    platformReferralFee: 0,
    licenseVerified: true
  },
  {
    id: 'law-inh-03',
    vertical: 'LEGAL_INHERITANCE',
    category: 'GUARDIANSHIP_WILL',
    categoryName: '성년후견 & 유언공증 & 디지털유산',
    name: '한혜진 파트너변호사',
    title: '가사전문변호사 / 세무사',
    organization: '법률사무소 다온 상속·후견 클리닉 (서울 송파)',
    licenseInfo: '대한변호사협회 등록 가사 전문 (제2018-125호) / 공인세무사 자격 보유',
    experienceYears: 16,
    badge: '가사전문변호사 & 공인세무사',
    directPhone: '02-418-6200',
    virtualPhone: '0507-1854-9303',
    address: '서울특별시 송파구 올림픽로 295 (잠실역)',
    specialties: [
      '고령 부모님 치매·투병 시 성년후견(成年後見) 개시 심판',
      '민법 규정 5대 방식(공정증서·자필증서 등) 유언장 적법성 감수',
      '디지털 유산(클라우드·포털 계정·암호화폐) 사후 승계 자문',
      '상속세·취득세 사전 절세 플래닝 및 세무서 신고 연계'
    ],
    consultationFees: [
      {
        name: '30분 성년후견 & 유언 적법성 자문',
        price: 50_000,
        duration: '30분',
        description: '후견인 선임 요건 검토 및 분쟁 없는 유언 방식 설계'
      },
      {
        name: '공증인가 유언공정증서 작성 원스톱 대행',
        price: 770_000,
        duration: '공증 완료 시까지',
        description: '공증사무소 동행, 증인 2인 섭외 및 법적 효력 완결 지원'
      }
    ],
    introduction:
      '생전에 명확한 유언과 후견 제도를 정비해두는 것은 남겨질 자녀들에게 전하는 가장 큰 사랑입니다. 세무사 자격을 겸비하여 세금 문제까지 한 번에 정리해 드립니다.',
    attorneyLawAct34Compliant: true,
    platformReferralFee: 0,
    licenseVerified: true
  }
];
