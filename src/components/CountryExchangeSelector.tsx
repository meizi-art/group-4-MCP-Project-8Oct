import React from 'react';
import { ChevronDown } from 'lucide-react';
import { COUNTRIES, EXCHANGES } from '../data/mockData';

interface CountryExchangeSelectorProps {
  country: string;
  exchange: string;
  onChangeCountry: (country: string) => void;
  onChangeExchange: (exchange: string) => void;
}

export const CountryExchangeSelector: React.FC<CountryExchangeSelectorProps> = ({
  country,
  exchange,
  onChangeCountry,
  onChangeExchange,
}) => {
  const currentExchanges = EXCHANGES[country] || ['NYSE', 'NASDAQ'];

  return (
    <div className="bg-[#111827] border border-slate-800/90 rounded-2xl p-5 sm:p-6 shadow-sm">
      <h2 className="text-[#00E599] font-bold text-sm tracking-wide mb-1">
        Country &amp; Exchange
      </h2>
      <p className="text-slate-400 text-xs mb-4">
        Choose your preferred markets
      </p>

      <div className="space-y-4">
        {/* Country Selector */}
        <div>
          <label className="block text-slate-400 text-[11px] mb-1.5 font-medium">
            Country
          </label>
          <div className="relative">
            <select
              value={country}
              onChange={(e) => {
                const newCountry = e.target.value;
                onChangeCountry(newCountry);
                const nextExchanges = EXCHANGES[newCountry] || ['NYSE'];
                if (!nextExchanges.includes(exchange)) {
                  onChangeExchange(nextExchanges[0]);
                }
              }}
              className="w-full appearance-none bg-[#162035] hover:bg-[#1a263f] border border-slate-700/80 rounded-xl px-4 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-1 focus:ring-[#00E599] focus:border-[#00E599] transition-all cursor-pointer pr-10"
            >
              {COUNTRIES.map((c) => (
                <option key={c} value={c} className="bg-[#111827] text-white py-1">
                  {c}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Market / Exchange Selector */}
        <div>
          <label className="block text-slate-400 text-[11px] mb-1.5 font-medium">
            Market Exchange
          </label>
          <div className="relative">
            <select
              value={exchange}
              onChange={(e) => onChangeExchange(e.target.value)}
              className="w-full appearance-none bg-[#162035] hover:bg-[#1a263f] border border-slate-700/80 rounded-xl px-4 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-1 focus:ring-[#00E599] focus:border-[#00E599] transition-all cursor-pointer pr-10"
            >
              {currentExchanges.map((ex) => (
                <option key={ex} value={ex} className="bg-[#111827] text-white py-1">
                  {ex}
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
