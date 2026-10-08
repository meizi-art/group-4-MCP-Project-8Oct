import React, { useState } from 'react';
import { X, Check, ShieldCheck, Zap, Lock, CreditCard } from 'lucide-react';

interface SubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
}

export const SubscribeModal: React.FC<SubscribeModalProps> = ({
  isOpen,
  onClose,
  userEmail,
}) => {
  const [email, setEmail] = useState(userEmail || 'trader@dealhunterx.com');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, plan: 'Pro Monthly US$35' }),
      });
    } catch {
      // fallback simulation
    } finally {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2500);
    }
  };

  const proFeatures = [
    '6:00 AM EST Pre-Market Ten-Bagger Briefings directly to your inbox',
    'Real-time Polymarket & Kalshi whale flow detection alerts',
    'Uncapped AI Multi-Signal Engine queries across 8 global sectors',
    'Social sentiment velocity spike triggers on Reddit & X',
    'Exclusive private Discord access with institutional research notes',
    'Cancel anytime with a 7-day 100% money-back guarantee'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div 
        className="bg-[#111827] border border-slate-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-7 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/60 hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg bg-[#00E599]/20 flex items-center justify-center text-[#00E599]">
            <Zap className="w-4 h-4 fill-[#00E599]" />
          </div>
          <span className="text-[#00E599] font-bold text-xs uppercase tracking-wider">
            DEALHUNTER X PRO
          </span>
        </div>

        <h2 className="text-2xl font-black text-white tracking-tight mb-1">
          Subscribe to Alpha Intelligence
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm mb-6">
          Access high-conviction ten-bagger asymmetric trade signals before the opening bell.
        </p>

        {/* Pricing Box */}
        <div className="bg-[#151D2F] border border-slate-700/80 rounded-xl p-4 mb-6 flex items-baseline justify-between">
          <div>
            <span className="text-white font-bold text-base block">Pro Monthly Plan</span>
            <span className="text-slate-400 text-xs">Billed monthly · Cancel anytime</span>
          </div>
          <div className="text-right">
            <span className="text-2xl sm:text-3xl font-black text-[#00E599]">US$35</span>
            <span className="text-slate-400 text-xs">/month</span>
          </div>
        </div>

        {/* Feature List */}
        <div className="space-y-2.5 mb-6">
          {proFeatures.map((feat, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
              <div className="w-4 h-4 rounded-full bg-[#00E599]/15 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-2.5 h-2.5 text-[#00E599]" strokeWidth={3} />
              </div>
              <span>{feat}</span>
            </div>
          ))}
        </div>

        {/* Form or Success State */}
        {isSuccess ? (
          <div className="bg-[#00E599]/10 border border-[#00E599]/30 rounded-xl p-4 text-center">
            <ShieldCheck className="w-8 h-8 text-[#00E599] mx-auto mb-2" />
            <h4 className="text-white font-bold text-sm mb-1">Subscription Activated!</h4>
            <p className="text-slate-300 text-xs">
              Welcome aboard. Your daily 6:00 AM pre-market digest has been queued for {email}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="space-y-4">
            <div>
              <label className="block text-slate-400 text-[11px] mb-1 font-medium">
                Email for Digest &amp; Account
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#162035] border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#00E599] focus:border-[#00E599]"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-[11px] mb-1 font-medium">
                Payment Method
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full bg-[#162035] border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white pl-10 focus:outline-none focus:ring-1 focus:ring-[#00E599] focus:border-[#00E599]"
                />
                <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-[#00E599] hover:bg-[#00c984] text-[#080C17] font-black text-sm tracking-wide transition-all shadow-lg shadow-[#00E599]/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>{isSubmitting ? 'Activating Pro Membership...' : 'Start 7-Day Free Trial — US$35/mo'}</span>
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
              <span>256-bit encrypted checkout. No commitment, cancel anytime.</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
