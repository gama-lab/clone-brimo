import React from 'react';
import { Home, ReceiptText, Mail, User } from 'lucide-react';
import { Screen } from '../../types';
import qrisLogoWhite from '../../assets/qris-logo-white.png';

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

      {/* Center Floating QRIS Button */}
      <div className="flex-1 flex flex-col items-center justify-center relative -top-4 pointer-events-auto">
        <button
          type="button"
          onClick={() => onNavigate('qris')}
          className="w-[62px] h-[62px] rounded-full bg-white p-[4.5px] shadow-[0_4px_16px_rgba(16,120,202,0.35),0_2px_6px_rgba(0,0,0,0.14)] active:scale-90 transition-all flex items-center justify-center"
          title="Scan QRIS"
          aria-label="Scan QRIS"
        >
          <span className="w-full h-full rounded-full bg-gradient-to-b from-[#1684DA] to-[#0D6DC0] flex items-center justify-center">
            <span className="relative w-[36px] h-[36px] flex items-center justify-center">
              <svg
                viewBox="0 0 36 36"
                fill="none"
                aria-hidden="true"
                className="absolute inset-0 w-full h-full pointer-events-none"
              >
                <path d="M2 10.5V3.5A1.5 1.5 0 0 1 3.5 2H10.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M25.5 2H32.5A1.5 1.5 0 0 1 34 3.5V10.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M2 25.5V32.5A1.5 1.5 0 0 0 3.5 34H10.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M25.5 34H32.5A1.5 1.5 0 0 0 34 32.5V25.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              <img
                src={qrisLogoWhite}
                alt="QRIS"
                draggable={false}
                className="w-[24px] h-auto object-contain pointer-events-none select-none"
              />
            </span>
          </span>
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
