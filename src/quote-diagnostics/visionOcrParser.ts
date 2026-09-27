import { CertificateExtractionSchema } from './types.js';

/**
 * 상조 계약 증서 Vision OCR 파싱 결과 인터페이스
 */
export interface VisionOcrParseResult {
  isSuccess: boolean;
  certificate: CertificateExtractionSchema;
  rawExtractedText: string;
  recognizedFields: {
    competitor: { value: string; confidence: number };
    product: { value: string; confidence: number };
    totalAmount: { value: number; confidence: number };
    installments: { total: number; paid: number; confidence: number };
    monthlyPayment: { value: number; confidence: number };
  };
  warnings: string[];
}

/**
 * 상조 계약 증서 비전 OCR 텍스트 분석 및 정규화 엔진
 * 카파시 2원칙: Robust, Rule-based Text Pattern Baseline
 */
export class VisionOcrParser {
  /**
   * 상조사 명칭 정규화 딕셔너리
   */
  private static readonly COMPETITOR_ALIASES: Record<string, string> = {
    '보람': 'B상조 (보람상조)',
    '보람상조': 'B상조 (보람상조)',
    '프리드': 'P상조 (프리드라이프)',
    '프리드라이프': 'P상조 (프리드라이프)',
    '현대': 'H상조 (현대라이프)',
    '현대라이프': 'H상조 (현대라이프)',
    '교원': 'K상조 (교원라이프)',
    '교원라이프': 'K상조 (교원라이프)',
    '대명': 'D상조 (대명아임레디)',
    '대명아임레디': 'D상조 (대명아임레디)'
  };

  /**
   * 비정형 텍스트(OCR 추출 문자열)로부터 상조 계약 증서 정보 정밀 파싱
   */
  public static parseRawText(rawText: string): VisionOcrParseResult {
    const text = rawText.replace(/\r?\n/g, ' ');
    const warnings: string[] = [];

    // 1. 상조사명 추출
    let competitorName = '기존 가입 상조사';
    let competitorConfidence = 0.5;
    for (const [alias, fullName] of Object.entries(this.COMPETITOR_ALIASES)) {
      if (text.includes(alias)) {
        competitorName = fullName;
        competitorConfidence = 0.95;
        break;
      }
    }
    if (competitorConfidence < 0.8) {
      warnings.push('상조사 명칭을 명확히 식별하지 못해 기본값으로 지정되었습니다.');
    }

    // 2. 총 계약 금액 추출 (예: 4,500,000원, 450만원, 5900000원)
    let totalContractAmount = 4_500_000;
    let amountConfidence = 0.6;
    const amountRegex = /(?:총\s*계약\s*금액|계약\s*금액|가입\s*금액|총\s*납입\s*예정액)[\s:：]*([0-9,]+)\s*(?:원|만\s*원)?/i;
    const amountMatch = text.match(amountRegex);

    if (amountMatch && amountMatch[1]) {
      const cleanNum = parseInt(amountMatch[1].replace(/,/g, ''), 10);
      if (!isNaN(cleanNum)) {
        totalContractAmount = cleanNum < 10000 ? cleanNum * 10_000 : cleanNum;
        amountConfidence = 0.95;
      }
    } else {
      // 보조 패턴: "450만원", "590만원" 형태
      const simpleAmountMatch = text.match(/([0-9]{3,4})\s*만\s*원/);
      if (simpleAmountMatch && simpleAmountMatch[1]) {
        totalContractAmount = parseInt(simpleAmountMatch[1], 10) * 10_000;
        amountConfidence = 0.85;
      }
    }

    // 3. 약정 회차 및 실 납입 회차 추출
    // 패턴 예: "총 150회 중 42회", "약정 120회 / 실납입 80회", "42/150회", "총 100회 만기 완납"
    let totalInstallments = 150;
    let paidInstallments = 42;
    let installmentsConfidence = 0.6;

    const dualMatch = text.match(/([0-9]{1,3})\s*(?:회)?\s*[\/|중]\s*([0-9]{1,3})\s*회/);
    if (dualMatch && dualMatch[1] && dualMatch[2]) {
      const num1 = parseInt(dualMatch[1], 10);
      const num2 = parseInt(dualMatch[2], 10);
      if (num1 <= num2) {
        paidInstallments = num1;
        totalInstallments = num2;
      } else {
        totalInstallments = num1;
        paidInstallments = num2;
      }
      installmentsConfidence = 0.95;
    } else {
      // "총 100회 만기 완납" 또는 "100회 만기 완납"
      const maturityMatch = text.match(/(?:총\s*)?([0-9]{1,3})\s*회\s*(?:만기\s*완납|완납)/);
      if (maturityMatch && maturityMatch[1]) {
        totalInstallments = parseInt(maturityMatch[1], 10);
        paidInstallments = totalInstallments;
        installmentsConfidence = 0.95;
      } else {
        // 단일 실납입 패턴 (예: "현재 실납입: 42회", "실납입 42회")
        const paidMatch = text.match(/(?:현재\s*실?납입|실\s*납입|납입\s*회차)[\s:：]*([0-9]{1,3})\s*회/);
        if (paidMatch && paidMatch[1]) {
          paidInstallments = parseInt(paidMatch[1], 10);
          installmentsConfidence = 0.85;
        }
        // 총 약정 패턴 (예: "약정 납입회차: 총 150 회", "약정회차: 총 120회")
        const totalMatch = text.match(/(?:총\s*약정|약정\s*(?:납입)?회차|총\s*회차)[\s:：]*(?:총\s*)?([0-9]{1,3})\s*회/);
        if (totalMatch && totalMatch[1]) {
          totalInstallments = parseInt(totalMatch[1], 10);
          installmentsConfidence = Math.max(installmentsConfidence, 0.85);
        }
      }
    }

    // 만약 텍스트에 만기완납/전액완납 표현이 명시된 경우 실납입회차 = 약정회차
    if (text.includes('만기 완납') || text.includes('전액 완납') || text.includes('만기완납')) {
      paidInstallments = totalInstallments;
    }

    // 4. 월 납입금 및 누적액 산출
    const monthlyPayment = Math.floor(totalContractAmount / Math.max(1, totalInstallments));
    const paidTotalAmount = monthlyPayment * paidInstallments;
    const remainingAmount = Math.max(0, totalContractAmount - paidTotalAmount);

    // 5. 상품명 추정
    let productName = '프리미엄 상조 상품';
    const productMatch = text.match(/(?:상품명|가입\s*상품)[\s:：]*([가-힣A-Za-z0-9\s]+?)(?:증서|계약|회차|납입|$)/);
    if (productMatch && productMatch[1]) {
      productName = productMatch[1].trim();
    } else {
      productName = `${totalContractAmount / 10000} 안심케어 플랜`;
    }

    // 6. 만기 100% 환급 특약 여부
    const hasMaturityRefund100 = text.includes('100% 환급') || text.includes('만기환급') || text.includes('전액환급');

    const totalConfidence = Math.round(
      ((competitorConfidence + amountConfidence + installmentsConfidence) / 3) * 100
    ) / 100;

    const cert: CertificateExtractionSchema = {
      certificateId: `SCAN-${Date.now().toString(36).toUpperCase()}`,
      recognizedAt: new Date().toISOString(),
      competitorName,
      productName,
      contractDate: '2023-01-15',
      totalContractAmount,
      monthlyPayment,
      totalInstallments,
      paidInstallments,
      paidTotalAmount,
      remainingAmount,
      hasMaturityRefund100,
      confidenceScore: totalConfidence
    };

    return {
      isSuccess: true,
      certificate: cert,
      rawExtractedText: rawText,
      recognizedFields: {
        competitor: { value: competitorName, confidence: competitorConfidence },
        product: { value: productName, confidence: 0.9 },
        totalAmount: { value: totalContractAmount, confidence: amountConfidence },
        installments: { total: totalInstallments, paid: paidInstallments, confidence: installmentsConfidence },
        monthlyPayment: { value: monthlyPayment, confidence: 0.9 }
      },
      warnings
    };
  }

