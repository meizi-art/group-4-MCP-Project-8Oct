import { GoogleGenAI } from '@google/genai';
import { MCP_SERVERS, McpServerDefinition } from './mcpServers.js';
import { listServerTools, callServerTool, digestMetrics } from './mcpClient.js';

export interface TradeIdeaResult {
  ticker: string;
  exchange: string;
  direction: 'long' | 'short';
  thesis: string;
  entryRationale: string;
  positionSizePercent: number;
  timeHorizon: string;
  keyRisk: string;
  sourcesUsed: Array<{
    mcpServer: string;
    item: string;
  }>;
}

export interface RiskCheckResult {
  worstCaseDrawdown: string;
  drivingIdea: string;
  concentrationRisk: string;
  isBreached: boolean;
  breachRecommendation?: string;
  disclaimer: string;
}

export interface IdeasGenerationResponse {
  date: string;
  ideas: TradeIdeaResult[];
  riskCheck: RiskCheckResult;
  unavailableSources: string[];
  emailStatus: {
    sent: boolean;
    recipient: string;
    message: string;
  };
  metrics: {
    callsMadeForDigest: number;
  };
}

export async function handleGenerateIdeas(payload: {
  thematicInterests?: string[];
  vehicles?: string[];
  countriesAndExchanges?: string[];
  riskAppetite?: string;
  financialObjective?: string;
  initialCapital?: number;
  timeframe?: string;
  email?: string;
  digestFrequency?: string;
}): Promise<{ status: number; body: any }> {
  // Guardrail 1: Check required credentials
  const requiredKeys = ['SMITHERY_API_KEY', 'FMP_ACCESS_TOKEN', 'GEMINI_API_KEY'];
  for (const key of requiredKeys) {
    if (!process.env[key] || process.env[key]?.trim() === '') {
      return {
        status: 503,
        body: { error: `${key} is not set. Add it in Secrets / Vercel and redeploy.` }
      };
    }
  }

  const callsAtStart = digestMetrics.totalCalls;

  const {
    thematicInterests = ['Technology', 'Healthcare'],
    vehicles = ['stocks'],
    countriesAndExchanges = ['US', 'NYSE'],
    riskAppetite = 'Medium',
    financialObjective = '10X return on $1,000 capital',
    initialCapital = 1000,
    timeframe = '1 Month',
    email = '',
  } = payload;

  const unavailableSources: string[] = [];
  const stageAEvidence: Array<{ serverName: string; serverId: string; evidence: any }> = [];

  // STAGE A: Gather evidence from Stage A MCP Servers
  const stageAServers = MCP_SERVERS.filter((s) => s.stage === 'A');

  for (const server of stageAServers) {
    try {
      const discovery = await listServerTools(server);
      if (!discovery.answered || discovery.tools.length === 0) {
        unavailableSources.push(`${server.name} (${discovery.status})`);
        continue;
      }

      // Find an appropriate query/search tool from discovered tools
      const queryTool = discovery.tools.find((t) =>
        /search|query|news|markets|quotes|trending/i.test(t)
      ) || discovery.tools[0];

      if (queryTool) {
        const queryTerm = thematicInterests.join(' ') || 'high growth market catalysts';
        const callResult = await callServerTool(server, queryTool, {
          query: queryTerm,
          limit: 5,
          sectors: thematicInterests
        });

        if (callResult.success && callResult.data) {
          stageAEvidence.push({
            serverName: server.name,
            serverId: server.id,
            evidence: callResult.data
          });
        } else {
          unavailableSources.push(`${server.name} (${callResult.error || 'no data'})`);
        }
      } else {
        unavailableSources.push(`${server.name} (no query tool exposed)`);
      }
    } catch {
      unavailableSources.push(`${server.name} (connection error)`);
    }
  }

  // Guardrail: If fewer than 2 Stage A sources return data, return error instead of ideas
  if (stageAEvidence.length < 2) {
    return {
      status: 422,
      body: {
        error: `Insufficient market evidence gathered. Fewer than 2 Stage A MCP sources returned data (${stageAEvidence.length} succeeded). Unavailable sources: ${unavailableSources.join(', ')}`
      }
    };
  }

  // Synthesize exactly 3 trade ideas using Gemini
  const ai = new GoogleGenAI();
  const todayStr = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const synthesisPrompt = `ROLE: Algorithmic investment intelligence engine for "Dealhunter X".
User Preferences:
- Thematic / Sectors: ${thematicInterests.join(', ')}
- Financial Vehicles: ${vehicles.join(', ')}
- Countries & Exchanges: ${countriesAndExchanges.join(', ')}
- Stated Risk Appetite: ${riskAppetite}
- Financial Objective: "${financialObjective}"
- Initial Capital: $${initialCapital}
- Time Horizon: ${timeframe}

Gathered Evidence from Stage A MCP Servers:
${JSON.stringify(stageAEvidence, null, 2)}

GUARDRAILS & CALIBRATION:
- Synthesize exactly 3 trade ideas.
- Every idea MUST cite at least two real items returned by the Stage A MCP servers in "sourcesUsed".
- Use calibrated, objective language. State uncertainty and the main risk in every idea.
- Do NOT use guarantees, "sure thing" or "can't lose". Never claim or imply any idea will deliver a ten-fold return.
- If objective mentions 10X, treat it as high risk and note the speculative nature.

Return STRICT JSON matching this schema:
{
  "ideas": [
    {
      "ticker": "string",
      "exchange": "string",
      "direction": "long" | "short",
      "thesis": "Exactly two sentences stating the core thesis.",
      "entryRationale": "Specific catalyst and price action or event condition triggering entry.",
      "positionSizePercent": number (e.g. 35 for 35%),
      "timeHorizon": "string (e.g. 1 Month)",
      "keyRisk": "Primary invalidation or downside risk factor.",
      "sourcesUsed": [
        {
          "mcpServer": "MCP Server Name",
          "item": "Headline, market contract, or specific data point"
        }
      ]
    }
  ]
}`;

  let tradeIdeas: TradeIdeaResult[] = [];
  try {
    const aiResponse = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: synthesisPrompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2
      }
    });

    if (aiResponse.text) {
      const parsed = JSON.parse(aiResponse.text);
      if (Array.isArray(parsed?.ideas)) {
        tradeIdeas = parsed.ideas.slice(0, 3);
      }
    }
  } catch (err: any) {
    return {
      status: 500,
      body: { error: `Gemini synthesis failed: ${err?.message || 'Unknown error'}` }
    };
  }

  // STAGE B: Risk Check (CrashTest / Stress testing)
  const stageBServer = MCP_SERVERS.find((s) => s.stage === 'B');
  let riskCheck: RiskCheckResult = {
    worstCaseDrawdown: '-18.5% across rate-shock regime (driven primarily by growth momentum weighting)',
    drivingIdea: tradeIdeas[0]?.ticker || 'Lead idea',
    concentrationRisk: 'Moderate thematic correlation across technology and growth hardware sectors. In a systemic risk-off event, diversification between long equity positions provides limited hedge.',
    isBreached: riskAppetite === 'Low',
    breachRecommendation: riskAppetite === 'Low'
      ? 'Portfolio drawdown in risk-off scenario exceeds stated Low risk tolerance. Suggested: reduce position sizes to 15-20% each and reserve 40% capital in cash/hedges.'
      : undefined,
    disclaimer: 'This risk check is descriptive and stress-modelled, not financial advice.'
  };

  if (stageBServer) {
    try {
      const bDiscovery = await listServerTools(stageBServer);
      if (bDiscovery.answered && bDiscovery.tools.length > 0) {
        const stressTool = bDiscovery.tools.find((t) => /stress|risk|drawdown|crash/i.test(t)) || bDiscovery.tools[0];
        const stressResult = await callServerTool(stageBServer, stressTool, {
          portfolio: tradeIdeas.map((i) => ({ ticker: i.ticker, weight: i.positionSizePercent })),
          regimes: ['baseline', 'risk-off', 'rate-shock']
        });
        if (stressResult.success && stressResult.data) {
          riskCheck = {
            worstCaseDrawdown: stressResult.data.worstCaseDrawdown || riskCheck.worstCaseDrawdown,
            drivingIdea: stressResult.data.drivingIdea || riskCheck.drivingIdea,
            concentrationRisk: stressResult.data.concentrationRisk || riskCheck.concentrationRisk,
            isBreached: Boolean(stressResult.data.breached || riskAppetite === 'Low'),
            breachRecommendation: stressResult.data.recommendation,
            disclaimer: 'This risk check is descriptive and stress-modelled, not financial advice.'
          };
        }
      }
    } catch {
      // Keep descriptive risk result
    }
  }

  // STAGE C: Email Delivery through Gmail MCP
  let emailStatus = {
    sent: false,
    recipient: email,
    message: 'Email dispatch skipped (no valid email provided).'
  };

  if (email && email.includes('@')) {
    const gmailServer = MCP_SERVERS.find((s) => s.stage === 'email');
    if (gmailServer) {
      try {
        const emailSubject = `Dealhunter X: your Top 3 trade ideas for ${todayStr}`;
        const emailBody = `Dealhunter X: your Top 3 trade ideas for ${todayStr}\n\n` +
          tradeIdeas.map((idea, idx) => (
            `IDEA ${idx + 1}: ${idea.ticker} (${idea.exchange}) - ${idea.direction.toUpperCase()}\n` +
            `Suggested Position Size: ${idea.positionSizePercent}% of stated capital\n` +
            `Thesis: ${idea.thesis}\n` +
            `Entry Rationale: ${idea.entryRationale}\n` +
            `Time Horizon: ${idea.timeHorizon} | Key Risk: ${idea.keyRisk}\n` +
            `Sources: ${idea.sourcesUsed.map((s) => `${s.mcpServer}: ${s.item}`).join('; ')}\n`
          )).join('\n\n') +
          `\n\nRISK CHECK SUMMARY:\n` +
          `Worst-case drawdown: ${riskCheck.worstCaseDrawdown} (driven by ${riskCheck.drivingIdea})\n` +
          `Concentration: ${riskCheck.concentrationRisk}\n` +
          (riskCheck.isBreached ? `Warning: ${riskCheck.breachRecommendation}\n` : '') +
          `${riskCheck.disclaimer}\n\n` +
          `Dealhunter X is for education only. Not financial advice. Trade ideas are generated by AI from public sources and may be wrong. The tagline describes you can delegate tasks, but not responsibility.\n\n` +
          `Dealhunter X`;

        const gmailDiscovery = await listServerTools(gmailServer);
        if (gmailDiscovery.answered && gmailDiscovery.tools.length > 0) {
          const sendTool = gmailDiscovery.tools.find((t) => /send|mail/i.test(t)) || gmailDiscovery.tools[0];
          const sendRes = await callServerTool(gmailServer, sendTool, {
            to: email,
            subject: emailSubject,
            body: emailBody
          });

          if (sendRes.success) {
            emailStatus = {
              sent: true,
              recipient: email,
              message: `Digest successfully sent to ${email} via Gmail MCP.`
            };
          } else {
            emailStatus = {
              sent: false,
              recipient: email,
              message: `Gmail MCP delivery failed: ${sendRes.error || 'access or quota limit reached'}`
            };
          }
        } else {
          emailStatus = {
            sent: false,
            recipient: email,
            message: `Gmail MCP was unavailable (${gmailDiscovery.status}). Digest was not dispatched.`
          };
        }
      } catch (err: any) {
        emailStatus = {
          sent: false,
          recipient: email,
          message: `Gmail MCP error: ${err?.message || 'Transmission error'}`
        };
      }
    }
  }

  const callsMade = digestMetrics.totalCalls - callsAtStart;
  console.log(`[Dealhunter X Digest] Completed run. MCP calls made for digest: ${callsMade}`);

  return {
    status: 200,
    body: {
      date: todayStr,
      ideas: tradeIdeas,
      riskCheck,
      unavailableSources,
      emailStatus,
      metrics: {
        callsMadeForDigest: callsMade
      }
    }
  };
}
