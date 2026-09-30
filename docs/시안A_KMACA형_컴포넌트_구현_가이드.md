# [seasnake 작업 지시서] 시안 A (따뜻한 가족 동행 & KMACA 포털) 컴포넌트 구현 가이드

> **대상**: seasnake 프론트엔드 작업 담당  
> **목표**: 어둡고 텍스트 중심이던 메인 홈을 **한국상조공제조합(KMACA) 스타일의 밝고 따뜻한 포털 구조로 개편**  
> **생산 완료된 에셋 제공**: 고화질 헤로 배너, 영상 다큐 썸네일, 3구 서비스 타일 그래픽 완비

---

## 🖼️ 1. 제공된 고품질 에셋 매핑

| 컴포넌트 위치 | 파일 경로 | 규격 | 용도 및 화면 연출 |
|---|---|---|---|
| **메인 비주얼 배너** | `docs/images/hero_warm_family_banner.jpg` | 16:9 와이드 | 자연광이 비치는 3대 가족의 온화한 미소 (좌측 텍스트 여백 완비) |
| **미디어 스토리 카드** | `docs/images/video_story_thumb.jpg` | 16:9 썸네일 | 따스한 한옥 창가의 어르신 다큐 & 원형 재생 버튼 오버레이 |
| **3구 서비스 타일** | `docs/images/service_tiles_bundle.jpg` | 3단 번들 | 서비스 신청 (손잡기) / 바우처 지원 (안심 보전) / 시니어 Care 상담 |
| **전체 레퍼런스 목업** | `docs/images/design_concept_a_warm.jpg` | 16:9 | 전체 페이지 완성형 조감도 |

---

## 🎨 2. 디자인 토큰 매핑 가이드 (`tokens.ts` 정본 준수)

- **전체 배경**: `#FAF9F6` (`hanji.surface`)
- **카드/패널 표면**: `#FFFFFF` (`porcelain`)
- **주 텍스트**: `#151719` (`ink.DEFAULT`, 18.34:1 고대비)
- **보조 설명**: `#5A5E66` (`ink.muted`, 5.97:1 고대비)
- **강조 그린**: `#19382C` (`pine.DEFAULT`) / 액센트 `#2D5A46`
- **강조 황동**: `#9E7D47` (`brass.DEFAULT`) / 배지 `#C2A26A`
- **구분선/테두리**: `#DCD6C9` (`ink.border`)
- **타이포 하한**: **13px 하한 필수 (N-7)**. `text-xs`(12px) 완전 금지, 본문 `text-sm` 또는 `text-base` 적용.

---

## 📐 3. 추천 컴포넌트 구조 (`KmacaWarmHome.tsx`)

