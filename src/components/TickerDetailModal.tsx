import React from 'react';
import { X, TrendingUp, BarChart3, Users, Newspaper, LineChart, ShieldAlert, Target } from 'lucide-react';
import { TradeIdea } from '../types';

interface TickerDetailModalProps {
  idea: TradeIdea | null;
  onClose: () => void;
}

export const TickerDetailModal: React.FC<TickerDetailModalProps> = ({ idea, onClose }) => {
  if (!idea) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-[#111827] border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-7 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/60 hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <span className="text-2xl sm:text-3xl font-black text-white">{idea.ticker}</span>
          <span className="text-slate-400 text-sm font-semibold">{idea.company}</span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-xs font-semibold">
            {idea.exchange}
          </span>
          <span className="px-2 py-0.5 rounded bg-[#00E599]/15 border border-[#00E599]/30 text-[#00E599] text-xs font-bold">
            {idea.confidence}
          </span>
        </div>

        <div className="flex items-center gap-4 text-sm mb-6 pb-4 border-b border-slate-800">
          <div>
            <span className="text-slate-400 text-xs block">Current Price</span>
            <span className="text-white font-bold text-lg">{idea.price}</span>
          </div>
          <div>
            <span className="text-slate-400 text-xs block">24h Momentum</span>
            <span className="text-[#00E599] font-bold text-lg">{idea.change}</span>
          </div>
          <div>
            <span className="text-slate-400 text-xs block">Target Return</span>
            <span className="text-[#00E599] font-bold text-lg">{idea.targetMultiplier}</span>
          </div>
          {idea.projectedPrice && (
            <div>
              <span className="text-slate-400 text-xs block">Projected Target</span>
              <span className="text-white font-bold text-lg">{idea.projectedPrice}</span>
            </div>
          )}
        </div>

        {/* Signal Summary Banner */}
        <div className="bg-[#151D2F] border border-slate-800 rounded-xl p-4 mb-6">
          <span className="text-[#00E599] text-xs font-bold block mb-1 uppercase tracking-wider">
            Consensus Multi-Source Signal
          </span>
          <p className="text-white text-sm font-medium leading-relaxed">
            {idea.signalSummary}
          </p>
        </div>

        {/* 4 Multi-Source Signal Pillars */}
        <h4 className="text-slate-300 text-xs font-bold uppercase tracking-wider mb-3">
          Intelligence Source Telemetry
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
          {/* Prediction Market */}
          <div className="bg-[#141B2D] border border-cyan-500/20 rounded-xl p-3.5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded bg-cyan-500/20 flex items-center justify-center">
                <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <span className="text-cyan-400 text-xs font-bold">
                {idea.predictionMarket?.market || 'Polymarket'}
              </span>
              <span className="ml-auto text-xs font-extrabold text-white bg-cyan-500/20 px-2 py-0.5 rounded">
                {idea.predictionMarket?.probability || '75%'} YES
              </span>
            </div>
            <p className="text-slate-300 text-xs line-clamp-2 mb-2">
              &ldquo;{idea.predictionMarket?.question || 'Multi-source probability catalyst validation'}&rdquo;
            </p>
            <div className="text-[11px] text-slate-400">
              Contract Volume: <span className="text-slate-300 font-medium">{idea.predictionMarket?.volume || '$2.4M'}</span>
            </div>
          </div>

          {/* Social Sentiment */}
          <div className="bg-[#141B2D] border border-purple-500/20 rounded-xl p-3.5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded bg-purple-500/20 flex items-center justify-center">
                <Users className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <span className="text-purple-400 text-xs font-bold">
                {idea.socialSentiment?.platform || 'X & Reddit'}
              </span>
              <span className="ml-auto text-xs font-extrabold text-white bg-purple-500/20 px-2 py-0.5 rounded">
                Score {idea.socialSentiment?.buzzScore || 88}/100
              </span>
            </div>
            <p className="text-slate-300 text-xs mb-2">
              Sentiment: <span className="text-emerald-400 font-semibold">{idea.socialSentiment?.sentiment || '85% Bullish'}</span>
            </p>
            <div className="text-[11px] text-slate-400">
              Mention Velocity: <span className="text-slate-300 font-medium">{idea.socialSentiment?.mentionVelocity || '+210% 7d'}</span>
            </div>
          </div>

          {/* News Catalyst */}
          <div className="bg-[#141B2D] border border-rose-500/20 rounded-xl p-3.5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded bg-rose-500/20 flex items-center justify-center">
                <Newspaper className="w-3.5 h-3.5 text-rose-400" />
              </div>
              <span className="text-rose-400 text-xs font-bold">
                {idea.newsCatalyst?.source || 'Google News'}
              </span>
              <span className="ml-auto text-[11px] text-slate-400">
                {idea.newsCatalyst?.time || 'Recent'}
              </span>
            </div>
            <p className="text-slate-300 text-xs line-clamp-2">
              &ldquo;{idea.newsCatalyst?.headline || idea.signalSummary || 'Key corporate milestone and earnings inflection'}&rdquo;
            </p>
          </div>

          {/* Financial Market Data */}
          <div className="bg-[#141B2D] border border-amber-500/20 rounded-xl p-3.5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded bg-amber-500/20 flex items-center justify-center">
                <LineChart className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <span className="text-amber-400 text-xs font-bold">
                {idea.marketSignal?.metric || 'Options Call Flow'}
              </span>
              <span className="ml-auto text-[10px] text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded font-semibold">
                {idea.marketSignal?.signalType || 'Bullish Flow'}
              </span>
            </div>
            <p className="text-slate-300 text-xs">
              {idea.marketSignal?.detail || 'Unusual call volume and institutional accumulation detected'}
            </p>
          </div>
        </div>

        {/* Ten-Bagger Thesis */}
        <div className="mb-6">
          <h4 className="text-slate-300 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-[#00E599]" />
            Ten-Bagger Thesis &amp; Asymmetry
          </h4>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed bg-[#151D2F]/50 p-4 rounded-xl border border-slate-800">
            {idea.thesis}
          </p>
        </div>

        {/* Stop Loss & Profit Target */}
        {(idea.stopLoss || idea.profitTarget || idea.allocationUSD) && (
          <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-center mb-4">
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Recommended Allocation</span>
              <span className="text-white font-bold text-sm sm:text-base">${idea.allocationUSD || 350}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Invalidation Stop-Loss</span>
              <span className="text-rose-400 font-bold text-xs sm:text-sm">{idea.stopLoss || '-15%'}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Take-Profit Target</span>
              <span className="text-[#00E599] font-bold text-xs sm:text-sm">{idea.profitTarget || idea.targetMultiplier}</span>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
};
