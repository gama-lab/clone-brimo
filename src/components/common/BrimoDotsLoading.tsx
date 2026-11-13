import React from 'react';

interface BrimoDotsLoadingProps {
  label?: string;
}

const DOT_INDICES = [0, 1, 2, 3, 4, 5] as const;

export const BrimoDotsLoading: React.FC<BrimoDotsLoadingProps> = ({
  label = 'Loading',
}) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-md flex flex-col items-center justify-center select-none animate-in fade-in duration-150"
    >
      <div className="flex items-center justify-center gap-3.5 h-8">
        {DOT_INDICES.map((idx) => (
          <span
            key={idx}
            className="w-3 h-3 rounded-full bg-white shadow-[0_2px_8px_rgba(255,255,255,0.35)] animate-brimo-dot"
            style={{ animationDelay: `${idx * 110}ms` }}
          />
        ))}
      </div>
      <span className="mt-4 text-sm font-medium text-white tracking-wide drop-shadow-xs">
        {label}
      </span>
    </div>
  );
};
