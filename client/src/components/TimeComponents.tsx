// components/RelativeTime.tsx
import React from 'react';
import { TimeDisplay } from './TimeDisplay';

interface TimeDisplayProps {
  isoString: string;
  className?: string;
}

export const RelativeTime: React.FC<TimeDisplayProps> = ({ isoString, className }) => (
  <TimeDisplay 
    isoString={isoString} 
    format="relative" 
    className={className}
    autoUpdate={true}
  />
);

// components/AbsoluteTime.tsx
export const AbsoluteTime: React.FC<TimeDisplayProps> = ({ isoString, className }) => (
  <TimeDisplay 
    isoString={isoString} 
    format="absolute" 
    className={className}
    autoUpdate={false}
  />
);

// components/SmartTime.tsx
export const SmartTime: React.FC<TimeDisplayProps> = ({ isoString, className }) => (
  <TimeDisplay 
    isoString={isoString} 
    format="smart" 
    className={className}
    autoUpdate={false}
  />
);
