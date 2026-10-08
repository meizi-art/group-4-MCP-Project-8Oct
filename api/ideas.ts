import type { IncomingMessage, ServerResponse } from 'http';
import { handleGenerateIdeas } from '../lib/ideasHandler.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const result = await handleGenerateIdeas(payload);
    return res.status(result.status).json(result.body);
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || 'Internal Server Error' });
  }
}
