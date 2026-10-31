import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Download, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Share2, 
  CheckCircle2, 
  X, 
  CreditCard,
  QrCode,
  Send,
  Smartphone,
  Wallet,
  Receipt
} from 'lucide-react';
import { Transaction, UserProfile, Screen } from '../../types';
import { formatRupiah, formatDateIndo } from '../../utils/format';
import { StatusBar } from '../common/StatusBar';

interface MutasiScreenProps {
  user: UserProfile;
  transactions: Transaction[];
  onNavigate: (screen: Screen) => void;
}

export const MutasiScreen: React.FC<MutasiScreenProps> = ({
  user,
  transactions,
  onNavigate,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'in' | 'out'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  // Filter transactions
  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      if (filterType === 'in' && tx.category !== 'in') return false;
      if (filterType === 'out' && tx.category !== 'out') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const mTitle = tx.title.toLowerCase().includes(q);
        const mDesc = tx.description.toLowerCase().includes(q);
        const mRef = tx.referenceNo.toLowerCase().includes(q);
        if (!mTitle && !mDesc && !mRef) return false;
      }
      return true;
    });
  }, [transactions, filterType, searchQuery]);

  // Group by date
  const grouped = useMemo(() => {
    const map: { [key: string]: Transaction[] } = {};
    filtered.forEach((tx) => {
      if (!map[tx.date]) {
        map[tx.date] = [];
      }
      map[tx.date].push(tx);
    });
    return map;
  }, [filtered]);

  // Icon selector based on transaction type
  const getTxIcon = (tx: Transaction) => {
    if (tx.type === 'qris') return <QrCode size={18} className="text-[#1078CA]" />;
    if (tx.type === 'pulsa') return <Smartphone size={18} className="text-emerald-600" />;
    if (tx.type === 'topup' || tx.type === 'briva') return <Wallet size={18} className="text-teal-600" />;
    if (tx.category === 'in') return <ArrowDownLeft size={18} className="text-emerald-600" />;
    return <ArrowUpRight size={18} className="text-rose-600" />;
  };

  return (
    <div className="min-h-full pb-32 bg-slate-50 flex flex-col select-none">
      {/* Top Header Bar */}
      <div className="bg-[#1078CA] text-white pt-1 pb-4 px-4 sticky top-0 z-30 shadow-sm">
        <StatusBar darkTheme={true} />
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center space-x-3">
            <button onClick={() => onNavigate('home')} className="p-1 hover:bg-white/10 rounded-full">
              <ArrowLeft size={22} />
            </button>
            <h1 className="text-base font-bold">Mutasi</h1>
          </div>
          <button
            onClick={() => alert('e-Statement PDF dari folder Mutasi berhasil diunduh!')}
            className="flex items-center space-x-1.5 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full text-xs font-bold transition-all border border-white/20"
          >
            <Download size={13} />
            <span>e-Statement</span>
          </button>
        </div>

        {/* Selected Account Card */}
        <div className="mt-3 bg-white/15 rounded-2xl p-3 border border-white/20 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
              <CreditCard size={17} />
            </div>
            <div>
              <span className="text-[10px] text-blue-100 font-medium block">Rekening Utama</span>
              <span className="text-xs font-bold text-white font-mono">3819 0104 **** 532</span>
            </div>
          </div>
          <span className="text-[10px] font-bold bg-[#FF9E1B] text-slate-900 px-2 py-0.5 rounded-md">
            BritAma
          </span>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="p-4 space-y-3 bg-white border-b border-slate-100 shadow-sm">
        {/* Search */}
        <div className="relative flex items-center">
          <Search size={15} className="absolute left-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari transaksi atau merchant..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#1078CA]"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 text-slate-400">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Category Tabs: Semua | Uang Masuk | Uang Keluar */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setFilterType('all')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterType === 'all' ? 'bg-white text-[#1078CA] shadow-sm' : 'text-slate-500'
            }`}
          >
            Semua ({transactions.length})
          </button>
          <button
            onClick={() => setFilterType('in')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterType === 'in' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500'
            }`}
          >
            Uang Masuk
          </button>
          <button
            onClick={() => setFilterType('out')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterType === 'out' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-500'
            }`}
          >
            Uang Keluar
          </button>
        </div>
      </div>

      {/* Grouped Transactions List */}
      <div className="p-4 space-y-4">
        {Object.keys(grouped).length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-100 mt-4">
            <Receipt size={32} className="text-slate-300 mx-auto mb-2" />
            <h4 className="text-xs font-bold text-slate-800">Tidak ada data transaksi</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Ubah kata kunci pencarian atau kategori filter.</p>
          </div>
        ) : (
          Object.keys(grouped).map((dateStr) => (
            <div key={dateStr} className="space-y-2">
              <span className="text-[11px] font-bold text-slate-600 bg-slate-200/80 px-2.5 py-0.5 rounded-full inline-block">
                {formatDateIndo(dateStr)}
              </span>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-100 overflow-hidden">
                {grouped[dateStr].map((tx) => (
                  <div
                    key={tx.id}
                    onClick={() => setSelectedTx(tx)}
                    className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-blue-50/40 active:bg-blue-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0">
                        {getTxIcon(tx)}
                      </div>
                      <div className="max-w-[190px] sm:max-w-xs">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{tx.title}</h4>
                        <p className="text-[11px] text-slate-500 truncate">{tx.description}</p>
                        <span className="text-[10px] text-slate-400 font-mono block">
                          {tx.time} • Ref: {tx.referenceNo}
                        </span>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span
                        className={`text-xs font-black block tracking-tight ${
                          tx.category === 'in' ? 'text-emerald-600' : 'text-slate-900'
                        }`}
                      >
                        {tx.category === 'in' ? '+' : '-'} {formatRupiah(tx.amount)}
                      </span>
                      <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded inline-block mt-0.5">
                        Sukses
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Transaction Detail Receipt Sheet */}
      {selectedTx && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-t-3xl p-6 space-y-4 shadow-2xl animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Rincian Transaksi</h3>
              <button
                onClick={() => setSelectedTx(null)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X size={16} />
              </button>
            </div>

            <div className="text-center py-2">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 size={32} />
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase">
                Transaksi Sukses
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-2">
                {selectedTx.category === 'in' ? '+' : '-'} {formatRupiah(selectedTx.amount)}
              </h2>
              <p className="text-xs font-bold text-slate-700 mt-1">{selectedTx.title}</p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 space-y-2 text-xs border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-400">Tanggal & Waktu</span>
                <span className="font-semibold text-slate-800">{formatDateIndo(selectedTx.date)} {selectedTx.time} WIB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Nomor Referensi (SEQ)</span>
                <span className="font-mono font-bold text-slate-800">{selectedTx.referenceNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Keterangan</span>
                <span className="font-medium text-slate-800 text-right max-w-[200px]">{selectedTx.description}</span>
              </div>
              {selectedTx.balanceAfter !== undefined && (
                <div className="flex justify-between pt-2 border-t border-slate-200">
                  <span className="text-slate-600 font-bold">Saldo Akhir</span>
                  <span className="font-black text-slate-900">{formatRupiah(selectedTx.balanceAfter)}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => alert('Bukti mutasi disalin')}
                className="py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center space-x-1"
              >
                <Share2 size={15} />
                <span>Bagikan</span>
              </button>
              <button
                onClick={() => alert('e-Statement PDF disimpan')}
                className="py-3 bg-[#1078CA] text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1"
              >
                <Download size={15} />
                <span>Unduh PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
