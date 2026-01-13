// src/utils/date.ts

export const getFormattedDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  // 1월은 0부터 시작하므로 +1, 두 자릿수 유지를 위해 padStart 사용
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const date = String(now.getDate()).padStart(2, '0');
  
  // 단순 주차 계산 (1~7일=1주차, 8~14일=2주차...)
  const week = Math.ceil(now.getDate() / 7);
  
  return `${year}년 ${month}월 ${date}일 ${week}주차`;
};