import { createAPIFileRoute } from '@tanstack/start/api';
import { mongoAdapter } from '@/backend/shared/database/MongoAdapter';

export const APIRoute = createAPIFileRoute('/api/dbstatus')({
  GET: async () => {
    try {
      await mongoAdapter.getDbAsync("cluster1");
      return new Response(JSON.stringify({
        success: true,
        lastError: mongoAdapter.lastError,
        clusters: mongoAdapter.getAvailableClusters()
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (e: any) {
      return new Response(JSON.stringify({ success: false, error: e.message }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
  },
});
