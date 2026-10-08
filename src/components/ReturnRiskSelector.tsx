import React from 'react';
import { RiskAppetite } from '../types';

interface ReturnRiskSelectorProps {
  returnMultiplier: number;
  riskTolerance: RiskAppetite;
  financialObjective: string;
  onChangeMultiplier: (multiplier: number) => void;
  onChangeRiskTolerance: (risk: RiskAppetite) => void;
  onChangeObjective: (objective: string) => void;
}

export const ReturnRiskSelector: React.FC<ReturnRiskSelectorProps> = ({
  returnMultiplier,
  riskTolerance,
  financialObjective,
  onChangeMultiplier,
  onChangeRiskTolerance,
  onChangeObjective,
}) => {
  const riskOptions: RiskAppetite[] = ['Low', 'Medium', 'High', 'Extremely High'];

  return (
    <div className="bg-[#111827] border border-slate-800/90 rounded-2xl p-5 sm:p-6 shadow-sm">
      <h2 className="text-[#00E599] font-bold text-sm tracking-wide mb-1">
        Return &amp; Risk Appetite
      </h2>
      <p className="text-slate-400 text-xs mb-4">
        Set your financial targets, objective, and risk tolerance
      </p>

      {/* Financial Objective Free Text */}
      <div className="mb-4">
        <label className="block text-slate-300 text-xs font-medium mb-1.5">
          Financial Objective (Free text)
        </label>
        <input
          type="text"
          value={financialObjective}
          onChange={(e) => onChangeObjective(e.target.value)}
          placeholder="e.g. 10X return on $1,000 capital"
          className="w-full bg-[#162035] hover:bg-[#1a263f] border border-slate-700/80 rounded-xl px-4 py-2 text-xs sm:text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#00E599] focus:border-[#00E599] transition-all"
        />
      </div>

      {/* Target Return Multiplier Slider */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-slate-300 text-xs font-medium">
            Target Return Multiplier
          </label>
          <span className="text-[#00E599] font-extrabold text-lg sm:text-xl tracking-tight">
            {returnMultiplier}X
          </span>
        </div>

        <div className="relative py-1">
          <input
            type="range"
            min="1"
            max="20"
            step="1"
            value={returnMultiplier}
            onChange={(e) => onChangeMultiplier(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-slate-700/80 rounded-lg appearance-none cursor-pointer accent-[#00E599] focus:outline-none"
            style={{
              background: `linear-gradient(to right, #00E599 0%, #00E599 ${(returnMultiplier - 1) / 19 * 100}%, #334155 ${(returnMultiplier - 1) / 19 * 100}%, #334155 100%)`
            }}
          />
        </div>

        <div className="flex justify-between items-center text-[10px] text-slate-400 mt-0.5">
          <span>1X (Conservative)</span>
          <span>20X (Aggressive)</span>
        </div>
      </div>

      {/* Risk Appetite Buttons */}
      <div>
        <label className="block text-slate-300 text-xs font-medium mb-2">
          Risk Appetite
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {riskOptions.map((risk) => {
            const isSelected = riskTolerance === risk;
            return (
              <button
                key={risk}
                type="button"
                onClick={() => onChangeRiskTolerance(risk)}
                className={`flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl text-[11px] sm:text-xs font-medium transition-all cursor-pointer select-none ${
                  isSelected
                    ? 'bg-[#18233C] text-white border border-slate-600 shadow-sm'
                    : 'bg-[#141B2D] text-slate-300 border border-slate-700/60 hover:border-slate-500 hover:text-white'
                }`}
              >
                <span
                  className={`w-3 h-3 rounded-full flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-white ring-2 ring-white/30'
                      : 'border-2 border-slate-400 bg-transparent'
                  }`}
                >
                  {isSelected && (
                    <span className="w-1 h-1 rounded-full bg-[#111827]" />
                  )}
                </span>
                <span className="truncate">{risk}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
