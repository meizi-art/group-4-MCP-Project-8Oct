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
 * Call a specific tool on an MCP server.
 */
export async function callServerTool(
  server: McpServerDefinition,
  toolName: string,
  toolArguments: Record<string, any>
): Promise<{ success: boolean; data?: any; error?: string }> {
  digestMetrics.totalCalls += 1;

  if (!isServerConfigured(server)) {
    return { success: false, error: `${server.id} is not configured.` };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(server.url, {
      method: 'POST',
      headers: getAuthHeaders(server),
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: `call-tool-${Date.now()}`,
        method: 'tools/call',
        params: {
          name: toolName,
          arguments: toolArguments
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
    return { success: true, data: data?.result };
  } catch (err: any) {
    digestMetrics.failedCalls += 1;
    return { success: false, error: err?.message || 'Call failed' };
  }
}
