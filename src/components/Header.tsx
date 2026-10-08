import React from 'react';
import { Zap } from 'lucide-react';

interface HeaderProps {
  onOpenSubscribe: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSubscribe }) => {
  return (
    <header className="w-full border-b border-slate-800/80 bg-[#080C17]/90 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-2 cursor-pointer group">
          <div className="text-[#00E599] transition-transform group-hover:scale-110">
            <Zap className="w-5 h-5 fill-[#00E599]/20 text-[#00E599]" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-black tracking-wider text-white">DHX</span>
        </div>

        {/* Right Info & CTA */}
        <div className="flex items-center gap-3 sm:gap-6">
          <span className="hidden md:inline-block text-slate-400 text-xs sm:text-sm font-normal">
            Powered by crowd wisdom &amp; public signals
          </span>
          <button
            onClick={onOpenSubscribe}
            className="bg-[#00E599] hover:bg-[#00c984] active:scale-[0.98] text-[#080C17] font-bold text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg transition-all shadow-md shadow-[#00E599]/15 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Subscribe — US$35/mo</span>
          </button>
        </div>
      </div>
    </header>
  );
};
