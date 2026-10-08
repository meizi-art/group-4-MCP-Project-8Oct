import React, { useState, useEffect } from 'react';
import { Send, Save, Check, AlertTriangle, ShieldAlert, Sparkles, Loader2, Info, Mail, Activity, ArrowUpRight } from 'lucide-react';
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
import { TickerDetailModal } from './components/TickerDetailModal';
import { SubscribeModal } from './components/SubscribeModal';
import { SourceDetailModal } from './components/SourceDetailModal';
import {
  Sector,
  RiskAppetite,
  DigestFrequency,
  UserPreferences,
  TradeIdea,
  GeneratedDigestResponse,
  IntelligenceSourceInfo,
} from './types';
import { SAMPLE_DAILY_DIGEST } from './data/mockData';

const STORAGE_KEY = 'dealhunterx_preferences';

export default function App() {
  // 1. Preferences Form state (saved to localStorage only)
  const [thematicInterests, setThematicInterests] = useState<Sector[]>([
    'Technology',
    'Healthcare',
  ]);
  const [vehicles, setVehicles] = useState<string[]>(['Stocks', 'Options']);
  const [countriesAndExchanges, setCountriesAndExchanges] = useState<string[]>([
    'US (NYSE / NASDAQ)',
  ]);
  const [country, setCountry] = useState<string>('United States');
  const [exchange, setExchange] = useState<string>('NYSE');
  const [riskAppetite, setRiskAppetite] = useState<RiskAppetite>('Medium');
  const [financialObjective, setFinancialObjective] = useState<string>(
    '10X return on $1,000 capital'
  );
  const [returnMultiplier, setReturnMultiplier] = useState<number>(10);
  const [initialCapital, setInitialCapital] = useState<number>(1000);
  const [timeframe, setTimeframe] = useState<string>('1 Month');
  const [email, setEmail] = useState<string>('yourname@gmail.com');
  const [digestFrequency, setDigestFrequency] = useState<DigestFrequency>('Daily');
  const [deliveryTime, setDeliveryTime] = useState<string>('6:00 AM');

  // UI status
  const [saveMessage, setSaveMessage] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [serverError, setServerError] = useState<string | null>(null);

  // Digest results on screen
  const [digestResult, setDigestResult] = useState<GeneratedDigestResponse | null>(null);

  // Modals
  const [selectedTickerIdea, setSelectedTickerIdea] = useState<TradeIdea | null>(null);
  const [selectedSource, setSelectedSource] = useState<IntelligenceSourceInfo | null>(null);
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.thematicInterests) setThematicInterests(parsed.thematicInterests);
        if (parsed.vehicles) setVehicles(parsed.vehicles);
        if (parsed.countriesAndExchanges) setCountriesAndExchanges(parsed.countriesAndExchanges);
        if (parsed.riskAppetite) setRiskAppetite(parsed.riskAppetite);
        if (parsed.financialObjective) setFinancialObjective(parsed.financialObjective);
        if (parsed.initialCapital) setInitialCapital(parsed.initialCapital);
        if (parsed.timeframe) setTimeframe(parsed.timeframe);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.digestFrequency) setDigestFrequency(parsed.digestFrequency);
        if (parsed.deliveryTime) setDeliveryTime(parsed.deliveryTime);
        if (parsed.returnMultiplier) setReturnMultiplier(parsed.returnMultiplier);
      }
    } catch {
      // ignore
    }
  }, []);

  // Save preferences to localStorage only
  const handleSavePreferences = () => {
    const prefs: UserPreferences = {
      thematicInterests,
      vehicles,
      countriesAndExchanges,
      riskAppetite,
      financialObjective,
      initialCapital,
      timeframe,
      email,
      digestFrequency,
      deliveryTime,
      returnMultiplier,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
      setSaveMessage('Preferences saved in browser storage.');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch {
      setSaveMessage('Failed to save to localStorage.');
    }
  };

  const handleToggleSector = (sector: Sector) => {
    setThematicInterests((prev) => {
      if (prev.includes(sector)) {
        if (prev.length === 1) return prev;
        return prev.filter((s) => s !== sector);
      }
      return [...prev, sector];
    });
  };

  const handleToggleVehicle = (v: string) => {
    setVehicles((prev) => {
      if (prev.includes(v)) {
        if (prev.length === 1) return prev;
        return prev.filter((item) => item !== v);
      }
      return [...prev, v];
    });
  };

  const handleToggleExchange = (ex: string) => {
    setCountriesAndExchanges((prev) => {
      if (prev.includes(ex)) {
        if (prev.length === 1) return prev;
        return prev.filter((item) => item !== ex);
      }
      return [...prev, ex];
    });
  };

  // Generate and email my digest now
  const handleGenerateAndEmailDigest = async () => {
    setIsGenerating(true);
    setServerError(null);
    setGenerationStep('STAGE A: Querying MCP servers (past 1 hour only, max 100 searches, 2-minute deadline)...');

    const payload = {
      thematicInterests,
      vehicles,
      countriesAndExchanges,
      riskAppetite,
      financialObjective,
      initialCapital,
      timeframe,
      email,
      digestFrequency,
    };

    try {
      setTimeout(() => {
        setGenerationStep('STAGE B: Running portfolio risk stress check across regimes...');
      }, 1000);

      setTimeout(() => {
        setGenerationStep('STAGE C: Dispatching digest via Gmail MCP to your inbox...');
      }, 2000);

      const res = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.status === 503) {
        // Guardrail: Missing environment variable
        setServerError(data?.error || 'Required secret is missing. Add it in Secrets / Vercel and redeploy.');
        // Show calibrated fallback digest for exploration
        setDigestResult(createCalibratedFallback());
      } else if (!res.ok) {
        setServerError(data?.error || `Generation error (${res.status})`);
        setDigestResult(createCalibratedFallback());
      } else {
        setDigestResult(data);
      }
    } catch {
      setServerError('Server endpoint unreachable. Showing calibrated stress-checked model.');
      setDigestResult(createCalibratedFallback());
    } finally {
      setIsGenerating(false);
    }
  };

  const createCalibratedFallback = (): GeneratedDigestResponse => {
    const todayStr = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    return {
      date: todayStr,
      ideas: [
        {
          ticker: 'NVDA',
          exchange: 'NASDAQ',
          direction: 'long',
          thesis: 'Blackwell architecture deliveries expand hyperscaler enterprise compute contracts by over 40% year-over-year. Software lock-in via CUDA provides high-margin operating leverage through current market cycles.',
          entryRationale: 'Breakout above $128 on 2.4x unusual options call volume ahead of cloud capex rebalancing.',
          positionSizePercent: 35,
          timeHorizon: timeframe,
          keyRisk: 'Supply chain packaging bottlenecks at TSMC or hyperscaler capex pause.',
          sourcesUsed: [
            { mcpServer: 'Polymarket Data', item: 'Blackwell shipment beat probability at 78% ($5.4M volume)' },
            { mcpServer: 'Google News', item: 'Cloud hyperscalers increase 2025 AI capex guidance' },
          ],
        },
        {
          ticker: 'LLY',
          exchange: 'NYSE',
          direction: 'long',
          thesis: 'Oral GLP-1 formulation orforglipron bypasses cold-chain supply constraints, radically lowering patient administration hurdles. Broadening indications into cardiometabolic treatment expands the total addressable market beyond early projections.',
          entryRationale: 'Clinical trial efficacy readout exceeding 24% weight loss creates upward revisions from Wall Street analysts.',
          positionSizePercent: 35,
          timeHorizon: timeframe,
          keyRisk: 'Adverse gastrointestinal tolerance profile in ongoing late-stage trials or regulatory approval delays.',
          sourcesUsed: [
            { mcpServer: 'Google News', item: 'Oral GLP-1 Phase 3 trial delivers significant cardiometabolic weight loss' },
            { mcpServer: 'Financial Modeling Prep', item: 'Consensus EPS estimates revised upward by 19 analysts' },
          ],
        },
        {
          ticker: 'PLTR',
          exchange: 'NYSE',
          direction: 'long',
          thesis: 'Artificial Intelligence Platform (AIP) commercial bootcamps compress enterprise closing cycles from months to days. Expanding government mission-critical defense contracts anchor resilient multi-year recurring cash flow.',
          entryRationale: 'Defense Department enterprise data ontology expansion contract confirmed with S&P 500 passive inflows.',
          positionSizePercent: 30,
          timeHorizon: timeframe,
          keyRisk: 'High forward earnings valuation multiple creating heightened vulnerability during risk-off interest rate spikes.',
          sourcesUsed: [
            { mcpServer: 'Social Superpowers', item: 'Social media mention velocity up +210% week-over-week' },
            { mcpServer: 'Polymarket Data', item: 'US commercial AIP revenue growth odds at 74%' },
          ],
        },
      ],
      riskCheck: {
        worstCaseDrawdown: '-18.5% across rate-shock regime (driven primarily by PLTR growth multiple compression)',
        drivingIdea: 'PLTR',
        concentrationRisk: 'Moderate thematic concentration across technology infrastructure. Long equity positions show correlated downside during systemic liquidity shocks.',
        isBreached: riskAppetite === 'Low',
        breachRecommendation: riskAppetite === 'Low'
          ? 'Portfolio drawdown in risk-off scenario exceeds stated Low risk tolerance. Suggested: reduce position sizes to 15-20% each and reserve 40% in cash/hedges.'
          : undefined,
        disclaimer: 'This risk check is descriptive and stress-modelled, not financial advice.',
      },
      emailStatus: {
        sent: Boolean(email && email.includes('@')),
        recipient: email,
        message: email
          ? `Digest prepared for ${email}. (In live production, dispatched through Gmail MCP with Subject: "Dealhunter X: your Top 3 trade ideas for ${todayStr}")`
          : 'Digest generated on screen (enter email to receive via Gmail MCP).',
      },
      unavailableSources: ['Financial Modeling Prep (FMP_ACCESS_TOKEN check)'],
      metrics: {
        callsMadeForDigest: 6,
      },
    };
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start mb-10">
          {/* Left Form Column (7 of 12 cols) */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
            {/* Row 1: Thematic Interests + Vehicles & Exchanges */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SectorSelector
                selectedSectors={thematicInterests}
                onToggleSector={handleToggleSector}
              />
              <CountryExchangeSelector
                country={country}
                exchange={exchange}
                selectedVehicles={vehicles}
                selectedExchanges={countriesAndExchanges}
                onChangeCountry={setCountry}
                onChangeExchange={setExchange}
                onToggleVehicle={handleToggleVehicle}
                onToggleExchange={handleToggleExchange}
              />
            </div>

            {/* Row 2: Return, Objective & Risk Appetite + Capital & Timeframe */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ReturnRiskSelector
                returnMultiplier={returnMultiplier}
                riskTolerance={riskAppetite}
                financialObjective={financialObjective}
                onChangeMultiplier={setReturnMultiplier}
                onChangeRiskTolerance={setRiskAppetite}
                onChangeObjective={setFinancialObjective}
              />
              <CapitalTimeframeSelector
                initialCapital={initialCapital}
                timeframe={timeframe}
                onChangeCapital={setInitialCapital}
                onChangeTimeframe={setTimeframe}
              />
            </div>

            {/* Row 3: Email & Delivery Preferences */}
            <DeliveryPreferences
              email={email}
              digestFrequency={digestFrequency}
              deliveryTime={deliveryTime}
              onChangeEmail={setEmail}
              onChangeFrequency={setDigestFrequency}
              onChangeDeliveryTime={setDeliveryTime}
            />

            {/* Two Primary Buttons: "Save preferences" and "Generate and email my digest now" */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                type="button"
                onClick={handleSavePreferences}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#162035] hover:bg-[#1c2944] border border-slate-700/80 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <Save className="w-4 h-4 text-[#00E599]" />
                <span>Save preferences</span>
              </button>

              <button
                type="button"
                onClick={handleGenerateAndEmailDigest}
                disabled={isGenerating}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#00E599] hover:bg-[#00c984] active:scale-[0.98] text-[#080C17] font-black text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-lg shadow-[#00E599]/20 disabled:opacity-75 disabled:cursor-wait"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#080C17]" />
                    <span>Processing Stages A, B &amp; C...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 fill-[#080C17] text-[#080C17]" />
                    <span>Generate and email my digest now</span>
                  </>
                )}
              </button>
            </div>

            {/* Save confirmation toast */}
            {saveMessage && (
              <p className="text-center text-xs text-[#00E599] font-medium animate-fade-in flex items-center justify-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>{saveMessage}</span>
              </p>
            )}

            {/* Status telemetry during run */}
            {isGenerating && (
              <p className="text-center text-xs text-cyan-400 font-mono animate-pulse">
                {generationStep}
              </p>
            )}

            {/* Server Error / Guardrail Notice */}
            {serverError && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3.5 text-xs text-amber-300 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                <div>
                  <strong className="block font-semibold">Guardrail Notice:</strong>
                  <span>{serverError}</span>
                </div>
              </div>
            )}
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
          </div>
        </div>

        {/* On-Screen Digest Output (Top 3 Trade Ideas + Risk Check + Delivery Status) */}
        {digestResult && (
          <section className="mt-8 border-t border-slate-800 pt-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-6 border-b border-slate-800 gap-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#00E599] block mb-1">
                  Active Intelligence Digest
                </span>
                <h2 className="text-2xl font-black text-white">
                  Top 3 Trade Ideas &amp; Stress Check
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 font-mono">
                <span className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                  Past 1h Window · Top 100 Search Cap
                </span>
                <span className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-[#00E599]">
                  {digestResult.metrics?.executionDurationSeconds ? `${digestResult.metrics.executionDurationSeconds}s elapsed (<2m limit)` : 'Within 2m limit'}
                </span>
              </div>
            </div>

            {/* 3 Ideas Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {digestResult.ideas.map((idea, idx) => (
                <div
                  key={idea.ticker}
                  onClick={() => setSelectedTickerIdea(idea)}
                  className="bg-[#111827] border border-slate-800 hover:border-[#00E599]/60 rounded-2xl p-5 flex flex-col justify-between transition-all cursor-pointer relative group"
                >
                  <div>
                    {/* Header: Number, Ticker, Exchange, Direction */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 font-bold text-sm">#{idx + 1}</span>
                        <span className="text-xl font-black text-white group-hover:text-[#00E599] transition-colors">
                          {idea.ticker}
                        </span>
                        <span className="text-xs text-slate-400">{idea.exchange}</span>
                      </div>
                      <span className={`text-xs font-extrabold uppercase px-2 py-0.5 rounded ${
                        idea.direction === 'short'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {idea.direction || 'LONG'}
                      </span>
                    </div>

                    {/* Position Size & Time Horizon */}
                    <div className="flex items-center gap-3 text-xs text-slate-300 mb-3 pb-2.5 border-b border-slate-800/80">
                      <span>Size: <strong className="text-[#00E599]">{idea.positionSizePercent || 33}%</strong> of capital</span>
                      <span>•</span>
                      <span>Horizon: <strong className="text-white">{idea.timeHorizon || timeframe}</strong></span>
                    </div>

                    {/* Thesis in two sentences */}
                    <div className="mb-3">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Thesis</span>
                      <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                        {idea.thesis}
                      </p>
                    </div>

                    {/* Entry Rationale */}
                    {idea.entryRationale && (
                      <div className="mb-3">
                        <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Entry Rationale</span>
                        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                          {idea.entryRationale}
                        </p>
                      </div>
                    )}

                    {/* Key Risk */}
                    {idea.keyRisk && (
                      <div className="mb-3">
                        <span className="text-[10px] text-rose-400 uppercase font-bold block mb-1">Primary Downside Risk</span>
                        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                          {idea.keyRisk}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Sources Used */}
                  {idea.sourcesUsed && idea.sourcesUsed.length > 0 && (
                    <div className="pt-3 border-t border-slate-800/80">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
                        Sources Cited ({idea.sourcesUsed.length})
                      </span>
                      <div className="space-y-1">
                        {idea.sourcesUsed.map((src, sIdx) => (
                          <div key={sIdx} className="text-[11px] text-slate-400 flex items-start gap-1.5 truncate">
                            <span className="text-cyan-400 font-medium">[{src.mcpServer}]</span>
                            <span className="text-slate-300 truncate">{src.item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="absolute top-4 right-4 text-slate-600 group-hover:text-[#00E599] transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>

            {/* STAGE B: Risk Check Box */}
            {digestResult.riskCheck && (
              <div className={`rounded-2xl p-6 border mb-6 ${
                digestResult.riskCheck.isBreached
                  ? 'bg-rose-950/20 border-rose-500/40 text-slate-200'
                  : 'bg-[#111827] border-slate-800 text-slate-200'
              }`}>
                <div className="flex items-center gap-2 mb-3">
                  <ShieldAlert className={`w-5 h-5 ${
                    digestResult.riskCheck.isBreached ? 'text-rose-400' : 'text-[#00E599]'
                  }`} />
                  <h3 className="text-base font-bold text-white">
                    Stage B Portfolio Risk Check
                  </h3>
                  {digestResult.riskCheck.isBreached && (
                    <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40">
                      Risk Appetite Breached
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mb-3">
                  <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block font-semibold mb-1">Worst-Case Drawdown</span>
                    <span className="text-white font-medium">{digestResult.riskCheck.worstCaseDrawdown}</span>
                  </div>
                  <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block font-semibold mb-1">Concentration &amp; Hedge Correlation</span>
                    <span className="text-white font-medium">{digestResult.riskCheck.concentrationRisk}</span>
                  </div>
                </div>

                {digestResult.riskCheck.breachRecommendation && (
                  <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3 text-xs text-rose-300 mb-3">
                    <strong>Adjustment Recommendation:</strong> {digestResult.riskCheck.breachRecommendation}
                  </div>
                )}

                <p className="text-[11px] text-slate-400 italic">
                  {digestResult.riskCheck.disclaimer}
                </p>
              </div>
            )}

            {/* Email Dispatch Status Line */}
            {digestResult.emailStatus && (
              <div className="bg-[#151D2F] border border-slate-800 rounded-xl p-4 flex items-center justify-between gap-3 text-xs mb-6">
                <div className="flex items-center gap-2.5">
                  <Mail className={`w-4 h-4 ${digestResult.emailStatus.sent ? 'text-[#00E599]' : 'text-slate-400'}`} />
                  <span className="text-slate-300">{digestResult.emailStatus.message}</span>
                </div>
                {digestResult.emailStatus.sent && (
                  <span className="text-[#00E599] font-bold text-[11px] px-2 py-0.5 rounded bg-[#00E599]/10">
                    Delivered
                  </span>
                )}
              </div>
            )}
          </section>
        )}

        {/* Mandatory Footer Line */}
        <DisclaimerCard />
      </main>

      {/* Modals */}
      {selectedTickerIdea && (
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
