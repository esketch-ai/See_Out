import {
  LegalDocument,
  LegalDocumentType,
  LegalComplianceSummary
} from './types.js';
import { LEGAL_DOCUMENTS_DATASET } from './legalDocumentsDataset.js';

/**
 * 배웅(BAEUNG) 약관 및 법률 컴플라이언스 서비스
 * 30년+ 전문 변호인단 법률 감수 체계
 */
export class LegalService {
  private static documents: LegalDocument[] = [...LEGAL_DOCUMENTS_DATASET];

  /**
   * 전체 법률 약관 규정 목록 조회
   */
  public static getAllDocuments(): LegalDocument[] {
    return this.documents;
  }

  /**
   * 문서 유형별 약관 상세 조회
   */
  public static getDocumentByType(type: LegalDocumentType): LegalDocument | undefined {
    return this.documents.find((doc) => doc.type === type);
  }

  /**
   * 약관 본문 키워드 검색
   */
  public static searchLegalContent(keyword: string): {
    documentTitle: string;
    documentType: LegalDocumentType;
    matchedArticle: string;
    snippet: string;
  }[] {
    const q = keyword.trim().toLowerCase();
    if (!q) return [];

    const results: {
      documentTitle: string;
      documentType: LegalDocumentType;
      matchedArticle: string;
      snippet: string;
    }[] = [];

    for (const doc of this.documents) {
      if (doc.preamble.toLowerCase().includes(q)) {
        results.push({
          documentTitle: doc.title,
          documentType: doc.type,
          matchedArticle: '전문(Preamble)',
          snippet: doc.preamble
        });
      }

      for (const sec of doc.sections) {
        for (const p of sec.paragraphs) {
          if (p.toLowerCase().includes(q)) {
            results.push({
              documentTitle: doc.title,
              documentType: doc.type,
              matchedArticle: sec.articleNumber,
              snippet: p
            });
          }
        }
        if (sec.notes) {
          for (const n of sec.notes) {
            if (n.toLowerCase().includes(q)) {
              results.push({
                documentTitle: doc.title,
                documentType: doc.type,
                matchedArticle: `${sec.articleNumber} [특약/단서]`,
                snippet: n
              });
            }
          }
        }
      }
    }

    return results;
  }

  /**
   * 5대 법률 준수 매트릭스 요약 반환
   */
  public static getStatutoryComplianceSummary(): LegalComplianceSummary[] {
    return [
      {
        lawName: '개인정보 보호법',
        enactedStandard: '개인정보 보호법 제30조 및 동법 시행령',
        complianceMechanism: 'CPO 지정, 암호화 전송(TLS 1.3), 영구삭제 파기 프로토콜 구축',
        status: 'VERIFIED_COMPLIANT'
      },
      {
        lawName: '통신비밀보호법',
        enactedStandard: '통신비밀보호법 제3조 (통화내용 감청 금지)',
        complianceMechanism: '0507 가상번호 중계 시 음성 녹음 일체 미실시(recordingDisabled: true)',
        status: 'VERIFIED_COMPLIANT'
      },
      {
        lawName: '독점규제 및 공정거래에 관한 법률',
        enactedStandard: '공정거래위원회 2026.03 장례 리베이트 근절 지침',
        complianceMechanism: '알선 수수료 0원, 월 300,000원 100% 정액 광고 계약 체결',
        status: 'VERIFIED_COMPLIANT'
      },
      {
        lawName: '장사 등에 관한 법률',
        enactedStandard: '장사법 제15조·제16조·제29조',
        complianceMechanism: '장례식장·봉안당·자연장지 지자체 인허가 필증 전수 등록 및 검증',
        status: 'VERIFIED_COMPLIANT'
      },
      {
        lawName: '민법 (상속편)',
        enactedStandard: '민법 제1060조 (유언의 요식성)',
        complianceMechanism: '디지털 엔딩노트의 도덕적 소망 성격 및 법적 유언 분할과의 구별 명문화',
        status: 'VERIFIED_COMPLIANT'
      }
    ];
  }
}
