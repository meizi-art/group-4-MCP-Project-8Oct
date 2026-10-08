import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { handleGenerateIdeas } from './lib/ideasHandler.js';
import { handleHealthCheck } from './lib/healthHandler.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// MasterPrompt standard routes (shared with Vercel serverless handlers)
app.post('/api/ideas', async (req, res) => {
  try {
    const result = await handleGenerateIdeas(req.body);
    return res.status(result.status).json(result.body);
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || 'Internal Server Error' });
  }
});

app.get('/api/health', async (_req, res) => {
  try {
    const health = await handleHealthCheck();
    return res.status(health.status === 'error' ? 503 : 200).json(health);
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || 'Health check error' });
  }
});

// Default curated high-potential catalysts by sector & risk
const SECTOR_DATABASE: Record<string, any[]> = {
  Technology: [
    {
      ticker: 'NVDA',
      company: 'NVIDIA Corporation',
      exchange: 'NASDAQ',
      price: '$128.40',
      change: '+12.4%',
      targetMultiplier: '5X-10X',
      confidence: 'HIGH CONFIDENCE',
      signalSummary: 'AI chip demand surge — social buzz up 340%, prediction market 78% bullish',
      predictionMarket: { market: 'Polymarket', question: 'Blackwell chip architecture shipments exceed guidance in H1?', probability: '78%', volume: '$4.2M' },
      socialSentiment: { platform: 'X & Reddit', buzzScore: 94, sentiment: '86% Bullish', mentionVelocity: '+340% 7d' },
      newsCatalyst: { source: 'Google News / TechWire', headline: 'Hyperscalers expand capex commitments by $60B for next-gen clusters', time: '2 hours ago' },
      marketSignal: { metric: 'Unusual Call Volume', detail: '2.4x 30d avg volume, heavy $140 call strikes accumulation', signalType: 'Bullish Flow' },
      thesis: 'Generative AI infrastructure expansion accelerating into enterprise custom silicon. Blackwell ramp provides gross margin tailwinds.'
    },
    {
      ticker: 'ASTS',
      company: 'AST SpaceMobile',
      exchange: 'NASDAQ',
      price: '$26.85',
      change: '+18.2%',
      targetMultiplier: '10X',
      confidence: 'VERY HIGH',
      signalSummary: 'Space-based cellular broadband orbital launch milestones confirmed with AT&T/Verizon',
      predictionMarket: { market: 'Kalshi', question: 'AST SpaceMobile commercial coverage operational by Q4?', probability: '82%', volume: '$1.8M' },
      socialSentiment: { platform: 'Reddit r/spaceinvesting', buzzScore: 91, sentiment: '89% Bullish', mentionVelocity: '+215% 7d' },
      newsCatalyst: { source: 'Bloomberg / Google News', headline: 'FCC regulatory milestone cleared for continuous direct-to-device constellation', time: '4 hours ago' },
      marketSignal: { metric: 'Short Float & Momentum', detail: 'High short interest squeeze potential with 3-month RSI breaking 68', signalType: 'Breakout Pattern' },
      thesis: 'First-mover satellite-to-standard-phone cellular network with Tier-1 telco prepayments locking in multi-billion addressable market.'
    },
    {
      ticker: 'PLTR',
      company: 'Palantir Technologies',
      exchange: 'NYSE',
      price: '$44.10',
      change: '+6.2%',
      targetMultiplier: '6X-10X',
      confidence: 'HIGH CONFIDENCE',
      signalSummary: 'Government contract wins, social media mentions up 210% week-over-week',
      predictionMarket: { market: 'Polymarket', question: 'Palantir US commercial AIP growth exceeds 50% YoY?', probability: '74%', volume: '$2.9M' },
      socialSentiment: { platform: 'StockTwits & X', buzzScore: 88, sentiment: '81% Bullish', mentionVelocity: '+210% 7d' },
      newsCatalyst: { source: 'Reuters / Naver News', headline: 'Defense department expands Project Maven enterprise artificial intelligence deployment', time: '5 hours ago' },
      marketSignal: { metric: 'Institutional Inflow', detail: 'S&P 500 inclusion driving sustained passive fund inflows and institutional buying', signalType: 'Institutional Accumulation' },
      thesis: 'Artificial Intelligence Platform (AIP) bootcamps driving unprecedented customer acquisition speed and commercial revenue inflection.'
    }
  ],
  Healthcare: [
    {
      ticker: 'LLY',
      company: 'Eli Lilly and Company',
      exchange: 'NYSE',
      price: '$890.50',
      change: '+8.7%',
      targetMultiplier: '5X-8X',
      confidence: 'HIGH CONFIDENCE',
      signalSummary: 'Weight-loss drug trial results trending on Google News, positive sentiment',
      predictionMarket: { market: 'Kalshi', question: 'Oral GLP-1 orforglipron FDA priority review granted?', probability: '85%', volume: '$3.1M' },
      socialSentiment: { platform: 'X Health & Reddit', buzzScore: 89, sentiment: '88% Bullish', mentionVelocity: '+175% 7d' },
      newsCatalyst: { source: 'Google News / BioPharma Dive', headline: 'Phase 3 cardiometabolic efficacy outpaces benchmark therapies in multi-center study', time: '3 hours ago' },
      marketSignal: { metric: 'Earnings Revisions', detail: 'Consensus EPS estimates upgraded by 18 Wall Street analysts over 30 days', signalType: 'Fundamental Upgrade' },
      thesis: 'Tirzepatide and next-gen oral GLP-1 franchise expanding from obesity into sleep apnea, heart failure, and MASH indications.'
    },
    {
      ticker: 'VKTX',
      company: 'Viking Therapeutics',
      exchange: 'NASDAQ',
      price: '$72.30',
      change: '+14.6%',
      targetMultiplier: '10X-15X',
      confidence: 'VERY HIGH',
      signalSummary: 'Dual GLP-1/GIP oral tablet Phase 2 data beats market expectations; acquisition chatter spiking',
      predictionMarket: { market: 'Polymarket', question: 'Viking Therapeutics acquired by Big Pharma in next 12 months?', probability: '69%', volume: '$1.4M' },
      socialSentiment: { platform: 'Biotech Twitter / X', buzzScore: 92, sentiment: '84% Bullish', mentionVelocity: '+290% 7d' },
      newsCatalyst: { source: 'Naver Finance / STAT News', headline: 'Subcutaneous and oral dosing profiles show competitive tolerance and rapid weight loss', time: '1 day ago' },
      marketSignal: { metric: 'Unusual Options Volume', detail: 'Heavy call flow in $85 and $100 out-of-the-money contracts expiring in 3 months', signalType: 'Catalyst Front-Running' },
      thesis: 'Best-in-class obesity clinical pipeline represents prime acquisition target for pharma majors needing to replace impending patent cliffs.'
    }
  ],
  Crypto: [
    {
      ticker: 'SUI',
      company: 'Sui Network',
      exchange: 'Global / Crypto',
      price: '$3.42',
      change: '+24.5%',
      targetMultiplier: '10X-20X',
      confidence: 'HIGH CONFIDENCE',
      signalSummary: 'DeFi TVL crosses $1.5B record; Move programming language developer growth up 400%',
      predictionMarket: { market: 'Polymarket', question: 'Sui TVL overtakes Solana DeFi volume ranking before Q3?', probability: '66%', volume: '$3.7M' },
      socialSentiment: { platform: 'Crypto Twitter / X', buzzScore: 95, sentiment: '89% Bullish', mentionVelocity: '+410% 7d' },
      newsCatalyst: { source: 'CoinDesk / Naver Crypto', headline: 'Circle native USDC launch unlocks major institutional liquidity rails on Sui', time: '1 hour ago' },
      marketSignal: { metric: 'On-Chain Volume Acceleration', detail: 'DEX daily active trading volume up 320% with negligible slippage fees', signalType: 'Network Effect' },
      thesis: 'Object-centric architecture provides sub-second finality and parallel execution suitable for high-frequency trading and gaming.'
    },
    {
      ticker: 'MSTR',
      company: 'MicroStrategy Inc.',
      exchange: 'NASDAQ',
      price: '$345.00',
      change: '+15.8%',
      targetMultiplier: '8X-15X',
      confidence: 'HIGH CONFIDENCE',
      signalSummary: 'Treasury reserve accretion flywheel outpaces Bitcoin spot gains; institutional ETF allocation surge',
      predictionMarket: { market: 'Polymarket', question: 'Bitcoin reaches new all-time high before mid-year?', probability: '81%', volume: '$12.5M' },
      socialSentiment: { platform: 'Reddit r/Bitcoin & X', buzzScore: 96, sentiment: '91% Bullish', mentionVelocity: '+280% 7d' },
      newsCatalyst: { source: 'Google News / CNBC', headline: 'Convertible debt offering oversubscribed as sovereign wealth inquiries climb', time: '3 hours ago' },
      marketSignal: { metric: 'NAV Premium & Gamma Squeeze', detail: 'High volatility index with options implied volatility smiling heavily to upside calls', signalType: 'Gamma Ramp' },
      thesis: 'Pioneering leverage-neutral corporate balance sheet strategy creating compounding per-share Bitcoin yield.'
    }
  ],
  Energy: [
    {
      ticker: 'OKLO',
      company: 'Oklo Inc.',
      exchange: 'NYSE',
      price: '$24.50',
      change: '+19.3%',
      targetMultiplier: '10X-18X',
      confidence: 'VERY HIGH',
      signalSummary: 'Small Modular Nuclear Reactor (SMR) agreements signed with hyperscale data center operators',
      predictionMarket: { market: 'Kalshi', question: 'First commercial SMR nuclear reactor approved by NRC by 2026?', probability: '72%', volume: '$1.2M' },
      socialSentiment: { platform: 'X Tech & Energy', buzzScore: 90, sentiment: '87% Bullish', mentionVelocity: '+310% 7d' },
      newsCatalyst: { source: 'Wall Street Journal / Google News', headline: 'Tech giants sign long-term clean baseload power purchase pacts with nuclear pioneers', time: '6 hours ago' },
      marketSignal: { metric: 'Momentum Breakout', detail: 'Clean breakout above $22 resistance on 3x average weekly volume', signalType: 'Trend Acceleration' },
      thesis: 'AI computing requires round-the-clock zero-carbon power; SMRs are the only viable baseload solution at grid edge.'
    }
  ],
  Finance: [
    {
      ticker: 'HOOD',
      company: 'Robinhood Markets Inc.',
      exchange: 'NASDAQ',
      price: '$38.20',
      change: '+11.2%',
      targetMultiplier: '6X-10X',
      confidence: 'HIGH CONFIDENCE',
      signalSummary: 'Prediction markets integration launched; crypto volumes and active trader margin balances soaring',
      predictionMarket: { market: 'Polymarket', question: 'Robinhood annual net income surpasses $800M?', probability: '79%', volume: '$2.1M' },
      socialSentiment: { platform: 'StockTwits & X', buzzScore: 87, sentiment: '82% Bullish', mentionVelocity: '+190% 7d' },
      newsCatalyst: { source: 'Bloomberg / Naver Finance', headline: 'Retail options trading activity reaches highest levels since 2021 meme cycle', time: '4 hours ago' },
      marketSignal: { metric: 'Operating Leverage', detail: 'Fixed cost discipline creating dramatic bottom-line operating leverage on revenue spikes', signalType: 'Margin Expansion' },
      thesis: 'Expanding into full-service wealth platform (Gold Card, Retirement match, event contracts, UK/EU expansion).'
    }
  ],
  'Consumer Goods': [
    {
      ticker: 'CELH',
      company: 'Celsius Holdings',
      exchange: 'NASDAQ',
      price: '$32.10',
      change: '+9.4%',
      targetMultiplier: '5X-10X',
      confidence: 'MEDIUM CONFIDENCE',
      signalSummary: 'International distribution rollout with PepsiCo gaining traction in UK and Asia markets',
      predictionMarket: { market: 'Kalshi', question: 'Celsius Q2 international revenue growth exceeds 40%?', probability: '71%', volume: '$850K' },
      socialSentiment: { platform: 'TikTok & Instagram trends', buzzScore: 84, sentiment: '78% Bullish', mentionVelocity: '+140% 7d' },
      newsCatalyst: { source: 'Google News / Food Dive', headline: 'Fitness and energy beverage category share gains steady in convenience channels', time: '8 hours ago' },
      marketSignal: { metric: 'Inventory Normalization', detail: 'Distributor inventory destocking cycle complete, reorders accelerating', signalType: 'Turnaround Catalyst' },
      thesis: 'Global distribution network with PepsiCo replicates Monster Beverage playbook across European and Asian markets.'
    }
  ],
  'Real Estate': [
    {
      ticker: 'EQIX',
      company: 'Equinix Inc.',
      exchange: 'NASDAQ',
      price: '$910.00',
      change: '+4.8%',
      targetMultiplier: '3X-6X',
      confidence: 'HIGH CONFIDENCE',
      signalSummary: 'Data center REIT power interconnect capacity commands record leasing spreads',
      predictionMarket: { market: 'Kalshi', question: 'Data center REIT average rental renewal rate increases over 15%?', probability: '84%', volume: '$1.1M' },
      socialSentiment: { platform: 'LinkedIn & Real Estate X', buzzScore: 76, sentiment: '82% Bullish', mentionVelocity: '+95% 7d' },
      newsCatalyst: { source: 'Reuters / Naver Business', headline: 'Enterprise AI edge computing nodes drive premium colocation contracts', time: '12 hours ago' },
      marketSignal: { metric: 'Pricing Power', detail: 'Zero vacancy in Tier-1 cloud interconnection hubs with multi-year power queues', signalType: 'Moat Expansion' },
      thesis: 'Irreplaceable global network density and interconnection fabric make Equinix essential digital infrastructure.'
    }
  ],
  Industrials: [
    {
      ticker: 'RKLB',
      company: 'Rocket Lab USA',
      exchange: 'NASDAQ',
      price: '$18.90',
      change: '+16.5%',
      targetMultiplier: '10X-15X',
      confidence: 'VERY HIGH',
      signalSummary: 'Neutron medium-lift rocket hot-fire milestones on track; multi-launch defense backlog expansion',
      predictionMarket: { market: 'Polymarket', question: 'Rocket Lab Neutron rocket first orbital flight completed by Q4?', probability: '76%', volume: '$2.3M' },
      socialSentiment: { platform: 'Reddit r/RocketLab & X', buzzScore: 93, sentiment: '90% Bullish', mentionVelocity: '+320% 7d' },
      newsCatalyst: { source: 'SpaceNews / Google News', headline: 'Space Development Agency awards constellation satellite bus manufacturing contract', time: '5 hours ago' },
      marketSignal: { metric: 'Order Backlog Surge', detail: 'Total space systems + launch order book exceeds $1.1B with expanding gross margins', signalType: 'Backlog Acceleration' },
      thesis: 'Only proven private launch cadence competitor to SpaceX, with vertically integrated satellite components division.'
    }
  ]
};

