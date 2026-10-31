import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ChevronRight, 
  User, 
  CreditCard, 
  Lock, 
  Sliders, 
  Globe, 
  LogOut, 
  ShieldCheck, 
  FileText,
  KeyRound,
  LayoutGrid,
  RefreshCw,
  Wallet
} from 'lucide-react';
import { UserProfile, Screen } from '../../types';
import { StatusBar } from '../common/StatusBar';

interface AccountScreenProps {
  user: UserProfile;
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
}

export const AccountScreen: React.FC<AccountScreenProps> = ({
  user,
  onNavigate,
  onLogout,
}) => {
  const [fingerprintEnabled, setFingerprintEnabled] = useState(true);

  return (
    <div className="min-h-full pb-20 bg-slate-50 flex flex-col select-none">
      {/* Top Header Bar */}
      <div className="bg-[#1078CA] text-white pt-1 pb-4 px-4 sticky top-0 z-30 shadow-sm">
        <StatusBar darkTheme={true} />
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center space-x-3">
            <button onClick={() => onNavigate('home')} className="p-1 hover:bg-white/10 rounded-full">
              <ArrowLeft size={22} />
            </button>
            <h1 className="text-base font-bold">Akun</h1>
          </div>
          <div className="w-8" />
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Profile Card (from Photo on 31-10-26 at 15.18.jpg) */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-[#EBF5FC] text-[#1078CA] font-extrabold flex items-center justify-center text-sm shadow-inner">
              HP
            </div>
            <div>
              <h2 className="text-xs font-bold text-slate-900 tracking-tight uppercase">
                HERDIANGGA PRATAMA
              </h2>
              {/* BRI Poin Badge */}
              <div className="flex items-center space-x-1.5 mt-1">
                <span className="bg-[#1078CA] text-white text-[8px] font-black px-1.5 py-0.5 rounded">
                  BRIpoin
                </span>
                <span className="text-xs font-bold text-slate-700 font-mono">11.650</span>
              </div>
            </div>
          </div>
          <ChevronRight size={18} className="text-slate-400" />
        </div>

        {/* Section 1: Informasi Pribadi */}
        <div>
          <h3 className="text-xs font-bold text-slate-800 mb-1.5 px-1">Informasi Pribadi</h3>
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm divide-y divide-slate-100 overflow-hidden">
            <button 
              onClick={() => alert('Data Diri & Pekerjaan')}
              className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
            >
              <div className="flex items-center space-x-3">
                <User size={18} className="text-slate-400" />
                <span className="text-xs font-semibold text-slate-800">Data Diri & Pekerjaan</span>
              </div>
              <ChevronRight size={16} className="text-slate-400" />
            </button>
          </div>
        </div>

        {/* Section 2: Pengaturan */}
        <div>
          <h3 className="text-xs font-bold text-slate-800 mb-1.5 px-1">Pengaturan</h3>
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm divide-y divide-slate-100 overflow-hidden">
            <button 
              onClick={() => alert('Fast Menu')}
              className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
            >
              <div className="flex items-center space-x-3">
                <LayoutGrid size={18} className="text-slate-400" />
                <span className="text-xs font-semibold text-slate-800">Fast Menu</span>
              </div>
              <ChevronRight size={16} className="text-slate-400" />
            </button>

            <button 
              onClick={() => alert('Update Rekening')}
              className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
            >
              <div className="flex items-center space-x-3">
                <RefreshCw size={18} className="text-slate-400" />
                <span className="text-xs font-semibold text-slate-800">Update Rekening</span>
              </div>
              <ChevronRight size={16} className="text-slate-400" />
            </button>

            <button 
              onClick={() => alert('Pengelolaan Kartu')}
              className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
            >
              <div className="flex items-center space-x-3">
                <CreditCard size={18} className="text-slate-400" />
                <span className="text-xs font-semibold text-slate-800">Pengelolaan Kartu</span>
              </div>
              <ChevronRight size={16} className="text-slate-400" />
            </button>

            <button 
              onClick={() => alert('Sumber Dana QRIS')}
              className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
            >
              <div className="flex items-center space-x-3">
                <Wallet size={18} className="text-slate-400" />
                <span className="text-xs font-semibold text-slate-800">Sumber Dana QRIS</span>
              </div>
              <ChevronRight size={16} className="text-slate-400" />
            </button>

            <button 
              onClick={() => alert('Pengaturan Bahasa: Bahasa Indonesia')}
              className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
            >
              <div className="flex items-center space-x-3">
                <Globe size={18} className="text-slate-400" />
                <span className="text-xs font-semibold text-slate-800">Bahasa</span>
              </div>
              <ChevronRight size={16} className="text-slate-400" />
            </button>
          </div>
        </div>

        {/* Section 3: Keamanan */}
        <div>
          <h3 className="text-xs font-bold text-slate-800 mb-1.5 px-1">Keamanan</h3>
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm divide-y divide-slate-100 overflow-hidden">
            <button 
              onClick={() => alert('Ubah PIN BRImo')}
              className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
            >
              <div className="flex items-center space-x-3">
                <Lock size={18} className="text-slate-400" />
                <span className="text-xs font-semibold text-slate-800">Ubah Pin</span>
              </div>
              <ChevronRight size={16} className="text-slate-400" />
            </button>

            <button 
              onClick={() => alert('Ubah Password BRImo')}
              className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
            >
              <div className="flex items-center space-x-3">
                <KeyRound size={18} className="text-slate-400" />
                <span className="text-xs font-semibold text-slate-800">Ubah Password</span>
              </div>
              <ChevronRight size={16} className="text-slate-400" />
            </button>

            {/* Login Fingerprint Toggle */}
            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <ShieldCheck size={18} className="text-slate-400" />
                <span className="text-xs font-semibold text-slate-800">Login Fingerprint</span>
              </div>
              <button
                type="button"
                onClick={() => setFingerprintEnabled(!fingerprintEnabled)}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  fingerprintEnabled ? 'bg-[#1078CA]' : 'bg-slate-300'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                  fingerprintEnabled ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="pt-2 pb-4">
          <button
            onClick={() => {
              if (window.confirm('Apakah Anda yakin ingin keluar dari akun BRImo?')) {
                onLogout();
              }
            }}
            className="w-full py-3.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs rounded-xl flex items-center justify-center space-x-2 border border-rose-200 transition-colors"
          >
            <LogOut size={16} />
            <span>Keluar Akun (Logout)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
