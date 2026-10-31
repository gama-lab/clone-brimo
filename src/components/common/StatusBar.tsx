import React from 'react';

interface StatusBarProps {
  darkTheme?: boolean;
}

/**
 * Native PWA Safe-Area Top Spacer
 * No fake HUD/battery/clock icons - allows real native OS status bar to show naturally.
 */
export const StatusBar: React.FC<StatusBarProps> = () => {
  return (
    <div className="w-full pt-[env(safe-area-inset-top,0px)] select-none pointer-events-none" />
  );
};
