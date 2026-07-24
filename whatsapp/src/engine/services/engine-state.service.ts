import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { MongoSessionService } from './mongo-session.service';
import { createLogger } from '../../common/services/logger.service';

export interface EngineStateDocument {
  _id: string; // sessionId
  status: string;
  phoneNumber: string | null;
  pushName: string | null;
  lastConnectedAt: Date | null;
  lastProcessedTimestamp: number;
  lastHeartbeat: Date;
  updatedAt: Date;
}

@Injectable()
export class EngineStateService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = createLogger('EngineStateService');
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private currentSessionId = 'default';

  constructor(private readonly mongoSessionService: MongoSessionService) {}

  onModuleInit(): void {
    // Start 30-second heartbeat ping
    this.heartbeatTimer = setInterval(() => {
      void this.pingHeartbeat();
    }, 30000);
  }

  async setState(
    sessionId: string,
    status: string,
    phoneNumber?: string | null,
    pushName?: string | null,
  ): Promise<void> {
    this.currentSessionId = sessionId;
    const coll = this.mongoSessionService.getCollection<EngineStateDocument>('engine_state');
    if (!coll) return;

    const now = new Date();
    const updatePayload: Partial<EngineStateDocument> = {
      status,
      lastHeartbeat: now,
      updatedAt: now,
    };

    if (phoneNumber !== undefined) updatePayload.phoneNumber = phoneNumber;
    if (pushName !== undefined) updatePayload.pushName = pushName;
    if (status === 'READY') updatePayload.lastConnectedAt = now;

    try {
      await coll.updateOne(
        { _id: sessionId },
        {
          $set: updatePayload,
          $setOnInsert: {
            lastProcessedTimestamp: 0,
          },
        },
        { upsert: true },
      );
      this.logger.debug(`[EngineState] Set status for session ${sessionId} to ${status}`);
    } catch (err) {
      this.logger.warn('Failed to update engine state in MongoDB', {
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  async updateLastProcessedTimestamp(sessionId: string, timestamp: number): Promise<void> {
    const coll = this.mongoSessionService.getCollection<EngineStateDocument>('engine_state');
    if (!coll) return;

    try {
      await coll.updateOne(
        { _id: sessionId },
        {
          $set: {
            lastProcessedTimestamp: timestamp,
            updatedAt: new Date(),
          },
        },
        { upsert: true },
      );
    } catch (err) {
      this.logger.warn('Failed to update lastProcessedTimestamp in MongoDB', {
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  async getLastProcessedTimestamp(sessionId: string): Promise<number> {
    const coll = this.mongoSessionService.getCollection<EngineStateDocument>('engine_state');
    if (!coll) return 0;

    try {
      const doc = await coll.findOne({ _id: sessionId });
      return doc?.lastProcessedTimestamp ?? 0;
    } catch {
      return 0;
    }
  }

  async getState(sessionId = 'default'): Promise<EngineStateDocument | null> {
    const coll = this.mongoSessionService.getCollection<EngineStateDocument>('engine_state');
    if (!coll) return null;
    try {
      const doc = await coll.findOne({ _id: sessionId });
      if (doc) {
        // If lastHeartbeat > 90 seconds old, treat status as OFFLINE
        const cutoff = new Date(Date.now() - 90000);
        if (doc.lastHeartbeat && doc.lastHeartbeat < cutoff && doc.status !== 'OFFLINE') {
          doc.status = 'OFFLINE';
        }
      }
      return doc;
    } catch {
      return null;
    }
  }

  private async pingHeartbeat(): Promise<void> {
    const coll = this.mongoSessionService.getCollection<EngineStateDocument>('engine_state');
    if (!coll || !this.currentSessionId) return;

    try {
      await coll.updateOne(
        { _id: this.currentSessionId },
        {
          $set: {
            lastHeartbeat: new Date(),
            updatedAt: new Date(),
          },
        },
        { upsert: true },
      );
    } catch {
      // Ignore heartbeat update drops
    }
  }

  onModuleDestroy(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }
}
