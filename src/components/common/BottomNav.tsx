import React from 'react';
import { Home, ReceiptText, Mail, User } from 'lucide-react';
import { Screen } from '../../types';

interface BottomNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  unreadCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentScreen,
  onNavigate,
  unreadCount = 2,
}) => {
  return (
    <nav className="relative w-full bg-white border-t border-slate-100 shadow-[0_-4px_25px_rgba(0,0,0,0.08)] px-2 pt-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] flex items-center justify-between z-40 select-none">
      {/* Home */}
      <button
        type="button"
        onClick={() => onNavigate('home')}
        className={`flex-1 flex flex-col items-center justify-center py-1 transition-all active:scale-95 ${
          currentScreen === 'home' ? 'text-[#1078CA] font-bold' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <Home size={22} className={currentScreen === 'home' ? 'stroke-[2.5]' : 'stroke-2'} />
        <span className="text-[10px] mt-0.5 font-medium">Home</span>
      </button>

      {/* Mutasi */}
      <button
        type="button"
        onClick={() => onNavigate('mutasi')}
        className={`flex-1 flex flex-col items-center justify-center py-1 transition-all active:scale-95 ${
          currentScreen === 'mutasi' ? 'text-[#1078CA] font-bold' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <ReceiptText size={22} className={currentScreen === 'mutasi' ? 'stroke-[2.5]' : 'stroke-2'} />
        <span className="text-[10px] mt-0.5 font-medium">Mutasi</span>
      </button>

      {/* Center Floating QRIS Button (Exact match to Photo on 31-10-26 at 15.09 #2.jpg) */}
      <div className="flex-1 flex flex-col items-center justify-center relative -top-4 pointer-events-auto">
        <button
          type="button"
          onClick={() => onNavigate('qris')}
          className="w-14 h-14 rounded-full bg-[#1078CA] text-white shadow-[0_8px_20px_rgba(16,120,202,0.45)] ring-4 ring-white active:scale-90 transition-all flex items-center justify-center"
          title="Scan QRIS"
        >
          {/* Official BRImo QRIS scanner icon with corner brackets and centered text */}
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            {/* 4 Corner brackets */}
            <path d="M4 9V5a1 1 0 0 1 1-1h4" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M19 4h4a1 1 0 0 1 1 1v4" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M4 19v4a1 1 0 0 0 1 1h4" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M19 24h4a1 1 0 0 0 1-1v-4" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            {/* Center QRIS Text */}
            <text
              x="14"
              y="16.5"
              fill="white"
              fontSize="7"
              fontWeight="900"
              fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
              textAnchor="middle"
              letterSpacing="-0.3"
            >
              QRIS
            </text>
          </svg>
        </button>
      </div>

      {/* Aktivitas */}
      <button
        type="button"
        onClick={() => onNavigate('aktivitas')}
        className={`flex-1 flex flex-col items-center justify-center py-1 relative transition-all active:scale-95 ${
          currentScreen === 'aktivitas' ? 'text-[#1078CA] font-bold' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <div className="relative">
          <Mail size={22} className={currentScreen === 'aktivitas' ? 'stroke-[2.5]' : 'stroke-2'} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border border-white" />
          )}
        </div>
        <span className="text-[10px] mt-0.5 font-medium">Aktivitas</span>
      </button>

      {/* Akun */}
      <button
        type="button"
        onClick={() => onNavigate('account')}
        className={`flex-1 flex flex-col items-center justify-center py-1 transition-all active:scale-95 ${
          currentScreen === 'account' ? 'text-[#1078CA] font-bold' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <User size={22} className={currentScreen === 'account' ? 'stroke-[2.5]' : 'stroke-2'} />
        <span className="text-[10px] mt-0.5 font-medium">Akun</span>
      </button>
    </nav>
  );
};
