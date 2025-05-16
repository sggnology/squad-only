import dayjs from 'dayjs';

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

/**
 * 주어진 날짜 문자열을 'YYYY-MM-DD HH:mm:ss' 형식으로 포맷팅합니다.
 * @param dateString - ISO 8601 형식 등의 날짜 문자열
 * @returns 포맷팅된 날짜 문자열. 유효하지 않은 경우 원본 문자열 또는 빈 문자열 반환.
 */
export const formatDateTime = (dateString: string | Date | undefined | null): string => {
  if (!dateString) {
    return ''; // 또는 적절한 기본값
  }
  try {
    const date = dayjs(dateString);
    if (!date.isValid()) {
      console.warn(`[DateUtil] Invalid date string received: ${dateString}`);
      // 유효하지 않은 날짜는 원본 또는 빈 문자열로 반환 (요구사항에 따라 다름)
      return typeof dateString === 'string' ? dateString : '';
    }
    return date.format(DATE_TIME_FORMAT);
  } catch (error) {
    console.error(`[DateUtil] Error formatting date '${dateString}':`, error);
    return typeof dateString === 'string' ? dateString : ''; // 오류 발생 시 원본 반환
  }
};

// 필요에 따라 다른 날짜 관련 유틸리티 함수들을 추가할 수 있습니다.
// 예: export const formatDate = (dateString: string | Date): string => dayjs(dateString).format('YYYY-MM-DD');
