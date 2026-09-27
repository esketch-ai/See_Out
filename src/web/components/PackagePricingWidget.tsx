import React, { useState } from 'react';
import {
  ChevronDown,
  Info,
  ShieldCheck,
  Sparkles,
  Users,
  Car,
  Clock,
  Phone,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Sliders,
  Eye,
  X,
  FileCheck,
  Award,
  Layers,
  ZoomIn
} from 'lucide-react';
import { BAEUNG_PACKAGES, BaeungPackageType, BaeungPackageInfo } from '../../quote-diagnostics/index.js';
import { TraditionalSeal } from '../design-system/index.js';
import { ModalShell, ModalToolbar } from './ModalShell.js';

interface VisualProductDetail {
  id: string;
  name: string;
  category: string;
  image: string;
  tagline: string;
  description: string;
  specs: { label: string; value: string }[];
  antiUpsellingTip: string;
  originBadge: string;
}

const VISUAL_PRODUCTS: VisualProductDetail[] = [
  {
    id: 'shroud',
    name: '대마 100% 특등 수의(壽衣) & 공인 원산지 보증서',
    category: '고인 용품',
    image: '/images/funeral-shroud.jpg',
    tagline: '거품과 속임 없는 천연 삼베 100% 정품 수의',
    description:
      '유족들이 가장 두려워하는 것이 "수의가 거칠어서 고인께 못 입힌다"며 현장에서 150~200만 원의 추가금을 요구하는 상술입니다. 배웅은 시험성적서와 원산지가 100% 명시된 천연 대마 특등 수의를 기본 패키지에 정직하게 포함합니다.',
    originBadge: '국가공인 원산지 증명서 동봉',
    specs: [
      { label: '소재 및 성분', value: '천연 대마(삼베) 100% (시험성적 통과)' },
      { label: '구성 품목', value: '도포/원삼, 대님, 버선, 천금, 지석, 턱받침, 습신 일체' },
      { label: '봉제 공정', value: '수작업 전통 침선 및 규격 한지 보자기 완포장' },
      { label: '업셀링 차단', value: '현장 수의 변경 추가금 0원 절대 보증' }
    ],
    antiUpsellingTip:
      '💡 기존 상조사 관행: 기본 계약에 저급 나일론 혼방을 넣어두고 입관실에서 유족의 효심을 자극해 150만~250만 원 업그레이드를 유도합니다. 배웅은 기본 수의 자체가 최고급 특등 대마이므로 추가금이 발생하지 않습니다.'
  },
  {
    id: 'coffin',
    name: '천연 오동나무 1.5치 규격관 & 궁중 생화 꽃염습(꽃침대)',
    category: '입관 용품',
    image: '/images/floral-coffin.jpg',
    tagline: '고인의 마지막 가시는 길을 포근하게 감싸는 생화 꽃침대',
    description:
      '차갑고 삭막한 입관실 대신, 전문 플로리스트가 정성껏 엄선한 신선한 생화로 관 안을 가득 채우는 꽃침대(생화 꽃염습)를 제공합니다. 천연 오동나무 1.5치 두께의 규격관으로 완전 연소와 친환경 화장 기준을 충족합니다.',
    originBadge: '친환경 목재 규격 인증',
    specs: [
      { label: '목재 규격', value: '천연 건조 오동나무 1.5치 (두께 약 4.5cm 정품 규격)' },
      { label: '내부 연출', value: '전문 플로리스트 생화 꽃침대 및 한지 구름베개' },
      { label: '친환경성', value: '승화원 완전 연소 친환경 무해 인증 규격' },
      { label: '의전 예우', value: '궁중식 7매 결관바 및 정통 명정 완비' }
    ],
    antiUpsellingTip:
      '💡 기존 상조사 관행: 얇은 합판관을 보여주며 "화장장에서 그을음이 난다"며 오동나무 특관으로 80만~150만 원 추가금을 요구합니다. 배웅은 모든 규격관의 두께와 생화 염습을 사전에 투명 공개합니다.'
  },
  {
    id: 'attire',
    name: '현대식 상복(남성 정장 세트 & 여성 개량한복) & 미사용 환급',
    category: '유족 용품',
    image: '/images/mourning-attire.jpg',
    tagline: '정갈하고 품격 있는 현대식 상복과 미사용 시 100% 정직 환급',
    description:
      '유족의 체형에 꼭 맞는 현대식 고급 남성 정장(와이셔츠, 넥타이, 상주 완장 포함)과 우아하고 단아한 여성 개량한복을 제공합니다. 현장에서 사이즈를 무료 교환해 드리며, 남아서 입지 않은 상복은 1벌당 30,000원을 정직하게 공제 환급해 드립니다.',
    originBadge: '체형별 무료 교환 & 미사용 환급제',
    specs: [
      { label: '남성 상복', value: '고급 블랙 포멀 정장 세트 (자켓, 바지, 와이셔츠, 넥타이)' },
      { label: '여성 상복', value: '단아한 개량 한복 (저고리, 치마, 속치마 일체)' },
      { label: '의전 소품', value: '상주 2줄/직계 1줄 완장, 상표(리본), 방명록, 펜 일체' },
      { label: '미사용 환급', value: '착용하지 않은 상복 1벌당 30,000원 결제 시 즉시 공제' }
    ],
    antiUpsellingTip:
      '💡 기존 상조사 관행: 계약된 상복 수량보다 가족이 적게 와서 상복을 덜 입어도 비용을 깎아주지 않고 낙전 수입으로 챙깁니다. 배웅은 미사용 상복 실비를 100% 정직하게 돌려드립니다.'
  },
  {
    id: 'vehicle',
    name: '고급 고인 전용 리무진 & 45인승 대형 우등 버스',
    category: '차량 의전',
    image: '/images/limousine-bus.jpg',
    tagline: '고인과 유족을 안전하고 극진하게 모시는 사전 정찰 운구 의전',
    description:
      '최고급 링컨/캐딜락 고인 전용 리무진과 조문객 및 유족 45명이 편안히 승차할 수 있는 대형 우등 버스를 제공합니다. 장지까지의 이동 경로와 무료 제공 거리(관내/80km/전국)를 사전에 정찰 요금으로 확정하여 부당한 초과 운임 시비를 방지합니다.',
    originBadge: '사전 이동거리 정찰 보증',
    specs: [
      { label: '고인 리무진', value: '최신형 링컨/캐딜락 전용 의전 리무진 (고인 전용 칸 완비)' },
      { label: '유족 버스', value: '45인승 대형 우등 고속 리무진 버스 (전문 승무원 배정)' },
      { label: '운행 보증', value: '패키지별 관내 무료 ~ 왕복 80km/전국 장지 정찰 지원' },
      { label: '유류/통행료', value: '이동 중 발생 유류비 및 통행료 사전 투명 확정' }
    ],
    antiUpsellingTip:
      '💡 기존 상조사 관행: 발인 당일 아침 "계약된 거리를 5km 초과했다"며 현장에서 30만~50만 원의 웃돈을 요구해 유족의 원성을 삽니다. 배웅은 사전 정찰거리 고지 및 최적 경로 안내로 부당 운임을 전면 차단합니다.'
  }
];

