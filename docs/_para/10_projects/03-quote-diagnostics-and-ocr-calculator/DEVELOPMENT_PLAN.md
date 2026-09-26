# Development Plan: Quote Diagnostics & OCR Calculator Engine

## 1. Technical Strategy
- **Vision OCR**: LLM 멀티모달 비전 + 룰베이스 정규식 파서 결합을 통한 증서 필드 정밀 추출.
- **Financial Calculation Engine**: 공정위 고시 `선불식 할부계약의 해약환급금 산정기준` 공식(모집수수료 공제율, 월부금 환급률) 완전 수식화.

## 2. Implementation Schedule
- **Phase 1**: 국내 주요 상조 10개사 상품 표준 데이터베이스 및 환급률 테이블 구축.
- **Phase 2**: 증서 OCR 파서 및 비정형 이미지 전처리(왜곡 보정, 노이즈 제거) 파이프라인.
- **Phase 3**: 실시간 견적 산출 및 대조 영수증 생성 JSON Schema API 구현.

## 3. Testing Strategy
- **Accuracy Test**: 실제 상조 증서 샘플 100건 대상 OCR 필드 추출 정확도 99% 이상 검증.
- **Calculation Verification**: 공정위 기준 수기 계산 결과와 자동 산출 결과 간 오차 0원 검증.
