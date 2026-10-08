import { MCP_SERVERS } from './mcpServers.js';
import { listServerTools, isServerConfigured, digestMetrics, ServerHealthResult } from './mcpClient.js';

export interface HealthResponse {
  status: 'ok' | 'degraded' | 'error';
  timestamp: string;
  servers: ServerHealthResult[];
  metrics: {
    totalMcpCalls: number;
    successfulMcpCalls: number;
    failedMcpCalls: number;
  };
}

export async function handleHealthCheck(): Promise<HealthResponse> {
  const results: ServerHealthResult[] = [];

  for (const server of MCP_SERVERS) {
    const configured = isServerConfigured(server);
    let answered = false;
    let status = 'not configured';
    let toolsFound: string[] = [];
    let latencyMs = 0;

    if (configured) {
      const toolCheck = await listServerTools(server);
      answered = toolCheck.answered;
      status = toolCheck.status;
      toolsFound = toolCheck.tools;
      latencyMs = toolCheck.latencyMs;
    }

    results.push({
      id: server.id,
      name: server.name,
      stage: server.stage,
      configured,
      answered,
      status,
      toolsFound,
      latencyMs
    });
  }

  const answeredCount = results.filter((r) => r.answered).length;
  const overallStatus = answeredCount >= 2 ? 'ok' : answeredCount > 0 ? 'degraded' : 'error';

  return {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    servers: results,
    metrics: {
      totalMcpCalls: digestMetrics.totalCalls,
      successfulMcpCalls: digestMetrics.successfulCalls,
      failedMcpCalls: digestMetrics.failedCalls,
    }
  };
}
