import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronRight, Star, X } from 'lucide-react';
import { UserProfile } from '../../types';
import { formatRupiah } from '../../utils/format';
import { StatusBar } from '../common/StatusBar';
import { BankBriLogo } from '../common/BankBriLogo';

interface InfoSaldoScreenProps {
  user: UserProfile;
  onBack: () => void;
  onNavigateMutasi?: () => void;
}

export const InfoSaldoScreen: React.FC<InfoSaldoScreenProps> = ({
  user,
  onBack,
  onNavigateMutasi,
}) => {
  const [showDetailModal, setShowDetailModal] = useState(false);

  return (
    <div className="min-h-full h-full w-full bg-slate-50 flex flex-col justify-between select-none">
      {/* 1. TOP HEADER BAR */}
      <div className="bg-[#1078CA] text-white pt-2 pb-3.5 px-4 flex-shrink-0 shadow-sm relative z-20">
        <StatusBar darkTheme={true} />

        <div className="flex items-center justify-between mt-2">
          {/* Back Button */}
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 -ml-1 rounded-full flex items-center justify-center text-white hover:bg-white/10 active:scale-95 transition-all"
            title="Kembali"
          >
            <ArrowLeft size={22} />
          </button>

          {/* Title */}
          <h1 className="text-base font-bold text-white tracking-wide">
            Info Saldo
          </h1>

          {/* Currency Pill with Indonesian Flag */}
          <div className="flex items-center space-x-1.5 bg-white/15 hover:bg-white/20 active:bg-white/25 border border-white/25 rounded-full px-2.5 py-1 text-white cursor-pointer transition-colors shadow-xs">
            {/* Indonesian Flag Round Badge */}
            <div className="w-4 h-4 rounded-full overflow-hidden border border-white/40 flex flex-col flex-shrink-0 shadow-xs">
              <div className="w-full h-1/2 bg-[#ED1C24]" />
              <div className="w-full h-1/2 bg-white" />
            </div>
            <span className="text-xs font-bold leading-none">Rp</span>
            <ChevronDown size={14} className="text-white/90" />
          </div>
        </div>
      </div>

      {/* 2. SCROLLABLE CONTENT BODY */}
      <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col">
        {/* Total Saldo Card Section */}
        <div className="bg-white px-4 pt-6 pb-6 text-center flex flex-col items-center">
          <span className="text-xs font-medium text-slate-500 tracking-tight">
            Total Saldo
          </span>

          <h2 className="text-2xl font-black text-[#1078CA] tracking-tight mt-1 mb-3">
            {formatRupiah(user.balance)}
          </h2>

          <button
            type="button"
            onClick={() =>
              alert(
                'Informasi Jenis & Limit Transaksi:\n\n• Jenis: Tabungan BRI BritAma Classic / Gold\n• Tarik Tunai di ATM: Rp 10.000.000 / hari\n• Transfer Sesama BRI: Rp 100.000.000 / hari\n• Transfer Antar Bank: Rp 25.000.000 / hari\n• Pembayaran QRIS: Rp 10.000.000 / transaksi'
              )
            }
            className="px-3.5 py-1.5 border border-[#1078CA] text-[#1078CA] text-[11px] font-bold rounded-lg hover:bg-blue-50/70 active:scale-95 transition-all"
          >
            Lihat Jenis & Limit Transaksi
          </button>
        </div>

        {/* Subtle Horizontal Divider */}
        <div className="h-2.5 bg-slate-100/90 w-full border-t border-b border-slate-200/50" />

        {/* Account Item Row (Exact match to reference UI: square card flush left, rounded-r-[24px], authentic BRI logo & abstract waves) */}
        <div className="bg-white flex items-stretch border-b border-slate-100 relative pl-0 pr-4 py-3 sm:py-3.5 select-none">
          {/* Left: Debit Card Mockup Flush to Left Edge (Exact 1:1 square ratio, rounded-r-[24px], authentic organic circle waves) */}
          <div className="w-[126px] h-[126px] sm:w-[134px] sm:h-[134px] rounded-r-[24px] sm:rounded-r-[26px] rounded-l-none shadow-sm relative overflow-hidden flex-shrink-0">
            {/* Authentic BRImo Debit Card Abstract Waves Background */}
            <svg
              viewBox="0 0 222 222"
              className="absolute inset-0 w-full h-full pointer-events-none"
              preserveAspectRatio="none"
            >
              {/* Base Bank BRI Vibrant Blue */}
              <rect width="222" height="222" fill="#0F78CB" />

              {/* Top-Left Organic Circle Wave */}
              <circle cx="-6" cy="-9" r="95" fill="#0C69C1" />

              {/* Bottom-Right Outer Organic Circle Wave */}
              <circle cx="141" cy="190" r="83" fill="#0D69C0" />

              {/* Bottom-Right Inner Organic Circle Wave */}
              <circle cx="160" cy="210" r="50" fill="#095AB6" />
            </svg>

            {/* Official Bank BRI Logo (Emblem + BRI Wordmark) positioned top-right */}
            <div className="absolute top-2.5 right-2 sm:top-3 sm:right-2.5 z-10">
              <BankBriLogo className="w-[42px] sm:w-[46px] h-auto" variant="white" />
            </div>
          </div>

          {/* Right: Account Info & Balance */}
          <div className="flex-1 pl-3.5 sm:pl-4 flex flex-col justify-between py-0.5">
            <div>
              {/* Category Pill */}
              <div className="mb-1">
                <span className="border border-slate-200/90 bg-white text-slate-500 rounded-full px-2.5 py-0.5 text-[10px] font-medium inline-block shadow-2xs">
                  Belum ada nama kategori
                </span>
              </div>

              {/* Star + Account Number */}
              <div className="flex items-center space-x-1.5 mt-0.5">
                <Star size={13} className="fill-amber-400 text-amber-400 flex-shrink-0" />
                <span className="text-xs sm:text-[13px] font-bold text-slate-900 tracking-tight">
                  {user.accountNumber || '3819 0104 6674 532'}
                </span>
              </div>

              {/* Account Holder Name */}
              <p className="text-[11px] font-semibold text-slate-700 uppercase tracking-wide mt-0.5">
                {user.name || 'HERDIANGGA PRATAMA'}
              </p>
            </div>

            {/* Balance & Detail Link */}
            <div className="mt-auto pt-2 text-right">
              <div className="text-sm sm:text-base font-black text-slate-900 tracking-tight leading-tight">
                {formatRupiah(user.balance)}
              </div>
              <button
                type="button"
                onClick={() => setShowDetailModal(true)}
                className="text-xs font-bold text-[#1078CA] inline-flex items-center space-x-0.5 hover:underline active:opacity-70 transition-all mt-0.5 justify-end"
              >
                <span>Lihat Detail</span>
                <ChevronRight size={13} className="stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. PINNED BOTTOM ACTION BUTTON */}
      <div className="p-4 bg-white border-t border-slate-100 flex-shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-[max(1rem,env(safe-area-inset-bottom,1rem))]">
        <button
          type="button"
          onClick={() =>
            alert(
              'Pembukaan Rekening Baru:\nSilakan kunjungi Kantor Cabang BRI terdekat atau hubungi Contact BRI 1500017.'
            )
          }
          className="w-full py-3.5 bg-[#1078CA] hover:bg-[#0c66ac] active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center space-x-1"
        >
          <span>+ Buka Rekening Baru</span>
        </button>
      </div>

      {/* 4. DETAIL REKENING BOTTOM SHEET MODAL */}
      {showDetailModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-t-3xl p-5 text-slate-800 shadow-2xl animate-sheet-up space-y-4 max-h-[85vh] overflow-y-auto no-scrollbar">
            {/* Drag Handle */}
            <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto" />

            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Detail Rekening</h3>
              <button
                type="button"
                onClick={() => setShowDetailModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 active:scale-95"
              >
                <X size={18} />
              </button>
            </div>

            {/* Account Details List */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Nomor Rekening</span>
                <span className="font-bold text-slate-900 font-mono">
                  {user.accountNumber || '3819 0104 6674 532'}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Nama Pemilik</span>
                <span className="font-bold text-slate-900 uppercase">
                  {user.name || 'HERDIANGGA PRATAMA'}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Jenis Tabungan</span>
                <span className="font-bold text-slate-900">
                  {user.accountType || 'Tabungan BRI BritAma'}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Status Rekening</span>
                <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Aktif
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Saldo Efektif</span>
                <span className="font-bold text-[#1078CA]">
                  {formatRupiah(user.balance)}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Saldo Mengendap</span>
                <span className="font-semibold text-slate-700">Rp50.000,00</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Kantor Pembuka</span>
                <span className="font-semibold text-slate-800">KC Jakarta Sudirman</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 space-y-2">
              {onNavigateMutasi && (
                <button
                  type="button"
                  onClick={() => {
                    setShowDetailModal(false);
                    onNavigateMutasi();
                  }}
                  className="w-full py-3 bg-[#1078CA] hover:bg-[#0c66ac] text-white font-bold text-xs rounded-xl shadow-md active:scale-95 transition-all"
                >
                  Lihat Mutasi Rekening
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowDetailModal(false)}
                className="w-full py-2.5 text-slate-500 hover:text-slate-700 font-bold text-xs rounded-xl active:scale-95 transition-all"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
