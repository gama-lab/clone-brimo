import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
}

const TILE_BASE =
  'relative flex items-center justify-center rounded-2xl bg-[#EFF5FC] shadow-[0_1px_2px_rgba(16,120,202,0.06)]';

// 1. Transfer: Blue banknote with "Rp" + circular arrow badge
export const IconBrimoTransfer: React.FC<IconProps> = ({ size = 26, className = '' }) => (
  <div className={`${TILE_BASE} ${className}`} style={{ width: size + 20, height: size + 20 }}>
    <svg width={size + 2} height={size + 2} viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="brimoTfGrad" x1="3" y1="7" x2="27" y2="23" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6EC1F8" />
          <stop offset="1" stopColor="#2684D9" />
        </linearGradient>
      </defs>
      <rect x="3" y="8" width="23" height="15" rx="3" fill="url(#brimoTfGrad)" />
      <rect x="5" y="10" width="19" height="11" rx="1.5" stroke="white" strokeOpacity="0.45" strokeWidth="1" />
      <circle cx="14.5" cy="15.5" r="4.2" fill="white" fillOpacity="0.92" />
      <text x="14.5" y="17.6" textAnchor="middle" fill="#1C76CC" fontSize="6.5" fontWeight="800" fontFamily="sans-serif">
        Rp
      </text>
      {/* Circular arrow badge bottom-right */}
      <circle cx="24" cy="22" r="5" fill="#1669BC" stroke="#EFF5FC" strokeWidth="1.5" />
      <path d="M22 22h4m0 0l-1.5-1.5M26 22l-1.5 1.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

// 2. BRIVA: Teal gradient pill card with white "BRIVA" text
export const IconBrimoBriva: React.FC<IconProps> = ({ size = 26, className = '' }) => (
  <div className={`${TILE_BASE} ${className}`} style={{ width: size + 20, height: size + 20 }}>
    <div
      className="px-1.5 py-1.5 rounded-lg shadow-xs flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #4FD5C6 0%, #24A89B 100%)' }}
    >
      <span className="font-black text-[8.5px] tracking-tight leading-none text-white">BRIVA</span>
    </div>
  </div>
);

// 3. Cicil Emas: Golden 3D bars on soft #EFF5FC tile
export const IconBrimoEmas: React.FC<IconProps> = ({ size = 26, className = '' }) => (
  <div className={`${TILE_BASE} ${className}`} style={{ width: size + 20, height: size + 20 }}>
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <polygon points="6,12 11,8 19,8 14,12" fill="#FDE68A" stroke="#D97706" strokeWidth="1.1" />
      <polygon points="14,12 19,8 21,11 16,15" fill="#F59E0B" stroke="#D97706" strokeWidth="1.1" />
      <polygon points="6,12 14,12 16,15 8,15" fill="#FBBF24" stroke="#D97706" strokeWidth="1.1" />
      <polygon points="9,18 14,14 22,14 17,18" fill="#FDE68A" stroke="#D97706" strokeWidth="1.1" />
      <polygon points="17,18 22,14 24,17 19,21" fill="#F59E0B" stroke="#D97706" strokeWidth="1.1" />
      <polygon points="9,18 17,18 19,21 11,21" fill="#FBBF24" stroke="#D97706" strokeWidth="1.1" />
    </svg>
  </div>
);

// 4. Pulsa/Data: Green smartphone with white screen & green "+"
export const IconBrimoPulsa: React.FC<IconProps> = ({ size = 26, className = '' }) => (
  <div className={`${TILE_BASE} ${className}`} style={{ width: size + 20, height: size + 20 }}>
    <svg width={size + 2} height={size + 2} viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="brimoPulsaGrad" x1="8" y1="4" x2="24" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#65E586" />
          <stop offset="1" stopColor="#26BA54" />
        </linearGradient>
      </defs>
      <rect x="8" y="4" width="16" height="24" rx="3.5" fill="url(#brimoPulsaGrad)" />
      <rect x="10.2" y="7" width="11.6" height="16.5" rx="1.5" fill="white" />
      <circle cx="16" cy="25.8" r="1" fill="white" />
      <path d="M16 12v6.5M12.75 15.25h6.5" stroke="#26BA54" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  </div>
);

// 5. Top Up: Bright green wallet with "+" badge bottom-left
export const IconBrimoTopUp: React.FC<IconProps> = ({ size = 26, className = '' }) => (
  <div className={`${TILE_BASE} ${className}`} style={{ width: size + 20, height: size + 20 }}>
    <svg width={size + 2} height={size + 2} viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="brimoWalletGrad" x1="5" y1="7" x2="27" y2="25" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6CEB8E" />
          <stop offset="1" stopColor="#24BD55" />
        </linearGradient>
      </defs>
      <rect x="6" y="8" width="21" height="16" rx="3.5" fill="url(#brimoWalletGrad)" />
      <path d="M21 13.5h6.5v5H21a2.5 2.5 0 0 1 0-5z" fill="#1EA448" />
      <circle cx="21.5" cy="16" r="1.1" fill="white" />
      {/* Plus badge bottom-left */}
      <circle cx="8" cy="22.5" r="4.5" fill="#24BD55" stroke="#EFF5FC" strokeWidth="1.5" />
      <path d="M8 20.5v4M6 22.5h4" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  </div>
);

// 6. BRIZZI: Bright green rounded card with white "BRIZZI" text
export const IconBrimoBrizzi: React.FC<IconProps> = ({ size = 26, className = '' }) => (
  <div className={`${TILE_BASE} ${className}`} style={{ width: size + 20, height: size + 20 }}>
    <div
      className="px-1.5 py-1.5 rounded-lg shadow-xs flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #6CEB8E 0%, #24BD55 100%)' }}
    >
      <span className="font-black text-[8px] tracking-tight leading-none text-white">BRIZZI</span>
    </div>
  </div>
);

// 7. Tagihan: Teal receipt with "Rp" + checkmark badge
export const IconBrimoTagihan: React.FC<IconProps> = ({ size = 26, className = '' }) => (
  <div className={`${TILE_BASE} ${className}`} style={{ width: size + 20, height: size + 20 }}>
    <svg width={size + 2} height={size + 2} viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="brimoBillGrad" x1="7" y1="5" x2="23" y2="27" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5BE0D3" />
          <stop offset="1" stopColor="#1CA89B" />
        </linearGradient>
      </defs>
      <path d="M8 5h14a2 2 0 0 1 2 2v19l-3-2-2.5 2-2.5-2-2.5 2-2.5-2-3 2V7a2 2 0 0 1 2-2z" fill="url(#brimoBillGrad)" />
      <text x="15" y="13.5" textAnchor="middle" fill="white" fontSize="6.5" fontWeight="800" fontFamily="sans-serif">
        Rp
      </text>
      <line x1="11" y1="16.8" x2="19" y2="16.8" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeOpacity="0.9" />
      <line x1="11" y1="20" x2="17" y2="20" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeOpacity="0.9" />
      {/* Checkmark badge */}
      <circle cx="23.5" cy="22.5" r="4.5" fill="#179488" stroke="#EFF5FC" strokeWidth="1.5" />
      <path d="M21.5 22.5l1.3 1.3 2.7-2.7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

// 8. Lifestyle: Pink shopping bag + red notification dot
export const IconBrimoLifestyle: React.FC<IconProps> = ({ size = 26, className = '' }) => (
  <div className={`${TILE_BASE} ${className}`} style={{ width: size + 20, height: size + 20 }}>
    <svg width={size + 2} height={size + 2} viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="brimoBagGrad" x1="7" y1="11" x2="25" y2="27" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FA88BE" />
          <stop offset="1" stopColor="#EC5299" />
        </linearGradient>
      </defs>
      <path d="M12 11.5V9a4 4 0 0 1 8 0v2.5" stroke="#EC5299" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M8.5 11.5h15l1.3 14.2a2 2 0 0 1-2 2.2H9.2a2 2 0 0 1-2-2.2l1.3-14.2z" fill="url(#brimoBagGrad)" />
      <circle cx="12.5" cy="14.5" r="1" fill="white" fillOpacity="0.85" />
      <circle cx="19.5" cy="14.5" r="1" fill="white" fillOpacity="0.85" />
    </svg>
    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white" />
  </div>
);

// 9. Setor & Tarik Tunai: Blue ATM machine with "ATM" screen & cash dispensing
export const IconBrimoAtm: React.FC<IconProps> = ({ size = 26, className = '' }) => (
  <div className={`${TILE_BASE} ${className}`} style={{ width: size + 20, height: size + 20 }}>
    <svg width={size + 2} height={size + 2} viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="brimoAtmGrad" x1="6" y1="4" x2="26" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5AA9F4" />
          <stop offset="1" stopColor="#1B6EC6" />
        </linearGradient>
      </defs>
      <rect x="6.5" y="4.5" width="19" height="23" rx="3" fill="url(#brimoAtmGrad)" />
      <rect x="9" y="7" width="14" height="6.5" rx="1.2" fill="white" />
      <text x="16" y="12" textAnchor="middle" fill="#1B6EC6" fontSize="5.2" fontWeight="900" fontFamily="sans-serif">
        ATM
      </text>
      <rect x="9.5" y="16" width="13" height="2.2" rx="1" fill="#0F4E94" />
      {/* Dispensed cash */}
      <rect x="11.5" y="17.5" width="9" height="8" rx="1.2" fill="#8CD2FA" stroke="white" strokeWidth="1" />
      <circle cx="16" cy="21.5" r="1.7" fill="#1B6EC6" />
    </svg>
  </div>
);

// 10. Junior: Clean BRImo Junior badge on soft #EFF5FC tile
export const IconBrimoJunior: React.FC<IconProps> = ({ size = 26, className = '' }) => (
  <div className={`${TILE_BASE} ${className}`} style={{ width: size + 20, height: size + 20 }}>
    <div
      className="px-1.5 py-1 rounded-lg shadow-xs flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #54AEF7 0%, #1F7BD2 100%)' }}
    >
      <span className="font-extrabold text-[7px] leading-tight text-white">BRImo</span>
      <span className="font-black text-[6px] tracking-wider leading-none text-amber-200">Junior</span>
    </div>
  </div>
);

// 11. Debit Virtual / Kartu: Blue phone with overlapping debit card
export const IconBrimoKartu: React.FC<IconProps> = ({ size = 26, className = '' }) => (
  <div className={`${TILE_BASE} ${className}`} style={{ width: size + 20, height: size + 20 }}>
    <svg width={size + 2} height={size + 2} viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="brimoCardGrad" x1="12" y1="12" x2="28" y2="23" gradientUnits="userSpaceOnUse">
          <stop stopColor="#60B8F9" />
          <stop offset="1" stopColor="#1B72CA" />
        </linearGradient>
      </defs>
      {/* Phone */}
      <rect x="6" y="5" width="14" height="22" rx="2.8" fill="#5CA8EB" />
      <rect x="7.8" y="7.5" width="10.4" height="15.5" rx="1.2" fill="white" />
      <circle cx="13" cy="25" r="0.9" fill="white" />
      {/* Overlapping Debit Card */}
      <rect x="13" y="11.5" width="14" height="9.5" rx="2" fill="url(#brimoCardGrad)" stroke="#EFF5FC" strokeWidth="1.2" />
      <rect x="15" y="14" width="3" height="2.2" rx="0.4" fill="#FDE68A" />
      <line x1="15" y1="18.2" x2="24" y2="18.2" stroke="white" strokeOpacity="0.8" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  </div>
);
