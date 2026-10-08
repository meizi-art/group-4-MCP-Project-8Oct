export type Sector = 
  | 'Healthcare'
  | 'Technology'
  | 'Energy'
  | 'Finance'
  | 'Consumer Goods'
  | 'Real Estate'
  | 'Industrials'
  | 'Crypto';

export type RiskTolerance = 'Low' | 'Medium' | 'High';

export type DigestFrequency = 'Daily' | 'Weekly';

export interface UserPreferences {
  sectors: Sector[];
  country: string;
  exchange: string;
  returnMultiplier: number;
  riskTolerance: RiskTolerance;
  initialCapital: number;
  timeframe: string;
  email: string;
  digestFrequency: DigestFrequency;
  deliveryTime: string;
}

export interface PredictionMarketSignal {
  market: string;
  question: string;
  probability: string;
  volume: string;
}

export interface SocialSentimentSignal {
  platform: string;
  buzzScore: number;
  sentiment: string;
  mentionVelocity: string;
}

export interface NewsCatalystSignal {
  source: string;
  headline: string;
  time: string;
}

export interface MarketDataSignal {
  metric: string;
  detail: string;
  signalType: string;
}

export interface TradeIdea {
  ticker: string;
  company: string;
  exchange: string;
  price: string;
  change: string;
  targetMultiplier: string;
  projectedPrice?: string;
  confidence: string;
  signalSummary: string;
  predictionMarket: PredictionMarketSignal;
  socialSentiment: SocialSentimentSignal;
  newsCatalyst: NewsCatalystSignal;
  marketSignal: MarketDataSignal;
  allocationUSD?: number;
  stopLoss?: string;
  profitTarget?: string;
  thesis: string;
}

export interface GeneratedDigestResponse {
  summary: string;
  confidenceScore: string;
  generatedAt: string;
  ideas: TradeIdea[];
}

export interface IntelligenceSourceInfo {
  id: string;
  title: string;
  description: string;
  iconType: 'prediction' | 'social' | 'news' | 'market';
  color: string;
  coverage: string;
  sampleSignals: string[];
}
