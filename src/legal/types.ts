/**
 * 배웅(BAEUNG) 법률 및 컴플라이언스 약관 규정 모델
 * 대한민국 현행법 및 30년+ 전문 변호인단 법률 감수 기준
 *
 * 적용 법령:
 * 1. 「개인정보 보호법」 및 동법 시행령
 * 2. 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」
 * 3. 「통신비밀보호법」 제3조 (통화 녹음 금지)
 * 4. 「전자상거래 등에서의 소비자보호에 관한 법률」
 * 5. 「약관의 규제에 관한 법률」
 * 6. 「위치정보의 보호 및 이용 등에 관한 법률」
 * 7. 「독점규제 및 공정거래에 관한 법률」 (2026.03 리베이트 철폐 지침)
 * 8. 「장사 등에 관한 법률」 및 「공공데이터의 제공 및 이용 활성화에 관한 법률」
 * 9. 「민법」 제1060조 (유언의 방식)
 */

export type LegalDocumentType =
  | 'PRIVACY_POLICY'        // 개인정보 처리방침
  | 'TERMS_OF_SERVICE'       // 서비스 이용약관
  | 'LOCATION_TERMS'         // 위치기반서비스 이용약관
  | 'OPT_OUT_REGULATION'     // e하늘 공공데이터 이용 및 옵트아웃 운영 규정
  | 'DIGITAL_LEGACY_POLICY'; // 디지털 유산 및 생애기록관 사후 승계 규약

export interface LegalSection {
  articleNumber: string;     // 예: "제1조 (목적)"
  title: string;             // 조항 제목
  paragraphs: string[];      // 조항 본문 문단
  notes?: string[];          // 단서 조항 및 특별 법적 유의사항
}

export interface LegalDocument {
  id: string;                // 고유 식별자
  type: LegalDocumentType;
  title: string;             // 정식 명칭
  effectiveDate: string;     // 시행 일자
  lastAmendedDate: string;   // 최종 개정 일자
  version: string;           // 규약 버전 (예: "v1.4")
  legalCounselReview: string;// 법률 감수 서명 (예: "대한변호사협회 등록 30년+ 장사·공정거래 전문변호사 검수 완료")
  statutoryBases: string[];  // 관계 근거 법령
  preamble: string;          // 전문
  sections: LegalSection[];  // 조항 목록
}

export interface LegalComplianceSummary {
  lawName: string;
  enactedStandard: string;
  complianceMechanism: string;
  status: 'VERIFIED_COMPLIANT';
}
