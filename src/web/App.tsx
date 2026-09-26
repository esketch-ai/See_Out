import React, { useState } from 'react';
import { Header } from './components/Header.js';
import { NormalMode } from './components/NormalMode.js';
import { EmergencyMode } from './components/EmergencyMode.js';

export const App: React.FC = () => {
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);

  return (
    <div className={`min-h-screen ${isEmergencyMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* 듀얼 모드 글로벌 헤더 */}
      <Header
        isEmergencyMode={isEmergencyMode}
        onToggleMode={(emergency) => setIsEmergencyMode(emergency)}
      />

      {/* 상황별 모드 전환 렌더링 */}
      {isEmergencyMode ? (
        <EmergencyMode onExitEmergency={() => setIsEmergencyMode(false)} />
      ) : (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <NormalMode onEnterEmergency={() => setIsEmergencyMode(true)} />
          
          <footer className="mt-16 pt-8 border-t border-gray-200 text-center text-xs text-gray-500 space-y-2">
            <p className="font-semibold text-gray-600">
              배웅(Bae-ung) 라이프엔딩 종합 플랫폼 — 대한민국 선불식 상조의 거품을 걷어내는 투명 원가 혁신
            </p>
            <p>
              지식 체계 및 아키텍처: Themis-AI PARA 거버넌스 | 30년+ 박사급 전문가 위원회 검수
            </p>
          </footer>
        </div>
      )}
    </div>
  );
};

export default App;
