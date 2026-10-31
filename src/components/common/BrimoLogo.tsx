import React from 'react';

interface BrimoLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'white' | 'blue';
  layout?: 'stacked' | 'horizontal';
}

export const BrimoLogo: React.FC<BrimoLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'white',
  layout = 'stacked',
}) => {
  const isWhite = variant === 'white';
  const briColor = isWhite ? 'text-white' : 'text-[#1078CA]';
  const moColor = 'text-[#38BDF8]'; // Biru langit (Sky Blue)

  if (layout === 'stacked') {
    const sizeConfig = {
      xs: { bri: 'text-[11px]', mo: 'text-[9px]', leading: 'leading-[9px]' },
      sm: { bri: 'text-xs', mo: 'text-[10px]', leading: 'leading-[10px]' },
      md: { bri: 'text-sm font-black', mo: 'text-xs font-black', leading: 'leading-[11px]' },
      lg: { bri: 'text-xl font-black', mo: 'text-base font-black', leading: 'leading-[15px]' },
      xl: { bri: 'text-3xl font-black', mo: 'text-2xl font-black', leading: 'leading-[22px]' },
    }[size];

    return (
      <div className={`inline-flex flex-col items-center justify-center font-black select-none tracking-tight ${sizeConfig.leading} ${className}`}>
        <span className={`${briColor} ${sizeConfig.bri} font-extrabold tracking-tighter`}>
          BRI
        </span>
        <span className={`${moColor} ${sizeConfig.mo} font-black -mt-0.5 tracking-tight`}>
          mo
        </span>
      </div>
    );
  }

  // Horizontal layout if ever needed
  return (
    <div className={`inline-flex items-baseline font-black select-none tracking-tight ${className}`}>
      <span className={`${briColor} font-extrabold`}>BRI</span>
      <span className={`${moColor} font-black ml-0.5`}>mo</span>
    </div>
  );
};

// Official Android BRImo App Icon (Square rounded tile)
export const BrimoAppIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 64,
  className = '',
}) => {
  return (
    <div
      className={`rounded-2xl bg-gradient-to-b from-[#1078CA] to-[#0A5EA3] flex flex-col items-center justify-center shadow-lg border border-white/20 select-none relative overflow-hidden ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Subtle glass reflection highlight */}
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/15 rounded-t-2xl pointer-events-none" />

      <div className="flex flex-col items-center justify-center leading-none z-10">
        <span
          className="text-white font-extrabold tracking-tighter"
          style={{ fontSize: `${Math.round(size * 0.38)}px`, lineHeight: 0.9 }}
        >
          BRI
        </span>
        <span
          className="text-[#38BDF8] font-black tracking-tight"
          style={{ fontSize: `${Math.round(size * 0.32)}px`, lineHeight: 0.9, marginTop: `${Math.round(size * 0.04)}px` }}
        >
          mo
        </span>
      </div>
    </div>
  );
};
