import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Zap, 
  Image as ImageIcon, 
  ChevronRight, 
  FileText, 
  Store, 
  QrCode,
  AlertCircle,
  AlertTriangle,
  X,
  Camera
} from 'lucide-react';
import jsQR from 'jsqr';
import { UserProfile, Transaction } from '../../types';
import { formatRupiah, generateRefNo } from '../../utils/format';
import { StatusBar } from '../common/StatusBar';
import { TransactionReceipt } from '../common/TransactionReceipt';

interface QrisScreenProps {
  user: UserProfile;
  onBack: () => void;
  onPaymentSuccess: (tx: Transaction, newBalance: number) => void;
}

type QrisStep = 'scan' | 'input_nominal' | 'receipt';

export const QrisScreen: React.FC<QrisScreenProps> = ({
  user,
  onBack,
  onPaymentSuccess,
}) => {
  const [step, setStep] = useState<QrisStep>('scan');
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [showPermissionDialog, setShowPermissionDialog] = useState<boolean>(() => {
    return localStorage.getItem('brimo_camera_permission') !== 'granted';
  });

  // Gallery detection states
  const [isProcessingQR, setIsProcessingQR] = useState(false);
  const [notQrError, setNotQrError] = useState(false);
  const [maintenanceError, setMaintenanceError] = useState(false);

  // Payment states
  const [nominalStr, setNominalStr] = useState<string>('15.000');
  const [note, setNote] = useState<string>('');
  const [completedTx, setCompletedTx] = useState<Transaction | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Merchant info from reference (WhatsApp Image 2026-10-31 at 16.01.27.jpeg)
  const merchant = {
    name: 'Jafar',
    service: 'Scan DANA',
    id: '033040132',
  };

  const numAmount = parseInt(nominalStr.replace(/\D/g, '') || '0', 10);

  // Function to request camera permission and start video stream
  const requestCameraPermission = async () => {
    setShowPermissionDialog(false);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError(true);
        return;
      }

      let stream: MediaStream;
      try {
        // Try back / environment camera first
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
      } catch (err) {
        // Fallback for laptop / Mac / front camera
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setCameraActive(true);
      setCameraError(false);
      localStorage.setItem('brimo_camera_permission', 'granted');
    } catch (err) {
      console.warn('Camera access denied or unavailable:', err);
      setCameraError(true);
      setCameraActive(false);
    }
  };

  // Automatically start camera if previously permitted
  useEffect(() => {
    if (step !== 'scan') return;

    if (localStorage.getItem('brimo_camera_permission') === 'granted') {
      requestCameraPermission();
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [step]);

  // Handle Flashlight toggle
  const toggleFlashlight = async () => {
    if (streamRef.current) {
      const track = streamRef.current.getVideoTracks()[0];
      const capabilities = track.getCapabilities ? (track.getCapabilities() as any) : {};
      if (capabilities.torch) {
        try {
          await (track as any).applyConstraints({
            advanced: [{ torch: !flashlightOn }],
          });
          setFlashlightOn(!flashlightOn);
          return;
        } catch {}
      }
    }
    setFlashlightOn(!flashlightOn);
  };

  // Handle Gallery Image Selection & Real Barcode/QR Detection
  const handleGalleryClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingQR(true);
    setNotQrError(false);
    setMaintenanceError(false);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Create canvas to scan image with jsQR
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
          setIsProcessingQR(false);
          setNotQrError(true);
          return;
        }

        ctx.drawImage(img, 0, 0, img.width, img.height);
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        // User requirement:
        // "kalau bukan barcode langsung gagal. dan kalau barcode cukup loading terus, terus tampilkan error biasanya atau maintanance brimo gitu"
        if (!code) {
          // NOT A BARCODE / QR CODE -> Gagal
          setTimeout(() => {
            setIsProcessingQR(false);
            setNotQrError(true);
          }, 600);
        } else {
          // IS A BARCODE / QR CODE -> Loading terus, lalu tampilkan error/maintenance BRImo!
          setTimeout(() => {
            setIsProcessingQR(false);
            setMaintenanceError(true);
          }, 2400);
        }
      };
      img.onerror = () => {
        setIsProcessingQR(false);
        setNotQrError(true);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Handle nominal transfer process
  const handleProcessPayment = () => {
    if (numAmount <= 0) {
      alert('Masukkan nominal pembayaran');
      return;
    }
    if (user.balance < numAmount) {
      alert('Saldo rekening tidak mencukupi');
      return;
    }

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    const ref = generateRefNo('241');

    const newTx: Transaction = {
      id: `TRX-${ref}`,
      title: 'Pembelian QRIS',
      description: `${merchant.name} - ${merchant.id}`,
      amount: numAmount,
      type: 'qris',
      date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`,
      time: `${hours}:${mins}`,
      recipientName: merchant.name,
      recipientAccount: merchant.id,
      category: 'out',
      referenceNo: ref,
      status: 'Sukses',
      adminFee: 0,
      balanceAfter: user.balance - numAmount,
    };

    setCompletedTx(newTx);
    onPaymentSuccess(newTx, user.balance - numAmount);
    setStep('receipt');
  };

  return (
    <div className="h-full min-h-full w-full bg-slate-900 text-white flex flex-col justify-between select-none">
      {/* Hidden File Input for Gallery */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* 1. SCANNER CAMERA VIEW (Exact match to WhatsApp Image 2026-10-31 at 16.01.28.jpeg) */}
      {step === 'scan' && (
        <div className="flex-1 flex flex-col justify-between relative bg-black overflow-hidden animate-in fade-in duration-200">
          <StatusBar darkTheme={true} />

          {/* Real Live Camera Video Background */}
          {cameraActive ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover z-0"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-black z-0 flex items-center justify-center">
              <Camera size={48} className="text-white/10 animate-pulse" />
            </div>
          )}

          {/* Dark Vignette Overlay around scanner */}
          <div className="absolute inset-0 bg-black/40 z-0 pointer-events-none" />

          {/* Top Header */}
          <div className="px-4 pt-2 pb-2 z-20">
            <div className="flex items-center justify-between">
              <button
                onClick={onBack}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-white/10 active:scale-95 transition-all"
              >
                <ArrowLeft size={24} />
              </button>
              <h1 className="text-base font-bold text-white tracking-wide">QRIS</h1>
              <div className="w-10" />
            </div>
            <p className="text-xs text-white/90 text-center mt-3 font-medium drop-shadow-md">
              Scan kode QR untuk bayar/transfer.
            </p>
          </div>

          {/* Viewfinder Center Box */}
          <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 my-auto">
            {/* Camera Viewfinder Box with exact 270x270 size */}
            <div
              onClick={() => cameraActive && setStep('input_nominal')}
              className="w-[270px] h-[270px] relative active:scale-[0.99] transition-transform flex items-center justify-center rounded-sm"
              title="Arahkan kamera ke QRIS atau ketuk untuk bayar"
            >
              {/* 4 Thick Corner Brackets */}
              <div className="absolute top-0 left-0 w-10 h-10 border-t-[4px] border-l-[4px] border-white drop-shadow-md z-10" />
              <div className="absolute top-0 right-0 w-10 h-10 border-t-[4px] border-r-[4px] border-white drop-shadow-md z-10" />
              <div className="absolute bottom-0 left-0 w-10 h-10 border-b-[4px] border-l-[4px] border-white drop-shadow-md z-10" />
              <div className="absolute bottom-0 right-0 w-10 h-10 border-b-[4px] border-r-[4px] border-white drop-shadow-md z-10" />

              {/* Animated Laser Scanning Beam */}
              {cameraActive && (
                <div className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-[#38BDF8] to-transparent shadow-[0_0_14px_#38BDF8] animate-scan-laser z-10" />
              )}

              {/* Inactive Camera State: Button to grant permission */}
              {!cameraActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-20">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      requestCameraPermission();
                    }}
                    className="px-4 py-2.5 bg-[#1078CA] hover:bg-blue-600 text-white rounded-full text-xs font-bold flex items-center space-x-2 shadow-xl ring-2 ring-white/30 active:scale-95 transition-all"
                  >
                    <Camera size={16} />
                    <span>Aktifkan Kamera</span>
                  </button>
                  <span className="text-[10px] text-white/80 mt-2 font-medium drop-shadow">
                    Ketuk untuk izinkan akses kamera
                  </span>
                </div>
              )}
            </div>

            {/* Flashlight & Gallery Circle Buttons */}
            <div className="flex items-center justify-between w-[270px] mt-8">
              <button
                type="button"
                onClick={toggleFlashlight}
                className={`w-12 h-12 rounded-full flex items-center justify-center shadow-xl active:scale-90 transition-all ${
                  flashlightOn ? 'bg-amber-400 text-slate-900 ring-4 ring-amber-400/40' : 'bg-white text-slate-800'
                }`}
                title="Lampu Senter"
              >
                <Zap size={22} className={flashlightOn ? 'fill-current' : ''} />
              </button>

              <button
                type="button"
                onClick={handleGalleryClick}
                className="w-12 h-12 rounded-full bg-white text-slate-800 flex items-center justify-center shadow-xl active:scale-90 transition-all hover:bg-slate-100"
                title="Unggah Gambar Barcode dari Galeri"
              >
                <ImageIcon size={22} className="text-[#1078CA]" />
              </button>
            </div>
          </div>

          {/* Bottom Area: Blue Info Banner & White Drawer */}
          <div className="z-20 w-full mt-auto">
            {/* Blue Banner: Bisa scan QR di berbagai negara! */}
            <div 
              onClick={() => alert('Fitur QRIS Cross Border: Berlaku di Malaysia, Thailand, dan Singapura')}
              className="bg-[#1078CA] text-white px-4 py-2.5 flex items-center justify-between text-xs font-semibold cursor-pointer active:bg-[#0c66ac]"
            >
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 rounded-full bg-white text-[#1078CA] font-extrabold text-[10px] flex items-center justify-center flex-shrink-0">
                  !
                </span>
                <span className="text-[11px] font-medium">Bisa scan QR di berbagai negara! Cek di sini.</span>
              </div>
              <ChevronRight size={16} />
            </div>

            {/* White Drawer Cards */}
            <div className="bg-white rounded-t-3xl p-4 text-slate-800 grid grid-cols-2 gap-3 shadow-[0_-10px_30px_rgba(0,0,0,0.3)]">
              {/* Card 1: Alfamart / QR Bayar */}
              <button 
                type="button"
                onClick={() => setStep('input_nominal')}
                className="bg-white border border-slate-200 rounded-2xl p-3 flex flex-col items-center justify-center shadow-xs hover:border-[#1078CA] active:scale-95 transition-all"
              >
                <div className="h-6 flex items-center justify-center mb-1">
                  <span className="text-[11px] font-black text-rose-600 tracking-tight">
                    Alfamart
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-800">QR Bayar</span>
              </button>

              {/* Card 2: QR Transfer */}
              <button 
                type="button"
                onClick={() => setStep('input_nominal')}
                className="bg-white border border-slate-200 rounded-2xl p-3 flex flex-col items-center justify-center shadow-xs hover:border-[#1078CA] active:scale-95 transition-all"
              >
                <div className="h-6 flex items-center justify-center mb-1">
                  <div className="w-5 h-5 rounded-md bg-blue-50 text-[#1078CA] flex items-center justify-center">
                    <QrCode size={16} />
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-800">QR Transfer</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. SCAN QRIS: MASUKKAN NOMINAL (Exact match to WhatsApp Image 2026-10-31 at 16.01.27.jpeg) */}
      {step === 'input_nominal' && (
        <div className="flex-1 bg-slate-50 flex flex-col h-full overflow-hidden text-slate-800 animate-in slide-in-from-right-4 duration-200">
          {/* Top Bar */}
          <div className="bg-[#1078CA] text-white pt-1 pb-4 px-4 flex-shrink-0 z-30 shadow-sm">
            <StatusBar darkTheme={true} />
            <div className="flex items-center justify-between mt-2">
              <button onClick={() => setStep('scan')} className="p-1 hover:bg-white/10 rounded-full active:scale-95">
                <ArrowLeft size={22} />
              </button>
              <h1 className="text-base font-bold">Scan QRIS</h1>
              <div className="w-8" />
            </div>
          </div>

          {/* Merchant Card Scrollable Body */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
              <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-[#1078CA] flex items-center justify-center flex-shrink-0 border border-blue-100">
                  <Store size={22} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">{merchant.name}</h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">{merchant.service}</p>
                  <p className="text-[11px] text-slate-400 font-mono">ID {merchant.id}</p>
                </div>
              </div>

              {/* Nominal Pembayaran Card */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">Nominal Pembayaran</label>
                <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm space-y-3">
                  <div>
                    <div className="text-3xl font-black text-slate-900 flex items-center">
                      <span className="text-slate-400 font-bold mr-1 text-2xl">Rp</span>
                      <input
                        type="text"
                        value={nominalStr}
                        onChange={(e) => {
                          const v = e.target.value.replace(/\D/g, '');
                          setNominalStr(v ? parseInt(v, 10).toLocaleString('id-ID') : '0');
                        }}
                        className="w-full font-black text-3xl text-slate-900 bg-transparent focus:outline-none"
                        placeholder="0"
                      />
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-1">
                      Isi sesuai dengan nominal yang perlu dibayar.
                    </span>
                  </div>

                  {/* Catatan Field */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center space-x-2 flex-1">
                      <FileText size={16} className="text-slate-400" />
                      <input
                        type="text"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Tulis catatan (opsional)"
                        maxLength={40}
                        className="text-xs text-slate-800 placeholder:text-slate-400 bg-transparent w-full focus:outline-none"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400">{note.length}/40</span>
                  </div>
                </div>
              </div>

              {/* Sumber Dana Card */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">Sumber Dana</label>
                <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex items-center justify-between relative overflow-hidden">
                  <div className="flex items-center space-x-3">
                    <div className="w-11 h-11 rounded-full bg-[#1078CA] text-white flex items-center justify-center font-black text-[10px] tracking-tighter">
                      BRI
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 font-mono">3819 0104 6674 532</p>
                      <p className="text-[11px] text-slate-500 font-semibold">{user.name}</p>
                      <p className="text-xs font-black text-slate-900 mt-0.5">{formatRupiah(user.balance)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => alert('Ganti rekening sumber')}
                    className="text-xs font-bold text-[#1078CA] hover:underline"
                  >
                    Ganti
                  </button>
                </div>
              </div>
            </div>

          {/* Pinned Bottom Button: Lanjutkan (Zero excess margin, pinned directly to the bottom) */}
          <div className="p-4 bg-white border-t border-slate-100 flex-shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-[max(1rem,env(safe-area-inset-bottom,1rem))]">
            <button
              onClick={handleProcessPayment}
              disabled={numAmount <= 0}
              className={`w-full py-3.5 font-bold text-sm rounded-xl shadow-md active:scale-[0.99] transition-all ${
                numAmount > 0
                  ? 'bg-[#1078CA] text-white hover:bg-[#0d64a8]'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              Lanjutkan
            </button>
          </div>
        </div>
      )}

      {/* 3. RECEIPT SCREEN (Exact match to WhatsApp Image 2026-10-31 at 16.03.18 (1).jpeg) */}
      {step === 'receipt' && completedTx && (
        <TransactionReceipt
          transaction={completedTx}
          user={user}
          onClose={onBack}
        />
      )}

      {/* --- MODALS & DIALOGS --- */}

      {/* Camera Permission Dialog (Android System Style in BRImo) */}
      {showPermissionDialog && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-6 animate-in fade-in">
          <div className="bg-[#2D3133] text-white rounded-3xl p-6 w-full max-w-xs shadow-2xl space-y-4 animate-sheet-up">
            <div className="w-12 h-12 rounded-full bg-[#1078CA]/20 text-[#38BDF8] flex items-center justify-center mx-auto mb-1">
              <Camera size={26} />
            </div>
            <div className="text-center">
              <h3 className="text-sm font-bold text-white leading-snug">
                Izinkan BRImo mengambil gambar dan merekam video?
              </h3>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                Aplikasi memerlukan izin kamera untuk memindai kode QRIS pembayaran dan transfer secara langsung.
              </p>
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={requestCameraPermission}
                className="w-full py-3 bg-[#1078CA] hover:bg-blue-600 active:scale-98 text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                Saat aplikasi digunakan
              </button>
              <button
                type="button"
                onClick={requestCameraPermission}
                className="w-full py-2.5 bg-white/10 hover:bg-white/15 active:scale-98 text-white font-semibold text-xs rounded-xl transition-all"
              >
                Hanya kali ini
              </button>
              <button
                type="button"
                onClick={() => setShowPermissionDialog(false)}
                className="w-full py-2 text-slate-400 hover:text-white text-xs font-medium transition-colors"
              >
                Jangan izinkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Processing QR Code from Gallery (Continuous Loading) */}
      {isProcessingQR && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 text-slate-800 w-full max-w-xs text-center shadow-2xl space-y-3">
            <div className="w-12 h-12 border-4 border-[#1078CA]/20 border-t-[#1078CA] rounded-full animate-spin mx-auto" />
            <h3 className="text-sm font-bold text-slate-900">Memproses QRIS...</h3>
            <p className="text-xs text-slate-500">Sedang memverifikasi kode barcode gambar</p>
          </div>
        </div>
      )}

      {/* 5. GAGAL: Bukan Barcode (User Rule: kalau bukan barcode langsung gagal) */}
      {notQrError && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 text-slate-800 w-full max-w-xs text-center shadow-2xl space-y-3 animate-sheet-up">
            <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-2">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-sm font-bold text-slate-900">QR Code Tidak Ditemukan</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Gambar yang Anda pilih tidak mengandung kode QR/Barcode yang valid. Pastikan Anda mengunggah gambar QRIS.
            </p>
            <button
              onClick={() => setNotQrError(false)}
              className="w-full mt-2 py-3 bg-[#1078CA] text-white font-bold text-xs rounded-xl shadow-md active:scale-95 transition-all"
            >
              Coba Gambar Lain
            </button>
          </div>
        </div>
      )}

      {/* 6. ERROR / PEMELIHARAAN SISTEM BRIMO (User Rule: kalau barcode, tampilkan error biasanya / maintenance brimo) */}
      {maintenanceError && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 text-slate-800 w-full max-w-xs text-center shadow-2xl space-y-3 animate-sheet-up">
            <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-2">
              <AlertTriangle size={32} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                Kode: BND-01
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-1">Sistem Sedang Dalam Pemeliharaan</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Mohon maaf, saat ini fitur transaksi QRIS sedang dalam peningkatan kualitas sistem berkala. Silakan coba kembali beberapa saat lagi.
            </p>
            <div className="pt-2 space-y-2">
              <button
                onClick={() => setMaintenanceError(false)}
                className="w-full py-3 bg-[#1078CA] hover:bg-[#0d64a8] text-white font-bold text-xs rounded-xl shadow-md active:scale-95 transition-all"
              >
                Kembali
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
