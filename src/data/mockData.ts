import { Sector, TradeIdea, IntelligenceSourceInfo } from '../types';

export const ALL_SECTORS: Sector[] = [
  'Healthcare',
  'Technology',
  'Energy',
  'Finance',
  'Consumer Goods',
  'Real Estate',
  'Industrials',
  'Crypto'
];

export const COUNTRIES = [
  'United States',
  'United Kingdom',
  'Canada',
  'South Korea',
  'Japan',
  'Germany',
  'Global'
];

export const EXCHANGES: Record<string, string[]> = {
  'United States': ['NYSE', 'NASDAQ', 'AMEX', 'CBOE'],
  'United Kingdom': ['LSE', 'AIM'],
  'Canada': ['TSX', 'TSXV'],
  'South Korea': ['KRX', 'KOSDAQ'],
  'Japan': ['TSE'],
  'Germany': ['XETRA', 'FRA'],
  'Global': ['NYSE', 'NASDAQ', 'Crypto Exchanges']
};

export const TIMEFRAMES = [
  '1 Week',
  '2 Weeks',
  '1 Month',
  '3 Months',
  '6 Months',
  '1 Year'
];

export const DELIVERY_TIMES = [
  '5:00 AM',
  '6:00 AM',
  '7:00 AM',
  '8:00 AM',
  '9:00 AM (Pre-Market)',
  '4:30 PM (Post-Market)'
];

export const SAMPLE_DAILY_DIGEST: TradeIdea[] = [
  {
    ticker: 'NVDA',
    company: 'NVIDIA Corporation',
    exchange: 'NASDAQ',
    price: '$128.40',
    change: '+12.4%',
    targetMultiplier: '10X',
    confidence: 'HIGH CONFIDENCE',
    signalSummary: 'AI chip demand surge — social buzz up 340%, prediction market 78% bullish',
    predictionMarket: {
      market: 'Polymarket',
      question: 'Will Blackwell architecture revenue exceed $10B in Q1?',
      probability: '78%',
      volume: '$5.4M'
    },
    socialSentiment: {
      platform: 'X & Reddit',
      buzzScore: 95,
      sentiment: '88% Bullish',
      mentionVelocity: '+340% 7d'
    },
    newsCatalyst: {
      source: 'Google News / Bloomberg',
      headline: 'Hyperscalers expand 2025 AI compute capital allocation by 42%',
      time: '2 hours ago'
    },
    marketSignal: {
      metric: 'Unusual Options Call Volume',
      detail: 'Institutional block purchase of $140 call contracts expiring in 45 days',
      signalType: 'Bullish Flow'
    },
    thesis: 'Convergence of uncapped enterprise data center buildouts, custom silicon software lock-in (CUDA), and record hyperscaler capex guarantees multi-quarter margin expansion.'
  },
  {
    ticker: 'LLY',
    company: 'Eli Lilly and Company',
    exchange: 'NYSE',
    price: '$890.50',
    change: '+8.7%',
    targetMultiplier: '8X',
    confidence: 'HIGH CONFIDENCE',
    signalSummary: 'Weight-loss drug trial results trending on Google News, positive sentiment',
    predictionMarket: {
      market: 'Kalshi',
      question: 'Will oral GLP-1 orforglipron receive FDA priority breakthrough designation?',
      probability: '84%',
      volume: '$3.2M'
    },
    socialSentiment: {
      platform: 'Reddit & Health X',
      buzzScore: 89,
      sentiment: '86% Bullish',
      mentionVelocity: '+175% 7d'
    },
    newsCatalyst: {
      source: 'Google News / Naver Health',
      headline: 'Phase 3 trial demonstrates 24.2% average body weight loss with oral formulation',
      time: '3 hours ago'
    },
    marketSignal: {
      metric: 'Consensus Upward Revisions',
      detail: '19 institutional analysts raised 12-month price targets following clinical readout',
      signalType: 'Fundamental Momentum'
    },
    thesis: 'Next-generation oral metabolic therapies unlock massive outpatient market without cold-chain supply chain bottlenecks, doubling global addressable patient base.'
  },
  {
    ticker: 'PLTR',
    company: 'Palantir Technologies',
    exchange: 'NYSE',
    price: '$44.10',
    change: '+6.2%',
    targetMultiplier: '10X',
    confidence: 'HIGH CONFIDENCE',
    signalSummary: 'Government contract wins, social media mentions up 210% week-over-week',
    predictionMarket: {
      market: 'Polymarket',
      question: 'Palantir AIP US commercial customer count surpasses 800 in FY25?',
      probability: '72%',
      volume: '$2.8M'
    },
    socialSentiment: {
      platform: 'StockTwits & X',
      buzzScore: 91,
      sentiment: '83% Bullish',
      mentionVelocity: '+210% 7d'
    },
    newsCatalyst: {
      source: 'Reuters / Naver Tech',
      headline: 'US Department of Defense signs expanded 5-year enterprise data ontology contract',
      time: '4 hours ago'
    },
    marketSignal: {
      metric: 'Institutional Inflow & S&P 500 Weighting',
      detail: 'Sustained daily net institutional accumulation across passive index trackers',
      signalType: 'Structural Demand'
    },
    thesis: 'Artificial Intelligence Platform (AIP) bootcamps compress enterprise sales cycles from 9 months to 4 days, enabling unprecedented SaaS operating leverage.'
  }
];

