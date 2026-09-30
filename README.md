# 배웅 (Bae-ung / SeeOut) 플랫폼

> **"투명함이 가장 큰 위로가 되도록"**  
> 선불식 상조의 거품과 불법 리베이트 관행을 혁신하는 대한민국 최초의 공공데이터 기반 장례·추모 통합 플랫폼

[![English Version](https://img.shields.io/badge/Language-English%20README-19382C.svg)](./README.en.md)
[![Verification](https://img.shields.io/badge/Verification-100%25%20Passed-19382C.svg)](#검증-체계)
[![Senior A11y](https://img.shields.io/badge/Senior%20A11y-13px%20Floor-C2A26A.svg)](#노안-유족-접근성-n-7)

---

![배웅 플랫폼 개요](./docs/images/baeung_platform_overview.jpg)

---

## 📖 문서 가이드 바로가기
- 🇰🇷 **공식 소개서 (구글 슬라이드 5P 가이드)**: [`docs/배웅_플랫폼_소개서_5P_가이드북.md`](./docs/배웅_플랫폼_소개서_5P_가이드북.md)
- 🇺🇸 **English Guidebook (5-Slide Deck)**: [`docs/baeung_platform_guide_5p_en.md`](./docs/baeung_platform_guide_5p_en.md)
- 📊 **1단계 시범 사업 완료 보고서**: [`docs/배웅_1단계_사업계획서_요약.md`](./docs/배웅_1단계_사업계획서_요약.md)

---

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