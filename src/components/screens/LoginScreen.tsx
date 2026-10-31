import React, { useState } from 'react';
import { 
  Headphones, 
  Info, 
  Fingerprint, 
  Eye, 
  EyeOff, 
  Lock, 
  User, 
  QrCode, 
  CreditCard, 
  Wallet, 
  Send,
  FileText
} from 'lucide-react';
import { BrimoLogo, BrimoAppIcon } from '../common/BrimoLogo';
import { StatusBar } from '../common/StatusBar';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [showLoginSheet, setShowLoginSheet] = useState(false);
  const [username, setUsername] = useState('herd************');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bioActive, setBioActive] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
    }, 500);
  };

  const handleBiometricClick = () => {
    setBioActive(true);
    setTimeout(() => {
      setBioActive(false);
      onLoginSuccess();
    }, 600);
  };

  return (
    <div className="min-h-full flex flex-col justify-between bg-gradient-to-b from-[#0A6EC7] via-[#1078CA] to-[#1884DC] text-white relative overflow-hidden select-none">
      <StatusBar darkTheme={true} />

      {/* Top Header Bar */}
      <div className="px-4 pt-2 flex items-center justify-between z-10">
        {/* Language selector pill */}
        <button
          onClick={() => alert('Bahasa: Indonesia (ID)')}
          className="flex items-center space-x-1.5 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-white hover:bg-white/30 transition-all border border-white/20"
        >
          <span className="text-sm">🇮🇩</span>
          <span>ID</span>
        </button>

        {/* Center Logo */}
        <BrimoLogo size="lg" variant="white" />

        {/* Right Contact button */}
        <button
          onClick={() => alert('Kontak Kami: Contact BRI 1500017 / Sabrina Chat')}
          className="flex items-center space-x-1 text-white/90 hover:text-white text-xs font-semibold"
        >
          <Headphones size={16} />
          <span className="text-[11px] leading-tight">Kontak<br />Kami</span>
        </button>
      </div>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pt-2 pb-6 z-10 text-center">
        <h2 className="text-sm font-semibold text-white/95 mb-6 tracking-wide">
          Yuk! mulai transaksimu bersama BRImo!
        </h2>

        {/* Clean Native Hero Showcase Displaying BRImo Icon */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          {/* Circular backdrop illustration */}
          <div className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 shadow-inner" />
          <div className="absolute inset-5 rounded-full bg-gradient-to-tr from-sky-400/20 to-white/15" />

          {/* City skyline silhouettes */}
          <div className="absolute bottom-6 w-52 h-14 bg-white/10 rounded-t-2xl pointer-events-none" />

          {/* Official BRImo Icon (BRI on top, Mo in sky blue) */}
          <div className="relative z-10 transform hover:scale-105 transition-transform duration-300">
            <BrimoAppIcon size={96} className="shadow-2xl ring-4 ring-white/30" />
          </div>
        </div>
      </div>

      {/* Bottom Fast Menu & Login Actions Card */}
      <div className="bg-white text-slate-800 rounded-t-3xl pt-4 pb-6 px-4 shadow-[0_-10px_35px_rgba(0,0,0,0.15)] z-10">
        {/* Fast Menu Header */}
        <div className="flex items-center justify-center space-x-1 text-slate-500 mb-3">
          <span className="text-xs font-bold">Fast Menu</span>
          <Info size={13} className="text-slate-400" />
        </div>

        {/* Fast Menu Icons Horizontal Scroll */}
        <div className="flex items-center justify-between px-2 mb-4">
          <button onClick={() => alert('Fitur QRIS Cepat')} className="flex flex-col items-center">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#1078CA] flex items-center justify-center shadow-sm">
              <QrCode size={20} />
            </div>
            <span className="text-[10px] font-bold text-slate-600 mt-1.5">QRIS</span>
          </button>

          <button onClick={() => alert('Cek Saldo BRIZZI')} className="flex flex-col items-center">
            <div className="w-11 h-11 rounded-2xl bg-teal-50 text-[#00A896] flex items-center justify-center shadow-sm">
              <CreditCard size={20} />
            </div>
            <span className="text-[10px] font-bold text-slate-600 mt-1.5">BRIZZI</span>
          </button>

          <button onClick={() => alert('Top Up E-Wallet')} className="flex flex-col items-center">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-[#2ECC71] flex items-center justify-center shadow-sm">
              <Wallet size={20} />
            </div>
            <span className="text-[10px] font-bold text-slate-600 mt-1.5">E-Wallet</span>
          </button>

          <button onClick={() => alert('Pembayaran BRIVA')} className="flex flex-col items-center">
            <div className="w-11 h-11 rounded-2xl bg-cyan-50 text-[#009E96] flex items-center justify-center shadow-sm">
              <FileText size={20} />
            </div>
            <span className="text-[10px] font-bold text-slate-600 mt-1.5">BRIVA</span>
          </button>

          <button onClick={() => alert('Transfer Cepat')} className="flex flex-col items-center">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#1078CA] flex items-center justify-center shadow-sm">
              <Send size={20} />
            </div>
            <span className="text-[10px] font-bold text-slate-600 mt-1.5">Transfer</span>
          </button>
        </div>

        {/* Small Slider Indicator */}
        <div className="w-8 h-1 bg-slate-300 rounded-full mx-auto mb-4" />

        {/* Bottom Login & Biometric Buttons */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setShowLoginSheet(true)}
            className="flex-1 py-3.5 bg-[#1078CA] hover:bg-[#0c62a8] text-white font-bold text-sm rounded-xl shadow-md active:scale-[0.99] transition-all text-center"
          >
            Login
          </button>

          <button
            onClick={handleBiometricClick}
            className={`w-13 h-12 rounded-xl border flex items-center justify-center transition-all ${
              bioActive
                ? 'bg-blue-100 border-[#1078CA] text-[#1078CA] scale-95'
                : 'bg-blue-50 border-blue-200 text-[#1078CA] hover:bg-blue-100'
            }`}
            title="Masuk dengan Sidik Jari"
          >
            <Fingerprint size={24} className="stroke-[2.2]" />
          </button>
        </div>
      </div>

      {/* Login Bottom Sheet Modal (from Photo on 31-10-26 at 15.26 #3.jpg) */}
      {showLoginSheet && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-t-3xl p-6 text-slate-800 shadow-2xl animate-sheet-up">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <button
                type="button"
                onClick={() => setShowLoginSheet(false)}
                className="text-xs font-semibold text-[#1078CA] hover:underline"
              >
                Batalkan
              </button>
              <h3 className="text-sm font-bold text-slate-900">Login</h3>
              <div className="w-12" />
            </div>

            <form onSubmit={handleLoginSubmit} className="mt-5 space-y-4">
              {/* Username Input with Ganti Akun */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 flex items-center justify-between">
                <div className="flex items-center space-x-2.5 flex-1">
                  <User size={18} className="text-slate-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none"
                    placeholder="Username"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setUsername('')}
                  className="text-xs font-bold text-[#1078CA] hover:underline pl-2"
                >
                  Ganti Akun
                </button>
              </div>

              {/* Password Input */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 flex items-center justify-between">
                <div className="flex items-center space-x-2.5 flex-1">
                  <Lock size={18} className="text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full bg-transparent text-xs font-medium text-slate-800 focus:outline-none"
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 pl-2"
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-[#1078CA] hover:bg-[#0c62a8] text-white font-bold text-xs rounded-xl shadow-md active:scale-[0.99] transition-all flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span>Login</span>
                )}
              </button>

              {/* Forgot link */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => alert('Pusat Bantuan Lupa Password')}
                  className="text-xs font-bold text-[#1078CA] hover:underline"
                >
                  Lupa Username/Password?
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
