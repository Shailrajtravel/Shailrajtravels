import { Injectable } from '@nestjs/common';
import { MongoSessionService } from './mongo-session.service';
import { createLogger } from '../../common/services/logger.service';
import * as os from 'os';

export interface QueueLockDocument {
  _id: string;
  owner: string;
  acquiredAt: Date;
  expiresAt: Date;
}

@Injectable()
export class DistributedLockService {
  private readonly logger = createLogger('DistributedLockService');
  public readonly instanceId: string;

  constructor(private readonly mongoSessionService: MongoSessionService) {
    this.instanceId = `${os.hostname()}_${process.pid}_${Math.random().toString(36).substring(2, 7)}`;
  }

  /**
   * Atomic Lease Acquisition via findOneAndUpdate.
   * Succeeds only if:
   * 1. The lock document does not exist,
   * 2. The lease has expired (expiresAt < now), or
   * 3. The current owner is renewing its own active lease.
   */
  async tryAcquireLease(sessionId: string, ttlMs = 30000): Promise<boolean> {
    const coll = this.mongoSessionService.getCollection<QueueLockDocument>('queue_lock');
    if (!coll) {
      // Memory fallback mode if MongoDB is not used
      return true;
    }

    const lockKey = `queue_processor_${sessionId}`;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + ttlMs);

    try {
      const result = await coll.findOneAndUpdate(
        {
          _id: lockKey,
          $or: [
            { expiresAt: { $lt: now } },
            { owner: this.instanceId }
          ]
        },
        {
          $set: {
            owner: this.instanceId,
            acquiredAt: now,
            expiresAt
          }
        },
        { upsert: true, returnDocument: 'after' }
      );

      const acquired = result?.owner === this.instanceId;
      if (acquired) {
        this.logger.debug(`[DistributedLock] Granted lease to ${this.instanceId} for session ${sessionId}`);
      }
      return acquired;
    } catch (err) {
      // Duplicate key race condition during upsert means another instance won the lease
      this.logger.debug(`[DistributedLock] Lease acquisition race lost for session ${sessionId}`);
      return false;
    }
  }

  async releaseLease(sessionId: string): Promise<void> {
    const coll = this.mongoSessionService.getCollection<QueueLockDocument>('queue_lock');
    if (!coll) return;

    const lockKey = `queue_processor_${sessionId}`;
    try {
      await coll.deleteOne({ _id: lockKey, owner: this.instanceId });
      this.logger.log(`[DistributedLock] Released lease for ${this.instanceId} on session ${sessionId}`);
    } catch (err) {
      this.logger.warn('Failed to release lease on shutdown', { error: err instanceof Error ? err.message : String(err) });
    }
  }
}
