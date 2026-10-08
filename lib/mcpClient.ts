import { MCP_SERVERS, McpServerDefinition } from './mcpServers.js';

export interface ServerHealthResult {
  id: string;
  name: string;
  stage: 'A' | 'B' | 'email';
  configured: boolean;
  answered: boolean;
  status: string;
  toolsFound: string[];
  latencyMs?: number;
}

export interface McpCallMetrics {
  totalCalls: number;
  successfulCalls: number;
  failedCalls: number;
}

// Global metrics tracker for cost/usage estimation
export const digestMetrics: McpCallMetrics = {
  totalCalls: 0,
  successfulCalls: 0,
  failedCalls: 0,
};

function getAuthHeaders(server: McpServerDefinition): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json, text/event-stream'
  };

  if (server.authType === 'smithery' && process.env.SMITHERY_API_KEY) {
    headers['Authorization'] = `Bearer ${process.env.SMITHERY_API_KEY}`;
    headers['X-Smithery-Key'] = process.env.SMITHERY_API_KEY;
  } else if (server.authType === 'fmp' && process.env.FMP_ACCESS_TOKEN) {
    headers['apikey'] = process.env.FMP_ACCESS_TOKEN;
    headers['X-FMP-Token'] = process.env.FMP_ACCESS_TOKEN;
  }

  return headers;
}

export function isServerConfigured(server: McpServerDefinition): boolean {
  if (server.authType === 'smithery') {
    return Boolean(process.env.SMITHERY_API_KEY && process.env.SMITHERY_API_KEY.trim() !== '');
  }
  if (server.authType === 'fmp') {
    return Boolean(process.env.FMP_ACCESS_TOKEN && process.env.FMP_ACCESS_TOKEN.trim() !== '');
  }
  return true;
}

/**
 * List tools from an MCP server at runtime.
 * Never logs credentials.
 */
export async function listServerTools(server: McpServerDefinition): Promise<{
  answered: boolean;
  status: string;
  tools: string[];
  latencyMs: number;
}> {
  const startTime = Date.now();
  digestMetrics.totalCalls += 1;

  if (!isServerConfigured(server)) {
    return {
      answered: false,
      status: 'not configured',
      tools: [],
      latencyMs: 0
    };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    // Send JSON-RPC tools/list request to the server endpoint
    const response = await fetch(server.url, {
      method: 'POST',
      headers: getAuthHeaders(server),
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: `list-tools-${Date.now()}`,
        method: 'tools/list',
        params: {}
      }),
      signal: controller.signal
    });

    clearTimeout(timeout);
    const latencyMs = Date.now() - startTime;

    if ([401, 402, 403, 429].includes(response.status)) {
      digestMetrics.failedCalls += 1;
      return {
        answered: false,
        status: `${server.id}: access or quota limit reached`,
        tools: [],
        latencyMs
      };
    }

    if (!response.ok) {
      digestMetrics.failedCalls += 1;
      return {
        answered: false,
        status: `HTTP ${response.status}`,
        tools: [],
        latencyMs
      };
    }

    const data = await response.json();
    digestMetrics.successfulCalls += 1;

    const toolNames: string[] = [];
    if (data?.result?.tools && Array.isArray(data.result.tools)) {
      data.result.tools.forEach((t: any) => {
        if (t?.name) toolNames.push(t.name);
      });
    }

    // Log tool names found (never credentials)
    console.log(`[MCP ${server.name}] Tools discovered (${toolNames.length}):`, toolNames.join(', '));

    return {
      answered: true,
      status: 'healthy',
      tools: toolNames,
      latencyMs
    };
  } catch (error: any) {
    const latencyMs = Date.now() - startTime;
    digestMetrics.failedCalls += 1;

    const isAbort = error?.name === 'AbortError';
    return {
      answered: false,
      status: isAbort ? 'timeout (>4s)' : 'unreachable',
      tools: [],
      latencyMs
    };
  }
}

/**
 * Prunes and caps MCP response data to prevent pulling too much information.
 * Enforces top 100 searches/results and compact representation.
 */
