import React from 'react';
import { ArrowLeft, Delete } from 'lucide-react';

interface PinOverlayProps {
  pin: string;
  errorMsg?: string;
  onDigitPress: (digit: string) => void;
  onDelete: () => void;
  onClose: () => void;
  onForgotPin?: () => void;
}

const KEYPAD_DIGITS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;

export const PinOverlay: React.FC<PinOverlayProps> = ({
  pin,
  errorMsg = '',
  onDigitPress,
  onDelete,
  onClose,
  onForgotPin,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/55 backdrop-blur-lg flex flex-col justify-between select-none animate-in fade-in duration-200 text-white">
      {/* Top Header: Back arrow + PIN */}
      <div className="pt-[max(0.75rem,env(safe-area-inset-top,0.75rem))] pb-2 px-4 flex items-center justify-between">
        <button
          type="button"
          onClick={onClose}
          aria-label="Kembali"
          className="w-9 h-9 rounded-full flex items-center justify-center text-white hover:bg-white/10 active:scale-95 transition-all"
        >
          <ArrowLeft size={22} />
        </button>
        <span className="text-sm font-bold text-white tracking-wide">PIN</span>
        <div className="w-9" />
      </div>

      {/* Upper-Center Area: Masukkan PIN, 6 Circles, Lupa PIN? */}
      <div className="text-center pt-6 pb-4 px-6">
        <h2 className="text-sm font-bold text-white tracking-tight">Masukkan PIN</h2>

        {/* 6 PIN Outline Circles */}
        <div className="flex items-center justify-center gap-5 mt-7">
          {[0, 1, 2, 3, 4, 5].map((idx) => (
            <div
              key={idx}
              className={`w-5 h-5 rounded-full border-[1.5px] transition-all duration-150 ${
                errorMsg
                  ? 'bg-rose-500 border-rose-500 animate-shake'
                  : pin.length > idx
                  ? 'bg-white border-white scale-105'
                  : 'border-white/90 bg-transparent'
              }`}
            />
          ))}
        </div>

        {/* Error text if any */}
        {errorMsg && (
          <p className="text-xs font-semibold text-rose-300 mt-3 animate-in fade-in">
            {errorMsg}
          </p>
        )}

        {/* Lupa PIN? */}
        <button
          type="button"
          onClick={
            onForgotPin ||
            (() => alert('Untuk lupa PIN, silakan hubungi Contact BRI 14017 atau reset melalui menu Akun.'))
          }
          className="mt-7 text-xs font-bold text-[#3CA4F4] hover:text-[#63B8FA] active:opacity-80 transition-opacity"
        >
          Lupa PIN?
        </button>
      </div>

      {/* Bottom Numeric Keypad: Transparent floating white digits */}
      <div className="w-full max-w-sm mx-auto px-6 pb-[max(2.25rem,env(safe-area-inset-bottom,2.25rem))]">
        <div className="grid grid-cols-3 gap-y-5 text-center">
          {KEYPAD_DIGITS.map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => onDigitPress(digit)}
              className="h-14 w-20 mx-auto rounded-full flex items-center justify-center text-[25px] font-normal text-white active:bg-white/15 active:scale-95 transition-all"
            >
              {digit}
            </button>
          ))}

          <div className="h-14 w-20 mx-auto" aria-hidden="true" />

          <button
            type="button"
            onClick={() => onDigitPress('0')}
            className="h-14 w-20 mx-auto rounded-full flex items-center justify-center text-[25px] font-normal text-white active:bg-white/15 active:scale-95 transition-all"
          >
            0
          </button>

          <button
            type="button"
            onClick={onDelete}
            aria-label="Hapus digit PIN"
            className="h-14 w-20 mx-auto rounded-full flex items-center justify-center text-white active:bg-white/15 active:scale-95 transition-all"
          >
            <Delete size={24} className="stroke-[1.75] text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};
