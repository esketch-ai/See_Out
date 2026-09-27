/**
 * 일자 및 시간 표준화 유틸리티
 * - 전사 하드코딩 일자 제거 및 동적 한국 표준시(KST) 기반 서식화
 */

/**
 * Date 객체 정규화 (미제공 시 현재 시각)
 */
function toDate(input?: Date | string | number): Date {
  if (!input) return new Date();
  if (input instanceof Date) return input;
  return new Date(input);
}

/**
 * 2자리 패딩
 */
function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

/**
 * 한국어 일자 서식 반환 (예: "2026년 09월 28일")
 */
export function formatKoreanDate(input?: Date | string | number): string {
  const d = toDate(input);
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  return `${year}년 ${month}월 ${day}일`;
}

/**
 * 한국어 일시 서식 반환 (예: "2026년 09월 28일 14:30")
 */
export function formatKoreanDateTime(input?: Date | string | number): string {
  const d = toDate(input);
  const dateStr = formatKoreanDate(d);
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  return `${dateStr} ${hours}:${minutes}`;
}

/**
 * ISO YYYY-MM-DD 서식 반환 (예: "2026-09-28")
 */
export function formatISODate(input?: Date | string | number): string {
  const d = toDate(input);
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  return `${year}-${month}-${day}`;
}

/**
 * 기준일로부터 N일 후 한국어 일자 반환 (예: +30일 보증 만료일)
 */
export function getRelativeKoreanDate(offsetDays: number, baseDate?: Date | string | number): string {
  const d = toDate(baseDate);
  const target = new Date(d.getTime() + offsetDays * 24 * 60 * 60 * 1000);
  return formatKoreanDate(target);
}

/**
 * 당월 리포트 대상 기간 문자열 생성 (예: "2026년 09월 01일 ~ 09월 28일")
 */
export function getCurrentMonthPeriod(input?: Date | string | number): string {
  const d = toDate(input);
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  return `${year}년 ${month}월 01일 ~ ${month}월 ${day}일`;
}

/**
 * 당월 연-월 식별자 생성 (예: "2026-09")
 */
export function getCurrentYearMonth(input?: Date | string | number): string {
  const d = toDate(input);
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  return `${year}-${month}`;
}