```tsx
import React, { useState } from 'react';
import { 
  Calculator, 
  Building2, 
  PackageCheck, 
  ShieldCheck, 
  PhoneCall, 
  ChevronRight, 
  Play, 
  Bell, 
  HelpCircle,
  Clock,
  ArrowRight
} from 'lucide-react';

interface KmacaWarmHomeProps {
  onOpenQuoteDiagnostics: () => void;
  onOpenFuneralHallSearch: () => void;
  onOpenFixedPackages: () => void;
  onOpenDualStandby: () => void;
  onCallHotline: () => void;
}

export const KmacaWarmHome: React.FC<KmacaWarmHomeProps> = ({
  onOpenQuoteDiagnostics,
  onOpenFuneralHallSearch,
  onOpenFixedPackages,
  onOpenDualStandby,
  onCallHotline
}) => {
  const [activeTab, setActiveTab] = useState<'NOTICE' | 'FAQ'>('NOTICE');

  return (
    <div className="min-h-screen bg-[#FAF9F6] font-serif text-[#151719]">
      {/* ─── 1. 상단 글로벌 네비게이션 & 24시 핫라인 ─── */}
      <header className="bg-[#FFFFFF] border-b border-[#DCD6C9] sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="font-reverence font-bold text-2xl text-[#19382C] tracking-tight">
              배웅 <span className="text-sm font-sans font-normal text-[#5A5E66]">Bae-ung</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-6 text-[15px] font-medium text-[#42464E]">
            <button onClick={onOpenQuoteDiagnostics} className="hover:text-[#19382C] transition-colors cursor-pointer">원가 진단</button>
            <button onClick={onOpenFuneralHallSearch} className="hover:text-[#19382C] transition-colors cursor-pointer">장례식장 찾기</button>
            <button onClick={onOpenFixedPackages} className="hover:text-[#19382C] transition-colors cursor-pointer">정찰 패키지</button>
            <button onClick={onOpenDualStandby} className="hover:text-[#19382C] transition-colors cursor-pointer">이중안심</button>
          </nav>

          <a 
            href="tel:1588-0000"
            className="flex items-center space-x-2 bg-[#F7F5F0] hover:bg-[#F1EDE3] border border-[#DCD6C9] px-3.5 py-1.5 rounded-full text-[13px] font-bold text-[#19382C] transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#9E7D47]" />
            <span>24시 상담 1588-0000</span>
          </a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8">
        {/* ─── 2. 메인 비주얼 배너 (햇살 가족 사진 + 감성 카피) ─── */}
        <div className="relative rounded-2xl overflow-hidden shadow-sm border border-[#DCD6C9] min-h-[380px] sm:min-h-[440px] flex items-center">
          {/* 배경 이미지 */}
          <img 
            src="/docs/images/hero_warm_family_banner.jpg" 
            alt="함께라서 든든한 따뜻한 배웅" 
            className="absolute inset-0 w-full h-full object-cover object-right"
          />
          {/* 좌측 텍스트 가독성을 위한 소프트 그라디언트 오버레이 */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF9F6] via-[#FAF9F6]/85 to-transparent w-full sm:w-3/5" />

          {/* 배너 카피 & CTA */}
          <div className="relative z-10 p-6 sm:p-12 max-w-lg space-y-4">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[13px] font-bold bg-[#19382C]/10 text-[#19382C] border border-[#19382C]/20">
              <span>대한민국 1호 공공데이터 기반 안심 장례</span>
            </div>
            <h1 className="font-reverence font-bold text-3xl sm:text-4xl text-[#151719] leading-tight break-words">
              함께라서 든든한,<br />따뜻한 배웅
            </h1>
            <p className="text-[15px] sm:text-base text-[#5A5E66] leading-relaxed break-words">
              경황없는 이별의 순간, 불법 리베이트와 추가금 걱정 없이 고인에게만 온전히 집중하실 수 있도록 배웅이 곁을 지킵니다.
            </p>
            <div className="pt-2">
              <button 
                onClick={onOpenQuoteDiagnostics}
                className="px-5 py-2.5 bg-[#19382C] hover:bg-[#2D4F43] text-[#FAF9F6] font-bold rounded-xl text-[14px] shadow-sm transition-all flex items-center space-x-2 cursor-pointer"
              >
                <span>내 장례 원가 무료 진단하기</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ─── 3. KMACA형 플로팅 5대 대형 퀵 아이콘 바 ─── */}
        <div className="bg-[#FFFFFF] rounded-2xl shadow-md border border-[#DCD6C9] p-4 sm:p-6 -mt-12 sm:-mt-16 relative z-20">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
            {/* 1. 견적 진단 */}
            <button
              onClick={onOpenQuoteDiagnostics}
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#FAF9F6] hover:bg-[#F1EDE3] border border-[#DCD6C9] transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-full bg-[#19382C]/10 text-[#19382C] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <Calculator className="w-6 h-6 text-[#19382C]" />
              </div>
              <span className="font-bold text-[15px] text-[#151719]">견적 진단</span>
              <span className="text-[13px] text-[#5A5E66] mt-0.5">3초 OCR 분석</span>
            </button>

            {/* 2. 장례식장 찾기 */}
            <button
              onClick={onOpenFuneralHallSearch}
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#FAF9F6] hover:bg-[#F1EDE3] border border-[#DCD6C9] transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-full bg-[#9E7D47]/10 text-[#9E7D47] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <Building2 className="w-6 h-6 text-[#9E7D47]" />
              </div>
              <span className="font-bold text-[15px] text-[#151719]">장례식장 찾기</span>
              <span className="text-[13px] text-[#5A5E66] mt-0.5">38곳 실시간 공시</span>
            </button>

            {/* 3. 고정 패키지 */}
            <button
              onClick={onOpenFixedPackages}
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#FAF9F6] hover:bg-[#F1EDE3] border border-[#DCD6C9] transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-full bg-[#19382C]/10 text-[#19382C] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <PackageCheck className="w-6 h-6 text-[#19382C]" />
              </div>
              <span className="font-bold text-[15px] text-[#151719]">정찰 패키지</span>
              <span className="text-[13px] text-[#5A5E66] mt-0.5">추가금 0원 보증</span>
            </button>

            {/* 4. 이중안심(보호) */}
            <button
              onClick={onOpenDualStandby}
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#FAF9F6] hover:bg-[#F1EDE3] border border-[#DCD6C9] transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-full bg-[#9E7D47]/10 text-[#9E7D47] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6 text-[#9E7D47]" />
              </div>
              <span className="font-bold text-[15px] text-[#151719]">이중안심</span>
              <span className="text-[13px] text-[#5A5E66] mt-0.5">위약금 100% 보전</span>
            </button>

            {/* 5. 상담 전화 1588 */}
            <button
              onClick={onCallHotline}
              className="col-span-2 sm:col-span-1 flex flex-col items-center justify-center p-4 rounded-xl bg-[#19382C] hover:bg-[#2D4F43] text-[#FAF9F6] transition-all cursor-pointer shadow-xs"
            >
              <div className="w-12 h-12 rounded-full bg-white/15 text-[#C2A26A] flex items-center justify-center mb-2">
                <PhoneCall className="w-6 h-6 text-[#C2A26A]" />
              </div>
              <span className="font-bold text-[15px] text-[#FAF9F6]">24시 상담 연결</span>
              <span className="text-[13px] text-[#A8B2A9] mt-0.5 font-mono">1588-0000</span>
            </button>
          </div>
        </div>

        {/* ─── 4. 하단 3열 분할 메인 콘텐츠 그리드 (KMACA 정통 차용) ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 열 1: 숏폼/영상 스토리 카드 */}
          <div className="bg-[#FFFFFF] rounded-2xl p-5 border border-[#DCD6C9] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#DCD6C9]">
                <h3 className="font-bold text-[16px] text-[#151719] flex items-center space-x-1.5">
                  <Play className="w-4 h-4 text-[#19382C]" />
                  <span>마음을 전하는 이야기</span>
                </h3>
                <span className="text-[13px] text-[#5A5E66]">랜선투어</span>
              </div>
              <div className="mt-4 relative rounded-xl overflow-hidden group cursor-pointer border border-[#DCD6C9]">
                <img 
                  src="/docs/images/video_story_thumb.jpg" 
                  alt="어르신 인터뷰 및 시설 투어" 
                  className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="mt-3">
                <h4 className="font-bold text-[15px] text-[#151719]">
                  "투명한 가격표를 먼저 보니 마음이 놓였습니다"
                </h4>
                <p className="text-[13px] text-[#5A5E66] mt-1 line-clamp-2">
                  실제 배웅을 통해 권역 장례식장을 이용하신 유족분의 따뜻한 안도감의 기록을 확인해보세요.
                </p>
              </div>
            </div>
            <div className="pt-3 border-t border-[#DCD6C9] mt-4">
              <button 
                onClick={onOpenFuneralHallSearch}
                className="w-full py-2 bg-[#FAF9F6] hover:bg-[#F1EDE3] border border-[#DCD6C9] text-[#19382C] font-bold text-[13px] rounded-lg transition-colors flex items-center justify-center space-x-1"
              >
                <span>38곳 장례식장 랜선투어 영상 보기</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 열 2: 간결 2탭 공지사항 & FAQ */}
          <div className="bg-[#FFFFFF] rounded-2xl p-5 border border-[#DCD6C9] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex border-b border-[#DCD6C9] text-[14px]">
                <button
                  onClick={() => setActiveTab('NOTICE')}
                  className={`pb-3 pr-4 font-bold transition-all border-b-2 cursor-pointer ${
                    activeTab === 'NOTICE' ? 'border-[#19382C] text-[#19382C]' : 'border-transparent text-[#5A5E66]'
                  }`}
                >
                  공지사항
                </button>
                <button
                  onClick={() => setActiveTab('FAQ')}
                  className={`pb-3 px-4 font-bold transition-all border-b-2 cursor-pointer ${
                    activeTab === 'FAQ' ? 'border-[#19382C] text-[#19382C]' : 'border-transparent text-[#5A5E66]'
                  }`}
                >
                  자주 묻는 질문
                </button>
              </div>

              <div className="mt-3 divide-y divide-[#DCD6C9]/60">
                {activeTab === 'NOTICE' ? (
                  <>
                    <div className="py-2.5 hover:text-[#19382C] cursor-pointer">
                      <div className="flex items-center space-x-2">
                        <span className="text-[13px] font-bold text-[#19382C] bg-[#DCE8E2] px-1.5 py-0.5 rounded">안내</span>
                        <span className="text-[14px] font-medium text-[#151719] truncate">2026 e하늘 공시 장례비용 실시간 연동 개시</span>
                      </div>
                      <span className="text-[13px] text-[#8A929D] block mt-1">2026.09.28</span>
                    </div>
                    <div className="py-2.5 hover:text-[#19382C] cursor-pointer">
                      <div className="flex items-center space-x-2">
                        <span className="text-[13px] font-bold text-[#6E5429] bg-[#F1E9DB] px-1.5 py-0.5 rounded">고지</span>
                        <span className="text-[14px] font-medium text-[#151719] truncate">공정위 리베이트 제재 방지 정액제 표준 준수</span>
                      </div>
                      <span className="text-[13px] text-[#8A929D] block mt-1">2026.09.20</span>
                    </div>
                    <div className="py-2.5 hover:text-[#19382C] cursor-pointer">
                      <div className="flex items-center space-x-2">
                        <span className="text-[13px] font-bold text-[#19382C] bg-[#DCE8E2] px-1.5 py-0.5 rounded">소식</span>
                        <span className="text-[14px] font-medium text-[#151719] truncate">수도권 동남부(강남·성남) 38개소 직통 핫라인</span>
                      </div>
                      <span className="text-[13px] text-[#8A929D] block mt-1">2026.09.15</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="py-2.5 hover:text-[#19382C] cursor-pointer">
                      <span className="text-[14px] font-medium text-[#151719]">Q. 기존 상조를 해약해도 정말 손해가 없나요?</span>
                      <p className="text-[13px] text-[#5A5E66] mt-0.5">A. 배웅 손실보전 바우처로 위약금 전액을 실질 지원해 드립니다.</p>
                    </div>
                    <div className="py-2.5 hover:text-[#19382C] cursor-pointer">
                      <span className="text-[14px] font-medium text-[#151719]">Q. 정찰제 패키지 외에 현장 추가금이 나오나요?</span>
                      <p className="text-[13px] text-[#5A5E66] mt-0.5">A. 법적 고지 계약으로 부당 추가금 청구가 원천 차단됩니다.</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-[#DCD6C9] mt-4 flex justify-end">
              <button className="text-[13px] font-bold text-[#5A5E66] hover:text-[#19382C] flex items-center space-x-1 cursor-pointer">
                <span>더보기</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 열 3: 3구 직관적 서비스 타일 (일러스트 배너) */}
          <div className="space-y-3 flex flex-col justify-between">
            {/* 타일 1: 서비스 신청 */}
            <div 
              onClick={onOpenQuoteDiagnostics}
              className="p-4 rounded-2xl bg-gradient-to-r from-[#FFF5ED] to-[#FFFFFF] border border-[#F1E9DB] hover:border-[#D4A373] transition-all shadow-xs cursor-pointer flex items-center justify-between"
            >
              <div>
                <span className="text-[13px] font-bold text-[#9E7D47]">믿음과 신뢰의 첫걸음</span>
                <h4 className="font-bold text-[16px] text-[#151719] mt-0.5">안심 장례 서비스 신청</h4>
                <p className="text-[13px] text-[#5A5E66]">실시간 원가 기반 정찰 예약</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#9E7D47]/10 flex items-center justify-center text-[#9E7D47]">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>

            {/* 타일 2: 든든한 금융 바우처 지원 */}
            <div 
              onClick={onOpenDualStandby}
              className="p-4 rounded-2xl bg-gradient-to-r from-[#F0F7F4] to-[#FFFFFF] border border-[#DCE8E2] hover:border-[#19382C] transition-all shadow-xs cursor-pointer flex items-center justify-between"
            >
              <div>
                <span className="text-[13px] font-bold text-[#19382C]">생활의 안정을 돕는</span>
                <h4 className="font-bold text-[16px] text-[#151719] mt-0.5">손실보전 바우처 지원</h4>
                <p className="text-[13px] text-[#5A5E66]">상조 해약 위약금 100% 보전</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#19382C]/10 flex items-center justify-center text-[#19382C]">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>

            {/* 타일 3: 정성을 다하는 시니어 Care 상담 */}
            <div 
              onClick={onCallHotline}
              className="p-4 rounded-2xl bg-gradient-to-r from-[#F7F5F0] to-[#FFFFFF] border border-[#DCD6C9] hover:border-[#5A5E66] transition-all shadow-xs cursor-pointer flex items-center justify-between"
            >
              <div>
                <span className="text-[13px] font-bold text-[#5A5E66]">따뜻한 동행이 되어 드립니다</span>
                <h4 className="font-bold text-[16px] text-[#151719] mt-0.5">전문 지도사 1:1 상담</h4>
                <p className="text-[13px] text-[#5A5E66]">24시간 핫라인 1588-0000</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#151719]/10 flex items-center justify-center text-[#151719]">
                <PhoneCall className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
```

---

## 🚀 4. 작업 반영 체크리스트

- [x] 헤로 배너 고해상도 에셋 전달 완료 (`docs/images/hero_warm_family_banner.jpg`)
- [x] 미디어 스토리 썸네일 전달 완료 (`docs/images/video_story_thumb.jpg`)
- [x] 3구 서비스 타일 그래픽 전달 완료 (`docs/images/service_tiles_bundle.jpg`)
- [x] 전체 조감도 목업 전달 완료 (`docs/images/design_concept_a_warm.jpg`)
- [ ] `NormalMode.tsx` 또는 `KmacaWarmHome.tsx` 연동 완료
- [ ] `npm run verify` 브라우저 실측 감사 (13px 하한, 대비비, 팝업 6대 계약) 무결점 확인
