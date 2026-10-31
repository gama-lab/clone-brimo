import React, { useState, useEffect } from 'react';
import { Wifi, Signal } from 'lucide-react';

interface StatusBarProps {
  darkTheme?: boolean;
}

/**
 * Mobile Banking Status Bar
 * Displays live clock, signal, wifi, and battery with safe-area spacing so header is never cut off.
 */
export const StatusBar: React.FC<StatusBarProps> = ({ darkTheme = false }) => {
  const [currentTime, setCurrentTime] = useState('17:58');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${mins}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const textColor = darkTheme ? 'text-white' : 'text-slate-800';

  return (
    <div className={`w-full px-4 pt-[max(0.5rem,env(safe-area-inset-top,0.5rem))] pb-1 flex items-center justify-between text-[11px] font-bold ${textColor} select-none pointer-events-none`}>
      {/* Clock Time */}
      <span className="font-semibold tracking-tight">{currentTime}</span>

      {/* Status Bar Icons (Signal, Wifi, Battery) */}
      <div className="flex items-center space-x-1.5">
        <Signal size={12} className="stroke-[2.5]" />
        <Wifi size={12} className="stroke-[2.5]" />
        {/* Battery Icon with 95% charge */}
        <div className="flex items-center space-x-0.5">
          <div className="w-5 h-2.5 rounded-xs border border-current p-0.5 flex items-center">
            <div className="h-full w-[90%] bg-current rounded-2xs" />
          </div>
          <div className="w-0.5 h-1 bg-current rounded-r-xs" />
        </div>
      </div>
    </div>
  );
};
