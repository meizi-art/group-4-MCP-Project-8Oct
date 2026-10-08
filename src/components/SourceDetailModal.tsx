import React from 'react';
import { X, ExternalLink, Activity } from 'lucide-react';
import { IntelligenceSourceInfo } from '../types';

interface SourceDetailModalProps {
  source: IntelligenceSourceInfo | null;
  onClose: () => void;
}

export const SourceDetailModal: React.FC<SourceDetailModalProps> = ({
  source,
  onClose,
}) => {
  if (!source) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
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

        <div className="flex items-center gap-2 mb-2">
          <Activity className="w-4 h-4 text-[#00E599]" />
          <span className="text-[#00E599] font-bold text-xs uppercase tracking-wider">
            Signal Architecture
          </span>
        </div>

        <h3 className="text-xl font-black text-white mb-1">{source.title}</h3>
        <p className="text-slate-400 text-xs sm:text-sm mb-4">
          {source.description}
        </p>

        <div className="bg-[#151D2F] border border-slate-800 rounded-xl p-4 mb-4">
          <span className="text-slate-400 text-xs block mb-1">Coverage &amp; Feeds</span>
          <span className="text-white font-semibold text-sm">{source.coverage}</span>
        </div>

        <h4 className="text-slate-300 text-xs font-bold uppercase tracking-wider mb-2">
          Recent Live Signals Ingested
        </h4>

        <div className="space-y-2 mb-6">
          {source.sampleSignals.map((sig, i) => (
            <div
              key={i}
              className="p-3 rounded-lg bg-[#141B2D] border border-slate-800 text-xs text-slate-300 flex items-start gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E599] mt-1.5 shrink-0" />
              <span>{sig}</span>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
        >
          Done
        </button>
      </div>
    </div>
  );
};
