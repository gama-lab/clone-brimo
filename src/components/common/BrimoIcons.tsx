import React from 'react';

// Exact match vector icons for Android BRImo
export const IconBrimoTransfer: React.FC<{ size?: number; className?: string }> = ({ size = 28, className = '' }) => (
  <div
    className={`relative flex items-center justify-center rounded-2xl bg-[#E8F3FC] text-[#1078CA] shadow-sm ${className}`}
    style={{ width: size + 18, height: size + 18 }}
  >
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <rect x="2" y="6" width="24" height="16" rx="3" fill="#C9E6FD" stroke="#1078CA" strokeWidth="2" />
      <circle cx="14" cy="14" r="4.5" fill="#1078CA" />
      <text x="14" y="16.5" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold" fontFamily="sans-serif">
        Rp
      </text>
      <circle cx="6" cy="14" r="1.5" fill="#1078CA" />
      <circle cx="22" cy="14" r="1.5" fill="#1078CA" />
    </svg>
  </div>
);

export const IconBrimoBriva: React.FC<{ size?: number; className?: string }> = ({ size = 28, className = '' }) => (
  <div
    className={`relative flex items-center justify-center rounded-2xl bg-[#E2F7F6] text-[#00A896] shadow-sm ${className}`}
    style={{ width: size + 18, height: size + 18 }}
  >
    <div className="bg-[#00A896] text-white px-1.5 py-1 rounded-md shadow-xs flex items-center justify-center">
      <span className="font-black text-[9px] tracking-tight leading-none">BRIVA</span>
    </div>
  </div>
);

export const IconBrimoEmas: React.FC<{ size?: number; className?: string }> = ({ size = 28, className = '' }) => (
  <div
    className={`relative flex items-center justify-center rounded-2xl bg-[#FFF6E5] text-[#F39C12] shadow-sm ${className}`}
    style={{ width: size + 18, height: size + 18 }}
  >
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      {/* Top Gold Bar */}
      <polygon points="6,12 11,8 19,8 14,12" fill="#F9E79F" stroke="#D68910" strokeWidth="1.2" />
      <polygon points="14,12 19,8 21,11 16,15" fill="#F39C12" stroke="#D68910" strokeWidth="1.2" />
      <polygon points="6,12 14,12 16,15 8,15" fill="#F5B041" stroke="#D68910" strokeWidth="1.2" />
      {/* Bottom Gold Bar */}
      <polygon points="9,18 14,14 22,14 17,18" fill="#F9E79F" stroke="#D68910" strokeWidth="1.2" />
      <polygon points="17,18 22,14 24,17 19,21" fill="#F39C12" stroke="#D68910" strokeWidth="1.2" />
      <polygon points="9,18 17,18 19,21 11,21" fill="#F5B041" stroke="#D68910" strokeWidth="1.2" />
    </svg>
  </div>
);

export const IconBrimoPulsa: React.FC<{ size?: number; className?: string }> = ({ size = 28, className = '' }) => (
  <div
    className={`relative flex items-center justify-center rounded-2xl bg-[#EAF7EE] text-[#27AE60] shadow-sm ${className}`}
    style={{ width: size + 18, height: size + 18 }}
  >
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <rect x="7" y="3" width="14" height="22" rx="3.5" fill="#D5F5E3" stroke="#27AE60" strokeWidth="2" />
      <circle cx="14" cy="21" r="1.2" fill="#27AE60" />
      <polygon points="14,7 11,13 14,13 13,17 17,11 14,11" fill="#27AE60" />
    </svg>
  </div>
);

export const IconBrimoTopUp: React.FC<{ size?: number; className?: string }> = ({ size = 28, className = '' }) => (
  <div
    className={`relative flex items-center justify-center rounded-2xl bg-[#EAF7EE] text-[#2ECC71] shadow-sm ${className}`}
    style={{ width: size + 18, height: size + 18 }}
  >
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <rect x="3" y="8" width="22" height="15" rx="3" fill="#D5F5E3" stroke="#27AE60" strokeWidth="1.8" />
      <path d="M3 13h22" stroke="#27AE60" strokeWidth="1.8" />
      <circle cx="14" cy="5" r="4" fill="#F5B041" stroke="#D68910" strokeWidth="1.2" />
      <circle cx="20" cy="16" r="2" fill="#F5B041" />
    </svg>
    {/* Red notification dot */}
    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white" />
  </div>
);

