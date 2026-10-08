export type Sector = 
  | 'Healthcare'
  | 'Technology'
  | 'Energy'
  | 'Financials'
  | 'Consumer Goods'
  | 'Real Estate'
  | 'Industrials'
  | 'Crypto';

export type RiskAppetite = 'Low' | 'Medium' | 'High' | 'Extremely High';
export type RiskTolerance = RiskAppetite;

export type DigestFrequency = 'Daily' | 'Weekly';

export interface UserPreferences {
  thematicInterests: Sector[];
  vehicles: string[];
  countriesAndExchanges: string[];
  riskAppetite: RiskAppetite;
  financialObjective: string;
  initialCapital: number;
  timeframe: string;
  email: string;
  digestFrequency: DigestFrequency;
  deliveryTime: string;
  // Backward compatibility aliases
  sectors?: Sector[];
  country?: string;
  exchange?: string;
  returnMultiplier?: number;
  riskTolerance?: RiskTolerance;
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

export interface TradeIdeaSource {
  mcpServer: string;
  item: string;
}

export interface TradeIdea {
  ticker: string;
  exchange: string;
  direction?: 'long' | 'short';
  company?: string;
  price?: string;
  change?: string;
  targetMultiplier?: string;
  projectedPrice?: string;
  confidence?: string;
  signalSummary?: string;
  thesis: string;
  entryRationale?: string;
  positionSizePercent?: number;
  timeHorizon?: string;
  keyRisk?: string;
  sourcesUsed?: TradeIdeaSource[];
  predictionMarket?: PredictionMarketSignal;
  socialSentiment?: SocialSentimentSignal;
  newsCatalyst?: NewsCatalystSignal;
  marketSignal?: MarketDataSignal;
  allocationUSD?: number;
  stopLoss?: string;
  profitTarget?: string;
}

export interface RiskCheckReport {
  worstCaseDrawdown: string;
  drivingIdea: string;
  concentrationRisk: string;
  isBreached: boolean;
  breachRecommendation?: string;
  disclaimer: string;
}

export interface EmailDeliveryStatus {
  sent: boolean;
  recipient: string;
  message: string;
}

export interface GeneratedDigestResponse {
  date?: string;
  summary?: string;
  confidenceScore?: string;
  generatedAt?: string;
  ideas: TradeIdea[];
  riskCheck?: RiskCheckReport;
  emailStatus?: EmailDeliveryStatus;
  unavailableSources?: string[];
  metrics?: {
    callsMadeForDigest: number;
    executionDurationSeconds?: number;
    searchWindow?: string;
    completedWithin2Minutes?: boolean;
  };
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
