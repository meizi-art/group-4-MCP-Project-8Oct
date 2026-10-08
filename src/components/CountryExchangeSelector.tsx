import React from 'react';
import { FINANCIAL_VEHICLES, MARKET_EXCHANGES } from '../data/mockData';

interface CountryExchangeSelectorProps {
  country: string;
  exchange: string;
  selectedVehicles: string[];
  selectedExchanges: string[];
  onChangeCountry: (country: string) => void;
  onChangeExchange: (exchange: string) => void;
  onToggleVehicle: (vehicle: string) => void;
  onToggleExchange: (exchange: string) => void;
}

export const CountryExchangeSelector: React.FC<CountryExchangeSelectorProps> = ({
  selectedVehicles,
  selectedExchanges,
  onToggleVehicle,
  onToggleExchange,
}) => {
  return (
    <div className="bg-[#111827] border border-slate-800/90 rounded-2xl p-5 sm:p-6 shadow-sm">
      <h2 className="text-[#00E599] font-bold text-sm tracking-wide mb-1">
        Vehicles &amp; Market Exchanges
      </h2>
      <p className="text-slate-400 text-xs mb-3.5">
        Choose financial vehicles and target exchanges
      </p>

      {/* Financial Vehicles Multi-Select */}
      <div className="mb-4">
        <label className="block text-slate-400 text-[11px] mb-1.5 font-medium">
          Financial Vehicles (Multi-select)
        </label>
        <div className="flex flex-wrap gap-1.5">
          {FINANCIAL_VEHICLES.map((vehicle) => {
            const isSelected = selectedVehicles.includes(vehicle);
            return (
              <button
                key={vehicle}
                type="button"
                onClick={() => onToggleVehicle(vehicle)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-medium transition-all cursor-pointer select-none ${
                  isSelected
                    ? 'bg-[#18233C] text-white border border-slate-600 shadow-sm'
                    : 'bg-[#141B2D] text-slate-400 border border-slate-700/60 hover:border-slate-500 hover:text-white'
                }`}
              >
                <span
                  className={`w-2.5 h-2.5 rounded-full flex items-center justify-center transition-all ${
                    isSelected ? 'bg-white' : 'border border-slate-500 bg-transparent'
                  }`}
                />
                <span>{vehicle}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Country & Market Exchanges Multi-Select */}
      <div>
        <label className="block text-slate-400 text-[11px] mb-1.5 font-medium">
          Country &amp; Market Exchanges (Multi-select)
        </label>
        <div className="flex flex-wrap gap-1.5">
          {MARKET_EXCHANGES.map((ex) => {
            const isSelected = selectedExchanges.includes(ex);
            return (
              <button
                key={ex}
                type="button"
                onClick={() => onToggleExchange(ex)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-medium transition-all cursor-pointer select-none ${
                  isSelected
                    ? 'bg-[#18233C] text-white border border-slate-600 shadow-sm'
                    : 'bg-[#141B2D] text-slate-400 border border-slate-700/60 hover:border-slate-500 hover:text-white'
                }`}
              >
                <span
                  className={`w-2.5 h-2.5 rounded-full flex items-center justify-center transition-all ${
                    isSelected ? 'bg-white' : 'border border-slate-500 bg-transparent'
                  }`}
                />
                <span>{ex}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
