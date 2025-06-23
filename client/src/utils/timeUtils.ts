// utils/timeUtils.ts
export class TimeUtils {
  
  /**
   * ISO8601 문자열을 Date 객체로 변환
   */
  static parseISOString(isoString: string): Date {
    return new Date(isoString);
  }

  /**
   * 현재 시간과의 차이를 계산 (밀리초)
   */
  static getTimeDifference(date: Date): number {
    return Date.now() - date.getTime();
  }

  /**
   * 상대적 시간 표현 (몇 초 전, 몇 분 전, 몇 시간 전, 1일 이상은 절대 시간)
   */
  static getRelativeTime(isoString: string): string {
    const date = this.parseISOString(isoString);
    const diff = this.getTimeDifference(date);
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      // 1일 이상이면 절대 시간으로 표시
      return this.getAbsoluteDate(isoString);
    } else if (hours > 0) {
      return `${hours}시간 전`;
    } else if (minutes > 0) {
      return `${minutes}분 전`;
    } else if (seconds > 0) {
      return `${seconds}초 전`;
    } else {
      return '방금 전';
    }
  }

  /**
   * 절대적 시간 표현 (날짜 표시)
   */
  static getAbsoluteDate(isoString: string, format: 'short' | 'long' = 'short'): string {
    const date = this.parseISOString(isoString);
    
    if (format === 'long') {
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  /**
   * 절대적 시간 표현 (시간 포함)
   */
  static getAbsoluteDateTime(isoString: string): string {
    const date = this.parseISOString(isoString);
    
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * 오늘/어제/그제 표현
   */
  static getSmartDate(isoString: string): string {
    const date = this.parseISOString(isoString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const dayBeforeYesterday = new Date(today);
    dayBeforeYesterday.setDate(today.getDate() - 2);

    const dateStr = date.toDateString();
    const todayStr = today.toDateString();
    const yesterdayStr = yesterday.toDateString();
    const dayBeforeYesterdayStr = dayBeforeYesterday.toDateString();

    if (dateStr === todayStr) {
      return `오늘 ${date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (dateStr === yesterdayStr) {
      return `어제 ${date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (dateStr === dayBeforeYesterdayStr) {
      return `그제 ${date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}`;
    }

    return this.getAbsoluteDate(isoString);
  }
}
