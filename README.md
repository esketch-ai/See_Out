# 배웅 (Bae-ung / SeeOut) 플랫폼

> **선불식 상조의 거품과 관행을 혁신하는 투명 원가 기반 라이프엔딩 종합 플랫폼**

배웅(Bae-ung)은 선불식 상조회사의 부조리한 유통 마진과 현장 추가금 관행을 근절하고, **투명한 원가 공개와 실비 기반 후불제 서비스**, 그리고 **생애기록관(사전 아카이빙) & 1초 긴급 출동 핫라인(사후 대응)**을 제공하는 차세대 라이프엔딩 플랫폼입니다.

---

## 🏛️ 주요 핵심 기능 및 시스템 구조

1. **듀얼 모드 UI/UX 아키텍처 (Dual-Mode)**
   - **평시 모드 (Pre-mortem)**: 생애기록관 타임라인(디지털 유언, 자서전, 추억 아카이빙), 상조 견적 진단기
   - **비상 모드 (Per-mortem)**: 임종 발생 시 복잡한 메뉴를 숨기고 단 30초 내 배정 완료되는 1초 긴급 출동 뷰

2. **상조 견적 진단기 & 영수증 손익 비교 엔진**
   - 기존 대형 상조 가입 증서 Vision OCR 자동 판독
   - 공정거래위원회 고시 법정 해약환급금 자동 산출 산식 탑재
   - 수의/관/제단꽃/차량 추가금 연산 및 1:1 맞춤 영수증 좌우 비교표 생성

3. **전국 1,200+ 장례식장 데이터 레이크 & 초저지연 관제**
   - 보건복지부 e하늘 장례정보시스템 API 연동 및 정찰 단가/시설비 DB 구축
   - 유족 위치 기반 2시간 내 도착 권역별 전담 장례지도사 관제 네트워크

---

## 📂 저장소 구조 (Themis-AI PARA 기반)

본 프로젝트는 고도화된 지식 및 프로젝트 거버넌스를 위해 [Themis-AI](https://github.com/esketch-ai/Themis-AI.git)의 PARA 시스템을 채택하고 있습니다.

```text
SeeOut/
├── docs/
│   ├── _para/
│   │   ├── 10_projects/      # 3대 핵심 서브도메인 프로젝트 명세
│   │   │   ├── 01-uiux-dualmode-architecture/
│   │   │   ├── 02-funeral-hall-db-and-backend-erd/
│   │   │   └── 03-quote-diagnostics-and-ocr-calculator/
│   │   ├── 20_areas/         # 거버넌스 및 문서화 시스템 정책
│   │   ├── 30_resources/     # 원천 기획안 및 분석 리소스
│   │   └── 40_archive/       # 완료된 아카이브
│   ├── 기본 계획.md
│   └── 기존 상조 해약 전환 방법안.md
├── tools/
│   └── themis-ai/            # Themis-AI 엔진 (Git Submodule)
├── .themisrc.json            # Themis-AI 환경 설정
└── package.json
```

---

## 🛠️ Themis-AI 지식 관리 명령어

```bash
# PARA 프로젝트 현황 및 완료율 확인
npm run themis:projects

# PARA 구조 무결성 및 적합성 검증
npm run themis:integrity
```