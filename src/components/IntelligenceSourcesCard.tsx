import React from 'react';
import { BarChart3, Users, Newspaper, LineChart } from 'lucide-react';
import { INTELLIGENCE_SOURCES } from '../data/mockData';
import { IntelligenceSourceInfo } from '../types';

interface IntelligenceSourcesCardProps {
  onSelectSource: (source: IntelligenceSourceInfo) => void;
}

export const IntelligenceSourcesCard: React.FC<IntelligenceSourcesCardProps> = ({
  onSelectSource,
}) => {
  const getSourceIcon = (iconType: string) => {
    switch (iconType) {
      case 'prediction':
        return <BarChart3 className="w-4 h-4 text-cyan-400" strokeWidth={2.2} />;
      case 'social':
        return <Users className="w-4 h-4 text-purple-400" strokeWidth={2.2} />;
      case 'news':
        return <Newspaper className="w-4 h-4 text-rose-400" strokeWidth={2.2} />;
      case 'market':
        return <LineChart className="w-4 h-4 text-amber-400" strokeWidth={2.2} />;
      default:
        return <BarChart3 className="w-4 h-4 text-cyan-400" />;
    }
  };

  const getBadgeBg = (iconType: string) => {
    switch (iconType) {
      case 'prediction':
        return 'bg-cyan-500/15 border border-cyan-500/30';
      case 'social':
        return 'bg-purple-500/15 border border-purple-500/30';
      case 'news':
        return 'bg-rose-500/15 border border-rose-500/30';
      case 'market':
        return 'bg-amber-500/15 border border-amber-500/30';
      default:
        return 'bg-cyan-500/15 border border-cyan-500/30';
    }
  };

  return (
    <div className="bg-[#111827] border border-slate-800/90 rounded-2xl p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold text-sm sm:text-base tracking-wide">
          Intelligence Sources
        </h3>
        <span className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider">
          Live Ingestion
        </span>
      </div>

      <div className="space-y-3">
        {INTELLIGENCE_SOURCES.map((source) => (
          <div
            key={source.id}
            onClick={() => onSelectSource(source)}
            className="group flex items-start gap-3.5 p-3 rounded-xl bg-[#151D2F]/70 hover:bg-[#18233C] border border-slate-800/80 hover:border-slate-700 transition-all cursor-pointer"
          >
            {/* Source Icon Badge */}
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-transform group-hover:scale-105 ${getBadgeBg(
                source.iconType
              )}`}
            >
              {getSourceIcon(source.iconType)}
            </div>

            {/* Source Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-white text-xs sm:text-sm font-semibold truncate group-hover:text-[#00E599] transition-colors">
                  {source.title}
                </h4>
                <span className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  Inspect &rarr;
                </span>
              </div>
              <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">
                {source.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
