// components/TimeDisplay.tsx
import React, { useState, useEffect } from 'react';
import { TimeUtils } from '../utils/timeUtils';

export type TimeFormat = 'relative' | 'absolute' | 'smart' | 'datetime';

interface TimeDisplayProps {
  /** ISO8601 형식의 시간 문자열 */
  isoString: string;
  /** 표시 형식 */
  format?: TimeFormat;
  /** 상대 시간 자동 업데이트 여부 */
  autoUpdate?: boolean;
  /** 업데이트 간격 (밀리초, 기본: 60초) */
  updateInterval?: number;
  /** 클릭 시 형식 토글 여부 */
  toggleOnClick?: boolean;
  /** 추가 CSS 클래스 */
  className?: string;
  /** 툴팁 표시 여부 */
  showTooltip?: boolean;
}

export const TimeDisplay: React.FC<TimeDisplayProps> = ({
  isoString,
  format = 'relative',
  autoUpdate = true,
  updateInterval = 60000, // 1분
  toggleOnClick = false,
  className = '',
  showTooltip = true
}) => {
  const [currentFormat, setCurrentFormat] = useState<TimeFormat>(format);
  const [displayTime, setDisplayTime] = useState<string>('');
  const [tooltipTime, setTooltipTime] = useState<string>('');

  // 시간 업데이트 함수
  const updateTime = () => {
    switch (currentFormat) {
      case 'relative':
        setDisplayTime(TimeUtils.getRelativeTime(isoString));
        break;
      case 'absolute':
        setDisplayTime(TimeUtils.getAbsoluteDate(isoString));
        break;
      case 'smart':
        setDisplayTime(TimeUtils.getSmartDate(isoString));
        break;
      case 'datetime':
        setDisplayTime(TimeUtils.getAbsoluteDateTime(isoString));
        break;
    }

    // 툴팁용 상세 시간
    if (showTooltip) {
      setTooltipTime(TimeUtils.getAbsoluteDateTime(isoString));
    }
  };

  // 초기 렌더링 및 주기적 업데이트
  useEffect(() => {
    updateTime();

    if (autoUpdate && currentFormat === 'relative') {
      const interval = setInterval(updateTime, updateInterval);
      return () => clearInterval(interval);
    }
  }, [isoString, currentFormat, autoUpdate, updateInterval]);

  // 형식 토글 함수
  const toggleFormat = () => {
    if (!toggleOnClick) return;

    const formats: TimeFormat[] = ['relative', 'smart', 'absolute', 'datetime'];
    const currentIndex = formats.indexOf(currentFormat);
    const nextIndex = (currentIndex + 1) % formats.length;
    setCurrentFormat(formats[nextIndex]);
  };

  return (
    <span
      className={`time-display ${toggleOnClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={toggleFormat}
      title={showTooltip ? tooltipTime : undefined}
    >
      {displayTime}
    </span>
  );
};
