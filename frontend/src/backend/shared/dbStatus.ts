import { createServerFn } from "@tanstack/start";

export const getDbStatusFn = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      const { mongoAdapter } = await import('@/backend/shared/database/MongoAdapter');
      // trigger init
      await mongoAdapter.getDbAsync("cluster1");
      return { 
        success: true, 
        lastError: mongoAdapter.lastError,
        clusters: mongoAdapter.getAvailableClusters()
      };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  });
