import React, { useState } from 'react';
import { Share2, ChevronDown, ChevronUp, CheckCircle2, CreditCard } from 'lucide-react';
import { Transaction, UserProfile } from '../../types';
import { formatRupiah, formatDateIndo } from '../../utils/format';
import { classifyTransaction } from '../../utils/transactionHelper';

interface TransactionReceiptProps {
  transaction: Transaction;
  user: UserProfile;
  onClose: () => void;
}

export const TransactionReceipt: React.FC<TransactionReceiptProps> = ({
  transaction,
  user,
  onClose,
}) => {
  const [showFullDetails, setShowFullDetails] = useState(false);
  const categoryInfo = classifyTransaction(transaction);

  // Parse time and date for display
  const displayTime = transaction.fullTime || `${transaction.time}:00 WIB`;
  const displayDateStr = `${formatDateIndo(transaction.date)}, ${displayTime.includes('WIB') ? displayTime : `${displayTime} WIB`}`;

  return (
    <div className="fixed inset-0 z-50 bg-[#F4F7FB] flex flex-col justify-between overflow-y-auto no-scrollbar select-none animate-in fade-in duration-200">
      <div>
        {/* Top Vibrant Blue Curved Banner (matches media_1793438854718_f7e3288c.jpg) */}
        <div className="relative bg-[#0B7DE6] text-white pt-[max(0.75rem,env(safe-area-inset-top,0.75rem))] pb-14 px-4 overflow-hidden flex-shrink-0">
          {/* Organic flowing curved waves */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
            preserveAspectRatio="none"
            viewBox="0 0 400 240"
            fill="none"
          >
            <path
              d="M-40 150 C 70 80, 190 200, 440 100"
              stroke="white"
              strokeWidth="50"
              strokeLinecap="round"
            />
            <path
              d="M-20 60 C 130 170, 270 40, 440 130"
              stroke="white"
              strokeWidth="35"
              strokeLinecap="round"
            />
          </svg>

          {/* Center Checkmark & Title */}
          <div className="relative z-10 text-center pt-2">
            {/* White Circular Badge with Vibrant Blue Rounded Checkmark */}
            <div className="w-16 h-16 rounded-full bg-white text-[#0B7DE6] flex items-center justify-center shadow-[0_6px_20px_rgba(0,0,0,0.15)] mx-auto mb-3 animate-pop-check">
              <svg className="w-8 h-8" viewBox="0 0 48 48" fill="none">
                <path
                  d="M13 25 L21 33 L35 17"
                  stroke="#0B7DE6"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="animate-draw-check"
                />
              </svg>
            </div>

            <h1 className="text-xl font-bold tracking-tight text-white drop-shadow-xs">
              Transaksi Berhasil
            </h1>
            <p className="text-xs text-white/90 mt-1 font-medium tracking-tight">
              {displayDateStr}
            </p>
          </div>
        </div>

        {/* Overlapping White Receipt Ticket Card */}
        <div className="px-4 -mt-8 relative z-20 pb-4">
          <div className="bg-white rounded-3xl pt-5 px-5 pb-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] relative overflow-hidden border border-slate-100">
            {/* Authentic BRI Diagonal Repeating Watermark Background */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none select-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern
                  id="bri-watermark-pattern"
                  width="130"
                  height="70"
                  patternUnits="userSpaceOnUse"
                  patternTransform="rotate(-28)"
                >
                  <g fill="#0B7DE6" opacity="0.055">
                    {/* Official BRI 4-diamond squares emblem */}
                    <rect x="12" y="14" width="4.5" height="4.5" rx="1.2" transform="rotate(45 14.25 16.25)" />
                    <rect x="20" y="14" width="4.5" height="4.5" rx="1.2" transform="rotate(45 22.25 16.25)" />
                    <rect x="16" y="10" width="4.5" height="4.5" rx="1.2" transform="rotate(45 18.25 12.25)" />
                    <rect x="16" y="18" width="4.5" height="4.5" rx="1.2" transform="rotate(45 18.25 20.25)" />
                    {/* BRI typography */}
                    <text
                      x="29"
                      y="18.5"
                      fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
                      fontWeight="900"
                      fontSize="10"
                      letterSpacing="0.4"
                    >
                      BRI
                    </text>

                    {/* Staggered second instance */}
                    <rect x="77" y="49" width="4.5" height="4.5" rx="1.2" transform="rotate(45 79.25 51.25)" />
                    <rect x="85" y="49" width="4.5" height="4.5" rx="1.2" transform="rotate(45 87.25 51.25)" />
                    <rect x="81" y="45" width="4.5" height="4.5" rx="1.2" transform="rotate(45 83.25 47.25)" />
                    <rect x="81" y="53" width="4.5" height="4.5" rx="1.2" transform="rotate(45 83.25 55.25)" />
                    <text
                      x="94"
                      y="53.5"
                      fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
                      fontWeight="900"
                      fontSize="10"
                      letterSpacing="0.4"
                    >
                      BRI
                    </text>
                  </g>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#bri-watermark-pattern)" />
            </svg>

            {/* Total Transaksi Header */}
            <div className="text-center relative z-10 pb-1">
              <span className="text-xs text-slate-400 font-medium">Total Transaksi</span>
              <div className="text-[26px] font-black text-[#0A3966] mt-0.5 tracking-tight">
                {formatRupiah(transaction.amount, false)}
              </div>
            </div>

            {/* No. Ref Row */}
            <div className="pt-2 pb-2 flex items-center justify-between text-xs relative z-10">
              <span className="text-slate-400 font-medium">No. Ref</span>
              <span className="font-bold text-slate-800 tracking-tight font-sans">
                {categoryInfo.referenceDisplay}
              </span>
            </div>

            {/* Inner Bordered Card (Exact match to real screenshot) */}
            <div className="mt-1 p-3.5 border border-slate-200/90 rounded-2xl bg-white relative z-10 space-y-3">
              {/* Sumber Dana */}
              <div>
                <span className="text-xs font-bold text-slate-800 block mb-2">
                  Sumber Dana
                </span>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-[#0B7DE6] text-white font-bold flex items-center justify-center text-xs flex-shrink-0 shadow-xs">
                    HP
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-tight uppercase">
                      {user.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">BRI</p>
                    <p className="text-[10px] text-slate-400 font-mono">3819 **** **** 532</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100" />

              {/* Tujuan */}
              <div>
                <span className="text-xs font-bold text-slate-800 block mb-2">
                  Tujuan
                </span>
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {categoryInfo.receiptIcon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-slate-900 leading-tight truncate">
                      {categoryInfo.destinationTitle}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      {categoryInfo.destinationSubtitle}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {categoryInfo.destinationAccount}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Expandable Detail Section */}
            {showFullDetails && (
              <div className="mt-3 pt-3 border-t border-slate-100 text-xs space-y-2 text-slate-600 relative z-10 animate-in fade-in">
                <div className="flex justify-between">
                  <span className="text-slate-400">Jenis Transaksi</span>
                  <span className="font-semibold text-slate-800">{categoryInfo.badgeText}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Deskripsi</span>
                  <span className="font-semibold text-slate-800 text-right max-w-[200px] truncate">
                    {transaction.description}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Biaya Administrasi</span>
                  <span className="font-semibold text-slate-800">Rp 0 (Gratis)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status</span>
                  <span className="font-bold text-emerald-600">Berhasil (Sukses)</span>
                </div>
                {transaction.balanceAfter !== undefined && (
                  <div className="flex justify-between pt-1 border-t border-slate-100">
                    <span className="text-slate-500 font-bold">Saldo Akhir</span>
                    <span className="font-black text-slate-900">{formatRupiah(transaction.balanceAfter)}</span>
                  </div>
                )}
              </div>
            )}

            {/* Toggle: Lihat Detail Transaksi */}
            <div className="mt-3.5 pt-1 text-center relative z-10">
              <button
                type="button"
                onClick={() => setShowFullDetails(!showFullDetails)}
                className="text-xs font-bold text-[#0B7DE6] inline-flex items-center space-x-1 active:scale-95 transition-transform"
              >
                <span>Lihat Detail Transaksi</span>
                {showFullDetails ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </button>
            </div>

            {/* Scalloped ticket cutouts into light background bg-[#F4F7FB] */}
            <div className="absolute -bottom-2 left-0 right-0 flex justify-between px-1 pointer-events-none">
              {[...Array(19)].map((_, i) => (
                <div key={i} className="w-3.5 h-3.5 rounded-full bg-[#F4F7FB]" />
              ))}
            </div>
          </div>

          {/* Section: Produk Pilihan Untukmo (matches real screenshot) */}
          <div className="mt-5">
            <h3 className="text-xs font-bold text-slate-900 mb-2.5">
              Produk Pilihan Untuk<span className="text-[#0B7DE6] font-black">mo</span>
            </h3>

            <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-1">
              {/* Card 1: Rekening Dana Nasabah (RDN) */}
              <div className="min-w-[230px] bg-white rounded-2xl p-3 flex items-center space-x-3 shadow-2xs border border-slate-200/60 flex-shrink-0">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0B7DE6] flex flex-col items-center justify-center font-bold text-[9px] leading-tight flex-shrink-0 border border-blue-100/70">
                  <span className="font-black text-[#0B7DE6] text-[10px]">BRI</span>
                  <span className="text-[7px] text-slate-400 -mt-0.5 font-medium">danareksa</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 leading-tight">Rekening Dana Nasabah (RDN)</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Investasi saham mudah & praktis</p>
                </div>
              </div>

              {/* Card 2: Tabungan BritAma Rencana */}
              <div className="min-w-[230px] bg-white rounded-2xl p-3 flex items-center space-x-3 shadow-2xs border border-slate-200/60 flex-shrink-0">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#0B7DE6] flex items-center justify-center font-bold text-xs flex-shrink-0 border border-sky-100/70">
                  <CreditCard size={18} className="text-[#0B7DE6]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 leading-tight">Tabungan BritAma Rencana</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Wujudkan impian masa depanmu</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Actions: Bagikan & Selesai (Exact styling from screenshot) */}
      <div className="p-4 bg-white border-t border-slate-200/80 flex items-center space-x-3 flex-shrink-0 shadow-lg pb-[max(1rem,env(safe-area-inset-bottom,1rem))]">
        <button
          onClick={() => alert('Bukti transaksi berhasil dibagikan!')}
          className="flex-1 py-3 bg-white border border-[#0B7DE6] text-[#0B7DE6] font-bold text-xs rounded-xl flex items-center justify-center space-x-2 active:scale-98 transition-all shadow-2xs"
        >
          <Share2 size={16} />
          <span>Bagikan</span>
        </button>

        <button
          onClick={onClose}
          className="flex-1 py-3 bg-[#0B7DE6] hover:bg-[#096ecb] text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2 shadow-sm active:scale-98 transition-all"
        >
          <CheckCircle2 size={16} />
          <span>Selesai</span>
        </button>
      </div>
    </div>
  );
};
