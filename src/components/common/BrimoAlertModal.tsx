import React from 'react';
import { Info, CheckCircle2 } from 'lucide-react';

export interface BrimoAlertData {
  isOpen: boolean;
  title: string;
  message?: string;
  type?: 'info' | 'success';
}

interface BrimoAlertModalProps {
  data: BrimoAlertData;
  onClose: () => void;
}

export const BrimoAlertModal: React.FC<BrimoAlertModalProps> = ({ data, onClose }) => {
  if (!data.isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[999] flex items-center justify-center p-6 animate-in fade-in select-none">
      <div className="bg-white rounded-3xl p-6 text-slate-800 w-full max-w-xs text-center shadow-2xl space-y-3.5 animate-sheet-up border border-slate-100">
        {/* Icon Circle */}
        <div className="w-14 h-14 rounded-full bg-blue-50 text-[#1078CA] flex items-center justify-center mx-auto mb-1 border border-blue-100">
          {data.type === 'success' ? (
            <CheckCircle2 size={30} className="text-[#1078CA]" />
          ) : (
            <Info size={30} className="text-[#1078CA]" />
          )}
        </div>

        {/* Title and Message */}
        <div>
          <h3 className="text-base font-bold text-slate-900 leading-snug">
            {data.title}
          </h3>
          {data.message && (
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              {data.message}
            </p>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 bg-[#1078CA] hover:bg-[#0d64a8] active:scale-95 text-white font-bold text-xs rounded-xl shadow-md transition-all"
          >
            Oke
          </button>
        </div>
      </div>
    </div>
  );
};
