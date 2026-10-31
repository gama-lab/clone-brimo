import React, { useState } from 'react';
import { Share2, ChevronDown, ChevronUp, Check } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 bg-[#1078CA] flex flex-col justify-between overflow-y-auto no-scrollbar select-none animate-in fade-in duration-200">
      <div className="pb-6">
        {/* Safe area top */}
        <div className="h-[max(1rem,env(safe-area-inset-top,1rem))]" />

        {/* Top Header & Animated Checkmark Badge (Exact match to Reference WhatsApp Image 2026-10-31 at 16.03.18 (1).jpeg) */}
        <div className="pt-2 pb-5 px-4 text-center text-white relative">
          {/* Subtle curved background lines */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-2xl pointer-events-none" />

          {/* Animated Checkmark Circle with Ripple & Stroke Draw Animation */}
          <div className="relative w-16 h-16 mx-auto mb-3 flex items-center justify-center">
            {/* Soft pulse outer ring */}
            <div className="absolute inset-0 rounded-full bg-white/20 animate-ring-pulse pointer-events-none" />
            
            {/* White solid badge with spring pop */}
            <div className="w-16 h-16 rounded-full bg-white text-[#1078CA] flex items-center justify-center shadow-[0_8px_25px_rgba(0,0,0,0.2)] animate-pop-check z-10">
              <svg className="w-9 h-9" viewBox="0 0 48 48" fill="none">
                <path
                  d="M13 25 L21 33 L35 17"
                  stroke="#1078CA"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="animate-draw-check"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-xl font-extrabold tracking-tight text-white drop-shadow-sm">
            Transaksi Berhasil
          </h1>
          <p className="text-xs text-blue-100 mt-1 font-medium tracking-tight">
            {displayDateStr}
          </p>
        </div>

        {/* Main White Receipt Ticket Card */}
        <div className="px-4">
          <div className="bg-white rounded-3xl pt-5 px-5 pb-6 shadow-2xl relative overflow-hidden border border-slate-100">
            {/* AUTHENTIC BRI WATERMARK PATTERN BACKGROUND (Diagonal tiled BRI Logo + BRI text) */}
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
                  <g fill="#1078CA" opacity="0.065">
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

            {/* Total Transaksi */}
            <div className="text-center pb-3 border-b border-slate-100 relative z-10">
              <span className="text-xs text-slate-400 font-medium">Total Transaksi</span>
              <div className="text-2xl font-black text-[#0B4D8C] mt-1 tracking-tight">
                {formatRupiah(transaction.amount, false)}
              </div>
            </div>

            {/* No. Referensi */}
            <div className="py-2.5 flex items-center justify-between text-xs border-b border-slate-100 relative z-10">
              <span className="text-slate-400 font-medium">No. Ref</span>
              <span className="font-mono font-bold text-slate-800 tracking-tight">
                {categoryInfo.referenceDisplay}
              </span>
            </div>

            {/* Inner Bordered Card (from WhatsApp Image 2026-10-31 at 16.03.18 (1).jpeg) */}
            <div className="mt-3 p-3.5 border border-slate-200/80 rounded-2xl bg-white/70 backdrop-blur-[1px] relative z-10 space-y-3">
              {/* Sumber Dana */}
              <div>
                <span className="text-xs font-bold text-slate-800 block mb-2">
                  Sumber Dana
                </span>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-[#1078CA] text-white font-black flex items-center justify-center text-xs flex-shrink-0 shadow-xs">
                    HP
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-tight uppercase">
                      {user.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-semibold mt-0.5">BRI</p>
                    <p className="text-[10px] text-slate-400 font-mono">3819 **** **** 532</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100" />

              {/* Tujuan (Specific to E-Wallet, Pulsa/Data, QRIS, BRIVA, Transfer) */}
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
                    <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
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
            <div className="mt-3 pt-2 text-center border-t border-slate-100 relative z-10">
              <button
                type="button"
                onClick={() => setShowFullDetails(!showFullDetails)}
                className="text-xs font-bold text-[#1078CA] inline-flex items-center space-x-1 active:scale-95 transition-transform"
              >
                <span>Lihat Detail Transaksi</span>
                {showFullDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>

            {/* Perforated ticket edge simulation */}
            <div className="absolute -bottom-2.5 left-0 right-0 flex justify-between px-2 pointer-events-none">
              {[...Array(16)].map((_, i) => (
                <div key={i} className="w-3.5 h-3.5 rounded-full bg-[#1078CA]" />
              ))}
            </div>
          </div>
        </div>

        {/* Section: Produk Pilihan Untukmo (with 'mo' in sky blue) */}
        <div className="px-4 mt-6">
          <div className="flex items-center space-x-1 text-white font-bold text-xs mb-2.5">
            <span>Produk Pilihan Untuk</span>
            <span className="text-[#38BDF8] font-black">mo</span>
          </div>

          <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-1">
            {/* Card 1 */}
            <div className="min-w-[240px] bg-white rounded-2xl p-3 flex items-center space-x-3 shadow-md">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1078CA] flex items-center justify-center font-bold text-xs flex-shrink-0">
                BRI
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 leading-tight">Rekening Dana Nasabah (RDN)</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Investasi saham mudah & praktis</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="min-w-[240px] bg-white rounded-2xl p-3 flex items-center space-x-3 shadow-md">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#1078CA] flex items-center justify-center font-bold text-xs flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 leading-tight">Tabungan BritAma Rencana</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Wujudkan impian masa depanmu</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Actions: Bagikan & Selesai */}
      <div className="p-4 bg-white border-t border-slate-100 flex items-center space-x-3 shadow-lg flex-shrink-0">
        <button
          onClick={() => alert('Bukti transaksi berhasil dibagikan!')}
          className="flex-1 py-3 bg-white border border-[#1078CA] text-[#1078CA] font-bold text-xs rounded-xl flex items-center justify-center space-x-2 active:scale-98 transition-all"
        >
          <Share2 size={16} />
          <span>Bagikan</span>
        </button>

        <button
          onClick={onClose}
          className="flex-1 py-3 bg-[#1078CA] hover:bg-[#0c62a8] text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2 shadow-md active:scale-98 transition-all"
        >
          <div className="w-4 h-4 rounded-full bg-white text-[#1078CA] flex items-center justify-center">
            <Check size={12} className="stroke-[3]" />
          </div>
          <span>Selesai</span>
        </button>
      </div>
    </div>
  );
};
