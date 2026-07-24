import { Injectable } from '@nestjs/common';
import { MongoSessionService } from './mongo-session.service';
import { createLogger } from '../../common/services/logger.service';

export interface QueueMetricsDocument {
  _id: string; // sessionId
  pendingCount: number;
  processingCount: number;
  failedCount: number;
  avgProcessingTimeMs: number;
  lastQueueRun: Date;
  updatedAt: Date;
}

@Injectable()
export class MetricsService {
  private readonly logger = createLogger('MetricsService');

  constructor(private readonly mongoSessionService: MongoSessionService) {}

  async updateMetrics(
    sessionId: string,
    delta: { pendingDelta?: number; processingDelta?: number; failedDelta?: number },
    processingTimeMs?: number,
  ): Promise<void> {
    const coll = this.mongoSessionService.getCollection<QueueMetricsDocument>('queue_metrics');
    if (!coll) return;

    const now = new Date();
    const incObj: Record<string, number> = {};

    if (delta.pendingDelta) incObj.pendingCount = delta.pendingDelta;
    if (delta.processingDelta) incObj.processingCount = delta.processingDelta;
    if (delta.failedDelta) incObj.failedCount = delta.failedDelta;

    const updateQuery: any = {
      $set: {
        lastQueueRun: now,
        updatedAt: now,
      },
    };

    if (Object.keys(incObj).length > 0) {
      updateQuery.$inc = incObj;
    }

    if (processingTimeMs !== undefined && processingTimeMs > 0) {
      updateQuery.$set.avgProcessingTimeMs = processingTimeMs;
    }

    try {
      await coll.updateOne({ _id: sessionId }, updateQuery, { upsert: true });
    } catch (err) {
      this.logger.warn('Failed to update queue metrics', { error: err instanceof Error ? err.message : String(err) });
    }
  }

  async getMetrics(sessionId = 'default'): Promise<QueueMetricsDocument | null> {
    const coll = this.mongoSessionService.getCollection<QueueMetricsDocument>('queue_metrics');
    if (!coll) return null;
    try {
      return await coll.findOne({ _id: sessionId });
    } catch {
      return null;
    }
  }
}
