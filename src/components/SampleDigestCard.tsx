import React from 'react';
import { TradeIdea } from '../types';
import { SAMPLE_DAILY_DIGEST } from '../data/mockData';

interface SampleDigestCardProps {
  onSelectIdea: (idea: TradeIdea) => void;
}

export const SampleDigestCard: React.FC<SampleDigestCardProps> = ({
  onSelectIdea,
}) => {
  return (
    <div className="bg-[#111827] border border-slate-800/90 rounded-2xl p-5 sm:p-6 shadow-sm">
      <h3 className="text-white font-bold text-sm sm:text-base tracking-wide mb-2">
        Sample Daily Digest
      </h3>

      {/* Date & Confidence Badge Row */}
      <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-800/80">
        <span className="text-slate-400 text-xs">
          Today&apos;s Top 3 Ideas — Jan 15, 2025
        </span>
        <span className="text-[#00E599] bg-[#00E599]/10 border border-[#00E599]/20 font-bold text-[10px] tracking-wide px-2 py-0.5 rounded">
          HIGH CONFIDENCE
        </span>
      </div>

      {/* Ideas List */}
      <div className="space-y-4">
        {SAMPLE_DAILY_DIGEST.map((idea, index) => (
          <div
            key={idea.ticker}
            onClick={() => onSelectIdea(idea)}
            className="group p-2.5 -mx-2.5 rounded-xl hover:bg-[#162035]/80 transition-all cursor-pointer"
          >
            {/* Ticker, Exchange & Gain Header */}
            <div className="flex items-center justify-between text-xs sm:text-sm mb-1">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 font-bold">{index + 1}.</span>
                <span className="text-white font-black group-hover:text-[#00E599] transition-colors">
                  {idea.ticker}
                </span>
                <span className="text-slate-400 text-[11px] font-medium ml-1">
                  {idea.exchange}
                </span>
              </div>
              <span className="text-[#00E599] font-bold text-xs sm:text-sm">
                {idea.change}
              </span>
            </div>

            {/* Signal Summary Subtext */}
            <p className="text-slate-400 text-xs leading-relaxed group-hover:text-slate-300 transition-colors">
              {idea.signalSummary}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
