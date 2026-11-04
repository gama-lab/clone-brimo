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
  Camera,
  Lock
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

interface ParsedQris {
  name: string;
  service: string;
  id: string;
  city?: string;
  amount?: string;
  isDynamic?: boolean;
  invoiceNo?: string;
}

/**
 * Parser for QRIS EMVCo QR Code standard (Indonesia MPM)
 * Extracts Merchant Name (tag 59), City (tag 60), Merchant ID/PAN (tag 26/51),
 * Point of Initiation Method (tag 01), Amount (tag 54), and Invoice/Reference (tag 62).
 */
const parseQrisPayload = (rawData: string): ParsedQris => {
  let name = '';
  let id = '';
  let amount = '';
  let city = '';
  let isDynamic = false;
  let invoiceNo = '';
  const service = 'QRIS Bayar';

  if (!rawData) {
    return { name: 'Kios Ummy 77', service: 'QRIS Bayar', id: '26020400000239' };
  }

  // Check EMVCo QRIS format (000201...)
  const emvIdx = rawData.indexOf('000201');
  if (emvIdx !== -1) {
    const payload = rawData.slice(emvIdx);
    let i = 0;
    while (i < payload.length - 4) {
      const tag = payload.slice(i, i + 2);
      const len = parseInt(payload.slice(i + 2, i + 4), 10);
      if (isNaN(len) || i + 4 + len > payload.length) break;
      const val = payload.slice(i + 4, i + 4 + len);

      if (tag === '01') {
        // Tag 01: Point of Initiation Method ('11' = Static, '12' = Dynamic)
        if (val === '12') isDynamic = true;
      } else if (tag === '59') {
        name = val.trim();
      } else if (tag === '60') {
        city = val.trim();
      } else if (tag === '54') {
        // Tag 54: Transaction Amount
        amount = val.trim();
        isDynamic = true;
      } else if (tag === '26' || tag === '51') {
        const match = val.match(/\d{9,16}/);
        if (match) id = match[0];
      } else if (tag === '62') {
        // Additional Data Field Template (Subtag 01: Bill Number / Invoice)
        let j = 0;
        while (j < val.length - 4) {
          const subTag = val.slice(j, j + 2);
          const subLen = parseInt(val.slice(j + 2, j + 4), 10);
          if (isNaN(subLen) || j + 4 + subLen > val.length) break;
          const subVal = val.slice(j + 4, j + 4 + subLen);
          if (subTag === '01') {
            invoiceNo = subVal.trim();
          }
          j += 4 + subLen;
        }
      }
      i += 4 + len;
    }
  }

  if (!name) {
    if (rawData.startsWith('http://') || rawData.startsWith('https://')) {
      try {
        const u = new URL(rawData);
        const urlAmount = u.searchParams.get('amount') || u.searchParams.get('nominal') || u.searchParams.get('total');
        if (urlAmount) {
          amount = urlAmount;
          isDynamic = true;
        }
        const urlMerchant = u.searchParams.get('merchant') || u.searchParams.get('name');
        if (urlMerchant) {
          name = decodeURIComponent(urlMerchant);
        } else {
          name = u.hostname.replace('www.', '').toUpperCase();
        }
      } catch {
        name = 'Kios Ummy 77';
      }
    } else if (rawData.length > 0 && rawData.length < 40 && !/^\d+$/.test(rawData)) {
      name = rawData.trim();
    } else {
      name = 'Kios Ummy 77';
    }
  }

  return {
    name: name || 'Kios Ummy 77',
    service: service,
    id: id || '26020400000239',
    city: city || undefined,
    amount: amount || undefined,
    isDynamic: isDynamic || Boolean(amount),
    invoiceNo: invoiceNo || undefined,
  };
};

/**
 * Multi-engine high-accuracy QR code detector:
 * 1. Native BarcodeDetector API (Built-in hardware accelerated on modern Chrome/Android)
 * 2. Multi-scale jsQR (Tests 800px, 600px, 1000px, 400px with both color inversions)
 * 3. Center crop jsQR (Specialized for smartphone screenshots with QR code in center)
 */