export const IconBrimoBrizzi: React.FC<{ size?: number; className?: string }> = ({ size = 28, className = '' }) => (
  <div
    className={`relative flex items-center justify-center rounded-2xl bg-[#E2F7F6] text-[#00A896] shadow-sm ${className}`}
    style={{ width: size + 18, height: size + 18 }}
  >
    <div className="bg-[#00A896] text-white px-1 py-1 rounded-md shadow-xs flex items-center justify-center">
      <span className="font-black text-[8px] tracking-tight leading-none">BRIZZI</span>
    </div>
  </div>
);

export const IconBrimoTagihan: React.FC<{ size?: number; className?: string }> = ({ size = 28, className = '' }) => (
  <div
    className={`relative flex items-center justify-center rounded-2xl bg-[#EBF5FB] text-[#2980B9] shadow-sm ${className}`}
    style={{ width: size + 18, height: size + 18 }}
  >
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <path d="M6 4h12l4 4v16H6V4z" fill="#D4E6F1" stroke="#2980B9" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M18 4v4h4" stroke="#2980B9" strokeWidth="1.8" strokeLinejoin="round" />
      <line x1="10" y1="12" x2="16" y2="12" stroke="#2980B9" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="10" y1="16" x2="18" y2="16" stroke="#2980B9" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="10" y1="20" x2="14" y2="20" stroke="#2980B9" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white" />
  </div>
);

export const IconBrimoLifestyle: React.FC<{ size?: number; className?: string }> = ({ size = 28, className = '' }) => (
  <div
    className={`relative flex items-center justify-center rounded-2xl bg-[#FCE4EC] text-[#E91E63] shadow-sm ${className}`}
    style={{ width: size + 18, height: size + 18 }}
  >
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <path d="M5 9l2 15h14l2-15H5z" fill="#F8BBD0" stroke="#E91E63" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M10 9V6a4 4 0 0 1 8 0v3" stroke="#E91E63" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  </div>
);

export const IconBrimoAtm: React.FC<{ size?: number; className?: string }> = ({ size = 28, className = '' }) => (
  <div
    className={`relative flex items-center justify-center rounded-2xl bg-[#E8F8F5] text-[#1ABC9C] shadow-sm ${className}`}
    style={{ width: size + 18, height: size + 18 }}
  >
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <rect x="5" y="4" width="18" height="20" rx="3" fill="#A3E4D7" stroke="#16A085" strokeWidth="1.8" />
      <rect x="8" y="7" width="12" height="6" rx="1" fill="white" stroke="#16A085" strokeWidth="1.2" />
      <line x1="8" y1="16" x2="20" y2="16" stroke="#16A085" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="10" y="19" width="8" height="2" rx="0.5" fill="#16A085" />
    </svg>
  </div>
);

export const IconBrimoJunior: React.FC<{ size?: number; className?: string }> = ({ size = 28, className = '' }) => (
  <div
    className={`relative flex items-center justify-center rounded-2xl bg-[#EBF5FB] text-[#3498DB] shadow-sm ${className}`}
    style={{ width: size + 18, height: size + 18 }}
  >
    <div className="bg-[#3498DB] text-white px-1.5 py-0.5 rounded shadow-xs flex flex-col items-center justify-center">
      <span className="font-extrabold text-[7px] leading-tight">BRImo</span>
      <span className="font-black text-[6px] tracking-wider leading-none text-amber-200">Junior</span>
    </div>
  </div>
);

export const IconBrimoKartu: React.FC<{ size?: number; className?: string }> = ({ size = 28, className = '' }) => (
  <div
    className={`relative flex items-center justify-center rounded-2xl bg-[#E8EAF6] text-[#3F51B5] shadow-sm ${className}`}
    style={{ width: size + 18, height: size + 18 }}
  >
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <rect x="3" y="6" width="22" height="16" rx="3" fill="#C5CAE9" stroke="#3F51B5" strokeWidth="1.8" />
      <line x1="3" y1="11" x2="25" y2="11" stroke="#3F51B5" strokeWidth="2" />
      <rect x="6" y="14" width="4" height="3" rx="0.5" fill="#F5B041" />
    </svg>
  </div>
);
