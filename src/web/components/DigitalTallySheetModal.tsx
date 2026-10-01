import React, { useState } from 'react';
import {
  FileCheck2,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Calendar,
  CreditCard,
  UserCheck,
  AlertTriangle,
  Scale
} from 'lucide-react';
import { ModalShell, ModalToolbar } from './ModalShell.js';

interface DigitalTallySheetModalProps {
  packageName?: string;
  packagePrice?: number;
  hallName?: string;
  directorName?: string;
  onClose: () => void;
}

interface TallyItem {
  category: string;
  name: string;
  standardSpec: string;
  promisedCost: number;
  actualCost: number;
  verified: boolean;
  note: string;
}

export const DigitalTallySheetModal: React.FC<DigitalTallySheetModalProps> = ({
  packageName = '가족장 180만 원 정찰제 패키지',
  packagePrice = 1800000,
  hallName = '서울아산병원 장례식장',
  directorName = '김진우 수석 장례지도사 (자격 제11-0421호)',
  onClose
}) => {
  const [items, setItems] = useState<TallyItem[]>([
    {
      category: '1. 빈소 및 안치실',
      name: '빈소 사용료 및 안치실료 (3일장)',
      standardSpec: '배웅 사전등록 제휴 30% 감면 적용',
      promisedCost: 0,
      actualCost: 0,
      verified: true,
      note: '식장 직결정산 (배웅 30% 감면 승인)'
    },
    {
      category: '2. 관 및 수의',
      name: '전통 오동나무 1.5치 규격관 & 명품 삼베 수의',
      standardSpec: '국산 100% 마사 천연 직조 삼베 수의 일체',
      promisedCost: 0,
      actualCost: 0,
      verified: true,
      note: '패키지 기본 포함 (현장 업셀링 0원)'
    },
    {
      category: '3. 제단 꽃장식',
      name: '2단 대형 생화 제단 국화·백합 장식',
      standardSpec: '당일 새벽 경매 특상급 생화 300송이 이상',
      promisedCost: 0,
      actualCost: 0,
      verified: true,
      note: '실물 규격 확인 완료 (추가금 0원)'
    },
    {
      category: '4. 운구 차량',
      name: '최고급 특수 장의 리무진 & 45인승 대형 버스',
      standardSpec: '고인 및 유족 전국 무료 운구 (왕복 지원)',
      promisedCost: 0,
      actualCost: 0,
      verified: true,
      note: '시외 할증 0원 면제 보증'
    },
    {
      category: '5. 조문객 식음료',
      name: '식음료 실소비 검수 (밥, 육개장, 3색전, 편육)',
      standardSpec: '개봉 전 완제품 박스 100% 반품 공제',
      promisedCost: 0,
      actualCost: 0,
      verified: true,
      note: '미개봉 식자재 전액 반품 공제 처리'
    },
    {
      category: '6. 의전 인력 및 용품',
      name: '국가공인 1급 지도사 전담 의전 & 소모품 30종',
      standardSpec: '수시포, 결관바, 위패, 혼백, 상복 일체',
      promisedCost: packagePrice,
      actualCost: packagePrice,
      verified: true,
      note: '정찰제 약정 금액 100% 일치'
    }
  ]);

  const [bereavedSigned, setBereavedSigned] = useState(true);
  const [directorSigned, setDirectorSigned] = useState(true);

  const totalPromised = packagePrice;
  const totalActual = items.reduce((acc, cur) => acc + cur.actualCost, 0);
  const extraFee = totalActual - totalPromised;

  const handlePrint = () => {
    window.print();
  };

  return (
    <ModalShell
      onClose={onClose}
      maxWidth="max-w-4xl"
      surface="paper"
      serif
      titleId="tally-sheet-title"
      descriptionId="tally-sheet-desc"
    >
      <ModalToolbar
        titleId="tally-sheet-title"
        descriptionId="tally-sheet-desc"
        onClose={onClose}
        closeLabel="검수표 닫기"
        icon={
          <div className="w-8 h-8 rounded-full bg-[#19382C] text-[#C2A26A] flex items-center justify-center border border-[#2D4F43] shrink-0">
            <FileCheck2 className="w-4 h-4" />
          </div>
        }
        title={<span className="text-lg font-reverence font-bold text-[#FAF9F6]">현장 추가금 제로 실시간 디지털 지출 검수표</span>}
        subtitle="사전 약정 정찰가와 현장 실청구액을 실시간 검증하여 부당 추가금을 원천 차단합니다."
      >
        <button
          type="button"
          onClick={handlePrint}
          className="px-3.5 py-2 bg-[#19382C] hover:bg-[#2D4F43] text-white rounded-md font-serif font-bold text-[0.8125rem] flex items-center space-x-1.5 transition-colors cursor-pointer border border-[#2D4F43]"
        >
          <Printer className="w-4 h-4 text-[#C2A26A]" />
          <span>검수표 인쇄 / PDF</span>
        </button>
      </ModalToolbar>

      <div className="p-4 sm:p-8 space-y-6 bg-[#FAF9F6] overflow-y-auto max-h-[85vh]">
        {/* 상단 검수 요약 대시보드 */}
        <div className="bg-white p-6 rounded-2xl border-2 border-[#19382C] shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#DCD6C9] pb-4 gap-2">
            <div>
              <span className="text-[0.8125rem] font-bold text-[#6E5429]">
                Zero-Extra-Fee Certified Tally Sheet
              </span>
              <h3 className="font-reverence font-black text-xl text-[#151719] mt-0.5">
                {packageName} 현장 실시간 정산 검수
              </h3>
              <p className="text-[0.8125rem] text-[#5A5E66] mt-0.5">
                장례식장: <strong>{hallName}</strong> · 담당 지도사: <strong>{directorName}</strong>
              </p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center space-x-1 px-3 py-1 bg-[#19382C] text-[#DCE8E2] rounded-full text-[0.8125rem] font-bold border border-[#2D4F43]">
                <ShieldCheck className="w-4 h-4 text-[#C2A26A]" />
                <span>추가금 제로 안심 보증</span>
              </span>
            </div>
          </div>

          {/* 3대 금액 비교 그리드 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[0.8125rem]">
            <div className="p-4 bg-[#FAF9F6] rounded-xl border border-[#DCD6C9] space-y-1">
              <span className="text-[#5A5E66] block font-bold">1. 사전 약정 정찰 패키지가</span>
              <span className="text-2xl font-reverence font-black text-[#151719]">
                {totalPromised.toLocaleString()}원
              </span>
              <span className="text-[0.8125rem] text-[#5A5E66] block">계약 시 확정된 정찰가</span>
            </div>

            <div className="p-4 bg-[#FAF9F6] rounded-xl border border-[#DCD6C9] space-y-1">
              <span className="text-[#5A5E66] block font-bold">2. 현장 실검수 청구 총액</span>
              <span className="text-2xl font-reverence font-black text-[#19382C]">
                {totalActual.toLocaleString()}원
              </span>
              <span className="text-[0.8125rem] text-[#19382C] font-bold block">전 항목 규격 일치 확인</span>
            </div>

            <div className="p-4 bg-[#19382C] text-white rounded-xl border border-[#2D4F43] space-y-1">
              <span className="text-[#DCE8E2] block font-bold">3. 현장 부당 추가금 차액</span>
              <span className="text-2xl font-reverence font-black text-[#C2A26A]">
                {extraFee === 0 ? '0원 (추가금 제로)' : `${extraFee.toLocaleString()}원`}
              </span>
              <span className="text-[0.8125rem] text-[#FAF9F6] block">불법 업셀링 100% 방지</span>
            </div>
          </div>
        </div>

        {/* 세부 항목별 검수 테이블 */}
        <div className="bg-white rounded-2xl border border-[#DCD6C9] overflow-hidden shadow-xs text-[0.8125rem]">
          <div className="p-4 bg-[#FAF9F6] border-b border-[#DCD6C9] flex items-center justify-between">
            <h4 className="font-reverence font-bold text-base text-[#151719]">
              장례 3일 전 항목 실시간 검수 명세서
            </h4>
            <span className="text-[0.8125rem] text-[#5A5E66]">
              유족 승인 없는 임의 추가 항목 절대 불가
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left divide-y divide-[#DCD6C9]">
              <thead className="bg-[#FAF9F6] font-bold text-[#151719]">
                <tr>
                  <th className="p-3">항목 분류</th>
                  <th className="p-3">검수 내용 및 정본 규격</th>
                  <th className="p-3 text-center">검수 상태</th>
                  <th className="p-3 text-right">현장 실비 청구</th>
                  <th className="p-3">비고 / 보증 내용</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#DCD6C9]">
                {items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#FAF9F6]/50 transition-colors">
                    <td className="p-3 font-bold text-[#151719] whitespace-nowrap">{item.category}</td>
                    <td className="p-3 space-y-0.5">
                      <p className="font-bold text-[#151719]">{item.name}</p>
                      <p className="text-[0.8125rem] text-[#5A5E66]">{item.standardSpec}</p>
                    </td>
                    <td className="p-3 text-center whitespace-nowrap">
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-[#19382C]/10 text-[#19382C] font-bold text-[0.8125rem] border border-[#19382C]/20">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>규격 검수필</span>
                      </span>
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-[#151719] whitespace-nowrap">
                      {item.actualCost > 0 ? `${item.actualCost.toLocaleString()}원` : '패키지 포함 (0원)'}
                    </td>
                    <td className="p-3 text-[#5A5E66] whitespace-nowrap">{item.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 양방향 전자 서명 및 공인 날인 박스 */}
        <div className="bg-white p-6 rounded-2xl border border-[#DCD6C9] shadow-xs space-y-4">
          <div className="border-b border-[#DCD6C9] pb-3 flex items-center justify-between">
            <h4 className="font-reverence font-bold text-base text-[#151719] flex items-center space-x-2">
              <UserCheck className="w-5 h-5 text-[#19382C]" />
              <span>상주(유족) & 전담 장례지도사 양방향 전자 승인 날인</span>
            </h4>
            <span className="text-[0.8125rem] text-[#6E5429] font-bold">
              법적 효력 검수 완료
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[0.8125rem]">
            {/* 상주 확인 날인 */}
            <div className="p-4 bg-[#FAF9F6] rounded-xl border border-[#DCD6C9] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#151719]">1. 계약 상주(유족) 서명 확인</span>
                <span className="text-[0.8125rem] text-[#19382C] font-bold">승인 완료</span>
              </div>
              <p className="text-[#5A5E66]">
                "본인은 상기 지출 내역을 현장에서 실물 대조 확인하였으며, 약정 정찰가 외 부당한 추가금이 일체 없음을 확인합니다."
              </p>
              <div className="pt-2 flex items-center justify-between border-t border-[#DCD6C9]">
                <span className="font-bold text-[#151719]">상주 김성수 (전자서명)</span>
                <span className="k-seal-red px-2 py-0.5 text-[0.8125rem]">서명필</span>
              </div>
            </div>

            {/* 지도사 확인 날인 */}
            <div className="p-4 bg-[#FAF9F6] rounded-xl border border-[#DCD6C9] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#151719]">2. 국가공인 1급 지도사 서명 확인</span>
                <span className="text-[0.8125rem] text-[#19382C] font-bold">보증 완료</span>
              </div>
              <p className="text-[#5A5E66]">
                "본 지도사는 배웅의 정찰제 헌장을 준수하여 규격품만을 정직하게 제공하였으며, 촌지나 수수료를 수수하지 않았음을 서약합니다."
              </p>
              <div className="pt-2 flex items-center justify-between border-t border-[#DCD6C9]">
                <span className="font-bold text-[#151719]">{directorName}</span>
                <span className="k-seal-red px-2 py-0.5 text-[0.8125rem]">검수필</span>
              </div>
            </div>
          </div>
        </div>

        {/* 배웅 추가금 제로 헌장 */}
        <div className="p-4 bg-[#FAF9F6] rounded-xl border border-[#DCD6C9] text-[0.8125rem] text-[#5A5E66] text-center space-y-1">
          <p className="font-bold text-[#151719]">
            배웅의 약속: 만일 현장에서 유족의 사전 서면 동의 없이 부당 추가금이 청구되었을 경우 100% 전액 환불 보상합니다.
          </p>
          <p>
            공정거래위원회 표준약관 및 소비자분쟁해결기준 준수 (24시간 신고 핫라인: 1588-0000)
          </p>
        </div>
      </div>
    </ModalShell>
  );
};
