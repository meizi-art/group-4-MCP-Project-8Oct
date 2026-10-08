export interface McpServerDefinition {
  name: string;
  id: string;
  url: string;
  authType: 'smithery' | 'fmp' | 'none';
  stage: 'A' | 'B' | 'email';
  description: string;
}

export const MCP_SERVERS: McpServerDefinition[] = [
  {
    name: 'Google News',
    id: 'news',
    url: 'https://mcp.smithery.ai/elizabethytan/google/news',
    authType: 'smithery',
    stage: 'A',
    description: 'Breaking market catalysts and headlines via Google News'
  },
  {
    name: 'Polymarket',
    id: 'polymarket',
    url: 'https://mcp.smithery.ai/elizabethytan/icappaci/polymarket-mcp',
    authType: 'smithery',
    stage: 'A',
    description: 'Real-time prediction market probability contracts and crowd odds'
  },
  {
    name: 'Reddit',
    id: 'reddit',
    url: 'https://mcp.smithery.ai/elizabethytan/@Hawstein/mcp-server-reddit',
    authType: 'smithery',
    stage: 'A',
    description: 'Retail trading community sentiment and mention velocity'
  },
  {
    name: 'Social Superpowers',
    id: 'social',
    url: 'https://social-superpowers.mcp.run/mcp',
    authType: 'none',
    stage: 'A',
    description: 'Cross-platform social media trends and viral velocity signals'
  },
  {
    name: 'Financial Modeling Prep',
    id: 'fmp',
    url: 'https://mcp.smithery.ai/elizabethytan/@imbenrabi/financial-modeling-prep-mcp-server',
    authType: 'fmp',
    stage: 'A',
    description: 'Fundamental financial metrics, real-time price quotes, and SEC filings'
  },
  {
    name: 'Finance MCP',
    id: 'finance',
    url: 'https://mcp.smithery.ai/elizabethytan/finance-mcp',
    authType: 'smithery',
    stage: 'A',
    description: 'Stocks, crypto, FX, and portfolio math calculations'
  },
  {
    name: 'Naver Search',
    id: 'naver',
    url: 'https://mcp.smithery.ai/elizabethytan/naver-search',
    authType: 'smithery',
    stage: 'A',
    description: 'Asian and Korean market news, trends, and corporate filings'
  },
  {
    name: 'CrashTestYourStrategy',
    id: 'crashtest',
    url: 'https://crashtest.mcp.run/mcp',
    authType: 'none',
    stage: 'B',
    description: 'Multi-regime stress testing (baseline, risk-off, rate-shock drawdown)'
  },
  {
    name: 'Gmail',
    id: 'gmail',
    url: 'https://mcp.smithery.ai/elizabethytan/gmail',
    authType: 'smithery',
    stage: 'email',
    description: 'Dispatch trade idea digests directly to user inbox'
  }
];
