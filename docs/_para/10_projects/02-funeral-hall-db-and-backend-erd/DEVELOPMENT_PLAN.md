# Development Plan: Funeral Hall DB & Backend ERD Architecture

## 1. Technical Strategy
- **Architecture**: Domain-Driven Design (DDD) 기반 MSA(마이크로서비스) 지향 모듈러 모놀리스 / 이벤트 기반 아키텍처.
- **Data Tier**:
  - 관계형 DB (PostgreSQL): 장례식장 마스터, 회원, 계약, 긴급 출동, 에스크로 정산 트랜잭션.
  - NoSQL / 문서 DB (MongoDB / DynamoDB): 생애 연표 비정형 기록, 유품 메타데이터, 타임라인 이벤트.
  - 객체 스토리지 (AWS S3 / Cloudflare R2): 비파괴 디지털화 원본 미디어, 암호화 아카이브.
- **Tech Stack**: Node.js/TypeScript (or Spring Boot/Go), Prisma/TypeORM, Redis(출동 큐 및 위치 캐시), PostgreSQL.

## 2. Implementation Schedule
- **Phase 1**: 전국 장례식장 데이터 모델(기본정보, 시설료, 식음료, 할인율) 스키마 정의.
- **Phase 2**: 핵심 엔터티(User, Deceased, EmergencyDispatch, FuneralHall, MemorialArchive, PaymentEscrow) 간 ERD 설계.
- **Phase 3**: 데이터 수집/배치 파이프라인(e하늘 API 연동 및 데이터 무결성 검증 배치) 구조 설계.

## 3. Testing & Integrity Strategy
- **Data Schema Validation**: 전국 장례식장 시뮬레이션 데이터 1,200여 개소 스키마 정합성 검증.
- **Transaction Concurrency Test**: 긴급 출동 접수 및 지도사 배정 시 Race Condition 방지(분산 락) 검증.
