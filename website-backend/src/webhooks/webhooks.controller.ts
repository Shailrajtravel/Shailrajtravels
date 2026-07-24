import { Controller, Post, Body, Get, Logger } from '@nestjs/common';
import { storageManager } from '../database/StorageManager';

@Controller()
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  @Post(['webhooks', 'api/webhooks'])
  async handleWebhook(@Body() payload: any) {
    this.logger.log(`Received Webhook Event: ${payload?.event || 'unknown'}`, JSON.stringify(payload));
    
    // Asynchronously log incoming webhook event to MongoDB for audit
    setImmediate(async () => {
      try {
        const col = await storageManager.getGlobalCollection('openwa_received_webhooks');
        await col.insertOne({
          event: payload?.event || 'unknown',
          sessionId: payload?.sessionId || 'default',
          data: payload?.data || payload,
          receivedAt: new Date().toISOString(),
        });
      } catch (e: any) {
        this.logger.warn(`Failed to log webhook event to MongoDB: ${e.message}`);
      }
    });

    return { status: 'success', received: true };
  }

  @Get(['webhooks', 'api/webhooks'])
  async getRecentWebhooks() {
    try {
      const col = await storageManager.getGlobalCollection('openwa_received_webhooks');
      const recent = await col.find({}).sort({ receivedAt: -1 }).limit(50).toArray();
      return { success: true, count: recent.length, logs: recent };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }
}
