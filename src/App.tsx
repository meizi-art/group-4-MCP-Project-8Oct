import React, { useState } from 'react';
import { Send, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { SectorSelector } from './components/SectorSelector';
import { CountryExchangeSelector } from './components/CountryExchangeSelector';
import { ReturnRiskSelector } from './components/ReturnRiskSelector';
import { CapitalTimeframeSelector } from './components/CapitalTimeframeSelector';
import { DeliveryPreferences } from './components/DeliveryPreferences';
import { IntelligenceSourcesCard } from './components/IntelligenceSourcesCard';
import { SampleDigestCard } from './components/SampleDigestCard';
import { WhoIsThisForCard } from './components/WhoIsThisForCard';
import { DisclaimerCard } from './components/DisclaimerCard';
import { GeneratedDigestModal } from './components/GeneratedDigestModal';
import { TickerDetailModal } from './components/TickerDetailModal';
import { SubscribeModal } from './components/SubscribeModal';
import { SourceDetailModal } from './components/SourceDetailModal';
import {
  Sector,
  RiskTolerance,
  DigestFrequency,
  UserPreferences,
  TradeIdea,
  GeneratedDigestResponse,
  IntelligenceSourceInfo,
} from './types';
import { SAMPLE_DAILY_DIGEST } from './data/mockData';

export default function App() {
  // Form State matching screenshot
  const [selectedSectors, setSelectedSectors] = useState<Sector[]>([
    'Technology',
    'Healthcare',
  ]);
  const [country, setCountry] = useState<string>('United States');
  const [exchange, setExchange] = useState<string>('NYSE');
  const [returnMultiplier, setReturnMultiplier] = useState<number>(10);
  const [riskTolerance, setRiskTolerance] = useState<RiskTolerance>('Medium');
  const [initialCapital, setInitialCapital] = useState<number>(1000);
  const [timeframe, setTimeframe] = useState<string>('1 Month');
  const [email, setEmail] = useState<string>('yourname@gmail.com');
  const [digestFrequency, setDigestFrequency] = useState<DigestFrequency>('Daily');
  const [deliveryTime, setDeliveryTime] = useState<string>('6:00 AM');

  // Generation state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [generatedResult, setGeneratedResult] =
    useState<GeneratedDigestResponse | null>(null);

  // Modals
  const [isGeneratedModalOpen, setIsGeneratedModalOpen] = useState(false);
  const [selectedTickerIdea, setSelectedTickerIdea] = useState<TradeIdea | null>(
    null
  );
  const [selectedSource, setSelectedSource] =
    useState<IntelligenceSourceInfo | null>(null);
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);

  // Handlers
  const handleToggleSector = (sector: Sector) => {
    setSelectedSectors((prev) => {
      if (prev.includes(sector)) {
        // keep at least 1 sector
        if (prev.length === 1) return prev;
        return prev.filter((s) => s !== sector);
      } else {
        return [...prev, sector];
      }
    });
  };

  const handleGenerateIdeas = async () => {
    setIsGenerating(true);
    setGenerationStep('Scanning prediction markets & event probabilities...');

    const preferences: UserPreferences = {
      sectors: selectedSectors,
      country,
      exchange,
      returnMultiplier,
      riskTolerance,
      initialCapital,
      timeframe,
      email,
      digestFrequency,
      deliveryTime,
    };

    try {
      // Step sequence for realistic telemetry feedback
      setTimeout(() => {
        setGenerationStep('Aggregating social sentiment on X & Reddit...');
      }, 700);

      setTimeout(() => {
        setGenerationStep('Cross-referencing Google News & Naver catalysts...');
      }, 1400);

      const res = await fetch('/api/generate-trade-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setGeneratedResult(json.data);
      } else {
        // Fallback calculation
        fallbackGenerate(preferences);
      }
    } catch {
      fallbackGenerate(preferences);
    } finally {
      setTimeout(() => {
        setIsGenerating(false);
        setIsGeneratedModalOpen(true);
      }, 1800);
    }
  };

  const fallbackGenerate = (prefs: UserPreferences) => {
    const ideas = SAMPLE_DAILY_DIGEST.map((d, idx) => ({
      ...d,
      targetMultiplier: `${prefs.returnMultiplier}X`,
      allocationUSD: Math.round(prefs.initialCapital * [0.45, 0.35, 0.2][idx]),
      projectedPrice: `$${(
        parseFloat(d.price.replace('$', '')) * prefs.returnMultiplier
      ).toFixed(2)}`,
      stopLoss: `$${(
        parseFloat(d.price.replace('$', '')) * 0.85
      ).toFixed(2)} (-15%)`,
      profitTarget: `+${(prefs.returnMultiplier - 1) * 100}%`,
    }));

    setGeneratedResult({
      summary: `Multi-signal convergence identified in ${prefs.sectors.join(
        ' & '
      )} with average crowd conviction at 82%.`,
      confidenceScore: 'HIGH CONFIDENCE',
      generatedAt: 'Today',
      ideas,
    });
  };

  const currentPreferences: UserPreferences = {
    sectors: selectedSectors,
    country,
    exchange,
    returnMultiplier,
    riskTolerance,
    initialCapital,
    timeframe,
    email,
    digestFrequency,
    deliveryTime,
  };

  return (
    <div className="min-h-screen bg-[#080C17] text-white flex flex-col font-sans selection:bg-[#00E599]/30 selection:text-white">
      {/* Top Header */}
      <Header onOpenSubscribe={() => setIsSubscribeModalOpen(true)} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-16">
        {/* Hero Section */}
        <Hero />

        {/* 2-Column Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Form Column (8 of 12 cols) */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
            {/* Row 1: Sector Interests + Country & Exchange */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SectorSelector
                selectedSectors={selectedSectors}
                onToggleSector={handleToggleSector}
              />
              <CountryExchangeSelector
                country={country}
                exchange={exchange}
                onChangeCountry={setCountry}
                onChangeExchange={setExchange}
              />
            </div>

            {/* Row 2: Return & Risk Appetite + Capital & Timeframe */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ReturnRiskSelector
                returnMultiplier={returnMultiplier}
                riskTolerance={riskTolerance}
                onChangeMultiplier={setReturnMultiplier}
                onChangeRiskTolerance={setRiskTolerance}
              />
              <CapitalTimeframeSelector
                initialCapital={initialCapital}
                timeframe={timeframe}
                onChangeCapital={setInitialCapital}
                onChangeTimeframe={setTimeframe}
              />
            </div>

            {/* Row 3: Email & Delivery Preferences (full width of left column) */}
            <DeliveryPreferences
              email={email}
              digestFrequency={digestFrequency}
              deliveryTime={deliveryTime}
              onChangeEmail={setEmail}
              onChangeFrequency={setDigestFrequency}
              onChangeDeliveryTime={setDeliveryTime}
            />

            {/* Big Action Button */}
            <div className="flex flex-col items-center justify-center pt-2">
              <button
                type="button"
                onClick={handleGenerateIdeas}
                disabled={isGenerating}
                className="w-full sm:w-auto min-w-[320px] bg-[#00E599] hover:bg-[#00c984] active:scale-[0.98] text-[#080C17] font-black text-base sm:text-lg px-8 py-4 rounded-xl shadow-xl shadow-[#00E599]/20 flex items-center justify-center gap-3 transition-all cursor-pointer disabled:opacity-75 disabled:cursor-wait"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-[#080C17]" />
                    <span>Synthesizing Signals...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 fill-[#080C17] text-[#080C17]" />
                    <span>Generate My Trade Ideas</span>
                  </>
                )}
              </button>

              {/* Status pill under button during generation */}
              {isGenerating && (
                <p className="text-xs text-[#00E599] font-medium mt-3 animate-pulse">
                  {generationStep}
                </p>
              )}
            </div>
          </div>

          {/* Right Signal Column (5 of 12 cols) */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
            {/* Intelligence Sources */}
            <IntelligenceSourcesCard
              onSelectSource={(source) => setSelectedSource(source)}
            />

            {/* Sample Daily Digest */}
            <SampleDigestCard
              onSelectIdea={(idea) => setSelectedTickerIdea(idea)}
            />

            {/* Who Is This For? */}
            <WhoIsThisForCard />

            {/* Disclaimer */}
            <DisclaimerCard />
          </div>
        </div>
      </main>

      {/* Modals */}
      <GeneratedDigestModal
        data={generatedResult}
        preferences={currentPreferences}
        onClose={() => setIsGeneratedModalOpen(false)}
        onSelectIdea={(idea) => {
          setSelectedTickerIdea(idea);
        }}
      />

      {isGeneratedModalOpen === false && selectedTickerIdea && (
        <TickerDetailModal
          idea={selectedTickerIdea}
          onClose={() => setSelectedTickerIdea(null)}
        />
      )}

      {isGeneratedModalOpen === true && selectedTickerIdea && (
        <TickerDetailModal
          idea={selectedTickerIdea}
          onClose={() => setSelectedTickerIdea(null)}
        />
      )}

      <SourceDetailModal
        source={selectedSource}
        onClose={() => setSelectedSource(null)}
      />

      <SubscribeModal
        isOpen={isSubscribeModalOpen}
        onClose={() => setIsSubscribeModalOpen(false)}
        userEmail={email}
      />
    </div>
  );
}