export interface PackagePricingWidgetProps {
  selectedPackageType?: BaeungPackageType;
  onSelectPackageForFuneral?: (pkg: BaeungPackageInfo) => void;
  onNavigateToLifeArchive?: () => void;
}

export const PackagePricingWidget: React.FC<PackagePricingWidgetProps> = ({
  selectedPackageType = 'economic_3day',
  onSelectPackageForFuneral,
  onNavigateToLifeArchive
}) => {
  const [selectedPackage, setSelectedPackage] = useState<BaeungPackageType>(selectedPackageType);
  const [openDetail, setOpenDetail] = useState<boolean>(true);
  const [isSynced, setIsSynced] = useState<boolean>(false);

  // 시각화 갤러리 활성 탭
  const [activeVisualTab, setActiveVisualTab] = useState<string>('shroud');
  // 고화질 사진 확대 모달 상태
  const [zoomModalItem, setZoomModalItem] = useState<VisualProductDetail | null>(null);

  // 맞춤 패키지 간편 진단기 상태
  const [estimatorGuests, setEstimatorGuests] = useState<'none' | 'small' | 'medium' | 'large'>('medium');
  const [estimatorDays, setEstimatorDays] = useState<'0' | '2' | '3'>('3');

  const packages = Object.values(BAEUNG_PACKAGES);
  const currentPkg = BAEUNG_PACKAGES[selectedPackage];
  const activeVisual = VISUAL_PRODUCTS.find((p) => p.id === activeVisualTab) || VISUAL_PRODUCTS[0];

  // 간편 진단기 추천 로직
  const handleApplyRecommendation = (guests: 'none' | 'small' | 'medium' | 'large', days: '0' | '2' | '3') => {
    setEstimatorGuests(guests);
    setEstimatorDays(days);

    if (days === '0' || guests === 'none') {
      setSelectedPackage('simple_non_hall');
    } else if (days === '2' || guests === 'small') {
      setSelectedPackage('family_2day');
    } else if (guests === 'large') {
      setSelectedPackage('standard_3day');
    } else {
      setSelectedPackage('economic_3day');
    }
  };

  return (
    <div className="bg-[#FFFFFF] rounded-xl shadow-xs border border-[#DCD6C9] p-5 md:p-8 space-y-8">
      {/* 1. 상단 사진 비주얼 헤더 배너 */}
      <div className="relative rounded-lg overflow-hidden h-48 sm:h-56 border border-[#3D382E] bg-[#141618]">
        <img
          src="/images/hero-memorial.jpg"
          alt="정직 원가 의전 용품 및 제단"
          className="w-full h-full object-cover object-center filter brightness-[0.38] contrast-105"
        />
        {/* 삼국·조선 길상 구름문 은은한 오버레이 */}
        <div className="absolute inset-0 pointer-events-none k-pattern-unmun-dark opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0E10] via-[#0D0E10]/50 to-transparent flex flex-col justify-end p-6 md:p-8 relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded bg-[#19382C]/90 text-[#FAF9F6] text-[13px] font-serif border border-[#2D4F43]">
              <TraditionalSeal sealKey="sincerity" size="sm" />
              <span>선금 0원 · 100% 후불 정산제</span>
            </div>
            <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded bg-[#9E7D47]/20 text-[#C2A26A] text-[13px] font-serif border border-[#9E7D47]/40">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C2A26A]" />
              <span>실물 사진 100% 사전 공개 · 현장 강매 0원</span>
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-reverence font-black text-[#FAF9F6] tracking-tight">
            배웅 정직 원가 정찰제 의전 안내
          </h2>
          <p className="text-[#8A929D] text-[13px] sm:text-sm font-serif mt-1 max-w-2xl leading-relaxed">
            무엇을 받는지 모른 채 계약하는 깜깜이 장례는 이제 그만. 수의, 관, 상복, 리무진까지 실제 제공되는 실물 사진과 원산지 규격을 투명하게 확인하세요.
          </p>
        </div>
      </div>

      {/* 2. [시각적 이해도 혁신] 4대 핵심 의전 품목 실물 갤러리 & 정밀 검증 뷰어 */}
      <div className="bg-[#FAF9F6] border border-[#DCD6C9] rounded-xl p-5 md:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DCD6C9] pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-[#6E5429]" />
              <h3 className="font-serif font-bold text-base md:text-lg text-[#151719]">
                실물 사진으로 직접 확인하는 4대 핵심 의전 품목
              </h3>
            </div>
            <p className="text-[13px] text-[#5A5E66] font-serif mt-1">
              "글자로만 보면 잘 모르는" 장례 용품들을 실제 촬영 사진과 공인 시험성적서로 미리 확인하실 수 있습니다.
            </p>
          </div>
          <span className="text-[13px] text-[#6E5429] font-serif shrink-0">
            ※ 사진을 누르시면 고화질 확대 검증이 가능합니다
          </span>
        </div>

        {/* 4대 품목 탭 버튼 바 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[13px] font-serif">
          {VISUAL_PRODUCTS.map((prod) => {
            const isActive = activeVisualTab === prod.id;
            return (
              <button
                key={prod.id}
                onClick={() => setActiveVisualTab(prod.id)}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? 'border-2 border-[#19382C] bg-[#FFFFFF] shadow-xs ring-1 ring-[#19382C]/10'
                    : 'border-[#DCD6C9] bg-[#FAF9F6] hover:bg-[#FFFFFF] hover:border-[#9E7D47]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-[#6E5429] font-bold">{prod.category}</span>
                  {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-[#19382C]" />}
                </div>
                <div className="font-serif font-bold text-[13px] text-[#151719] mt-1 line-clamp-1">
                  {prod.id === 'shroud' ? '① 대마 100% 수의' : prod.id === 'coffin' ? '② 오동나무관 & 꽃염습' : prod.id === 'attire' ? '③ 현대식 상복 세트' : '④ 고급 리무진 & 버스'}
                </div>
              </button>
            );
          })}
        </div>

        {/* 선택된 품목 정밀 시각화 카드 (사진 좌측 + 제원 우측) */}
        <div className="bg-[#FFFFFF] rounded-xl border border-[#DCD6C9] overflow-hidden grid grid-cols-1 md:grid-cols-12 shadow-xs">
          {/* 사진 영역 (md:col-span-5) */}
          <div
            onClick={() => setZoomModalItem(activeVisual)}
            className="md:col-span-5 relative group cursor-pointer overflow-hidden bg-[#141618] min-h-[260px] md:min-h-[340px]"
          >
            <img
              src={activeVisual.image}
              alt={activeVisual.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            {/* 호버 시 돋보기 오버레이 */}
            <div className="absolute inset-0 bg-[#0D0E10]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white space-x-1.5 font-serif text-[13px]">
              <ZoomIn className="w-5 h-5 text-[#C2A26A]" />
              <span>실물 사진 크게 보기 (인증서 확인)</span>
            </div>
            {/* 원산지/인증 뱃지 */}
            <div className="absolute top-3 left-3 bg-[#19382C]/90 text-white text-[13px] font-serif font-bold px-2.5 py-1 rounded shadow-xs border border-[#2D4F43] flex items-center space-x-1">
              <Award className="w-3.5 h-3.5 text-[#C2A26A]" />
              <span>{activeVisual.originBadge}</span>
            </div>
          </div>

          {/* 제원 및 업셀링 방지 설명 (md:col-span-7) */}
          <div className="md:col-span-7 p-5 md:p-6 flex flex-col justify-between space-y-4 font-serif">
            <div>
              <span className="text-[13px] font-bold text-[#6E5429] bg-[#F1E9DB] px-2 py-0.5 rounded border border-[#F1E9DB]">
                {activeVisual.category} 정밀 제원
              </span>
              <h4 className="font-reverence font-bold text-lg md:text-xl text-[#151719] mt-2">
                {activeVisual.name}
              </h4>
              <p className="text-[13px] text-[#5A5E66] mt-1 leading-relaxed">
                {activeVisual.description}
              </p>

              {/* 스펙 테이블 */}
              <div className="mt-4 border border-[#DCD6C9] rounded-lg overflow-hidden text-[13px] divide-y divide-[#DCD6C9]">
                {activeVisual.specs.map((s, idx) => (
                  <div key={idx} className="flex justify-between py-2 px-3 bg-[#FFFFFF] hover:bg-[#FAF9F6]">
                    <span className="font-bold text-[#42464E] w-28 shrink-0">{s.label}</span>
                    <span className="text-[#151719] text-right font-medium">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 업셀링 주의 팁 박스 */}
            <div className="bg-[#FAF9F6] border border-[#F1E9DB] rounded-lg p-3 text-[13px] text-[#6E5429] leading-relaxed">
              {activeVisual.antiUpsellingTip}
            </div>
          </div>
        </div>
      </div>

      {/* 3. [인터랙티브 진단기] 나에게 딱 맞는 패키지 3초 간편 진단기 */}
      <div className="bg-[#FAF9F6] border border-[#DCD6C9] rounded-xl p-5 md:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DCD6C9] pb-3">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-[#6E5429]" />
            <h3 className="font-serif font-bold text-sm md:text-base text-[#151719]">
              나에게 딱 맞는 정찰 패키지 3초 간편 진단
            </h3>
          </div>
          <span className="text-[13px] text-[#5A5E66] font-serif">
            예상 조문객 규모와 일정을 누르시면 최적 패키지가 자동 추천됩니다
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13px] font-serif">
          {/* 조문객 규모 선택 */}
          <div>
            <span className="text-[#5A5E66] font-bold block mb-2">① 예상 조문객 규모</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {[
                { id: 'none', label: '가족만 (무조문)' },
                { id: 'small', label: '친지 30~50인' },
                { id: 'medium', label: '일반 100~150인' },
                { id: 'large', label: '대형 250인 이상' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleApplyRecommendation(item.id as any, estimatorDays)}
                  className={`py-2 px-2 rounded border text-center transition-all cursor-pointer ${
                    estimatorGuests === item.id
                      ? 'bg-[#19382C] text-white border-[#19382C] font-bold shadow-2xs'
                      : 'bg-[#FFFFFF] text-[#42464E] border-[#DCD6C9] hover:border-[#9E7D47]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 장례 일정 선택 */}
          <div>
            <span className="text-[#5A5E66] font-bold block mb-2">② 장례 일정 형식</span>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: '0', label: '무빈소 직장 (0일)' },
                { id: '2', label: '2일 가족장 (48시간)' },
                { id: '3', label: '3일 일반장 (72시간)' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleApplyRecommendation(estimatorGuests, item.id as any)}
                  className={`py-2 px-2 rounded border text-center transition-all cursor-pointer ${
                    estimatorDays === item.id
                      ? 'bg-[#19382C] text-white border-[#19382C] font-bold shadow-2xs'
                      : 'bg-[#FFFFFF] text-[#42464E] border-[#DCD6C9] hover:border-[#9E7D47]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 실시간 추천 결과 박스 */}
        <div className="bg-[#FFFFFF] rounded-lg border border-[#DCD6C9] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-serif">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded bg-[#F1E9DB] text-[#6E5429] font-bold text-[13px] border border-[#F1E9DB]">
              추천 패키지
            </span>
            <span className="font-reverence font-bold text-[#151719] text-sm md:text-base">
              {currentPkg.name} ({currentPkg.price.toLocaleString()}원)
            </span>
          </div>
          <div className="text-[13px] text-[#19382C] font-bold flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-[#6E5429]" />
            <span>기존 대형 상조(약 700~850만 원) 대비 약 400~550만 원 절감</span>
          </div>
        </div>
      </div>

      {/* 4. 4대 정찰 패키지 선택 탭 카드 그리드 (실물 썸네일 포함) */}
      <div>
        <div className="flex items-center justify-between text-[13px] font-serif font-bold text-[#5A5E66] mb-3 px-1">
          <span>배웅 4대 정직 원가 정찰 패키지 라인업</span>
          <span className="text-[13px] text-[#6E5429]">원하시는 패키지를 탭하시면 상세 명세를 확인하실 수 있습니다</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {packages.map((pkg) => {
            const isSelected = selectedPackage === pkg.type;
            return (
              <button
                key={pkg.type}
                onClick={() => setSelectedPackage(pkg.type)}
                className={`p-4 md:p-5 rounded-xl text-left border transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-2 border-[#19382C] bg-[#F7F5F0] shadow-sm ring-1 ring-[#19382C]/10'
                    : 'border-[#DCD6C9] hover:border-[#9E7D47]/70 bg-[#FAF9F6]'
                }`}
              >
                {/* 선택 활성화 인디케이터 배지 */}
                {isSelected && (
                  <div className="absolute -top-2.5 right-3 bg-[#19382C] text-[#FAF9F6] text-[13px] font-serif font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center space-x-0.5">
                    <CheckCircle2 className="w-3 h-3 text-[#C2A26A]" />
                    <span>선택됨</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[13px] font-serif font-bold text-[#6E5429] bg-[#F1E9DB] px-2 py-0.5 rounded border border-[#F1E9DB]">
                      {pkg.badge || '정찰 패키지'}
                    </span>
                    <span className="text-[13px] font-serif text-[#5A5E66]">
                      {pkg.stayDays === 0 ? '무빈소' : `${pkg.stayDays}일장`}
                    </span>
                  </div>

                  <h4 className="font-reverence font-bold text-base md:text-lg text-[#151719] mt-2">
                    {pkg.name.replace('배웅 ', '')}
                  </h4>

                  <div className="text-2xl md:text-3xl font-reverence font-black text-[#19382C] mt-1.5">
                    {pkg.price.toLocaleString()}
                    <span className="text-sm font-normal text-[#5A5E66] ml-0.5">원</span>
                  </div>

                  <p className="text-[13px] text-[#5A5E66] mt-2 font-serif leading-relaxed line-clamp-2">
                    {pkg.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#DCD6C9] space-y-1.5 text-[13px] font-serif">
                  <div className="flex items-center space-x-1.5 text-[#42464E]">
                    <Users className="w-3.5 h-3.5 text-[#6E5429] shrink-0" />
                    <span className="truncate">{pkg.targetGuests}</span>
                  </div>
                  {pkg.staffSummary && (
                    <div className="flex items-center space-x-1.5 text-[#5A5E66]">
                      <Clock className="w-3.5 h-3.5 text-[#19382C] shrink-0" />
                      <span className="truncate">{pkg.staffSummary}</span>
                    </div>
                  )}
                  {pkg.vehicleSummary && (
                    <div className="flex items-center space-x-1.5 text-[#5A5E66]">
                      <Car className="w-3.5 h-3.5 text-[#6E5429] shrink-0" />
                      <span className="truncate">{pkg.vehicleSummary}</span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* 4-B. 선택된 패키지 실시간 부고장 연계 액션 바 */}
        <div className="mt-4 p-4 rounded-xl bg-[#FAF9F6] border border-[#F1E9DB] flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-serif">
          <div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#6E5429]" />
              <span className="font-bold text-sm text-[#151719]">
                선택하신 [{currentPkg.name}] ({currentPkg.price.toLocaleString()}원)
              </span>
            </div>
            <p className="text-[13px] text-[#5A5E66] mt-0.5">
              이 패키지를 [생애기록관] 사전 의전 및 부고장에 실시간으로 동기화합니다.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                onSelectPackageForFuneral?.(currentPkg);
                setIsSynced(true);
                setTimeout(() => setIsSynced(false), 3500);
              }}
              className={`px-4 py-2 rounded-md font-bold text-[13px] flex items-center space-x-1.5 transition-all cursor-pointer border ${
                isSynced
                  ? 'bg-[#19382C] text-[#FAF9F6] border-[#2D4F43]'
                  : 'bg-[#9E7D47] hover:bg-[#9E7D47] text-[#151719] border-[#6E5429]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {isSynced
                  ? '✓ 생애기록관 부고장에 연동 완료!'
                  : '생애기록관 의전 설정에 실시간 연동'}
              </span>
            </button>

            {isSynced && onNavigateToLifeArchive && (
              <button
                onClick={onNavigateToLifeArchive}
                className="px-3 py-2 bg-white text-[#19382C] border border-[#DCE8E2] rounded-md font-bold text-[13px] hover:bg-[#DCE8E2] transition-colors cursor-pointer"
              >
                부고장 확인 ➔
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 5. [완벽 분리 공시 안내] 상조 의전비 vs 장례식장 시설비 헷갈림 방지 가이드 */}
      <div className="rounded-xl border border-[#DCD6C9] bg-[#FAF9F6] p-5 md:p-6 space-y-4">
        <div className="flex items-start space-x-2.5">
          <AlertCircle className="w-5 h-5 text-[#6E5429] shrink-0 mt-0.5" />
          <div>
            <h3 className="font-serif font-bold text-sm md:text-base text-[#151719]">
              장례 비용 완벽 분리 공시: 무엇이 포함되고 무엇이 별도인가요?
            </h3>
            <p className="text-[13px] text-[#5A5E66] font-serif mt-0.5 leading-relaxed">
              기존 상조회사의 "전부 다 해준다"는 과장 광고로 인해 나중에 장례식장 밥값/임대료로 수백만 원이 추가되어 겪는 유족들의 혼란과 불만을 사전에 100% 차단합니다.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-serif">
          {/* 5-A. 배웅 정찰 패키지 포함 내역 */}
          <div className="bg-[#FFFFFF] border-2 border-[#19382C]/30 rounded-lg p-4 space-y-2.5 shadow-2xs">
            <div className="flex items-center justify-between border-b border-[#DCD6C9] pb-2">
              <span className="font-bold text-[13px] md:text-sm text-[#19382C] flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#19382C]" />
                <span>배웅 패키지 100% 포함 항목 (상조 의전)</span>
              </span>
              <span className="text-[13px] font-bold bg-[#DCE8E2] text-[#19382C] px-2 py-0.5 rounded">
                선금 0원 후불제
              </span>
            </div>
            <ul className="text-[13px] text-[#42464E] space-y-1.5">
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#19382C]" />
                <span><b>국가공인 1급 장례지도사 24시간 전담</b> (입관·발인·화장 접수)</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#19382C]" />
                <span><b>전문 의전도우미</b> (표준 시급제 준수 / 촌지 일체 금지)</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#19382C]" />
                <span><b>오동나무 규격관 및 특등 수의</b> (원산지 100% 완전 공개)</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#19382C]" />
                <span><b>현대식 상복 양복/한복 세트</b> (미사용 시 1벌당 3만 원 환급)</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#19382C]" />
                <span><b>고급 리무진 및 45인승 대형 버스</b> 운구 이동 지원</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#19382C]" />
                <span><b>모바일 부고장·답례장 무제한 무료</b> 및 라이프 아카이브 연동</span>
              </li>
            </ul>
          </div>

          {/* 5-B. 장례식장 별도 직접 결제 실비 내역 */}
          <div className="bg-[#FFFFFF] border border-[#DCD6C9] rounded-lg p-4 space-y-2.5 shadow-2xs">
            <div className="flex items-center justify-between border-b border-[#DCD6C9] pb-2">
              <span className="font-bold text-[13px] md:text-sm text-[#6E5429] flex items-center space-x-1.5">
                <Info className="w-4 h-4 text-[#6E5429]" />
                <span>장례식장 별도 결제 실비 (식장 직납)</span>
              </span>
              <span className="text-[13px] font-bold bg-[#FAF9F6] text-[#6E5429] px-2 py-0.5 rounded border border-[#F1E9DB]">
                배웅 제휴 시 30% 감면
              </span>
            </div>
            <ul className="text-[13px] text-[#5A5E66] space-y-1.5">
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#9E7D47]" />
                <span><b>빈소 임대료 및 안치료</b> (이용 일수 및 평형별로 식장에 결제)</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#9E7D47]" />
                <span><b>조문객 식음료비</b> (밥, 국, 안주, 주류 등 실제 드신 만큼 결제)</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#9E7D47]" />
                <span><b>제단 생화 꽃장식</b> (기본 꽃장식은 식장 또는 배웅 직거래망 선택 가능)</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#9E7D47]" />
                <span><b>승화원 화장 접수비</b> (시립 기준 관내 주민 약 10~16만 원 내외)</span>
              </li>
            </ul>
            <div className="mt-2 pt-2 border-t border-[#DCD6C9] text-[13px] text-[#19382C] font-bold">
              💡 배웅 제휴 장례식장 이용 시 빈소 임대료를 최대 30% 즉시 현장 감면받으실 수 있습니다.
            </div>
          </div>
        </div>
      </div>

      {/* 6. 선택된 패키지 원가 상세 명세 및 5대 영역 스펙 아코디언 */}
      <div className="border border-[#DCD6C9] rounded-xl overflow-hidden bg-[#FAF9F6]">
        <button
          onClick={() => setOpenDetail(!openDetail)}
          className="w-full bg-[#FAF9F6] p-4 md:px-5 flex items-center justify-between font-serif font-bold text-[#151719] text-sm md:text-base hover:bg-[#FAF9F6] transition-colors cursor-pointer border-b border-[#DCD6C9]"
        >
          <div className="flex items-center space-x-2">
            <Info className="w-4 h-4 text-[#6E5429]" />
            <span>
              선택하신 [{currentPkg.name}] 5대 영역별 상세 원가 명세표
            </span>
          </div>
          <div className="flex items-center space-x-2 text-[13px] font-normal text-[#5A5E66]">
            <span>{openDetail ? '명세 닫기' : '명세 펼치기'}</span>
            <ChevronDown className={`w-4 h-4 text-[#5A5E66] transition-transform ${openDetail ? 'rotate-180' : ''}`} />
          </div>
        </button>

        {openDetail && (
          <div className="p-5 md:p-6 bg-[#FFFFFF] space-y-4 font-serif">
            {/* 5대 영역 상세 스펙 테이블 */}
            <div className="border border-[#DCD6C9] rounded-lg overflow-hidden text-[13px]">
              <table className="w-full text-left divide-y divide-[#DCD6C9]">
                <thead className="bg-[#FAF9F6] text-[#5A5E66] font-medium">
                  <tr>
                    <th className="py-2.5 px-3 w-28">의전 영역</th>
                    <th className="py-2.5 px-3 w-40">품목 및 인력 규격</th>
                    <th className="py-2.5 px-3">원가 투명 명세 및 약정 기준</th>
                    <th className="py-2.5 px-3 w-32 text-right">미사용 환급</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCD6C9] bg-[#FFFFFF]">
                  {currentPkg.specs?.map((spec, idx) => (
                    <tr key={idx} className="hover:bg-[#FAF9F6]">
                      <td className="py-3 px-3 font-bold text-[#6E5429]">
                        {spec.category}
                      </td>
                      <td className="py-3 px-3 font-medium text-[#151719]">
                        {spec.title}
                        {spec.origin && (
                          <span className="block text-[13px] text-[#5A5E66] font-normal mt-0.5">
                            [{spec.origin}]
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-[#5A5E66] leading-relaxed">
                        {spec.detail}
                      </td>
                      <td className="py-3 px-3 text-right text-[13px] font-medium text-[#19382C]">
                        {spec.refundNotice || '정액 포함'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 미사용 품목 정직 환급제 안내 배너 */}
            <div className="bg-[#DCE8E2] border border-[#DCE8E2] rounded-lg p-3.5 flex items-center justify-between text-[13px] text-[#19382C]">
              <div className="flex items-center space-x-2">
                <RotateCcw className="w-4 h-4 text-[#19382C] shrink-0" />
                <span className="font-bold">
                  미사용 품목 정직 환급제: 장례 중 사용하지 않은 상복이나 이동 차량은 최종 결제 시 100% 정직하게 공제 환급됩니다.
                </span>
              </div>
              <span className="text-[13px] text-[#19382C] underline hidden sm:inline">약관 규정 준수</span>
            </div>
          </div>
        )}
      </div>

      {/* 7. 4대 제로(Zero) 안심 보증 헌장 */}
      <div className="bg-[#FAF9F6] border border-[#DCD6C9] rounded-xl p-5 md:p-6 space-y-4">
        <div className="flex items-center space-x-2 border-b border-[#DCD6C9] pb-3">
          <ShieldCheck className="w-5 h-5 text-[#6E5429]" />
          <h3 className="font-serif font-bold text-sm md:text-base text-[#151719]">
            배웅 4대 제로(Zero) 안심 보증 헌장
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-[13px] font-serif">
          <div className="p-3.5 rounded-lg bg-[#FFFFFF] border border-[#DCD6C9] space-y-1">
            <div className="font-bold text-[#19382C] flex items-center space-x-1">
              <span className="text-sm">①</span>
              <span>선금 0원 / 후불 정산제</span>
            </div>
            <p className="text-[#5A5E66] leading-relaxed">
              사전 가입비, 월 납입금 일체 0원. 발인 후 모든 의전이 정상 완료된 뒤 결제합니다.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#FFFFFF] border border-[#DCD6C9] space-y-1">
            <div className="font-bold text-[#8B2520] flex items-center space-x-1">
              <span className="text-sm">②</span>
              <span>촌지·수고비 요구 0원</span>
            </div>
            <p className="text-[#5A5E66] leading-relaxed">
              지도사, 도우미의 촌지 요구는 법적으로 금지되며, 요구 시 200% 배상합니다.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#FFFFFF] border border-[#DCD6C9] space-y-1">
            <div className="font-bold text-[#6E5429] flex items-center space-x-1">
              <span className="text-sm">③</span>
              <span>현장 강매·업셀링 0원</span>
            </div>
            <p className="text-[#5A5E66] leading-relaxed">
              사전 약정 외 불필요한 고가 수의/유골함 강매 발생 시 해당 품목을 전액 무료 제공합니다.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#FFFFFF] border border-[#DCD6C9] space-y-1">
            <div className="font-bold text-[#19382C] flex items-center space-x-1">
              <span className="text-sm">④</span>
              <span>미사용 품목 정직 환급</span>
            </div>
            <p className="text-[#5A5E66] leading-relaxed">
              덜 입은 상복, 미사용 차량 등 실제 쓰지 않은 품목은 계약금에서 100% 공제 환급됩니다.
            </p>
          </div>
        </div>
      </div>

      {/* 8. 하단 24시 긴급 접수 및 상담 콜투액션 */}
      <div className="bg-[#141618] text-[#FAF9F6] rounded-xl p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded bg-[#19382C] text-[#FAF9F6] text-[13px] font-serif mb-1.5 border border-[#2D4F43]">
            <span>전국 2시간 이내 현장 출동 네트워크</span>
          </div>
          <h4 className="text-lg md:text-xl font-reverence font-bold text-[#FAF9F6]">
            지금 장례가 발생하셨거나, 사전 대비 상담이 필요하신가요?
          </h4>
          <p className="text-[13px] text-[#8A929D] font-serif mt-0.5">
            24시간 1급 장례지도사가 대기 중입니다. 언제든 부담 없이 연락 주시면 가장 정직한 길을 안내해 드립니다.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 shrink-0">
          <a
            href="tel:1588-0000"
            className="py-3 px-5 bg-[#19382C] hover:bg-[#2D4F43] text-[#FAF9F6] border border-[#2D4F43] rounded-md font-serif font-bold text-[13px] md:text-sm flex items-center justify-center space-x-2 transition-all shadow-xs"
          >
            <Phone className="w-4 h-4 text-[#C2A26A]" />
            <span>24시 긴급 출동 요청 (1588-0000)</span>
          </a>
        </div>
      </div>

      {/* 9. [고화질 확대 검증 모달] 소비자가 사진을 누르면 열리는 상세 뷰어 */}
      {zoomModalItem && (
        <ModalShell
            onClose={() => setZoomModalItem(null)}
            maxWidth="max-w-2xl"
            maxHeight="max-h-[90vh]"
            surface="white"
            titleId="zoom-title"
            descriptionId="zoom-desc"
        >
            {/* 모달 헤더 */}
                        <ModalToolbar
              titleId="zoom-title"
              descriptionId="zoom-desc"
              onClose={() => setZoomModalItem(null)}
              closeLabel="확대 뷰어 닫기"
              icon={
                <div className="w-7 h-7 rounded-full bg-[#19382C] text-[#C2A26A] flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4" />
                </div>
              }
              title={
                <>{zoomModalItem.name} 실물 정밀 검증</>
              }
              subtitle={
                <span id="zoom-desc">고화질 실물 사진을 확대하여 원산지와 품질을 직접 확인하실 수 있습니다.</span>
              }
            />

            {/* 모달 이미지 본문 */}
            <div className="overflow-y-auto p-5 md:p-6 space-y-4 font-serif">
              <div className="relative rounded-xl overflow-hidden border border-[#3D382E] bg-[#0B0C0E] max-h-[360px] flex items-center justify-center">
                <img
                  src={zoomModalItem.image}
                  alt={zoomModalItem.name}
                  className="w-full h-full object-contain max-h-[360px]"
                />
                <div className="absolute bottom-2 left-2 bg-[#141618]/85 text-white text-[13px] px-2.5 py-1 rounded">
                  {zoomModalItem.originBadge}
                </div>
              </div>

              <div>
                <h4 className="font-reverence font-bold text-lg text-[#151719]">
                  {zoomModalItem.tagline}
                </h4>
                <p className="text-[13px] text-[#5A5E66] mt-1.5 leading-relaxed">
                  {zoomModalItem.description}
                </p>
              </div>

              {/* 스펙 리스트 */}
              <div className="bg-[#FAF9F6] border border-[#DCD6C9] rounded-lg p-3.5 space-y-2 text-[13px]">
                <div className="font-bold text-[#151719] mb-1">상세 스펙 및 품질 보증</div>
                {zoomModalItem.specs.map((s, idx) => (
                  <div key={idx} className="flex justify-between py-1 border-b border-[#DCD6C9] last:border-0">
                    <span className="text-[#5A5E66] font-medium">{s.label}</span>
                    <span className="text-[#151719] font-bold">{s.value}</span>
                  </div>
                ))}
              </div>

              {/* 업셀링 방지 팁 */}
              <div className="bg-[#FAF9F6] border border-[#F1E9DB] rounded-lg p-3.5 text-[13px] text-[#6E5429] leading-relaxed">
                {zoomModalItem.antiUpsellingTip}
              </div>
            </div>

            {/* 모달 푸터 */}
            <div className="bg-[#FAF9F6] border-t border-[#DCD6C9] p-3 px-5 flex justify-end">
              <button
                onClick={() => setZoomModalItem(null)}
                className="px-4 py-2 bg-[#19382C] text-white rounded font-serif text-[13px] font-bold hover:bg-[#2D4F43] transition-colors cursor-pointer"
              >
                확인 및 닫기
              </button>
            </div>
        </ModalShell>
      )}
    </div>
  );
};
