import { handleHealthCheck } from '../lib/healthHandler.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const health = await handleHealthCheck();
    return res.status(health.status === 'error' ? 503 : 200).json(health);
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || 'Health check error' });
  }
}
