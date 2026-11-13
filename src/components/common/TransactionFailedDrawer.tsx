import React, { useEffect } from 'react';
import brokenCardImg from '../../assets/broken-card-bri.png';

// Preload & decode broken card asset early so it appears instantaneously with the drawer
if (typeof window !== 'undefined') {
  const preload = new Image();
  preload.src = brokenCardImg;
  preload.decode?.().catch(() => {});
}

interface TransactionFailedDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  code?: string;
}

/**
 * Bottom sheet drawer shown when a transaction (Transfer / QRIS) fails,
 * matching BRImo's "Transaksi Belum Berhasil" modal with broken BRI card artwork.
 */
export const TransactionFailedDrawer: React.FC<TransactionFailedDrawerProps> = ({
  isOpen,
  onClose,
  code = 'MT05',
}) => {
  useEffect(() => {
    const img = new Image();
    img.src = brokenCardImg;
    img.decode?.().catch(() => {});
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-slate-900/45 backdrop-blur-[2px] z-50 flex flex-col justify-end select-none animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-3xl w-full max-w-md mx-auto px-6 pt-7 pb-[max(1.5rem,env(safe-area-inset-bottom,1.5rem))] text-center shadow-2xl animate-sheet-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Broken BRI Card Illustration */}
        <div className="flex justify-center">
          <img
            src={brokenCardImg}
            alt="Transaksi Belum Berhasil"
            loading="eager"
            decoding="sync"
            className="w-48 h-auto object-contain select-none pointer-events-none"
            draggable={false}
          />
        </div>

        {/* Title & Error Code */}
        <div className="mt-3">
          <h3 className="text-[19px] font-bold text-[#0F172A] leading-snug tracking-tight">
            Transaksi Belum Berhasil
          </h3>
          <p className="text-[15px] text-[#5B6777] mt-1.5 font-normal">
            Transaksi gagal (Kode : {code})
          </p>
        </div>

        {/* Action Button */}
        <div className="mt-7">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3.5 bg-[#0A6FC2] hover:bg-[#085da3] active:scale-[0.98] text-white font-bold text-base rounded-xl shadow-sm transition-all"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};
