import React from 'react';
import { Info } from 'lucide-react';

export const DisclaimerCard: React.FC = () => {
  return (
    <div className="bg-[#111827]/70 border border-slate-800/60 rounded-2xl p-4 sm:p-5">
      <div className="flex items-start gap-2.5">
        <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <p className="text-slate-500 text-[11px] leading-relaxed">
          Trade ideas are informational only and do not constitute financial advice. Past performance does not guarantee future results.
        </p>
      </div>
    </div>
  );
};
