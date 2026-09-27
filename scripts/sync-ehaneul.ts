import { EhaneulSyncWorker } from '../src/funeral-halls/ehaneulSyncWorker.js';

async function main() {
  console.log('\n==========================================================================');
  console.log('  🏛️  보건복지부 e하늘 장사정보시스템 공공 API 일일 동기화 Cron 워커');
  console.log('      (Ministry of Health & Welfare e-Haneul Daily Sync Worker)');
  console.log('==========================================================================\n');

  console.log('▶ [1단계] e하늘 공공 API 파이프라인 가동 및 데이터 피드 수집 중...');
  const result = await EhaneulSyncWorker.executeSync();

  console.log(`\n▶ [2단계] 동기화 처리 완료: ${result.syncId}`);
  console.log(`   - 동기화 일시: ${result.syncedAt}`);
  console.log(`   - 데이터 소스: ${result.source}`);
  console.log(`   - 총 수집 건수: ${result.totalFetched}건`);
  console.log(`   - 정상 반영 건수: ${result.totalProcessed}건`);
  console.log(`   - 신규 장례식장 감지: ${result.newHallsCount}건`);
  console.log(`   - 가격 변동 감지: ${result.priceUpdatesCount}건`);
  console.log(`   - 🕊️ 무빈소(직송·안치) 가능 식장 분류: ${result.directCremationHallsCount}건 (${Math.round((result.directCremationHallsCount / result.totalFetched) * 100)}%)`);
  console.log(`   - 비정상 수치(이상치) 차단: ${result.outliersBlockedCount}건`);
  console.log(`   - 옵트아웃(게재중단) 제외: ${result.optOutSkippedCount}건`);

  console.log('\n▶ [3단계] 상세 동기화 변동 및 감사 로그(Diff Logs):');
  result.diffLogs.forEach((log, idx) => {
    console.log(`   ${idx + 1}. [${log.changeType}] ${log.hallName} (${log.hallId})`);
    console.log(`      ➔ ${log.detail}`);
  });

  console.log('\n==========================================================================');
  console.log(`  ✅ ${result.statusMessage}`);
  console.log('==========================================================================\n');
}

main().catch(err => {
  console.error('동기화 실패:', err);
  process.exit(1);
});
