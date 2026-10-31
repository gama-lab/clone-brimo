import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, ArrowLeft, Filter } from 'lucide-react';
import { Transaction, UserProfile, Screen } from '../../types';
import { formatRupiah, formatDateIndo } from '../../utils/format';
import { StatusBar } from '../common/StatusBar';
import { TransactionReceipt } from '../common/TransactionReceipt';
import { classifyTransaction } from '../../utils/transactionHelper';

interface AktivitasScreenProps {
  transactions: Transaction[];
  user: UserProfile;
  onNavigate: (screen: Screen) => void;
}

type AktivitasFilter = 'all' | 'qris' | 'ewallet' | 'pulsa_data' | 'transfer';

export const AktivitasScreen: React.FC<AktivitasScreenProps> = ({
  transactions,
  user,
  onNavigate,
}) => {
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [filterType, setFilterType] = useState<AktivitasFilter>('all');

  // User rule: Only show outgoing transactions ("uang keluar aja")
  const outgoingTransactions = useMemo(() => {
    return transactions.filter((t) => t.category === 'out');
  }, [transactions]);

  // Filtered by selected category chip
  const displayedTransactions = useMemo(() => {
    if (filterType === 'all') return outgoingTransactions;
    return outgoingTransactions.filter((tx) => {
      const info = classifyTransaction(tx);
      return info.kind === filterType;
    });
  }, [outgoingTransactions, filterType]);

  return (
    <div className="min-h-full pb-32 bg-slate-50 flex flex-col select-none">
      {/* Top Bar (from Photo on 31-10-26 at 15.17 #2.jpg) */}
      <div className="bg-[#1078CA] text-white pt-1 pb-3 px-4 sticky top-0 z-30 shadow-sm">
        <StatusBar darkTheme={true} />
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onNavigate('home')}
              className="p-1 hover:bg-white/10 rounded-full active:scale-95 transition-transform"
            >
              <ArrowLeft size={22} />
            </button>
            <h1 className="text-base font-bold">Aktivitas</h1>
          </div>
          <button
            onClick={() => alert('Filter aktivitas transaksi')}
            className="p-1 hover:bg-white/10 rounded-full text-white active:scale-95 transition-transform"
          >
            <SlidersHorizontal size={20} />
          </button>
        </div>

        {/* Quick Filter Categories: Semua | QRIS | E-Wallet | Paket Data | Transfer */}
        <div className="flex items-center space-x-2 mt-3 overflow-x-auto no-scrollbar pb-1 text-xs">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
              filterType === 'all'
                ? 'bg-white text-[#1078CA] shadow-sm'
                : 'bg-white/15 text-white hover:bg-white/25'
            }`}
          >
            Semua ({outgoingTransactions.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('qris')}
            className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
              filterType === 'qris'
                ? 'bg-white text-[#1078CA] shadow-sm'
                : 'bg-white/15 text-white hover:bg-white/25'
            }`}
          >
            QRIS
          </button>
          <button
            type="button"
            onClick={() => setFilterType('ewallet')}
            className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
              filterType === 'ewallet'
                ? 'bg-white text-[#1078CA] shadow-sm'
                : 'bg-white/15 text-white hover:bg-white/25'
            }`}
          >
            Top Up E-Wallet
          </button>
          <button
            type="button"
            onClick={() => setFilterType('pulsa_data')}
            className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
              filterType === 'pulsa_data'
                ? 'bg-white text-[#1078CA] shadow-sm'
                : 'bg-white/15 text-white hover:bg-white/25'
            }`}
          >
            Paket Data
          </button>
          <button
            type="button"
            onClick={() => setFilterType('transfer')}
            className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
              filterType === 'transfer'
                ? 'bg-white text-[#1078CA] shadow-sm'
                : 'bg-white/15 text-white hover:bg-white/25'
            }`}
          >
            Transfer
          </button>
        </div>
      </div>

      {/* List Items (Differentiated by category) */}
      <div className="p-3 space-y-2.5">
        {displayedTransactions.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <Filter size={32} className="mx-auto mb-2 opacity-40" />
            <p className="text-xs font-semibold">Tidak ada transaksi di kategori ini</p>
          </div>
        ) : (
          displayedTransactions.map((tx) => {
            const info = classifyTransaction(tx);

            return (
              <div
                key={tx.id}
                onClick={() => setSelectedTx(tx)}
                className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-start justify-between cursor-pointer hover:bg-blue-50/40 active:scale-[0.99] transition-all"
              >
                <div className="flex items-start space-x-3 min-w-0 flex-1">
                  {/* Category-specific icon avatar */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 border ${
                      info.kind === 'ewallet'
                        ? 'bg-purple-50/90 border-purple-100 text-purple-700'
                        : info.kind === 'pulsa_data'
                        ? 'bg-emerald-50/90 border-emerald-100 text-emerald-700'
                        : info.kind === 'briva'
                        ? 'bg-amber-50/90 border-amber-100 text-amber-700'
                        : info.kind === 'atm'
                        ? 'bg-slate-100 border-slate-200 text-slate-700'
                        : 'bg-blue-50/90 border-blue-100 text-[#1078CA]'
                    }`}
                  >
                    {info.icon}
                  </div>

                  {/* Transaction Information */}
                  <div className="min-w-0 flex-1 pr-2">
                    {/* Category pill badge */}
                    <div className="flex items-center space-x-1.5 mb-0.5">
                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border tracking-tight ${info.badgeBg}`}
                      >
                        {info.badgeText}
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-slate-900 leading-tight truncate">
                      {info.destinationTitle || tx.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5 leading-snug truncate">
                      {info.destinationSubtitle} • {info.destinationAccount}
                    </p>
                    <p className="text-xs font-black text-slate-900 mt-1">
                      {formatRupiah(tx.amount, false)}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      {formatDateIndo(tx.date)} {tx.time}
                    </span>
                  </div>
                </div>

                {/* Sukses Green Badge */}
                <span className="bg-[#2ECC71] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-xs flex-shrink-0 self-start mt-0.5">
                  Sukses
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Receipt Modal on click */}
      {selectedTx && (
        <TransactionReceipt
          transaction={selectedTx}
          user={user}
          onClose={() => setSelectedTx(null)}
        />
      )}
    </div>
  );
};