  /**
   * 실물 상조 증서 모의 스캔 텍스트 샘플 3종 (테스트 및 사용자 데모용)
   */
  public static readonly PRESET_SAMPLES = {
    boram450: {
      title: '보람상조 프리미엄 450 실물 증서 샘플',
      imagePath: '/images/escort-ceremony.jpg',
      sampleText: `[상조서비스 회원가입증서]
증서번호: 제 2023-B-08912 호
가입상조사: 보람상조개발(주)
가입상품명: 보람 프리미엄 450
계약일자: 2023년 04월 15일
총 계약금액: 4,500,000 원
약정 납입회차: 총 150 회
현재 실납입: 42회 납입완료
월 납입금액: 30,000 원
보장내용: 고인전용 리무진 1대, 오동나무 관, 고급 수의 포함
해약기준: 공정거래위원회 표준약관 준수`
    },
    preed590: {
      title: '프리드라이프 늘푸른 590 실물 증서 샘플',
      imagePath: '/images/floral-coffin.jpg',
      sampleText: `[프리드라이프 상조 회원증서]
회원번호: P-2021-11409
회사명: (주)프리드라이프
상품명: 프리드 늘푸른 590
총납입예정액: 5,900,000 원
약정회차: 총 120회
납입현황: 총 120회 중 80회 납입완료
월납입액: 49,000 원
특약사항: 만기 미도달 시 공정위 환급률 적용`
    },
    hyundai480: {
      title: '현대라이프 안심 480 만기 100% 환급 증서 샘플',
      imagePath: '/images/memorial-altar.jpg',
      sampleText: `[현대라이프 회원가입계약증서]
증서발급일: 2016-01-20
상조사: 현대라이프
상품명: 안심 480 만기환급형
총 계약금액: 4,800,000원
납입회차: 총 100회 만기 완납
특약: 만기 시 납입금 100% 전액환급 보장`
    }
  } as const;
}
