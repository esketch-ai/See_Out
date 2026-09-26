import React, { useState } from 'react';
import { Header } from './components/Header.js';
import { NormalMode } from './components/NormalMode.js';
import { EmergencyMode } from './components/EmergencyMode.js';

export const App: React.FC = () => {
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);

  return (
    <div className={`min-h-screen ${isEmergencyMode ? 'bg-mourning-950' : 'bg-hanji'}`}>
      {/* 듀얼 모드 글로벌 헤더 */}
      <Header
        isEmergencyMode={isEmergencyMode}
        onToggleMode={(emergency) => setIsEmergencyMode(emergency)}
      />

      {/* 상황별 모드 전환 렌더링 */}
      {isEmergencyMode ? (
        <EmergencyMode onExitEmergency={() => setIsEmergencyMode(false)} />
      ) : (
        <div className="max-w-4xl mx-auto px-4 py-10">
          <NormalMode onEnterEmergency={() => setIsEmergencyMode(true)} />
          
          <footer className="mt-20 pt-10 border-t border-ink-border text-center text-xs md:text-sm text-ink-muted space-y-3 font-serif">
            <p className="font-bold text-ink">
              배웅(Bae-ung) 라이프엔딩 플랫폼 — 고인의 마지막 가시는 길, 최고의 예우로 곁을 지키겠습니다
            </p>
            <p className="text-xs text-ink-muted leading-relaxed">
              사단법인 한국장례협회 등록 데이터 및 보건복지부 e하늘 장사정보시스템 공공 표준 준수<br />
              지식 체계 및 아키텍처: Themis-AI PARA 거버넌스 | 30년+ 박사급 전문가 위원회 검수 완료
            </p>
          </footer>
        </div>
      )}
    </div>
  );
};

export default App;
