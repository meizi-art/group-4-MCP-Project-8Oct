import React from 'react';
import { Check } from 'lucide-react';
import { WHO_IS_THIS_FOR_ITEMS } from '../data/mockData';

export const WhoIsThisForCard: React.FC = () => {
  return (
    <div className="bg-[#111827] border border-slate-800/90 rounded-2xl p-5 sm:p-6 shadow-sm">
      <h3 className="text-white font-bold text-sm sm:text-base tracking-wide mb-4">
        Who Is This For?
      </h3>

      <div className="space-y-3">
        {WHO_IS_THIS_FOR_ITEMS.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-[#00E599]/15 border border-[#00E599]/40 flex items-center justify-center shrink-0">
              <Check className="w-2.5 h-2.5 text-[#00E599]" strokeWidth={3} />
            </div>
            <span className="text-slate-300 text-xs sm:text-sm font-normal">
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