export const INTELLIGENCE_SOURCES: IntelligenceSourceInfo[] = [
  {
    id: 'prediction-markets',
    title: 'Prediction Markets',
    description: 'Real-time crowd probability signals',
    iconType: 'prediction',
    color: '#06B6D4', // cyan
    coverage: 'Polymarket, Kalshi, Metaculus',
    sampleSignals: [
      'NVDA Blackwell Q1 delivery beat: 78% probability ($5.4M volume)',
      'LLY oral GLP-1 priority FDA approval: 84% probability ($3.2M volume)',
      'SpaceX Starship orbital cargo success rate: 89% probability'
    ]
  },
  {
    id: 'social-trends',
    title: 'Social Media Trends',
    description: 'Sentiment from social platforms',
    iconType: 'social',
    color: '#8B5CF6', // purple
    coverage: 'X (Twitter), Reddit r/wallstreetbets, StockTwits',
    sampleSignals: [
      'PLTR mention velocity spiked +210% week-over-week',
      'ASTS sentiment gauge: 89% net positive on Reddit r/spaceinvesting',
      'SUI crypto trending #1 on developer sentiment indices'
    ]
  },
  {
    id: 'news-naver',
    title: 'Google News & Naver',
    description: 'Trending topics & breaking news',
    iconType: 'news',
    color: '#EF4444', // coral/red
    coverage: 'Google News RSS, Naver Finance, Global Wire',
    sampleSignals: [
      'Eli Lilly weight-loss trial headline trending across 140+ news outlets',
      'Defense department project awards trending on Naver Business',
      'Clean energy nuclear baseload deals confirmed across tech majors'
    ]
  },
  {
    id: 'market-data',
    title: 'Financial Market Data',
    description: 'Live pricing & fundamental data',
    iconType: 'market',
    color: '#F59E0B', // amber
    coverage: 'SEC Form 4 filings, Option Pit flow, Dark Pool volume',
    sampleSignals: [
      'Unusual call option flow detected: $140 calls bought on NVDA',
      'Short float squeeze potential identified on high-momentum tickers',
      'S&P 500 institutional index rebalancing net buy triggers'
    ]
  }
];

export const WHO_IS_THIS_FOR_ITEMS = [
  'Retail investors looking for an edge',
  'Entrepreneurs managing side portfolios',
  'Beginners who want guided trade ideas',
  'Professional investors seeking crowd signals'
];
