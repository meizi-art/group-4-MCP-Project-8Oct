import React from 'react';
import { ChevronDown } from 'lucide-react';
import { DigestFrequency } from '../types';
import { DELIVERY_TIMES } from '../data/mockData';

interface DeliveryPreferencesProps {
  email: string;
  digestFrequency: DigestFrequency;
  deliveryTime: string;
  onChangeEmail: (email: string) => void;
  onChangeFrequency: (freq: DigestFrequency) => void;
  onChangeDeliveryTime: (time: string) => void;
}

export const DeliveryPreferences: React.FC<DeliveryPreferencesProps> = ({
  email,
  digestFrequency,
  deliveryTime,
  onChangeEmail,
  onChangeFrequency,
  onChangeDeliveryTime,
}) => {
  return (
    <div className="bg-[#111827] border border-slate-800/90 rounded-2xl p-5 sm:p-6 shadow-sm">
      <h2 className="text-[#00E599] font-bold text-sm tracking-wide mb-1">
        Email &amp; Delivery Preferences
      </h2>
      <p className="text-slate-400 text-xs mb-4">
        Configure how you receive your trade ideas
      </p>

      {/* Gmail Address */}
      <div className="mb-4">
        <label className="block text-slate-400 text-[11px] mb-1.5 font-medium">
          Gmail Address
        </label>
        <input
          type="email"
          placeholder="yourname@gmail.com"
          value={email}
          onChange={(e) => onChangeEmail(e.target.value)}
          className="w-full bg-[#162035] hover:bg-[#1a263f] border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#00E599] focus:border-[#00E599] transition-all"
        />
      </div>

      {/* Frequency & Preferred Delivery Time Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Digest Frequency */}
        <div>
          <label className="block text-slate-400 text-[11px] mb-1.5 font-medium">
            Digest Frequency
          </label>
          <div className="flex gap-2">
            {(['Daily', 'Weekly'] as DigestFrequency[]).map((freq) => {
              const isSelected = digestFrequency === freq;
              return (
                <button
                  key={freq}
                  type="button"
                  onClick={() => onChangeFrequency(freq)}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer select-none ${
                    isSelected
                      ? 'bg-[#18233C] text-white border border-slate-600 shadow-sm'
                      : 'bg-[#141B2D] text-slate-300 border border-slate-700/60 hover:border-slate-500 hover:text-white'
                  }`}
                >
                  <span
                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-white ring-2 ring-white/30'
                        : 'border-2 border-slate-400 bg-transparent'
                    }`}
                  >
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#111827]" />
                    )}
                  </span>
                  <span>{freq}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Preferred Delivery Time */}
        <div>
          <label className="block text-slate-400 text-[11px] mb-1.5 font-medium">
            Preferred Delivery Time
          </label>
          <div className="relative">
            <select
              value={deliveryTime}
              onChange={(e) => onChangeDeliveryTime(e.target.value)}
              className="w-full appearance-none bg-[#162035] hover:bg-[#1a263f] border border-slate-700/80 rounded-xl px-4 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-1 focus:ring-[#00E599] focus:border-[#00E599] transition-all cursor-pointer pr-10"
            >
              {DELIVERY_TIMES.map((t) => (
                <option key={t} value={t} className="bg-[#111827] text-white py-1">
                  {t}
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