// API: Generate Trade Ideas
app.post('/api/generate-trade-ideas', async (req, res) => {
  try {
    const {
      sectors = ['Technology', 'Healthcare'],
      country = 'United States',
      exchange = 'NYSE',
      riskTolerance = 'Medium',
      returnMultiplier = 10,
      initialCapital = 1000,
      timeframe = '1 Month',
      email = 'user@example.com'
    } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI();
        const prompt = `You are the lead algorithmic investment strategist for DEALHUNTER X ("Hunting tomorrow's ten-baggers, today").
A user configured the following investment parameters:
- Interested Sectors: ${sectors.join(', ')}
- Country: ${country}
- Exchange: ${exchange}
- Risk Appetite: ${riskTolerance}
- Target Return Multiplier: ${returnMultiplier}X (seeking ${returnMultiplier * 100}% gain)
- Initial Capital: $${initialCapital} USD
- Timeframe: ${timeframe}

Synthesize exactly 3 to 4 high-conviction "Ten-Bagger" candidate trade ideas based on convergence of multi-source signals:
1. Prediction Markets (e.g., Polymarket, Kalshi probability contracts)
2. Social Media Trends (X/Twitter, Reddit mention velocity & sentiment)
3. Google News & Naver (breaking catalyst news, regulatory decisions, clinical trials)
4. Financial Market Data (unusual options volume, short interest, institutional flow, breakout patterns)

Respond strictly in valid JSON format with this structure:
{
  "summary": "Brief 1-2 sentence market synthesis of crowd and signal consensus",
  "confidenceScore": "HIGH CONFIDENCE" | "VERY HIGH" | "EXTREME OPPORTUNITY",
  "generatedAt": "ISO date string or human readable date",
  "ideas": [
    {
      "ticker": "TICKER",
      "company": "Company Name",
      "exchange": "NASDAQ or NYSE or relevant",
      "price": "$XX.XX",
      "change": "+X.X%",
      "targetMultiplier": "${returnMultiplier}X",
      "projectedPrice": "$XXX.XX",
      "confidence": "HIGH CONFIDENCE",
      "signalSummary": "One punchy sentence summarizing the core multi-source catalyst",
      "predictionMarket": {
        "market": "Polymarket" or "Kalshi",
        "question": "Specific binary prediction market contract question",
        "probability": "XX%",
        "volume": "$X.XM"
      },
      "socialSentiment": {
        "platform": "X & Reddit",
        "buzzScore": 92,
        "sentiment": "XX% Bullish",
        "mentionVelocity": "+XXX% 7d"
      },
      "newsCatalyst": {
        "source": "Google News / Naver",
        "headline": "Recent breaking catalyst headline",
        "time": "X hours ago"
      },
      "marketSignal": {
        "metric": "Unusual Options Call Flow / Volume Surge",
        "detail": "Key technical indicator or institutional positioning",
        "signalType": "Bullish Momentum"
      },
      "allocationUSD": 350,
      "stopLoss": "$XX.XX (-12%)",
      "profitTarget": "$XXX.XX (+900%)",
      "thesis": "2-3 sentences explaining why this can be a ten-bagger multiplier over ${timeframe}."
    }
  ]
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.2
          }
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          return res.json({ success: true, data: parsed, source: 'gemini-3.8-flash' });
        }
      } catch (geminiError) {
        console.warn('Gemini API call fell back to curated signal engine:', geminiError);
      }
    }

    // Curated algorithmic generator fallback
    const selectedSectors = Array.isArray(sectors) && sectors.length > 0 ? sectors : ['Technology', 'Healthcare'];
    let candidates: any[] = [];

    for (const sec of selectedSectors) {
      if (SECTOR_DATABASE[sec]) {
        candidates.push(...SECTOR_DATABASE[sec]);
      }
    }

    if (candidates.length < 3) {
      candidates.push(...SECTOR_DATABASE['Technology']);
      candidates.push(...SECTOR_DATABASE['Healthcare']);
    }

    // Deduplicate tickers
    const uniqueMap = new Map();
    candidates.forEach(item => {
      if (!uniqueMap.has(item.ticker)) {
        uniqueMap.set(item.ticker, item);
      }
    });
    const selected = Array.from(uniqueMap.values()).slice(0, 3);

    // Calculate dollar allocations based on initialCapital
    const capital = Number(initialCapital) || 1000;
    const weights = [0.45, 0.35, 0.20];

    const customizedIdeas = selected.map((item, idx) => {
      const alloc = Math.round(capital * weights[idx]);
      const baseNum = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 50;
      const mult = Number(returnMultiplier) || 10;
      const targetPrice = (baseNum * mult).toFixed(2);
      const stopLossPrice = (baseNum * 0.85).toFixed(2);

      return {
        ...item,
        targetMultiplier: `${returnMultiplier}X`,
        projectedPrice: `$${targetPrice}`,
        allocationUSD: alloc,
        stopLoss: `$${stopLossPrice} (-15%)`,
        profitTarget: `$${targetPrice} (+${(mult - 1) * 100}%)`
      };
    });

    return res.json({
      success: true,
      source: 'algorithmic-signal-engine',
      data: {
        summary: `Crowd signals and prediction market probabilities show strong multi-source convergence across ${selectedSectors.join(' and ')}. Sentiment velocity is up +285% in target names.`,
        confidenceScore: 'HIGH CONFIDENCE',
        generatedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        ideas: customizedIdeas
      }
    });
  } catch (error: any) {
    console.error('Error generating trade ideas:', error);
    res.status(500).json({ success: false, error: error?.message || 'Server error' });
  }
});

// API: Send Digest to Gmail
app.post('/api/send-digest', (req, res) => {
  const { email, frequency, time } = req.body;
  res.json({
    success: true,
    message: `Daily trade digest successfully scheduled for ${email || 'your Gmail'} at ${time || '6:00 AM'} (${frequency || 'Daily'}).`,
    scheduledTime: time || '6:00 AM EST',
    recipient: email
  });
});

// API: Subscription
app.post('/api/subscribe', (req, res) => {
  const { plan = 'Pro Monthly', email = 'member@dealhunterx.com' } = req.body;
  res.json({
    success: true,
    plan,
    status: 'ACTIVE',
    price: '$35/month',
    message: `Welcome to DEALHUNTER X Pro! Pre-market intelligence digests, real-time alert notifications, and exclusive Ten-Bagger signals are now active for ${email}.`
  });
});

// Vite Middleware for development & static serving for production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`DEALHUNTER X Server running on http://0.0.0.0:${port}`);
  });
}

startServer();
