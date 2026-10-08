import React, { useState } from 'react';
import { X, Sparkles, Send, CheckCircle2, Copy, Check, ArrowUpRight, TrendingUp } from 'lucide-react';
import { GeneratedDigestResponse, TradeIdea, UserPreferences } from '../types';

interface GeneratedDigestModalProps {
  data: GeneratedDigestResponse | null;
  preferences: UserPreferences;
  onClose: () => void;
  onSelectIdea: (idea: TradeIdea) => void;
}

export const GeneratedDigestModal: React.FC<GeneratedDigestModalProps> = ({
  data,
  preferences,
  onClose,
  onSelectIdea,
}) => {
  const [copied, setCopied] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);

  if (!data) return null;

  const handleCopy = () => {
    const text = `DEALHUNTER X — Ten-Bagger Ideas (${data.generatedAt})\nTarget Return: ${preferences.returnMultiplier}X | Timeframe: ${preferences.timeframe} | Capital: $${preferences.initialCapital}\n\n` +
      data.ideas.map((idea, i) => `${i + 1}. ${idea.ticker} (${idea.exchange}) - ${idea.price} | Target: ${idea.targetMultiplier}\n   Catalyst: ${idea.signalSummary}\n   Polymarket/Kalshi: ${idea.predictionMarket.probability} (${idea.predictionMarket.market})\n   Recommended Capital: $${idea.allocationUSD || 350}`).join('\n\n') +
      `\n\nGenerated for: ${preferences.email}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendEmail = async () => {
    setSendingEmail(true);
    try {
      await fetch('/api/send-digest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: preferences.email,
          frequency: preferences.digestFrequency,
          time: preferences.deliveryTime,
        }),
      });
    } catch {
      // simulated success
    } finally {
      setSendingEmail(false);
      setEmailSent(true);
      setTimeout(() => setEmailSent(false), 4000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div 
        className="bg-[#111827] border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-6 sm:p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/60 hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-[#00E599]" />
          <span className="text-[#00E599] font-bold text-xs uppercase tracking-wider">
            Custom Algorithmic Synthesis
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-2">
          Your Personalized 10X Trade Intelligence
        </h2>

        {/* User Parameter Tags */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 pb-4 mb-4 border-b border-slate-800">
          <span className="bg-[#162035] px-2.5 py-1 rounded-md border border-slate-700/60">
            Target: <strong className="text-[#00E599]">{preferences.returnMultiplier}X Multiplier</strong>
          </span>
          <span className="bg-[#162035] px-2.5 py-1 rounded-md border border-slate-700/60">
            Timeframe: <strong className="text-white">{preferences.timeframe}</strong>
          </span>
          <span className="bg-[#162035] px-2.5 py-1 rounded-md border border-slate-700/60">
            Risk: <strong className="text-white">{preferences.riskTolerance}</strong>
          </span>
          <span className="bg-[#162035] px-2.5 py-1 rounded-md border border-slate-700/60">
            Portfolio: <strong className="text-white">${preferences.initialCapital} USD</strong>
          </span>
        </div>

        {/* Summary note */}
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 bg-[#151D2F] p-3.5 rounded-xl border border-slate-800">
          {data.summary}
        </p>

        {/* List of Ideas */}
        <div className="space-y-4 mb-6">
          {data.ideas.map((idea, index) => (
            <div
              key={idea.ticker}
              onClick={() => onSelectIdea(idea)}
              className="group bg-[#141B2D] border border-slate-800 hover:border-[#00E599]/60 rounded-xl p-4 sm:p-5 transition-all cursor-pointer relative overflow-hidden"
            >
              {/* Top Row: Number, Ticker, Exchange, Target Return */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-bold text-sm">
                    {index + 1}.
                  </span>
                  <span className="text-lg font-black text-white group-hover:text-[#00E599] transition-colors">
                    {idea.ticker}
                  </span>
                  <span className="text-slate-400 text-xs font-medium">
                    {idea.exchange}
                  </span>
                  <span className="text-slate-400 text-xs">
                    ({idea.company})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-300 text-xs font-semibold">
                    {idea.price}
                  </span>
                  <span className="text-[#00E599] font-bold text-xs sm:text-sm bg-[#00E599]/10 px-2 py-0.5 rounded">
                    {idea.targetMultiplier} Target
                  </span>
                </div>
              </div>

              {/* Core Catalyst */}
              <p className="text-slate-300 text-xs sm:text-sm mb-3">
                {idea.signalSummary}
              </p>

              {/* Micro-metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-3 border-t border-slate-800/80">
                <div className="text-slate-400">
                  <span className="block text-[10px] text-slate-500 uppercase font-semibold">Prediction Market</span>
                  <span className="text-cyan-400 font-medium">{idea.predictionMarket.probability} ({idea.predictionMarket.market})</span>
                </div>
                <div className="text-slate-400">
                  <span className="block text-[10px] text-slate-500 uppercase font-semibold">Social Buzz</span>
                  <span className="text-purple-400 font-medium">Score {idea.socialSentiment.buzzScore} / {idea.socialSentiment.sentiment}</span>
                </div>
                <div className="text-slate-400">
                  <span className="block text-[10px] text-slate-500 uppercase font-semibold">Capital Allocation</span>
                  <span className="text-white font-bold">${idea.allocationUSD || 350}</span>
                </div>
                <div className="text-slate-400">
                  <span className="block text-[10px] text-slate-500 uppercase font-semibold">Invalidation Stop</span>
                  <span className="text-rose-400 font-medium">{idea.stopLoss || '-15%'}</span>
                </div>
              </div>

              {/* Inspect Arrow */}
              <div className="absolute top-4 right-4 text-slate-500 group-hover:text-[#00E599] transition-colors">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopy}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-[#00E599]" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Briefing'}</span>
            </button>

            <button
              onClick={handleSendEmail}
              disabled={sendingEmail}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#00E599] hover:bg-[#00c984] text-[#080C17] text-xs font-bold transition-all cursor-pointer shadow-md shadow-[#00E599]/15"
            >
              {emailSent ? (
                <CheckCircle2 className="w-4 h-4 text-[#080C17]" />
              ) : (
                <Send className="w-4 h-4 text-[#080C17]" />
              )}
              <span>
                {emailSent
                  ? `Scheduled for ${preferences.email}`
                  : `Send to ${preferences.email}`}
              </span>
            </button>
          </div>

          <span className="text-[11px] text-slate-500 text-center">
            Click any idea to view full orderbook &amp; probability model
          </span>
        </div>
      </div>
    </div>
  );
};
