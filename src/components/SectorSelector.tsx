import React from 'react';
import { Sector } from '../types';
import { ALL_SECTORS } from '../data/mockData';

interface SectorSelectorProps {
  selectedSectors: Sector[];
  onToggleSector: (sector: Sector) => void;
}

export const SectorSelector: React.FC<SectorSelectorProps> = ({
  selectedSectors,
  onToggleSector,
}) => {
  return (
    <div className="bg-[#111827] border border-slate-800/90 rounded-2xl p-5 sm:p-6 shadow-sm">
      <h2 className="text-[#00E599] font-bold text-sm tracking-wide mb-1">
        Sector Interests
      </h2>
      <p className="text-slate-400 text-xs mb-4">
        Select the sectors you&apos;re interested in trading
      </p>

      <div className="flex flex-wrap gap-2.5">
        {ALL_SECTORS.map((sector) => {
          const isSelected = selectedSectors.includes(sector);
          return (
            <button
              key={sector}
              type="button"
              onClick={() => onToggleSector(sector)}
              className={`flex items-center gap-2.5 px-3.5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer select-none ${
                isSelected
                  ? 'bg-[#18233C] text-white border border-slate-600 shadow-sm'
                  : 'bg-[#141B2D] text-slate-300 border border-slate-700/60 hover:border-slate-500 hover:text-white'
              }`}
            >
              {/* Circular Indicator */}
              <span
                className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-white ring-2 ring-white/30'
                    : 'border-2 border-slate-400 bg-transparent'
                }`}
              >
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#111827]" />
                )}
              </span>
              <span>{sector}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
