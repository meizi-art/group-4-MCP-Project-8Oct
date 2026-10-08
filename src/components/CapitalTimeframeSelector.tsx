import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { TIMEFRAMES } from '../data/mockData';

interface CapitalTimeframeSelectorProps {
  initialCapital: number;
  timeframe: string;
  onChangeCapital: (capital: number) => void;
  onChangeTimeframe: (timeframe: string) => void;
}

export const CapitalTimeframeSelector: React.FC<CapitalTimeframeSelectorProps> = ({
  initialCapital,
  timeframe,
  onChangeCapital,
  onChangeTimeframe,
}) => {
  const stepCapital = (amount: number) => {
    onChangeCapital(Math.max(100, initialCapital + amount));
  };

  return (
    <div className="bg-[#111827] border border-slate-800/90 rounded-2xl p-5 sm:p-6 shadow-sm">
      <h2 className="text-[#00E599] font-bold text-sm tracking-wide mb-1">
        Capital &amp; Timeframe
      </h2>
      <p className="text-slate-400 text-xs mb-4">
        Define your investment parameters
      </p>

      <div className="space-y-4">
        {/* Initial Capital (USD) */}
        <div>
          <label className="block text-slate-400 text-[11px] mb-1.5 font-medium">
            Initial Capital (USD)
          </label>
          <div className="relative flex items-center">
            <input
              type="number"
              min="100"
              step="100"
              value={initialCapital}
              onChange={(e) => onChangeCapital(Math.max(0, parseInt(e.target.value, 10) || 0))}
              className="w-full bg-[#162035] hover:bg-[#1a263f] border border-slate-700/80 rounded-xl px-4 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-1 focus:ring-[#00E599] focus:border-[#00E599] transition-all pr-12"
            />
            {/* Stepper controls */}
            <div className="absolute right-1.5 flex flex-col items-center justify-center">
              <button
                type="button"
                onClick={() => stepCapital(250)}
                className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Increase capital"
              >
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => stepCapital(-250)}
                className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Decrease capital"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Investment Timeframe */}
        <div>
          <label className="block text-slate-400 text-[11px] mb-1.5 font-medium">
            Investment Timeframe
          </label>
          <div className="relative">
            <select
              value={timeframe}
              onChange={(e) => onChangeTimeframe(e.target.value)}
              className="w-full appearance-none bg-[#162035] hover:bg-[#1a263f] border border-slate-700/80 rounded-xl px-4 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-1 focus:ring-[#00E599] focus:border-[#00E599] transition-all cursor-pointer pr-10"
            >
              {TIMEFRAMES.map((tf) => (
                <option key={tf} value={tf} className="bg-[#111827] text-white py-1">
                  {tf}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
