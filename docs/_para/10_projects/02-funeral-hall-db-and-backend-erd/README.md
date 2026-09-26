# Funeral Hall DB & Backend ERD Architecture
Status: Completed
Assignee: @박현철_박사

## Overview
전국 장례식장 데이터(e하늘 공공 API + 파트너십 크롤링) 파이프라인 구축 및 배웅 플랫폼의 5대 Bounded Context(생애기록, 긴급출동, 상조진단, 장례의전, 에스크로 정산)를 수용하는 고가용성 백엔드 ERD 및 시스템 아키텍처 모델링.

## Key Deliverables
- [x] Task 1: 전국 장례식장 인프라 및 단가 데이터 스키마 정의 (시설비, 식음료, 제휴할인)
- [x] Task 2: e하늘 정보시스템 공공 API 및 외부 데이터 수집/정제 파이프라인 설계
- [x] Task 3: 도메인 주도 설계(DDD) 기반 5대 핵심 서브도메인 경계 정의
- [x] Task 4: 엔터프라이즈 백엔드 관계형/문서형 통합 ERD (PostgreSQL + MongoDB/S3) 설계
- [x] Task 5: 24/365 긴급 출동 관제(WebSocket/Event-Driven) 및 생애기록 WORM 스토리지 분산 아키텍처 수립

## References
- `docs/_para/10_projects/02-funeral-hall-db-and-backend-erd/BACKEND_ERD_SPECIFICATION.md`
- `docs/_para/30_resources/01_기본계획_원문.md`
- `docs/_para/30_resources/04_전국장례식장현황_참조.gdoc`
- `docs/_para/20_areas/advisory-board-governance.md`
