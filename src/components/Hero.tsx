import React from 'react';

export const Hero: React.FC = () => {
  return (
    <div className="w-full text-center py-6 sm:py-8">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-wider text-white uppercase drop-shadow-sm">
        Dealhunter X
      </h1>
      <p className="text-slate-400 text-sm sm:text-base font-normal mt-2">
        Find tomorrow&apos;s ten-baggers, today.
      </p>
    </div>
  );
};
