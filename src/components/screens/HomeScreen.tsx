import React, { useState } from 'react';
import { 
  Bell, 
  Headphones, 
  Search, 
  Eye, 
  EyeOff, 
  ChevronRight, 
  SlidersHorizontal,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { UserProfile, Transaction, Screen } from '../../types';
import { formatRupiah } from '../../utils/format';
import { BrimoLogo } from '../common/BrimoLogo';
import { StatusBar } from '../common/StatusBar';
import { 
  IconBrimoTransfer, 
  IconBrimoBriva, 
  IconBrimoEmas, 
  IconBrimoPulsa,
  IconBrimoTopUp,
  IconBrimoBrizzi,
  IconBrimoTagihan,
  IconBrimoLifestyle,
  IconBrimoAtm,
  IconBrimoJunior,
  IconBrimoKartu
} from '../common/BrimoIcons';

interface HomeScreenProps {
  user: UserProfile;
  transactions: Transaction[];
  onNavigate: (screen: Screen) => void;
  onOpenTransfer: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  user,
  transactions,
  onNavigate,
  onOpenTransfer,
}) => {
  const [showBalance, setShowBalance] = useState(false);
  const [activeBannerIdx, setActiveBannerIdx] = useState(0);

  // Time greeting helper
  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 11) return 'Selamat Pagi,';
    if (hours < 15) return 'Selamat Siang,';
    if (hours < 18) return 'Selamat Sore,';
    return 'Selamat Malam,';
  };

  const banners = [
    {
      id: 1,
      title: 'Top Up Cepat, Mabar Jadi Hebat',
      subtitle: 'Yuk, isi voucher game andalan kamu!',
      tag: 'GAMES',
      bg: 'from-[#005CA9] to-[#0A73CE]',
    },
    {
      id: 2,
      title: 'Lakukan Transaksi Rapatkan Silaturahmi',
      subtitle: 'Kirim THR dan berbagi kebaikan lewat BRImo',
      tag: 'SPESIAL',
      bg: 'from-[#004885] to-[#1078CA]',
    },
    {
      id: 3,
      title: 'Investasi Emas Mulai Rp 10.000',
      subtitle: 'Nabung emas digital aman & terjamin',
      tag: 'INVESTASI',
      bg: 'from-[#B7791F] to-[#D69E2E]',
    },
  ];

  return (
    <div className="min-h-full pb-20 bg-slate-50 flex flex-col select-none">
      {/* Top Blue Canvas Header */}
      <div className="bg-[#1078CA] text-white pt-2 pb-6 px-4 rounded-b-[2rem] shadow-sm relative overflow-hidden">
        <StatusBar darkTheme={true} />

        {/* Decorative subtle wave */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        {/* Top Header Row */}
        <div className="flex items-center justify-between mt-2 mb-3">
          {/* Logo and Greeting */}
          <div className="flex items-center space-x-2.5">
            <BrimoLogo size="md" variant="white" />
            <div>
              <p className="text-[11px] text-white/80 font-medium leading-none">{getGreeting()}</p>
              <h2 className="text-sm font-bold tracking-tight text-white mt-0.5">Herdiangga</h2>
            </div>
          </div>

          {/* Action icons */}
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => alert('Notifikasi BRImo: 2 pesan baru')}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white relative transition-all"
            >
              <Bell size={17} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-white" />
            </button>
            <button 
              onClick={() => alert('Sabrina: Asisten Virtual BRI 24/7')}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
            >
              <Headphones size={17} />
            </button>
            <button 
              onClick={() => onNavigate('account')}
              className="w-8 h-8 rounded-full bg-white/20 font-bold text-xs flex items-center justify-center text-white ring-1 ring-white/30"
            >
              HP
            </button>
          </div>
        </div>

        {/* Card Keterangan: Saldo Rekening Utama (Harus tampil penuh & tidak tertutupi) */}
        <div className="mt-3 bg-gradient-to-r from-[#0c5999] via-[#0b63ac] to-[#1078CA] rounded-2xl p-4 border border-white/20 shadow-lg relative overflow-hidden">
          {/* Wavy background accent */}
          <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-white/5 pointer-events-none" />

          {/* Title and Balance */}
          <div>
            <span className="text-[11px] text-white/80 font-medium">Saldo Rekening Utama</span>
            <div className="flex items-center space-x-3 mt-1">
              <span className="text-xl font-black tracking-wider text-white">
                {showBalance ? formatRupiah(user.balance) : '••••••••'}
              </span>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all"
              >
                {showBalance ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </div>
          </div>

          {/* Link: Semua Rekeningmu */}
          <div className="mt-3 pt-2.5 border-t border-white/15 flex items-center justify-between">
            <button
              onClick={() => onNavigate('mutasi')}
              className="text-xs font-semibold text-white/95 hover:text-white flex items-center space-x-1"
            >
              <span>Semua Rekeningmu</span>
              <ChevronRight size={14} />
            </button>
            <span className="text-[10px] text-blue-200 font-mono">
              3819 0104 **** 532
            </span>
          </div>
        </div>
      </div>

      {/* Main Body (Tampil di bawah Card Keterangan tanpa menutupi) */}
      <div className="px-4 mt-3.5 space-y-3.5">
        {/* Main Action Buttons (Transfer, BRIVA, Cicil Emas, Pulsa/Data) */}
        <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-100 flex items-center justify-around">
          <button onClick={onOpenTransfer} className="flex flex-col items-center active:scale-95 transition-transform">
            <IconBrimoTransfer size={24} />
            <span className="text-[11px] font-bold text-slate-700 mt-1.5">Transfer</span>
          </button>

          <button onClick={() => alert('Fitur BRIVA')} className="flex flex-col items-center active:scale-95 transition-transform">
            <IconBrimoBriva size={24} />
            <span className="text-[11px] font-bold text-slate-700 mt-1.5">BRIVA</span>
          </button>

          <button onClick={() => alert('Fitur Cicil Emas')} className="flex flex-col items-center active:scale-95 transition-transform">
            <IconBrimoEmas size={24} />
            <span className="text-[11px] font-bold text-slate-700 mt-1.5">Cicil Emas</span>
          </button>

          <button onClick={() => alert('Fitur Pulsa/Data')} className="flex flex-col items-center active:scale-95 transition-transform">
            <IconBrimoPulsa size={24} />
            <span className="text-[11px] font-bold text-slate-700 mt-1.5">Pulsa/Data</span>
          </button>
        </div>

        {/* Info Announcement Banner: Qita Hadir Lebih Cepat */}
        <div className="bg-white rounded-2xl p-3 border border-blue-100 shadow-sm flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#1078CA] flex items-center justify-center font-bold text-xs">
              Qita
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">Qita Hadir Lebih Cepat</h4>
              <p className="text-[10px] text-slate-500">Pindah ke Qita sekarang</p>
            </div>
          </div>
          <button
            onClick={() => alert('Layanan Qita BRI')}
            className="text-[10px] font-bold text-[#1078CA] flex items-center space-x-0.5 hover:underline"
          >
            <span>Klik di sini</span>
            <ChevronRight size={12} />
          </button>
        </div>

        {/* Promo Carousel */}
        <div>
          <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-1">
            {banners.map((b) => (
              <div
                key={b.id}
                className={`min-w-[280px] bg-gradient-to-r ${b.bg} rounded-2xl p-4 text-white shadow-sm flex flex-col justify-between`}
              >
                <div>
                  <span className="text-[8px] font-black bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-sm">
                    {b.tag}
                  </span>
                  <h4 className="font-bold text-xs mt-1.5 leading-snug">{b.title}</h4>
                  <p className="text-[10px] text-white/80 mt-0.5 line-clamp-1">{b.subtitle}</p>
                </div>
                <div className="mt-3 flex justify-end">
                  <button 
                    onClick={() => alert(`Klaim Promo: ${b.title}`)}
                    className="text-[10px] font-bold bg-white text-slate-900 px-3 py-1 rounded-full shadow-sm"
                  >
                    Lihat Promo
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center space-x-1.5 mt-2">
            {[0, 1, 2].map((idx) => (
              <div
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  activeBannerIdx === idx ? 'bg-[#1078CA] w-4' : 'bg-slate-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Search Bar & Atur Fitur */}
        <div className="flex items-center space-x-2 pt-1">
          <div className="flex-1 bg-white border border-slate-200 rounded-full px-3 py-2 flex items-center space-x-2 shadow-sm">
            <Search size={15} className="text-slate-400" />
            <input
              type="text"
              placeholder="Cari Fitur"
              className="w-full text-xs font-medium text-slate-800 bg-transparent focus:outline-none placeholder:text-slate-400"
            />
          </div>

          <button
            onClick={() => alert('Atur Urutan Fitur Favorit')}
            className="flex items-center space-x-1 bg-blue-50 border border-blue-200 text-[#1078CA] px-3 py-2 rounded-full text-xs font-bold shadow-sm"
          >
            <SlidersHorizontal size={13} />
            <span>Atur Fitur</span>
          </button>
        </div>

        {/* 8 Grid Menu Section (from Photo on 31-10-26 at 15.09 #2.jpg) */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <div className="grid grid-cols-4 gap-y-4 gap-x-2">
            {/* Top Up */}
            <button onClick={() => alert('Top Up Saldo')} className="flex flex-col items-center active:scale-95 transition-transform">
              <IconBrimoTopUp size={24} />
              <span className="text-[11px] font-medium text-slate-700 mt-1.5">Top Up</span>
            </button>

            {/* BRIZZI */}
            <button onClick={() => alert('Layanan Kartu BRIZZI')} className="flex flex-col items-center active:scale-95 transition-transform">
              <IconBrimoBrizzi size={24} />
              <span className="text-[11px] font-medium text-slate-700 mt-1.5">BRIZZI</span>
            </button>

            {/* Tagihan */}
            <button onClick={() => alert('Menu Pembayaran Tagihan')} className="flex flex-col items-center active:scale-95 transition-transform">
              <IconBrimoTagihan size={24} />
              <span className="text-[11px] font-medium text-slate-700 mt-1.5">Tagihan</span>
            </button>

            {/* Transfer */}
            <button onClick={onOpenTransfer} className="flex flex-col items-center active:scale-95 transition-transform">
              <IconBrimoTransfer size={24} />
              <span className="text-[11px] font-medium text-slate-700 mt-1.5">Transfer</span>
            </button>

            {/* Lifestyle */}
            <button onClick={() => alert('Menu Belanja & Lifestyle')} className="flex flex-col items-center active:scale-95 transition-transform">
              <IconBrimoLifestyle size={24} />
              <span className="text-[11px] font-medium text-slate-700 mt-1.5">Lifestyle</span>
            </button>

            {/* Setor & Tarik */}
            <button onClick={() => alert('Tarik Tunai Tanpa Kartu di ATM BRI')} className="flex flex-col items-center active:scale-95 transition-transform">
              <IconBrimoAtm size={24} />
              <span className="text-[10px] font-medium text-slate-700 mt-1.5 text-center leading-tight">Setor &<br />Tarik Tunai</span>
            </button>

            {/* Junior */}
            <button onClick={() => alert('BRImo Junior: Tabungan Anak Digital')} className="flex flex-col items-center active:scale-95 transition-transform">
              <IconBrimoJunior size={24} />
              <span className="text-[11px] font-medium text-slate-700 mt-1.5">Junior</span>
            </button>

            {/* Kartu */}
            <button onClick={() => alert('Pengelolaan Kartu Debit / Kredit')} className="flex flex-col items-center active:scale-95 transition-transform">
              <IconBrimoKartu size={24} />
              <span className="text-[11px] font-medium text-slate-700 mt-1.5">Kartu</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