const detectQrFromImage = async (img: HTMLImageElement): Promise<string | null> => {
  // 1. Try native BarcodeDetector API
  if ('BarcodeDetector' in window) {
    try {
      const detector = new (window as any).BarcodeDetector({ formats: ['qr_code'] });
      const barcodes = await detector.detect(img);
      if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
        return barcodes[0].rawValue;
      }
    } catch (e) {
      console.warn('Native BarcodeDetector fallback to jsQR:', e);
    }
  }

  // 2. Multi-scale jsQR
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;

  const targetScales = [800, 600, 1000, 400, Math.max(img.width, img.height)];
  for (const maxDim of targetScales) {
    let w = img.width;
    let h = img.height;
    if (w > maxDim || h > maxDim) {
      if (w > h) {
        h = Math.round((h * maxDim) / w);
        w = maxDim;
      } else {
        w = Math.round((w * maxDim) / h);
        h = maxDim;
      }
    }

    canvas.width = w;
    canvas.height = h;
    ctx.drawImage(img, 0, 0, w, h);
    const imgData = ctx.getImageData(0, 0, w, h);
    const code = jsQR(imgData.data, w, h, { inversionAttempts: 'attemptBoth' });
    if (code && code.data) {
      return code.data;
    }
  }

  // 3. Center-crop for screenshots (middle 70% where QR code is displayed)
  const cropW = Math.round(img.width * 0.7);
  const cropH = Math.round(img.height * 0.7);
  const startX = Math.round((img.width - cropW) / 2);
  const startY = Math.round((img.height - cropH) / 2);

  canvas.width = Math.min(800, cropW);
  canvas.height = Math.min(800, cropH);
  ctx.drawImage(img, startX, startY, cropW, cropH, 0, 0, canvas.width, canvas.height);
  const cropData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const cropCode = jsQR(cropData.data, canvas.width, canvas.height, { inversionAttempts: 'attemptBoth' });
  if (cropCode && cropCode.data) {
    return cropCode.data;
  }

  return null;
};

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

  // Gallery and transaction detection states
  const [isProcessingQR, setIsProcessingQR] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [notQrError, setNotQrError] = useState(false);
  const [maintenanceError, setMaintenanceError] = useState(false);

  // Payment states
  const [nominalStr, setNominalStr] = useState<string>('');
  const [isDynamicQr, setIsDynamicQr] = useState<boolean>(false);
  const [note, setNote] = useState<string>('');
  const [completedTx, setCompletedTx] = useState<Transaction | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Dynamic merchant info parsed from QRIS or default reference
  const [merchant, setMerchant] = useState({
    name: 'Kios Ummy 77',
    service: 'QRIS Bayar',
    id: '26020400000239',
    city: '',
  });

  // Reusable dispatcher to set merchant, nominal and dynamic status
  const applyParsedQris = (parsed: ParsedQris) => {
    setMerchant({
      name: parsed.name,
      service: parsed.service,
      id: parsed.id,
      city: parsed.city || '',
    });

    if (parsed.amount) {
      // Dynamic QRIS: Amount is predetermined by merchant
      const num = Math.round(parseFloat(parsed.amount));
      if (!isNaN(num) && num > 0) {
        setNominalStr(num.toLocaleString('id-ID'));
        setIsDynamicQr(true);
      } else {
        setNominalStr('');
        setIsDynamicQr(false);
      }
    } else {
      // Static QRIS: User enters nominal freely, begins empty
      setNominalStr('');
      setIsDynamicQr(false);
    }

    if (parsed.invoiceNo) {
      setNote(`Ref: ${parsed.invoiceNo}`);
    } else {
      setNote('');
    }
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

  // Real-time live camera feed QR/Barcode detection with jsQR
  useEffect(() => {
    if (!cameraActive || isProcessingQR || isProcessingPayment || maintenanceError || step !== 'scan') return;

    let animId: number;
    let isActive = true;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    const scanVideoLoop = () => {
      if (!isActive) return;

      if (
        videoRef.current &&
        videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA &&
        !isProcessingQR &&
        !isProcessingPayment &&
        !maintenanceError &&
        step === 'scan'
      ) {
        const video = videoRef.current;
        if (video.videoWidth > 0 && video.videoHeight > 0 && ctx) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert',
          });

          if (code && code.data) {
            // Authentic QR Code detected live from camera -> read QRIS and enter input_nominal!
            try {
              if (navigator.vibrate) navigator.vibrate(40);
            } catch {}
            setIsProcessingQR(true);
            const parsed = parseQrisPayload(code.data);
            applyParsedQris(parsed);
            setTimeout(() => {
              setIsProcessingQR(false);
              setStep('input_nominal');
            }, 800);
            return;
          }
        }
      }

      animId = requestAnimationFrame(scanVideoLoop);
    };

    animId = requestAnimationFrame(scanVideoLoop);

    return () => {
      isActive = false;
      cancelAnimationFrame(animId);
    };
  }, [cameraActive, isProcessingQR, isProcessingPayment, maintenanceError, step]);

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
      img.onload = async () => {
        try {
          // Multi-engine high-accuracy QR code detection
          const qrData = await detectQrFromImage(img);

          if (!qrData) {
            // NOT A BARCODE / QR CODE -> Gagal
            setTimeout(() => {
              setIsProcessingQR(false);
              setNotQrError(true);
            }, 600);
          } else {
            // IS A BARCODE / QR CODE -> Read QRIS and enter input_nominal!
            try {
              if (navigator.vibrate) navigator.vibrate(40);
            } catch {}
            const parsed = parseQrisPayload(qrData);
            applyParsedQris(parsed);
            setTimeout(() => {
              setIsProcessingQR(false);
              setStep('input_nominal');
            }, 800);
          }
        } catch (err) {
          setIsProcessingQR(false);
          setNotQrError(true);
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

  // Handle nominal transfer process (User requirement: saat mau transaksi itu loading dan error)
  const handleProcessPayment = () => {
    if (numAmount <= 0) {
      alert('Masukkan nominal pembayaran');
      return;
    }
    if (user.balance < numAmount) {
      alert('Saldo rekening tidak mencukupi');
      return;
    }

    // Pure loading state ala BRImo, followed by authentic error
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setMaintenanceError(true);
    }, 2000);
  };

  const handleQuickScan = () => {
    setIsProcessingQR(true);
    setMerchant({
      name: 'Kios Ummy 77',
      service: 'QRIS Bayar',
      id: '26020400000239',
      city: '',
    });
    setNominalStr('');
    setIsDynamicQr(false);
    setNote('');
    setTimeout(() => {
      setIsProcessingQR(false);
      setStep('input_nominal');
    }, 600);
  };

  return (
    <div className="h-full min-h-full w-full bg-slate-900 text-white flex flex-col justify-between select-none">
      {/* Hidden File Input for Gallery Picker */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="opacity-0 absolute w-0 h-0 pointer-events-none -z-50"
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
              onClick={handleQuickScan}
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
                className="w-12 h-12 rounded-full bg-white/95 text-[#1078CA] flex items-center justify-center shadow-xl border border-white/40 active:scale-90 transition-all hover:bg-white"
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
                onClick={handleQuickScan}
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
                onClick={handleQuickScan}
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
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-bold text-slate-900 leading-tight">{merchant.name}</h3>
                    {isDynamicQr && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 bg-blue-50 text-[#1078CA] border border-blue-200 rounded-md tracking-wider">
                        DINAMIS
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {merchant.service}{merchant.city ? ` • ${merchant.city}` : ''}
                  </p>
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
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={nominalStr}
                        readOnly={isDynamicQr}
                        onChange={(e) => {
                          if (isDynamicQr) return;
                          const raw = e.target.value.replace(/\D/g, '');
                          if (!raw) {
                            setNominalStr('');
                          } else {
                            const val = parseInt(raw, 10);
                            setNominalStr(val.toLocaleString('id-ID'));
                          }
                        }}
                        className={`w-full font-black text-3xl text-slate-900 bg-transparent focus:outline-none ${
                          isDynamicQr ? 'cursor-default select-none' : ''
                        }`}
                        placeholder="0"
                      />
                    </div>
                    {isDynamicQr ? (
                      <div className="flex items-center space-x-1.5 mt-1.5 text-[11px] text-[#1078CA] font-medium">
                        <Lock size={12} className="flex-shrink-0" />
                        <span>Nominal otomatis dari QRIS Dinamis</span>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400 block mt-1">
                        Isi sesuai dengan nominal yang perlu dibayar.
                      </span>
                    )}
                  </div>

                  {/* Quick amount chips for static QR */}
                  {!isDynamicQr && (
                    <div className="flex items-center space-x-2 pt-1 overflow-x-auto no-scrollbar">
                      {[10000, 20000, 50000, 100000].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setNominalStr(val.toLocaleString('id-ID'))}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold flex-shrink-0 active:scale-95 transition-all"
                        >
                          +{val.toLocaleString('id-ID')}
                        </button>
                      ))}
                    </div>
                  )}

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

      {/* 4. Processing QR Code / Transaction (Pure loading state without text) */}
      {(isProcessingQR || isProcessingPayment) && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-6 animate-in fade-in select-none">
          <div className="w-20 h-20 bg-white rounded-3xl shadow-2xl flex items-center justify-center border border-slate-100 animate-in zoom-in-95 duration-150">
            <div className="w-10 h-10 border-4 border-[#1078CA]/25 border-t-[#1078CA] rounded-full animate-spin" />
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
            <div className="pt-2 space-y-2">
              <button
                onClick={() => {
                  setNotQrError(false);
                  setTimeout(() => handleGalleryClick(), 150);
                }}
                className="w-full py-3 bg-[#1078CA] hover:bg-[#0d64a8] text-white font-bold text-xs rounded-xl shadow-md active:scale-95 transition-all"
              >
                Pilih Gambar Lain
              </button>
              <button
                onClick={() => setNotQrError(false)}
                className="w-full py-2.5 text-slate-500 hover:text-slate-700 font-bold text-xs rounded-xl active:scale-95 transition-all"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. ERROR TRANSAKSI QRIS OTENTIK ALA BRIMO ([QR-91] Transaksi Belum Dapat Diproses) */}
      {maintenanceError && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 text-slate-800 w-full max-w-xs text-center shadow-2xl space-y-3 animate-sheet-up">
            <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-2">
              <AlertCircle size={32} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full font-mono border border-rose-200">
                [QR-91] Transaksi Belum Dapat Diproses
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-1.5">Transaksi Belum Dapat Diproses</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Mohon maaf, pembayaran QRIS belum dapat diselesaikan ke sistem merchant. Silakan pastikan koneksi internet stabil atau coba beberapa saat lagi.
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
