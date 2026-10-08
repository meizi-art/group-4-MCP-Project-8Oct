import React from 'react';
import { RiskTolerance } from '../types';

interface ReturnRiskSelectorProps {
  returnMultiplier: number;
  riskTolerance: RiskTolerance;
  onChangeMultiplier: (multiplier: number) => void;
  onChangeRiskTolerance: (risk: RiskTolerance) => void;
}

export const ReturnRiskSelector: React.FC<ReturnRiskSelectorProps> = ({
  returnMultiplier,
  riskTolerance,
  onChangeMultiplier,
  onChangeRiskTolerance,
}) => {
  const riskOptions: RiskTolerance[] = ['Low', 'Medium', 'High'];

  return (
    <div className="bg-[#111827] border border-slate-800/90 rounded-2xl p-5 sm:p-6 shadow-sm">
      <h2 className="text-[#00E599] font-bold text-sm tracking-wide mb-1">
        Return &amp; Risk Appetite
      </h2>
      <p className="text-slate-400 text-xs mb-4">
        Set your financial targets and risk tolerance
      </p>

      {/* Target Return Multiplier Slider */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-slate-300 text-xs font-medium">
            Target Return Multiplier
          </label>
          <span className="text-[#00E599] font-extrabold text-xl sm:text-2xl tracking-tight">
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

        <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1">
          <span>1X (Conservative)</span>
          <span>20X (Aggressive)</span>
        </div>
      </div>

      {/* Risk Tolerance */}
      <div>
        <label className="block text-slate-300 text-xs font-medium mb-2.5">
          Risk Tolerance
        </label>
        <div className="flex gap-2.5">
          {riskOptions.map((risk) => {
            const isSelected = riskTolerance === risk;
            return (
              <button
                key={risk}
                type="button"
                onClick={() => onChangeRiskTolerance(risk)}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer select-none ${
                  isSelected
                    ? 'bg-[#18233C] text-white border border-slate-600 shadow-sm'
                    : 'bg-[#141B2D] text-slate-300 border border-slate-700/60 hover:border-slate-500 hover:text-white'
                }`}
              >
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
                <span>{risk}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