export function pruneMcpData(raw: any, maxItems: number = 100): any {
  if (!raw) return raw;

  // If array, cap to top 100 searches
  if (Array.isArray(raw)) {
    return raw.slice(0, maxItems).map((item) => pruneMcpData(item, maxItems));
  }

  // If string, cap to 400 characters to prevent huge body dumps
  if (typeof raw === 'string') {
    return raw.length > 400 ? raw.substring(0, 400) + '...' : raw;
  }

  // If object, extract content / items and prune fields
  if (typeof raw === 'object') {
    if (Array.isArray(raw.content)) {
      return {
        ...raw,
        content: raw.content.slice(0, maxItems).map((c: any) => pruneMcpData(c, maxItems))
      };
    }
    if (Array.isArray(raw.items)) {
      return {
        ...raw,
        items: raw.items.slice(0, maxItems).map((it: any) => pruneMcpData(it, maxItems))
      };
    }
    if (Array.isArray(raw.articles)) {
      return {
        ...raw,
        articles: raw.articles.slice(0, maxItems).map((a: any) => pruneMcpData(a, maxItems))
      };
    }
    if (Array.isArray(raw.results)) {
      return {
        ...raw,
        results: raw.results.slice(0, maxItems).map((r: any) => pruneMcpData(r, maxItems))
      };
    }

    const compact: Record<string, any> = {};
    const keys = Object.keys(raw).slice(0, 30); // max 30 keys
    for (const key of keys) {
      // Omit huge raw payloads
      if (/raw|html|buffer|stream|payload/i.test(key) && typeof raw[key] === 'string' && raw[key].length > 500) {
        compact[key] = raw[key].substring(0, 200) + '... (truncated)';
      } else {
        compact[key] = pruneMcpData(raw[key], maxItems);
      }
    }
    return compact;
  }

  return raw;
}

/**
 * Call a specific tool on an MCP server with 1-hour window and top 100 limit.
 */
export async function callServerTool(
  server: McpServerDefinition,
  toolName: string,
  toolArguments: Record<string, any>,
  timeoutMs: number = 6000
): Promise<{ success: boolean; data?: any; error?: string }> {
  digestMetrics.totalCalls += 1;

  if (!isServerConfigured(server)) {
    return { success: false, error: `${server.id} is not configured.` };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), Math.min(timeoutMs, 10000));

    // Limit knowledge search to past 1 hour and top 100 items
    const oneHourAgoIso = new Date(Date.now() - 3600 * 1000).toISOString();
    const oneHourAgoUnix = Math.floor((Date.now() - 3600 * 1000) / 1000);

    const boundedArguments: Record<string, any> = {
      ...toolArguments,
      limit: Math.min(Number(toolArguments.limit) || 100, 100),
      maxResults: Math.min(Number(toolArguments.maxResults) || 100, 100),
      top: Math.min(Number(toolArguments.top) || 100, 100),
      timeframe: toolArguments.timeframe || '1h',
      timeFilter: toolArguments.timeFilter || '1h',
      publishedAfter: toolArguments.publishedAfter || oneHourAgoIso,
      since: toolArguments.since || oneHourAgoUnix,
    };

    const response = await fetch(server.url, {
      method: 'POST',
      headers: getAuthHeaders(server),
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: `call-tool-${Date.now()}`,
        method: 'tools/call',
        params: {
          name: toolName,
          arguments: boundedArguments
        }
      }),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if ([401, 402, 403, 429].includes(response.status)) {
      digestMetrics.failedCalls += 1;
      return {
        success: false,
        error: `${server.id}: access or quota limit reached`
      };
    }

    if (!response.ok) {
      digestMetrics.failedCalls += 1;
      return { success: false, error: `HTTP ${response.status}` };
    }

    const data = await response.json();
    digestMetrics.successfulCalls += 1;

    // Prune data to top 100 and compact representations
    const pruned = pruneMcpData(data?.result, 100);
    return { success: true, data: pruned };
  } catch (err: any) {
    digestMetrics.failedCalls += 1;
    return { success: false, error: err?.message || 'Call failed' };
  }
}
