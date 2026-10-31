import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Building2, 
  CreditCard, 
  ChevronDown, 
  ChevronRight, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  Share2, 
  Download,
  Delete,
  X,
  AlertTriangle
} from 'lucide-react';
import { UserProfile, Beneficiary, Bank, Transaction } from '../../types';
import { SUPPORTED_BANKS, INITIAL_BENEFICIARIES } from '../../data/mockData';
import { formatRupiah, formatDateIndo, generateRefNo } from '../../utils/format';
import { StatusBar } from '../common/StatusBar';
import { TransactionReceipt } from '../common/TransactionReceipt';

interface TransferScreenProps {
  user: UserProfile;
  onBack: () => void;
  onCompleteTransfer: (newTx: Transaction, newBalance: number) => void;
}

type TransferSubStep = 'home' | 'new_recipient' | 'input_nominal' | 'confirm' | 'pin' | 'receipt';

export const TransferScreen: React.FC<TransferScreenProps> = ({
  user,
  onBack,
  onCompleteTransfer,
}) => {
  const [subStep, setSubStep] = useState<TransferSubStep>('home');
  const [transferTab, setTransferTab] = useState<'dalam' | 'internasional' | 'emas'>('dalam');
  const [recipientTab, setRecipientTab] = useState<'norek' | 'bifast'>('norek');

  // Selected recipient
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary>(INITIAL_BENEFICIARIES[0]);

  // Form New Recipient state
  const [targetBank, setTargetBank] = useState<Bank>(SUPPORTED_BANKS[0]);
  const [targetAccountNumber, setTargetAccountNumber] = useState('');

  // Form Nominal state
  const [saveToBeneficiaries, setSaveToBeneficiaries] = useState(false);
  const [transferMethod, setTransferMethod] = useState<'bifast' | 'online'>('bifast');
  const [nominalAmount, setNominalAmount] = useState<string>('0');
  const [transferNote, setTransferNote] = useState('');
  const [scheduledTransfer, setScheduledTransfer] = useState(false);

  // PIN state
  const [pin, setPin] = useState('');
  const [showPinModal, setShowPinModal] = useState(false);
  const [isProcessingTx, setIsProcessingTx] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [pinErrorMsg, setPinErrorMsg] = useState('');
  const [completedTx, setCompletedTx] = useState<Transaction | null>(null);

  const numAmount = parseInt(nominalAmount.replace(/\D/g, '') || '0', 10);
  const isOtherBank = selectedBeneficiary.bankCode !== '002';
  const adminFee = isOtherBank ? (transferMethod === 'bifast' ? 2500 : 6500) : 0;

  // PIN handlers
  const handleKeypadPress = (val: string) => {
    setPinErrorMsg('');
    if (pin.length < 6) {
      const nextPin = pin + val;
      setPin(nextPin);
      if (nextPin.length === 6) {
        // User rule: PIN 060502 adalah PIN benar, lalu loading dan muncul maintenance error ala BRImo
        if (nextPin === '060502') {
          setShowPinModal(false);
          setIsProcessingTx(true);
          setTimeout(() => {
            setIsProcessingTx(false);
            setShowMaintenanceModal(true);
            setPin('');
          }, 2400);
        } else {
          setPinErrorMsg('PIN yang Anda masukkan salah.');
          setTimeout(() => {
            setPin('');
          }, 600);
        }
      }
    }
  };

  const handleKeypadDelete = () => {
    setPinErrorMsg('');
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
    }
  };

  const processTransfer = (_enteredPin: string) => {
    setShowPinModal(false);
    const totalDebit = numAmount + adminFee;
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    const ref = generateRefNo('BRI');

    const newTx: Transaction = {
      id: `TRX-${ref}`,
      title: `Transfer Ke ${selectedBeneficiary.name}`,
      description: `${isOtherBank ? (transferMethod === 'bifast' ? 'BI-Fast' : 'Realtime') : 'Transfer Sesama BRI'} - Tabungan BRI BritAma`,
      amount: numAmount,
      type: 'transfer',
      date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`,
      time: `${hours}:${mins}`,
      recipientBank: selectedBeneficiary.bankName,
      recipientAccount: selectedBeneficiary.accountNumber,
      recipientName: selectedBeneficiary.name,
      category: 'out',
      referenceNo: ref,
      status: 'Sukses',
      adminFee: adminFee,
      balanceAfter: user.balance - totalDebit,
    };

    setCompletedTx(newTx);
    onCompleteTransfer(newTx, user.balance - totalDebit);
    setSubStep('receipt');
  };

  return (
    <div className="h-full w-full bg-slate-50 flex flex-col select-none overflow-hidden">
      {/* 1. TRANSFER HOME (from WhatsApp Image 2026-10-31 at 15.30.26.jpeg) */}
      {subStep === 'home' && (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Top Bar */}
          <div className="bg-[#1078CA] text-white pt-1 pb-4 px-4 flex-shrink-0 z-30 shadow-sm">
              <StatusBar darkTheme={true} />
              <div className="flex items-center justify-between mt-2">
                <button onClick={onBack} className="p-1 hover:bg-white/10 rounded-full">
                  <ArrowLeft size={22} />
                </button>
                <h1 className="text-base font-bold">Transfer</h1>
                <div className="w-8" />
              </div>

              {/* Segmented Control Pills: Dalam Negeri | Internasional | Emas */}
              <div className="flex items-center space-x-2 mt-4 text-xs font-bold">
                <button
                  onClick={() => setTransferTab('dalam')}
                  className={`px-4 py-2 rounded-full transition-all ${
                    transferTab === 'dalam'
                      ? 'bg-[#004B87] text-white shadow-sm'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  Dalam Negeri
                </button>
                <button
                  onClick={() => setTransferTab('internasional')}
                  className={`px-3 py-2 rounded-full transition-all ${
                    transferTab === 'internasional'
                      ? 'bg-[#004B87] text-white'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  Internasional
                </button>
                <button
                  onClick={() => setTransferTab('emas')}
                  className={`px-3 py-2 rounded-full transition-all ${
                    transferTab === 'emas'
                      ? 'bg-[#004B87] text-white'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  Emas
                </button>
              </div>
            </div>

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto no-scrollbar">
            <div className="p-4 space-y-4">
              {/* Transfer Terakhir Horizontal Cards */}
              <div>
                <h3 className="text-xs font-bold text-slate-800 mb-2">Transfer Terakhir</h3>
                <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-1">
                  {INITIAL_BENEFICIARIES.slice(0, 2).map((ben) => (
                    <button
                      key={ben.id}
                      onClick={() => {
                        setSelectedBeneficiary(ben);
                        setNominalAmount('0');
                        setSubStep('input_nominal');
                      }}
                      className="min-w-[210px] bg-white border border-slate-200/80 rounded-2xl p-3 flex items-center space-x-3 shadow-sm hover:border-[#1078CA] transition-all text-left"
                    >
                      <div className="w-10 h-10 rounded-full bg-slate-100 text-[#1078CA] font-bold flex items-center justify-center text-xs flex-shrink-0">
                        {ben.initials}
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="text-xs font-bold text-slate-800 truncate">{ben.name}</h4>
                        <p className="text-[11px] text-slate-500 font-medium">{ben.bankName}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{ben.accountNumber}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Banner: Pakai Transfer Terjadwal, Yuk! */}
              <div 
                onClick={() => alert('Fitur Transfer Rutin Terjadwal')}
                className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-sm flex items-center justify-between cursor-pointer hover:bg-slate-50"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Pakai Transfer Terjadwal, Yuk!</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Buat transfer rutin jadi otomatis dan tepat waktu.</p>
                </div>
                <ChevronRight size={18} className="text-[#1078CA]" />
              </div>

              {/* Routine Transfer Section: Rutin transfer ke sini? */}
              <div className="bg-[#EBF5FC] rounded-2xl p-3 space-y-2.5 border border-blue-100">
                <span className="text-xs font-bold text-[#1078CA] block px-1">
                  Rutin transfer ke sini? Jadwalkan otomatis, yuk!
                </span>

                {/* Card 1: RICA WIDA JAYANTI */}
                <div className="bg-white rounded-xl p-3 shadow-sm space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-9 h-9 rounded-full bg-slate-100 text-[#1078CA] font-bold flex items-center justify-center text-xs">
                        RJ
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">RICA WIDA JAYANTI</h4>
                        <p className="text-[10px] text-slate-500">BANK BRI - 381901048950536</p>
                        <p className="text-[10px] text-slate-400">Tiap Tanggal 22</p>
                      </div>
                    </div>
                    <ChevronDown size={16} className="text-slate-400" />
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Total</span>
                      <span className="font-bold text-[#1078CA]">Rp1.000.000</span>
                    </div>
                    <div className="flex space-x-1.5">
                      <button 
                        onClick={() => alert('Ubah detail jadwal transfer')}
                        className="px-2.5 py-1 border border-[#1078CA] text-[#1078CA] text-[11px] font-bold rounded-lg"
                      >
                        Ubah Detail
                      </button>
                      <button 
                        onClick={() => alert('Jadwal transfer otomatis diaktifkan')}
                        className="px-2.5 py-1 bg-[#1078CA] text-white text-[11px] font-bold rounded-lg"
                      >
                        Jadwalkan
                      </button>
                    </div>
                  </div>
                </div>

                {/* Card 2: ASTRI YUNITA SARI */}
                <div className="bg-white rounded-xl p-3 shadow-sm space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-9 h-9 rounded-full bg-slate-100 text-[#1078CA] font-bold flex items-center justify-center text-xs">
                        AS
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">ASTRI YUNITA SARI</h4>
                        <p className="text-[10px] text-slate-500">BANK BRI - 381001017231531</p>
                        <p className="text-[10px] text-slate-400">Tiap Tanggal 22</p>
                      </div>
                    </div>
                    <ChevronDown size={16} className="text-slate-400" />
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Total</span>
                      <span className="font-bold text-[#1078CA]">Rp1.650.000</span>
                    </div>
                    <div className="flex space-x-1.5">
                      <button 
                        onClick={() => alert('Ubah detail jadwal transfer')}
                        className="px-2.5 py-1 border border-[#1078CA] text-[#1078CA] text-[11px] font-bold rounded-lg"
                      >
                        Ubah Detail
                      </button>
                      <button 
                        onClick={() => alert('Jadwal transfer otomatis diaktifkan')}
                        className="px-2.5 py-1 bg-[#1078CA] text-white text-[11px] font-bold rounded-lg"
                      >
                        Jadwalkan
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pinned Bottom Button: Tambah Penerima Baru (Zero excess margin, pinned directly to the bottom) */}
          <div className="p-4 bg-white border-t border-slate-100 flex-shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-[max(1rem,env(safe-area-inset-bottom,1rem))]">
            <button
              onClick={() => {
                setTargetAccountNumber('');
                setSubStep('new_recipient');
              }}
              className="w-full py-3.5 bg-[#1078CA] hover:bg-[#0d64a8] text-white font-bold text-sm rounded-xl shadow-md active:scale-[0.99] transition-all"
            >
              Tambah Penerima Baru
            </button>
          </div>
        </div>
      )}

      {/* 2. PENERIMA BARU (from WhatsApp Image 2026-10-31 at 15.30.25 (2).jpeg) */}
      {subStep === 'new_recipient' && (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Top Bar with Lingkungan Aman */}
          <div className="bg-[#1078CA] text-white pt-1 pb-4 px-4 flex-shrink-0 z-30 shadow-sm">
              <StatusBar darkTheme={true} />
              <div className="flex items-center justify-between text-right text-[10px] text-white/90 font-medium px-1 mb-1">
                <span />
                <span className="flex items-center space-x-1">
                  <ShieldCheck size={12} className="text-emerald-300" />
                  <span>Lingkungan Aman</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <button onClick={() => setSubStep('home')} className="p-1 hover:bg-white/10 rounded-full">
                  <ArrowLeft size={22} />
                </button>
                <h1 className="text-base font-bold">Penerima Baru</h1>
                <div className="w-8" />
              </div>

              {/* Tab Selector: Nomor Rekening | Kontak BI-FAST */}
              <div className="bg-[#004B87] p-1 rounded-full flex items-center mt-4">
                <button
                  onClick={() => setRecipientTab('norek')}
                  className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all ${
                    recipientTab === 'norek' ? 'bg-white text-[#1078CA] shadow-sm' : 'text-white'
                  }`}
                >
                  Nomor Rekening
                </button>
                <button
                  onClick={() => setRecipientTab('bifast')}
                  className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all ${
                    recipientTab === 'bifast' ? 'bg-white text-[#1078CA] shadow-sm' : 'text-white'
                  }`}
                >
                  Kontak BI-FAST
                </button>
              </div>
            </div>

          {/* Scrollable Form */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
              {/* Bank Tujuan */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1.5">Bank Tujuan</label>
                <div className="relative">
                  <select
                    value={targetBank.id}
                    onChange={(e) => {
                      const found = SUPPORTED_BANKS.find(x => x.id === e.target.value);
                      if (found) setTargetBank(found);
                    }}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-3 text-xs font-bold text-slate-800 appearance-none focus:outline-none focus:border-[#1078CA]"
                  >
                    {SUPPORTED_BANKS.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                  <ChevronDown size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Nomor Rekening / Alias */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1.5">Nomor Rekening/Alias</label>
                <div className="relative flex items-center">
                  <CreditCard size={18} className="absolute left-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={targetAccountNumber}
                    onChange={(e) => setTargetAccountNumber(e.target.value)}
                    placeholder="Masukkan nomor rekening atau alias"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#1078CA]"
                  />
                </div>
                <span className="text-[10px] text-slate-400 block mt-1 pl-1">
                  Masukkan alias diawali dengan "@"
                </span>
              </div>

              {/* Info Note: Alias digunakan sebagai alternatif */}
              <div className="bg-[#EBF5FC] border border-[#76BAEB] rounded-2xl p-3.5 flex items-start space-x-2 text-[#1078CA] text-xs">
                <span className="font-bold text-sm">ⓘ</span>
                <p className="leading-snug">
                  Alias digunakan sebagai alternatif nomor rekening untuk transfer ke sesama BRI.
                </p>
              </div>
            </div>

          {/* Pinned Bottom Button: Lanjutkan (Zero excess margin, pinned directly to the bottom) */}
          <div className="p-4 bg-white border-t border-slate-100 flex-shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-[max(1rem,env(safe-area-inset-bottom,1rem))]">
            <button
              onClick={() => {
                if (!targetAccountNumber) {
                  alert('Silakan masukkan nomor rekening tujuan!');
                  return;
                }
                const newB: Beneficiary = {
                  id: `ben-${Date.now()}`,
                  name: 'MANSYUR',
                  accountNumber: targetAccountNumber,
                  bankName: targetBank.name,
                  bankCode: targetBank.code,
                  initials: 'M',
                  avatarBg: 'bg-slate-100 text-[#1078CA]',
                };
                setSelectedBeneficiary(newB);
                setNominalAmount('0');
                setSubStep('input_nominal');
              }}
              className="w-full py-3.5 bg-[#1078CA] hover:bg-[#0d64a8] text-white font-bold text-sm rounded-xl shadow-md active:scale-[0.99] transition-all"
            >
              Lanjutkan
            </button>
          </div>
        </div>
      )}

      {/* 3. MASUKKAN NOMINAL (from WhatsApp Image 2026-10-31 at 15.30.25.jpeg) */}
      {subStep === 'input_nominal' && (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Top Bar */}
          <div className="bg-[#1078CA] text-white pt-1 pb-4 px-4 flex-shrink-0 z-30 shadow-sm">
            <StatusBar darkTheme={true} />
            <div className="flex items-center justify-between mt-2">
              <button onClick={() => setSubStep('home')} className="p-1 hover:bg-white/10 rounded-full active:scale-95 transition-transform">
                <ArrowLeft size={22} />
              </button>
              <h1 className="text-base font-bold">Masukkan Nominal</h1>
              <div className="w-8" />
            </div>
          </div>

          {/* Scrollable Form Body */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3.5">
              {/* Beneficiary Header */}
              <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-sm flex items-center space-x-3">
                <div className="w-11 h-11 rounded-full bg-slate-100 text-[#1078CA] font-bold flex items-center justify-center text-sm">
                  {selectedBeneficiary.initials}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">{selectedBeneficiary.name}</h3>
                  <p className="text-[11px] text-slate-500">{selectedBeneficiary.bankName}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{selectedBeneficiary.accountNumber}</p>
                </div>
              </div>

              {/* Tambahkan ke Daftar Tersimpan Toggle */}
              <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-sm flex items-center justify-between">
                <span className="text-xs font-medium text-slate-800">Tambahkan ke Daftar Tersimpan</span>
                <button
                  type="button"
                  onClick={() => setSaveToBeneficiaries(!saveToBeneficiaries)}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                    saveToBeneficiaries ? 'bg-[#1078CA]' : 'bg-slate-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                    saveToBeneficiaries ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Metode Transfer (BI-FAST vs Online for other banks) */}
              {isOtherBank && (
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Metode Transfer</label>
                  <div className="bg-white border border-slate-200 rounded-2xl p-3 flex items-center justify-between shadow-sm">
                    <span className="text-xs font-bold text-slate-800">Transfer BI-FAST</span>
                    <ChevronDown size={18} className="text-[#1078CA]" />
                  </div>
                </div>
              )}

              {/* Nominal Transfer Box */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">Nominal Transfer</label>
                <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm space-y-3">
                  <div>
                    <div className="text-2xl font-black text-slate-900 flex items-center">
                      <span className="text-slate-400 font-bold mr-1 text-xl">Rp</span>
                      <input
                        type="text"
                        value={nominalAmount}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          setNominalAmount(val ? parseInt(val, 10).toLocaleString('id-ID') : '0');
                        }}
                        className="w-full font-black text-2xl text-slate-900 bg-transparent focus:outline-none"
                        placeholder="0"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-1">Minimum Rp10.000</span>
                  </div>

                  {/* Catatan Field */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center space-x-2 flex-1">
                      <FileText size={16} className="text-slate-400" />
                      <input
                        type="text"
                        value={transferNote}
                        onChange={(e) => setTransferNote(e.target.value)}
                        placeholder="Tulis catatan (opsional)"
                        maxLength={40}
                        className="text-xs text-slate-800 placeholder:text-slate-400 bg-transparent w-full focus:outline-none"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400">{transferNote.length}/40</span>
                  </div>
                </div>
              </div>

              {/* Pakai Transfer Terjadwal Toggle */}
              <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Pakai Transfer Terjadwal</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                    Buat transfermu otomatis sesuai jadwal untuk penerima & nominal yang tertera di atas.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setScheduledTransfer(!scheduledTransfer)}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 flex-shrink-0 ml-3 ${
                    scheduledTransfer ? 'bg-[#1078CA]' : 'bg-slate-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                    scheduledTransfer ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Sumber Dana Card */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">Sumber Dana</label>
                <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex items-center justify-between relative overflow-hidden">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-blue-50/80 flex flex-col items-center justify-center text-center p-1 border border-blue-100">
                      <span className="text-[7px] text-[#1078CA] font-semibold leading-none">Tabungan BRI</span>
                      <span className="text-[9px] text-[#1078CA] font-black leading-tight">BritAma</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 font-mono">3819 0104 6674 532</p>
                      <p className="text-[11px] text-slate-500 font-semibold">HERDIANGGA PRATAMA</p>
                      <p className="text-xs font-black text-slate-900 mt-0.5">{formatRupiah(user.balance)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => alert('Ubah rekening sumber')}
                    className="text-xs font-bold text-[#1078CA] hover:underline"
                  >
                    Ubah
                  </button>
                </div>
              </div>
            </div>

          {/* Pinned Bottom Button: Lanjutkan (Zero excess margin, pinned directly to the bottom) */}
          <div className="p-4 bg-white border-t border-slate-100 flex-shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-[max(1rem,env(safe-area-inset-bottom,1rem))]">
            <button
              onClick={() => {
                if (numAmount < 10000) {
                  alert('Minimum transfer adalah Rp 10.000');
                  return;
                }
                setPin('');
                setShowPinModal(true);
              }}
              disabled={numAmount <= 0}
              className={`w-full py-3.5 font-bold text-sm rounded-xl shadow-md transition-all ${
                numAmount >= 10000
                  ? 'bg-[#1078CA] text-white hover:bg-[#0d64a8] active:scale-[0.99]'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              Lanjutkan
            </button>
          </div>
        </div>
      )}

      {/* 4. CONFIRMATION SHEET */}
      {subStep === 'confirm' && (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Top Bar */}
          <div className="bg-[#1078CA] text-white pt-1 pb-4 px-4 flex-shrink-0 z-30 shadow-sm">
            <StatusBar darkTheme={true} />
            <div className="flex items-center justify-between mt-2">
              <button onClick={() => setSubStep('input_nominal')} className="p-1 hover:bg-white/10 rounded-full active:scale-95 transition-transform">
                <ArrowLeft size={22} />
              </button>
              <h1 className="text-base font-bold">Konfirmasi</h1>
              <div className="w-8" />
            </div>
          </div>

          {/* Scrollable Confirmation Body */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3.5">
              <div className="text-center pb-3 border-b border-slate-100">
                <span className="text-[11px] text-slate-400 font-semibold uppercase">Total Transfer</span>
                <div className="text-3xl font-black text-slate-900 mt-1">
                  {formatRupiah(numAmount + adminFee)}
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Penerima</span>
                  <span className="font-bold text-slate-800">{selectedBeneficiary.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Bank & No Rekening</span>
                  <span className="font-mono text-slate-700">{selectedBeneficiary.bankName} - {selectedBeneficiary.accountNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Nominal</span>
                  <span className="font-semibold text-slate-800">{formatRupiah(numAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Biaya Admin</span>
                  <span className="font-semibold text-slate-800">
                    {adminFee === 0 ? 'Gratis (Rp 0)' : formatRupiah(adminFee)}
                  </span>
                </div>
                {transferNote && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Catatan</span>
                    <span className="italic text-slate-700">"{transferNote}"</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Pinned Bottom Button: Konfirmasi & Bayar (Zero excess margin, pinned directly to the bottom) */}
          <div className="p-4 bg-white border-t border-slate-100 flex-shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-[max(1rem,env(safe-area-inset-bottom,1rem))]">
            <button
              onClick={() => {
                setPin('');
                setSubStep('pin');
              }}
              className="w-full py-3.5 bg-[#1078CA] hover:bg-[#0d64a8] text-white font-bold text-sm rounded-xl shadow-md active:scale-[0.99] transition-all"
            >
              Konfirmasi & Bayar
            </button>
          </div>
        </div>
      )}

      {/* 5. PIN SCREEN */}
      {subStep === 'pin' && (
        <div className="flex-1 bg-white flex flex-col justify-between p-6 pb-[max(1.5rem,env(safe-area-inset-bottom,1.5rem))] h-full overflow-hidden">
          <StatusBar darkTheme={false} />
          <div className="flex items-center justify-between pt-2">
            <button onClick={() => setSubStep('confirm')} className="p-1 rounded-full text-slate-700">
              <ArrowLeft size={22} />
            </button>
            <span className="text-xs font-bold text-slate-400 tracking-wider">PIN BRImo</span>
            <div className="w-8" />
          </div>

          <div className="text-center my-6">
            <h2 className="text-lg font-bold text-slate-900">Masukkan PIN BRImo</h2>
            <p className="text-xs text-slate-400 mt-1">Jaga kerahasiaan PIN Anda</p>
            <div className="flex items-center justify-center space-x-4 mt-8">
              {[0, 1, 2, 3, 4, 5].map((idx) => (
                <div
                  key={idx}
                  className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${
                    pin.length > idx ? 'bg-[#1078CA] border-[#1078CA] scale-110' : 'border-slate-300'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="max-w-xs mx-auto w-full pb-4">
            <div className="grid grid-cols-3 gap-y-4 gap-x-6 text-center">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  onClick={() => handleKeypadPress(digit)}
                  className="w-16 h-16 rounded-full bg-slate-50 hover:bg-slate-100 active:bg-blue-100 font-bold text-xl text-slate-800 mx-auto flex items-center justify-center transition-colors"
                >
                  {digit}
                </button>
              ))}
              <div className="w-16 h-16" />
              <button
                onClick={() => handleKeypadPress('0')}
                className="w-16 h-16 rounded-full bg-slate-50 hover:bg-slate-100 active:bg-blue-100 font-bold text-xl text-slate-800 mx-auto flex items-center justify-center transition-colors"
              >
                0
              </button>
              <button
                onClick={handleKeypadDelete}
                className="w-16 h-16 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-700 mx-auto flex items-center justify-center"
              >
                <Delete size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BLURRED PIN MODAL OVERLAY (User Rule: tetap di page masukkan nominal tapi muncul ngeblur dengan tombol2 PIN) */}
      {showPinModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex flex-col justify-end animate-in fade-in duration-200 select-none">
          {/* Backdrop click to dismiss */}
          <div
            className="flex-1"
            onClick={() => {
              setShowPinModal(false);
              setPin('');
            }}
          />

          {/* Slide-up PIN Sheet */}
          <div className="bg-white rounded-t-3xl pt-3 pb-[max(1.5rem,env(safe-area-inset-bottom,1.5rem))] px-6 shadow-2xl animate-sheet-up">
            {/* Top Drag Indicator */}
            <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mb-3" />

            {/* Header with Title & Close Button */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Masukkan PIN BRImo</h3>
                <p className="text-xs text-slate-400 mt-0.5">Jaga kerahasiaan PIN transaksi Anda</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowPinModal(false);
                  setPin('');
                }}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center active:scale-95 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Transfer Summary Badge Strip */}
            <div className="my-3 py-2 px-3 bg-blue-50/70 rounded-xl border border-blue-100 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Tujuan Transfer</span>
                <span className="font-bold text-slate-800 truncate max-w-[170px] block">
                  {selectedBeneficiary.name}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-medium">Total</span>
                <span className="font-black text-[#1078CA]">
                  {formatRupiah(numAmount + adminFee)}
                </span>
              </div>
            </div>

            {/* PIN Dots (6 Bullets) */}
            <div className="flex flex-col items-center justify-center my-4">
              <div className="flex items-center justify-center space-x-3.5">
                {[0, 1, 2, 3, 4, 5].map((idx) => (
                  <div
                    key={idx}
                    className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${
                      pinErrorMsg
                        ? 'bg-rose-500 border-rose-500'
                        : pin.length > idx
                        ? 'bg-[#1078CA] border-[#1078CA] scale-110 shadow-xs'
                        : 'border-slate-300'
                    }`}
                  />
                ))}
              </div>
              {pinErrorMsg && (
                <p className="text-xs font-bold text-rose-500 mt-2 text-center animate-in fade-in">
                  {pinErrorMsg}
                </p>
              )}
            </div>

            {/* Numeric Keypad (1-9, 0, Backspace) */}
            <div className="max-w-xs mx-auto w-full pt-1 pb-1">
              <div className="grid grid-cols-3 gap-y-3 gap-x-6 text-center">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                  <button
                    key={digit}
                    type="button"
                    onClick={() => handleKeypadPress(digit)}
                    className="w-16 h-16 rounded-full bg-slate-50 hover:bg-slate-100 active:bg-blue-100 font-bold text-xl text-slate-800 mx-auto flex items-center justify-center transition-colors active:scale-95 shadow-xs"
                  >
                    {digit}
                  </button>
                ))}
                <div className="w-16 h-16" />
                <button
                  type="button"
                  onClick={() => handleKeypadPress('0')}
                  className="w-16 h-16 rounded-full bg-slate-50 hover:bg-slate-100 active:bg-blue-100 font-bold text-xl text-slate-800 mx-auto flex items-center justify-center transition-colors active:scale-95 shadow-xs"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={handleKeypadDelete}
                  className="w-16 h-16 rounded-full bg-slate-50 hover:bg-slate-100 active:bg-rose-50 text-slate-700 hover:text-rose-600 mx-auto flex items-center justify-center active:scale-95 transition-colors shadow-xs"
                >
                  <Delete size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PROCESSING TRANSACTION LOADING (Ala BRImo) */}
      {isProcessingTx && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in select-none">
          <div className="bg-white rounded-3xl p-6 text-slate-800 w-full max-w-xs text-center shadow-2xl space-y-3.5">
            <div className="w-12 h-12 border-4 border-[#1078CA]/20 border-t-[#1078CA] rounded-full animate-spin mx-auto" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Memproses Transaksi...</h3>
              <p className="text-xs text-slate-500 mt-1">Sedang menghubungkan ke server perbankan BRI</p>
            </div>
          </div>
        </div>
      )}

      {/* ERROR / PEMELIHARAAN SISTEM BRIMO */}
      {showMaintenanceModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in select-none">
          <div className="bg-white rounded-3xl p-6 text-slate-800 w-full max-w-xs text-center shadow-2xl space-y-3.5 animate-sheet-up">
            <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-1">
              <AlertTriangle size={32} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                Kode: BND-01
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-2">Sistem Sedang Dalam Pemeliharaan</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Mohon maaf, saat ini transaksi transfer tidak dapat diproses karena sedang ada peningkatan kualitas sistem perbankan berkala. Silakan coba kembali beberapa saat lagi.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowMaintenanceModal(false);
                  setPin('');
                }}
                className="w-full py-3 bg-[#1078CA] hover:bg-[#0d64a8] active:scale-95 text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                Kembali
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. TRANSFER SUCCESS RECEIPT (from WhatsApp Image 2026-10-31 at 16.03.18 (1).jpeg) */}
      {subStep === 'receipt' && completedTx && (
        <TransactionReceipt
          transaction={completedTx}
          user={user}
          onClose={onBack}
        />
      )}
    </div>
  );
};
